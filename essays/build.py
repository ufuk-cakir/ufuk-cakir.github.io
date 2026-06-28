#!/usr/bin/env python3
"""
build.py — turn notes/entries/*.md into the serif "Notes" pages.

Reuses the Markdown engine from ../blog/build.py (LaTeX math, margin / foot
notes, code blocks, heading anchors), wraps each piece in the Notes serif
template, and also produces:

  • a general, reverse-chronological index            (index.html)
  • a search index                                    (search-index.js)
  • an Atom feed people can subscribe to              (feed.xml)
  • [[wikilinks]] between notes + a backlinks panel   ("Linked references")
  • optional social/OG cards                          (build.py cards → cards/*.png)

Authoring loop: drop a Markdown file in entries/, run this, done. See README.md.

Usage
-----
    python3 build.py            # build every essay + index + search + feed
    python3 build.py cards      # render social/OG cards (needs headless Chrome)
"""
from __future__ import annotations

import html
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ENTRIES_DIR = os.path.join(HERE, "entries")
NOTE_TEMPLATE = os.path.join(HERE, "templates", "note.html")
INDEX_TEMPLATE = os.path.join(HERE, "templates", "index.html")
CARD_TEMPLATE = os.path.join(HERE, "templates", "card.html")
CARDS_DIR = os.path.join(HERE, "cards")
OUT_DIR = HERE

SITE_URL = "https://cakir-ufuk.de"
NOTES_URL = SITE_URL + "/essays"

# Comments via giscus (GitHub Discussions). Dormant until you fill in the two
# IDs from https://giscus.app (enable Discussions + install the giscus app
# first). See README.md.
GISCUS = {
    "repo": "ufuk-cakir/ufuk-cakir.github.io",
    "repo_id": "",        # e.g. "R_kgD..."
    "category": "Comments",
    "category_id": "",     # e.g. "DIC_kwD..."
}

# --------------------------------------------------------------------------- #
#  Reuse the blog's Markdown engine (shared renderer, separate front door).
# --------------------------------------------------------------------------- #
_BLOG_BUILD = os.path.normpath(os.path.join(HERE, "..", "blog", "build.py"))
_spec = importlib.util.spec_from_file_location("blog_build", _BLOG_BUILD)
if _spec is None or _spec.loader is None:
    sys.exit(f"could not load the blog markdown engine at {_BLOG_BUILD}")
blog_build = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(blog_build)

PostBuilder = blog_build.PostBuilder
split_front_matter = blog_build.split_front_matter
reading_time = blog_build.reading_time

from markdown_it import MarkdownIt  # noqa: E402  (installed; used by the engine)

# Essays don't use talk-animation embeds, so the engine needs no manifest.
EMPTY_MANIFEST = {"slides": [], "names": {}}


def make_builder() -> "PostBuilder":
    """A PostBuilder whose Markdown has typographer on (curly quotes, dashes…)."""
    b = PostBuilder(EMPTY_MANIFEST)
    b.md = (MarkdownIt("commonmark", {"html": True, "typographer": True})
            .enable(["table", "strikethrough", "replacements", "smartquotes"]))
    return b


# --------------------------------------------------------------------------- #
#  Wikilinks  [[slug]]  /  [[slug|label]]  /  [[Note Title]]
# --------------------------------------------------------------------------- #
WIKILINK_RE = re.compile(r"\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]")


def _norm(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.strip().lower()).strip("-")


def resolve_wikilinks(body_md: str, slug_set: set, title_by_slug: dict):
    """Rewrite [[...]] to anchors; return (new_md, set_of_linked_slugs)."""
    targets: set = set()

    def repl(m):
        raw, label = m.group(1).strip(), (m.group(2) or "").strip()
        key = _norm(raw)
        if key in slug_set:
            targets.add(key)
            text = html.escape(label or title_by_slug.get(key, raw))
            return f'<a class="wikilink" href="{key}.html">{text}</a>'
        # unresolved — render visibly so a dead link is noticeable
        return f'<span class="wikilink wikilink--missing">{html.escape(label or raw)}</span>'

    return WIKILINK_RE.sub(repl, body_md), targets


# --------------------------------------------------------------------------- #
#  Page assembly
# --------------------------------------------------------------------------- #
MONTH_NAMES = ("January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December")


def _fmt_date(meta: dict) -> str:
    """A full, human date: '28 June, 2026' (falls back to the raw string)."""
    raw = meta.get("date") or meta.get("first_version") or ""
    d = parse_date(raw)
    return f"{d.day} {MONTH_NAMES[d.month - 1]}, {d.year}" if d else raw


