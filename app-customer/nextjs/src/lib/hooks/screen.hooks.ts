import { useState, useEffect, useRef } from "react";

export const useMediaQuery = (query: string) => {
  // const isMobile = useRef(false);

  // useEffect(() => {
  //   const media = window.matchMedia(query);
  //   isMobile.current = media.matches;
  //   const listener = () => {
  //     isMobile.current = media.matches;
  //   };
  //   window.addEventListener("resize", listener);
  //   return () => window.removeEventListener("resize", listener);
  // }, [query]);

  // return isMobile;

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(query);

    setIsMobile(media.matches);

    const listener = () => {
      setIsMobile(media.matches);
    };

    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [query]);

  return isMobile;
};

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
