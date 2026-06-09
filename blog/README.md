# blog — editorial posts with embedded talk animations

A tiny static blog builder. You write a post in **Markdown**; it produces a clean,
LessWrong-style HTML page with **equations**, **margin notes**, and **animations
lifted straight from your Manim deck**. The look (serif body, ink-blue headings,
rose/green concept colours) is pulled from the talk's own palette so the post and
the deck read as one piece of design.

```
blog/
├── build.py            ← the builder (run this)
├── animations.json     ← maps friendly names → talk clips  (auto-generated)
├── templates/post.html ← the page shell
├── assets/
│   ├── blog.css        ← the editorial stylesheet
│   └── blog.js         ← KaTeX + play-on-scroll/click-to-replay
├── posts/*.md          ← YOUR posts live here
├── media/              ← clips + posters copied in on build (generated)
├── gallery.html        ← visual picker for all 154 clips (generated)
└── <slug>.html         ← built post  +  index.html (generated)
```

Only dependency: `markdown-it-py` (already installed). `ffmpeg`/`ffprobe` are used
to make poster thumbnails; without them you just lose the still frames.

---

## Build

```bash
cd blog
python3 build.py            # build every post in posts/  → <slug>.html + index.html
python3 build.py build foo.md   # build one post
python3 build.py gallery    # (re)build gallery.html + posters for ALL clips
python3 build.py manifest   # (re)generate animations.json from the talk (keeps names)
```

The talk's rendered clips are read from `../../talks/plasticity-empowerment_assets`
by default. Point elsewhere with an env var:

```bash
TALK_ASSETS=/path/to/clips TALK_JSON=/path/to/Deck.json python3 build.py
```

Output HTML lives at `blog/<slug>.html` and is served at `/blog/<slug>.html`.
Link it from your main site by hand, or point people at `blog/index.html`.

---

## Writing a post

Create `posts/my-post.md`. Start with front matter, then write Markdown:

```markdown
---
title: My Post Title
slug: my-post                 # → my-post.html (defaults to the filename)
kicker: Talk notes            # small label above the title
subtitle: A one-line hook (inline <em>HTML</em> is allowed here).
date: June 2026
venue: Some Reading Group
paper_url: https://arxiv.org/abs/…
code_url: https://github.com/…
description: Used for <meta> / social cards.
---

Your first paragraph gets a drop cap automatically. Then just write.
```

Everything CommonMark works, plus tables and `~~strikethrough~~`. Raw HTML is
allowed, so you can colour the two concepts with the built-in helpers:

```markdown
<span class="c-empow">empowerment</span> and <span class="c-plast">plasticity</span>
```

### Equations

Inline `$…$` and display `$$…$$`, rendered by KaTeX in the browser:

```markdown
The budget is shared: $$\mathfrak{E} + \mathfrak{P} \le m.$$
```

### Margin notes (the LessWrong sidenotes)

Two ways, both numbered and floated into the right margin (they collapse to
tap-to-reveal notes on narrow screens):

```markdown
Inline, right where you want it.^[This becomes margin note 1. Markdown and
$math$ work inside it.]

Or reference-style, defined anywhere in the file:

Some claim.[^why]

[^why]: This becomes the next numbered note. Good for longer asides.
```

For an **un-numbered** margin aside (pure marginalia), use a fenced block:

````markdown
```aside
A free-standing note in the margin — no number, just commentary.
Supports **markdown**.
```
````

### Embedding talk animations  ← the main event

Drop a fenced `anim` block wherever you want a clip:

````markdown
```anim
name: the-mirror
caption: Plasticity and empowerment are one flow read two ways. $\mathbb{I}(O\to A)$ vs $\mathbb{I}(A\to O)$.
```
````

Keys (only `name` is required):

| key       | meaning                                                                 |
|-----------|-------------------------------------------------------------------------|
| `name`    | a friendly name, `slide-114`, a bare number, or an `…mp4` filename       |
| `caption` | figure caption — supports markdown + `$math$`                            |
| `credit`  | a smaller trailing credit (e.g. a citation)                             |
| `label`   | overrides "Figure N." — set `label: none` to drop the label             |
| `width`   | `normal` (default), `wide`, or `full` (spills into the margin column)   |
| `loop`    | `true` to loop forever (default: play once on scroll-in)                |
| `autoplay`| `false` to require a click/replay instead of auto-playing               |

Clips **play once when scrolled into view** and hold the last frame; the reader
can hover and hit **↻ replay**, or click the frame, to replay. A poster still is
shown before play and for no-JS readers.

#### Finding the clip you want

Run `python3 build.py gallery` and open `blog/gallery.html`. It shows every clip
in talk order with a preview on hover. Click **copy embed** to copy a ready-made
`anim` block to your clipboard, then paste it into your post.

To give a clip a memorable name, edit `animations.json` → `names` (the value is the
1-based slide number, so `"the-mirror": 114`). Re-running `build.py manifest`
preserves your names. Built-in names: `title`, `empowerment-reach`,
`two-way-stream`, `mutual-information`, `empowerment`, `plasticity`, `the-mirror`,
`tension-frontier`, `closing`.

`build.py` copies only the clips a post actually uses into `media/`, so the repo
stays lean. If you reference a name that doesn't exist, the build stops and tells
you what's available.
