import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

export default async function markdownToHtml(markdown) {
  if (!markdown) {
    return "";
  }
  try {
    const result = await remark()
      .use(remarkGfm)
      // Ensure allowDangerousHtml is true if you use raw HTML in markdown
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHighlight)
      .use(rehypeStringify) // This should be the LAST step in the core chain
      .process(markdown);

    return result.toString();
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
    return `<p>Error rendering content: ${error.message}</p>`;
  }
}
