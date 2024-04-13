"use client";

import React from "react";
import { LuShare as ShareLucid } from "react-icons/lu";

interface ShareInfo {
  title: string;
  url: string;
  text?: string;
}

interface Props {
  className?: string;
  shareInfo: ShareInfo;
  children?: React.ReactNode;
}

export default function Share({
  className,
  shareInfo,
  children,
  ...props
}: Props) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareInfo);
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error in sharing:", error);
      }
    } else {
      console.log("Web Share API is not supported in your browser.");
    }
  };
  return (
    <button
      {...props}
      onClick={handleShare}
      className="flex items-center justify-center gap-2"
    >
      {children ? children : <ShareLucid className={className} />}
    </button>
  );
}
