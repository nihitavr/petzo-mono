import type { ReactNode } from "react";

import { cn } from "../../../lib/utils";

export default function WipeAnimation({
  children,
  animationDuration = 1,
  animationDelay = 0,
  className,
}: {
  children: ReactNode;
  animationDelay?: number;
  animationDuration?: number;
  className?: string;
}) {
  return (
    <div
      style={{
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`,
        animationFillMode: "forwards",
      }}
      className={cn(
        className,
        "animate-wipe-left-right overflow-hidden whitespace-nowrap",
      )}
    >
      {children}
    </div>
  );
}
