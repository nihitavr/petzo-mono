"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSignals } from "@preact/signals-react/runtime";

import { cn } from "@petzo/ui/lib/utils";

// import { useMediaQuery } from "~/lib/hooks/screen.hooks";
import { servicesCart } from "~/lib/storage/service-cart-storage";
import { trackCustom } from "~/web-analytics/react";

const WhatsAppButton = () => {
  console.log("WhatsAppButton");
  useSignals();

  // const [isScrollAtEnd, setIsScrollAtEnd] = useState(false);

  const isScrollAtEnd = true;

  const [hasCartItems, setHasCartItems] = useState(false);

  useEffect(() => {
    setHasCartItems(!!servicesCart?.value?.items?.length);
  }, [servicesCart?.value?.items?.length]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >
  //       document.documentElement.scrollHeight - (isDesktop ? 200 : 400)
  //     ) {
  //       setIsScrollAtEnd(true);
  //     } else {
  //       setIsScrollAtEnd(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [isDesktop]);

  return (
    <a
      href="https://wa.me/6363822930"
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        trackCustom("whatsapp_button_clicked");
      }}
      className={cn(
        `fixed bottom-20 right-5 z-50 flex items-center justify-end overflow-hidden rounded-full p-1 hover:scale-105 md:right-3 lg:right-24 xl:right-48`,
        hasCartItems ? "bottom-20" : "bottom-5",
      )}
    >
      <div
        className={cn(
          "flex translate-x-full items-center gap-2 whitespace-nowrap font-semibold transition-all duration-200",
          isScrollAtEnd ? "w-min translate-x-0 px-2" : "w-0 opacity-0",
        )}
      >
        {/* <span>Contact Us</span> */}
        <div className="relative z-10 h-10 w-10 md:h-12 md:w-12">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src="/icons/whatsapp-icon-home-page.svg"
            alt="whatsapp logo"
          />
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
