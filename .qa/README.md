# QA harness

31 checks against a running copy of the site. Requires Playwright and the system Chrome.

    python -m http.server 8777 --bind 127.0.0.1     # from the repo root
    node .qa/qa.mjs                                  # local
    QA_BASE=https://<preview>.vercel.app node .qa/qa.mjs   # live

Covers: horizontal overflow at 320-1440, no network requests beyond Google Fonts,
console errors, hero film autoplay/pause/reduced-motion, form validation, the
downloaded JSON payload, 19 FAQ items by keyboard, landmarks, labels, and that
section 5.5 is the tallest section on the page.
