import type { Metadata } from "next";

import {
  getMetadataDescription,
  getMetadataKeywords,
  getMetadataTitle,
} from "~/lib/utils/service.utils";
import { api } from "~/trpc/server";
import CenterPage from "../../_components/center-page";

export async function generateMetadata({
  params: { publicId, servicePublicId },
}: {
  params: { publicId: string; servicePublicId: string };
}): Promise<Metadata> {
  // read route params
  const center = await api.center.findByPublicId({
    publicId,
  });

  const service = await api.service.findByPublicId({
    publicId: servicePublicId,
  });

  if (!service) {
    return {
      title: "Petzo | Service not found",
      description: "Service not found",
    };
  }

  const title = getMetadataTitle(service, center!);
  const description = getMetadataDescription(service, center!);
  const keywords = getMetadataKeywords(service, center!);

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
  return <CenterPage publicId={publicId} />;
}