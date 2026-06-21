# Çakır OS

The home page (`/index.html`) is a small macOS-style desktop, built from a
Claude Design prototype. It's React, but **precompiled** so the browser loads
no Babel and no build step runs on deploy.

## Editing content (no build needed)

All real content — links, talks, projects, writing, the About and Background
text, the sticky-note "Currently" lines — lives in **`content.js`** as plain
JavaScript (`window.SITE`). Edit it and refresh; that's it.

**Publications have their own file: `publications.js`** (`window.SITE_PUBLICATIONS`).
Each entry carries a `summary` (one line, shown in the list) and a longer
`abstract` (shown when opened), plus citation metadata (authors, venue, year,
status, doi, arxiv). To add a paper, copy one `{ ... }` block in `items` and fill
it in — the schema is documented at the top of the file. Links are typed
(`{ type: "arxiv", href }`) and get a sensible button label automatically.

- Leave `links.email` as `""` to hide the Mail dock icon and About "Email" link.
- A list item with an `href` opens that link in a new tab; without one it opens
  a placeholder window inside the desktop.

## Exporting citations for your CV

`publications.js` is the single source of truth. To turn it into citations:

```sh
cd assets/os
node gen-citations.mjs   # writes publications.bib and publications.md
```

- `publications.bib` — BibTeX, ready for a LaTeX CV / Overleaf.
- `publications.md` — a numbered, formatted list to paste anywhere.

It also prints which entries are still missing co-authors / DOI / arXiv ids.

## Changing the desktop itself (needs a rebuild)

The interactive code is in `src/*.jsx`:

- `src/os-data.jsx` — SVG icons + the file-system map (`FILES`), built from `SITE`.
- `src/os-app.jsx` — the desktop: windows, dock, menu bar, widgets. Defaults
  (wallpaper, accent, widgets) are in `TWEAK_DEFAULTS` near the bottom.

After editing those, rebuild the plain-JS bundles:

```sh
cd assets/os
npm install        # one-time (installs @babel/standalone, pinned in package.json)
node build.mjs     # writes os-data.js and os-app.js
```

## Files

```
index.html            loads everything in order
assets/os/
  content.js          ← your content (plain JS, no build)
  publications.js     ← your publications (plain JS, no build)
  gen-citations.mjs   publications.js → publications.bib + publications.md
  os.css              styles
  os-data.js          compiled from src/os-data.jsx
  os-app.js           compiled from src/os-app.jsx
  src/                JSX sources
  vendor/             React + ReactDOM (production UMD, pinned 18.3.1)
  build.mjs           rebuild script
```
