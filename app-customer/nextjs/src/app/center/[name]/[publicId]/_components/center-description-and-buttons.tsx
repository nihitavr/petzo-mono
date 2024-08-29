"use client";

import { useState } from "react";
import Markdown from "react-markdown";

import type { Center } from "@petzo/db";
import { Label } from "@petzo/ui/components/label";

export default function CenterDescriptionAndButtons({
  center,
}: {
  center: Center;
}) {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  return (
    <div>
      {/* Center Description */}
      {center.description && (
        <div className="flex w-full flex-col justify-start gap-1">
          <div
            onClick={() => setShowMoreDetails(true)}
            aria-hidden="true"
            className={`${showMoreDetails ? "" : "line-clamp-2 cursor-pointer md:line-clamp-6"} text-2sm md:text-sm`}
          >
            <Label className="text-2sm">Description</Label>
            <Markdown className="markdown-content -mt-1">
              {center.description}
            </Markdown>
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
      )}
    </div>
  );
}
