import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // <--- 1. Import remark-gfm
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Choose a style that works well with your light/dark theme
// Or: import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
// Or: import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism";


// Your existing CodeBlock component for syntax highlighting
const CodeBlock = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        language={match[1]}
        PreTag="div"
        className="code-block-wrapper" // Optional: Add a class for potential wrapper styling
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const ContentSection = ({ content }) => {
  return (
    // 2. Wrap ReactMarkdown in a div/article with Tailwind's prose classes
    //    - `prose`: applies base typography styles
    //    - `lg:prose-lg` or `lg:prose-xl`: increases font size on larger screens
    //    - `dark:prose-invert`: adapts styles for dark mode (requires dark mode setup in Tailwind)
    //    - `max-w-none`: prevents prose from setting its own max-width if the parent container handles width
    //    - `mx-auto`: Center the content container (adjust if parent handles centering)
    //    - `mt-8 mb-10 px-4`: Add vertical margin and horizontal padding as needed
    <article className="prose lg:prose-xl dark:prose-invert max-w-none mx-auto mt-8 mb-10 px-4">
      <ReactMarkdown
        components={CodeBlock}
        remarkPlugins={[remarkGfm]} // <--- 3. Add remarkGfm to plugins array
        // Removed className="markdown-class" from ReactMarkdown itself
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default ContentSection;
