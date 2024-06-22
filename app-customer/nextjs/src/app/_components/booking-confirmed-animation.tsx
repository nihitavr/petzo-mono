"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";

export default function BookingConfirmedAnimation() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-40 w-44 md:h-52 md:w-56">
        <DotLottiePlayer
          src="/booking-confirmed-animation.lottie"
          loop={false}
          speed={1}
          autoplay={true}
        />
      </div>
    </div>
  );
}
