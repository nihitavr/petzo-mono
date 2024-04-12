import { useEffect, useRef, useState } from "react";

interface UseOnScreenOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}
export const useOnScreen = (
  options: UseOnScreenOptions,
  ref?: React.RefObject<HTMLDivElement>,
) => {
  ref = useRef<HTMLDivElement | null>(ref?.current ?? null);

  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry!.isIntersecting) {
        setIntersecting(true);
        // observer.unobserve(entry!.target); // Stop observing after first intersection
      }
    }, options);

    if (ref?.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]); // Dependency array includes options to re-initialize observer if options change

  return [ref, isIntersecting] as const;
};
