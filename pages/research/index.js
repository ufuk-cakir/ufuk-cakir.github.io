import Head from "next/head";
import Router from "next/router"; // Use Router for navigation
import { useRef } from "react";
import { stagger } from "../../animations"; // Assuming animations apply here too
import Header from "../../components/Header";
import Cursor from "../../components/Cursor"; // Include if using cursor globally
import Footer from "../../components/Footer"; // Optional: Add Footer for consistency
import data from "../../data/portfolio.json";
import { ISOToDate, useIsomorphicLayoutEffect } from "../../utils";
import { getAllProjects } from "../../utils/api"; // Ensure this fetches research projects

const ResearchIndex = ({ projects }) => {
  const showResearch = useRef(data.showResearch); // Use showResearch from JSON
  const titleRef = useRef(); // Ref for potential title animation
  const gridRef = useRef(); // Ref for potential grid animation

  useIsomorphicLayoutEffect(() => {
    // Apply animations if desired, similar to blog/home
    stagger(
      [titleRef.current], // Animate title
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1 }
    );
     // Optional: Animate grid items
     // if (gridRef.current) {
     //  stagger(gridRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, 0.05);
     // }

    // Redirect if research section is disabled in portfolio.json
    if (!showResearch.current) {
      Router.push("/");
    }
  }, []);

  // Redirect on client-side if disabled (e.g., after editing data)
  if (!showResearch.current && typeof window !== "undefined") {
     Router.push("/");
     return null; // Return null while redirecting
  }


  return (
    // Conditionally render based on showResearch flag
    showResearch.current && (
      <>
        <Head>
          <title>Research</title>
        </Head>
        {data.showCursor && <Cursor />}

        <div className={`container mx-auto mb-10 px-4 ${data.showCursor && "cursor-none"}`}>
          {/* Pass isBlog={false} or a specific prop like isResearch if Header needs it */}
          <Header />
          <div className="mt-10">
            <h1
              ref={titleRef}
              className="text-4xl laptop:text-6xl laptopl:text-8xl text-bold p-1 mob:p-2"
            >
              Research.
            </h1>

            {/* Grid for Research Project Cards */}
            <div ref={gridRef} className="mt-10 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-10">
              {projects && projects.map((project) => (
                // Research Card
                <div
                  key={project.slug}
                  onClick={() => Router.push(`/research/${project.slug}`)} // Navigate to research slug
                  className="cursor-pointer group overflow-hidden rounded-lg shadow-hover transition-shadow duration-300 bg-white dark:bg-slate-800 p-4" // Added basic card styling
                >
                  <div className="relative w-full h-60 rounded-md overflow-hidden mb-4">
                     <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Added hover effect
                     />
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold">{project.title}</h2>
                  <p className="mt-2 text-base opacity-70 dark:opacity-60">{project.preview}</p>
                  <span className="block text-sm mt-3 opacity-50 dark:opacity-40">
                    {ISOToDate(project.date)}
                  </span>
                </div>
              ))}
            </div>
            {/* Display message if no projects found */}
             {(!projects || projects.length === 0) && (
               <p className="mt-10 text-xl opacity-70">No research projects published yet.</p>
             )}
          </div>
          {/* <Footer /> */} {/* Uncomment if you want a footer */}
        </div>
      </>
    )
  );
};

export async function getStaticProps() {
  // Fetch all projects designated as 'research' if you have a type field,
  // or simply fetch all from a specific directory if they are separate.
  // Assuming getAllProjects fetches the correct items here.
  const projects = getAllProjects([
    "slug",
    "title",
    "image",
    "preview",
    "date",
    // Add any other fields needed for the card
  ]);

  return {
    props: {
      // Sort projects by date, newest first (optional)
      projects: projects.sort((a, b) => new Date(b.date) - new Date(a.date)),
    },
     revalidate: 60, // Optional: ISR - revalidate every 60 seconds
  };
}

export default ResearchIndex;
