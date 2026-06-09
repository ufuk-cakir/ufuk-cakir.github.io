/* ============================================================
   os-app.jsx — Ufuk Çakır's desktop environment
   (production build of the Claude Design prototype)
   ============================================================ */
const {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} = React;
const S = window.SITE;
const L = S.links;

/* touch devices open on a single tap (no double-click); small screens
   get a stacked grid + full-screen window sheets (see os.css @media). */
const TOUCH = typeof window !== "undefined" && ("ontouchstart" in window || window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
const isSmall = () => window.innerWidth <= 768;
const uid = () => "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/* local stand-in for the design tool's useTweaks (no host bridge) */
function useTweaks(defaults) {
  const [v, setV] = useState(defaults);
  const setTweak = useCallback((k, val) => setV(p => ({
    ...p,
    [k]: val
  })), []);
  return [v, setTweak];
}

/* ---------- generic pointer drag ---------- */
function beginDrag(e, sx, sy, onMove, onEnd) {
  if (e.button === 2) return;
  e.preventDefault();
  const ox = e.clientX,
    oy = e.clientY;
  let moved = false;
  const mv = ev => {
    const dx = ev.clientX - ox,
      dy = ev.clientY - oy;
    if (Math.hypot(dx, dy) > 3) moved = true;
    onMove(sx + dx, sy + dy, moved);
  };
  const up = () => {
    document.removeEventListener("pointermove", mv);
    document.removeEventListener("pointerup", up);
    onEnd && onEnd(moved);
  };
  document.addEventListener("pointermove", mv);
  document.addEventListener("pointerup", up);
}
function openHref(href) {
  if (href) window.open(href, "_blank", "noopener");
}

/* ---------- fuzzy search (Quick Search palette) ---------- */
function fuzzyScore(q, text) {
  if (!q) return 1;
  q = q.toLowerCase();
  const t = (text || "").toLowerCase();
  const sub = t.indexOf(q);
  if (sub !== -1) return 120 + (sub === 0 ? 30 : 0) + (t[sub - 1] === " " ? 15 : 0) - sub * 0.05;
  let ti = 0,
    score = 0,
    prev = -2;
  for (let qi = 0; qi < q.length; qi++) {
    const c = q[qi];
    let f = -1;
    for (let k = ti; k < t.length; k++) {
      if (t[k] === c) {
        f = k;
        break;
      }
    }
    if (f === -1) return -1;
    score += 1;
    if (f === prev + 1) score += 5;
    if (f === 0 || t[f - 1] === " " || t[f - 1] === "-") score += 8;
    prev = f;
    ti = f + 1;
  }
  return score;
}
function matchEntry(q, e) {
  const ts = fuzzyScore(q, e.title);
  const xs = fuzzyScore(q, e.text || e.title);
  if (ts < 0 && xs < 0) return -1;
  return Math.max(ts * 2, xs);
}

/* ---------- media preview (looping muted video / image) ---------- */
function Preview({
  media,
  className
}) {
  if (!media) return null;
  if (media.type === "video") {
    return /*#__PURE__*/React.createElement("video", {
      className: className,
      src: media.src,
      autoPlay: true,
      loop: true,
      playsInline: true,
      muted: true,
      preload: "metadata",
      ref: el => {
        if (el) el.muted = true;
      }
    });
  }
  return /*#__PURE__*/React.createElement("img", {
    className: className,
    src: media.src,
    alt: "",
    loading: "lazy"
  });
}

/* ---------- icon art by type ---------- */
function IconArt({
  type,
  src
}) {
  if (type === "photo") return /*#__PURE__*/React.createElement("img", {
    className: "art art-photo",
    src: src,
    alt: ""
  });
  if (type === "logo") return /*#__PURE__*/React.createElement("img", {
    className: "art art-logo",
    src: src,
    alt: ""
  });
  if (type === "about") return /*#__PURE__*/React.createElement(AppIcon, {
    from: "#0a72e8",
    to: "#5b3a8c",
    glyph: S.identity.initial
  });
  if (type === "embed") return /*#__PURE__*/React.createElement(DoomIcon, null);
  if (type === "terminal") return /*#__PURE__*/React.createElement(TerminalIcon, null);
  if (type === "news") return /*#__PURE__*/React.createElement(NewsIcon, null);
  if (type === "mail") return /*#__PURE__*/React.createElement(MailIcon, null);
  if (type === "folder") return /*#__PURE__*/React.createElement(FolderIcon, null);
  if (type === "txt") return /*#__PURE__*/React.createElement(DocIcon, {
    tag: "TXT",
    tagColor: "var(--accent)"
  });
  if (type === "pdf") return /*#__PURE__*/React.createElement(DocIcon, {
    tag: "PDF",
    tagColor: "#e5341c"
  });
  if (type === "image") return /*#__PURE__*/React.createElement(ImageIcon, null);
  return /*#__PURE__*/React.createElement(DocIcon, null);
}

/* preview thumbnail for a finder item (sneak peek), else its file icon */
function ItemThumb({
  item
}) {
  if (item.media) return /*#__PURE__*/React.createElement(Preview, {
    media: item.media,
    className: "art thumb"
  });
  return /*#__PURE__*/React.createElement(IconArt, {
    type: item.type
  });
}

/* ---------- desktop icon definitions ---------- */
const ICONS = [{
  id: "publications",
  type: "folder",
  label: "Publications",
  open: "publications"
}, {
  id: "projects",
  type: "folder",
  label: "Projects",
  open: "projects"
}, {
  id: "talks",
  type: "folder",
  label: "Talks",
  open: "talks"
}, {
  id: "writing",
  type: "folder",
  label: "Writing",
  open: "writing"
}, {
  id: "outreach",
  type: "folder",
  label: "Outreach",
  open: "outreach"
}, {
  id: "whyresearch",
  type: "txt",
  label: "Why Research?.txt",
  open: "whyresearch"
}, {
  id: "background",
  type: "txt",
  label: "Background.txt",
  open: "background"
}, {
  id: "ori",
  type: "logo",
  src: S.groups.ori.logo,
  label: "Oxford Robotics Institute",
  open: "ori"
}, {
  id: "ie",
  type: "logo",
  src: S.groups.ie.logo,
  label: "Intelligent Earth CDT",
  open: "ie"
}];
function defaultIconPos() {
  const W = window.innerWidth;
  const pos = {};
  if (W <= 768) {
    /* phones: a reachable top-left grid (widgets are hidden on mobile) */
    const cols = Math.max(3, Math.floor((W - 16) / 88));
    ICONS.forEach((ic, i) => {
      pos[ic.id] = {
        x: 12 + i % cols * 88,
        y: 40 + Math.floor(i / cols) * 92
      };
    });
    return pos;
  }
  const colX = [W - 100, W - 196, W - 292];
  ICONS.forEach((ic, i) => {
    const col = Math.floor(i / 4);
    pos[ic.id] = {
      x: colX[col] != null ? colX[col] : 8,
      y: 48 + i % 4 * 104
    };
  });
  return pos;
}
function defaultWidgetPos() {
  return {
    clock: {
      x: 40,
      y: 56
    },
    weather: {
      x: 40,
      y: 250
    },
    note: {
      x: 40,
      y: 452
    }
  };
}
const SIZE = {
  finder: [720, 460],
  text: [620, 558],
  detail: [600, 640],
  post: [820, 640],
  embed: [760, 580],
  about: [360, 470],
  mail: [400, 470],
  terminal: [680, 440],
  news: [680, 620]
};
const STORE_KEY = "cakir-os-v5";

/* ============================================================
   Window content
   ============================================================ */
function FinderContent({
  fkey,
  onItem
}) {
  /* favourites navigate the SAME window into that folder, with Back */
  const [stack, setStack] = useState([fkey]);
  useEffect(() => {
    setStack([fkey]);
  }, [fkey]);
  const curKey = stack[stack.length - 1];
  const f = FILES[curKey] || FILES[fkey];
  const fav = [["Publications", "publications"], ["Projects", "projects"], ["Talks", "talks"], ["Writing", "writing"], ["Outreach", "outreach"]];
  const go = key => setStack(s => key === s[s.length - 1] ? s : [...s, key]);
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fsidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sh"
  }, "Favourites"), fav.map(([nm, key]) => /*#__PURE__*/React.createElement("div", {
    key: key,
    className: "si" + (key === curKey ? " active" : ""),
    onClick: () => go(key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: "#3aa0ff"
    }
  }), nm))), /*#__PURE__*/React.createElement("div", {
    className: "fmain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftoolbar"
  }, stack.length > 1 && /*#__PURE__*/React.createElement("button", {
    className: "fback",
    onClick: back,
    title: "Back",
    "aria-label": "Back"
  }, "\u2039"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, f.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 11.5
    }
  }, f.items.length, " items")), f.view === "grid" ? /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, f.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "fitem",
    key: i,
    onClick: () => {
      if (TOUCH) onItem(it);
    },
    onDoubleClick: () => onItem(it),
    title: "Open"
  }, /*#__PURE__*/React.createElement(ItemThumb, {
    item: it
  }), /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, it.name || it.title), (it.meta || it.venue) && /*#__PURE__*/React.createElement("div", {
    className: "mt"
  }, it.meta || it.venue)))) : /*#__PURE__*/React.createElement("div", {
    className: "flist"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("span", null, "Name"), /*#__PURE__*/React.createElement("span", null, "Venue"), /*#__PURE__*/React.createElement("span", null, "Year")), f.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "lrow",
    key: i,
    onClick: () => {
      if (TOUCH) onItem(it);
    },
    onDoubleClick: () => onItem(it)
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, /*#__PURE__*/React.createElement(ItemThumb, {
    item: it
  }), /*#__PURE__*/React.createElement("span", {
    className: "nm-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm-title"
  }, it.title || it.name), it.keywords && it.keywords.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "kwchips"
  }, it.keywords.slice(0, 4).map(k => /*#__PURE__*/React.createElement("span", {
    className: "kw",
    key: k
  }, k))))), /*#__PURE__*/React.createElement("span", {
    className: "mt"
  }, it.venue || it.kind), /*#__PURE__*/React.createElement("span", {
    className: "mt"
  }, it.year || it.date))))));
}
function TextContent({
  f
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body textwin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "textwrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "doc"
  }, /*#__PURE__*/React.createElement("h1", null, f.heading), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, f.by), f.body.map((p, i) => p.ph ? /*#__PURE__*/React.createElement("p", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ph"
  }, p.text)) : /*#__PURE__*/React.createElement("p", {
    key: i,
    className: p.lead ? "lead" : ""
  }, p.text)))));
}
function DetailContent({
  f
}) {
  const d = f.detail || {};
  const title = d.title || d.name;
  const sub = [d.venue || d.meta, d.year].filter(Boolean).join(" · ");
  const text = d.abstract || d.blurb;
  const links = d.links || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body detailwin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detailwrap"
  }, d.media && /*#__PURE__*/React.createElement("div", {
    className: "dmedia"
  }, /*#__PURE__*/React.createElement(Preview, {
    media: d.media,
    className: "dmedia-el"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dbody"
  }, sub && /*#__PURE__*/React.createElement("div", {
    className: "dkicker"
  }, sub), /*#__PURE__*/React.createElement("h1", {
    className: "dtitle"
  }, title), text && /*#__PURE__*/React.createElement("p", {
    className: "dtext"
  }, text), d.keywords && d.keywords.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "dtags"
  }, d.keywords.map(k => /*#__PURE__*/React.createElement("span", {
    className: "dtag",
    key: k
  }, k))), links.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "dlinks"
  }, links.map((ln, i) => /*#__PURE__*/React.createElement("a", {
    className: "dbtn",
    key: i,
    href: ln.href,
    target: "_blank",
    rel: "noopener"
  }, ln.label || "Open ↗"))))));
}

