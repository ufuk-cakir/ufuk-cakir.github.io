"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const videoOpacity = useTransform(scrollYProgress, [0, 0.0], [0, 0.1]);

  return (
    <div ref={containerRef} className="bg-[#1a1a1a] relative snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden px-4 sm:px-12 snap-start">
        <div className="relative h-full flex flex-col md:flex-row justify-center items-center space-y-4 sm:space-y-8 md:space-y-0 md:space-x-16 z-10">
          {/* Text Section */}
          <div className="relative z-20 flex-1 max-w-full md:max-w-[50%] text-center md:text-left">
            <motion.p
              className="text-xl sm:text-2xl md:text-4xl mb-4 sm:mb-8 font-light text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Hey! I am
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[clamp(2.5rem,8vw,6rem)] leading-[1.1] tracking-tight font-light text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Ufuk Çakır
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-2xl lg:text-3xl mt-4 sm:mt-6 font-light text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              DPhil Student @ University of Oxford
            </motion.p>
            <motion.p
              className="text-base sm:text-lg md:text-2xl lg:text-3xl font-light text-white mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <a
                href="https://intelligent-earth.ox.ac.uk/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-200 underline hover:text-blue-300 transition-colors"
              >
                Intelligent Earth CDT
              </a>{" "}
              in AI for the Environment
            </motion.p>
          </div>

          {/* Image Section */}
          <div
            className="relative flex-1 max-w-[50%] sm:max-w-[60%] md:max-w-[45%] h-auto z-10"
          >
            <Image
              src="ufuk-cakir.github.io/foto-ufuk-cakir.jpg"
              alt="Profile Image"
              width={600}
              height={800}
              className="object-contain rounded-xl opacity-100"
              priority
            />
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-16 relative overflow-hidden snap-start">
        <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-xl"
          style={{ opacity: 0.4, pointerEvents: "none" , userSelect: "none"}}
          src="/ufuk-cakir.github.io/ai-vis-1-small.mp4"
          autoPlay
          muted
          loop
        />
        <div className="relative z-10 text-white grid gap-4 sm:gap-8 md:grid-cols-2">
          <motion.div
            className="px-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3rem,8vw,8rem)] leading-[1.1] tracking-tight font-light">
              About Me
            </h2>
            <p className="text-lg sm:text-xl font-light mt-4">From Machine Learning to Physics</p>
          </motion.div>
          <motion.div
            className="px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4 sm:mt-8 max-w-full md:max-w-4xl font-light">
              As a DPhil student at the University of Oxford, I focus on combining Machine Learning and Physics to develop
              physics-based models for earthquake forecasting. By leveraging tools like JAX and writing differentiable
              forward models, I aim to uncover new physical principles to improve earthquake prediction and understanding.
            </p>
            <a
              href="/research"
              className="inline-block mt-4 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-light text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
            >
              Read More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden snap-start">
        <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ opacity: videoOpacity, pointerEvents: "none", userSelect: "none" }}
          src="/ufuk-cakir.github.io/ai-vis-2-small.mp4"
          autoPlay
          muted
          loop
        />
        <div className="max-w-[90vw] text-center z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-neutral-400 text-xs sm:text-sm mb-2 sm:mb-4">GET IN TOUCH</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[clamp(1rem,4vw,6rem)] leading-none tracking-tighter text-neutral-100 font-light mb-4 sm:mb-8">
              ufuk.cakir@keble.ox.ac.uk
            </h2>
            <div className="flex justify-center gap-2 sm:gap-4 text-neutral-400 text-xs sm:text-sm">
              <a
                href="https://x.com/ufuk_cakir_"
                className={cn("hover:text-neutral-100 transition-colors", "uppercase tracking-wider")}
              >
                Twitter
              </a>
              <a
                href="https://www.linkedin.com/in/cakir-ufuk/"
                className={cn("hover:text-neutral-100 transition-colors", "uppercase tracking-wider")}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/ufuk-cakir"
                className={cn("hover:text-neutral-100 transition-colors", "uppercase tracking-wider")}
              >
                Github
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

