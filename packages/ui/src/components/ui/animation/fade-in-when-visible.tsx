"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function FadeInWhenVisible({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  const [isVisibleOnce, setIsVisibleOnce] = useState(false);

  useEffect(() => {
    if (visible && !isVisibleOnce) {
      setIsVisibleOnce(true);
    }
  }, [visible]);

  return (
    <div ref={ref}>
      {isVisibleOnce ? (
        <div className="animate-fade-in">{children}</div>
      ) : (
        <div className="h-44 w-full"></div>
      )}
    </div>
  );
}
