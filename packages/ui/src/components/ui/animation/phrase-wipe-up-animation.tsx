"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@petzo/ui/lib/utils";

interface PhraseAnimationProps {
  phrases: string[];
  className?: string;
}

const PhraseWipeUpAnimation: React.FC<PhraseAnimationProps> = ({
  phrases,
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  const [index, setIndex] = useState(0);

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    setIsComponentMounted(true);

    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Initialize the width
    setContentWidth(contentElement.offsetWidth);

    // Setup a ResizeObserver to listen to size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === contentElement) {
          setContentWidth(entry.contentRect.width);
        }
      }
    });

    // Start observing the content div
    resizeObserver.observe(contentElement);

    // Cleanup observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, 2000); // Change phrase every 3 seconds

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <motion.div
      animate={{ width: contentWidth }}
      transition={{ duration: 1 }}
      className="relative overflow-hidden"
    >
      <div
        ref={contentRef}
        className={cn("w-min whitespace-nowrap opacity-0", className)}
      >
        {phrases[index]}
      </div>
      <AnimatePresence>
        <motion.div
          className={cn(
            "absolute top-0 flex items-center justify-center whitespace-nowrap",
            className,
          )}
          key={phrases[index]}
          initial={{ y: !isComponentMounted ? "0" : "100%", opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {phrases[index]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PhraseWipeUpAnimation;
