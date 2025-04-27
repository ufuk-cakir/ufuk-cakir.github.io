import React from "react"; // No need for useRef/useState unless adding dev editor
import Head from "next/head";
import Header from "../../components/Header";
import ContentSection from "../../components/ContentSection"; // USE THIS
import Footer from "../../components/Footer"; // Optional: Add Footer
import Cursor from "../../components/Cursor"; // Optional: Add Cursor
import { getAllProjects, getProjectBySlug } from "../../utils/api"; // Ensure correct API calls
import data from "../../data/portfolio.json"; // For cursor setting
import { ISOToDate } from "../../utils"; // Optional: If displaying date
import markdownToHtml from '../../utils/markdownToHtml'; // <-- ADD THIS LINE
// Removed: useIsomorphicLayoutEffect, stagger, Button, BlogEditor, useRouter, useState
import { Github, FileText } from "lucide-react";
const ResearchProject = ({ project }) => {
  // Removed state and refs related to editor and animations

  // Basic check if project data exists
  if (!project) {
    return <div>Project not found.</div>; // Or a more sophisticated loading/error state
  }

  return (
    <>
      <Head>
        {/* Use project title in Head */}
        <title>{project.title}</title>
        {/* Optional: Add description meta tag */}
        {/* <meta name="description" content={project.preview || project.title} /> */}
      </Head>
      {data.showCursor && <Cursor />}

      <div className={`container mx-auto mt-10 mb-10 px-4 ${data.showCursor && "cursor-none"}`}>
        {/* Pass props to Header if needed */}
        <Header /* isBlog={false} */ />

        <div className="mt-10 flex flex-col">
          {/* Project Header Section - Title, Image, Buttons */}
          {project.image && (
             <img
              className="scale-70 w-full max-w-5xl mx-auto h-auto md:h-96 rounded-xl shadow-lg object-cover mb-8" // Adjusted styling
              src={project.image}
              alt={project.title}
            />
          )}
          <h1
            // ref={textOne} // Removed animation ref
            className="mt-6 text-center text-3xl mob:text-2xl laptop:text-5xl text-bold px-2"
          >
            {project.title}
          </h1>
           {/* Optional: Display Date */}
           {/* <p className="text-center text-md opacity-60 mt-2">{ISOToDate(project.date)}</p> */}

          {/* Buttons for Code/Paper */}
<div className="flex flex-wrap justify-center gap-4 my-6">
  {project.github && (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary inline-flex items-center gap-2"
    >
      <Github className="h-5 w-5" aria-hidden="true" />
      <span>Code</span>
    </a>
  )}

  {project.paper && (
    <a
      href={project.paper}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary inline-flex items-center gap-2"
    >
      <FileText className="h-5 w-5" aria-hidden="true" />
      <span>Read&nbsp;Paper</span>
    </a>
  )}
</div>
        </div>

        {/* Use ContentSection to render the Markdown content */}
        {/* Ensure project.content contains RAW MARKDOWN */}
        <ContentSection content={project.content} />

        {/* Optional: Add Footer */}
        {/* <Footer /> */}
      </div>

      {/* Removed Development Editor Button and Modal */}
    </>
  );
};





export async function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug, [
    "slug",
    "title",
    "image",
    "github",
    "paper",
    "date",
    "content", // Fetch RAW Markdown content
  ]);

  if (!project) {
    return { notFound: true };
  }

  // Convert markdown to HTML at build time
  // This line caused the error because markdownToHtml wasn't imported
  const htmlContent = await markdownToHtml(project.content || "");

  return {
    props: {
      project: {
        ...project,
        content: htmlContent, // Pass the generated HTML
      },
    },
  };
}

export async function getStaticPaths() {
  // Fetch slugs for all research projects
  const projects = getAllProjects(["slug"]);

  return {
    paths: projects.map((project) => {
      return {
        params: {
          slug: project.slug,
        },
      };
    }),
    fallback: false, // Or 'blocking'/'true' if needed
  };
}

export default ResearchProject;
