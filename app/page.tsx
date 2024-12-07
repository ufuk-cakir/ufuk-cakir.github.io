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
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const videoOpacity = useTransform(scrollYProgress, [0, 0.0], [0, 0.1]);

  return (
    <div ref={containerRef} className="bg-[#1a1a1a] relative">
      {/* Background Video */}
      

      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden px-12">
      <motion.video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-xl"
        style={{opacity: 0.5, width: '90%', 
          height: '90%', 
          margin: '5%' }}
        src="ufuk-cakir.github.io/ai-vis-2-small.mp4"
        autoPlay
        muted
        loop
      />
        <div className="relative h-full flex flex-row justify-center items-center space-x-16 z-10">
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

      {/* About Me 
      <section className="h-screen flex items-center justify-center p-16 relative overflow-hidden">
        <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-xl"
          style={{ opacity: 0.4, width: '90%', 
            height: '90%', 
            margin: '5%' }}
          src="ufuk-cakir.github.io/earthquake-stock.mp4"
          autoPlay
          muted
          loop
        />
        <div className="max-w-[90vw] text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[clamp(3rem,8vw,8rem)] leading-[1.1] tracking-tight font-light">
              About Me
            </h2>
            <p className="text-2xl mt-8 max-w-4xl font-light">
              I am a DPhil student at the University of Oxford. I focus on the
              intersection of Machine Learning and Physics. During my
              academic journey, I have worked on projects merging
              computational astrophysics with advanced ML techniques. After the
              major earthquake in Turkey in 2023, I became interested in using
              ML-based insights to better understand and predict complex natural
              phenomena, ultimately aiming to mitigate future disasters.
            </p>
          </motion.div>
        </div>
      </section>
      */}



{/* About Me & Research Focus */}
<section className="min-h-screen flex flex-col justify-between p-16 relative overflow-hidden">
  <motion.video
    className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-xl"
    style={{ opacity: 0.4 }}
    src="ufuk-cakir.github.io/ai-vis-1-small.mp4"
    autoPlay
    muted
    loop
  />
  {/* Title in top-left */}
  <motion.div
    className="text-white z-10"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    style={{
      position: 'absolute',
      top: '10%',
      left: '5%',
      textAlign: 'left',
    }}
  >
    <h2 className="text-[clamp(3rem,8vw,8rem)] leading-[1.1] tracking-tight font-light">
      About Me
    </h2>
    <p className="text-xl font-light mt-4">
      From Machine Learning to Physics
    </p>
  </motion.div>

  {/* Text in bottom-right */}
  <motion.div
    className="text-white z-10"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    style={{
      position: 'absolute',
      bottom: '10%',
      right: '5%',
      textAlign: 'left',
      maxWidth: '40%',
    }}
  >
    <p className="text-2xl mt-8 max-w-4xl font-light">
      As a DPhil student at the University of Oxford I focuse on the
      intersection of Machine Learning and Physics. My research centers
      around the application of machine learning techniques using tools like JAX
      to develop physics-based models for earthquake
      forecasting. By writing differentiable forward models, I aim to learn
      new physical principles that can improve our understanding and
      prediction of earthquakes.
    </p>
    <p className="text-2xl mt-8 max-w-4xl font-light">
      After the major earthquake in Turkey in 2023, I became deeply committed
      to leveraging ML-based insights to better understand and predict
      complex natural phenomena. This includes combining ML with fundamental
      physics to uncover patterns and laws that help predict the behavior of
      real-world systems, contributing to disaster mitigation and response.
    </p>
    <a
      href="/research"
      className="inline-block mt-8 px-8 py-4 text-lg font-light text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
    >
      Read More
    </a>
  </motion.div>

</section>



      

      {/* Contact Section */}
      <section className="h-screen flex items-center justify-center p-8 relative overflow-hidden">
        <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ opacity: videoOpacity }}
          src="/background-video.mp4"
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
            <p className="text-neutral-400 text-sm mb-4">GET IN TOUCH</p>
            <h2 className="text-[clamp(1rem,4vw,6rem)] leading-none tracking-tighter text-neutral-100 font-light mb-8">
              ufuk.cakir@keble.ox.ac.uk
            </h2>
            <div className="flex justify-center gap-4 text-neutral-400 text-sm">
              <a
                href="https://x.com/ufuk_cakir_"
                className={cn(
                  "hover:text-neutral-100 transition-colors",
                  "uppercase tracking-wider"
                )}
              >
                Twitter
              </a>
              <a
                href="https://www.linkedin.com/in/cakir-ufuk/"
                className={cn(
                  "hover:text-neutral-100 transition-colors",
                  "uppercase tracking-wider"
                )}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/ufuk-cakir"
                className={cn(
                  "hover:text-neutral-100 transition-colors",
                  "uppercase tracking-wider"
                )}
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