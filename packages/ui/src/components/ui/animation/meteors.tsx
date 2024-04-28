import React from "react";

import { cn } from "../../../lib/utils";

export const Meteors = ({
  number,
  loop = false,
  delay = 0,
  className,
}: {
  number?: number;
  loop?: boolean;
  delay?: number;
  className?: string;
}) => {
  const meteors = new Array(number ?? 20).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-primary shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-primary before:to-transparent before:content-['']",
            className,
          )}
          style={{
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: delay + Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
            animationFillMode: "forwards",
            animationIterationCount: loop ? "infinite" : 1,
          }}
        ></span>
      ))}
    </>
  );
};
