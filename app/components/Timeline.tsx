"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimelineProps {
  items: { year: number; title: string }[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-700"></div>
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="relative pl-8 pb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="absolute left-0 top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="text-sm text-gray-400 mb-1">{item.year}</div>
          <div className="font-light">{item.title}</div>
        </motion.div>
      ))}
    </div>
  );
}
