"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
      <div className="flex items-center justify-between max-w-[90vw] mx-auto">
        <Link
          href="/"
          className="text-sm tracking-wide hover:text-white transition-colors font-light"
        >
          Ufuk Çakır
        </Link>
        <ul className="flex space-x-8">
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
    </nav>
  );
}
