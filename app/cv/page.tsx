'use client'

import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function CV() {
  return (
    <motion.div {...fadeIn} className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Curriculum Vitae</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Education</h2>
        <ul className="space-y-2">
          <li>
            <h3 className="text-lg font-semibold">Ph.D. in Computer Science</h3>
            <p className="text-gray-400">Stanford University, 2015</p>
          </li>
          <li>
            <h3 className="text-lg font-semibold">M.S. in Artificial Intelligence</h3>
            <p className="text-gray-400">Massachusetts Institute of Technology, 2011</p>
          </li>
          <li>
            <h3 className="text-lg font-semibold">B.S. in Computer Science</h3>
            <p className="text-gray-400">University of California, Berkeley, 2009</p>
          </li>
        </ul>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Professional Experience</h2>
        <ul className="space-y-4">
          <li>
            <h3 className="text-lg font-semibold">Associate Professor</h3>
            <p className="text-gray-400">Department of Computer Science, Example University, 2020-Present</p>
          </li>
          <li>
            <h3 className="text-lg font-semibold">Assistant Professor</h3>
            <p className="text-gray-400">Department of Computer Science, Example University, 2015-2020</p>
          </li>
          <li>
            <h3 className="text-lg font-semibold">Research Intern</h3>
            <p className="text-gray-400">Google AI, Summer 2014</p>
          </li>
        </ul>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Awards and Honors</h2>
        <ul className="list-disc list-inside text-gray-400">
          <li>NSF CAREER Award, 2018</li>
          <li>Best Paper Award, ACM CHI Conference, 2017</li>
          <li>Outstanding Doctoral Dissertation Award, Stanford University, 2015</li>
        </ul>
      </section>
      
      <a href="#" className="inline-block mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Download Full CV (PDF)
      </a>
    </motion.div>
  )
}

