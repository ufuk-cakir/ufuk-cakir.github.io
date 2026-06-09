#!/usr/bin/env python3
"""
build.py — a tiny static blog builder for cakir-ufuk.de.

Turns an editorial Markdown post into a clean, LessWrong-style HTML page with:

  • LaTeX equations            — $inline$ and $$display$$ (KaTeX, at runtime)
  • Margin / side notes        — ^[inline note]  and  [^ref] + [^ref]: definition
  • Talk-animation embeds      — a ```anim fenced block resolved through a manifest
  • Margin asides              — a ```aside fenced block (longer marginalia)

It needs only `markdown-it-py` (already on this machine's python3). No network,
no build toolchain.

Usage
-----
    python3 build.py                 # build every post in posts/
    python3 build.py build POST.md   # build one (or more) posts
    python3 build.py manifest        # (re)generate animations.json from the talk
    python3 build.py gallery         # generate gallery.html + posters for ALL clips

Author a post: see blog/README.md.
"""
from __future__ import annotations

import html
import json
import os
import re
import shutil
import subprocess
import sys
import textwrap

# --------------------------------------------------------------------------- #
#  Paths / config
# --------------------------------------------------------------------------- #
HERE = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(HERE, "posts")
MEDIA_DIR = os.path.join(HERE, "media")
POSTER_DIR = os.path.join(MEDIA_DIR, "posters")
ASSETS_DIR = os.path.join(HERE, "assets")
TEMPLATE = os.path.join(HERE, "templates", "post.html")
MANIFEST = os.path.join(HERE, "animations.json")
OUT_DIR = HERE  # post HTML is written next to assets/ and media/

# Where the talk's rendered animations live. Override with $TALK_ASSETS.
TALK_ASSETS = os.environ.get(
    "TALK_ASSETS",
    os.path.normpath(os.path.join(HERE, "..", "..", "talks", "plasticity-empowerment_assets")),
)
# The talk's slide manifest (used by `manifest` to read the running order).
TALK_JSON = os.environ.get(
    "TALK_JSON",
    os.path.normpath(os.path.join(HERE, "..", "..", "talks", "slides", "PlasticityEmpowermentTalk.json")),
)

# Friendly names seeded into animations.json. slide number is 1-based (talk order).
# These were picked by eye from the deck; rename/extend freely (or use the gallery).
DEFAULT_NAMES = {
    "title":             1,
    "empowerment-reach": 16,
    "two-way-stream":    69,
    "mutual-information": 64,
    "empowerment":       104,
    "plasticity":        109,
    "the-mirror":        114,
    "tension-frontier":  136,
    "closing":           153,
}

try:
    from markdown_it import MarkdownIt
except Exception:  # pragma: no cover
    sys.exit("build.py needs markdown-it-py:  pip install markdown-it-py")


# --------------------------------------------------------------------------- #
#  Manifest
# --------------------------------------------------------------------------- #
def regenerate_manifest() -> dict:
    """Read the talk's slide JSON and (re)write animations.json, keeping names."""
    with open(TALK_JSON) as fh:
        slides = json.load(fh)["slides"]
    files = [os.path.basename(s["file"]) for s in slides]

    names = dict(DEFAULT_NAMES)
    if os.path.exists(MANIFEST):
        try:
            names = json.load(open(MANIFEST)).get("names", names) or names
        except Exception:
            pass

    manifest = {
        "_comment": "Maps friendly names -> talk animation. `slides` is the talk's "
                    "running order (index 0 == slide-001). Reference clips in a post "
                    "as `name: the-mirror` or `name: slide-114`. Run `build.py gallery` "
                    "to browse them all.",
        "talk_assets": os.path.relpath(TALK_ASSETS, HERE),
        "slides": files,
        "names": names,
    }
    with open(MANIFEST, "w") as fh:
        json.dump(manifest, fh, indent=2)
    print(f"manifest: {len(files)} clips, {len(names)} names -> {os.path.relpath(MANIFEST, HERE)}")
    return manifest


