"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

import { cn } from "../../../lib/utils";

export const TextGenerateEffect = ({
  words,
  delay = 0.2,
  duration = 2,
  startDelay = 0,
  className,
}: {
  words: string;
  delay?: number;
  duration?: number;
  startDelay?: number;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    void animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: duration,
        delay: stagger(delay, { startDelay: startDelay }),
      },
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span key={word + idx} className="opacity-0">
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="">
        <div className="text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