def _byline(meta: dict) -> str:
    author = html.escape(meta.get("author", "Ufuk Çakır"))
    date = _fmt_date(meta)
    parts = [f'<span class="byline-author">{author}</span>']
    if date:
        parts.append(f'<span class="byline-date">{html.escape(date)}</span>')
    out = f'<p class="essay-byline">{"".join(parts)}</p>'
    if meta.get("doi"):
        doi = html.escape(meta["doi"])
        out += (f'<p class="essay-doi"><a href="https://doi.org/{doi}">'
                f'<span class="doi-badge">DOI</span> {doi}</a></p>')
    return out


def _og_image(slug: str) -> str:
    return (
        f'<meta property="og:url" content="{NOTES_URL}/{slug}.html">\n'
        f'  <meta property="og:image" content="{NOTES_URL}/cards/{slug}.png">\n'
        f'  <meta name="twitter:card" content="summary_large_image">'
    )


def _comments_html() -> str:
    if not (GISCUS["repo_id"] and GISCUS["category_id"]):
        return ""
    return (
        '<section class="essay-comments" aria-label="Comments">\n'
        '  <h2>Comments</h2>\n'
        '  <script src="https://giscus.app/client.js"\n'
        f'    data-repo="{GISCUS["repo"]}" data-repo-id="{GISCUS["repo_id"]}"\n'
        f'    data-category="{GISCUS["category"]}" data-category-id="{GISCUS["category_id"]}"\n'
        '    data-mapping="pathname" data-strict="1" data-reactions-enabled="1"\n'
        '    data-emit-metadata="0" data-input-position="top" data-theme="light"\n'
        '    data-lang="en" crossorigin="anonymous" async></script>\n'
        '</section>'
    )


def _backlinks_html(slug: str, backlinks: dict, meta_by_slug: dict) -> str:
    srcs = sorted(set(backlinks.get(slug, [])))
    if not srcs:
        return ""
    items = []
    for s in srcs:
        m = meta_by_slug[s]
        title = html.escape(m.get("title", "Untitled"))
        dek = m.get("subtitle", "").strip()
        tail = f' <span class="bl-dek">{html.escape(dek)}</span>' if dek else ""
        items.append(f'<li><a href="{s}.html">{title}</a>{tail}</li>')
    return (
        '<section class="essay-backlinks" aria-label="Linked references">\n'
        '  <h2>Linked references</h2>\n'
        f'  <ul>{"".join(items)}</ul>\n'
        '</section>'
    )


AUTHOR = "Ufuk Çakır"
AUTHOR_BIB = "Çakır, Ufuk"          # "Last, First" for BibTeX
AUTHOR_SHORT = "Çakır, U."


def _year(meta: dict) -> int:
    d = parse_date(meta.get("date") or meta.get("first_version") or "")
    return d.year if d else 2026


def _cite_key(meta: dict, year: int) -> str:
    first = re.sub(r"[^a-z0-9]+", " ", meta["slug"]).split()
    return "cakir" + str(year) + (first[0] if first else "note")


def _bibtex(meta: dict) -> str:
    year = _year(meta)
    url = f"{NOTES_URL}/{meta['slug']}.html"
    title = meta.get("title", "Untitled")
    lines = [
        "@misc{" + _cite_key(meta, year) + ",",
        "  author       = {" + AUTHOR_BIB + "},",
        "  title        = {{" + title + "}},",          # double braces preserve case
        "  year         = {" + str(year) + "},",
        "  howpublished = {\\url{" + url + "}},",
    ]
    if meta.get("doi"):
        lines.append("  doi          = {" + meta["doi"] + "},")
    lines.append("  note         = {Essays — cakir-ufuk.de}")
    lines.append("}")
    return "\n".join(lines)


def _cite_html(meta: dict) -> str:
    year = _year(meta)
    url = f"{NOTES_URL}/{meta['slug']}.html"
    title = html.escape(meta.get("title", "Untitled"))
    ref = (f"{AUTHOR_SHORT} ({year}). <i>{title}</i>. Essays. "
           f'<a href="{url}">{html.escape(url)}</a>')
    if meta.get("doi"):
        doi = html.escape(meta["doi"])
        ref += f' <a href="https://doi.org/{doi}">https://doi.org/{doi}</a>'
    bib = html.escape(_bibtex(meta))
    return (
        '<details class="essay-cite">\n'
        '  <summary>Cite this</summary>\n'
        f'  <p class="cite-ref">{ref}</p>\n'
        '  <div class="cite-bib">\n'
        f'    <pre class="bibtex"><code>{bib}</code></pre>\n'
        '    <button type="button" class="cite-copy">Copy BibTeX</button>\n'
        '  </div>\n'
        '</details>'
    )