def load_manifest() -> dict:
    if not os.path.exists(MANIFEST):
        return regenerate_manifest()
    return json.load(open(MANIFEST))


def resolve_clip(name: str, manifest: dict) -> str:
    """Resolve a friendly name / slide-NNN / raw filename to an mp4 filename."""
    name = name.strip()
    slides = manifest["slides"]
    names = manifest.get("names", {})
    if name in names:                              # friendly alias
        idx = names[name]
        if isinstance(idx, int):
            return slides[idx - 1]
        return idx                                 # alias -> filename directly
    m = re.fullmatch(r"slide-(\d+)", name)         # slide-114
    if m:
        return slides[int(m.group(1)) - 1]
    if name.endswith(".mp4"):                      # raw filename
        return name
    if name.isdigit():                             # bare number
        return slides[int(name) - 1]
    raise KeyError(name)


def _probe_duration(src: str):
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", src], capture_output=True, text=True).stdout.strip()
        return float(out)
    except Exception:
        return None


def _grab_frame(src: str, dst: str, seek: list) -> bool:
    subprocess.run(["ffmpeg", "-y", *seek, "-i", src, "-frames:v", "1",
                    "-vf", "scale=720:-2", dst], capture_output=True)
    return os.path.exists(dst) and os.path.getsize(dst) > 0


def _is_blank(path: str) -> bool:
    """A near-uniform frame (a title fading out, an empty hold) — skip it."""
    try:
        from PIL import Image, ImageStat
        st = ImageStat.Stat(Image.open(path).convert("L"))
        return st.stddev[0] < 6 or st.mean[0] > 250 or st.mean[0] < 5
    except Exception:
        return False


def make_poster(src_mp4: str, dst_jpg: str) -> bool:
    """Extract a representative still: a late frame (the composed figure), but
    backing off from the very end so a final fade-out doesn't give a blank poster."""
    if os.path.exists(dst_jpg):
        return True
    if not shutil.which("ffmpeg") or not os.path.exists(src_mp4):
        return False
    os.makedirs(os.path.dirname(dst_jpg), exist_ok=True)
    dur = _probe_duration(src_mp4)
    if dur and dur > 0.3:
        seeks = [["-ss", f"{dur * f:.3f}"] for f in (0.92, 0.7, 0.5, 0.3)]
    else:
        seeks = [["-sseof", "-0.2"], ["-ss", "0.3"], ["-ss", "0.1"]]
    got = False
    for seek in seeks:
        if _grab_frame(src_mp4, dst_jpg, seek):
            got = True
            if not _is_blank(dst_jpg):
                return True   # a good, non-blank frame
    return got                # fall back to whatever we last grabbed


# --------------------------------------------------------------------------- #
#  Markdown front matter
# --------------------------------------------------------------------------- #
def split_front_matter(text: str):
    """Parse a leading `--- ... ---` block of simple `key: value` pairs."""
    meta: dict[str, str] = {}
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            block = text[3:end].strip("\n")
            for line in block.splitlines():
                if ":" in line and not line.lstrip().startswith("#"):
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            text = text[end + 4:].lstrip("\n")
    return meta, text


# --------------------------------------------------------------------------- #
#  The builder
# --------------------------------------------------------------------------- #
S = ""  # private-use sentinel char (never appears in prose / markdown)


