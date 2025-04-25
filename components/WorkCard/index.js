import React from "react";

/**
 * WorkCard component
 *  - Accepts `src` **or** legacy `img` prop.
 *  - Renders <video> for .mp4/.webm/.ogg (or when `isVideo={true}`) otherwise <img>.
 *  - Optimized for single-column layout.
 *  - Usage:
 *      <WorkCard src="/demo.mp4" name="Demo" description="…" />
 *      <WorkCard img="/demo.jpg"  name="Image" description="…" />
 */

const isVideoExt = (path) => /\.(mp4|webm|ogg)$/i.test(path || ''); // Added check for null/undefined path

export default function WorkCard({
  src,
  img, // legacy prop name
  isVideo: forceVideo,
  name = "Project Name",
  description = "Description",
  onClick,
}) {
  // Prefer `src`; fall back to `img` for backward compatibility
  const mediaSrc = src || img;

  // Handle cases where mediaSrc might still be undefined/null
  if (!mediaSrc) {
    // Optionally render a placeholder or nothing
    console.warn("WorkCard: Missing 'src' or 'img' prop.");
    return null; // Or return a placeholder div
  }

  const isVideo = forceVideo ?? isVideoExt(mediaSrc);

  return (
    // Removed first:ml-0 as it's less relevant in single column
    // Added w-full to ensure it takes full width of its container
    <div
      className="overflow-hidden rounded-lg p-2 laptop:p-4 w-full link cursor-pointer" // Added w-full and cursor-pointer if onClick is used
      onClick={onClick}
      role={onClick ? "button" : undefined} // Accessibility
      tabIndex={onClick ? 0 : undefined} // Accessibility
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined} // Accessibility
    >



      {/* Removed fixed height style */}
      <div
        className="relative rounded-lg overflow-hidden transition-all ease-out duration-300"
        // style={{ height: "600px" }} // REMOVED THIS LINE
      >
        {isVideo ? (
          <video
            // Ensure video takes full width, height adjusts automatically
            className="h-auto w-full object-cover block hover:scale-105 transition-all ease-out duration-300" // Use h-auto, block display, adjusted hover scale
            src={mediaSrc}
            autoPlay
            loop
            muted
            playsInline // Important for mobile playback
            preload="metadata" // Good default
          />
        ) : (
          <img
            alt={name}
            // Ensure image takes full width, height adjusts automatically
            className="h-auto w-full object-cover block hover:scale-105 transition-all ease-out duration-300" // Use h-auto, block display, adjusted hover scale
            src={mediaSrc}
            loading="lazy" // Good practice for images
          />
        )}
      </div>

      <h1 className="mt-4 text-2xl laptop:text-3xl font-medium">{name}</h1>
      <h2 className="text-lg laptop:text-xl opacity-60">{description}</h2> {/* Slightly increased opacity */}
    </div>
  );
}
