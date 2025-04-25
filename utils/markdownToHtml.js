
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm'; // <--- IMPORT GFM PLUGIN

export default async function markdownToHtml(markdown) {
  if (!markdown) {
    return "";
  }
  try {
    const result = await remark()
      .use(remarkGfm) // <--- ADD THE PLUGIN HERE
      .use(html, { sanitize: false }) // Ensure sanitize:false or a schema allowing tables
      .process(markdown);
    return result.toString();
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
    return `<p>Error rendering content.</p>`;
  }
}