class PostBuilder:
    def __init__(self, manifest: dict):
        self.manifest = manifest
        self.md = (
            MarkdownIt("commonmark", {"html": True, "typographer": False})
            .enable(["table", "strikethrough"])
        )
        self.reset()

    def reset(self):
        self.math: list[tuple[str, str]] = []   # (kind 'block'|'inline', tex)
        self.fences: list[tuple[str, str]] = []  # (info, content)
        self.sidenotes: list[str] = []           # raw md note text, 1-based by index
        self.fig_no = 0
        self.used_clips: set[str] = set()

    # -- math ------------------------------------------------------------- #
    def _stash_math(self, text: str) -> str:
        def block(m):
            self.math.append(("block", m.group(1).strip()))
            return f"{S}M{len(self.math)-1}{S}"
        def inline(m):
            self.math.append(("inline", m.group(1).strip()))
            return f"{S}M{len(self.math)-1}{S}"
        text = re.sub(r"\$\$(.+?)\$\$", block, text, flags=re.DOTALL)
        text = re.sub(r"(?<!\\)(?<!\$)\$(?!\$)([^\n]+?)(?<!\\)(?<!\$)\$(?!\$)", inline, text)
        return text

    def _restore_math(self, html_text: str) -> str:
        for i, (kind, tex) in enumerate(self.math):
            esc = html.escape(tex, quote=False)
            rep = (f'<span class="math-display">\\[{esc}\\]</span>'
                   if kind == "block" else f"\\({esc}\\)")
            html_text = html_text.replace(f"<p>{S}M{i}{S}</p>", rep)
            html_text = html_text.replace(f"{S}M{i}{S}", rep)
        return html_text

    # -- render a snippet of markdown (math-aware) ------------------------ #
    def render_block(self, text: str) -> str:
        return self.md.render(self._stash_math(text))

    def render_inline(self, text: str) -> str:
        return self.md.renderInline(self._stash_math(text))

    # -- fences ----------------------------------------------------------- #
    def _extract_fences(self, text: str) -> str:
        lines = text.split("\n")
        out, i = [], 0
        fence_re = re.compile(r"^(\s*)(`{3,}|~{3,})(.*)$")
        while i < len(lines):
            m = fence_re.match(lines[i])
            if m:
                indent, ticks, info = m.group(1), m.group(2), m.group(3).strip()
                body, i = [], i + 1
                while i < len(lines):
                    c = re.match(r"^(\s*)(`{3,}|~{3,})\s*$", lines[i])
                    if c and c.group(2)[0] == ticks[0] and len(c.group(2)) >= len(ticks):
                        i += 1
                        break
                    body.append(lines[i][len(indent):] if lines[i].startswith(indent) else lines[i])
                    i += 1
                self.fences.append((info, "\n".join(body)))
                out += ["", f"{S}F{len(self.fences)-1}{S}", ""]
            else:
                out.append(lines[i])
                i += 1
        return "\n".join(out)

    # -- sidenotes / footnotes ------------------------------------------- #
    def _extract_sidenotes(self, text: str) -> str:
        # collect [^id]: definitions (single line; continuation lines indented)
        defs: dict[str, str] = {}
        lines, kept, i = text.split("\n"), [], 0
        def_re = re.compile(r"^\[\^([^\]]+)\]:\s?(.*)$")
        while i < len(lines):
            m = def_re.match(lines[i])
            if m:
                key, buf = m.group(1), [m.group(2)]
                i += 1
                while i < len(lines) and (lines[i].startswith(("  ", "\t")) and lines[i].strip()):
                    buf.append(lines[i].strip())
                    i += 1
                defs[key] = " ".join(buf).strip()
            else:
                kept.append(lines[i])
                i += 1
        text = "\n".join(kept)

        # number references in order of appearance: ^[inline] then [^id]
        combined = re.compile(r"\^\[((?:[^\[\]\\]|\\.)*)\]|\[\^([^\]]+)\]")
        def repl(m):
            note = m.group(1) if m.group(1) is not None else defs.get((m.group(2) or "").strip(), "")
            note = note.replace("\\]", "]").replace("\\[", "[")
            self.sidenotes.append(note)
            return f"{S}S{len(self.sidenotes)-1}{S}"
        return combined.sub(repl, text)

    # -- HTML for a sidenote --------------------------------------------- #
    def _sidenote_html(self, idx: int) -> str:
        n = idx + 1
        body = self.render_inline(self.sidenotes[idx])
        return (
            f'<span class="sidenote-anchor">'
            f'<label class="sidenote-ref" for="sn-{n}" role="doc-noteref">{n}</label>'
            f'<input type="checkbox" id="sn-{n}" class="sidenote-toggle" aria-hidden="true">'
            f'<small class="sidenote" role="note"><span class="sidenote-n">{n}</span>{body}</small>'
            f'</span>'
        )

    # -- HTML for an animation embed ------------------------------------- #
    def _anim_html(self, cfg: dict) -> str:
        name = cfg.get("name", "").strip()
        try:
            clip = resolve_clip(name, self.manifest)
        except KeyError:
            avail = ", ".join(sorted(self.manifest.get("names", {}))) or "(none)"
            raise SystemExit(
                f"\n  ✗ animation '{name}' not found.\n"
                f"    Use a named clip ({avail}), slide-NNN, or a filename.\n"
                f"    Browse them with:  python3 build.py gallery\n")
        self.used_clips.add(clip)

        width = cfg.get("width", "").strip().lower()
        wcls = {"wide": " anim--wide", "full": " anim--full",
                "": "", "normal": ""}.get(width, "")
        loop = str(cfg.get("loop", "")).strip().lower() in ("1", "true", "yes", "on")
        once = str(cfg.get("autoplay", "true")).strip().lower() not in ("0", "false", "no", "off")

        self.fig_no += 1
        label = cfg.get("label", "").strip()
        if label.lower() == "none":
            figlabel = ""
        elif label:
            figlabel = f'<span class="fig-label">{html.escape(label)}</span> '
        else:
            figlabel = f'<span class="fig-label">Figure {self.fig_no}.</span> '

        caption = cfg.get("caption", "").strip()
        cap_html = self.render_inline(caption) if caption else ""
        credit = cfg.get("credit", "").strip()
        credit_html = f' <span class="fig-credit">{self.render_inline(credit)}</span>' if credit else ""
        figcap = (f'<figcaption>{figlabel}{cap_html}{credit_html}</figcaption>'
                  if (figlabel or cap_html or credit_html) else "")

        poster = f"media/posters/{clip}.jpg"
        loop_attr = " loop" if loop else ""
        return (
            f'<figure class="anim{wcls}" data-clip="{html.escape(name)}">'
            f'<div class="anim-stage" data-autoplay="{str(once).lower()}">'
            f'<video class="anim-video" playsinline muted preload="none" '
            f'poster="{poster}"{loop_attr}>'
            f'<source src="media/{clip}" type="video/mp4"></video>'
            f'<button class="anim-replay" type="button" aria-label="Replay animation">↻ replay</button>'
            f'</div>{figcap}</figure>'
        )

    def _aside_html(self, content: str) -> str:
        return f'<aside class="margin-aside">{self.render_block(content)}</aside>'

    def _code_html(self, info: str, content: str) -> str:
        lang = info.split()[0] if info else ""
        cls = f' class="language-{html.escape(lang)}"' if lang else ""
        return f'<pre class="code"><code{cls}>{html.escape(content)}</code></pre>'

    @staticmethod
    def _parse_kv(text: str) -> dict:
        cfg = {}
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line:
                k, v = line.split(":", 1)
                cfg[k.strip().lower()] = v.strip()
            else:
                cfg[line.lower()] = "true"   # bare flag, e.g. `loop`
        return cfg

    def _restore_fences(self, html_text: str) -> str:
        for i, (info, content) in enumerate(self.fences):
            kind = info.split()[0].lower() if info else ""
            if kind in ("anim", "animation"):
                rep = self._anim_html(self._parse_kv(content))
            elif kind in ("aside", "margin", "marginnote"):
                rep = self._aside_html(content)
            else:
                rep = self._code_html(info, content)
            html_text = html_text.replace(f"<p>{S}F{i}{S}</p>", rep)
            html_text = html_text.replace(f"{S}F{i}{S}", rep)
        return html_text

    def _restore_sidenotes(self, html_text: str) -> str:
        for i in range(len(self.sidenotes)):
            html_text = html_text.replace(f"{S}S{i}{S}", self._sidenote_html(i))
        return html_text

    @staticmethod
    def _add_heading_ids(html_text: str) -> str:
        """Give h2–h4 stable slug ids so #anchor links (and deep links) work."""
        seen: dict[str, int] = {}

        def slugify(inner: str) -> str:
            text = re.sub(r"<[^>]+>", "", inner)          # strip tags
            text = html.unescape(text).lower()
            slug = re.sub(r"[^a-z0-9]+", "-", text).strip("-") or "section"
            if slug in seen:
                seen[slug] += 1
                slug = f"{slug}-{seen[slug]}"
            else:
                seen[slug] = 0
            return slug

        def repl(m):
            lvl, inner = m.group(1), m.group(2)
            return f'<h{lvl} id="{slugify(inner)}">{inner}</h{lvl}>'

        return re.sub(r"<h([2-4])>(.*?)</h\1>", repl, html_text, flags=re.DOTALL)

    # -- top level -------------------------------------------------------- #
    def build_body(self, body_md: str) -> str:
        self.reset()
        body_md = self._extract_fences(body_md)      # 1. pull fenced blocks out
        body_md = self._stash_math(body_md)          # 2. protect math from markdown
        body_md = self._extract_sidenotes(body_md)   # 3. number side/foot notes
        html_text = self.md.render(body_md)          # 4. markdown -> html
        html_text = self._restore_sidenotes(html_text)
        html_text = self._restore_fences(html_text)  # may add more math (asides/captions)
        html_text = self._restore_math(html_text)    # 5. put math back (KaTeX at runtime)
        html_text = self._add_heading_ids(html_text) # 6. anchor-able headings
        return html_text


