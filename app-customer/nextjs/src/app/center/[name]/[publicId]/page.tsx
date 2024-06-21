import type { Metadata } from "next";
import { track } from "@vercel/analytics/server";

import { RecordEvent } from "~/app/_components/record-event";
import {
  getMetadataDescription,
  getMetadataKeywords,
  getMetadataTitle,
} from "~/lib/utils/center.utils";
import { api } from "~/trpc/server";
import CenterPage from "./_components/center-page";

export async function generateMetadata({
  params: { publicId },
}: {
  params: { publicId: string };
}): Promise<Metadata> {
  await track("center-details-page", { centerId: publicId });

  // read route params
  const center = await api.center.findByPublicId({
    publicId,
  });

  if (!center) {
    return {
      title: "Petzo | Center not found",
      description: "Center not found",
    };
  }

  const title = getMetadataTitle(center);
  const description = getMetadataDescription(center);
  const keywords = getMetadataKeywords(center);
  const imageUrl = center.images?.[0]?.url;

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      images: imageUrl,
    },
    twitter: {
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
        name="center-details-page"
        data={{ centerPublicId: publicId }}
      />
      <CenterPage publicId={publicId} />;
    </>
  );
}
