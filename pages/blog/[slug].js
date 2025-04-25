// pages/blog/[slug].js
import React, { useRef /* Remove useState if BlogEditor is gone */ } from "react";
import { getPostBySlug, getAllPosts } from "../../utils/api"; // Keep api utils
import markdownToHtml from "../../utils/markdownToHtml"; // Keep markdown util
import Header from "../../components/Header";
import ContentSection from "../../components/ContentSection"; // <-- Ensure this is the CORRECT component
import Footer from "../../components/Footer";
import Head from "next/head";
import { useIsomorphicLayoutEffect } from "../../utils"; // Keep utils
import { stagger } from "../../animations"; // Keep animations
// import Button from "../../components/Button"; // Remove if BlogEditor is gone
// import BlogEditor from "../../components/BlogEditor"; // Remove this
// import { useRouter } from "next/router"; // Remove if BlogEditor is gone
import Cursor from "../../components/Cursor";
import data from "../../data/portfolio.json";

const BlogPost = ({ post }) => { // 'post' object now contains post.content as HTML string
  // Remove state/refs related to BlogEditor if you removed it
  // const [showEditor, setShowEditor] = useState(false);
  // const router = useRouter();
  const textOne = useRef();
  const textTwo = useRef();


  useIsomorphicLayoutEffect(() => {
    stagger([textOne.current, textTwo.current], { y: 30 }, { y: 0 });
  }, []);

  return (
    <>
      <Head>
        <title>{"Blog - " + post.title}</title>
        <meta name="description" content={post.preview} />
      </Head>
      {data.showCursor && <Cursor />}

      <div
        className={`container mx-auto mt-10 mb-10 px-4 ${ // Added px-4 for consistency
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog={true} />
        <div className="mt-10 flex flex-col">
          {/* Use next/image if you optimized image handling */}
          <img
            className="w-full max-h-96 rounded-lg shadow-lg object-cover" // Added max-h-96 example
            src={post.image} // Make sure path is correct (e.g., relative to /public)
            alt={post.title}
            // Add width/height if using next/image
          />
          <h1
            ref={textOne}
            className="mt-10 text-4xl mob:text-2xl laptop:text-6xl text-bold"
          >
            {post.title}
          </h1>
          <h2
            ref={textTwo}
            className="mt-2 text-xl max-w-4xl text-darkgray opacity-50" // dark:text-gray-400 ?
          >
            {post.tagline}
          </h2>
        </div>

        {/* === USE THE CORRECT CONTENT SECTION === */}
        {/* This should now render the HTML string from post.content */}
        <ContentSection content={post.content} />
        {/* ======================================= */}

        <Footer />
      </div>

      {/* Remove BlogEditor button and component if desired */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setShowEditor(true)} type={"primary"}>
            Edit this blog
          </Button>
        </div>
      )}

      {showEditor && (
        <BlogEditor
          post={post}
          close={() => setShowEditor(false)}
          refresh={() => router.reload(window.location.pathname)}
        />
      )} */}
    </>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    "date",
    "slug",
    "preview",
    "title",
    "tagline",
    "image",
    "content", // Fetch RAW markdown
  ]);

  if (!post) {
    return { notFound: true };
  }

  // Convert raw markdown to HTML string HERE
  const htmlContent = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content: htmlContent, // Pass the generated HTML string
      },
    },
    // revalidate: 60, // Optional: ISR
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
export default BlogPost;
