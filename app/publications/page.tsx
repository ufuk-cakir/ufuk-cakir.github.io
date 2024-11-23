'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { parseBibFile } from 'bibtex-parser-js'

export default function Publications() {
  const [publications, setPublications] = useState([])

  useEffect(() => {
    const fetchPublications = async () => {
      const res = await fetch('/publications.bib') // Place your BibTeX file in the public folder
      const bibFile = await res.text()
      const parsedData = parseBibFile(bibFile)

      const publicationList = parsedData.map((entry) => {
        const { title, author, booktitle, journal, year, url, note } = entry.Fields
        return {
          title,
          authors: author,
          journal: journal || booktitle,
          year: year,
          note: note || '',
          url: url || ''
        }
      })

      setPublications(publicationList)
    }

    fetchPublications()
  }, [])

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
            Publications
          </motion.h1>
        </div>
      </section>

      {/* Publications List */}
      <section className="py-24">
        <div className="max-w-[90vw] mx-auto">
          {publications.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="mb-24"
            >
              <h2 className="text-[clamp(1.5rem,4vw,3rem)] leading-tight tracking-tight font-light mb-4">
                {pub.title}
              </h2>
              <p className="text-xl font-light text-neutral-400 mb-2">{pub.authors}</p>
              <p className="text-lg font-light text-neutral-500 mb-2">
                {pub.journal || pub.note}, {pub.year}
              </p>
              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Read more
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}