def fill_note(meta: dict, body_html: str, backlinks_html: str, comments_html: str) -> str:
    tpl = open(NOTE_TEMPLATE).read()
    dek = meta.get("subtitle", "").strip()   # inline html allowed
    footer = meta.get("footer") or '<a href="index.html">← All notes</a>'

    repl = {
        "TITLE": html.escape(meta.get("title", "Untitled")),
        "DESCRIPTION": html.escape(meta.get("description", dek)),
        "OG_IMAGE": _og_image(meta["slug"]),
        "PDF_LINK": f'<a class="pdf-link" href="{meta["slug"]}.pdf" download>PDF ↓</a>',
        "DEK": f'<p class="essay-dek">{dek}</p>' if dek else "",
        "BYLINE": _byline(meta),
        "BODY": body_html,
        "BACKLINKS": backlinks_html,
        "CITE": _cite_html(meta),
        "COMMENTS": comments_html,
        "FOOTER": footer,
    }
    for k, v in repl.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    return tpl


# --------------------------------------------------------------------------- #
#  Index + search
# --------------------------------------------------------------------------- #
def _sort_key(meta: dict) -> str:
    return meta.get("date") or meta.get("first_version") or meta.get("title", "")


def _row_html(m: dict) -> str:
    side = []
    date = _fmt_date(m)
    if date:
        side.append(f'<span class="row-date">{html.escape(date)}</span>')
    if m.get("tags"):
        first = m["tags"].split(",")[0].strip()
        if first:
            side.append(f'<span class="row-tags">{html.escape(first)}</span>')
    dek = f'<p class="row-dek">{m["subtitle"].strip()}</p>' if m.get("subtitle") else ""
    return (
        f'<li class="essay-row"><a href="{m["slug"]}.html">'
        f'<h2 class="row-title">{html.escape(m.get("title", "Untitled"))}</h2>'
        f'{dek}'
        f'<span class="row-side">{"".join(side)}</span>'
        f"</a></li>"
    )


def write_index(metas: list):
    rows = "\n        ".join(
        _row_html(m) for m in sorted(metas, key=_sort_key, reverse=True))
    page = open(INDEX_TEMPLATE).read().replace("{{ROWS}}", rows)
    with open(os.path.join(OUT_DIR, "index.html"), "w") as fh:
        fh.write(page)
    print(f"  ✓ index.html  ({len(metas)} notes)")


def write_search(metas: list):
    entries = []
    for m in sorted(metas, key=_sort_key, reverse=True):
        kind = (m.get("kicker", "").split("·")[-1].strip().lower() or "note")
        terms = " ".join(filter(None, [m.get("tags", ""), m.get("description", "")]))
        entries.append({
            "title": m.get("title", "Untitled"),
            "href": m["slug"] + ".html",
            "status": kind,
            "terms": terms,
        })
    data = ("// generated by build.py — do not edit by hand\n"
            "const notesSearchEntries = "
            + json.dumps(entries, indent=2, ensure_ascii=False) + ";\n")
    with open(os.path.join(OUT_DIR, "search-index.js"), "w") as fh:
        fh.write(data)
    print(f"  ✓ search-index.js  ({len(entries)} entries)")


# --------------------------------------------------------------------------- #
#  Atom feed
# --------------------------------------------------------------------------- #
_MONTHS = {m: i for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july", "august",
     "september", "october", "november", "december"], start=1)}


def parse_date(s: str):
    s = (s or "").strip()
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        return datetime(int(m[1]), int(m[2]), int(m[3]), 12, tzinfo=timezone.utc)
    m = re.match(r"(?:(\d{1,2})\s+)?([A-Za-z]+)\s+(\d{4})", s)
    if m and m.group(2).lower() in _MONTHS:
        return datetime(int(m[3]), _MONTHS[m.group(2).lower()],
                        int(m.group(1) or 1), 12, tzinfo=timezone.utc)
    return None


