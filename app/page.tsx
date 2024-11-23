"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils"


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#1a1a1a]">
   

      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden px-12">
        <div className="relative h-full flex flex-row justify-center items-center space-x-16">
          {/* Text Content */}
          <div className="relative z-20 flex-1 max-w-[50%]">
            <motion.p
              className="text-4xl mb-8 font-light text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Hey! I am
            </motion.p>
            <motion.h1
              className="text-[clamp(4rem,10vw,10rem)] leading-[1.1] tracking-tight font-light text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Ufuk Çakır
            </motion.h1>
            <motion.p
              className="text-3xl mt-6 font-light text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              DPhil Student @ University of Oxford
            </motion.p>
            <motion.p
              className="text-3xl font-light text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >

              <a
      href="https://intelligent-earth.ox.ac.uk/home" // Replace with the actual URL
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-200 underline hover:text-blue-300 transition-colors"
    >
      Intelligent Earth CDT
    </a> in AI for the Environment
            </motion.p>
          </div>

          {/* Profile Image */}
          <motion.div
            className="relative flex-1 max-w-[45%] h-auto z-10"
            style={{ y, opacity }}
          >
            <Image
              src="foto-ufuk-cakir.jpg"
              alt="Profile Image"
              width={600}
              height={800}
              className="object-contain rounded-xl opacity-100"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Research Focus */}
      <section id="research" className="min-h-screen flex items-center justify-center p-16">
        <motion.div
          className="max-w-[90vw] text-center text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[clamp(3rem,8vw,8rem)] leading-[1.1] tracking-tight font-light">
            From Imagery
            <br />
            <span className="italic">to Impact</span>
          </h2>
          <p className="text-2xl mt-8 max-w-4xl font-light">
            Using AI and satellite imagery to transform humanitarian aid
            delivery in disaster zones.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="h-screen flex items-center justify-center p-8">
        <div className="max-w-[90vw] text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-neutral-400 text-sm mb-4">GET IN TOUCH</p>
            <h2 className="text-[clamp(1rem,4vw,6rem)] leading-none tracking-tighter text-neutral-100 font-light mb-8">
              ufuk.cakir@keble.ox.ac.uk
            </h2>
            <div className="flex justify-center gap-4 text-neutral-400 text-sm">
              <a href="https://x.com/ufuk_cakir_" className={cn(
                "hover:text-neutral-100 transition-colors",
                "uppercase tracking-wider"
              )}>
                Twitter
              </a>
              <a href="https://www.linkedin.com/in/cakir-ufuk/" className={cn(
                "hover:text-neutral-100 transition-colors",
                "uppercase tracking-wider"
              )}>
                LinkedIn
              </a>
              <a href="https://github.com/ufuk-cakir" className={cn(
                "hover:text-neutral-100 transition-colors",
                "uppercase tracking-wider"
              )}>
                Github
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}