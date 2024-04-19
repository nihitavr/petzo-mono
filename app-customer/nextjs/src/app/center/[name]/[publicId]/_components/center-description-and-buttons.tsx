"use client";

import { useEffect, useRef, useState } from "react";
import { FiPhoneOutgoing } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuShare } from "react-icons/lu";

import type { Center } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import Share from "@petzo/ui/components/share";
import { getGoogleLocationLink } from "@petzo/utils";

export default function CenterDescriptionAndButtons({
  center,
}: {
  center: Center;
}) {
  const ctaButtonsRef = useRef<HTMLButtonElement>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [fixedATC, setFixedATC] = useState(false);

  useEffect(() => {
    // Access the current page URL using window.location.href
    setShareUrl(window.location.href);

    const handleScroll = () => {
      const ctaButtonsTop =
        ctaButtonsRef?.current?.getBoundingClientRect()?.top;
      if (!ctaButtonsTop) return;

      if (ctaButtonsTop < -50) setFixedATC(true);
      else setFixedATC(false);

      console.log("ctaButtonsTop", ctaButtonsTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Center Description */}
      <div className="flex w-full flex-col justify-start gap-1">
        <div
          onClick={() => setShowMoreDetails(true)}
          aria-hidden="true"
          className={`${showMoreDetails ? "" : "line-clamp-2 cursor-pointer md:line-clamp-6"} whitespace-pre-wrap text-sm  md:text-base`}
        >
          {center.description}
        </div>
        <div className="flex w-full justify-start">
          <span
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="h-min w-min cursor-pointer whitespace-nowrap py-1 text-sm font-semibold text-foreground/90"
            aria-hidden="true"
          >
            {showMoreDetails ? "Show Less" : "More Details >"}
          </span>

          {/* <Button
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="h-min w-min px-2 py-1 text-xs text-foreground/80"
            size="sm"
            variant="outline"
          >
            {showMoreDetails ? "Show Less" : "More Details >"}
          </Button> */}
        </div>
      </div>

      {/* Center Call and location Buttons */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button ref={ctaButtonsRef} size="md" className="w-1/2">
          <a
            className="flex items-center gap-1"
            href={`tel:${center.contactNumber}`}
          >
            <span>Call Center</span>
            <FiPhoneOutgoing
              strokeWidth="2"
              className="size-4 cursor-pointer hover:text-foreground/80"
            />
          </a>
        </Button>
        <Button size="md" variant="outline" className="w-1/2">
          <a
            className="flex items-center gap-1"
            href={getGoogleLocationLink(center.centerAddress?.geocode)}
            target="_blank"
            rel="noreferrer"
          >
            <span>Get Direction</span>
            <GrLocation className="size-4 cursor-pointer hover:text-foreground/80" />
          </a>
        </Button>

        <Share
          shareInfo={{
            title: `${center.name}`,
            url: shareUrl,
          }}
        >
          <LuShare className="size-6 cursor-pointer hover:text-foreground/80" />
        </Share>
      </div>

      {/*    */}
      <div
        className={`fixed bottom-0 left-0 z-50 flex w-full items-center gap-2 px-3 py-4 transition-opacity duration-500 md:hidden ${
          fixedATC ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          size="lg"
          className="w-1/2 shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-primary/50"
        >
          <a
            className="flex items-center gap-1"
            href={`tel:${center.contactNumber}`}
          >
            <span>Call Center</span>
            <FiPhoneOutgoing
              strokeWidth="2"
              className="size-4 cursor-pointer hover:text-foreground/80"
            />
          </a>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-1/2 shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-primary/50"
        >
          <a
            className="flex items-center gap-1"
            href={getGoogleLocationLink(center.centerAddress?.geocode)}
            target="_blank"
            rel="noreferrer"
          >
            <span>Get Direction</span>
            <GrLocation className="size-4 cursor-pointer hover:text-foreground/80" />
          </a>
        </Button>
      </div>
    </div>
  );
}
