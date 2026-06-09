/* Build step for Çakır OS.
 *
 * Transpiles the JSX sources in src/ into plain browser JS so the page
 * needs no in-browser Babel. Run after editing anything in src/:
 *
 *     cd assets/os
 *     npm install @babel/standalone   # one-time
 *     node build.mjs
 *
 * (Editing content.js needs NO rebuild — it is already plain JS.)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Babel = require("@babel/standalone");

const files = [
  { src: "src/os-data.jsx", out: "os-data.js" },
  { src: "src/os-app.jsx", out: "os-app.js" },
  { src: "src/apps/terminal.jsx", out: "apps/terminal.js" },
  { src: "src/apps/news.jsx", out: "apps/news.js" },
];
for (const f of files) {
  const src = readFileSync(new URL(`./${f.src}`, import.meta.url), "utf8");
  const { code } = Babel.transform(src, {
    presets: [["react", { runtime: "classic" }]],
    filename: f.src,
  });
  writeFileSync(new URL(`./${f.out}`, import.meta.url), code);
  console.log(`built ${f.out}`);
}
