/* Citation exporter for publications.js
 *
 *   cd assets/os && node gen-citations.mjs
 *
 * Reads the single source of truth (publications.js) and writes:
 *   - publications.bib   BibTeX, ready to drop into a LaTeX CV / Overleaf
 *   - PUBLICATIONS.md     a numbered, formatted list to paste anywhere
 *
 * It also prints a summary of any missing citation fields (co-authors, DOI,
 * arXiv id) so you know what is still left to fill in. No network, no deps.
 */
import { readFileSync, writeFileSync } from "node:fs";

/* ---- load publications.js (a plain `window.X = {...}` script) ---- */
const src = readFileSync(new URL("./publications.js", import.meta.url), "utf8");
const sandbox = { window: {} };
new Function("window", src)(sandbox.window);
const DATA = sandbox.window.SITE_PUBLICATIONS || { items: [] };
const ME = (DATA.me || "").toLowerCase();
const items = DATA.items || [];

/* ---- helpers ---- */
const isMe = (name) => ME && name.toLowerCase().includes(ME);

/* "Ufuk Çakır" -> "U. Çakır"  ·  "Anna M Smith" -> "A. M. Smith" */
function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const last = parts.pop();
  return parts.map((p) => p[0].toUpperCase() + ".").join(" ") + " " + last;
}

/* derive a BibTeX key if the entry didn't supply one */
function fallbackKey(p, i) {
  const first = (p.authors && p.authors[0]) || "anon";
  const surname = first.trim().split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g, "");
  const word = (p.title || "ref").toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/)[0];
  return (surname || "ref") + (p.year || "") + (word || i);
}

/* ---- BibTeX ---- */
function bibEntry(p, i) {
  const type = p.type || "misc";
  const key = p.key || fallbackKey(p, i);
  const fields = [];
  const add = (k, v) => { if (v) fields.push(`  ${k.padEnd(12)}= {${v}}`); };

  add("title", p.title && `{${p.title}}`); // extra braces preserve capitalization
  if (p.authors && p.authors.length) add("author", p.authors.join(" and "));
  add("year", p.year);

  if (type === "article") add("journal", p.booktitle || p.venue);
  else if (type === "inproceedings") add("booktitle", p.booktitle || p.venue);
  else if (type === "mastersthesis" || type === "phdthesis") {
    // venue like "B.Sc. thesis · Heidelberg University"
    const school = (p.venue || "").split("·").map((s) => s.trim()).find((s) => /universit|institut|college/i.test(s));
    add("school", school || p.venue);
    if (/b\.?sc|bachelor/i.test(p.venue || "")) add("type", "Bachelor's thesis");
  } else if (p.venue) add("howpublished", p.venue);

  add("doi", p.doi);
  if (p.arxiv) { add("eprint", p.arxiv); add("archivePrefix", "arXiv"); }
  if (!p.doi && p.arxiv) add("url", `https://arxiv.org/abs/${p.arxiv}`);

  return `@${type}{${key},\n${fields.join(",\n")}\n}`;
}

/* ---- Markdown CV list ---- */
function mdEntry(p) {
  const authors = (p.authors || []).map((a) => {
    const s = initials(a);
    return isMe(a) ? `**${s}**` : s;
  }).join(", ");
  // gather external links (citation identifiers first), de-duplicated by href
  const raw = [];
  if (p.doi) raw.push({ label: "doi", href: `https://doi.org/${p.doi}` });
  if (p.arxiv) raw.push({ label: "arXiv", href: `https://arxiv.org/abs/${p.arxiv}` });
  (p.links || []).forEach((l) =>
    raw.push({ label: (l.label || l.type || "link").replace(/\s*↗$/, ""), href: l.href })
  );
  const seen = new Set();
  const links = raw
    .filter((l) => l.href && /^https?:/.test(l.href)) // skip internal site links
    .filter((l) => (seen.has(l.href) ? false : seen.add(l.href)))
    .map((l) => `[${l.label}](${l.href})`);

  const venue = p.booktitle || p.venue; // full name reads better in a CV
  const bits = [];
  if (authors) bits.push(authors + ".");
  bits.push(`"${p.title}."`);
  if (venue) bits.push(`*${venue}*` + (p.year ? `, ${p.year}.` : "."));
  else if (p.year) bits.push(`${p.year}.`);
  if (p.status) bits.push(`(${p.status})`);
  if (links.length) bits.push(links.join(" · "));
  return bits.join(" ");
}

/* newest first for both outputs */
const sorted = items.slice().sort((a, b) => (b.year || "").localeCompare(a.year || ""));

const bib = sorted.map(bibEntry).join("\n\n") + "\n";
const md =
  "# Publications\n\n" +
  "<!-- Generated from assets/os/publications.js by gen-citations.mjs — do not edit by hand. -->\n\n" +
  sorted.map((p, i) => `${i + 1}. ${mdEntry(p)}`).join("\n\n") + "\n";

writeFileSync(new URL("./publications.bib", import.meta.url), bib);
writeFileSync(new URL("./publications.md", import.meta.url), md);

/* ---- report what still needs filling in ---- */
console.log(`Wrote publications.bib and PUBLICATIONS.md (${items.length} entries).`);
const warn = [];
const isThesis = (p) => p.type === "mastersthesis" || p.type === "phdthesis";
items.forEach((p) => {
  const miss = [];
  // theses are legitimately single-author and usually have no doi/arxiv
  if (!isThesis(p)) {
    if (!p.authors || p.authors.length <= 1) miss.push("co-authors");
    if (!p.doi && !p.arxiv) miss.push("doi/arxiv");
  }
  if (miss.length) warn.push(`  - ${p.key || p.title}: missing ${miss.join(", ")}`);
});
if (warn.length) console.log("\nStill to fill in for complete citations:\n" + warn.join("\n"));
