"use client";

import { motion, useScroll, useSpring, MotionValue } from "framer-motion";
import { createContext, useContext, ReactNode } from "react";

type SmoothScrollContextType = {
  scrollYProgress: MotionValue<number>;
};

const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <SmoothScrollContext.Provider value={{ scrollYProgress }}>
      {children}
      <motion.div
        className="fixed left-0 right-0 bottom-0 h-1 bg-white/20"
        style={{ scaleX }}
      />
    </SmoothScrollContext.Provider>
  );
}

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error("useSmoothScroll must be used within a SmoothScrollProvider");
  }
  return context;
};