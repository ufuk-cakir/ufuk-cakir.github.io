const fs = require("fs");
const path = require("path");

const notesDir = __dirname;
const entriesDir = path.join(notesDir, "entries");

const escapeHtml = (value) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const slugify = (value) => value
  .toLowerCase()
  .replace(/^[0-9]+[.)]\s*/, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const isSafeHref = (href) => /^(https?:\/\/|mailto:|#|\.{0,2}\/|[a-z0-9][a-z0-9./?=&%#:_-]*$)/i.test(href)
  && !/^javascript:/i.test(href);

const renderInline = (text) => {
  const codeSpans = [];
  let output = text.replace(/`([^`]+)`/g, (_, code) => {
    const index = codeSpans.push(`<code>${escapeHtml(code)}</code>`) - 1;
    return `\u0000${index}\u0000`;
  });

  const linkSpans = [];
  output = output.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    if (!isSafeHref(href)) return label;
    const index = linkSpans.push(`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`) - 1;
    return `\u0001${index}\u0001`;
  });

  output = escapeHtml(output)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  output = output.replace(/\u0000(\d+)\u0000/g, (_, index) => codeSpans[Number(index)]);
  return output.replace(/\u0001(\d+)\u0001/g, (_, index) => linkSpans[Number(index)]);
};

const parseFrontMatter = (source) => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: source.trim() };

  const meta = {};
  match[1].split("\n").forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    meta[key] = value;
  });

  return {
    meta,
    body: source.slice(match[0].length).trim()
  };
};

const renderList = (items, tagName) => {
  const itemsHtml = items
    .map((item) => `<li>${renderInline(item)}</li>`)
    .join("\n");

  return `<${tagName}>\n${itemsHtml}\n</${tagName}>`;
};

const renderBlocks = (markdown) => {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let index = 0;
  let usedSummary = false;

  const readParagraph = () => {
    const paragraph = [];
    while (index < lines.length && lines[index].trim()) {
      if (/^#{1,6}\s+/.test(lines[index]) || /^(\d+\.|-)\s+/.test(lines[index])) break;
      paragraph.push(lines[index].trim());
      index += 1;
    }
    return paragraph.join(" ");
  };

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(Math.max(heading[1].length, 2), 6);
      const text = heading[2].trim();
      blocks.push(`<h${level} id="${slugify(text)}">${renderInline(text)}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(renderList(items, "ol"));
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push(renderList(items, "ul"));
      continue;
    }

    const paragraph = readParagraph();
    const className = usedSummary ? "" : " class=\"summary\"";
    blocks.push(`<p${className}>${renderInline(paragraph)}</p>`);
    usedSummary = true;
  }

  return blocks.join("\n\n");
};

const renderPage = ({ slug, meta, body }) => {
  const title = meta.title || slug;
  const description = meta.description || "A small encyclopedia-style note.";
  const details = [
    meta.first_version && `First version: ${meta.first_version}`,
    meta.status && `Status: ${meta.status}`,
    meta.author && `Author: ${meta.author}`,
    meta.reviewer && `Reviewer: ${meta.reviewer}`
  ].filter(Boolean).join(". ");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} - Notes</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="stylesheet" href="styles.css">
  <script src="search.js" defer></script>
</head>
<body>
  <div class="sheet">
    <header class="site-header">
      <div class="header-kicker">
        <span>Notes / 2026</span>
        <span>${escapeHtml(meta.status || "open entry")}</span>
      </div>

      <a class="wordmark" href="index.html" aria-label="Notes home">
        <span>Notes</span>
      </a>

      <nav class="quick-nav" aria-label="Site links">
        <a href="index.html">Index</a>
        <a href="#contents">Contents</a>
        <a href="https://github.com/ufuk-cakir/ufuk-cakir.github.io/issues">Review on GitHub</a>
      </nav>

      <form class="search-box" role="search" data-search-root>
        <label class="visually-hidden" for="notes-search">Search entries</label>
        <div class="search-control">
          <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6"></circle>
            <path d="M16 16 L21 21"></path>
          </svg>
          <input id="notes-search" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Search entries" data-search-input>
        </div>
        <ol class="search-results" data-search-results hidden></ol>
      </form>

      <p class="header-note">Definitions, references, and open notes</p>
    </header>

    <main>
      <p class="site-link"><a href="index.html">Notes</a></p>
      <article class="markdown-note" data-source="entries/${escapeHtml(slug)}.md">
        <header class="entry-head">
          <h1>${escapeHtml(title)}</h1>
          ${details ? `<p class="metadata">${escapeHtml(details)}.</p>` : ""}
        </header>

${renderBlocks(body).split("\n").map((line) => `        ${line}`).join("\n")}
      </article>
    </main>
  </div>
</body>
</html>
`;
};

fs.readdirSync(entriesDir)
  .filter((file) => file.endsWith(".md"))
  .forEach((file) => {
    const slug = path.basename(file, ".md");
    const source = fs.readFileSync(path.join(entriesDir, file), "utf8");
    const { meta, body } = parseFrontMatter(source);
    fs.writeFileSync(path.join(notesDir, `${slug}.html`), renderPage({ slug, meta, body }));
    console.log(`Built notes/${slug}.html`);
  });
