"use client";

import Image from "next/image";
import Link from "next/link";
import { useSignals } from "@preact/signals-react/runtime";

import { filtersStore } from "~/lib/storage/global-storage";

export default function HomePageServicesCards() {
  useSignals();

  return (
    <div className="grid grid-cols-2 gap-3">
      <HomePageServicesCard
        name="Vet Cosultation"
        label="Vet Clinics near you"
        imageUrl="/vet-consultation-card-image.jpg"
        link={`/${filtersStore.city.value}/centers?serviceType=veterinary`}
      />
      <HomePageServicesCard
        name="Pet Grooming"
        label="Grooming Centers near you"
        imageUrl="/pet-grooming-card-image.jpg"
        link={`/${filtersStore.city.value}/centers?serviceType=grooming`}
      />
      {/* <HomePageServicesCard
        name="Pet Boarding"
        imageUrl="/pet-boarding-card-image.jpg"
        link={`/${filtersStore.city.value}/centers?serviceType=boarding`}
      /> */}
    </div>
  );
}

const HomePageServicesCard = ({
  name,
  label,
  imageUrl,
  link,
}: {
  name: string;
  label: string;
  imageUrl: string;
  link: string;
}) => {
  return (
    <Link
      href={link}
      className="relative m-auto flex aspect-square w-full flex-col overflow-hidden rounded-2xl p-3 shadow-md md:p-4"
    >
      <Image src={imageUrl} alt="" fill style={{ objectFit: "contain" }} />
      <span className="z-10 font-semibold text-slate-900 md:text-xl">
        {name}
      </span>
      <span className="z-10 -mt-1 text-xs opacity-60 md:text-sm">{label}</span>
    </Link>
  );
};