import type { Metadata, ResolvingMetadata } from "next";

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

export default async function Page() {
  return (
    <div className="flex flex-col gap-10 md:gap-20">
      <HeroSection />
      <WhatYouGet />
    </div>
  );
}