/* ---------- highlight engine (reader annotations) ---------- */
function hlSkippable(el) {
  return el && el.classList && (el.classList.contains("katex") || el.classList.contains("katex-display") || el.classList.contains("anim-stage"));
}
function hlTextNodes(root) {
  const out = [];
  (function walk(n) {
    if (n.nodeType === 3) {
      if (n.nodeValue) out.push(n);
      return;
    }
    if (n.nodeType === 1) {
      if (hlSkippable(n)) return;
      for (let c = n.firstChild; c; c = c.nextSibling) walk(c);
    }
  })(root);
  return out;
}
function hlOffsetOf(nodes, node, off) {
  let t = 0;
  for (const n of nodes) {
    if (n === node) return t + off;
    t += n.nodeValue.length;
  }
  return -1;
}
function hlSelectionInfo(root) {
  const s = window.getSelection && window.getSelection();
  if (!s || !s.rangeCount || s.isCollapsed) return null;
  const r = s.getRangeAt(0);
  if (!root.contains(r.startContainer) || !root.contains(r.endContainer)) return null;
  const text = r.toString();
  if ((text || "").trim().length < 2) return null;
  const nodes = hlTextNodes(root);
  let a = hlOffsetOf(nodes, r.startContainer, r.startOffset),
    b = hlOffsetOf(nodes, r.endContainer, r.endOffset);
  if (a < 0 || b < 0) return null;
  if (a > b) {
    const t = a;
    a = b;
    b = t;
  }
  const rect = r.getBoundingClientRect();
  return {
    start: a,
    end: b,
    text: text,
    rect: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      bottom: rect.bottom
    }
  };
}
function hlClear(root) {
  root.querySelectorAll("mark.usr-hl").forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
  root.normalize();
}
function hlApply(root, start, end, id, hasNote) {
  const nodes = hlTextNodes(root);
  const targets = [];
  let pos = 0;
  for (const n of nodes) {
    const len = n.nodeValue.length,
      ns = pos,
      ne = pos + len;
    pos = ne;
    if (ne <= start || ns >= end) continue;
    targets.push({
      node: n,
      from: Math.max(start, ns) - ns,
      to: Math.min(end, ne) - ns
    });
  }
  targets.forEach(t => {
    try {
      const rg = document.createRange();
      rg.setStart(t.node, t.from);
      rg.setEnd(t.node, t.to);
      const m = document.createElement("mark");
      m.className = "usr-hl" + (hasNote ? " has-note" : "");
      m.dataset.hlId = id;
      rg.surroundContents(m);
    } catch (e) {}
  });
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function blocksToHtml(blocks) {
  return (blocks || []).map(bl => {
    if (!bl) return "";
    if (bl.type === "h") return "<h2>" + esc(bl.text) + "</h2>";
    if (bl.type === "h3") return "<h3>" + esc(bl.text) + "</h3>";
    if (bl.type === "quote") return "<blockquote>" + esc(bl.text) + "</blockquote>";
    if (bl.type === "media" && bl.media) {
      const m = bl.media;
      const el = m.type === "video" ? '<video autoplay loop muted playsinline preload="auto" src="' + esc(m.src) + '"></video>' : '<img loading="lazy" src="' + esc(m.src) + '" alt="' + esc(bl.caption || "") + '">';
      return "<figure>" + el + (bl.caption ? "<figcaption>" + esc(bl.caption) + "</figcaption>" : "") + "</figure>";
    }
    if (bl.type === "links") return '<div class="dlinks">' + (bl.links || []).map(l => '<a class="dbtn" target="_blank" rel="noopener" href="' + esc(l.href) + '">' + esc(l.label || "Open ↗") + "</a>").join("") + "</div>";
    return "<p>" + esc(bl.text) + "</p>";
  }).join("");
}
function Highlighter({
  contentRef,
  docId,
  docTitle,
  ready,
  focused
}) {
  const KEY = "cakir-hl:" + docId;
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cakir-hl:" + docId)) || [];
    } catch (e) {
      return [];
    }
  });
  const [sel, setSel] = useState(null);
  const [active, setActive] = useState(null);
  const [panel, setPanel] = useState(false);
  useEffect(() => {
    const root = contentRef.current;
    if (!ready || !root) return;
    hlClear(root);
    items.forEach(h => hlApply(root, h.start, h.end, h.id, !!h.note));
  }, [ready, items]);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);
  useEffect(() => {
    const root = contentRef.current;
    if (!ready || !root) return;
    const onUp = () => setTimeout(() => {
      const info = hlSelectionInfo(root);
      if (info) setSel(info);
    }, 0);
    const onDown = e => {
      if (!(e.target.closest && e.target.closest(".hl-ui"))) setSel(null);
    };
    const onClick = e => {
      const m = e.target.closest && e.target.closest("mark.usr-hl");
      if (m) {
        const r = m.getBoundingClientRect();
        setActive({
          id: m.dataset.hlId,
          x: r.left,
          y: r.bottom
        });
        setSel(null);
      }
    };
    root.addEventListener("mouseup", onUp);
    root.addEventListener("click", onClick);
    document.addEventListener("mousedown", onDown);
    return () => {
      root.removeEventListener("mouseup", onUp);
      root.removeEventListener("click", onClick);
      document.removeEventListener("mousedown", onDown);
    };
  }, [ready]);
  if (!focused) return null;
  const addHl = () => {
    if (!sel) return;
    const id = "h" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
    const x = sel.rect.left,
      y = sel.rect.bottom;
    setItems(p => [...p, {
      id,
      start: sel.start,
      end: sel.end,
      text: sel.text,
      note: ""
    }]);
    if (window.getSelection) window.getSelection().removeAllRanges();
    setSel(null);
    setTimeout(() => setActive({
      id,
      x,
      y
    }), 60);
  };
  const setNote = (id, note) => setItems(p => p.map(h => h.id === id ? {
    ...h,
    note
  } : h));
  const delHl = id => {
    setItems(p => p.filter(h => h.id !== id));
    setActive(null);
  };
  const activeItem = active && items.find(h => h.id === active.id);
  const exportMd = () => {
    const L = ["# Highlights — " + (docTitle || docId), ""];
    items.forEach(h => {
      L.push("> " + h.text.replace(/\s+/g, " ").trim());
      if (h.note) {
        L.push("");
        L.push(h.note);
      }
      L.push("");
    });
    const blob = new Blob([L.join("\n")], {
      type: "text/markdown"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (docId || "highlights") + "-highlights.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, sel && /*#__PURE__*/React.createElement("button", {
    className: "hl-ui hl-btn",
    style: {
      left: Math.round(sel.rect.left + sel.rect.width / 2),
      top: Math.round(sel.rect.top - 8)
    },
    onMouseDown: e => e.preventDefault(),
    onClick: addHl
  }, "\u270F\uFE0E Highlight"), activeItem && /*#__PURE__*/React.createElement("div", {
    className: "hl-ui hl-note",
    style: {
      left: Math.round(Math.min(active.x, window.innerWidth - 270)),
      top: Math.round(active.y + 6)
    },
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("textarea", {
    autoFocus: true,
    value: activeItem.note,
    placeholder: "Add a note\u2026",
    onChange: e => setNote(active.id, e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "hl-note-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "hl-del",
    onClick: () => delHl(active.id)
  }, "Delete"), /*#__PURE__*/React.createElement("button", {
    className: "hl-done",
    onClick: () => setActive(null)
  }, "Done"))), /*#__PURE__*/React.createElement("button", {
    className: "hl-ui hl-pill",
    onClick: () => setPanel(true)
  }, "\u2726 Highlights", items.length ? " · " + items.length : ""), panel && /*#__PURE__*/React.createElement("div", {
    className: "hl-ui hl-panel-scrim",
    onMouseDown: () => setPanel(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "hl-panel",
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "hl-panel-hd"
  }, /*#__PURE__*/React.createElement("b", null, "Your highlights"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("button", {
    onClick: exportMd,
    disabled: !items.length
  }, "Export .md"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPanel(false)
  }, "Close"))), /*#__PURE__*/React.createElement("div", {
    className: "hl-panel-body"
  }, !items.length && /*#__PURE__*/React.createElement("div", {
    className: "hl-empty"
  }, "Select any text in the post to highlight it, then click a highlight to attach a note. Everything is saved in your browser, and you can export it."), items.map(h => /*#__PURE__*/React.createElement("div", {
    className: "hl-row",
    key: h.id
  }, /*#__PURE__*/React.createElement("blockquote", null, h.text), /*#__PURE__*/React.createElement("textarea", {
    value: h.note,
    placeholder: "Note\u2026",
    onChange: e => setNote(h.id, e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "hl-del",
    onClick: () => delHl(h.id)
  }, "Remove")))))));
}

