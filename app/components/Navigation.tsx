"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { name: "home", href: "/" },
  { name: "research", href: "/research" },
  { name: "projects", href: "/projects" },
  { name: "publications", href: "/publications" },
  { name: "blog", href: "/blog" },
  { name: "cv", href: "/cv" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between max-w-[90vw] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="text-base sm:text-sm tracking-wide hover:text-white transition-colors font-light"
        >
          Ufuk Çakır
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="sm:hidden text-white text-lg focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex space-x-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-sm tracking-wide hover:text-white transition-colors relative group font-light"
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    layoutId="underline"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for Blur Effect */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
          onClick={() => setMobileMenuOpen(false)} // Close menu when clicking outside
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden flex flex-col items-center mt-4 space-y-4 z-50 relative"
        >
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-base tracking-wide hover:text-white transition-colors relative group font-light"
                onClick={() => setMobileMenuOpen(false)} // Close menu on click
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    layoutId="underline"
                  />
                )}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </nav>
  );
}