'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type BibtexEntryFields = {
  title: string;
  author: string;
  booktitle?: string;
  journal?: string;
  year: number;
  url?: string;
  note?: string;
};

const publicationsMetadata: BibtexEntryFields[] = [
  {
    title: 'GAMMA: Galactic Attributes of Mass, Metallicity, and Age Dataset',
    author: 'Ufuk Çakır and Tobias Buck',
    booktitle: 'Machine Learning and Physical Sciences Workshop at NeurIPS 2023',
    year: 2023,
    url: 'https://neurips.cc/virtual/2023/76114',
  },
  {
    title: 'ESO: Evolutionary Spectrogram Optimisation for Passive Acoustic Monitoring',
    author: 'Ufuk Çakır and Lorene Jeantet and Aaron Joel Lontsi Sob and Emmanuel Dufourq',
    booktitle: 'Machine Learning for Remote Sensing Workshop (ML4RS) at ICLR 2024',
    year: 2024,
    note: 'Poster',
    url: 'https://iclr.cc/virtual/2024/22012',
  },
  {
    title: 'MEGS: Morphological Evaluation of Galactic Structure',
    author: 'Ufuk Çakır and Tobias Buck',
    journal: 'Astronomy & Astrophysics',
    year: 2024,
    note: 'Accepted and forthcoming',
  },
  {
    title: 'Fast GPU-Powered and Auto-Differentiable Forward Modeling of IFU Data Cubes',
    author: 'Ufuk Çakır and Anna-Lena Schaible and Tobias Buck',
    booktitle: 'Machine Learning and Physical Sciences Workshop at NeurIPS 2024',
    year: 2024,
    note: 'Accepted and forthcoming',
  },
];

export default function Publications() {
  const [publications, setPublications] = useState<BibtexEntryFields[]>([]);

  useEffect(() => {
    // Simulate fetching data and loading it into state
    setPublications(publicationsMetadata);
  }, []);

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

        <motion.div
          className="max-w-[90vw] mx-auto mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-2xl font-light text-neutral-400 max-w-3xl">
            Here are some of my recent publications. You can find more details by clicking on the
            links.
          </p>
        </motion.div>
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
              <p className="text-xl font-light text-neutral-400 mb-2">{pub.author}</p>
              <p className="text-lg font-light text-neutral-500 mb-2">
                {pub.journal || pub.booktitle}, {pub.year}
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
              {pub.note && (
                <p className="text-md font-light text-neutral-600">Note: {pub.note}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}