def write_feed(metas: list):
    dated = []
    for m in metas:
        d = parse_date(m.get("date") or m.get("first_version") or "")
        dated.append((d, m))
    dated.sort(key=lambda t: (t[0] or datetime.min.replace(tzinfo=timezone.utc)),
               reverse=True)
    updated = next((d for d, _ in dated if d), datetime(2026, 1, 1, tzinfo=timezone.utc))

    def esc(x):
        return html.escape(x or "", quote=False)

    entries = []
    for d, m in dated:
        url = f"{NOTES_URL}/{m['slug']}.html"
        when = (d or updated).isoformat()
        entries.append(
            "  <entry>\n"
            f"    <title>{esc(m.get('title', 'Untitled'))}</title>\n"
            f'    <link href="{url}"/>\n'
            f"    <id>{url}</id>\n"
            f"    <updated>{when}</updated>\n"
            f"    <published>{when}</published>\n"
            f"    <summary>{esc(m.get('subtitle') or m.get('description', ''))}</summary>\n"
            "  </entry>"
        )
    feed = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<feed xmlns="http://www.w3.org/2005/Atom">\n'
        "  <title>Essays — Ufuk Çakır</title>\n"
        "  <subtitle>Longer writing on learning, minds, and whatever currently has my attention.</subtitle>\n"
        f'  <link href="{NOTES_URL}/"/>\n'
        f'  <link rel="self" href="{NOTES_URL}/feed.xml"/>\n'
        f"  <id>{NOTES_URL}/</id>\n"
        f"  <updated>{updated.isoformat()}</updated>\n"
        "  <author><name>Ufuk Çakır</name></author>\n"
        + "\n".join(entries) + "\n"
        "</feed>\n"
    )
    with open(os.path.join(OUT_DIR, "feed.xml"), "w") as fh:
        fh.write(feed)
    print(f"  ✓ feed.xml  ({len(entries)} entries)")


# --------------------------------------------------------------------------- #
#  Records / link graph / build
# --------------------------------------------------------------------------- #
def load_records() -> list:
    recs = []
    for f in sorted(os.listdir(ENTRIES_DIR)):
        if not f.endswith(".md"):
            continue
        meta, body_md = split_front_matter(open(os.path.join(ENTRIES_DIR, f)).read())
        meta["slug"] = meta.get("slug") or os.path.splitext(f)[0]
        meta.setdefault("reading_time", reading_time(body_md))
        recs.append({"meta": meta, "body": body_md})
    return recs


def build_all():
    recs = load_records()
    slug_set = {r["meta"]["slug"] for r in recs}
    title_by_slug = {r["meta"]["slug"]: r["meta"].get("title", r["meta"]["slug"]) for r in recs}
    meta_by_slug = {r["meta"]["slug"]: r["meta"] for r in recs}

    # backlinks: who links to whom
    backlinks: dict = {}
    for r in recs:
        _, targets = resolve_wikilinks(r["body"], slug_set, title_by_slug)
        for t in targets:
            if t != r["meta"]["slug"]:
                backlinks.setdefault(t, []).append(r["meta"]["slug"])

    print("building notes:")
    for r in recs:
        slug = r["meta"]["slug"]
        linked_md, _ = resolve_wikilinks(r["body"], slug_set, title_by_slug)
        builder = make_builder()
        body_html = builder.build_body(linked_md)
        page = fill_note(r["meta"], body_html,
                         _backlinks_html(slug, backlinks, meta_by_slug),
                         _comments_html())
        with open(os.path.join(OUT_DIR, slug + ".html"), "w") as fh:
            fh.write(page)
        print(f"  ✓ {slug}.html  ({len(builder.sidenotes)} notes, "
              f"{len(set(backlinks.get(slug, [])))} backlinks)")

    metas = [r["meta"] for r in recs]
    write_index(metas)
    write_search(metas)
    write_feed(metas)


# --------------------------------------------------------------------------- #
#  Social / OG cards (separate step — needs headless Chrome)
# --------------------------------------------------------------------------- #
def _chrome() -> str:
    for b in ("google-chrome-stable", "google-chrome", "chromium", "chromium-browser"):
        if shutil.which(b):
            return b
    return ""


