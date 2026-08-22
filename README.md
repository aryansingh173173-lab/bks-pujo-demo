# Bharatiya Krishak Samaj Pujo — sponsor briefing

Single-page, sponsor-facing site for Bharatiya Krishak Samaj Pujo, Kolkata, 16–20 October 2026.
Organised by KarmYog for the 21st Century, with Bharatiya Krishak Samaj as organising partner.

Plain static HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Preview locally

    python3 -m http.server 8000

Then open http://localhost:8000.

## Deploy

    vercel            # preview
    vercel --prod     # production

## Where the copy lives

All copy is inline in `index.html`. There is no CMS and no content file.

## The enquiry form

The form writes `bks-pujo-sponsor-enquiry.json` to the visitor's own device and posts nothing —
no server, no analytics, no storage APIs. The visitor emails the file to contact@bkswbengal.org themselves.

## Hero footage

`assets/hero-loop.mp4` (landscape) and `assets/hero-loop-portrait.mp4` (portrait) are graded
cut-downs of the organisers' own Durga Puja Mahotsav 2025 recording at the IIT Kharagpur Research
Park, credited as such in the hero. The film is muted, loops, carries a visible pause control, and
is not loaded at all under `prefers-reduced-motion: reduce` or when the browser reports Save-Data —
the poster frame stands in.

## OG card

`og-image.html` is a standalone 1200×630 page. Screenshot it at exactly 1200×630 and save the result
as `og-image.png` in the repo root to refresh the Open Graph image.
