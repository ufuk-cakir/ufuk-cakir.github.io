'use client';

import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function CV() {
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
            Curriculum Vitae
          </motion.h1>
        </div>

        <motion.div
          className="max-w-[90vw] mx-auto mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-2xl font-light text-neutral-400 max-w-3xl">
            Explore my academic journey, professional experience, and skills in detail.
          </p>
        </motion.div>
      </section>

      {/* CV Sections */}
      <section className="py-24">
        <div className="max-w-[90vw] mx-auto space-y-16">
          {/* Personal Profile */}
          <motion.div {...fadeIn} className="space-y-8">
            <h2 className="text-[clamp(2rem,6vw,4rem)] leading-tight font-light">
              Personal Profile
            </h2>
            <p className="text-xl font-light text-neutral-400">
              I am a passionate and dedicated physics DPhil student with a strong interest in
              computational physics and machine learning. I thrive in collaborative research
              environments, and my technical skills include advanced Python programming and
              proficiency in Git source control. I am committed to dedicating my life to science to
              create tangible real-world impact.
            </p>
          </motion.div>

          {/* Education */}
          <motion.div {...fadeIn} className="space-y-8">
            <h2 className="text-[clamp(2rem,6vw,4rem)] leading-tight font-light">Education</h2>
            <ul className="space-y-8">
              <li>
                <h3 className="text-xl font-semibold">DPhil in AI for the Environment</h3>
                <p className="text-neutral-400">University of Oxford, 2024–present</p>
                <p className="text-neutral-500">Expected graduation: March 2029</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">
                  M.Sc. in Physics (Computational Physics and Machine Learning)
                </h3>
                <p className="text-neutral-400">Heidelberg University, 2022–2024</p>
                <p className="text-neutral-500">With distinction</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">B.Sc. in Physics</h3>
                <p className="text-neutral-400">Heidelberg University, 2019–2022</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Abitur</h3>
                <p className="text-neutral-400">Wilhelmi Gymnasium, Sinsheim, Germany, 2011–2019</p>
                <p className="text-neutral-500">Top of class in Math and Physics</p>
              </li>
            </ul>
          </motion.div>

          {/* Professional Experience */}
          <motion.div {...fadeIn} className="space-y-8">
            <h2 className="text-[clamp(2rem,6vw,4rem)] leading-tight font-light">
              Professional Experience
            </h2>
            <ul className="space-y-8">
              <li>
                <h3 className="text-xl font-semibold">
                  Visiting Researcher, African Institute of Mathematical Sciences (AIMS)
                </h3>
                <p className="text-neutral-400">Cape Town, South Africa, 2023</p>
                <ul className="list-disc list-inside text-neutral-500">
                  <li>
                    Implemented Genetic Algorithm for spectrogram optimization of bioacoustic data
                    to enable real-time wildlife monitoring of critically endangered species.
                  </li>
                  <li>Designed and wrote the core code structure using Object-Oriented Programming.</li>
                  <li>Built a GUI with TensorBoard integration for tracking training progress.</li>
                </ul>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Research Assistant, AstroAI Lab</h3>
                <p className="text-neutral-400">
                  Interdisciplinary Center for Scientific Computing (IWR), Heidelberg University,
                  2022–2023
                </p>
                <ul className="list-disc list-inside text-neutral-500">
                  <li>
                    Published open-source code for MEGS (
                    <a
                      href="https://github.com/ufuk-cakir/MEGS"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                    ).
                  </li>
                  <li>
                    Organized the Carl-Zeiss-Stiftung Summer School for Scientific Machine Learning (
                    <a
                      href="https://astroai-lab.de/conferences/czs-school-2023/"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                    ).
                  </li>
                </ul>
              </li>
            </ul>
          </motion.div>

          {/* Awards and Skills */}
          <motion.div {...fadeIn} className="space-y-8">
            <h2 className="text-[clamp(2rem,6vw,4rem)] leading-tight font-light">Awards</h2>
            <ul className="list-disc list-inside text-neutral-500">
              <li>Baden-Württemberg-Stiftung Scholarship, 2023</li>
              <li>Multitorch Scholarship for best grades in Physics and Math, 2019</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}