"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiPhoneOutgoing } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuShare } from "react-icons/lu";

import type { CENTER_CTA_BUTTONS_TYPE } from "@petzo/constants";
import type { Center } from "@petzo/db";
import { INDIA_COUNTRY_CODE, WHATSAPP_URL } from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import Share from "@petzo/ui/components/share";
import { getGoogleLocationLink } from "@petzo/utils";

import { trackCustom } from "~/web-analytics/react";

export default function CenterCTAButtons({ center }: { center: Center }) {
  const whatsappLink = useMemo(
    () =>
      `${WHATSAPP_URL}/${INDIA_COUNTRY_CODE}${center.phoneNumber}?text=Hi, I found your number from Furclub. I want to know more about the services you offer.`,
    [center],
  );

  const ctaButtonsContainerRef = useRef<HTMLDivElement>(null);
  const [, setShareUrl] = useState("");
  const [, setFixedATC] = useState(false);

  useEffect(() => {
    // Access the current page URL using window.location.href
    setShareUrl(window.location.href);

    const handleScroll = () => {
      const ctaButtonsTop =
        ctaButtonsContainerRef?.current?.getBoundingClientRect()?.top;
      if (!ctaButtonsTop) return;

      if (ctaButtonsTop < 200) setFixedATC(true);
      else setFixedATC(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!center?.ctaButtons?.length) return null;

  return (
    <>
      {/* CTA Buttons */}
      <div className="-mt-0.5 flex flex-col rounded-xl bg-muted p-2">
        <p className="text-xs font-medium">
          Call or Message to know more about the services
        </p>
        <div
          ref={ctaButtonsContainerRef}
          className="flex items-center justify-end gap-2"
        >
          <AtcButtons
            whatsappLink={whatsappLink}
            centerName={center.name}
            centerPublicId={center.publicId}
            ctaButtons={center.ctaButtons}
            phoneNumber={center.phoneNumber}
          />
        </div>
      </div>

      {/*  Floating CTA buttons  */}
      {/* <div
        className={`fixed bottom-0 left-0 z-50 flex w-full flex-col gap-0.5 rounded-t-2xl bg-background px-3 pb-3 pt-1.5 caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)] shadow-primary/50 transition-opacity duration-500 md:hidden ${
          fixedATC ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="ml-1 text-xs font-medium">
          Call or Message to know more about the services
        </span>

        <AtcButtons
          whatsappLink={whatsappLink}
          centerName={center.name}
          centerPublicId={center.publicId}
          ctaButtons={center.ctaButtons}
          shareUrl={shareUrl}
          phoneNumber={center.phoneNumber}
        />
      </div> */}
    </>
  );
}

function AtcButtons({
  whatsappLink,
  varient = "primary",
  ctaButtons,
  centerName,
  centerPublicId,
  shareUrl,
  phoneNumber,
  geocode,
}: {
  whatsappLink: string;
  varient?: "primary" | "secondary";
  ctaButtons: CENTER_CTA_BUTTONS_TYPE[] | null;
  centerName: string;
  centerPublicId: string;
  shareUrl?: string;
  phoneNumber?: string | null;
  geocode?: { latitude: number; longitude: number } | null;
}) {
  return (
    <div className="flex w-full justify-end gap-1">
      {phoneNumber && (
        <>
          {ctaButtons?.includes("call") && (
            <Button
              onClick={() => {
                trackCustom("center_call_button_clicked", {
                  centerPublicId: centerPublicId,
                });
              }}
              size="md"
              variant={varient}
              className="w-full"
            >
              <a
                className="flex items-center gap-1"
                href={`tel:${phoneNumber}`}
              >
                <span className="text-sm md:text-sm">Call</span>
                <FiPhoneOutgoing
                  strokeWidth="2"
                  className="size-4 cursor-pointer hover:text-foreground/80"
                />
              </a>
            </Button>
          )}
          {ctaButtons?.includes("whatsapp") && (
            <Button
              variant={"outline"}
              onClick={() => {
                trackCustom("center_whatsapp_button_clicked", {
                  centerPublicId: centerPublicId,
                });
              }}
              className="w-full hover:bg-green-50"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <span className="truncate">Message</span>
                <div className="relative size-4">
                  <Image
                    src={"/icons/whatsapp-icon-home-page.svg"}
                    alt="WhatsApp Icon"
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              </a>
            </Button>
          )}
        </>
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
    </div>
  );
}