def build_cards():
    chrome = _chrome()
    if not chrome:
        sys.exit("no Chrome/Chromium found — can't render cards")
    if not os.path.exists(CARD_TEMPLATE):
        sys.exit(f"missing card template: {CARD_TEMPLATE}")
    os.makedirs(CARDS_DIR, exist_ok=True)
    tpl = open(CARD_TEMPLATE).read()
    print("rendering cards:")
    for r in load_records():
        m = r["meta"]
        meta_line = _fmt_date(m)
        card = (tpl.replace("{{TITLE}}", html.escape(m.get("title", "Untitled")))
                   .replace("{{DEK}}", html.escape(m.get("subtitle", "")))
                   .replace("{{META}}", html.escape(meta_line)))
        tmp = os.path.join(CARDS_DIR, m["slug"] + ".card.html")
        out = os.path.join(CARDS_DIR, m["slug"] + ".png")
        with open(tmp, "w") as fh:
            fh.write(card)
        subprocess.run(
            [chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
             "--hide-scrollbars", "--virtual-time-budget=3000",
             "--window-size=1200,630", f"--screenshot={out}", "file://" + tmp],
            capture_output=True)
        os.remove(tmp)
        ok = "✓" if os.path.exists(out) else "✗"
        print(f"  {ok} cards/{m['slug']}.png")


# --------------------------------------------------------------------------- #
#  DOIs via Zenodo  (per-article; two-step draft → publish)
#
#  Needs a Zenodo personal access token (scopes: deposit:write, deposit:actions)
#  exported as ZENODO_TOKEN. Set ZENODO_SANDBOX=1 to rehearse against
#  sandbox.zenodo.org (fake, non-resolving DOIs) before minting real ones.
# --------------------------------------------------------------------------- #
ORCID = "0009-0005-9196-1986"
AFFILIATION = "University of Oxford"
LICENSE = "cc-by-4.0"
ZENODO_DIR = os.path.join(HERE, ".zenodo")   # gitignored: drafts + rendered PDFs


def _zenodo_base() -> str:
    return "https://sandbox.zenodo.org" if os.environ.get("ZENODO_SANDBOX") else "https://zenodo.org"


def _zenodo_token() -> str:
    tok = os.environ.get("ZENODO_TOKEN")
    if not tok:
        sys.exit("set ZENODO_TOKEN (a Zenodo token with deposit:write + deposit:actions)")
    return tok


def _zapi(method: str, path: str, token: str, data=None, raw=None):
    url = path if path.startswith("http") else _zenodo_base() + path
    headers = {"Authorization": "Bearer " + token}
    body = None
    if raw is not None:
        body = raw
        headers["Content-Type"] = "application/octet-stream"
    elif data is not None:
        body = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            txt = r.read().decode()
            return json.loads(txt) if txt else {}
    except urllib.error.HTTPError as e:
        sys.exit(f"Zenodo {method} {url} → {e.code}: {e.read().decode()[:600]}")


def _entry_for(slug: str):
    for f in sorted(os.listdir(ENTRIES_DIR)):
        if not f.endswith(".md"):
            continue
        path = os.path.join(ENTRIES_DIR, f)
        meta, _ = split_front_matter(open(path).read())
        if (meta.get("slug") or os.path.splitext(f)[0]) == slug:
            meta["slug"] = slug
            return path, meta
    sys.exit(f"no entry with slug '{slug}'")


def _render_pdf(slug: str, dest: str) -> str:
    chrome = _chrome()
    if not chrome:
        sys.exit("no Chrome/Chromium found — can't render the PDF")
    html_path = os.path.join(OUT_DIR, slug + ".html")
    if not os.path.exists(html_path):
        sys.exit(f"{slug}.html not found — run `python3 build.py` first")
    os.makedirs(os.path.dirname(dest) or ".", exist_ok=True)
    subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", "--virtual-time-budget=6000",
         f"--print-to-pdf={dest}", "file://" + html_path],
        capture_output=True)
    if not os.path.exists(dest):
        sys.exit("PDF render failed")
    return dest


def build_pdfs():
    """Render each essay to notes/<slug>.pdf (what the 'Download PDF' button links to)."""
    if not _chrome():
        sys.exit("no Chrome/Chromium found — can't render PDFs")
    print("rendering PDFs:")
    for r in load_records():
        slug = r["meta"]["slug"]
        dest = _render_pdf(slug, os.path.join(OUT_DIR, slug + ".pdf"))
        print(f"  ✓ {os.path.relpath(dest, HERE)}")


