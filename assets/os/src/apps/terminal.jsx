/* ============================================================
   terminal.jsx — a fake "Terminal" app for Çakır OS.
   Self-contained: all CSS is inlined, data comes from window.SITE.
   Loaded as a classic <script> in the global scope, so the whole
   file is wrapped in an IIFE and only registers window.TerminalApp.
   ============================================================ */
(function () {
  "use strict";

  const { useState, useEffect, useRef, useCallback } = React;
  const SITE = (window.SITE && typeof window.SITE === "object") ? window.SITE : {};
  const ID = SITE.identity || {};

  /* ---------- helpers ---------- */
  const slug = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[''".,:;()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "untitled";

  const arr = (x) => (Array.isArray(x) ? x : []);
  const firstHref = (it) => {
    const links = arr(it && it.links);
    for (const l of links) if (l && l.href) return l.href;
    return it && it.url ? it.url : null;
  };

  /* ---------- build the virtual filesystem from SITE ---------- */
  function buildFS() {
    const mkItems = (list, ext) => {
      const out = {};
      const seen = {};
      arr(list).forEach((it) => {
        const base = slug(it.name || it.title);
        let name = ext ? base + ext : base;
        while (seen[name]) name = base + "-" + (seen[base] = (seen[base] || 1) + 1) + (ext || "");
        seen[name] = true;
        out[name] = { kind: "file", item: it };
      });
      return out;
    };

    const aboutTxt =
      [ID.name, ID.role, "", ID.tagline].filter(Boolean).join("\n") +
      "\n\nLocation: " + (ID.location || "—");

    return {
      kind: "dir",
      name: "~",
      children: {
        "publications": { kind: "dir", name: "publications", children: mkItems(SITE.publications, ".md") },
        "projects":     { kind: "dir", name: "projects",     children: mkItems(SITE.projects) },
        "talks":        { kind: "dir", name: "talks",        children: mkItems(SITE.talks, ".md") },
        "writing":      { kind: "dir", name: "writing",      children: mkItems(SITE.writing, ".md") },
        "outreach":     { kind: "dir", name: "outreach",     children: mkItems(SITE.outreach) },
        "about.txt":    { kind: "file", text: aboutTxt },
        ".secret":      { kind: "file", hidden: true, secret: true,
          text: "You found it. There's only one truth in this terminal...\nNever gonna give you up." },
      },
    };
  }

  /* resolve a path (string) against cwd (array of segment names) */
  function resolvePath(root, cwd, raw) {
    let segs;
    if (!raw || raw === "~" || raw === "/") segs = [];
    else if (raw.startsWith("~/")) segs = raw.slice(2).split("/");
    else if (raw.startsWith("/")) segs = raw.slice(1).split("/");
    else segs = cwd.concat(raw.split("/"));
    const out = [];
    for (const s of segs) {
      if (s === "" || s === ".") continue;
      if (s === "..") { out.pop(); continue; }
      out.push(s);
    }
    return out;
  }

  function nodeAt(root, segs) {
    let node = root;
    for (const s of segs) {
      if (!node || node.kind !== "dir") return null;
      node = node.children[s];
      if (!node) return null;
    }
    return node || root;
  }

  const promptPath = (cwd) => "~" + (cwd.length ? "/" + cwd.join("/") : "");

  /* ---------- render a single item as "cat" output lines ---------- */
  function catItem(it) {
    const lines = [];
    lines.push({ c: "h", t: it.title || it.name || "untitled" });
    const meta = [it.venue || it.meta || it.kind, it.year || it.date].filter(Boolean).join("  ·  ");
    if (meta) lines.push({ c: "dim", t: meta });
    const body = it.abstract || it.blurb;
    if (body) { lines.push({ t: "" }); lines.push({ t: body }); }
    const links = arr(it.links).filter((l) => l && l.href);
    const url = it.url && !links.length ? [{ label: "open", href: it.url }] : [];
    const all = links.concat(url);
    if (all.length) {
      lines.push({ t: "" });
      lines.push({ c: "dim", t: "links:" });
      all.forEach((l) => lines.push({ c: "link", t: "  " + (l.label || "↗") + "  " + l.href }));
    }
    return lines;
  }

  const HELP = [
    ["help", "show this list"],
    ["ls [-a] [path]", "list a directory"],
    ["cd <dir>", "change directory (cd .. , cd ~)"],
    ["pwd", "print working directory"],
    ["cat <file>", "print a file"],
    ["open <name>", "open an item's link in a new tab"],
    ["whoami", "who am i"],
    ["date", "current time in Oxford"],
    ["echo <text>", "say something back"],
    ["history", "show command history"],
    ["neofetch", "system info, fancy"],
    ["coffee", "brew a cup"],
    ["clear", "clear the screen"],
  ];

  const COFFEE = [
    "      ( (",
    "       ) )",
    "    .........",
    "    |       |]",
    "    \\       /",
    "     `-----'",
    "  ~ enjoy your coffee ~",
  ];

  const LOGO = [
    "   ____  ",
    "  / ___| ",
    " | |     ",
    " | |___  ",
    "  \\____| ",
  ];

  function neofetchLines() {
    const uptimeJoke = "way too long (send help, and coffee)";
    const info = [
      [(ID.name || "user") + "@cakir-os", ""],
      ["-----------------", ""],
      ["OS", "Çakır OS"],
      ["Host", ID.location || "Oxford"],
      ["Role", ID.roleShort || ID.role || "—"],
      ["Shell", "csh (Çakır shell)"],
      ["Uptime", uptimeJoke],
      ["Theme", "near-black / phosphor-green"],
    ];
    const out = [];
    const h = Math.max(LOGO.length, info.length);
    for (let i = 0; i < h; i++) {
      const left = (LOGO[i] || "        ").padEnd(10, " ");
      const pair = info[i];
      const right = pair ? (pair[1] ? pair[0] + ": " + pair[1] : pair[0]) : "";
      out.push({ c: "green", t: left + right });
    }
    return out;
  }

  /* ============================================================
     Component
     ============================================================ */
  function Terminal() {
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const fsRef = useRef(null);
    if (!fsRef.current) fsRef.current = buildFS();

    const [cwd, setCwd] = useState([]);
    const [lines, setLines] = useState(() => [
      { c: "green", t: "Çakır OS Terminal — v1.0" },
      { c: "dim", t: "Welcome, " + (ID.name || "friend") + "." },
      { c: "dim", t: "type 'help' to get started." },
      { t: "" },
    ]);
    const [value, setValue] = useState("");
    const [history, setHistory] = useState([]);
    const [hIdx, setHIdx] = useState(-1);

    const push = useCallback((arrLines) => {
      setLines((prev) => prev.concat(arrLines));
    }, []);

    const focus = useCallback(() => {
      const el = inputRef.current;
      if (el) el.focus();
    }, []);

    useEffect(() => { focus(); }, [focus]);

    useEffect(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, [lines]);

    /* ---------- command runner ---------- */
    const run = useCallback((raw) => {
      const root = fsRef.current;
      const line = raw.trim();
      const echoed = [{ c: "prompt", t: promptPath(cwd) + " $ " + raw }];
      if (!line) { push(echoed); return; }

      const parts = line.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      const rest = line.slice(parts[0].length).trim();
      const out = [];
      const err = (t) => out.push({ c: "err", t });

      switch (cmd) {
        case "help":
          out.push({ c: "dim", t: "available commands:" });
          HELP.forEach(([n, d]) => out.push({ t: "  " + n.padEnd(18, " ") + d }));
          out.push({ t: "" });
          out.push({ c: "dim", t: "tip: try 'ls', then 'cat <file>'. some things are hidden." });
          break;

        case "ls": {
          const showAll = args.includes("-a");
          const pathArg = args.filter((a) => !a.startsWith("-"))[0];
          const segs = resolvePath(root, cwd, pathArg);
          const node = pathArg == null ? nodeAt(root, cwd) : nodeAt(root, segs);
          if (!node) { err("ls: no such file or directory: " + pathArg); break; }
          if (node.kind === "file") { out.push({ t: pathArg }); break; }
          const names = Object.keys(node.children);
          if (showAll) { out.push({ c: "dim", t: "." }); out.push({ c: "dim", t: ".." }); }
          let any = false;
          names.forEach((nm) => {
            const ch = node.children[nm];
            if (ch.hidden && !showAll) return;
            any = true;
            out.push({ c: ch.kind === "dir" ? "dir" : (ch.hidden ? "dim" : "file"), t: ch.kind === "dir" ? nm + "/" : nm });
          });
          if (!any && !showAll) out.push({ c: "dim", t: "(empty)" });
          break;
        }

        case "cd": {
          const target = args[0];
          if (!target || target === "~") { setCwd([]); break; }
          const segs = resolvePath(root, cwd, target);
          const node = nodeAt(root, segs);
          if (!node) { err("cd: no such directory: " + target); break; }
          if (node.kind !== "dir") { err("cd: not a directory: " + target); break; }
          setCwd(segs);
          break;
        }

        case "pwd":
          out.push({ t: promptPath(cwd) });
          break;

        case "cat": {
          const target = args[0];
          if (!target) { err("cat: usage: cat <file>"); break; }
          const segs = resolvePath(root, cwd, target);
          const node = nodeAt(root, segs);
          if (!node || node === root || node.kind === "dir") {
            if (node && node.kind === "dir") err("cat: " + target + ": is a directory");
            else err("cat: " + target + ": no such file");
            break;
          }
          if (node.secret) {
            node.text.split("\n").forEach((t) => out.push({ c: "green", t }));
            out.push({ c: "dim", t: "(opening a classic...)" });
            try { window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank"); } catch (e) {}
            break;
          }
          if (node.text != null) { node.text.split("\n").forEach((t) => out.push({ t })); break; }
          if (node.item) { catItem(node.item).forEach((l) => out.push(l)); break; }
          out.push({ c: "dim", t: "(no content)" });
          break;
        }

        case "open": {
          const target = args[0];
          if (!target) { err("open: usage: open <name>"); break; }
          const segs = resolvePath(root, cwd, target);
          const node = nodeAt(root, segs);
          if (!node || !node.item) { err("open: " + target + ": nothing to open"); break; }
          const href = firstHref(node.item);
          if (!href) { err("open: " + target + ": this item has no link"); break; }
          try { window.open(href, "_blank"); } catch (e) {}
          out.push({ c: "link", t: "opening " + (node.item.title || node.item.name) + " → " + href });
          break;
        }

        case "whoami":
          out.push({ t: ID.name || "unknown" });
          break;

        case "date":
          try {
            out.push({ t: new Intl.DateTimeFormat("en-GB", {
              timeZone: "Europe/London", dateStyle: "full", timeStyle: "medium",
            }).format(new Date()) + "  (Oxford time)" });
          } catch (e) { out.push({ t: String(new Date()) }); }
          break;

        case "echo":
          out.push({ t: rest });
          break;

        case "history":
          if (!history.length) out.push({ c: "dim", t: "(no history yet)" });
          history.forEach((h, i) => out.push({ t: String(i + 1).padStart(3, " ") + "  " + h }));
          break;

        case "neofetch":
          neofetchLines().forEach((l) => out.push(l));
          break;

        case "clear":
          setLines([]);
          return;

        case "coffee":
          COFFEE.forEach((t) => out.push({ c: "green", t }));
          break;

        case "rickroll":
          out.push({ c: "green", t: "Never gonna let you down..." });
          try { window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank"); } catch (e) {}
          break;

        case "sudo":
          out.push({ c: "err", t: "Nice try. This incident will be reported." });
          break;

        case "exit":
          out.push({ c: "dim", t: "There is no escape. (close the window like a normal person.)" });
          break;

        case "make":
          if (rest.toLowerCase() === "me a sandwich")
            out.push({ c: "dim", t: "What? Make it yourself. (try: sudo make me a sandwich)" });
          else
            out.push({ c: "err", t: "make: nothing to be done for '" + rest + "'" });
          break;

        default:
          err(cmd + ": command not found. type 'help'.");
      }

      push(echoed.concat(out));
    }, [cwd, history, push]);

    /* ---------- input handling ---------- */
    const onKeyDown = useCallback((e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const raw = value;
        run(raw);
        if (raw.trim()) setHistory((h) => h.concat(raw.trim()));
        setValue("");
        setHIdx(-1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHistory((h) => {
          if (!h.length) return h;
          setHIdx((idx) => {
            const next = idx < 0 ? h.length - 1 : Math.max(0, idx - 1);
            setValue(h[next]);
            return next;
          });
          return h;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHistory((h) => {
          if (!h.length) return h;
          setHIdx((idx) => {
            if (idx < 0) return -1;
            const next = idx + 1;
            if (next >= h.length) { setValue(""); return -1; }
            setValue(h[next]);
            return next;
          });
          return h;
        });
      }
    }, [value, run]);

    const cls = (c) =>
      "term-line" +
      (c === "err" ? " term-err" :
       c === "dir" ? " term-dir" :
       c === "file" ? " term-file" :
       c === "dim" ? " term-dim" :
       c === "h" ? " term-h" :
       c === "link" ? " term-link" :
       c === "green" ? " term-green" :
       c === "prompt" ? " term-promptline" : "");

    return (
      <div className="win-body app-term" ref={rootRef} onClick={focus}>
        <style>{`
          .app-term {
            flex: 1; min-height: 0; display: flex; flex-direction: column;
            background: #0b0d10; color: #d7dbd9;
            font-family: ui-monospace, "SF Mono", Menlo, Monaco, monospace;
            font-size: 13px; line-height: 1.5; cursor: text;
          }
          .term-scroll {
            flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;
            padding: 14px 16px 4px 16px; -webkit-overflow-scrolling: touch;
          }
          .term-scroll::-webkit-scrollbar { width: 10px; }
          .term-scroll::-webkit-scrollbar-thumb { background: #2a3138; border-radius: 6px; }
          .term-line { white-space: pre-wrap; word-break: break-word; color: #d7dbd9; }
          .term-dim { color: #7d8a91; }
          .term-err { color: #ff6b6b; }
          .term-dir { color: #5fb3ff; font-weight: 600; }
          .term-file { color: #c8e6c9; }
          .term-h { color: #b6f0a8; font-weight: 700; }
          .term-link { color: #6fd1e0; }
          .term-green { color: #7ee787; }
          .term-promptline { color: #8fb3c9; }
          .term-inputrow {
            display: flex; align-items: center; padding: 4px 16px 14px 16px;
            gap: 8px; flex: 0 0 auto;
          }
          .term-ps1 { color: #7ee787; white-space: nowrap; }
          .term-inputwrap { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; }
          .term-input {
            flex: 1; min-width: 0; background: transparent; border: 0; outline: none;
            color: #d7dbd9; font-family: inherit; font-size: inherit; line-height: 1.5;
            padding: 0; caret-color: transparent;
          }
          .term-caret {
            display: inline-block; width: 8px; height: 1.05em; margin-left: 1px;
            background: #7ee787; vertical-align: text-bottom;
            animation: term-blink 1.05s step-end infinite;
          }
          @keyframes term-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
        `}</style>

        <div className="term-scroll" ref={scrollRef}>
          {lines.map((ln, i) => (
            <div className={cls(ln.c)} key={i}>{ln.t === "" ? " " : ln.t}</div>
          ))}
        </div>

        <div className="term-inputrow" onClick={focus}>
          <span className="term-ps1">{promptPath(cwd)} $</span>
          <label className="term-inputwrap">
            <input
              ref={inputRef}
              className="term-input"
              value={value}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="terminal input"
            />
            <span className="term-caret" />
          </label>
        </div>
      </div>
    );
  }

  window.TerminalApp = Terminal;
})();
