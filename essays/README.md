# Essays

Longer writing — essays — rendered from Markdown into a serif,
academic-print style. The Markdown engine is shared with the blog
(`../blog/build.py`); only the template and CSS here are different.

## Add a piece

1. Drop a Markdown file in `entries/`, e.g. `entries/my-essay.md`.
2. Run the build:

   ```sh
   python3 build.py            # build everything + index + search
   python3 build.py entries/my-essay.md   # build one, still refresh index
   ```

3. That regenerates `my-essay.html`, `index.html`, `search-index.js`, and `feed.xml`.

Only `markdown-it-py` is required (already installed). No bundler, no network.

To (re)generate the social/OG preview images (needs headless Chrome):

```sh
python3 build.py cards      # writes cards/<slug>.png for every essay
```

## Front matter

```yaml
---
title: The Cat in the Box
slug: the-cat-in-the-box          # optional; defaults to the filename
kicker: Essay · History of psychology
subtitle: A one-line hook shown as the dek and the index blurb.
date: June 2026                   # used for ordering (newest first) + byline
tags: learning theory, history    # first tag is shown on the index
description: SEO / social description.
doi: 10.5281/zenodo.0000000       # optional; shows in the citation + BibTeX
---
```

Every essay carries a **"Cite this"** box (formatted reference + copyable BibTeX).
Add a `doi:` line once you mint one (see below) and it flows into both.

## Writing (Obsidian-friendly)

Standard Markdown, plus the same niceties as the blog:

- **Math** — `$inline$` and `$$display$$` (KaTeX, rendered in the browser).
- **Margin notes** — inline `text^[a note in the margin]`, or referenced
  `text[^a]` with `[^a]: the note` defined later. They float into the right
  gutter on wide screens and become tap-to-reveal on mobile.
- **Wikilinks** — `[[slug]]`, `[[slug|custom label]]`, or `[[Note Title]]` link
  to another note. Every note grows a **"Linked references"** (backlinks) panel
  listing the notes that point to it — computed automatically at build time.
- **Code** — fenced ``` blocks and `inline code`.
- **Headings** — `##`/`###` get anchor ids; on wide screens they also feed the
  sticky table of contents in the left margin (scroll-spy highlights the current
  section). Two or more headings are needed for the TOC to appear.
- **Ornamental break** — a `---` line renders as a centered fleuron (❧).
- **Typography** — smart curly quotes/dashes/ellipses, oldstyle figures, and
  ligatures are automatic; the first paragraph opens with an illuminated drop cap
  and a small-caps first line. Body text is EB Garamond. Keep prose plain — the
  styling is the layout's job, not the file's.

## Feed, cards, comments

- **RSS/Atom** — `feed.xml` is regenerated on every build; linked from the index
  (`Feed`) and discoverable by readers.
- **Social cards** — `build.py cards` renders a 1200×630 preview per essay to
  `cards/<slug>.png`; the essay template points `og:image` at it.
- **Comments (giscus)** — dormant until configured. Enable GitHub *Discussions*
  on the repo, install the **giscus** app, then paste the `repo_id` and
  `category_id` from <https://giscus.app> into the `GISCUS` dict near the top of
  `build.py` and rebuild. A "Comments" section then appears on every essay.

Print/PDF is styled too. Each essay page has a **"PDF ↓"** button linking to a
clean, typeset `essays/<slug>.pdf` (white page, centred column, margin notes
folded in as footnotes, all web chrome stripped). Regenerate them with:

```sh
python3 build.py pdf        # render essays/<slug>.pdf for every essay (needs Chrome)
```

(The same render is reused for the Zenodo DOI upload.) Browser "Save as PDF"
also works via the `@media print` rules if you skip the pre-rendered file.

## DOIs (per article, via Zenodo)

Mint a citable DOI for an essay through [Zenodo](https://zenodo.org) (free).
First export a token once: create one at *Zenodo → Applications → personal
access tokens* with scopes **`deposit:write`** and **`deposit:actions`**, then:

```sh
export ZENODO_TOKEN=...          # keep this out of the repo
export ZENODO_SANDBOX=1          # optional: rehearse on sandbox.zenodo.org first
```

Then, two deliberate steps (DOIs are permanent):

```sh
python3 build.py doi <slug>            # render PDF, create a draft, reserve a DOI
#   → review the record on Zenodo (the printed URL)
python3 build.py doi <slug> --publish  # publish + write doi: into the frontmatter
python3 build.py                       # rebuild → DOI badge + doi in the BibTeX
```

The draft step uploads a print-styled PDF of the essay and fills in metadata
(title, author/ORCID, date, keywords, CC-BY, a link back to the web version).
Drafts and PDFs live in the gitignored `essays/.zenodo/`. Drop `ZENODO_SANDBOX`
to mint a real DOI; the same essay can later get a *new version* on Zenodo.
