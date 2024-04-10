"use client";

import Image from "next/image";
import Link from "next/link";
import { useSignals } from "@preact/signals-react/runtime";

import { filtersStore } from "~/lib/storage/global-storage";

export default function HomePageServicesCards() {
  useSignals();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href={`/centers?city=${filtersStore.city.value}&serviceType=veterinary`}
        className="relative m-auto flex aspect-square w-full flex-col overflow-hidden rounded-2xl px-3 shadow-md"
      >
        <Image
          src={"/vet-consultation-card-image.jpg"}
          alt=""
          fill
          style={{ objectFit: "contain" }}
        />
        <span className="z-10 mt-3 font-bold md:text-lg">Veterinary</span>
        <span className="z-10 -mt-1 text-xs opacity-60 md:text-sm">
          Vet Clinics near you
        </span>
      </Link>
      <Link
        href={`/centers?city=${filtersStore.city.value}&serviceType=grooming`}
        className="relative m-auto flex aspect-square w-full flex-col overflow-hidden rounded-2xl px-3 shadow-md"
      >
        <Image
          src={"/pet-grooming-card-image.jpg"}
          alt=""
          fill
          style={{ objectFit: "contain" }}
        />
        <span className="z-10 mt-3 font-bold md:text-lg">Pet Grooming</span>
        <span className="z-10 -mt-1 text-xs opacity-60 md:text-sm">
          Pet Groomers near you
        </span>
      </Link>
      <Link
        href={`/centers?city=${filtersStore.city.value}&serviceType=boarding`}
        className="relative m-auto flex aspect-square w-full flex-col overflow-hidden rounded-2xl px-3 shadow-md"
      >
        <Image
          src={"/pet-boarding-card-image.jpg"}
          alt=""
          fill
          style={{ objectFit: "contain" }}
        />
        <span className="z-10 mt-3 font-bold md:text-lg">Pet Boarding</span>
        <span className="z-10 -mt-1 text-xs opacity-60 md:text-sm">
          Pet Boarders near you
        </span>
      </Link>
    </div>
  );
}
