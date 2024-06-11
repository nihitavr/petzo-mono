"use client";

import { useEffect, useState } from "react";
import { LuShare } from "react-icons/lu";

import type { Center } from "@petzo/db";
import Share from "@petzo/ui/components/share";

export default function CenterInfoShareButton({ center }: { center: Center }) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Access the current page URL using window.location.href
    setShareUrl(window.location.href);
  }, []);

  return (
    <Share
      shareInfo={{
        title: center.name,
        url: shareUrl,
      }}
    >
      <LuShare className="size-5 cursor-pointer text-foreground/80 hover:text-foreground/60" />
    </Share>
  );
}
