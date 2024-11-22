import type { Metadata, ResolvingMetadata } from "next";

import { centerUtils } from "@petzo/utils";

import { api } from "~/trpc/server";
import { RecordEvent } from "~/web-analytics/react";
import CenterPage from "./_components/center-page";

export async function generateMetadata(
  {
    params: { publicId },
  }: {
    params: { publicId: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = (await parent) as Metadata;

  // read route params
  const center = await api.center.findByPublicId({
    publicId,
  });

  if (!center) {
    return {
      title: "Furclub | Center not found",
      description: "Center not found",
    };
  }

  const title = centerUtils.getMetadataTitle(center);
  const description = centerUtils.getMetadataDescription(center);
  const keywords = centerUtils.getMetadataKeywords(center);
  const imageUrl = center.images?.[0]?.url;
  const centerUrlPathname = centerUtils.getCenterUrl(center);

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      ...parentMetadata?.openGraph,
      title: title,
      description: description,
      images: imageUrl,
      url: centerUrlPathname,
    },
    twitter: {
      ...parentMetadata?.twitter,
      title: title,
      description: description,
      images: imageUrl,
    },
  };
}

export default async function Page({
  params: { publicId },
}: {
  params: { publicId: string };
}) {
  return (
    <>
      <RecordEvent
        name="screenview_center_details_page"
        data={{ centerPublicId: publicId }}
      />
      <CenterPage publicId={publicId} />
    </>
  );
}
