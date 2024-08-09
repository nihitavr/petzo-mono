"use client";

import { useSignals } from "@preact/signals-react/runtime";

import { Button } from "@petzo/ui/components/button";
import { cn } from "@petzo/ui/lib/utils";

import { trackCustom } from "~/web-analytics/react";

const GetDemoButton = () => {
  useSignals();

  return (
    <a
      href="https://wa.me/6363822930"
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        trackCustom("whatsapp_button_clicked");
      }}
      className={cn(
        `fixed bottom-6 right-16 z-50 flex items-center justify-end overflow-hidden rounded-full p-1 hover:scale-105 md:bottom-7 md:right-10 lg:right-32 xl:right-64`,
      )}
    >
      <div
        className={cn(
          "flex w-min items-center gap-2 whitespace-nowrap px-2 font-semibold",
        )}
      >
        {/* <span>Contact Us</span> */}
        <Button>Get Free Demo</Button>
      </div>
    </a>
  );
};

export default GetDemoButton;
