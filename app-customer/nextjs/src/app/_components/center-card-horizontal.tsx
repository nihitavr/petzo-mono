import Link from "next/link";

import type { Center } from "@petzo/db";
import { centerUtils } from "@petzo/utils";

import { COLOR_MAP } from "~/lib/constants";
import BasicImagesCasousel from "../center/[name]/[publicId]/_components/basic-images-carousel";

export default function CenterCardHorizontal({
  center,
  serviceTypes,
}: {
  center: Center;
  serviceTypes?: string[];
}) {
  const thumbnail = center.images?.[0]?.url;

  return (
    <Link
      href={centerUtils.getCenterUrl(center)}
      className="flex animate-fade-in flex-row rounded-xl bg-muted md:border md:shadow-sm"
    >
      <div className="flex h-44 w-full gap-1 md:h-60">
        {/* Center Image */}
        <div className="relative h-full w-2/5 cursor-pointer overflow-hidden rounded-xl">
          {thumbnail ? (
            <BasicImagesCasousel
              images={
                center.images?.slice(0, 8)?.map((image) => image.url) ?? []
              }
              autoplay={true}
              className="h-44 w-full md:h-60"
              autoPlayDelay={3000}
              enableZoomOut={false}
              autoPlatMargin="-10% 0px -10% 0px"
            />
          ) : (
            // <Image src={thumbnail} alt="" fill style={{ objectFit: "cover" }} />
            <div
              className={`flex size-full items-center justify-center rounded-md text-center ${COLOR_MAP[center.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
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
