"use client";

import { useEffect } from "react";

import type { Review } from "@petzo/db";
import { Dialog, DialogContent } from "@petzo/ui/components/dialog";

import BasicImagesCasousel from "./basic-images-carousel";

export function ReviewDetailsModal({
  review,
  startIndex,
  open,
  setOpen,
}: {
  review: Review;
  startIndex?: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const reviewUrl = "";

  const imageUrls = review.images?.map((img) => img.url) ?? [];

  useEffect(() => {
    const handleBackButton = () => {
      if (open) setOpen(false);
    };

    if (open) {
      window.history.pushState({}, "", reviewUrl);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [open, review?.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        overlayClassName="bg-black/80"
        className="max-h-[80vh] border-0 p-0 sm:max-w-[425px]"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col">
            <BasicImagesCasousel
              images={imageUrls}
              startIndex={startIndex}
              className="aspect-square w-full"
              imageClassName="border-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
