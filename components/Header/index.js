// Header.js

import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
// Local Data
import data from "../../data/portfolio.json"; // Correct path assumed

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Make sure showResearch is destructured
  const { name, showBlog, showResume, showResearch } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Popover (Mobile Menu) - Looks OK */}
      <Popover className="block tablet:hidden mt-5">
        {/* ... existing popover code ... */}
        <Popover.Panel
          className={`absolute right-0 z-10 w-11/12 p-4 ${
            theme === "dark" ? "bg-slate-800" : "bg-white"
          } shadow-md rounded-md`}
        >
          {!isBlog ? (
            <div className="grid grid-cols-1">
              <Button onClick={handleWorkScroll}>Projects</Button>
              <Button onClick={handleAboutScroll}>About</Button>
              {/* Research button - already here */}
              {showResearch && (
                <Button onClick={() => router.push("/research")}>
                  Research
                </Button>
              )}
              {showBlog && (
                <Button onClick={() => router.push("/blog")}>Blog</Button>
              )}
              {/* Note: Resume button here uses mailto:, different from desktop */}
              {showResume && (
                <Button
                  onClick={() =>
                    window.open("mailto:ufukcakir@robots.ox.ac.uk") // Check if this is intended vs /resume route
                  }
                >
                  Resume
                </Button>
              )}
              <Button
                onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")}
              >
                Contact
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1">
              <Button onClick={() => router.push("/")} classes="first:ml-1">
                Home
              </Button>
              {/* Research button - already here */}
              {showResearch && (
                <Button onClick={() => router.push("/research")}>
                 Research
                </Button>
              )}
              {showBlog && (
                <Button onClick={() => router.push("/blog")}>Blog</Button>
              )}
              {showResume && (
                <Button
                  onClick={() => router.push("/resume")} // Uses /resume route here
                  classes="first:ml-1"
                >
                  Resume
                </Button>
              )}
              <Button
                onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")}
              >
                Contact
              </Button>
            </div>
          )}
        </Popover.Panel>
      </Popover>

      {/* Desktop Header */}
      <div
        className={`mt-10 hidden flex-row items-center justify-between sticky ${
          theme === "light" ? "bg-white shadow-sm" : "dark:bg-gray-900" // Added shadow/bg example
        } dark:text-white top-0 z-10 tablet:flex py-4 px-6`} // Added padding/styling example
      >
        <h1
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer mob:p-2 laptop:p-0"
        >
          {name}.
        </h1>
        {!isBlog ? (
          <div className="flex items-center space-x-4"> {/* Use space-x for spacing */}
            <Button onClick={handleWorkScroll}>Projects</Button>
            <Button onClick={handleAboutScroll}>About</Button>

            {/* === ADD RESEARCH BUTTON HERE for Desktop (!isBlog) === */}
            {showResearch && (
              <Button onClick={() => router.push("/research")}>
                Research
              </Button>
            )}
            {/* ==================================================== */}

            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")} // Uses /resume route
                // classes="first:ml-1" // Might not be needed depending on position
              >
                Resume
              </Button>
            )}
            <Button onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")}>
              Contact
            </Button>
            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                type="icon" // Assuming Button component can handle icon type for styling
              >
                <img
                  className="h-6 w-6" // Ensure size consistency
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                  alt="Toggle theme" // Add alt text
                />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4"> {/* Use space-x for spacing */}
            <Button onClick={() => router.push("/")}>Home</Button>

             {/* === ADD RESEARCH BUTTON HERE for Desktop (isBlog) === */}
             {showResearch && (
              <Button onClick={() => router.push("/research")}>
                Research
              </Button>
            )}
            {/* =================================================== */}

            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")} // Uses /resume route
                // classes="first:ml-1" // Might not be needed
              >
                Resume
              </Button>
            )}
            <Button onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")}>
              Contact
            </Button>
            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                type="icon"
              >
                <img
                  className="h-6 w-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                  alt="Toggle theme"
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
