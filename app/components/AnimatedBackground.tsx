'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <motion.div
      className="fixed inset-0 z-[-1]"
      animate={{
        background: [
          'linear-gradient(-45deg, #0f0f0f, #1a1a1a, #141414, #0f0f0f)',
          'linear-gradient(-45deg, #1a1a1a, #141414, #0f0f0f, #0f0f0f)',
          'linear-gradient(-45deg, #141414, #0f0f0f, #0f0f0f, #1a1a1a)',
          'linear-gradient(-45deg, #0f0f0f, #0f0f0f, #1a1a1a, #141414)',
        ],
      }}
      transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
    />
  )
}

