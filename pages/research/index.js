import Head from "next/head";
import Image from 'next/image'; // Import next/image
import Router from "next/router";
import { useRef } from "react";
import { stagger } from "../../animations"; // Assuming animations apply here too
import Header from "../../components/Header";
import Cursor from "../../components/Cursor"; // Include if using cursor globally
// import Footer from "../../components/Footer"; // Optional: Add Footer for consistency
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

            {/* Grid for Research Project Cards - Adjusted gap */}
            <div
              ref={gridRef}
              className="mt-10 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
            >
              {projects && projects.map((project) => (
                // --- Research Card Start ---
                <div
                  key={project.slug}
                  onClick={() => Router.push(`/research/${project.slug}`)}
                  // Use flex-col for vertical stacking, basic card styles
className="cursor-pointer overflow-hidden rounded-lg
           border border-cyan-400/50 dark:border-cyan-600/60  // Border: Cyan, slightly transparent
           shadow-lg shadow-cyan-400/20 dark:shadow-cyan-600/20 // Glow: Subtle cyan shadow
           hover:shadow-xl hover:shadow-cyan-400/40 dark:hover:shadow-cyan-500/40 // Enhanced glow on hover
           transition-all duration-300 // Transition border, shadow, etc.
           flex flex-col" // Keep flex layout
                >
                  {/* Image Container: Use aspect ratio for responsive height */}
                  <div className="relative w-full  aspect-video overflow-hidden scale-90 rounded-lg">
                     {/* Use next/image for optimization */}
                     <Image
                      src={project.image}
                      alt={project.title}
                      layout= "fill" // Fill parent container
                      objectFit="cover" // Equivalent to object-cover CSS
                      // Add hover effect directly to image if desired
                      className="transition-transform duration-300 hover:scale-105"
                     />
                  </div>

                  {/* Text Content Area with Padding */}
                  <div className="p-4 flex flex-col flex-grow"> {/* flex-grow helps align content if cards vary in height */}
                    {/* Title: Responsive font size, explicit colors */}
                    <h2 className="text-lg sm:text-xl font-semibold">
                      {project.title}
                    </h2>

                    {/* Preview: Responsive font size, explicit colors, takes available space */}
                    <p className="mt-2 text-sm sm:text-base flex-grow">
                      {project.preview}
                    </p>

                    {/* Date: Responsive font size, explicit colors, spacing */}
                    <span className="block text-xs sm:text-sm mt-3 pt-2 text-gray-500 dark:text-gray-400">
                      {ISOToDate(project.date)}
                    </span>
                  </div>
                </div>
                // --- Research Card End ---
              ))}
            </div>

            {/* Display message if no projects found */}
             {(!projects || projects.length === 0) && (
               <p className="mt-10 text-lg sm:text-xl opacity-80 dark:opacity-70">
                 No research projects published yet.
               </p>
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
    "image", // Ensure image path is correct for next/image (usually root-relative like /images/research/my-image.jpg)
    "preview",
    "date",
    // Add any other fields needed for the card
  ]);

  // Make sure the 'image' path in your markdown/data files is suitable for next/image
  // e.g., it should start with '/' if the image is in the public directory.

  return {
    props: {
      // Sort projects by date, newest first (optional)
      projects: projects.sort((a, b) => new Date(b.date) - new Date(a.date)),
    }
  };
}

export default ResearchIndex;
