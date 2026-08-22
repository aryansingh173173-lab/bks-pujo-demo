# Handover — Bharatiya Krishak Samaj Pujo, sponsor site

**Repo** https://github.com/BKS-Bengal/bks-pujo-sponsor
**Branch** `revised-brief-hero-film` — this is the work. `main` is the old site and still serves production.
**Live preview** https://bks-pujo-sponsor-v4-0822-landscape.vercel.app
**Current production** https://bks-pujo-sponsor.vercel.app (the old version — do not assume it reflects this branch)

---

## 1. What this page has to do

One job: get a corporate decision-maker to fill in a form that downloads a JSON file to their own machine, which they then email to the organisers.

The event is a Durga Puja in Kolkata, 16–20 October 2026, built around the farmer, with a working integrated farm on the same ground. The target reader is a **brand and marketing decision-maker at an agritech or rural-facing business** — someone who buys brand, not CSR, and who often already owns an AI advisory product of their own. Every argument on the page is aimed at that person.

There is no payment, no checkout, no booking, no database, no login, no analytics and no cookie banner. That is a deliberate product decision, not an unfinished state — see §4.

## 2. Running it

Plain static HTML, CSS and JS. No framework, no build step, no dependencies to ship.

```bash
git clone https://github.com/BKS-Bengal/bks-pujo-sponsor.git
cd bks-pujo-sponsor
git checkout revised-brief-hero-film
python3 -m http.server 8777        # any static server will do
```

Open http://localhost:8777.

```
index.html                     the whole page — all copy is inline, there is no CMS
assets/styles.css              design system + the landscape grid
assets/app.js                  film loading, scroll reveal, the local-file form
assets/hero-loop.mp4           landscape film, 1280x820, 10.5s, 1.6 MB
assets/hero-loop-portrait.mp4  portrait film for narrow viewports, 1.1 MB
assets/hero-poster*.jpg        poster frames — these show under reduced motion
og-image.html                  source for the 1200x630 share card
og-image.png                   the rendered card (regenerate if you edit the HTML — see §6)
.qa/                           the test harness
vercel.json robots.txt sitemap.xml
```

## 3. The test harness — run this before and after anything

```bash
cd .qa && npm install && npx playwright install chromium   # once
cd .. && node .qa/qa.mjs                                    # 40 checks, local
QA_BASE=https://your-preview.vercel.app node .qa/qa.mjs     # against a deploy
```

40 checks covering: no horizontal overflow at 320/375/390/768/1024/1440; no network requests beyond Google Fonts; no console errors; film autoplay, pause control and reduced-motion behaviour; all four form states and the exact JSON payload; 19 FAQ items operable by keyboard; landmarks, labels, alt text; and the landscape grid actually resolving to multiple columns at width.

It should be 40/40. If you break something it will tell you which thing.

**Also run the contrast checker** if you touch the hero:

```bash
node .qa/contrast.mjs                          # desktop
QA_W=390 QA_H=844 node .qa/contrast.mjs        # phone
```

This one matters more than it looks. The hero runs live video behind live text, so a static contrast check is meaningless — the worst case is the brightest frame of the loop. The script plays the film and samples the composited page behind each block of copy twelve times across the loop, then scores the real WCAG ratio. Current worst cases:

| | desktop | phone | needs |
|---|---|---|---|
| h1 (marigold italic line) | 3.55 | 4.24 | 3.0 |
| lede left / right | 13.13 / 10.16 | 9.99 / 11.16 | 4.5 |
| sub-line | 5.76 | 5.15 | 4.5 |
| footage credit | 5.93 | — | 4.5 |

Everything passes, but the h1 on desktop at 3.55 is the thinnest margin on the page — that is the marigold italic line sitting over the marigold section of the footage. Treat it as the canary.

One warning about the method, because it cost me real time: **do not rewrite this into a pause-and-seek loop.** Setting `video.currentTime` on a paused element does not move the frame here — Chrome leaves it on frame 0, every sample comes back identical and dark, and the script reports contrast roughly twice as good as reality. It has to sample while the film plays.

The scrim in `.hero__veil` is tuned to exactly these numbers. It is a feathered radial that sits under the copy only, so the open side of the frame stays uncovered footage. **If you lighten it to show more film, re-run the checker on both viewports.** An earlier version of this page had the film so heavily veiled that the brightest moment in the loop arrived at the eye darker than the flat background colour — the video was invisible and nobody could tell it was there. The current setting is the balance point between that and unreadable text.

## 4. Things that are load-bearing — please don't "fix" these

**The form must never send anything.** No `fetch`, no XHR, no `localStorage`/`sessionStorage`/cookies, no `sendBeacon`, no analytics, no error reporting. The page tells the reader in plain English that nothing is transmitted and there is no server, and it invites them to open the network tab. That claim is a big part of why the page is persuasive. Adding a form backend, a Google Analytics tag or a Sentry snippet breaks a promise made in the copy. The harness fails the build if any of those appear.

**Do not turn this into a framework app.** Static is a feature here: it is auditable, it has nothing to leak, and it will still work in 2027 with no maintenance. If you need a component model for a sub-page, that is a conversation, not a default.

