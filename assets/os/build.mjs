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

const files = ["os-data", "os-app"];
for (const name of files) {
  const src = readFileSync(new URL(`./src/${name}.jsx`, import.meta.url), "utf8");
  const { code } = Babel.transform(src, {
    presets: [["react", { runtime: "classic" }]],
    filename: `${name}.jsx`,
  });
  writeFileSync(new URL(`./${name}.js`, import.meta.url), code);
  console.log(`built ${name}.js`);
}
