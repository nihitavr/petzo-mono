"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DotLottiePlayer } from "@dotlottie/react-player";

export default function DogGroomingAnimation({ withPlaceholder = true }) {
  const [componentLoaded, setComponentLoaded] = useState(false);

  useEffect(() => {
    setComponentLoaded(true);
  }, []);

  return (
    <div className="flex h-full min-h-72 items-center justify-center">
      <div className="relative size-44 md:size-56 ">
        {withPlaceholder && (
          <Image
            fill
            className={`absolute left-0 top-0 w-full object-contain ${componentLoaded ? "animate-fade-out" : "opacity-100"}`}
            src="/dog-grooming-animation.min.svg"
            alt="dog grooming animation"
            priority
          />
        )}

        <DotLottiePlayer
          src="/dog-grooming-animation.lottie"
          loop={true}
          speed={1}
          autoplay={true}
        />
      </div>
    </div>
  );
}
