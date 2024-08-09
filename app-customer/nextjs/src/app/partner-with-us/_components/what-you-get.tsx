/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const IMAGES = {
  1: "/partner-page/listing-on-furclub.png",
  2: "/partner-page/professional-center-page.png",
  3: "/partner-page/center-dashboard.png",
  4: "/partner-page/24-7-booking.png",
  // 5: "/partner-page/increased-exposure.png",
  // 4: "/partner-page/business-growth-insights.png",
} as Record<number, string>;

export default function WhatYouGet() {
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timeout = setTimeout(() => {
      setSelectedTabIdx((prev) => (prev === 4 ? 1 : prev + 1));
    }, 5000);

    return () => clearTimeout(timeout);
  }, [selectedTabIdx, isHovered]);

  return (
    <div
      className="flex flex-col"
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <h1 className="text-center text-2xl font-medium md:text-3xl lg:text-4xl">
        Here&apos;s what you get on sign-up
      </h1>
      <div className="grid grid-cols-7 gap-4 pt-6">
        <div className="col-span-7 flex flex-col gap-5 pt-4 md:col-span-3 md:gap-10 md:pt-8">
          <InfoTab
            tabIdx={1}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            setIsHovered={setIsHovered}
            title="Listing on Furclub"
            subInfo={
              <span>
                Get <span className="font-semibold">discovered</span> by new pet
                parents looking for pet care services on Furclub.{" "}
                <span className="font-semibold">Reach new customers</span> and{" "}
                <span className="font-semibold">grow your business</span>.
              </span>
            }
            // subInfo="Get discovered by new pet parents looking for pet care services on Furclub. Reach new customers and grow your business."
          />
          <InfoTab
            tabIdx={2}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            setIsHovered={setIsHovered}
            title="Professional Center Page"
            subInfo="Showcase your pet care services online with a polished experience on web and mobile."
          />
          <InfoTab
            tabIdx={3}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            setIsHovered={setIsHovered}
            title="Center Web/Mobile Dashboard"
            // subInfo="Manage all your bookings anytime, anywhere - from your laptop or mobile."
            subInfo={
              <span>
                <span className="font-semibold">Manage all your bookings</span>{" "}
                anytime, anywhere - from your{" "}
                <span className="font-semibold">laptop</span> or{" "}
                <span className="font-semibold">mobile</span>.
              </span>
            }
          />
          <InfoTab
            tabIdx={4}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            setIsHovered={setIsHovered}
            title="24/7 Booking Capability"
            // subInfo="Get bookings anytime, even outside business hours, ensuring you never lose a customer. Say goodbye to endless phone calls and WhatsApp messages."
            subInfo={
              <span>
                Get bookings <span className="font-semibold">anytime</span>,
                even{" "}
                <span className="font-semibold">outside business hours</span>,
                ensuring you
                <span className="font-semibold"> never lose a customer</span>.
                Say goodbye to endless phone calls and WhatsApp messages.
              </span>
            }
          />
        </div>
        <div className="relative order-first col-span-7 h-52 w-full md:order-last md:col-span-4 md:h-full">
          <Image
            key={selectedTabIdx}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={IMAGES[selectedTabIdx]!}
            alt=""
            fill
            className="animate-fade-in object-contain"
          />
        </div>
      </div>
    </div>
  );
}

const InfoTab = ({
  tabIdx,
  selectedTabIdx,
  setSelectedTabIdx,
  setIsHovered,
  title,
  subInfo,
}: {
  tabIdx: number;
  selectedTabIdx: number;
  setSelectedTabIdx: (idx: number) => void;
  setIsHovered: (hovered: boolean) => void;
  title: string;
  subInfo: string | React.ReactNode;
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onMouseEnter={() => setSelectedTabIdx(tabIdx)}
      onClick={() => setSelectedTabIdx(tabIdx)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="flex cursor-pointer items-start gap-3"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full border ${selectedTabIdx == tabIdx ? "border-primary bg-primary/10 text-primary" : ""}`}
      >
        {tabIdx}
      </span>
      <div>
        <h3
          className={`text-lg font-medium md:text-xl ${selectedTabIdx == tabIdx ? "text-primary" : ""}`}
        >
          {title}
        </h3>
        <p className="mt-1 text-base text-foreground/90 md:text-lg">
          {subInfo}
        </p>
      </div>
    </div>
  );
};
