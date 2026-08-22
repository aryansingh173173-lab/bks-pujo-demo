import { chromium } from 'file:///C:/Users/shobh/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const BASE = process.env.QA_BASE || 'http://127.0.0.1:8777';
const OUT = process.env.QA_OUT || 'C:/Users/shobh/AppData/Local/Temp/claude/C--Users-shobh/e136dc87-702a-4827-abd0-77c358cf976b/scratchpad/qa';
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const pass = (n, d = '') => { results.push(['PASS', n, d]); console.log(`PASS  ${n}${d ? ' — ' + d : ''}`); };
const fail = (n, d = '') => { results.push(['FAIL', n, d]); console.log(`FAIL  ${n}${d ? ' — ' + d : ''}`); };

const browser = await chromium.launch({ channel: 'chrome' });

/* ---------- 1. responsive: no horizontal overflow ---------- */
for (const [w, h] of [[320, 800], [375, 812], [390, 844], [768, 1024], [1024, 768], [1440, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    heroH: document.querySelector('.hero').getBoundingClientRect().height,
    factbarTop: document.querySelector('.fact-bar').getBoundingClientRect().top,
    ctaTop: document.querySelector('.hero__actions').getBoundingClientRect().top,
  }));
  const over = m.scrollW - m.innerW;
  if (over <= 1) pass(`no h-overflow @${w}`, `scrollW ${m.scrollW} vs ${m.innerW}`);
  else fail(`h-overflow @${w}`, `overflows by ${over}px`);
  console.log(`      hero height ${Math.round(m.heroH)}px · CTA top ${Math.round(m.ctaTop)} · factbar top ${Math.round(m.factbarTop)} (viewport ${h})`);
  await page.screenshot({ path: path.join(OUT, `pw_hero_${w}.png`) });
  await ctx.close();
}

