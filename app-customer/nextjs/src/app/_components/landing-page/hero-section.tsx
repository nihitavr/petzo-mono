import Image from "next/image";
import Link from "next/link";

import HeroSectionText from "./hero-section-text";

export default function HeroSection({
  cityPublicId,
  cityName,
}: {
  cityPublicId: string;
  cityName: string;
}) {
  return (
    <div className="space-y-3 md:space-y-4">
      <HeroSectionText city={cityName} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 ">
        <HomePageServicesCard
          name="Vet Cosultation"
          // label="Vet Clinics near you"
          imageUrl="/vet-consultation-card-image-removebg-preview.png"
          link={`/${cityPublicId}/centers?serviceType=veterinary`}
        />

        <HomePageServicesCard
          name="Pet Grooming"
          // label="Grooming Centers near you"
          imageUrl="/pet-grooming-card-image-removebg-preview.png"
          link={`/${cityPublicId}/centers?serviceType=grooming`}
        />

        <HomePageServicesCard
          name="Pet Boarding"
          // label="Boarding Centers near you"
          imageUrl="/pet-boarding-card-image-removebg-preview.png"
          link={`/${cityPublicId}/centers?serviceType=boarding`}
        />

        <HomePageServicesCard
          name="Home Grooming"
          // label="Home Grooming Centers near you"
          imageUrl="/pet-home-grooming-card-image-removebg-preview.png"
          link={`/${cityPublicId}/centers?serviceType=home_grooming`}
        />
      </div>
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
  label?: string;
  imageUrl: string;
  link: string;
}) => {
  return (
    <Link
      href={link}
      className="group relative m-auto flex aspect-square w-full flex-col overflow-hidden rounded-2xl border p-3 transition-transform duration-200 ease-in-out hover:scale-105 md:p-4"
    >
      <Image
        src={imageUrl}
        alt=""
        fill
        style={{ objectFit: "contain" }}
        className="z-10 transition-transform duration-200 ease-in-out group-hover:scale-105"
      />
      <div className="absolute left-0 top-0 size-full bg-muted"></div>
      <span className="z-10 font-semibold md:text-xl">{name}</span>
      {label && (
        <span className="z-10 -mt-1 text-xs opacity-60 md:text-sm">
          {label}
        </span>
      )}
    </Link>
  );
};