# --------------------------------------------------------------------------- #
#  Page assembly
# --------------------------------------------------------------------------- #
def reading_time(md_text: str) -> str:
    words = len(re.findall(r"\w+", md_text))
    return f"{max(1, round(words / 220))} min read"


def fill_template(meta: dict, body_html: str) -> str:
    tpl = open(TEMPLATE).read()
    title = meta.get("title", "Untitled")
    bits = []
    if meta.get("date"):
        bits.append(html.escape(meta["date"]))
    if meta.get("reading_time"):
        bits.append(html.escape(meta["reading_time"]))
    if meta.get("venue"):
        bits.append(html.escape(meta["venue"]))
    meta_line = " · ".join(bits)

    links = []
    if meta.get("paper_url"):
        links.append(f'<a href="{html.escape(meta["paper_url"])}">paper</a>')
    if meta.get("code_url"):
        links.append(f'<a href="{html.escape(meta["code_url"])}">code / slides</a>')
    links_html = (' <span class="post-links">' + " · ".join(links) + "</span>") if links else ""

    repl = {
        "TITLE": html.escape(title),
        "KICKER": html.escape(meta.get("kicker", "")),
        "SUBTITLE": meta.get("subtitle", ""),  # allow inline html/markup
        "META_LINE": meta_line + links_html,
        "DESCRIPTION": html.escape(meta.get("description", meta.get("subtitle", ""))),
        "BODY": body_html,
        "FOOTER": meta.get("footer", "&copy; Ufuk Çakır"),
    }
    for k, v in repl.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    return tpl