/* ---------- 2. network purity + console ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const reqs = [];
  const errs = [];
  page.on('request', r => reqs.push(r.url()));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const foreign = reqs.filter(u => !u.startsWith(BASE) && !/fonts\.(googleapis|gstatic)\.com/.test(u));
  if (!foreign.length) pass('no foreign network requests', `${reqs.length} total, fonts + own origin only`);
  else fail('foreign requests', foreign.join(', '));
  if (!errs.length) pass('no console errors');
  else fail('console errors', errs.join(' | '));

  const vid = await page.evaluate(() => {
    const v = document.getElementById('heroFilm');
    return { src: v.currentSrc || v.src, paused: v.paused, muted: v.muted, loop: v.loop,
             toggleHidden: document.getElementById('filmToggle').hidden };
  });
  if (vid.src && !vid.paused && vid.muted && vid.loop) pass('hero film autoplays muted+looping', vid.src.split('/').pop());
  else fail('hero film state', JSON.stringify(vid));
  if (!vid.toggleHidden) pass('pause control exposed (WCAG 2.2.2)');
  else fail('pause control hidden while film plays');

  // pause control works
  await page.click('#filmToggle');
  const afterPause = await page.evaluate(() => ({ paused: document.getElementById('heroFilm').paused, label: document.getElementById('filmToggle').textContent }));
  if (afterPause.paused && /play/i.test(afterPause.label)) pass('pause control stops the film', afterPause.label);
  else fail('pause control', JSON.stringify(afterPause));
  await ctx.close();
}

/* ---------- 3. reduced motion: no film loaded ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const media = [];
  page.on('request', r => { if (r.resourceType() === 'media' || /\.mp4/.test(r.url())) media.push(r.url()); });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  if (!media.length) pass('prefers-reduced-motion: film never requested');
  else fail('reduced motion still loads film', media.join(', '));
  const revealed = await page.evaluate(() => {
    const all = [...document.querySelectorAll('.reveal')];
    return all.length && all.every(e => getComputedStyle(e).opacity === '1');
  });
  if (revealed) pass('reduced motion: all sections visible');
  else fail('reduced motion: hidden sections remain');
  await page.screenshot({ path: path.join(OUT, 'pw_reducedmotion.png'), fullPage: false });
  await ctx.close();
}

/* ---------- 4. form behaviour ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });

  // 4a empty
  await page.click('#downloadBtn');
  let s = await page.textContent('#status');
  if (/Add your organisation, your name and your email/.test(s)) pass('empty form → error', s.slice(0, 48) + '…');
  else fail('empty form message', s);

  // 4b bad email
  await page.fill('#org', '  Acme Agri Ltd  ');
  await page.fill('#name', '  Rina Sen  ');
  await page.fill('#email', 'rina-at-acme');
  await page.click('#downloadBtn');
  s = await page.textContent('#status');
  if (/needs an @ and a domain/.test(s)) pass('bad email → error');
  else fail('bad email message', s);

  // 4c consent unticked
  await page.fill('#email', ' rina@acme-agri.in ');
  await page.click('#downloadBtn');
  s = await page.textContent('#status');
  if (/Tick the box/.test(s)) pass('consent unticked → error');
  else fail('consent message', s);

  // 4d success
  await page.fill('#role', ' Head of CSR ');
  await page.fill('#phone', ' +91 98300 00000 ');
  await page.selectOption('#interestSelect', 'Title position');
  await page.selectOption('#sector', 'FarmTech / AgriTech');
  await page.fill('#notes', '  Board wants the title position.  ');
  await page.check('#consent');
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 8000 }),
    page.click('#downloadBtn'),
  ]);
  const fn = dl.suggestedFilename();
  if (fn === 'bks-pujo-sponsor-enquiry.json') pass('download filename exact', fn);
  else fail('download filename', fn);

  const tmp = path.join(OUT, 'downloaded.json');
  await dl.saveAs(tmp);
  const j = JSON.parse(fs.readFileSync(tmp, 'utf8'));
  const checks = [
    ['form', j.form === 'bks-pujo-sponsor-enquiry'],
    ['version', j.version === '1.0'],
    ['generated_at ISO', /^\d{4}-\d{2}-\d{2}T.*Z$/.test(j.generated_at)],
    ['event.dates', j.event.dates === '16-20 October 2026'],
    ['organisation trimmed', j.sponsor.organisation === 'Acme Agri Ltd'],
    ['name trimmed', j.sponsor.contact_name === 'Rina Sen'],
    ['role trimmed', j.sponsor.role === 'Head of CSR'],
    ['email trimmed', j.sponsor.email === 'rina@acme-agri.in'],
    ['phone trimmed', j.sponsor.phone === '+91 98300 00000'],
    ['conversation', j.sponsor.conversation === 'Title position'],
    ['sector', j.sponsor.sector === 'FarmTech / AgriTech'],
    ['notes trimmed', j.sponsor.notes === 'Board wants the title position.'],
    ['send_to', j.send_to === 'contact@bkswbengal.org'],
    ['declaration', /Not submitted to any server/.test(j.declaration)],
  ];
  const bad = checks.filter(c => !c[1]).map(c => c[0]);
  if (!bad.length) pass('JSON payload matches schema, all values trimmed');
  else fail('JSON payload', 'wrong: ' + bad.join(', '));

  s = await page.textContent('#status');
  if (/Saved to your device as bks-pujo-sponsor-enquiry\.json/.test(s) && /Nothing has been sent yet/.test(s)) pass('success message correct');
  else fail('success message', s);
  const mailto = await page.getAttribute('#status a', 'href');
  if (/^mailto:contact@bkswbengal\.org\?subject=/.test(mailto) && /Sponsor%20enquiry/.test(mailto)) pass('success mailto has subject');
  else fail('success mailto', mailto);
  await ctx.close();
}

/* ---------- 5. FAQ + keyboard ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const n = await page.locator('.faq details').count();
  if (n === 19) pass('19 FAQ items'); else fail('FAQ count', String(n));
  const anyOpen = await page.locator('.faq details[open]').count();
  if (anyOpen === 0) pass('all FAQ closed on load'); else fail('FAQ open on load', String(anyOpen));

  let opened = 0;
  for (let i = 0; i < n; i++) {
    const d = page.locator('.faq details').nth(i);
    await d.locator('summary').focus();
    await page.keyboard.press('Enter');
    if (await d.evaluate(e => e.open)) {
      await page.keyboard.press('Enter');
      if (!(await d.evaluate(e => e.open))) opened++;
    }
  }
  if (opened === n) pass(`all ${n} FAQ items open and close by keyboard`);
  else fail('FAQ keyboard', `${opened}/${n} toggled`);

  // skip link is first focusable (fresh load: focus must start at the document)
  await page.reload({ waitUntil: 'load' });
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => { const a = document.activeElement; return a.className + '|' + a.textContent.trim(); });
  if (/skip/.test(first)) pass('skip link is first focusable', first);
  else fail('first focusable', first);
  await ctx.close();
}

/* ---------- 6. landmarks / headings / alt ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const a = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    footer: document.querySelectorAll('footer').length,
    sectionsLabelled: [...document.querySelectorAll('main section')].every(s => {
      const id = s.getAttribute('aria-labelledby');
      return id && document.getElementById(id);
    }),
    imgsNoAlt: [...document.querySelectorAll('img')].filter(i => !i.getAttribute('alt')).length,
    labelled: [...document.querySelectorAll('input,select,textarea')].every(el =>
      el.type === 'checkbox' ? !!document.querySelector(`label[for="${el.id}"]`) : !!document.querySelector(`label[for="${el.id}"]`)),
    stackReachable: !!document.getElementById('stack') && !!document.querySelector('a[href="#proposition"]'),
    interestReachable: !!document.getElementById('interest') && !!document.querySelector('a[href="#interest"]'),
  }));
  a.h1 === 1 ? pass('exactly one h1') : fail('h1 count', String(a.h1));
  a.main === 1 && a.footer === 1 ? pass('landmarks present') : fail('landmarks', JSON.stringify(a));
  a.sectionsLabelled ? pass('every section has a resolvable aria-labelledby') : fail('section labels');
  a.imgsNoAlt === 0 ? pass('all images have alt') : fail('images missing alt', String(a.imgsNoAlt));
  a.labelled ? pass('every form control has a label') : fail('unlabelled form control');
  a.stackReachable && a.interestReachable ? pass('#proposition, #stack and #interest anchors resolve') : fail('anchors');

  // the page must actually use the width - landscape, not a ribbon
  const land = await page.evaluate(() => {
    const tracks = sel => {
      const e = document.querySelector(sel);
      return e ? getComputedStyle(e).gridTemplateColumns.split(' ').filter(Boolean).length : 0;
    };
    const frame = document.querySelector('.frame').getBoundingClientRect().width;
    return { spread: tracks('.spread'), aud: tracks('.aud'), pledge: tracks('.pledge'),
             positions: tracks('.positions'), faq: tracks('.faq'), layers: tracks('.layers'),
             foot: tracks('.foot-grid'), frameW: Math.round(frame) };
  });
  land.spread === 2 ? pass('sections run as two-column spreads', `head + body`) : fail('spread columns', String(land.spread));
  land.aud === 4 ? pass('audiences run four-up across the width') : fail('audience columns', String(land.aud));
  land.pledge === 2 ? pass('will / never runs as a two-column spread') : fail('pledge columns', String(land.pledge));
  land.positions === 3 ? pass('three sponsorship positions side by side') : fail('positions columns', String(land.positions));
  land.layers === 3 ? pass('platform layers run three-up') : fail('layers columns', String(land.layers));
  land.faq === 2 ? pass('FAQ runs in two columns') : fail('faq columns', String(land.faq));
  land.foot === 3 ? pass('footer runs three-up') : fail('footer columns', String(land.foot));
  land.frameW >= 1100 ? pass('content frame uses the viewport', `${land.frameW}px of 1440`) : fail('frame too narrow', `${land.frameW}px`);

  // prose must still be readable - wide layout, not wide paragraphs
  const proseMax = await page.evaluate(() =>
    Math.max(...[...document.querySelectorAll('.prose,.aud__item p,.layer p,.qblock p,.pledge li')]
      .map(e => e.getBoundingClientRect().width)));
  proseMax <= 700 ? pass('no paragraph exceeds a readable measure', `widest ${Math.round(proseMax)}px`)
                  : fail('paragraph too wide', `${Math.round(proseMax)}px`);

  // the checklist of FIXED chips is gone
  const chips = await page.evaluate(() => document.querySelectorAll('.chip').length);
  chips === 0 ? pass('the FIXED/INDICATIVE chip checklist is gone') : fail('chips still present', String(chips));
  await ctx.close();
}

await browser.close();

const failed = results.filter(r => r[0] === 'FAIL');
console.log(`\n===== ${results.length - failed.length}/${results.length} passed =====`);
if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(`  - ${f[1]}: ${f[2]}`)); process.exitCode = 1; }
