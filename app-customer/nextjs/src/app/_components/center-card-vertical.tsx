import Link from "next/link";

import type { Center } from "@petzo/db";
import { centerUtils } from "@petzo/utils";

import { COLOR_MAP } from "~/lib/constants";
import BasicImagesCasousel from "../center/[name]/[publicId]/_components/basic-images-carousel";

export default function CenterCardVertical({
  center,
  serviceTypes,
  onlySummary = false,
  autoplayImages = true,
}: {
  center: Center;
  serviceTypes?: string[];
  userGeoCode?: {
    latitude: number;
    longitude: number;
  };
  onlySummary?: boolean;
  autoplayImages?: boolean;
}) {
  const thumbnail = center.images?.[0]?.url;

  return (
    <Link
      href={centerUtils.getCenterUrl(center)}
      className="flex h-full animate-fade-in flex-row overflow-hidden rounded-2xl border shadow-md"
    >
      <div className="flex h-full w-full flex-col gap-0">
        {/* Center Image */}
        <div className="relative aspect-[13/9] w-full cursor-pointer overflow-hidden rounded-t-2xl border-b object-center">
          {thumbnail ? (
            <BasicImagesCasousel
              images={
                center.images?.slice(0, 8)?.map((image) => image.url) ?? []
              }
              className="aspect-square w-full"
              autoplay={autoplayImages}
              enableZoomOut={false}
            />
          ) : (
            // <Image src={thumbnail} alt="" fill style={{ objectFit: "cover" }} />
            <div
              className={`flex size-full items-center justify-center rounded-t-2xl text-center ${COLOR_MAP[center.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
            >
              <div
                className={`text-7xl ${COLOR_MAP[center.name[0]!.toLowerCase()]?.textColor}`}
              >
                {center.name[0]}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
