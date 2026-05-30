# wcag2.2-card-deck

Interactive web reference for all WCAG 2.2 success criteria, presented as a filterable card deck. Used for accessibility workshops, audits, and training.

## Stack
- Vanilla HTML, CSS, JavaScript — no framework, no build step
- Static site, open `index.html` directly in a browser or serve the folder

## Structure
- `index.html` — main entry point
- `assets/data.js` — all WCAG 2.2 criteria data (source of truth)
- `assets/main.js` — app initialization
- `assets/render.js` — card rendering
- `assets/filters.js` — filter/search logic
- `assets/utils.js` — utility functions
- `assets/css/` — styles including design tokens (colors, spacing, typography)
- `localization/` — translations (multiple languages)
- `config/` — configuration files
- `public/images/` — card deck images and cover

## How to run
```bash
# Option 1: open directly
open index.html

# Option 2: local server (avoids any CORS issues with data loading)
npx serve .
# or
python3 -m http.server 8080
```

## Notes
- `assets/data.js` contains all WCAG 2.2 success criteria as structured JS data — edit here to add/update criteria
- `innerHTML` is used throughout for rendering but only writes from `assets/data.js` (trusted static data, not user input)
- Multilingual support — language files are in `localization/`
- No backend, no API calls, fully client-side
