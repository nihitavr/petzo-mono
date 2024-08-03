"use client";

import { useState } from "react";
import Image from "next/image";
import { TRPCClientError } from "@trpc/client";

import WipeAnimation from "@petzo/ui/components/animation/wipe-animation";
import { Button } from "@petzo/ui/components/button";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import Loader from "@petzo/ui/components/loader";
import { toast } from "@petzo/ui/components/toast";

import { api } from "~/trpc/react";

export default function HeroSection() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEarlyAccessUser = api.earlyAccessUsers.create.useMutation();

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
          In-store Grooming, Home Grooming, and Vet Consultation{" "}
        </h4>
      </div>
      <div className="relative col-span-2 grid grid-cols-2 rounded-2xl bg-foreground/10 px-5 py-6 md:p-6">
        <div className="col-span-2 flex flex-col gap-5 pb-4 pt-10 sm:col-span-1 sm:pb-8 sm:pt-8 md:gap-10">
          <span className="text-base md:text-lg">
            Your one-stop to showcase all your{" "}
            <span className="font-semibold">pet care services</span>,{" "}
            <span className="font-semibold">attract new customers</span>, and{" "}
            <span className="font-semibold">streamline online bookings</span> -
            all while focusing on what you do best: caring for pets.
          </span>
          {/* <a
            href={`${env.CENTER_APP_BASE_URL}`}
            target="_blank"
            rel="noreferrer"
            className="z-10"
          >
            <Button className="w-fit">Register your center</Button>
          </a> */}
          <div className="z-10">
            <Label className="text-sm md:text-base">
              Sign up to get early access*
            </Label>
            <div className="item-end flex flex-col gap-2 md:flex-row md:items-center">
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Name"
                className="bg-background"
              />
              <Input
                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                value={phoneNumber}
                placeholder="Phone number"
                className="bg-background"
              />
              <Button
                className="flex items-center gap-1"
                disabled={isSubmitting}
                onClick={async () => {
                  try {
                    setIsSubmitting(true);
                    await createEarlyAccessUser.mutateAsync({
                      name: name,
                      phoneNumber: phoneNumber,
                    });
                    setName("");
                    setPhoneNumber("");
                    toast.success(
                      "Thank you for showing interest. We will get in touch with you soon.",
                    );
                  } catch (error) {
                    if (error instanceof TRPCClientError) {
                      toast.error(
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        JSON.parse(error.message)?.[0]?.message as string,
                      );
                    }
                  }
                  setIsSubmitting(false);
                }}
              >
                Get Early Access
                <Loader className="size-5" show={isSubmitting} />
              </Button>
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