def copy_media(builder: PostBuilder):
    os.makedirs(MEDIA_DIR, exist_ok=True)
    for clip in sorted(builder.used_clips):
        src = os.path.join(TALK_ASSETS, clip)
        dst = os.path.join(MEDIA_DIR, clip)
        if os.path.exists(src) and not os.path.exists(dst):
            shutil.copy2(src, dst)
        make_poster(os.path.join(TALK_ASSETS, clip),
                    os.path.join(POSTER_DIR, clip + ".jpg"))


def build_post(path: str, manifest: dict) -> dict:
    raw = open(path).read()
    meta, body_md = split_front_matter(raw)
    meta.setdefault("reading_time", reading_time(body_md))
    slug = meta.get("slug") or os.path.splitext(os.path.basename(path))[0]

    builder = PostBuilder(manifest)
    body_html = builder.build_body(body_md)
    page = fill_template(meta, body_html)

    out = os.path.join(OUT_DIR, slug + ".html")
    with open(out, "w") as fh:
        fh.write(page)
    copy_media(builder)
    print(f"  ✓ {os.path.relpath(path, HERE)}  ->  {os.path.relpath(out, HERE)}  "
          f"({len(builder.used_clips)} clips, {len(builder.sidenotes)} notes, {builder.fig_no} figures)")
    meta["slug"] = slug
    return meta