**Claims the page must never make.** These are absolute — legal and reputational, not stylistic:
- No footfall figure, audience number, media impressions, reach or coverage estimate.
- No return on spend, no ROI, no yield claim about the farm, no metric about the platform.
- No government partnership, endorsement or scheme.
- Bharatiya Krishak Samaj is the **organising partner**. They are never described as the title sponsor, and the title position is stated as open.
- No "rate card", no "package", no "TBA", no "pending confirmation", no placeholder copy.
- No farmer data is ever offered, sold or implied as available to a sponsor.

There is a whole section built on this — "What we will put in writing, and what we will never claim". It is the strongest thing on the page. Do not soften it.

**Canonical facts.** Dates 16–20 October 2026. Venue is Munshir Bheri Management / Fishermen's Committee, near Sukantanagar and Salt Lake Sector V, East Kolkata Wetlands, Kolkata – 700091. Contribution figures ₹1 lakh a farm, ₹20,000 every two months, 5,000 farms, ₹50 crore, ₹10 lakh title, ₹2.5 lakh category. Spellings: **OmniDEL.ai** and **MahAcharyaJi**, exactly like that.

**Voice.** No exclamation marks. No "unlock", "seamless", "journey", "curated", "ecosystem", "empower", "leverage", "cutting-edge", "AI-powered" or similar. British spelling. Short declarative sentences. The page earns trust by being plainer than its competitors, so anything that reads like marketing copy is a regression.

**Accessibility.** The film is muted, loops, and carries a visible pause control — WCAG 2.2.2 requires that for anything moving longer than five seconds. It is not loaded at all under `prefers-reduced-motion: reduce` or when the browser reports Save-Data; the poster frame stands in. Keep both behaviours.

**Media hosting.** If you add images or video, use Vercel Blob, not Supabase Storage. Supabase image transformations blew through the plan quota on another project and are banned across these repos.

## 5. Where the copy stands

Most of the page was rewritten to speak to the sponsor rather than describe the organisation. That rewrite is recent and **has not yet been signed off by Bharatiya Krishak Samaj** — check with Ram before treating any given sentence as final. The 19 FAQ answers are the older approved wording and were deliberately left alone.

There is an original build spec at `D:\DurgaPuja2026KrishakSamaj\CLAUDE-CODE-BUILD-SPEC-bks-pujo-sponsor-site.md` (ask Ram for a copy). Two of its instructions have been **deliberately overridden** on the client's direction: it mandates a single 44rem column throughout, and it declares its copy final and unchangeable. Both were changed. Everything else in that spec still holds, especially the honesty rules in §4 above.

## 6. Known open items

1. **The domain is not attached.** `canonical`, `og:url` and `og:image` all point at `https://pujo.bkswbengal.org/`, which is not connected to this Vercel project. Until it is, the canonical points at nothing and **the share card will not render when the link is pasted into WhatsApp or LinkedIn**. Either attach the domain or repoint the tags — the tags are all in the `<head>` of `index.html`.
2. **The site is now indexable.** `robots.txt` allows everything and there is a sitemap. Production today is `noindex, nofollow`. Confirm the intent before going live.
3. **The hero footage is a stand-in.** It is cut from the organisers' own Durga Puja Mahotsav 2025 at IIT Kharagpur Research Park, and the hero says so in a credit line, because it is not the 2026 pandal. When 2026 material exists it should replace this. The source had a burned-in watermark across the lower third; both cuts are cropped above it — if you recut, check the bottom of every frame.
4. **320px viewport.** The CTA falls below the fold on a 320-wide screen. Fine at 375 and up. Worth solving if you care about old small phones.
5. **Bengali and Hindi are gone.** The previous version had a three-language toggle. The revised brief is English-only. Decide whether they come back — if they do, the copy is now much longer than it was, so budget for it.
6. **`og-image.png` is generated, not authored.** It is a screenshot of `og-image.html` at exactly 1200x630. If you edit the HTML, re-render it:
   ```bash
   chrome --headless=new --window-size=1200,630 --screenshot=og-image.png og-image.html
   ```

## 7. Ideas worth exploring

Not instructions — just where the value probably is.

- **The demonstration farm deserves more.** It is the one thing a sponsor cannot buy at another pandal, and right now it is a text section. A plan, a diagram, or photographs of the ground would do more work than anything else on the page.
- **A one-page PDF** generated from the same content, for the sponsor to forward internally. Their board will not click a link.
- **Photography.** The page has no still images at all beyond the film and two logos. Real photographs of the wetlands, the committee, the karigars.
- **A named-contact block.** "A person signs for this" is claimed but no person is named. Naming one would strengthen it.
- Per-sector variants of the proposition section, since the argument for a bank differs from the argument for an input company.

## 8. Deploying

The Vercel project is **not** connected to GitHub, so pushing to `main` deploys nothing. Deploys are CLI only:

```bash
vercel --scope ram-badrinathans-projects            # preview
vercel --prod --scope ram-badrinathans-projects     # production
```

**Production requires Ram's explicit approval every time.** House rule, no exceptions: tag before, deploy a preview, share it side by side with the current live URL, get the word, then promote. Do not run `--prod` because a change looks finished.

## 9. Questions

Ram Badrinathan — contact@bkswbengal.org.

Worth asking before you start: how much of the rewritten copy is frozen, whether the domain is being attached, and whether the site should be indexable at launch.