def _zenodo_metadata(meta: dict) -> dict:
    d = parse_date(meta.get("date") or meta.get("first_version") or "")
    pub = (d or datetime(2026, 1, 1)).strftime("%Y-%m-%d")
    creator = {"name": AUTHOR_BIB}
    if ORCID:
        creator["orcid"] = ORCID
    if AFFILIATION:
        creator["affiliation"] = AFFILIATION
    md = {
        "title": meta.get("title", "Untitled"),
        "upload_type": "publication",
        "publication_type": "other",
        "description": meta.get("description") or meta.get("subtitle") or meta.get("title", ""),
        "creators": [creator],
        "publication_date": pub,
        "access_right": "open",
        "license": LICENSE,
        "related_identifiers": [{
            "relation": "isAlternateIdentifier",
            "identifier": f"{NOTES_URL}/{meta['slug']}.html",
            "scheme": "url",
        }],
    }
    kw = [t.strip() for t in meta.get("tags", "").split(",") if t.strip()]
    if kw:
        md["keywords"] = kw
    return {"metadata": md}


def doi_draft(slug: str):
    token = _zenodo_token()
    _, meta = _entry_for(slug)
    if meta.get("doi"):
        sys.exit(f"'{slug}' already has a DOI ({meta['doi']}) — remove it first to re-mint")
    pdf = _render_pdf(slug, os.path.join(ZENODO_DIR, slug + ".pdf"))

    print(f"creating Zenodo draft for '{slug}' on {_zenodo_base()} …")
    dep = _zapi("POST", "/api/deposit/depositions", token, data={})
    dep_id = dep["id"]
    bucket = dep["links"]["bucket"]
    reserved = dep.get("metadata", {}).get("prereserve_doi", {}).get("doi")

    with open(pdf, "rb") as fh:
        _zapi("PUT", f"{bucket}/{slug}.pdf", token, raw=fh.read())
    _zapi("PUT", f"/api/deposit/depositions/{dep_id}", token, data=_zenodo_metadata(meta))

    os.makedirs(ZENODO_DIR, exist_ok=True)
    with open(os.path.join(ZENODO_DIR, slug + ".json"), "w") as fh:
        json.dump({"id": dep_id, "doi": reserved,
                   "sandbox": bool(os.environ.get("ZENODO_SANDBOX"))}, fh)

    print(f"  ✓ draft created (deposition {dep_id})")
    print(f"    reserved DOI : {reserved}")
    print(f"    review/edit  : {_zenodo_base()}/uploads/{dep_id}")
    print(f"    publish with : python3 build.py doi {slug} --publish")
    print("    (publishing is permanent — review the record on Zenodo first.)")


def _write_doi(slug: str, doi: str):
    path, _ = _entry_for(slug)
    text = open(path).read()
    m = re.match(r"^---\n(.*?)\n---\n?", text, re.DOTALL)
    if not m:
        sys.exit("can't find frontmatter to update")
    fm = m.group(1)
    if re.search(r"^doi:.*$", fm, re.M):
        fm = re.sub(r"^doi:.*$", f"doi: {doi}", fm, flags=re.M)
    else:
        fm = fm.rstrip("\n") + f"\ndoi: {doi}"
    with open(path, "w") as fh:
        fh.write("---\n" + fm + "\n---\n" + text[m.end():])


def doi_publish(slug: str):
    token = _zenodo_token()
    statef = os.path.join(ZENODO_DIR, slug + ".json")
    if not os.path.exists(statef):
        sys.exit(f"no draft for '{slug}' — run `python3 build.py doi {slug}` first")
    st = json.load(open(statef))
    if bool(os.environ.get("ZENODO_SANDBOX")) != st.get("sandbox", False):
        sys.exit("ZENODO_SANDBOX setting differs from the draft — match it and retry")

    print(f"publishing '{slug}' on {_zenodo_base()} (this is permanent) …")
    rec = _zapi("POST", f"/api/deposit/depositions/{st['id']}/actions/publish", token)
    doi = rec.get("metadata", {}).get("doi") or rec.get("doi") or st.get("doi")
    _write_doi(slug, doi)
    os.remove(statef)
    print(f"  ✓ published — DOI {doi}")
    print(f"    record: https://doi.org/{doi}")
    print("    DOI written to the essay's frontmatter; run `python3 build.py` to update the page.")


# --------------------------------------------------------------------------- #
#  CLI
# --------------------------------------------------------------------------- #
def main(argv: list):
    cmd = argv[0] if argv else "build"
    if cmd == "cards":
        build_cards()
    elif cmd == "pdf":
        build_pdfs()
    elif cmd == "doi":
        rest = argv[1:]
        slug = next((a for a in rest if not a.startswith("-")), None)
        if not slug:
            sys.exit("usage: python3 build.py doi <slug> [--publish]")
        if "--publish" in rest:
            doi_publish(slug)
        else:
            doi_draft(slug)
    else:
        build_all()


if __name__ == "__main__":
    main(sys.argv[1:])