def write_index(metas: list[dict]):
    """A minimal post index at blog/index.html."""
    items = []
    for m in sorted(metas, key=lambda m: m.get("date", ""), reverse=True):
        sub = f'<p class="idx-sub">{m["subtitle"]}</p>' if m.get("subtitle") else ""
        date = f'<span class="idx-date">{html.escape(m["date"])}</span>' if m.get("date") else ""
        items.append(
            f'<li class="idx-item"><a href="{m["slug"]}.html"><h2>{html.escape(m.get("title","Untitled"))}</h2></a>'
            f'{date}{sub}</li>')
    body = '<ul class="post-index">' + "\n".join(items) + "</ul>"
    meta = {"title": "Writing", "kicker": "", "subtitle": "Notes, talks, and walkthroughs.",
            "description": "Essays and talk write-ups by Ufuk Çakır."}
    page = fill_template(meta, body)
    with open(os.path.join(OUT_DIR, "index.html"), "w") as fh:
        fh.write(page)
    print(f"  ✓ index.html  ({len(metas)} posts)")


# --------------------------------------------------------------------------- #
#  Gallery (animation picker)
# --------------------------------------------------------------------------- #
def build_gallery(manifest: dict):
    os.makedirs(POSTER_DIR, exist_ok=True)
    slides = manifest["slides"]
    by_file = {}
    for nm, idx in manifest.get("names", {}).items():
        if isinstance(idx, int) and 1 <= idx <= len(slides):
            by_file.setdefault(slides[idx - 1], []).append(nm)

    print(f"  generating {len(slides)} posters …")
    cards = []
    for i, clip in enumerate(slides, 1):
        make_poster(os.path.join(TALK_ASSETS, clip), os.path.join(POSTER_DIR, clip + ".jpg"))
        names = by_file.get(clip, [])
        ref = names[0] if names else f"slide-{i:03d}"
        tags = "".join(f'<span class="g-name">{html.escape(n)}</span>' for n in names)
        snippet = html.escape(f"```anim\nname: {ref}\ncaption: …\n```")
        cards.append(textwrap.dedent(f"""\
          <figure class="g-card" data-clip="{clip}">
            <div class="g-vid">
              <img loading="lazy" src="media/posters/{clip}.jpg" alt="slide {i}">
              <video class="g-video" muted loop playsinline preload="none"
                     data-src="{html.escape(manifest['talk_assets'])}/{clip}"></video>
            </div>
            <figcaption>
              <code class="g-ref">slide-{i:03d}</code>{tags}
              <button class="g-copy" data-snippet="{snippet}" type="button">copy embed</button>
            </figcaption>
          </figure>"""))

    page = GALLERY_HTML.replace("{{CARDS}}", "\n".join(cards)).replace("{{N}}", str(len(slides)))
    with open(os.path.join(OUT_DIR, "gallery.html"), "w") as fh:
        fh.write(page)
    print(f"  ✓ gallery.html  ({len(slides)} clips)")
    print("    open blog/gallery.html, hover to preview, click 'copy embed' to grab a snippet.")


