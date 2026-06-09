/* ============================================================
   os-data.jsx — macOS-style SVG icons + file system + content
   Content is read from window.SITE (see assets/os/content.js).
   NB: this file and os-app.js share one global scope as <script>
   tags, so top-level names must not collide across the two.
   ============================================================ */

/* ---------- ICON ART (rounded macOS-ish) ---------- */
function FolderIcon({ accent = "#3aa0ff", dark = "#1f7ce0" }) {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={"fg" + accent} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} /><stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <path d="M6 18c0-3 2-5 5-5h12l5 5h19c3 0 5 2 5 5v3H6z" fill={dark} opacity="0.85" />
      <path d="M6 24c0-3 2-5 5-5h42c3 0 5 2 5 5v23c0 3-2 5-5 5H11c-3 0-5-2-5-5z" fill={"url(#fg" + accent + ")"} />
      <rect x="6" y="24" width="52" height="6" fill="#fff" opacity="0.18" />
    </svg>
  );
}
function DocIcon({ tag = "TXT", tagColor = "#0a72e8" }) {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 5h26l12 12v38c0 2-2 4-4 4H16c-2 0-4-2-4-4V9c0-2 2-4 2-4z" fill="#fff" stroke="#d2d2d6" strokeWidth="1.2" />
      <path d="M40 5l12 12H42c-1 0-2-1-2-2z" fill="#e4e4e8" />
      <g stroke="#c7c7cc" strokeWidth="2.4" strokeLinecap="round">
        <line x1="20" y1="26" x2="44" y2="26" /><line x1="20" y1="33" x2="44" y2="33" />
        <line x1="20" y1="40" x2="44" y2="40" /><line x1="20" y1="47" x2="36" y2="47" />
      </g>
      <rect x="10" y="40" width="30" height="16" rx="3" fill={tagColor} />
      <text x="25" y="52" textAnchor="middle" fill="#fff" fontFamily="-apple-system, sans-serif" fontSize="10" fontWeight="700">{tag}</text>
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="10" width="48" height="44" rx="6" fill="#fff" stroke="#d2d2d6" strokeWidth="1.2" />
      <rect x="11" y="13" width="42" height="38" rx="4" fill="#cfe6ff" />
      <circle cx="22" cy="24" r="5" fill="#ffd23e" />
      <path d="M11 44l13-15 9 10 7-8 13 14v3a4 4 0 0 1-4 4H11z" fill="#5aa97a" />
    </svg>
  );
}
function AppIcon({ from = "#0a72e8", to = "#5b3a8c", glyph = "" }) {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={"ag" + from + to} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} /></linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill={"url(#ag" + from + to + ")"} />
      <rect x="6" y="6" width="52" height="26" rx="14" fill="#fff" opacity="0.12" />
      <text x="32" y="42" textAnchor="middle" fill="#fff" fontFamily="-apple-system, sans-serif" fontSize="26" fontWeight="700">{glyph}</text>
    </svg>
  );
}
function MailIcon() {
  return (<svg className="art" viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="14" fill="#fff" stroke="#e2e2e6" strokeWidth="1"/><path d="M14 22l18 13 18-13" fill="none" stroke="#0a72e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="13" y="20" width="38" height="24" rx="4" fill="none" stroke="#0a72e8" strokeWidth="3"/></svg>);
}
function GlobeIcon() {
  return (<svg className="art" viewBox="0 0 64 64"><defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5ec2ff"/><stop offset="1" stopColor="#1f7ce0"/></linearGradient></defs><rect x="6" y="6" width="52" height="52" rx="14" fill="url(#gl)"/><circle cx="32" cy="32" r="17" fill="none" stroke="#fff" strokeWidth="2"/><ellipse cx="32" cy="32" rx="8" ry="17" fill="none" stroke="#fff" strokeWidth="2"/><line x1="15" y1="32" x2="49" y2="32" stroke="#fff" strokeWidth="2"/></svg>);
}
function GitHubIcon() {
  return (<svg className="art" viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="14" fill="#24292f"/><path fill="#fff" d="M32 16c-9 0-16 7-16 16 0 7 4.6 13 11 15.1.8.1 1.1-.4 1.1-.8v-2.8c-4.4 1-5.4-2-5.4-2-.7-1.9-1.8-2.4-1.8-2.4-1.5-1 .1-1 .1-1 1.6.1 2.5 1.7 2.5 1.7 1.4 2.5 3.8 1.8 4.7 1.4.1-1.1.6-1.8 1-2.2-3.5-.4-7.2-1.8-7.2-7.9 0-1.7.6-3.2 1.6-4.3-.2-.4-.7-2 .2-4.3 0 0 1.3-.4 4.4 1.6a15 15 0 0 1 8 0c3-2 4.4-1.6 4.4-1.6.9 2.3.3 3.9.2 4.3 1 1.1 1.6 2.6 1.6 4.3 0 6.1-3.7 7.5-7.2 7.9.6.5 1.1 1.5 1.1 3v4.4c0 .4.3.9 1.1.8 6.4-2.1 11-8.1 11-15.1 0-9-7-16-16-16z"/></svg>);
}
function TrashIcon() {
  return (<svg className="art" viewBox="0 0 64 64"><rect x="16" y="20" width="32" height="34" rx="5" fill="#dfe0e4" stroke="#bcbcc2" strokeWidth="1.2"/><g stroke="#9a9aa0" strokeWidth="2"><line x1="26" y1="28" x2="26" y2="47"/><line x1="32" y1="28" x2="32" y2="47"/><line x1="38" y1="28" x2="38" y2="47"/></g><rect x="13" y="14" width="38" height="6" rx="3" fill="#c4c4ca"/><rect x="26" y="9" width="12" height="5" rx="2.5" fill="#c4c4ca"/></svg>);
}

/* ---------- FILE SYSTEM / CONTENT (from window.SITE) ---------- */
const SITE_ = window.SITE;

/* attach the affiliation logo as the detail card's hero media */
function groupDetail(g) {
  return Object.assign({}, g, g.logo ? { media: { type: "image", src: g.logo } } : {});
}

/* window content descriptors keyed by id */
const FILES = {
  publications: { kind: "finder", title: "Publications", icon: "folder", view: "list",
    items: SITE_.publications.map((p) => ({ type: "pdf", ...p })) },
  projects: { kind: "finder", title: "Projects", icon: "folder", view: "grid",
    items: SITE_.projects.map((p) => ({ type: "folder", ...p })) },
  talks: { kind: "finder", title: "Talks", icon: "folder", view: "list",
    items: SITE_.talks.map((p) => ({ type: "pdf", ...p })) },
  writing: { kind: "finder", title: "Writing", icon: "folder", view: "list",
    items: (SITE_.writing || []).map((p) => ({ type: "txt", title: p.title, venue: p.kind, year: p.date, blurb: p.blurb, keywords: p.keywords, slug: p.slug, url: p.url })) },
  outreach: { kind: "finder", title: "Outreach", icon: "folder", view: "grid",
    items: SITE_.outreach.map((p) => ({ type: "image", ...p })) },

  whyresearch: { kind: "text", title: "Why Research?.txt", icon: "txt",
    heading: SITE_.whyresearch.heading, by: SITE_.whyresearch.by, body: SITE_.whyresearch.body },
  background: { kind: "text", title: "Background.txt", icon: "txt",
    heading: SITE_.background.heading, by: SITE_.background.by, body: SITE_.background.body },

  about: { kind: "about", title: "About Me" },
  ori: { kind: "detail", title: SITE_.groups.ori.title, detail: groupDetail(SITE_.groups.ori) },
  ie: { kind: "detail", title: SITE_.groups.ie.title, detail: groupDetail(SITE_.groups.ie) },
  doom: { kind: "embed", title: "DOOM", url: "https://archive.org/embed/msdos_DOOM_1993" },
  mail: { kind: "mail", title: "Mail" },
  terminal: { kind: "terminal", title: "Terminal" },
  news: { kind: "news", title: "News" },
};

function DoomIcon() {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="doomg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7c1414" /><stop offset="1" stopColor="#240505" /></linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#doomg)" />
      <rect x="6" y="6" width="52" height="26" rx="14" fill="#fff" opacity="0.08" />
      <text x="32" y="40" textAnchor="middle" fill="#ff5a3c" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" fontWeight="800" letterSpacing="1">DOOM</text>
    </svg>
  );
}
function TerminalIcon() {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="termg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3a40" /><stop offset="1" stopColor="#1b1b1f" /></linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#termg)" />
      <rect x="6" y="6" width="52" height="14" rx="14" fill="#fff" opacity="0.10" />
      <path d="M16 26l9 7-9 7" fill="none" stroke="#3ad07a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="30" y1="42" x2="46" y2="42" stroke="#cfcfd4" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}
function NewsIcon() {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="12" width="48" height="40" rx="6" fill="#fff" stroke="#d2d2d6" strokeWidth="1.2" />
      <rect x="8" y="12" width="48" height="11" rx="6" fill="#e5341c" />
      <text x="32" y="21" textAnchor="middle" fill="#fff" fontFamily="Georgia, serif" fontSize="8" fontWeight="700" letterSpacing="0.5">NEWS</text>
      <g stroke="#c7c7cc" strokeWidth="2.4" strokeLinecap="round">
        <line x1="15" y1="31" x2="33" y2="31" /><line x1="15" y1="38" x2="33" y2="38" /><line x1="15" y1="45" x2="28" y2="45" />
      </g>
      <rect x="37" y="29" width="12" height="10" rx="1.5" fill="#cfe6ff" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="art" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="srchg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a8f98" /><stop offset="1" stopColor="#5a5f68" /></linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#srchg)" />
      <rect x="6" y="6" width="52" height="26" rx="14" fill="#fff" opacity="0.14" />
      <circle cx="29" cy="29" r="11" fill="none" stroke="#fff" strokeWidth="4" />
      <line x1="37" y1="37" x2="46" y2="46" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, {
  FolderIcon, DocIcon, ImageIcon, AppIcon, MailIcon, GlobeIcon, GitHubIcon, TrashIcon, DoomIcon, TerminalIcon, NewsIcon, SearchIcon,
  FILES,
});