/* reading view — pulls the real /blog post body into the OS DOM and
   renders it natively in an editor-style document (no iframe), so it
   matches the rest of the OS. Full-screen + deep-link handled by Win. */
function PostContent({
  f,
  win,
  onToggleFull,
  focused
}) {
  const post = f.post;
  const ref = useRef(null);
  const [state, setState] = useState("loading");
  useEffect(() => {
    let alive = true;
    setState("loading");
    fetch(post.url).then(r => r.text()).then(html => {
      if (!alive || !ref.current) return;
      const doc = new DOMParser().parseFromString(html, "text/html");
      const bodyEl = doc.querySelector(".post-body") || doc.querySelector("article") || doc.body;
      const base = post.url.replace(/[^/]*$/, ""); // e.g. "blog/"
      // rewrite relative asset URLs so they resolve from the site root
      bodyEl.querySelectorAll("[src],[poster],[href]").forEach(el => {
        ["src", "poster", "href"].forEach(a => {
          const v = el.getAttribute(a);
          if (v && !/^(https?:|mailto:|data:|#|\/)/.test(v)) el.setAttribute(a, base + v);
        });
      });
      // make embedded animations play on their own (blog.js isn't here)
      bodyEl.querySelectorAll("video").forEach(v => {
        v.setAttribute("autoplay", "");
        v.setAttribute("loop", "");
        v.setAttribute("playsinline", "");
        v.muted = true;
        v.setAttribute("preload", "auto");
      });
      ref.current.innerHTML = "";
      ref.current.appendChild(document.importNode(bodyEl, true));
      setState("ready");
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(ref.current, {
            delimiters: [{
              left: "$$",
              right: "$$",
              display: true
            }, {
              left: "\\[",
              right: "\\]",
              display: true
            }, {
              left: "\\(",
              right: "\\)",
              display: false
            }, {
              left: "$",
              right: "$",
              display: false
            }],
            throwOnError: false
          });
        } catch (e) {}
      }
      ref.current.querySelectorAll("video").forEach(v => {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      });
    }).catch(() => {
      if (alive) setState("error");
    });
    return () => {
      alive = false;
    };
  }, [post.url]);
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body postwin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "readerbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-title"
  }, post.slug, ".md"), /*#__PURE__*/React.createElement("span", {
    className: "rb-actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "rb-link",
    href: post.url,
    target: "_blank",
    rel: "noopener"
  }, "Open page \u2197"), /*#__PURE__*/React.createElement("button", {
    className: "rb-full",
    onClick: () => onToggleFull(win.wid)
  }, win.full ? "Exit full screen" : "⤢ Full screen"))), /*#__PURE__*/React.createElement("div", {
    className: "reader-scroll"
  }, /*#__PURE__*/React.createElement("article", {
    className: "reader-doc"
  }, /*#__PURE__*/React.createElement("header", {
    className: "reader-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "reader-kicker"
  }, [post.kind, post.date].filter(Boolean).join(" · ")), /*#__PURE__*/React.createElement("h1", null, post.title)), state === "loading" && /*#__PURE__*/React.createElement("div", {
    className: "reader-status"
  }, "Loading\u2026"), state === "error" && /*#__PURE__*/React.createElement("div", {
    className: "reader-status"
  }, "Couldn\u2019t load this post. ", /*#__PURE__*/React.createElement("a", {
    href: post.url,
    target: "_blank",
    rel: "noopener"
  }, "Open it directly \u2197")), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "reader-content"
  }))), /*#__PURE__*/React.createElement(Highlighter, {
    contentRef: ref,
    docId: post.slug,
    docTitle: post.title,
    ready: state === "ready",
    focused: focused
  }));
}

