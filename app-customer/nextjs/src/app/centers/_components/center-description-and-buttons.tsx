"use client";

import { useEffect, useState } from "react";
import { FiPhoneOutgoing } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuShare } from "react-icons/lu";

import type { Center } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import Share from "@petzo/ui/components/share";

import { getGoogleLocationLink } from "~/lib/utils";

export default function CenterDescriptionAndButtons({
  center,
}: {
  center: Center;
}) {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Check if the code is running on the client side
    if (process) {
      // Access the current page URL using window.location
      setShareUrl(window.location.href);
    }
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
      </div>

      {/* Center Call and location Buttons */}
      <div className="mt-3 flex items-center justify-end gap-5 text-foreground/50">
        <div className="flex w-full justify-start">
          <Button
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="h-min w-min px-2 py-1 text-xs text-foreground/80"
            size="sm"
            variant="outline"
          >
            {showMoreDetails ? "Show Less" : "More Details >"}
          </Button>
        </div>

        <a href={`tel:${center.contactNumber}`}>
          <FiPhoneOutgoing className="size-6 cursor-pointer hover:text-foreground/80" />
        </a>
        <a
          href={getGoogleLocationLink(center.centerAddress.geocode)}
          target="_blank"
          rel="noreferrer"
        >
          <GrLocation className="size-6 cursor-pointer hover:text-foreground/80" />
        </a>

        <Share
          shareInfo={{
            title: `${center.name}`,
            url: shareUrl,
          }}
        >
          <LuShare className="size-6 cursor-pointer hover:text-foreground/80" />
        </Share>
      </div>
    </div>
  );
}
