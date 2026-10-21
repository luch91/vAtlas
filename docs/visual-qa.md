# Visual QA

The museum identity is clearly differentiated: warm archival paper, violet/orange accents, editorial type, deterministic spatial island placement and a restrained contour field. The accepted record is clearly labeled and no sample record is substituted.

Verified at 1440, 768, 375 and 320 pixels: no horizontal overflow, navigation remains usable, typography does not clip, the atlas becomes a lightweight mobile stack, keyboard activation works, and reduced-motion mode completes without errors.

Screenshots: [desktop](screenshots/vatlas-desktop.png) and [mobile](screenshots/vatlas-mobile.png).

Performance: production bundle after dependency update is approximately 182 KB gzip JavaScript and 3.7 KB gzip CSS, below the initial 250 KB compressed JS target. A full lab Core Web Vitals trace was unavailable in the current browser-control environment; do not treat HTTP/browser smoke results as LCP/INP measurements.
