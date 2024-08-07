"use client";

import Link from "next/link";
import { useSignals } from "@preact/signals-react/runtime";

import type { Center } from "@petzo/db";

import { selectedCenterPublicId } from "~/lib/store/global-storage";

export default function HomePageCenterButton({ center }: { center: Center }) {
  useSignals();

  return (
    <Link
      href={`/dashboard/${center.publicId}`}
      onClick={() => {
        selectedCenterPublicId.value = center.publicId;
      }}
      className="flex w-full flex-col rounded-md border bg-muted p-2 px-4 text-sm hover:bg-foreground/10 md:text-base"
      key={center.publicId}
    >
      <span className="font-semibold">{center.name}</span>
      <span className="text-xs md:text-2sm">
        {center.centerAddress?.area?.name}, {center.centerAddress?.city?.name}
      </span>
    </Link>
  );
}
