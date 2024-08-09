"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";

const STEP_INFO = [
  {
    title: "Register and fill in the center details",
    data: [
      {
        image: "/partner-page/get-started-add-center.svg",
        title: "Center Name",
      },
      {
        image: "/partner-page/get-started-add-phonenumber.svg",
        title: "Phone Number",
      },
      {
        image: "/partner-page/get-started-add-address.svg",
        title: "Address & Location",
      },
    ],
  },
  {
    title: "List your offered pet services with their details",
    data: [
      {
        image: "/partner-page/get-started-add-service.svg",
        title: "Pet Services Offered",
      },
      {
        image: "/partner-page/get-started-add-pricing-details.svg",
        title: "Pricing Details",
      },
      {
        image: "/partner-page/get-started-add-timing-details.svg",
        title: "Timing Details",
      },
    ],
  },
  {
    title: "Start receiving bookings post verification",
    data: [
      {
        image: "/partner-page/get-started-verification.svg",
        title: "Await Verification",
      },
    ],
  },
];

export default function GetStarted() {
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timeout = setTimeout(() => {
      setSelectedTabIdx((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);

    return () => clearTimeout(timeout);
  }, [selectedTabIdx, isHovered]);

  return (
    <div
      className="flex flex-col items-center"
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <h1 className="text-center text-2xl font-medium md:text-3xl lg:text-4xl">
        Get started in 3 easy steps!
      </h1>

      <div className="mt-8 flex items-center justify-center gap-3 md:gap-10">
        {[0, 1, 2].map((tabIdx) => (
          <Fragment key={tabIdx}>
            {tabIdx != 0 && (
              <div
                className={`h-[1.5px] w-16 md:w-28 lg:w-44 ${selectedTabIdx >= tabIdx ? "bg-primary/60" : "bg-foreground/60"}`}
              />
            )}
            <StepsSection
              tabIdx={tabIdx}
              setIsHovered={setIsHovered}
              selectedTabIdx={selectedTabIdx}
              setSelectedTabIdx={setSelectedTabIdx}
            />
          </Fragment>
        ))}
      </div>

      <div className="mt-10">
        <InfoTab key={selectedTabIdx} info={STEP_INFO[selectedTabIdx]} />
      </div>
    </div>
  );
}

const StepsSection = ({
  tabIdx,
  selectedTabIdx,
  setSelectedTabIdx,
  setIsHovered,
}: {
  tabIdx: number;
  selectedTabIdx: number;
  setSelectedTabIdx: (idx: number) => void;
  setIsHovered: (hovered: boolean) => void;
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onMouseEnter={() => setSelectedTabIdx(tabIdx)}
      onClick={() => setSelectedTabIdx(tabIdx)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="flex cursor-pointer flex-col items-center gap-3"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/30 transition-all duration-100 ${selectedTabIdx >= tabIdx ? "border-primary bg-primary/10 text-primary" : ""} ${selectedTabIdx == tabIdx ? "scale-125" : ""}`}
      >
        {tabIdx}
      </span>
    </div>
  );
};

const InfoTab = ({
  info,
}: {
  info?: { title: string; data: { image: string; title: string }[] };
}) => {
  const gridColsTailwind =
    info?.data.length == 1
      ? "grid-cols-1"
      : info?.data.length == 2
        ? "grid-cols-2"
        : "grid-cols-3";
  return (
    <div className="flex animate-fade-in flex-col items-center gap-10">
      <h3 className="text-center text-xl font-medium text-foreground/90 md:text-2xl">
        {info?.title}
      </h3>
      <div className={`grid ${gridColsTailwind} gap-10 md:gap-44`}>
        {/* Image */}
        {info?.data?.map((item, idx) => {
          return (
            <div
              key={`item-${idx}`}
              className="item-center flex flex-col gap-2 md:gap-5"
            >
              <div className="relative aspect-square h-20 shrink-0 md:h-32">
                <Image
                  src={item.image}
                  className="object-contain"
                  alt=""
                  fill
                />
              </div>
              <h4 className="text-center text-base font-medium md:text-lg">
                {item.title}{" "}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};
