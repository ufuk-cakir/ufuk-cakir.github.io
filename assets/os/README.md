# Çakır OS

The home page (`/index.html`) is a small macOS-style desktop, built from a
Claude Design prototype. It's React, but **precompiled** so the browser loads
no Babel and no build step runs on deploy.

## Editing content (no build needed)

All real content — links, publications, talks, projects, writing, the About
and Background text, the sticky-note "Currently" lines — lives in **`content.js`**
as plain JavaScript (`window.SITE`). Edit it and refresh; that's it.

- Leave `links.email` as `""` to hide the Mail dock icon and About "Email" link.
- A list item with an `href` opens that link in a new tab; without one it opens
  a placeholder window inside the desktop.

## Changing the desktop itself (needs a rebuild)

The interactive code is in `src/*.jsx`:

- `src/os-data.jsx` — SVG icons + the file-system map (`FILES`), built from `SITE`.
- `src/os-app.jsx` — the desktop: windows, dock, menu bar, widgets. Defaults
  (wallpaper, accent, widgets) are in `TWEAK_DEFAULTS` near the bottom.

After editing those, rebuild the plain-JS bundles:

```sh
cd assets/os
npm install @babel/standalone   # one-time
node build.mjs                  # writes os-data.js and os-app.js
```

## Files

```
index.html            loads everything in order
assets/os/
  content.js          ← your content (plain JS, no build)
  os.css              styles
  os-data.js          compiled from src/os-data.jsx
  os-app.js           compiled from src/os-app.jsx
  src/                JSX sources
  vendor/             React + ReactDOM (production UMD, pinned 18.3.1)
  build.mjs           rebuild script
```
