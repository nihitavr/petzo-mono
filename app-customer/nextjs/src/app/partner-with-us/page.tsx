import type { Metadata, ResolvingMetadata } from "next";

import { env } from "~/env";
import { RecordEvent } from "~/web-analytics/react";
import WhatsAppButton from "../_components/whats-app-contact-button";
import GetFreeDemo from "./_components/get-free-demo";
import GetStarted from "./_components/get-started";
import HeroSection from "./_components/hero-section";
import WhatYouGet from "./_components/what-you-get";

export async function generateMetadata(
  // eslint-disable-next-line no-empty-pattern
  {},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = (await parent) as Metadata;

  return {
    openGraph: {
      ...parentMetadata?.openGraph,
      images: "/partner-page/social-media-image.png",
    },
    twitter: {
      ...parentMetadata.twitter,
      images: "/partner-page/social-media-image.png",
    },
  };
}

export default async function Page({
  searchParams: { ref },
}: {
  searchParams: { ref: string };
}) {
  return (
    <div className="flex flex-col gap-10 md:gap-16">
      <RecordEvent
        name={
          ref ? "screenview_partner_with_us_ref" : "screenview_partner_with_us"
        }
        data={{ ref }}
      />
      <HeroSection centerAppBaseUrl={env.CENTER_APP_BASE_URL} />
      <div className="w-screen -translate-x-3 bg-muted px-3 py-12 lg:-translate-x-24 lg:px-24 xl:-translate-x-48 xl:px-48">
        <WhatYouGet />
      </div>
      <GetStarted />
      <div
        id="demo-section"
        className="w-screen -translate-x-3 bg-muted px-3 py-20 lg:-translate-x-24 lg:px-24 xl:-translate-x-48 xl:px-48 "
      >
        <GetFreeDemo />
      </div>

      <WhatsAppButton />
    </div>
  );
}
