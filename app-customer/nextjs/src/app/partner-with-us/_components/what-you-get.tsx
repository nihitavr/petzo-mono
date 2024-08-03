/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelectedTabIdx((prev) => (prev === 3 ? 1 : prev + 1));
    }, 5000);

    return () => clearTimeout(timeout);
  }, [selectedTabIdx]);

  return (
    <div className="flex flex-col ">
      <h1 className="text-2xl font-medium md:text-3xl lg:text-4xl">
        Here&apos;s what you get on sign-up
      </h1>
      <div className="grid grid-cols-7 gap-4 pt-4">
        <div className="col-span-7 flex flex-col gap-5 pt-4 md:col-span-3 md:gap-10 md:pt-8">
          <InfoTab
            tabIdx={1}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            title="Listing on Furclub"
            subInfo="Get discovered by new pet parents looking for pet care services on Furclub"
          />
          <InfoTab
            tabIdx={2}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            title="Professional Center Page"
            subInfo="Showcase your pet care services online with a polished experience on web and mobile"
          />
          <InfoTab
            tabIdx={3}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            title="Center Web/Mobile Dashboard"
            subInfo="Manage all your bookings on your laptop or mobile"
          />
          <InfoTab
            tabIdx={4}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={setSelectedTabIdx}
            title="24/7 Booking Capability"
            subInfo="Get bookings anytime, even outside business hours, ensuring you never lose a customer"
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
  title,
  subInfo,
}: {
  tabIdx: number;
  selectedTabIdx: number;
  setSelectedTabIdx: (idx: number) => void;
  title: string;
  subInfo: string;
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onMouseEnter={() => setSelectedTabIdx(tabIdx)}
      onClick={() => setSelectedTabIdx(tabIdx)}
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
        <span className="text-base text-foreground/90 md:text-lg">
          {subInfo}
        </span>
      </div>
    </div>
  );
};