/* a block from a native write-up (projects) */
function Block({
  bl
}) {
  if (!bl) return null;
  if (bl.type === "h") return /*#__PURE__*/React.createElement("h2", null, bl.text);
  if (bl.type === "h3") return /*#__PURE__*/React.createElement("h3", null, bl.text);
  if (bl.type === "quote") return /*#__PURE__*/React.createElement("blockquote", null, bl.text);
  if (bl.type === "media") return /*#__PURE__*/React.createElement("figure", null, bl.media && (bl.media.type === "video" ? /*#__PURE__*/React.createElement(Preview, {
    media: bl.media,
    className: ""
  }) : /*#__PURE__*/React.createElement("img", {
    src: bl.media.src,
    alt: bl.caption || "",
    loading: "lazy"
  })), bl.caption && /*#__PURE__*/React.createElement("figcaption", null, bl.caption));
  if (bl.type === "links") return /*#__PURE__*/React.createElement("div", {
    className: "dlinks",
    style: {
      marginTop: 6
    }
  }, bl.links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    className: "dbtn",
    key: i,
    href: l.href,
    target: "_blank",
    rel: "noopener"
  }, l.label || "Open ↗")));
  return /*#__PURE__*/React.createElement("p", null, bl.text);
}

/* native write-up reader (projects) — same editor styling as Writing.
   Content is injected as HTML (like the post reader) so highlight marks
   aren't wiped by React re-renders. */
function ArticleContent({
  f,
  win,
  onToggleFull,
  focused
}) {
  const a = f.article;
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = blocksToHtml(a.blocks);
    ref.current.querySelectorAll("video").forEach(v => {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
    setReady(true);
  }, [a]);
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body postwin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "readerbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-title"
  }, (a.slug || "project") + ".md"), /*#__PURE__*/React.createElement("span", {
    className: "rb-actions"
  }, a.href && /*#__PURE__*/React.createElement("a", {
    className: "rb-link",
    href: a.href,
    target: "_blank",
    rel: "noopener"
  }, "Open page \u2197"), /*#__PURE__*/React.createElement("button", {
    className: "rb-full",
    onClick: () => onToggleFull(win.wid)
  }, win.full ? "Exit full screen" : "⤢ Full screen"))), /*#__PURE__*/React.createElement("div", {
    className: "reader-scroll"
  }, /*#__PURE__*/React.createElement("article", {
    className: "reader-doc"
  }, /*#__PURE__*/React.createElement("header", {
    className: "reader-head"
  }, a.kicker && /*#__PURE__*/React.createElement("div", {
    className: "reader-kicker"
  }, a.kicker), /*#__PURE__*/React.createElement("h1", null, a.title)), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "reader-content"
  }))), /*#__PURE__*/React.createElement(Highlighter, {
    contentRef: ref,
    docId: "project-" + a.slug,
    docTitle: a.title,
    ready: ready,
    focused: focused
  }));
}

/* generic embedded app (e.g. DOOM, a video). YouTube embeds get their
   volume turned down so an autoplaying rickroll isn't deafening. */
function EmbedContent({
  f
}) {
  const ref = useRef(null);
  const isYT = /youtube(-nocookie)?\.com\/embed/.test(f.url);
  const src = isYT ? f.url + (f.url.includes("?") ? "&" : "?") + "enablejsapi=1" : f.url;
  const onLoad = () => {
    if (!isYT || !ref.current) return;
    const post = (func, args) => {
      try {
        ref.current.contentWindow.postMessage(JSON.stringify({
          event: "command",
          func,
          args: args || []
        }), "*");
      } catch (e) {}
    };
    [250, 800, 1600].forEach(t => setTimeout(() => {
      post("setVolume", [15]);
      post("playVideo");
    }, t));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body embedwin"
  }, /*#__PURE__*/React.createElement("iframe", {
    ref: ref,
    className: "embed-frame",
    src: src,
    title: f.title,
    onLoad: onLoad,
    allow: "autoplay; fullscreen; encrypted-media; gamepad",
    allowFullScreen: true
  }));
}
function AboutContent() {
  const id = S.identity;
  const items = [L.email && ["Email", "mailto:" + L.email], L.scholar && ["Scholar", L.scholar], L.github && ["GitHub", L.github], L.linkedin && ["LinkedIn", L.linkedin], L.orcid && ["ORCID", L.orcid]].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body aboutwin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aboutwrap"
  }, id.photoThumb ? /*#__PURE__*/React.createElement("img", {
    className: "ava ava-photo",
    src: id.photoThumb,
    alt: id.name
  }) : /*#__PURE__*/React.createElement("div", {
    className: "ava"
  }, id.initial), /*#__PURE__*/React.createElement("h2", null, id.name), /*#__PURE__*/React.createElement("div", {
    className: "role"
  }, id.role), /*#__PURE__*/React.createElement("p", null, S.about.p), /*#__PURE__*/React.createElement("div", {
    className: "links"
  }, items.map(([t, h]) => /*#__PURE__*/React.createElement("a", {
    key: t,
    href: h,
    target: "_blank",
    rel: "noopener"
  }, t)))));
}

/* ---------- Quick Search command palette ---------- */
function Palette({
  index,
  onClose
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);
  const results = useMemo(() => {
    if (!q.trim()) return index.filter(e => e.primary).slice(0, 8);
    return index.map(e => ({
      e,
      s: matchEntry(q.trim(), e)
    })).filter(x => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, 8).map(x => x.e);
  }, [q, index]);
  useEffect(() => {
    setSel(0);
  }, [q]);
  const choose = r => {
    if (r) {
      r.run();
      onClose();
    }
  };
  const onKey = e => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel(s => Math.min(results.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel(s => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[sel]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "pal-scrim",
    onPointerDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "palette",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "pal-input"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 16 16",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "6.7",
    cy: "6.7",
    r: "4.6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10.2",
    y1: "10.2",
    x2: "14.5",
    y2: "14.5",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: onKey,
    placeholder: "Search publications, talks, writing, projects\u2026"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pal-esc"
  }, "esc")), /*#__PURE__*/React.createElement("div", {
    className: "pal-results"
  }, results.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "pal-empty"
  }, "No matches for \u201C", q, "\u201D"), results.map((r, i) => /*#__PURE__*/React.createElement("div", {
    className: "pal-row" + (i === sel ? " sel" : ""),
    key: r.key,
    onPointerEnter: () => setSel(i),
    onClick: () => choose(r)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pal-ic"
  }, /*#__PURE__*/React.createElement(IconArt, {
    type: r.type,
    src: r.src
  })), /*#__PURE__*/React.createElement("span", {
    className: "pal-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pal-title"
  }, r.title), r.sub && /*#__PURE__*/React.createElement("span", {
    className: "pal-sub"
  }, r.sub)), /*#__PURE__*/React.createElement("span", {
    className: "pal-cat"
  }, r.cat))))));
}
function MailContent() {
  const email = L.email;
  const c = S.contact || {};
  const mailto = "mailto:" + email + (c.subject ? "?subject=" + encodeURIComponent(c.subject) : "");
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body mailwin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mailwrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mail-ic"
  }, /*#__PURE__*/React.createElement(MailIcon, null)), /*#__PURE__*/React.createElement("h2", null, "Get in touch"), c.blurb && /*#__PURE__*/React.createElement("p", null, c.blurb), /*#__PURE__*/React.createElement("a", {
    className: "mail-addr",
    href: mailto
  }, email), /*#__PURE__*/React.createElement("a", {
    className: "mail-btn",
    href: mailto
  }, "Compose email \u2197")));
}

