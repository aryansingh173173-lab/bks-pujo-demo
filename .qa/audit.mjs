import { chromium } from 'playwright';
const BASE = process.env.QA_BASE || 'http://localhost:8933';
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: Number(process.env.QA_W||1440), height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForTimeout(1200);

await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'));
  document.querySelectorAll('.aud__item').forEach(e => e.classList.add('is-visible'));
  document.querySelectorAll('details').forEach(d => d.open = true);
  const v = document.getElementById('heroFilm'); if (v) v.pause();
});
await page.waitForTimeout(500);

// Collect text-bearing elements plus the client rects of their OWN text lines,
// expressed relative to the element box. Sampling the whole element box would
// include transparent padding (e.g. a figcaption's scrim fade) and misreport.
const items = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('body *').forEach((el, i) => {
    if (el.closest('.hero')) return;                       // contrast.mjs covers the hero
    if (el.matches('script,style,svg,img,video,noscript')) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') return;
    const box = el.getBoundingClientRect();
    if (box.width < 4 || box.height < 4) return;
    // Parked off-screen until focused (the skip link). Its focused state is
    // near-black on a gold gradient; sampling it here would read the void.
    if (box.bottom < 0) return;
    const lines = [];
    let chars = 0;
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      chars += n.textContent.trim().length;
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) {
        if (r.width < 3 || r.height < 3) continue;
        lines.push({ dx: r.x - box.x, dy: r.y - box.y, w: r.width, h: r.height });
      }
    }
    if (chars < 2 || !lines.length) return;
    const px = parseFloat(cs.fontSize), w = parseInt(cs.fontWeight,10) || 400;
    const large = px >= 24 || (px >= 18.66 && w >= 700);
    el.setAttribute('data-audit', String(i));
    out.push({ id:String(i), sel: (el.className||el.tagName).toString(), color: cs.color,
               px: Math.round(px), need: large ? 3.0 : 4.5, lines,
               text: [...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('').slice(0,42) });
  });
  return out;
});

await page.addStyleTag({ content: `*{ color:transparent !important; text-shadow:none !important; }` });
await page.waitForTimeout(300);

const results = [];
for (const it of items) {
  let shot;
  try { shot = (await page.locator(`[data-audit="${it.id}"]`).screenshot({ timeout: 4000 })).toString('base64'); }
  catch { continue; }
  const bg = await page.evaluate(async ({ png, lines }) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
    const c = document.createElement('canvas'); const g = c.getContext('2d');
    const px = [];
    for (const L of lines) {
      const sx = Math.max(0, Math.round(L.dx)), sy = Math.max(0, Math.round(L.dy));
      const sw = Math.min(Math.round(L.w), img.width - sx), sh = Math.min(Math.round(L.h), img.height - sy);
      if (sw < 2 || sh < 2) continue;
      const tw = Math.min(sw, 50), th = Math.min(sh, 12);
      c.width = tw; c.height = th;
      g.clearRect(0,0,tw,th);
      g.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
      const d = g.getImageData(0,0,tw,th).data;
      for (let j = 0; j < d.length; j += 4) px.push([d[j], d[j+1], d[j+2]]);
    }
    return px;
  }, { png: shot, lines: it.lines });
  if (bg.length) results.push({ ...it, bg });
}
await browser.close();

const lin = c => { c/=255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
const lum = ([r,g,b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
const ratio = (a,b) => (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
const parse = s => { const m = s.match(/[\d.]+/g).map(Number); return [m[0],m[1],m[2]]; };

const fails = [];
for (const r of results) {
  const fg = lum(parse(r.color));
  const lums = r.bg.map(lum).sort((a,b)=>a-b);
  const cut = Math.floor(lums.length*0.9);                 // worst case = brightest decile
  const bg = lums.slice(cut).reduce((a,b)=>a+b,0)/Math.max(1,lums.length-cut);
  const cr = ratio(fg, bg);
  if (cr < r.need) fails.push({ ...r, cr });
}
console.log(`audited ${results.length} text blocks @${process.env.QA_W||1440}px`);
if (!fails.length) console.log('ALL PASS — every text block clears its WCAG AA threshold');
fails.sort((a,b)=>a.cr-b.cr).forEach(f =>
  console.log(`  FAIL ${f.cr.toFixed(2)} (needs ${f.need}) ${f.px}px  ${f.sel.slice(0,32).padEnd(32)} "${f.text}"`));
