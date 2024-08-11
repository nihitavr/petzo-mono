import type { Metadata } from "next";

import type { Center } from "@petzo/db";
import { serviceUtils } from "@petzo/utils";

import { api } from "~/trpc/server";
import { RecordEvent } from "~/web-analytics/react";
import CenterPage from "../../_components/center-page";

export async function generateMetadata({
  params: { publicId, servicePublicId },
}: {
  params: { publicId: string; servicePublicId: string };
}): Promise<Metadata> {
  // read route params
  const center = (await api.center.findByPublicId({
    publicId,
  })) as unknown as Center;

  const service = await api.service.findByPublicId({
    publicId: servicePublicId,
  });

  if (!service) {
    return {
      title: "Furclub | Service not found",
      description: "Service not found",
    };
  }

  const title = serviceUtils.getMetadataTitle(service, center);
  const description = serviceUtils.getMetadataDescription(service, center);
  const keywords = serviceUtils.getMetadataKeywords(service, center);

  const imageUrl = service.images?.[0]?.url;

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
        name="screenview_service_details_page"
        data={{
          servicePublicId: publicId,
        }}
      />
      <CenterPage publicId={publicId} />
    </>
  );
}
