import type { Metadata, ResolvingMetadata } from "next";

import { RecordEvent } from "~/web-analytics/react";
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
    <div className="flex flex-col gap-10 md:gap-20">
      <RecordEvent
        name={
          ref ? "screenview_partner_with_us_ref" : "screenview_partner_with_us"
        }
        data={{ ref }}
      />
      <HeroSection />
      <WhatYouGet />
    </div>
  );
}