/* ---------- window shell ---------- */
function Win({
  win,
  f,
  focused,
  onFocus,
  onClose,
  onMin,
  onZoom,
  onDrag,
  onOpen,
  onItem,
  onToggleFull
}) {
  const ttlDown = e => {
    onFocus();
    beginDrag(e, win.x, win.y, (x, y) => onDrag(win.wid, Math.max(28, x), Math.max(28, y)));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "window" + (focused ? " focused" : "") + (win.full ? " full" : "") + (win.closing ? " closing" : " opening"),
    style: {
      left: win.x,
      top: win.y,
      width: win.w,
      height: win.h,
      zIndex: win.z,
      display: win.min ? "none" : "flex"
    },
    onPointerDown: onFocus
  }, /*#__PURE__*/React.createElement("div", {
    className: "titlebar",
    onPointerDown: ttlDown,
    onDoubleClick: () => onZoom(win.wid)
  }, /*#__PURE__*/React.createElement("div", {
    className: "lights",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "light r",
    onClick: () => onClose(win.wid)
  }), /*#__PURE__*/React.createElement("span", {
    className: "light y",
    onClick: () => onMin(win.wid)
  }), /*#__PURE__*/React.createElement("span", {
    className: "light g",
    onClick: () => onZoom(win.wid)
  })), /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, win.title || f.title)), f.kind === "finder" && /*#__PURE__*/React.createElement(FinderContent, {
    fkey: win.openId,
    onItem: onItem
  }), f.kind === "text" && /*#__PURE__*/React.createElement(TextContent, {
    f: f
  }), f.kind === "detail" && /*#__PURE__*/React.createElement(DetailContent, {
    f: f
  }), f.kind === "post" && /*#__PURE__*/React.createElement(PostContent, {
    f: f,
    win: win,
    onToggleFull: onToggleFull,
    focused: focused
  }), f.kind === "article" && /*#__PURE__*/React.createElement(ArticleContent, {
    f: f,
    win: win,
    onToggleFull: onToggleFull,
    focused: focused
  }), f.kind === "embed" && /*#__PURE__*/React.createElement(EmbedContent, {
    f: f
  }), f.kind === "mail" && /*#__PURE__*/React.createElement(MailContent, null), f.kind === "terminal" && window.TerminalApp && React.createElement(window.TerminalApp), f.kind === "news" && window.NewsApp && React.createElement(window.NewsApp), f.kind === "about" && /*#__PURE__*/React.createElement(AboutContent, null));
}

/* ============================================================
   Widgets
   ============================================================ */
function ClockWidget({
  now
}) {
  /* always Oxford (Europe/London) time, regardless of the visitor's zone */
  const tp = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(now);
  const get = t => (tp.find(p => p.type === t) || {}).value || "00";
  const hh = get("hour"),
    mm = get("minute"),
    ss = get("second");
  const date = now.toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "w-clock"
  }, /*#__PURE__*/React.createElement("div", {
    className: "time"
  }, hh, ":", mm, /*#__PURE__*/React.createElement("span", {
    className: "ss"
  }, " ", ss)), /*#__PURE__*/React.createElement("div", {
    className: "date"
  }, date), /*#__PURE__*/React.createElement("div", {
    className: "loc"
  }, S.identity.location));
}
function WeatherWidget() {
  return /*#__PURE__*/React.createElement("div", {
    className: "w-weather"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "city"
  }, "Oxford"), /*#__PURE__*/React.createElement("div", {
    className: "now"
  }, "Now")), /*#__PURE__*/React.createElement("svg", {
    width: "34",
    height: "34",
    viewBox: "0 0 40 40"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "15",
    r: "8",
    fill: "#ffd23e"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "24",
    cy: "24",
    rx: "13",
    ry: "8",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "16",
    cy: "26",
    rx: "10",
    ry: "7",
    fill: "#f0f0f3"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "temp"
  }, "12\xB0"), /*#__PURE__*/React.createElement("div", {
    className: "cond"
  }, "Partly Cloudy"), /*#__PURE__*/React.createElement("div", {
    className: "hi"
  }, "H:14\xB0  L:7\xB0"));
}
function NoteWidget() {
  return /*#__PURE__*/React.createElement("div", {
    className: "w-note"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ttl"
  }, "Currently"), S.identity.currently.map((line, i) => /*#__PURE__*/React.createElement("div", {
    className: "ln",
    key: i
  }, line)));
}

