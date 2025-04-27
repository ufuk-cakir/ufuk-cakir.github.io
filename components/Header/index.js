// Header.js
import { Popover, Transition } from "@headlessui/react"; // Added Transition
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Import icons
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react"; // Added Fragment
import Button from "../Button";
// Local Data
import data from "../../data/portfolio.json";

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // generic helper → works on every page
  const jump = (hash) => {
    // Construct the full path with hash
    const targetPath = `/#${hash}`;

    // Check if already on the home page
    if (router.pathname === "/") {
      // Find the element
      const el = document.getElementById(hash);
      if (el) {
        // Element exists, scroll smoothly
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Element doesn't exist on home, maybe navigate (optional, could log error)
        console.warn(`Element with ID "${hash}" not found on home page.`);
        // Optionally still try to navigate if maybe it appears later?
        // router.push(targetPath);
      }
    } else {
      // Not on home page, navigate to home + hash
      router.push(targetPath);
    }
  };

  const { name, showBlog, showResume, showResearch } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* --- MOBILE HEADER / POPOVER --- */}
      <Popover className="block tablet:hidden relative mt-5 px-4 sm:px-6">
        {/* Added relative positioning and padding */}
        {({ open }) => (
          <>
            <div className="flex justify-between items-center"> {/* Align button and maybe logo */}
              {/* Logo or Name */}
                 <img src="/images/letter-u.png" alt="Logo" className="h-8 w-8 mr-2" />


               <h1
                  onClick={() => router.push("/")}
                  className="cursor-pointer text-lg" // Smaller name for mobile
               >
                  {name}.
               </h1>

              {/* --- THIS IS THE MISSING BUTTON --- */}
              <Popover.Button
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-700 focus:ring-gray-600'
                    : 'text-gray-500 hover:bg-gray-100 focus:ring-indigo-500'
                 } focus:outline-none focus:ring-2 focus:ring-inset`}
              >
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> // Close icon
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" /> // Menu icon
                )}
              </Popover.Button>
              {/* --- END OF MISSING BUTTON --- */}
            </div>

            {/* --- POPOVER PANEL (Dropdown) --- */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={`absolute top-full left-0 right-0 z-10 mt-2 mx-2 p-4 ${ // Adjusted positioning/margin
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                } shadow-lg rounded-md ring-1 ring-black ring-opacity-5`} // Added shadow/ring
              >
                {/* Use flex-col for vertical button layout */}
                <div className="flex flex-col space-y-2">
                  {!isBlog ? (
                    <>
                      <Button onClick={() => jump("projects")} type="mobileNav">Projects</Button>
                      <Button onClick={() => jump("about")} type="mobileNav">About</Button>
                      {showResearch && (
                        <Button onClick={() => router.push("/research")} type="mobileNav">Research</Button>
                      )}
                      {showBlog && (
                        <Button onClick={() => router.push("/blog")} type="mobileNav">Blog</Button>
                      )}
                      {showResume && (
                        <Button onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")} type="mobileNav">Resume</Button> // Consistent mailto: for mobile? Choose one approach.
                      )}
                      <Button onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")} type="mobileNav">Contact</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => router.push("/")} type="mobileNav">Home</Button>
                      {showResearch && (
                        <Button onClick={() => router.push("/research")} type="mobileNav">Research</Button>
                      )}
                      {showBlog && (
                        <Button onClick={() => router.push("/blog")} type="mobileNav">Blog</Button>
                      )}
                      {showResume && (
                        <Button onClick={() => router.push("/resume")} type="mobileNav">Resume</Button> // Consistent /resume route for non-home? Choose one approach.
                      )}
                      <Button onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")} type="mobileNav">Contact</Button>
                    </>
                  )}
                   {/* Optional: Mobile Theme Toggle */}
                   {mounted && theme && data.darkMode && (
                      <Button
                         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                         type="mobileNav" // Style as a nav item or differently
                         className="flex items-center justify-center mt-4" // Example styling
                      >
                         <img
                            className="h-5 w-5 mr-2" // Smaller icon for mobile
                            src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                            alt="Toggle theme"
                         />
                         Toggle Theme
                      </Button>
                   )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      {/* --- DESKTOP HEADER --- */}
      <div
        className={`mt-10 hidden flex-row items-center justify-between sticky 
         dark:text-white top-0 z-10 tablet:flex py-4 px-6`} // Existing classes
      >

        {/* Logo or Name */}
        <div className="flex items-center">
        <img src="/images/letter-u.png" alt="Logo" className="h-8 w-8 mr-2" />
        <h1
          onClick={() => router.push("/")}
          className=" cursor-pointer mob:p-2 laptop:p-0 text-xl" // Slightly larger name
        >
          {name}.
        </h1>
        </div>
        {/* ... rest of your desktop header code ... */}
         {!isBlog ? (
          <div className="flex items-center space-x-4"> {/* Use space-x for spacing */}
            <Button onClick={() => jump("projects")}>Projects</Button>
            <Button onClick={() => jump("about")}>About</Button>
            {showResearch && (
              <Button onClick={() => router.push("/research")}>Research</Button>
            )}
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button onClick={() => router.push("/resume")}>Resume</Button> // Consistent route
            )}
            <Button onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")}>Contact</Button>
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
            {showResearch && (
              <Button onClick={() => router.push("/research")}>Research</Button>
            )}
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button onClick={() => router.push("/resume")}>Resume</Button> // Consistent route
            )}
            <Button onClick={() => window.open("mailto:ufukcakir@robots.ox.ac.uk")}>Contact</Button>
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
