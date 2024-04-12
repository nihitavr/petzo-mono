import { headers } from "next/headers";
import { FaStar } from "react-icons/fa";
import { FiPhoneOutgoing } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuShare } from "react-icons/lu";

import type { Center } from "@petzo/db";
import NotFound from "@petzo/ui/components/not-found";
import ScrollToTop from "@petzo/ui/components/scroll-to-top";
import Share from "@petzo/ui/components/share";

import { getGoogleLocationLink } from "~/lib/utils";
import { getServicesProvidedByCenter } from "~/lib/utils/center.utils";
import { api } from "~/trpc/server";
import CenterImageCasousel from "../../_components/center-images-carousel";
import CenterServicesList from "../../_components/center-services-list";

export default async function Page({
  params: { publicId },
}: {
  params: { publicId: string };
}) {
  const center = await api.center.findByPublicId({
    publicId,
  });

  if (!center) {
    return <NotFound />;
  }

  const imageUrls = center.images?.map((img) => img.url) ?? [];

  return (
    <div className="flex flex-col gap-5 pt-0 md:gap-8 md:py-4">
      {/* This will make the component scroll to top when loaded */}
      <ScrollToTop />

      {/* Center Image & Center Info */}
      <div className="flex grid-cols-10 flex-col gap-2 md:grid md:gap-5">
        {/* Center Images */}
        <div className="col-span-4 w-full p-2 md:p-0">
          <CenterImageCasousel
            images={imageUrls}
            className="aspect-square w-full"
            imageClassName="rounded-md border-none"
          />
        </div>

        {/* Center Info */}
        <div className="col-span-6 h-min rounded-lg bg-primary/5  p-3">
          <CenterInfo center={center} />
        </div>
      </div>

      <div>
        <CenterServicesList center={center} />
      </div>
    </div>
  );
}

const CenterInfo = ({ center }: { center: Center }) => {
  const headersList = headers();
  const shareUrl = headersList.get("referer") ?? "";

  const serviceTypesProvided = getServicesProvidedByCenter(center);

  return (
    <div className="flex flex-col gap-2 overflow-y-auto pt-0">
      {/* Center name */}
      <h1 className="line-clamp-2 text-lg font-semibold md:text-xl">
        {center?.name}
      </h1>

      {/* Rating and Reviews */}
      <div className="md:text-md flex items-center gap-2 text-sm text-foreground/80">
        <div className="flex items-center gap-1">
          <span className="">{center.averageRating}</span>
          <FaStar className="h-3.5 w-3.5 text-yellow-600" />
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-foreground/80"></div>
        <div className="flex cursor-pointer items-center gap-1 hover:underline">
          <span>{center.reviewCount} reviews</span>
        </div>
      </div>

      {/* Services Provided */}
      <span className="line-clamp-1 break-all text-sm font-semibold capitalize text-primary md:text-base">
        {serviceTypesProvided.join(", ")}
      </span>

      {/* address */}
      <div className="flex items-start gap-1">
        <GrLocation className="size-5" />
        <span className="line-clamp-2 text-sm font-medium capitalize md:text-base">
          {center.centerAddress.line1}, {center.centerAddress.area.name}
        </span>
      </div>

      {/* Center Description */}
      <div className="whitespace-pre-wrap text-sm md:text-base">
        {center.description}
      </div>

      {/* Center Call and location Buttons */}
      <div className="mt-3 flex items-center justify-end gap-5 text-foreground/50">
        <a href={`tel:${center.contactNumber}`}>
          <FiPhoneOutgoing className="size-6 cursor-pointer hover:text-foreground/80" />
        </a>
        <a
          href={getGoogleLocationLink(center.centerAddress.geocode)}
          target="_blank"
          rel="noreferrer"
        >
          <GrLocation className="size-6 cursor-pointer hover:text-foreground/80" />
        </a>

        <Share
          shareInfo={{
            title: `${center.name}`,
            url: shareUrl,
          }}
        >
          <LuShare className="size-6 cursor-pointer hover:text-foreground/80" />
        </Share>
      </div>
    </div>
  );
};
