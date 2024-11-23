'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Research() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="min-h-screen relative">
        <div className="max-w-[90vw] mx-auto">
          <motion.h1
            className="text-[clamp(3rem,12vw,16rem)] leading-[0.9] tracking-tight font-light"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Research
          </motion.h1>
        </div>

        <motion.div 
          className="max-w-[90vw] mx-auto mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
              {/* Hero Section 
          <div className="relative h-[70vh] mb-12">
            <Image
              src="/placeholder.svg"
              alt="Research visualization"
              fill
              className="object-cover"
            />
          </div> 
          */}
          
          <p className="text-2xl font-light text-neutral-400 max-w-3xl">
            I am currently a DPhil student at the University of Oxford, focusing on AI applications
            in disaster response and humanitarian aid optimization.
          </p>
        </motion.div>
      </section>

      {/* Research Areas */}
      <section className="min-h-screen py-24">
        <div className="max-w-[90vw] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-[clamp(2rem,8vw,12rem)] leading-[0.9] tracking-tight font-light mb-12">
              Current
              <br />
              Focus
            </h2>
            <p className="text-xl font-light text-neutral-400 max-w-2xl">
              Using satellite radar imagery and machine learning for real-time assessment of street damage 
              in post-disaster scenarios, integrating this data into dynamic routing algorithms for 
              humanitarian aid delivery.
            </p>
          </motion.div>

          <div className="relative h-[70vh] mb-24">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/placeholder.mp4" type="video/mp4" />
            </video>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[clamp(2rem,8vw,12rem)] leading-[0.9] tracking-tight font-light mb-12">
              Previous
              <br />
              Work
            </h2>
            <p className="text-xl font-light text-neutral-400 max-w-2xl">
              My previous research explored machine learning applications in astrophysics, 
              specifically working with data from cosmological simulations. The devastating 
              earthquake in Turkey in 2023 inspired my current focus on disaster management.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

