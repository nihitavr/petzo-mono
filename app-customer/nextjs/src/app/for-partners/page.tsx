import Image from "next/image";

import { Button } from "@petzo/ui/components/button";

export default async function Page() {
  return (
    <div className="grid grid-cols-2 gap-44 sm:gap-0">
      <div className="col-span-2 flex flex-col pb-8 pt-5 sm:col-span-1 md:gap-3 md:pt-16">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
          {/* <h1 className="bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-4xl font-semibold text-transparent md:text-5xl lg:text-6xl"> */}
          Grow Your Pet Care Business With Us
        </h1>
        {/* <h1 className="text-6xl font-bold">Grow Your Business With Us</h1> */}
        <h4 className="mt-2 text-lg">
          In-store Grooming, Home Grooming, and Vet Consultation{" "}
        </h4>
      </div>
      <div className="relative col-span-2 grid grid-cols-2 rounded-2xl bg-primary/10 p-6">
        <div className="col-span-2 flex flex-col gap-10 py-8 sm:col-span-1">
          <span className="text-base md:text-lg">
            Your one-stop to showcase services, attract clients, and streamline
            bookings - all while focusing on what you do best: caring for pets.
          </span>
          <Button className="w-fit">Register your center</Button>
        </div>

        <div className="absolute right-0 top-0 col-span-1 h-96 w-full px-2 sm:w-1/2 md:inline md:px-0">
          <div className="relative h-full w-full -translate-y-[70%] md:-translate-y-[55%]">
            <Image fill src={"/partner-page/hero-image.svg"} alt="hero image" />
          </div>
        </div>
      </div>
    </div>
  );
}
