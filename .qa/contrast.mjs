/* Hero text contrast over the moving film.
 *
 * The hero runs live footage behind live text, so a static contrast check is
 * meaningless: the worst case is the brightest frame of the loop, not the
 * poster. This samples the *composited* page (film + scrim + gradients) behind
 * each block of hero copy at intervals across the loop, takes the brightest
 * tenth of those pixels, and scores the real WCAG ratio against the text colour.
 *
 *   node .qa/contrast.mjs                                  # desktop, local
 *   QA_W=390 QA_H=844 node .qa/contrast.mjs                # phone
 *   QA_BASE=https://your-preview.vercel.app node .qa/contrast.mjs
 *
 * Exits non-zero if anything drops below AA. If you lighten the scrim in
 * styles.css, or change a hero text colour, re-run this on BOTH viewports.
 *
 * NOTE ON METHOD: it samples while the film PLAYS. Pausing and setting
 * currentTime does not work here — Chrome leaves the element on frame 0 and
 * every sample comes back identical and dark, which makes the numbers look
 * far better than they are. Do not "optimise" this into a seek loop.
 */

import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://127.0.0.1:8777';
const VW = Number(process.env.QA_W || 1440);
const VH = Number(process.env.QA_H || 900);
const SAMPLES = Number(process.env.QA_SAMPLES || 12);   // spread across the ~10.5s loop
const GAP_MS = 950;

// Foreground colours as the hero actually paints them, black-and-gold theme.
// Keep these in step with styles.css: heading #FAF6E8, lede #F0E4C3,
// hero__sub / tooltip --silt-light #C9C4B5, h1 turn line --gold-bright #EFC75E.
const FG = {
  paper:  [0xFA, 0xF6, 0xE8],
  lede:   [0xF0, 0xE4, 0xC3],
  silt:   [0xC9, 0xC4, 0xB5],
  gold:   [0xEF, 0xC7, 0x5E],
};

const BLOCKS = {
  'h1':             { sel: '.hero h1',                            fg: ['paper', 'gold'], need: 3.0 },
  'lede left':      { sel: '.hero__lede:not(.hero__lede--rule)',  fg: ['lede'],          need: 4.5 },
  'lede right':     { sel: '.hero__lede--rule',                   fg: ['lede'],          need: 4.5 },
  'sub-line':       { sel: '.hero__sub',                          fg: ['silt'],          need: 4.5 },
};
// The footage credit used to sit directly on the film and needed the dynamic
// sample below. It is now a hover/focus tooltip on the pause button with its
// own near-opaque backing (rgba(10,12,17,.95)) — it never reads against raw
// video, so it is checked statically in the WCAG_STATIC block instead.
const WCAG_STATIC = [
  { name: 'footage credit tooltip', fg: [0xC9, 0xC4, 0xB5], bg: [0x0A, 0x0C, 0x11], need: 4.5 },
];

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForTimeout(1500);

const filmSrc = await page.evaluate(() => {
  const v = document.getElementById('heroFilm');
  return v ? (v.currentSrc || v.src || '') : '';
});
if (!filmSrc) {
  console.log('No film loaded (reduced motion or Save-Data). Nothing to measure.');
  await browser.close();
  process.exit(0);
}

// measure geometry once, then hide the copy so we sample only what sits behind it
const rects = await page.evaluate(sel => {
  const out = {};
  for (const [k, s] of Object.entries(sel)) {
    const e = document.querySelector(s);
    if (!e) continue;
    const r = e.getBoundingClientRect();
    out[k] = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  }
  return out;
}, Object.fromEntries(Object.entries(BLOCKS).map(([k, v]) => [k, v.sel])));

await page.addStyleTag({ content: '.hero__body{visibility:hidden !important}' });
await page.evaluate(() => { const v = document.getElementById('heroFilm'); v.currentTime = 0; v.play(); });

const worst = {};
let seen = 0;
for (let i = 0; i < SAMPLES; i++) {
  await page.waitForTimeout(GAP_MS);
  const at = await page.evaluate(() => +document.getElementById('heroFilm').currentTime.toFixed(2));
  const png = (await page.screenshot({ clip: { x: 0, y: 0, width: VW, height: VH } })).toString('base64');

  const samples = await page.evaluate(async ({ png, rects }) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + png;
    await img.decode();
    const out = {};
    for (const [k, [x, y, w, h]] of Object.entries(rects)) {
      if (w <= 0 || h <= 0 || y >= img.height) continue;
      const hh = Math.min(h, img.height - y);
      const c = document.createElement('canvas');
      c.width = 40; c.height = 12;
      const g = c.getContext('2d');
      g.drawImage(img, x, y, w, hh, 0, 0, 40, 12);
      const d = g.getImageData(0, 0, 40, 12).data;
      const px = [];
      for (let j = 0; j < d.length; j += 4) px.push([d[j], d[j + 1], d[j + 2]]);
      out[k] = px;
    }
    return out;
  }, { png, rects });

  seen++;
  for (const [name, px] of Object.entries(samples)) {
    const lums = px.map(lum).sort((a, b) => a - b);
    const cut = Math.floor(lums.length * 0.9);
    const bright = lums.slice(cut).reduce((a, b) => a + b, 0) / Math.max(1, lums.length - cut);
    const r = Math.min(...BLOCKS[name].fg.map(k => ratio(lum(FG[k]), bright)));
    if (!(name in worst) || r < worst[name][0]) worst[name] = [r, at];
  }
}
await browser.close();

console.log(`Hero contrast over the film — ${VW}x${VH} — worst of ${seen} samples across the loop`);
console.log(`film: ${filmSrc.split('/').pop()}\n`);
let failed = 0;
for (const [name, [r, at]] of Object.entries(worst)) {
  const need = BLOCKS[name].need;
  const ok = r >= need;
  if (!ok) failed++;
  console.log(`  ${name.padEnd(16)}${r.toFixed(2).padStart(7)}   needs ${need.toFixed(1)}   ${ok ? 'PASS' : 'FAIL'}   (worst at ${at}s)`);
}

for (const { name, fg, bg, need } of WCAG_STATIC) {
  const r = ratio(lum(fg), lum(bg));
  const ok = r >= need;
  if (!ok) failed++;
  console.log(`  ${name.padEnd(24)}${r.toFixed(2).padStart(7)}   needs ${need.toFixed(1)}   ${ok ? 'PASS' : 'FAIL'}   (static — own opaque backing, not sampled from film)`);
}

console.log(failed ? `\n${failed} block(s) below AA — darken the scrim in .hero__veil and re-run.` : '\nAll blocks clear AA.');
process.exitCode = failed ? 1 : 0;
