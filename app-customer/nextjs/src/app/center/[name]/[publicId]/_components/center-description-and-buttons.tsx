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
  const ctaButtonsContainerRef = useRef<HTMLDivElement>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [fixedATC, setFixedATC] = useState(false);

  useEffect(() => {
    // Access the current page URL using window.location.href
    setShareUrl(window.location.href);

    const handleScroll = () => {
      const ctaButtonsTop =
        ctaButtonsContainerRef?.current?.getBoundingClientRect()?.top;
      if (!ctaButtonsTop) return;

      if (ctaButtonsTop < -50) setFixedATC(true);
      else setFixedATC(false);
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
          className={`${showMoreDetails ? "" : "line-clamp-2 cursor-pointer md:line-clamp-6"} whitespace-pre-wrap text-2sm md:text-sm`}
        >
          {center.description}
        </div>
        <div className="flex w-full justify-between">
          <span
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="h-min w-min cursor-pointer whitespace-nowrap py-1 text-2sm font-semibold text-foreground/90 md:text-sm"
            aria-hidden="true"
          >
            {showMoreDetails ? "Show Less" : "More Details >"}
          </span>
        </div>
      </div>

      {/* Center Call and location Buttons */}
      {/* <div
        ref={ctaButtonsContainerRef}
        className="mt-2 flex items-center justify-end gap-2"
      >
        <AtcButtons
          centerName={center.name}
          shareUrl={shareUrl}
          phoneNumber={center.phoneNumber}
          // geocode={center.centerAddress?.geocode}
        />
      </div> */}

      {/*  Floating buttons  */}
      {/* <div
        className={`fixed bottom-0 left-0 z-50 flex w-full items-center gap-2 px-3 py-3 transition-opacity duration-500 md:hidden ${
          fixedATC ? "opacity-100" : "opacity-0"
        }`}
      >
        <AtcButtons
          centerName={center.name}
          shareUrl={shareUrl}
          phoneNumber={center.phoneNumber}
          // geocode={center.centerAddress?.geocode}
        />
      </div> */}
    </div>
  );
}

function AtcButtons({
  centerName,
  shareUrl,
  phoneNumber,
  geocode,
}: {
  centerName: string;
  shareUrl: string;
  phoneNumber?: string | null;
  geocode?: { latitude: number; longitude: number } | null;
}) {
  return (
    <>
      {phoneNumber && (
        <Button size="md" variant="secondary" className="flex-1">
          <a className="flex items-center gap-1" href={`tel:${phoneNumber}`}>
            <span className="text-sm md:text-sm">Call</span>
            <FiPhoneOutgoing
              strokeWidth="2"
              className="size-4 cursor-pointer hover:text-foreground/80"
            />
          </a>
        </Button>
      )}
      {geocode && (
        <Button size="md" variant="outline" className="flex-1">
          <a
            className="flex items-center gap-1"
            href={getGoogleLocationLink(geocode)}
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-sm md:text-sm">Get Direction</span>
            <GrLocation className="size-4 cursor-pointer hover:text-foreground/80" />
          </a>
        </Button>
      )}
      <Share
        shareInfo={{
          title: centerName,
          url: shareUrl,
        }}
      >
        <LuShare className="size-6 cursor-pointer hover:text-foreground/80" />
      </Share>
    </>
  );
}
