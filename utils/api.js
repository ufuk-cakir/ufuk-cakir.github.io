import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

/* ─────────────── BLOG HELPERS ─────────────── */

const postsDir = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDir);
}

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const filePath = join(postsDir, `${realSlug}.md`);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  const item = {};
  fields.forEach((field) => {
    if (field === "slug") item.slug = realSlug;
    else if (field === "content") item.content = content;
    else if (data[field] !== undefined) item[field] = data[field];
  });

  return item;
}

export function getAllPosts(fields = []) {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug, fields))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

/* ──────────── RESEARCH HELPERS ───────────── */

const projectsDir = join(process.cwd(), "_research");

export function getProjectSlugs() {
  return fs.readdirSync(projectsDir);
}

export function getProjectBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const filePath = join(projectsDir, `${realSlug}.md`);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  const item = {};
  fields.forEach((field) => {
    if (field === "slug") item.slug = realSlug;
    else if (field === "content") item.content = content;
    else if (data[field] !== undefined) {
      // Ensure JSON-serialisable dates
      item[field] =
        field === "date" && data[field] instanceof Date
          ? data[field].toISOString()
          : data[field];
    }
  });

  return item;
}

export function getAllProjects(fields = []) {
  return getProjectSlugs()
    .map((slug) => getProjectBySlug(slug, fields))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
