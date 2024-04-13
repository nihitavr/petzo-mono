import type { Metadata } from "next";

import NotFound from "@petzo/ui/components/not-found";

import { api } from "~/trpc/server";
import { CenterInfo } from "../../_components/center-info";
import CenterServiceList from "../../_components/center-service-list";
import ImagesCasousel from "../../_components/images-carousel";

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
  const center = await api.center.findByPublicId({
    publicId,
  });

  if (!center) return <NotFound />;

  const imageUrls = center.images?.map((img) => img.url) ?? [];

  return (
    <div className="flex flex-col gap-5 pt-0 md:gap-8 md:py-4">
      {/* Center Image & Center Info */}
      <div className="flex grid-cols-10 flex-col gap-2 md:grid md:gap-5">
        {/* Center Images */}
        <div className="col-span-4 w-full p-2 md:p-0">
          <ImagesCasousel
            images={imageUrls}
            className="aspect-square w-full"
            imageClassName="rounded-md border-none"
          />
        </div>

        {/* Center Info */}
        <CenterInfo
          className={`${!imageUrls.length ? "col-span-10" : "col-span-6"} h-min rounded-lg bg-primary/[7%] p-3`}
          center={center}
        />
      </div>

      <CenterServiceList center={center} />
    </div>
  );
}
