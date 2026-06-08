/* ============================================================
   os-app.jsx — Ufuk Çakır's desktop environment
   (production build of the Claude Design prototype)
   ============================================================ */
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
const S = window.SITE;
const L = S.links;
const uid = () => "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);

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
  const colX = [W - 100, W - 196, W - 292];
  const pos = {};
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
  about: [360, 470]
};
const STORE_KEY = "cakir-os-v4";

/* ============================================================
   Window content
   ============================================================ */
function FinderContent({
  f,
  onOpen,
  onItem
}) {
  const [active, setActive] = useState(f.title);
  const fav = [["Publications", "publications"], ["Projects", "projects"], ["Talks", "talks"], ["Outreach", "outreach"]];
  return /*#__PURE__*/React.createElement("div", {
    className: "win-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fsidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sh"
  }, "Favourites"), fav.map(([nm, key]) => /*#__PURE__*/React.createElement("div", {
    key: key,
    className: "si" + (nm === active ? " active" : ""),
    onDoubleClick: () => onOpen(key),
    onClick: () => setActive(nm)
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: "#3aa0ff"
    }
  }), nm))), /*#__PURE__*/React.createElement("div", {
    className: "fmain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftoolbar"
  }, /*#__PURE__*/React.createElement("span", {
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
    onDoubleClick: () => onItem(it),
    title: "Double-click to open"
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
  onItem
}) {
  const ttlDown = e => {
    onFocus();
    beginDrag(e, win.x, win.y, (x, y) => onDrag(win.wid, Math.max(28, x), Math.max(28, y)));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "window" + (focused ? " focused" : "") + (win.closing ? " closing" : " opening"),
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
    f: f,
    onOpen: onOpen,
    onItem: onItem
  }), f.kind === "text" && /*#__PURE__*/React.createElement(TextContent, {
    f: f
  }), f.kind === "detail" && /*#__PURE__*/React.createElement(DetailContent, {
    f: f
  }), f.kind === "about" && /*#__PURE__*/React.createElement(AboutContent, null));
}

/* ============================================================
   Widgets
   ============================================================ */
function ClockWidget({
  now
}) {
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const date = now.toLocaleDateString("en-GB", {
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
  const [iconPos, setIconPos] = useState(() => ({
    ...defaultIconPos(),
    ...(s0.iconPos || {})
  }));
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
  const topZ = useRef(Math.max(100, s0.topZ || 100));

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
      const n = ws.length;
      let x, y;
      if (key === "about") {
        x = Math.max(24, Math.round((window.innerWidth - w) / 2));
        y = Math.max(44, Math.round((window.innerHeight - h) / 2));
      } else {
        x = Math.max(24, Math.round((window.innerWidth - w) / 2) + n % 5 * 30 - 60);
        y = Math.max(44, Math.round((window.innerHeight - h) / 2) + n % 5 * 26 - 50);
      }
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
      const n = ws.length;
      const x = Math.max(24, Math.round((window.innerWidth - w) / 2) + n % 5 * 30 - 60);
      const y = Math.max(44, Math.round((window.innerHeight - h) / 2) + n % 5 * 26 - 50);
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
      const n = ws.length;
      const x = Math.max(24, Math.round((window.innerWidth - w) / 2) + n % 5 * 30 - 60);
      const y = Math.max(44, Math.round((window.innerHeight - h) / 2) + n % 5 * 26 - 50);
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

  /* item double-click: text doc → text window; rich item → detail; bare link → open it */
  const openItem = useCallback(it => {
    if (it.doc) return openTextDoc(it);
    const rich = it.blurb || it.abstract || it.media || it.keywords && it.keywords.length;
    if (rich) return openDetail(it);
    const href = it.links && it.links[0] && it.links[0].href;
    if (href) return openHref(href);
    openDetail(it);
  }, [openDetail, openTextDoc]);
  const closeWin = useCallback(wid => {
    setWindows(ws => ws.map(w => w.wid === wid ? {
      ...w,
      closing: true
    } : w));
    setTimeout(() => setWindows(ws => ws.filter(w => w.wid !== wid)), 180);
  }, []);
  const minWin = useCallback(wid => setWindows(ws => ws.map(w => w.wid === wid ? {
    ...w,
    min: true
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

  /* greet first-time visitors with the About card, centered */
  useEffect(() => {
    if (!s0.seen && (!s0.windows || s0.windows.length === 0)) openFile("about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /* desktop click clears selection + menus */
  const deskClick = e => {
    if (e.target.classList.contains("desktop") || e.target.classList.contains("wallpaper") || e.target.classList.contains("layer-deck")) {
      setSel(null);
      setOpenMenu(null);
    }
  };
  const lightWP = t.wallpaper === "paper" || t.wallpaper === "mono";

  /* dock config */
  const DOCK = [{
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
    id: "outreach",
    node: /*#__PURE__*/React.createElement(FolderIcon, null),
    label: "Outreach",
    key: "outreach"
  }, {
    id: "whyresearch",
    node: /*#__PURE__*/React.createElement(DocIcon, {
      tag: "TXT",
      tagColor: "#0a72e8"
    }),
    label: "Why Research?",
    key: "whyresearch"
  }, {
    sep: true
  }, ...(L.email ? [{
    id: "mail",
    node: /*#__PURE__*/React.createElement(MailIcon, null),
    label: "Email",
    href: "mailto:" + L.email
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
  }];
  const isRunning = key => key && windows.some(w => w.openId === key && !w.closing);

  /* menubar menus */
  const MENUS = {
    brand: {
      label: S.identity.name,
      bold: true,
      items: [{
        t: "About Me",
        fn: () => openFile("about")
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
        t: "New Window",
        k: "⌘N",
        dis: true
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
    className: "icon" + (ic.id === "portrait" ? " portrait" : "") + (sel === ic.id ? " sel" : ""),
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
    onDoubleClick: () => openFile(ic.open)
  }, /*#__PURE__*/React.createElement(IconArt, {
    type: ic.type,
    src: ic.src
  }), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, ic.label))), windows.map(w => {
    const f = FILES[w.openId] || (w.doc ? {
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
      onItem: openItem
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
  }, /*#__PURE__*/React.createElement("svg", {
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
    weekday: "short",
    day: "numeric",
    month: "short"
  }), "  ", String(now.getHours()).padStart(2, "0"), ":", String(now.getMinutes()).padStart(2, "0")))), openMenu && anchorRef.current[openMenu] && /*#__PURE__*/React.createElement("div", {
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
  })))))), hint && /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "Double-click an icon to open \xB7 drag anything \xB7 \u2715 closes windows"));
}
const TWEAK_DEFAULTS = {
  wallpaper: "paper",
  scatterType: true,
  accent: "#28a05a",
  widgets: true
};
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));