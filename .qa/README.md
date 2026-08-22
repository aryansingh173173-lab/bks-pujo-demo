# QA harness

Two scripts. Both need Playwright and a system Chrome.

    cd .qa && npm install && npx playwright install chromium    # once

## qa.mjs — 40 checks

    python3 -m http.server 8777                                  # from the repo root
    node .qa/qa.mjs                                              # local
    QA_BASE=https://your-preview.vercel.app node .qa/qa.mjs      # against a deploy

Covers: no horizontal overflow at 320/375/390/768/1024/1440; no network requests
beyond Google Fonts; no console errors; hero film autoplay, pause control and
reduced-motion behaviour; all four form states and the exact downloaded JSON
payload; 19 FAQ items operable by keyboard; landmarks, labels and alt text; and
the landscape grid resolving to real columns at width.

Should be 40/40.

## contrast.mjs — hero text over the moving film

    node .qa/contrast.mjs                            # desktop
    QA_W=390 QA_H=844 node .qa/contrast.mjs          # phone

Plays the film and samples the composited page behind each block of hero copy
twelve times across the loop, scoring the worst-case WCAG ratio. Exits non-zero
below AA. Run it on both viewports after any change to the hero scrim, the film,
or a hero text colour.

Do not rewrite it to pause and seek — `currentTime` does not move the frame on a
paused element here, and the numbers come back about twice as good as reality.
