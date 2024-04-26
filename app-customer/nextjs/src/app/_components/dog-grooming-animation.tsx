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
    <div className="flex items-center justify-center px-10">
      <div className="container-2 relative !mt-32 w-full ">
        {withPlaceholder && (
          <Image
            width={500}
            height={500}
            className={`absolute left-0 top-0 w-full ${componentLoaded ? "animate-fade-out" : "opacity-100"}`}
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
