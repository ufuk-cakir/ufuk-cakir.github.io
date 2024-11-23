'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const projects = [
  {
    title: "4EU+ Science Young To Young Project",
    description:
      "Collaborated with international students to produce an animated video on Quantum Simulation for Science Communication, handling coordination, animation, and editing.",
    year: 2023,
    image: "/syty intro.mp4",
    isVideo: true,
    link: "https://sorbonne-universite.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=b92c0e54-205f-4e1b-a59d-aeca00a3f13e",
  },
  {
    title: "Research Assistant: Quantum Dynamics Lab",
    description:
      "Developed Python animations visualizing research results on relaxation dynamics in disordered quantum spin systems.",
    year: 2022,
    image: "/spin_animation.mp4",
    isVideo: true,
  },
  {
    title: "Carl-Zeiss-Stiftung Summer School",
    description:
      "Organized the Summer School for Scientific Machine Learning at IWR Heidelberg, built the associated website, and served on the local organizing committee.",
    year: 2023,
    image: "/czs.mp4",
    isVideo: true,
    link: "https://astroai-lab.de/conferences/czs-school-2023/",
  },
  {
    title: "4th Lindau Online Sciathon: Cleaning Up Our Planet",
    description:
      "Collaborated with international scientists to improve the efficiency of plastic-degrading enzymes using molecular simulations and machine learning. Animated and edited the project video, which was a finalist at the Lindau Nobel Laureate Meeting 2024.",
    year: 2024,
    image: "/lindau-sciathon-2024.mp4",
    isVideo: true,
    link: "https://www.youtube.com/watch?v=_3ahZlp7I7k",
  },
  {
    title: "Young Scientist at the 73rd Lindau Nobel Laureate Meeting",
    description:
      "Selected as a Young Scientist to participate in the 73rd Lindau Nobel Laureate Meeting, engaging with Nobel Laureates and scientists from around the world.",
    year: 2024,
    image: "/sciathon-discussion.JPEG",
    isVideo: false,
  },
  {
    title: "Science Communication Animations",
    description:
      "Created engaging animations to visualize complex science concepts using Adobe After Effects, such as quantum mechanics and material phases.",
    year: 2022,
    image: "/Glass Phase Animation.mp4",
    isVideo: true,
  },
];

export default function Projects() {
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
            Projects
          </motion.h1>
        </div>

        <motion.div
          className="max-w-[90vw] mx-auto mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-2xl font-light text-neutral-400 max-w-3xl">
            Here are some of my recent projects. You can find more details by
            clicking on the links.
          </p>
        </motion.div>
      </section>

      {/* Projects List */}
      <section className="py-24">
        <div className="max-w-[90vw] mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="mb-32"
            >
              <h2 className="text-[clamp(2rem,6vw,8rem)] leading-[0.9] tracking-tight font-light mb-6">
                {project.title}
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2">
                  <p className="text-xl font-light text-neutral-400 mb-4">
                    {project.description}
                  </p>
                  <p className="text-lg font-light text-neutral-500">
                    {project.year}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                    >
                      Learn More
                    </a>
                  )}
                </div>
                <div className="w-full md:w-1/2 aspect-video relative">
                  {project.isVideo ? (
                    <video
                      className="rounded-xl object-cover w-full h-full"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={project.image} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover rounded-xl"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}