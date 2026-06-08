/* ============================================================
   os-app.jsx — Ufuk Çakır's desktop environment
   (production build of the Claude Design prototype)
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;
const S = window.SITE;
const L = S.links;

const uid = () => "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);

/* local stand-in for the design tool's useTweaks (no host bridge) */
function useTweaks(defaults) {
  const [v, setV] = useState(defaults);
  const setTweak = useCallback((k, val) => setV((p) => ({ ...p, [k]: val })), []);
  return [v, setTweak];
}

/* ---------- generic pointer drag ---------- */
function beginDrag(e, sx, sy, onMove, onEnd) {
  if (e.button === 2) return;
  e.preventDefault();
  const ox = e.clientX, oy = e.clientY;
  let moved = false;
  const mv = (ev) => {
    const dx = ev.clientX - ox, dy = ev.clientY - oy;
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
function Preview({ media, className }) {
  if (!media) return null;
  if (media.type === "video") {
    return (
      <video className={className} src={media.src} autoPlay loop playsInline muted
        preload="metadata" ref={(el) => { if (el) el.muted = true; }} />
    );
  }
  return <img className={className} src={media.src} alt="" loading="lazy" />;
}

/* ---------- icon art by type ---------- */
function IconArt({ type, src }) {
  if (type === "photo") return <img className="art art-photo" src={src} alt="" />;
  if (type === "logo") return <img className="art art-logo" src={src} alt="" />;
  if (type === "folder") return <FolderIcon />;
  if (type === "txt") return <DocIcon tag="TXT" tagColor="var(--accent)" />;
  if (type === "pdf") return <DocIcon tag="PDF" tagColor="#e5341c" />;
  if (type === "image") return <ImageIcon />;
  return <DocIcon />;
}

/* preview thumbnail for a finder item (sneak peek), else its file icon */
function ItemThumb({ item }) {
  if (item.media) return <Preview media={item.media} className="art thumb" />;
  return <IconArt type={item.type} />;
}

/* ---------- desktop icon definitions ---------- */
const ICONS = [
  { id: "publications", type: "folder", label: "Publications", open: "publications" },
  { id: "projects", type: "folder", label: "Projects", open: "projects" },
  { id: "talks", type: "folder", label: "Talks", open: "talks" },
  { id: "outreach", type: "folder", label: "Outreach", open: "outreach" },
  { id: "whyresearch", type: "txt", label: "Why Research?.txt", open: "whyresearch" },
  { id: "background", type: "txt", label: "Background.txt", open: "background" },
  { id: "ori", type: "logo", src: S.groups.ori.logo, label: "Oxford Robotics Institute", open: "ori" },
  { id: "ie", type: "logo", src: S.groups.ie.logo, label: "Intelligent Earth CDT", open: "ie" },
];
function defaultIconPos() {
  const W = window.innerWidth;
  const colX = [W - 100, W - 196, W - 292];
  const pos = {};
  ICONS.forEach((ic, i) => {
    const col = Math.floor(i / 4);
    pos[ic.id] = { x: colX[col] != null ? colX[col] : 8, y: 48 + (i % 4) * 104 };
  });
  return pos;
}
function defaultWidgetPos() {
  return { clock: { x: 40, y: 56 }, weather: { x: 40, y: 250 }, note: { x: 40, y: 452 } };
}

const SIZE = { finder: [720, 460], text: [620, 558], detail: [600, 640], about: [360, 470] };
const STORE_KEY = "cakir-os-v4";

/* ============================================================
   Window content
   ============================================================ */
function FinderContent({ f, onOpen, onItem }) {
  const [active, setActive] = useState(f.title);
  const fav = [
    ["Publications", "publications"], ["Projects", "projects"],
    ["Talks", "talks"], ["Outreach", "outreach"],
  ];
  return (
    <div className="win-body">
      <div className="fsidebar">
        <div className="sh">Favourites</div>
        {fav.map(([nm, key]) => (
          <div key={key} className={"si" + (nm === active ? " active" : "")}
            onDoubleClick={() => onOpen(key)} onClick={() => setActive(nm)}>
            <span className="d" style={{ background: "#3aa0ff" }}></span>{nm}
          </div>
        ))}
      </div>
      <div className="fmain">
        <div className="ftoolbar">
          <span style={{ fontWeight: 600, color: "var(--ink)" }}>{f.title}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11.5 }}>{f.items.length} items</span>
        </div>
        {f.view === "grid" ? (
          <div className="fgrid">
            {f.items.map((it, i) => (
              <div className="fitem" key={i} onDoubleClick={() => onItem(it)} title="Double-click to open">
                <ItemThumb item={it} />
                <div className="nm">{it.name || it.title}</div>
                {(it.meta || it.venue) && <div className="mt">{it.meta || it.venue}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="flist">
            <div className="hdr"><span>Name</span><span>Venue</span><span>Year</span></div>
            {f.items.map((it, i) => (
              <div className="lrow" key={i} onDoubleClick={() => onItem(it)}>
                <span className="nm">
                  <ItemThumb item={it} />
                  <span className="nm-main">
                    <span className="nm-title">{it.title || it.name}</span>
                    {it.keywords && it.keywords.length > 0 && (
                      <span className="kwchips">
                        {it.keywords.slice(0, 4).map((k) => <span className="kw" key={k}>{k}</span>)}
                      </span>
                    )}
                  </span>
                </span>
                <span className="mt">{it.venue || it.kind}</span>
                <span className="mt">{it.year || it.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TextContent({ f }) {
  return (
    <div className="win-body textwin">
      <div className="textwrap">
        <div className="doc">
          <h1>{f.heading}</h1>
          <div className="by">{f.by}</div>
          {f.body.map((p, i) =>
            p.ph
              ? <p key={i}><span className="ph">{p.text}</span></p>
              : <p key={i} className={p.lead ? "lead" : ""}>{p.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailContent({ f }) {
  const d = f.detail || {};
  const title = d.title || d.name;
  const sub = [d.venue || d.meta, d.year].filter(Boolean).join(" · ");
  const text = d.abstract || d.blurb;
  const links = d.links || [];
  return (
    <div className="win-body detailwin">
      <div className="detailwrap">
        {d.media && <div className="dmedia"><Preview media={d.media} className="dmedia-el" /></div>}
        <div className="dbody">
          {sub && <div className="dkicker">{sub}</div>}
          <h1 className="dtitle">{title}</h1>
          {text && <p className="dtext">{text}</p>}
          {d.keywords && d.keywords.length > 0 && (
            <div className="dtags">{d.keywords.map((k) => <span className="dtag" key={k}>{k}</span>)}</div>
          )}
          {links.length > 0 && (
            <div className="dlinks">
              {links.map((ln, i) => (
                <a className="dbtn" key={i} href={ln.href} target="_blank" rel="noopener">{ln.label || "Open ↗"}</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AboutContent() {
  const id = S.identity;
  const items = [
    L.email && ["Email", "mailto:" + L.email],
    L.scholar && ["Scholar", L.scholar],
    L.github && ["GitHub", L.github],
    L.linkedin && ["LinkedIn", L.linkedin],
    L.orcid && ["ORCID", L.orcid],
  ].filter(Boolean);
  return (
    <div className="win-body aboutwin">
      <div className="aboutwrap">
        {id.photoThumb ? <img className="ava ava-photo" src={id.photoThumb} alt={id.name} />
                       : <div className="ava">{id.initial}</div>}
        <h2>{id.name}</h2>
        <div className="role">{id.role}</div>
        <p>{S.about.p}</p>
        <div className="links">
          {items.map(([t, h]) => <a key={t} href={h} target="_blank" rel="noopener">{t}</a>)}
        </div>
      </div>
    </div>
  );
}

/* ---------- window shell ---------- */
function Win({ win, f, focused, onFocus, onClose, onMin, onZoom, onDrag, onOpen, onItem }) {
  const ttlDown = (e) => { onFocus(); beginDrag(e, win.x, win.y, (x, y) => onDrag(win.wid, Math.max(28, x), Math.max(28, y))); };
  return (
    <div className={"window" + (focused ? " focused" : "") + (win.closing ? " closing" : " opening")}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z, display: win.min ? "none" : "flex" }}
      onPointerDown={onFocus}>
      <div className="titlebar" onPointerDown={ttlDown} onDoubleClick={() => onZoom(win.wid)}>
        <div className="lights" onPointerDown={(e) => e.stopPropagation()}>
          <span className="light r" onClick={() => onClose(win.wid)}></span>
          <span className="light y" onClick={() => onMin(win.wid)}></span>
          <span className="light g" onClick={() => onZoom(win.wid)}></span>
        </div>
        <div className="title">{win.title || f.title}</div>
      </div>
      {f.kind === "finder" && <FinderContent f={f} onOpen={onOpen} onItem={onItem} />}
      {f.kind === "text" && <TextContent f={f} />}
      {f.kind === "detail" && <DetailContent f={f} />}
      {f.kind === "about" && <AboutContent />}
    </div>
  );
}

/* ============================================================
   Widgets
   ============================================================ */
function ClockWidget({ now }) {
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const date = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div className="w-clock">
      <div className="time">{hh}:{mm}<span className="ss"> {ss}</span></div>
      <div className="date">{date}</div>
      <div className="loc">{S.identity.location}</div>
    </div>
  );
}
function WeatherWidget() {
  return (
    <div className="w-weather">
      <div className="top">
        <div><div className="city">Oxford</div><div className="now">Now</div></div>
        <svg width="34" height="34" viewBox="0 0 40 40"><circle cx="16" cy="15" r="8" fill="#ffd23e"/><ellipse cx="24" cy="24" rx="13" ry="8" fill="#fff"/><ellipse cx="16" cy="26" rx="10" ry="7" fill="#f0f0f3"/></svg>
      </div>
      <div className="temp">12°</div>
      <div className="cond">Partly Cloudy</div>
      <div className="hi">H:14°  L:7°</div>
    </div>
  );
}
function NoteWidget() {
  return (
    <div className="w-note">
      <div className="ttl">Currently</div>
      {S.identity.currently.map((line, i) => (
        <div className="ln" key={i}>{line}</div>
      ))}
    </div>
  );
}

/* ============================================================
   App
   ============================================================ */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const saved = useRef(null);
  if (saved.current === null) {
    try { saved.current = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { saved.current = {}; }
  }
  const s0 = saved.current;

  const [iconPos, setIconPos] = useState(() => ({ ...defaultIconPos(), ...(s0.iconPos || {}) }));
  const [widgetPos, setWidgetPos] = useState(() => ({ ...defaultWidgetPos(), ...(s0.widgetPos || {}) }));
  const [windows, setWindows] = useState(() => s0.windows || []);
  const [sel, setSel] = useState(null);
  const [now, setNow] = useState(new Date());
  const [openMenu, setOpenMenu] = useState(null);
  const [bounce, setBounce] = useState(null);
  const [hint, setHint] = useState(!s0.seen);
  const topZ = useRef(Math.max(100, s0.topZ || 100));

  /* clock */
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  /* dismiss hint */
  useEffect(() => { if (hint) { const id = setTimeout(() => setHint(false), 4200); return () => clearTimeout(id); } }, [hint]);

  /* accent + wallpaper vars */
  useEffect(() => {
    const a = t.accent || "#0a72e8";
    document.documentElement.style.setProperty("--accent", a);
    document.documentElement.style.setProperty("--accent-soft", a + "33");
    document.documentElement.style.setProperty("--sel", a);
  }, [t.accent]);

  /* persist */
  useEffect(() => {
    const snap = { iconPos, widgetPos, windows: windows.filter(w => !w.closing), topZ: topZ.current, seen: true };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(snap)); } catch (e) {}
  }, [iconPos, widgetPos, windows]);

  const nextZ = () => (topZ.current += 1);

  const focusWin = useCallback((wid) => {
    setWindows((ws) => ws.map((w) => (w.wid === wid ? { ...w, z: nextZ() } : w)));
  }, []);

  const openFile = useCallback((key, titleOverride) => {
    const f = FILES[key];
    if (!f) return;
    setWindows((ws) => {
      const ex = ws.find((w) => w.openId === key && !w.closing);
      if (ex) return ws.map((w) => (w.wid === ex.wid ? { ...w, min: false, z: nextZ() } : w));
      const [w, h] = SIZE[f.kind] || [640, 460];
      const n = ws.length;
      let x, y;
      if (key === "about") {
        x = Math.max(24, Math.round((window.innerWidth - w) / 2));
        y = Math.max(44, Math.round((window.innerHeight - h) / 2));
      } else {
        x = Math.max(24, Math.round((window.innerWidth - w) / 2) + (n % 5) * 30 - 60);
        y = Math.max(44, Math.round((window.innerHeight - h) / 2) + (n % 5) * 26 - 50);
      }
      return [...ws, { wid: uid(), openId: key, title: titleOverride, x, y, w, h, z: nextZ(), min: false }];
    });
  }, []);

  const openDetail = useCallback((item) => {
    const key = "detail:" + (item.title || item.name);
    setWindows((ws) => {
      const ex = ws.find((w) => w.openId === key && !w.closing);
      if (ex) return ws.map((w) => (w.wid === ex.wid ? { ...w, min: false, z: nextZ() } : w));
      const [w, h] = SIZE.detail;
      const n = ws.length;
      const x = Math.max(24, Math.round((window.innerWidth - w) / 2) + (n % 5) * 30 - 60);
      const y = Math.max(44, Math.round((window.innerHeight - h) / 2) + (n % 5) * 26 - 50);
      return [...ws, { wid: uid(), openId: key, detail: item, title: (item.title || item.name), x, y, w, h, z: nextZ(), min: false }];
    });
  }, []);

  const openTextDoc = useCallback((item) => {
    const key = "doc:" + (item.name || item.title);
    setWindows((ws) => {
      const ex = ws.find((w) => w.openId === key && !w.closing);
      if (ex) return ws.map((w) => (w.wid === ex.wid ? { ...w, min: false, z: nextZ() } : w));
      const [w, h] = SIZE.text;
      const n = ws.length;
      const x = Math.max(24, Math.round((window.innerWidth - w) / 2) + (n % 5) * 30 - 60);
      const y = Math.max(44, Math.round((window.innerHeight - h) / 2) + (n % 5) * 26 - 50);
      return [...ws, { wid: uid(), openId: key, doc: item.doc, title: (item.name || item.title), x, y, w, h, z: nextZ(), min: false }];
    });
  }, []);

  /* item double-click: text doc → text window; rich item → detail; bare link → open it */
  const openItem = useCallback((it) => {
    if (it.doc) return openTextDoc(it);
    const rich = it.blurb || it.abstract || it.media || (it.keywords && it.keywords.length);
    if (rich) return openDetail(it);
    const href = it.links && it.links[0] && it.links[0].href;
    if (href) return openHref(href);
    openDetail(it);
  }, [openDetail, openTextDoc]);

  const closeWin = useCallback((wid) => {
    setWindows((ws) => ws.map((w) => (w.wid === wid ? { ...w, closing: true } : w)));
    setTimeout(() => setWindows((ws) => ws.filter((w) => w.wid !== wid)), 180);
  }, []);
  const minWin = useCallback((wid) => setWindows((ws) => ws.map((w) => (w.wid === wid ? { ...w, min: true } : w))), []);
  const zoomWin = useCallback((wid) => {
    setWindows((ws) => ws.map((w) => {
      if (w.wid !== wid) return w;
      if (w._z) { const r = w._z; return { ...w, x: r.x, y: r.y, w: r.w, h: r.h, _z: null }; }
      return { ...w, _z: { x: w.x, y: w.y, w: w.w, h: w.h }, x: 60, y: 44, w: window.innerWidth - 120, h: window.innerHeight - 120 };
    }));
  }, []);
  const dragWin = useCallback((wid, x, y) => setWindows((ws) => ws.map((w) => (w.wid === wid ? { ...w, x, y } : w))), []);

  /* greet first-time visitors with the About card, centered */
  useEffect(() => {
    if (!s0.seen && (!s0.windows || s0.windows.length === 0)) openFile("about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dockOpen = (key) => {
    setBounce(key); setTimeout(() => setBounce(null), 620);
    openFile(key);
  };

  const cleanUp = () => { setIconPos(defaultIconPos()); setWidgetPos(defaultWidgetPos()); };
  const resetAll = () => { try { localStorage.removeItem(STORE_KEY); } catch (e) {} setWindows([]); setIconPos(defaultIconPos()); setWidgetPos(defaultWidgetPos()); };

  /* desktop click clears selection + menus */
  const deskClick = (e) => {
    if (e.target.classList.contains("desktop") || e.target.classList.contains("wallpaper") || e.target.classList.contains("layer-deck")) {
      setSel(null); setOpenMenu(null);
    }
  };

  const lightWP = t.wallpaper === "paper" || t.wallpaper === "mono";

  /* dock config */
  const DOCK = [
    { id: "about", node: <AppIcon from="#0a72e8" to="#5b3a8c" glyph={S.identity.initial} />, label: "About", key: "about" },
    { id: "publications", node: <FolderIcon />, label: "Publications", key: "publications" },
    { id: "projects", node: <FolderIcon />, label: "Projects", key: "projects" },
    { id: "talks", node: <FolderIcon />, label: "Talks", key: "talks" },
    { id: "outreach", node: <FolderIcon />, label: "Outreach", key: "outreach" },
    { id: "whyresearch", node: <DocIcon tag="TXT" tagColor="#0a72e8" />, label: "Why Research?", key: "whyresearch" },
    { sep: true },
    ...(L.email ? [{ id: "mail", node: <MailIcon />, label: "Email", href: "mailto:" + L.email }] : []),
    { id: "scholar", node: <GlobeIcon />, label: "Scholar", href: L.scholar },
    { id: "github", node: <GitHubIcon />, label: "GitHub", href: L.github },
  ];
  const isRunning = (key) => key && windows.some((w) => w.openId === key && !w.closing);

  /* menubar menus */
  const MENUS = {
    brand: { label: S.identity.name, bold: true, items: [
      { t: "About Me", fn: () => openFile("about") },
      { sep: true },
      { t: "Tidy Up Desktop", fn: cleanUp },
      { t: "Reset Desktop…", fn: resetAll },
    ] },
    file: { label: "File", items: [
      { t: "New Window", k: "⌘N", dis: true },
      { t: "Open Why Research?", fn: () => openFile("whyresearch") },
      { sep: true },
      { t: "Close Window", k: "⌘W", fn: () => { const top = [...windows].filter(w => !w.min && !w.closing).sort((a, b) => b.z - a.z)[0]; top && closeWin(top.wid); } },
    ] },
    go: { label: "Go", items: [
      { t: "Publications", fn: () => openFile("publications") },
      { t: "Projects", fn: () => openFile("projects") },
      { t: "Talks", fn: () => openFile("talks") },
      { t: "Outreach", fn: () => openFile("outreach") },
      { sep: true },
      { t: "Google Scholar ↗", fn: () => openHref(L.scholar) },
    ] },
    view: { label: "View", items: [
      { t: "Tidy Up Desktop", fn: cleanUp },
      { t: (t.widgets === false ? "Show" : "Hide") + " Widgets", fn: () => setTweak("widgets", !(t.widgets !== false)) },
    ] },
    window: { label: "Window", items:
      (windows.filter(w => !w.closing).length
        ? windows.filter(w => !w.closing).map((w) => ({ t: (w.min ? "▸ " : "") + (w.title || (FILES[w.openId] && FILES[w.openId].title) || "Window"), fn: () => { setWindows(ws => ws.map(x => x.wid === w.wid ? { ...x, min: false, z: nextZ() } : x)); } }))
        : [{ t: "No Windows Open", dis: true }]) },
    help: { label: "Help", items: [{ t: "Why Research?", fn: () => openFile("whyresearch") }, { t: "About Me", fn: () => openFile("about") }] },
  };
  const menuOrder = ["brand", "file", "go", "view", "window", "help"];
  const anchorRef = useRef({});

  return (
    <div className={"desktop" + (lightWP ? " light-wp" : "")} onPointerDown={deskClick}>
      <div className={"wallpaper wp-" + (t.wallpaper || "sequoia")}></div>
      {t.scatterType !== false && (
        <div className="wp-type"><span className="a">{S.identity.scatter.a}</span><span className="b">{S.identity.scatter.b}</span><span className="c">{S.identity.scatter.c}</span></div>
      )}
      <div className="wp-grain"></div>
      <div className="layer-deck" style={{ position: "absolute", inset: 0, zIndex: 2 }} onPointerDown={deskClick}></div>

      {/* widgets */}
      {t.widgets !== false && (
        <>
          {[["clock", <ClockWidget now={now} />], ["weather", <WeatherWidget />], ["note", <NoteWidget />]].map(([id, node]) => (
            <div key={id} className="widget" style={{ left: widgetPos[id].x, top: widgetPos[id].y }}
              onPointerDown={(e) => { e.currentTarget.classList.add("dragging"); beginDrag(e, widgetPos[id].x, widgetPos[id].y,
                (x, y) => setWidgetPos((p) => ({ ...p, [id]: { x, y } })),
                () => document.querySelectorAll(".widget").forEach(w => w.classList.remove("dragging"))); }}>
              {node}
            </div>
          ))}
        </>
      )}

      {/* desktop icons */}
      {ICONS.map((ic) => (
        <div key={ic.id} className={"icon" + (ic.id === "portrait" ? " portrait" : "") + (sel === ic.id ? " sel" : "")}
          style={{ left: iconPos[ic.id].x, top: iconPos[ic.id].y }}
          onPointerDown={(e) => { setSel(ic.id); setOpenMenu(null); e.currentTarget.classList.add("dragging");
            beginDrag(e, iconPos[ic.id].x, iconPos[ic.id].y,
              (x, y) => setIconPos((p) => ({ ...p, [ic.id]: { x: Math.max(0, x), y: Math.max(36, y) } })),
              () => document.querySelectorAll(".icon").forEach(w => w.classList.remove("dragging"))); }}
          onDoubleClick={() => openFile(ic.open)}>
          <IconArt type={ic.type} src={ic.src} />
          <div className="lbl">{ic.label}</div>
        </div>
      ))}

      {/* windows */}
      {windows.map((w) => {
        const f = FILES[w.openId] || (w.doc
          ? { kind: "text", title: w.title, heading: w.doc.heading, by: w.doc.by, body: w.doc.body }
          : { kind: "detail", title: w.title, detail: w.detail });
        return (
          <Win key={w.wid} win={w} f={f} focused={w.z === Math.max(...windows.map((q) => q.z))}
            onFocus={() => focusWin(w.wid)} onClose={closeWin} onMin={minWin} onZoom={zoomWin}
            onDrag={dragWin} onOpen={openFile} onItem={openItem} />
        );
      })}

      {/* menu bar */}
      <div className={"menubar" + (lightWP ? " on-light" : "")}>
        {menuOrder.map((id) => (
          <span key={id} ref={(el) => (anchorRef.current[id] = el)}
            className={"mi" + (MENUS[id].bold ? " brand" : "") + (openMenu === id ? " open" : "")}
            onPointerDown={(e) => { e.stopPropagation(); setOpenMenu(openMenu === id ? null : id); }}
            onPointerEnter={() => { if (openMenu) setOpenMenu(id); }}>
            {MENUS[id].label}
          </span>
        ))}
        <span className="spacer"></span>
        <span className="status">
          <svg width="22" height="13" viewBox="0 0 26 14"><rect x="0.5" y="2" width="20" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1"/><rect x="2" y="3.5" width="15" height="7" rx="1" fill="currentColor"/><rect x="21.5" y="5" width="2" height="4" rx="1" fill="currentColor"/></svg>
          <svg width="17" height="13" viewBox="0 0 18 14"><path d="M9 3C5.5 3 2.7 4.4 1 6.4l1.4 1.5C3.9 6.2 6.3 5 9 5s5.1 1.2 6.6 2.9L17 6.4C15.3 4.4 12.5 3 9 3z" fill="currentColor"/><path d="M9 7.5c-1.9 0-3.6.8-4.7 2l1.5 1.6C6.5 10.3 7.7 9.7 9 9.7s2.5.6 3.2 1.4l1.5-1.6C12.6 8.3 10.9 7.5 9 7.5z" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/></svg>
          <span className="clock">{now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}  {String(now.getHours()).padStart(2, "0")}:{String(now.getMinutes()).padStart(2, "0")}</span>
        </span>
      </div>

      {/* dropdown */}
      {openMenu && anchorRef.current[openMenu] && (
        <div className="menu-pop" style={{ left: Math.min(anchorRef.current[openMenu].getBoundingClientRect().left, window.innerWidth - 240) }}
          onPointerDown={(e) => e.stopPropagation()}>
          {MENUS[openMenu].items.map((it, i) => it.sep
            ? <div className="sep" key={i}></div>
            : <div key={i} className={"row" + (it.dis ? " disabled" : "")}
                onClick={() => { if (!it.dis) { it.fn && it.fn(); setOpenMenu(null); } }}>
                <span>{it.t}</span>{it.k && <span className="k">{it.k}</span>}
              </div>)}
        </div>
      )}

      {/* dock */}
      <div className="dock-wrap">
        <div className="dock" onPointerDown={(e) => e.stopPropagation()}>
          {DOCK.map((d, i) => d.sep
            ? <span className="sep" key={"s" + i}></span>
            : <div key={d.id} className={"di" + (isRunning(d.key) ? " running" : "") + (bounce === d.key ? " bouncing" : "")}
                onClick={() => { if (d.href) { window.open(d.href, "_blank", "noopener"); } else { dockOpen(d.key); } }}>
                <span className="cap">{d.label}</span>
                <span className="ico">{d.node}<span className="run"></span></span>
              </div>)}
        </div>
      </div>

      {hint && <div className="hint">Double-click an icon to open · drag anything · ✕ closes windows</div>}
    </div>
  );
}

const TWEAK_DEFAULTS = {
  wallpaper: "paper",
  scatterType: true,
  accent: "#28a05a",
  widgets: true,
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
