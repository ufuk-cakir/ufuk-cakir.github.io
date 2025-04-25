import React from "react"; // No need for useRef/useState unless adding dev editor
import Head from "next/head";
import Header from "../../components/Header";
import ContentSection from "../../components/ContentSection"; // USE THIS
import Footer from "../../components/Footer"; // Optional: Add Footer
import Cursor from "../../components/Cursor"; // Optional: Add Cursor
import { getAllProjects, getProjectBySlug } from "../../utils/api"; // Ensure correct API calls
import data from "../../data/portfolio.json"; // For cursor setting
import { ISOToDate } from "../../utils"; // Optional: If displaying date

// Removed: useIsomorphicLayoutEffect, stagger, Button, BlogEditor, useRouter, useState

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
              className="w-full max-w-5xl mx-auto h-auto md:h-96 rounded-lg shadow-lg object-cover mb-8" // Adjusted styling
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
                className="btn-primary" // Use your existing button style class
                href={project.github}
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security best practice
              >
                Code / Repository
              </a>
            )}
            {project.paper && (
              <a
                className="btn-primary" // Use your existing button style class
                href={project.paper}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read Paper
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
    "slug", // Needed potentially?
    "title",
    "image",
    "github", // Link for code
    "paper", // Link for paper PDF/page
    "date", // Optional: for display
    "content", // **CRUCIAL: Fetch RAW Markdown content**
    // Add any other fields displayed on the page (e.g., preview, tagline if used)
  ]);

  // **DO NOT convert markdown here - ContentSection handles it**
  // // project.content = await markdownToHtml(project.content); // <-- REMOVED THIS LINE

  if (!project) {
    return { notFound: true }; // Return 404 if project not found
  }

  return {
    props: {
      project: {
        ...project,
        // Ensure content is passed if fetched correctly
        content: project.content || "", // Pass empty string if content is missing
      },
    },
    revalidate: 60, // Optional: ISR
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