GALLERY_HTML = """<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Animation gallery — Plasticity as the Mirror of Empowerment</title>
<link rel="stylesheet" href="assets/blog.css">
<style>
  body{margin:0}
  .g-wrap{max-width:1200px;margin:0 auto;padding:2rem 1.25rem 5rem}
  .g-head h1{margin:.2em 0 .1em}
  .g-head p{color:var(--muted);max-width:40em}
  .g-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.1rem;margin-top:1.5rem}
  .g-card{margin:0;background:#fff;border:1px solid var(--rule);border-radius:10px;overflow:hidden;
          box-shadow:0 1px 2px rgba(20,20,20,.05)}
  .g-vid{position:relative;aspect-ratio:854/480;background:var(--paper)}
  .g-vid img,.g-vid video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
  .g-vid video{opacity:0;transition:opacity .15s}
  .g-card:hover .g-vid video{opacity:1}
  .g-card figcaption{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;padding:.55rem .7rem;
          font:500 .8rem/1.3 var(--ui)}
  .g-ref{font-family:var(--mono);font-size:.74rem;color:var(--muted);background:var(--paper);
          padding:.1rem .35rem;border-radius:5px}
  .g-name{font-family:var(--mono);font-size:.72rem;color:#fff;background:var(--empow);
          padding:.1rem .4rem;border-radius:5px}
  .g-copy{margin-left:auto;border:1px solid var(--rule);background:var(--paper);cursor:pointer;
          border-radius:6px;padding:.2rem .5rem;font:500 .72rem var(--ui);color:var(--accent)}
  .g-copy.ok{background:var(--empow);color:#fff;border-color:var(--empow)}
</style></head>
<body>
<div class="g-wrap">
  <header class="g-head">
    <h1>Animation gallery</h1>
    <p>All {{N}} clips from the deck, in talk order. Hover a card to preview it; click
       <em>copy embed</em> to put a <code>```anim</code> block on your clipboard, then
       paste it into your post. Friendly names (green) come from
       <code>animations.json</code>.</p>
  </header>
  <div class="g-grid">{{CARDS}}</div>
</div>
<script>
  // lazy-attach video sources; play on hover
  const io=new IntersectionObserver((es)=>es.forEach(e=>{const v=e.target.querySelector('.g-video');
    if(e.isIntersecting&&v&&!v.src){v.src=v.dataset.src;}}),{rootMargin:'300px'});
  document.querySelectorAll('.g-card').forEach(c=>{io.observe(c);
    c.addEventListener('mouseenter',()=>{const v=c.querySelector('.g-video');if(v){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{});}});
    c.addEventListener('mouseleave',()=>{const v=c.querySelector('.g-video');if(v){v.pause();}});
  });
  document.querySelectorAll('.g-copy').forEach(b=>b.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(b.dataset.snippet.replace(/&#10;/g,'\\n'));}catch(e){}
    b.classList.add('ok');const t=b.textContent;b.textContent='copied ✓';
    setTimeout(()=>{b.classList.remove('ok');b.textContent=t;},1200);
  }));
</script>
</body></html>
"""


# --------------------------------------------------------------------------- #
#  CLI
# --------------------------------------------------------------------------- #
def main(argv: list[str]):
    cmd = argv[0] if argv else "build"
    if cmd == "manifest":
        regenerate_manifest()
        return
    manifest = load_manifest()
    if cmd == "gallery":
        build_gallery(manifest)
        return
    if cmd == "build":
        argv = argv[1:]
    posts = argv if argv else sorted(
        os.path.join(POSTS_DIR, f) for f in os.listdir(POSTS_DIR) if f.endswith(".md"))
    if not posts:
        sys.exit("no posts found in posts/")
    print("building:")
    metas = [build_post(p, manifest) for p in posts]
    write_index(metas)


if __name__ == "__main__":
    main(sys.argv[1:])
