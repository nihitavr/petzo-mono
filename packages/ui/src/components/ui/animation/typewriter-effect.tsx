"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";

import { cn } from "../../../lib/utils";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      void animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        },
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div
              key={`word-${idx}`}
              className={cn("inline-block", word.className)}
            >
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(`hidden opacity-0`)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div className={cn("text-center", className)}>
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block w-[4px] rounded-sm bg-primary",
          cursorClassName,
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  duration = 2,
  startDelay = 0,
  className,
  cursorClassName,
}: {
  duration?: number;
  startDelay?: number;
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  // const renderWords = () => {
  //   return (
  //     <div>
  //       {wordsArray.map((word, idx) => {
  //         return (
  //           <div
  //             key={`word-${idx}`}
  //             className={cn("inline-block", word.className)}
  //           >
  //             {word.text.map((char, index) => {
  //               return <span key={`char-${index}`}>{char}</span>;
  //             })}
  //             &nbsp;
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  return (
    <div className={cn("flex space-x-1", className)}>
      <motion.div
        className="overflow-hidden"
        initial={{
          width: "0%",
        }}
        animate={{
          width: "fit-content",
        }}
        transition={{
          duration: duration,
          ease: "linear",
          delay: startDelay,
        }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {wordsArray.map((word, idx) => {
            return (
              <div
                key={`word-${idx}`}
                className={cn("inline-block", word.className)}
              >
                {word.text.map((char, index) => {
                  return <span key={`char-${index}`}>{char}</span>;
                })}
                &nbsp;
              </div>
            );
          })}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn("block w-[4px] rounded-sm bg-primary", cursorClassName)}
      ></motion.span>
    </div>
  );
};
