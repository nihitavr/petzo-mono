import type { ReactNode } from "react";

import { cn } from "../../../lib/utils";

export default function WipeBottomUpAnimation({
  children,
  animationDuration = 1,
  animationDelay = 0,
  loop = false,
  className,
}: {
  children: ReactNode;
  animationDelay?: number;
  animationDuration?: number;
  loop?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        style={{
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s`,
          animationFillMode: "forwards",
          animationIterationCount: loop ? "infinite" : 1,
        }}
        className="inline-block animate-wipe-bottom-up"
      >
        {children}
      </div>
    </div>
  );
}