/* ============================================================
   App
   ============================================================ */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const saved = useRef(null);
  if (saved.current === null) {
    try {
      saved.current = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      saved.current = {};
    }
  }
  const s0 = saved.current;
  const [iconPos, setIconPos] = useState(() => isSmall() ? defaultIconPos() : {
    ...defaultIconPos(),
    ...(s0.iconPos || {})
  });
  const [widgetPos, setWidgetPos] = useState(() => ({
    ...defaultWidgetPos(),
    ...(s0.widgetPos || {})
  }));
  const [windows, setWindows] = useState(() => s0.windows || []);
  const [sel, setSel] = useState(null);
  const [now, setNow] = useState(new Date());
  const [openMenu, setOpenMenu] = useState(null);
  const [bounce, setBounce] = useState(null);
  const [hint, setHint] = useState(!s0.seen);
  const [palOpen, setPalOpen] = useState(false);
  const palOpenRef = useRef(false);
  useEffect(() => {
    palOpenRef.current = palOpen;
  }, [palOpen]);
  const topZ = useRef(Math.max(100, s0.topZ || 100));
  const bootHash = useRef(typeof location !== "undefined" ? location.hash || "" : "");

  /* clock */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  /* dismiss hint */
  useEffect(() => {
    if (hint) {
      const id = setTimeout(() => setHint(false), 4200);
      return () => clearTimeout(id);
    }
  }, [hint]);

  /* accent + wallpaper vars */
  useEffect(() => {
    const a = t.accent || "#0a72e8";
    document.documentElement.style.setProperty("--accent", a);
    document.documentElement.style.setProperty("--accent-soft", a + "33");
    document.documentElement.style.setProperty("--sel", a);
  }, [t.accent]);

  /* persist */
  useEffect(() => {
    const snap = {
      iconPos,
      widgetPos,
      windows: windows.filter(w => !w.closing),
      topZ: topZ.current,
      seen: true
    };
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(snap));
    } catch (e) {}
  }, [iconPos, widgetPos, windows]);
  const nextZ = () => topZ.current += 1;
  const focusWin = useCallback(wid => {
    setWindows(ws => ws.map(w => w.wid === wid ? {
      ...w,
      z: nextZ()
    } : w));
  }, []);
  const placeWin = (n, w, h, center) => {
    if (center) return {
      x: Math.max(24, Math.round((window.innerWidth - w) / 2)),
      y: Math.max(44, Math.round((window.innerHeight - h) / 2))
    };
    return {
      x: Math.max(24, Math.round((window.innerWidth - w) / 2) + n % 5 * 30 - 60),
      y: Math.max(44, Math.round((window.innerHeight - h) / 2) + n % 5 * 26 - 50)
    };
  };
  const openFile = useCallback((key, titleOverride) => {
    const f = FILES[key];
    if (!f) return;
    setWindows(ws => {
      const ex = ws.find(w => w.openId === key && !w.closing);
      if (ex) return ws.map(w => w.wid === ex.wid ? {
        ...w,
        min: false,
        z: nextZ()
      } : w);
      const [w, h] = SIZE[f.kind] || [640, 460];
      const {
        x,
        y
      } = placeWin(ws.length, w, h, key === "about");
      return [...ws, {
        wid: uid(),
        openId: key,
        title: titleOverride,
        x,
        y,
        w,
        h,
        z: nextZ(),
        min: false
      }];
    });
  }, []);
  const openDetail = useCallback(item => {
    const key = "detail:" + (item.title || item.name);
    setWindows(ws => {
      const ex = ws.find(w => w.openId === key && !w.closing);
      if (ex) return ws.map(w => w.wid === ex.wid ? {
        ...w,
        min: false,
        z: nextZ()
      } : w);
      const [w, h] = SIZE.detail;
      const {
        x,
        y
      } = placeWin(ws.length, w, h);
      return [...ws, {
        wid: uid(),
        openId: key,
        detail: item,
        title: item.title || item.name,
        x,
        y,
        w,
        h,
        z: nextZ(),
        min: false
      }];
    });
  }, []);
  const openTextDoc = useCallback(item => {
    const key = "doc:" + (item.name || item.title);
    setWindows(ws => {
      const ex = ws.find(w => w.openId === key && !w.closing);
      if (ex) return ws.map(w => w.wid === ex.wid ? {
        ...w,
        min: false,
        z: nextZ()
      } : w);
      const [w, h] = SIZE.text;
      const {
        x,
        y
      } = placeWin(ws.length, w, h);
      return [...ws, {
        wid: uid(),
        openId: key,
        doc: item.doc,
        title: item.name || item.title,
        x,
        y,
        w,
        h,
        z: nextZ(),
        min: false
      }];
    });
  }, []);
  const openPost = useCallback((post, full) => {
    const key = "post:" + post.slug;
    setWindows(ws => {
      const ex = ws.find(w => w.openId === key && !w.closing);
      if (ex) return ws.map(w => w.wid === ex.wid ? {
        ...w,
        min: false,
        full: full || w.full,
        z: nextZ()
      } : w);
      const [w, h] = SIZE.post;
      const {
        x,
        y
      } = placeWin(ws.length, w, h, !!full);
      return [...ws, {
        wid: uid(),
        openId: key,
        post,
        title: post.title,
        x,
        y,
        w,
        h,
        full: !!full,
        z: nextZ(),
        min: false
      }];
    });
  }, []);
  const openArticle = useCallback(item => {
    const key = "article:" + (item.name || item.title);
    setWindows(ws => {
      const ex = ws.find(w => w.openId === key && !w.closing);
      if (ex) return ws.map(w => w.wid === ex.wid ? {
        ...w,
        min: false,
        z: nextZ()
      } : w);
      const [w, h] = SIZE.post;
      const {
        x,
        y
      } = placeWin(ws.length, w, h);
      const href = item.links && item.links[0] && item.links[0].href || item.href;
      const article = {
        title: item.name || item.title,
        kicker: item.meta || item.venue,
        blocks: item.body,
        slug: slugify(item.name || item.title),
        href
      };
      return [...ws, {
        wid: uid(),
        openId: key,
        article,
        title: item.name || item.title,
        x,
        y,
        w,
        h,
        z: nextZ(),
        min: false
      }];
    });
  }, []);

  /* open an embedded page (e.g. a video) in its own in-OS window */
  const openEmbed = useCallback((url, title) => {
    const key = "embed:" + url;
    setWindows(ws => {
      const ex = ws.find(w => w.openId === key && !w.closing);
      if (ex) return ws.map(w => w.wid === ex.wid ? {
        ...w,
        min: false,
        z: nextZ()
      } : w);
      const [w, h] = SIZE.embed;
      const {
        x,
        y
      } = placeWin(ws.length, w, h);
      return [...ws, {
        wid: uid(),
        openId: key,
        embed: {
          url
        },
        title: title || "Window",
        x,
        y,
        w,
        h,
        z: nextZ(),
        min: false
      }];
    });
  }, []);

  /* bridge for self-contained apps (Terminal, …) to open OS windows */
  useEffect(() => {
    const onOpen = e => {
      const d = e && e.detail || {};
      if (d.url) openEmbed(d.url, d.title);else if (d.key) openFile(d.key);
    };
    window.addEventListener("os-open", onOpen);
    return () => window.removeEventListener("os-open", onOpen);
  }, [openEmbed, openFile]);

  /* item double-click: post → reader; text doc → text window; rich → detail; bare link → open */
  const openItem = useCallback(it => {
    if (it.slug && it.url) return openPost(it);
    if (it.deck) return openEmbed(it.deck, it.title || it.name);
    if (it.body) return openArticle(it);
    if (it.doc) return openTextDoc(it);
    const rich = it.blurb || it.abstract || it.media || it.keywords && it.keywords.length;
    if (rich) return openDetail(it);
    const href = it.links && it.links[0] && it.links[0].href;
    if (href) return openHref(href);
    openDetail(it);
  }, [openDetail, openTextDoc, openPost, openArticle, openEmbed]);
  const closeWin = useCallback(wid => {
    setWindows(ws => ws.map(w => w.wid === wid ? {
      ...w,
      closing: true,
      full: false
    } : w));
    setTimeout(() => setWindows(ws => ws.filter(w => w.wid !== wid)), 180);
  }, []);
  const minWin = useCallback(wid => setWindows(ws => ws.map(w => w.wid === wid ? {
    ...w,
    min: true,
    full: false
  } : w)), []);
  const zoomWin = useCallback(wid => {
    setWindows(ws => ws.map(w => {
      if (w.wid !== wid) return w;
      if (w._z) {
        const r = w._z;
        return {
          ...w,
          x: r.x,
          y: r.y,
          w: r.w,
          h: r.h,
          _z: null
        };
      }
      return {
        ...w,
        _z: {
          x: w.x,
          y: w.y,
          w: w.w,
          h: w.h
        },
        x: 60,
        y: 44,
        w: window.innerWidth - 120,
        h: window.innerHeight - 120
      };
    }));
  }, []);
  const dragWin = useCallback((wid, x, y) => setWindows(ws => ws.map(w => w.wid === wid ? {
    ...w,
    x,
    y
  } : w)), []);
  const toggleFull = useCallback(wid => {
    setWindows(ws => ws.map(w => w.wid === wid ? {
      ...w,
      full: !w.full,
      min: false,
      z: nextZ()
    } : w));
  }, []);

  /* deep-link: #read/<slug> opens that post full-screen */
  const handleHash = useCallback(() => {
    const m = (location.hash || "").match(/^#read\/(.+)$/);
    if (!m) return;
    const slug = decodeURIComponent(m[1]);
    const post = (S.writing || []).find(p => p.slug === slug);
    if (post) openPost(post, true);
  }, [openPost]);
  useEffect(() => {
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [handleHash]);

  /* keep the URL hash in sync with a full-screen post (shareable link) */
  useEffect(() => {
    const fp = windows.find(w => w.full && w.post && !w.closing && !w.min);
    if (fp) {
      const want = "#read/" + fp.post.slug;
      if (location.hash !== want) history.replaceState(null, "", want);
    } else if ((location.hash || "").startsWith("#read/")) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }, [windows]);

  /* greet first-time visitors with the About card (unless deep-linking) */
  useEffect(() => {
    if (bootHash.current.startsWith("#read/")) return; /* deep-linked to a post */
    if (isSmall()) return; /* don't cover a small screen on first load */
    if (!s0.seen && (!s0.windows || s0.windows.length === 0)) openFile("about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* global keys: ⌘K / Ctrl-K palette, Esc closes palette / exits full screen */
  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPalOpen(p => !p);
        return;
      }
      if (e.key === "Escape") {
        if (palOpenRef.current) {
          setPalOpen(false);
          return;
        }
        setWindows(ws => ws.some(w => w.full) ? ws.map(w => w.full ? {
          ...w,
          full: false
        } : w) : ws);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const dockOpen = key => {
    setBounce(key);
    setTimeout(() => setBounce(null), 620);
    openFile(key);
  };
  const cleanUp = () => {
    setIconPos(defaultIconPos());
    setWidgetPos(defaultWidgetPos());
  };
  const resetAll = () => {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch (e) {}
    setWindows([]);
    setIconPos(defaultIconPos());
    setWidgetPos(defaultWidgetPos());
  };
  const deskClick = e => {
    if (e.target.classList.contains("desktop") || e.target.classList.contains("wallpaper") || e.target.classList.contains("layer-deck")) {
      setSel(null);
      setOpenMenu(null);
    }
  };
  const lightWP = t.wallpaper === "paper" || t.wallpaper === "mono";

  /* dock config */
  const DOCK = [{
    id: "search",
    node: /*#__PURE__*/React.createElement(SearchIcon, null),
    label: "Search",
    fn: () => setPalOpen(true)
  }, {
    id: "about",
    node: /*#__PURE__*/React.createElement(AppIcon, {
      from: "#0a72e8",
      to: "#5b3a8c",
      glyph: S.identity.initial
    }),
    label: "About",
    key: "about"
  }, {
    id: "publications",
    node: /*#__PURE__*/React.createElement(FolderIcon, null),
    label: "Publications",
    key: "publications"
  }, {
    id: "projects",
    node: /*#__PURE__*/React.createElement(FolderIcon, null),
    label: "Projects",
    key: "projects"
  }, {
    id: "talks",
    node: /*#__PURE__*/React.createElement(FolderIcon, null),
    label: "Talks",
    key: "talks"
  }, {
    id: "writing",
    node: /*#__PURE__*/React.createElement(FolderIcon, null),
    label: "Writing",
    key: "writing"
  }, {
    id: "outreach",
    node: /*#__PURE__*/React.createElement(FolderIcon, null),
    label: "Outreach",
    key: "outreach"
  }, {
    id: "news",
    node: /*#__PURE__*/React.createElement(NewsIcon, null),
    label: "News",
    key: "news"
  }, {
    sep: true
  }, ...(L.email ? [{
    id: "mail",
    node: /*#__PURE__*/React.createElement(MailIcon, null),
    label: "Mail",
    key: "mail"
  }] : []), {
    id: "scholar",
    node: /*#__PURE__*/React.createElement(GlobeIcon, null),
    label: "Scholar",
    href: L.scholar
  }, {
    id: "github",
    node: /*#__PURE__*/React.createElement(GitHubIcon, null),
    label: "GitHub",
    href: L.github
  }, {
    sep: true
  }, {
    id: "terminal",
    node: /*#__PURE__*/React.createElement(TerminalIcon, null),
    label: "Terminal",
    key: "terminal"
  }];
  const isRunning = key => key && windows.some(w => w.openId === key && !w.closing);

  /* search index for the Quick Search palette */
  const searchIndex = useMemo(() => {
    const out = [];
    const apps = [{
      key: "about",
      title: "About Me",
      cat: "App",
      type: "about",
      run: () => openFile("about")
    }, {
      key: "publications",
      title: "Publications",
      cat: "Folder",
      type: "folder",
      run: () => openFile("publications")
    }, {
      key: "projects",
      title: "Projects",
      cat: "Folder",
      type: "folder",
      run: () => openFile("projects")
    }, {
      key: "talks",
      title: "Talks",
      cat: "Folder",
      type: "folder",
      run: () => openFile("talks")
    }, {
      key: "writing",
      title: "Writing",
      cat: "Folder",
      type: "folder",
      run: () => openFile("writing")
    }, {
      key: "outreach",
      title: "Outreach",
      cat: "Folder",
      type: "folder",
      run: () => openFile("outreach")
    }, {
      key: "whyresearch",
      title: "Why Research?",
      cat: "Note",
      type: "txt",
      run: () => openFile("whyresearch")
    }, {
      key: "background",
      title: "Background",
      cat: "Note",
      type: "txt",
      run: () => openFile("background")
    }, {
      key: "ori",
      title: S.groups.ori.title,
      cat: "Affiliation",
      type: "logo",
      src: S.groups.ori.logo,
      run: () => openFile("ori")
    }, {
      key: "ie",
      title: S.groups.ie.title,
      cat: "Affiliation",
      type: "logo",
      src: S.groups.ie.logo,
      run: () => openFile("ie")
    }, {
      key: "news",
      title: "News",
      cat: "App",
      type: "news",
      run: () => openFile("news")
    }, {
      key: "mail",
      title: "Mail",
      cat: "App",
      type: "mail",
      run: () => openFile("mail")
    }, {
      key: "terminal",
      title: "Terminal",
      cat: "App",
      type: "terminal",
      run: () => openFile("terminal")
    }];
    apps.forEach(e => out.push({
      ...e,
      primary: true
    }));
    const add = (arr, cat, type, runner) => (arr || []).forEach((it, i) => {
      const title = it.title || it.name;
      out.push({
        key: cat + ":" + i + ":" + title,
        title,
        sub: [it.venue || it.meta, it.year || it.date].filter(Boolean).join(" · "),
        cat,
        type: it.type || type,
        text: [title, it.venue || it.meta, (it.keywords || []).join(" "), it.blurb, it.abstract].filter(Boolean).join(" "),
        run: () => runner(it)
      });
    });
    add(S.publications, "Publication", "pdf", openItem);
    add(S.projects, "Project", "folder", openItem);
    add(S.talks, "Talk", "pdf", openItem);
    add(S.writing, "Writing", "txt", it => openPost(it));
    add(S.outreach, "Outreach", "image", openItem);
    return out;
  }, [openFile, openItem, openPost]);

  /* menubar menus */
  const MENUS = {
    brand: {
      label: S.identity.name,
      bold: true,
      items: [{
        t: "About Me",
        fn: () => openFile("about")
      }, {
        t: "Quick Search…",
        k: "⌘K",
        fn: () => setPalOpen(true)
      }, {
        sep: true
      }, {
        t: "Tidy Up Desktop",
        fn: cleanUp
      }, {
        t: "Reset Desktop…",
        fn: resetAll
      }]
    },
    file: {
      label: "File",
      items: [{
        t: "Quick Search…",
        k: "⌘K",
        fn: () => setPalOpen(true)
      }, {
        t: "Open Why Research?",
        fn: () => openFile("whyresearch")
      }, {
        sep: true
      }, {
        t: "Close Window",
        k: "⌘W",
        fn: () => {
          const top = [...windows].filter(w => !w.min && !w.closing).sort((a, b) => b.z - a.z)[0];
          top && closeWin(top.wid);
        }
      }]
    },
    go: {
      label: "Go",
      items: [{
        t: "Publications",
        fn: () => openFile("publications")
      }, {
        t: "Projects",
        fn: () => openFile("projects")
      }, {
        t: "Talks",
        fn: () => openFile("talks")
      }, {
        t: "Writing",
        fn: () => openFile("writing")
      }, {
        t: "Outreach",
        fn: () => openFile("outreach")
      }, {
        sep: true
      }, {
        t: "Google Scholar ↗",
        fn: () => openHref(L.scholar)
      }]
    },
    view: {
      label: "View",
      items: [{
        t: "Tidy Up Desktop",
        fn: cleanUp
      }, {
        t: (t.widgets === false ? "Show" : "Hide") + " Widgets",
        fn: () => setTweak("widgets", !(t.widgets !== false))
      }]
    },
    window: {
      label: "Window",
      items: windows.filter(w => !w.closing).length ? windows.filter(w => !w.closing).map(w => ({
        t: (w.min ? "▸ " : "") + (w.title || FILES[w.openId] && FILES[w.openId].title || "Window"),
        fn: () => {
          setWindows(ws => ws.map(x => x.wid === w.wid ? {
            ...x,
            min: false,
            z: nextZ()
          } : x));
        }
      })) : [{
        t: "No Windows Open",
        dis: true
      }]
    },
    help: {
      label: "Help",
      items: [{
        t: "Why Research?",
        fn: () => openFile("whyresearch")
      }, {
        t: "About Me",
        fn: () => openFile("about")
      }]
    }
  };
  const menuOrder = ["brand", "file", "go", "view", "window", "help"];
  const anchorRef = useRef({});
  return /*#__PURE__*/React.createElement("div", {
    className: "desktop" + (lightWP ? " light-wp" : ""),
    onPointerDown: deskClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "wallpaper wp-" + (t.wallpaper || "sequoia")
  }), t.scatterType !== false && /*#__PURE__*/React.createElement("div", {
    className: "wp-type"
  }, /*#__PURE__*/React.createElement("span", {
    className: "a"
  }, S.identity.scatter.a), /*#__PURE__*/React.createElement("span", {
    className: "b"
  }, S.identity.scatter.b), /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, S.identity.scatter.c)), /*#__PURE__*/React.createElement("div", {
    className: "wp-grain"
  }), /*#__PURE__*/React.createElement("div", {
    className: "layer-deck",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 2
    },
    onPointerDown: deskClick
  }), t.widgets !== false && /*#__PURE__*/React.createElement(React.Fragment, null, [["clock", /*#__PURE__*/React.createElement(ClockWidget, {
    now: now
  })], ["weather", /*#__PURE__*/React.createElement(WeatherWidget, null)], ["note", /*#__PURE__*/React.createElement(NoteWidget, null)]].map(([id, node]) => /*#__PURE__*/React.createElement("div", {
    key: id,
    className: "widget",
    style: {
      left: widgetPos[id].x,
      top: widgetPos[id].y
    },
    onPointerDown: e => {
      e.currentTarget.classList.add("dragging");
      beginDrag(e, widgetPos[id].x, widgetPos[id].y, (x, y) => setWidgetPos(p => ({
        ...p,
        [id]: {
          x,
          y
        }
      })), () => document.querySelectorAll(".widget").forEach(w => w.classList.remove("dragging")));
    }
  }, node))), ICONS.map(ic => /*#__PURE__*/React.createElement("div", {
    key: ic.id,
    className: "icon" + (sel === ic.id ? " sel" : ""),
    style: {
      left: iconPos[ic.id].x,
      top: iconPos[ic.id].y
    },
    onPointerDown: e => {
      setSel(ic.id);
      setOpenMenu(null);
      e.currentTarget.classList.add("dragging");
      beginDrag(e, iconPos[ic.id].x, iconPos[ic.id].y, (x, y) => setIconPos(p => ({
        ...p,
        [ic.id]: {
          x: Math.max(0, x),
          y: Math.max(36, y)
        }
      })), () => document.querySelectorAll(".icon").forEach(w => w.classList.remove("dragging")));
    },
    onClick: () => {
      if (TOUCH) openFile(ic.open);
    },
    onDoubleClick: () => openFile(ic.open)
  }, /*#__PURE__*/React.createElement(IconArt, {
    type: ic.type,
    src: ic.src
  }), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, ic.label))), windows.map(w => {
    const f = FILES[w.openId] || (w.post ? {
      kind: "post",
      title: w.title,
      post: w.post
    } : w.article ? {
      kind: "article",
      title: w.title,
      article: w.article
    } : w.embed ? {
      kind: "embed",
      title: w.title,
      url: w.embed.url
    } : w.doc ? {
      kind: "text",
      title: w.title,
      heading: w.doc.heading,
      by: w.doc.by,
      body: w.doc.body
    } : {
      kind: "detail",
      title: w.title,
      detail: w.detail
    });
    return /*#__PURE__*/React.createElement(Win, {
      key: w.wid,
      win: w,
      f: f,
      focused: w.z === Math.max(...windows.map(q => q.z)),
      onFocus: () => focusWin(w.wid),
      onClose: closeWin,
      onMin: minWin,
      onZoom: zoomWin,
      onDrag: dragWin,
      onOpen: openFile,
      onItem: openItem,
      onToggleFull: toggleFull
    });
  }), /*#__PURE__*/React.createElement("div", {
    className: "menubar" + (lightWP ? " on-light" : "")
  }, menuOrder.map(id => /*#__PURE__*/React.createElement("span", {
    key: id,
    ref: el => anchorRef.current[id] = el,
    className: "mi" + (MENUS[id].bold ? " brand" : "") + (openMenu === id ? " open" : ""),
    onPointerDown: e => {
      e.stopPropagation();
      setOpenMenu(openMenu === id ? null : id);
    },
    onPointerEnter: () => {
      if (openMenu) setOpenMenu(id);
    }
  }, MENUS[id].label)), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("span", {
    className: "status"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mb-btn",
    title: "Quick Search (\u2318K)",
    "aria-label": "Quick Search",
    onPointerDown: e => {
      e.stopPropagation();
      setPalOpen(true);
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "6.7",
    cy: "6.7",
    r: "4.6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10.2",
    y1: "10.2",
    x2: "14.5",
    y2: "14.5",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "13",
    viewBox: "0 0 26 14"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "2",
    width: "20",
    height: "10",
    rx: "2.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "3.5",
    width: "15",
    height: "7",
    rx: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "21.5",
    y: "5",
    width: "2",
    height: "4",
    rx: "1",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "13",
    viewBox: "0 0 18 14"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 3C5.5 3 2.7 4.4 1 6.4l1.4 1.5C3.9 6.2 6.3 5 9 5s5.1 1.2 6.6 2.9L17 6.4C15.3 4.4 12.5 3 9 3z",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 7.5c-1.9 0-3.6.8-4.7 2l1.5 1.6C6.5 10.3 7.7 9.7 9 9.7s2.5.6 3.2 1.4l1.5-1.6C12.6 8.3 10.9 7.5 9 7.5z",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "12",
    r: "1.4",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "clock"
  }, now.toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    day: "numeric",
    month: "short"
  }), "  ", now.toLocaleTimeString("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })))), openMenu && anchorRef.current[openMenu] && /*#__PURE__*/React.createElement("div", {
    className: "menu-pop",
    style: {
      left: Math.min(anchorRef.current[openMenu].getBoundingClientRect().left, window.innerWidth - 240)
    },
    onPointerDown: e => e.stopPropagation()
  }, MENUS[openMenu].items.map((it, i) => it.sep ? /*#__PURE__*/React.createElement("div", {
    className: "sep",
    key: i
  }) : /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "row" + (it.dis ? " disabled" : ""),
    onClick: () => {
      if (!it.dis) {
        it.fn && it.fn();
        setOpenMenu(null);
      }
    }
  }, /*#__PURE__*/React.createElement("span", null, it.t), it.k && /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, it.k)))), /*#__PURE__*/React.createElement("div", {
    className: "dock-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dock",
    onPointerDown: e => e.stopPropagation()
  }, DOCK.map((d, i) => d.sep ? /*#__PURE__*/React.createElement("span", {
    className: "sep",
    key: "s" + i
  }) : /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "di" + (isRunning(d.key) ? " running" : "") + (bounce === d.key ? " bouncing" : ""),
    onClick: () => {
      if (d.href) {
        window.open(d.href, "_blank", "noopener");
      } else if (d.fn) {
        d.fn();
      } else {
        dockOpen(d.key);
      }
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cap"
  }, d.label), /*#__PURE__*/React.createElement("span", {
    className: "ico"
  }, d.node, /*#__PURE__*/React.createElement("span", {
    className: "run"
  })))))), palOpen && /*#__PURE__*/React.createElement(Palette, {
    index: searchIndex,
    onClose: () => setPalOpen(false)
  }), hint && /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, TOUCH ? "Tap an icon to open · tap 🔍 to search" : "Double-click an icon to open · drag anything · ⌘K to search"));
}
const TWEAK_DEFAULTS = {
  wallpaper: "paper",
  scatterType: true,
  accent: "#28a05a",
  widgets: true
};
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));