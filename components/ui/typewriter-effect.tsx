'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TypewriterEffectProps {
  words: {
    text: string
    className?: string
  }[]
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typingInterval = setInterval(() => {
      const currentWord = words[currentWordIndex].text

      if (!isDeleting) {
        setCurrentText((prev) =>
          currentWord.substring(0, prev.length + 1)
        )

        if (currentText === currentWord) {
          setIsDeleting(true)
          clearInterval(typingInterval)
          setTimeout(() => setIsDeleting(true), 1000)
        }
      } else {
        setCurrentText((prev) => prev.substring(0, prev.length - 1))

        if (currentText === '') {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [currentText, currentWordIndex, isDeleting, words])

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="text-base sm:text-xl md:text-3xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>{currentText}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          |
        </motion.span>
      </motion.div>
    </div>
  )
}

