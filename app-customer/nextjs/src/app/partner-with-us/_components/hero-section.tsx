"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@petzo/ui/components/button";
import { Label } from "@petzo/ui/components/label";

export default function HeroSection({
  centerAppBaseUrl,
}: {
  centerAppBaseUrl: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-44 sm:gap-0">
      <div className="col-span-2 flex flex-col pb-8 pt-2 sm:col-span-1 md:gap-1 md:pt-16">
        <h1 className="flex animate-fade-in flex-col gap-1 text-3xl font-semibold md:gap-2 md:text-4xl lg:text-5xl">
          <span className="inline-block">Grow Your</span>
          <span className="inline-block text-primary">Pet Care Business</span>
          <span className="inline-block">With Us</span>
        </h1>
        {/* <h1 className="text-6xl font-bold">Grow Your Business With Us</h1> */}
        <h4 className="mt-2 text-lg text-foreground/80">
          In-store Grooming, Home/Mobile Grooming, and Vet Consultation{" "}
        </h4>
      </div>
      <div className="relative col-span-2 grid grid-cols-2 rounded-2xl bg-foreground/10 px-5 py-6 md:p-6">
        <div className="col-span-2 flex flex-col gap-5 pb-4 pt-10 sm:col-span-1 sm:pb-8 sm:pt-8 md:gap-10">
          <span className="text-base md:text-lg">
            Your one-stop place to showcase all your{" "}
            <span className="font-semibold">pet care services online</span>,{" "}
            <span className="font-semibold">reach new customers</span>, and{" "}
            <span className="font-semibold">manage 24x7 online bookings</span> -
            all while focusing on what you do best: caring for pets.
          </span>

          <div className="item z-10 flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <Label className="text-2sm md:text-sm">
                Get Started for free - It only takes 10 minutes.
              </Label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Link href="#demo-section">
                  <Button
                    className="w-full text-xs md:text-sm"
                    variant="outline"
                  >
                    Get Free Demo
                  </Button>
                </Link>
                <a href={`${centerAppBaseUrl}`}>
                  <Button className="w-full text-xs md:text-sm">
                    Register your center
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 col-span-1 h-96 w-full animate-fade-in px-2 sm:w-1/2 md:inline md:px-0">
          <div className="relative h-full w-full -translate-y-[68%] md:-translate-y-[60%]">
            <Image fill src={"/partner-page/hero-image.svg"} alt="hero image" />
          </div>
        </div>
      </div>
    </div>
  );
}
