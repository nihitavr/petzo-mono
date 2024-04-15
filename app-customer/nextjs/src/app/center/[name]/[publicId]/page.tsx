import type { Metadata } from "next";

import { api } from "~/trpc/server";
import CenterPage from "./_components/center-page";

export async function generateMetadata({
  params: { publicId },
}: {
  params: { publicId: string };
}): Promise<Metadata> {
  // read route params
  const center = await api.center.findByPublicId({
    publicId,
  });

  if (!center) {
    return {
      title: "Center not found",
      description: "Center not found",
    };
  }

  return {
    title: center.name,
    description: center.description,
    openGraph: {
      title: center.name,
      description: center.description!,
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
