import Image from "next/image";
import Link from "next/link";

import { Button } from "@petzo/ui/components/button";

import { filtersStore } from "~/lib/storage/global-storage";

export default function WhyUsePetzoSection() {
  return (
    <div className="space-y-7">
      <h1 className="text-center text-2xl md:text-3xl">
        Why use <span className="font-bold">fur</span>
        <span className="text-foreground/80">club?</span>
      </h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card
          icon="/icons/discover-pet-centers-icon.svg"
          title="Discover Best Pet Care"
          // buttonName="Explore"
          // buttonLink={`/${filtersStore.city.value}/centers`}
          descriptions={[
            "Find top pet centers for vet consultation, grooming, home grooming, and boarding.",
            "Discover a variety of packages tailored to your pet's needs.",
            "Easily call or get directions to centers with one click.",
          ]}
        />
        <Card
          icon="/icons/pet-appointment-booking.svg"
          title="Book Appointments"
          descriptions={[
            "Easily book visits or schedule home appointments with your favorite pet care centers.",
            "View and select from available time slots in real-time to ensure convenient scheduling.",
          ]}
        />
        <Card
          icon="/icons/pet-medical-records-icon.svg"
          title="Medical Records"
          buttonName="Medical Records"
          buttonLink={`/dashboard/medical-records`}
          descriptions={[
            "Keep track of your pet's medical records and prescriptions.",
            "Easily show past medical records to your vet.",
            "Never worry about losing your pet's medical records again.",
          ]}
        />

        <Card
          icon="/icons/pet-vaccination-alerts-icon.svg"
          title="Vaccination Alerts"
          descriptions={["Coming soon."]}
        />
      </div>
    </div>
  );
}

const Card = ({
  icon,
  title,
  buttonName,
  buttonLink,
  buttonVarient,
  descriptions,
}: {
  icon: string;
  title: string;
  buttonName?: string;
  buttonLink?: string;
  buttonVarient?:
    | "link"
    | "primary"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  descriptions: string[];
}) => {
  return (
    <div className="flex min-h-60 flex-col gap-3 rounded-xl border p-4 md:min-h-44">
      <div className="flex items-center gap-2">
        <Image width={30} height={30} src={icon} alt="" />
        <span className="text-lg font-semibold md:text-xl">{title}</span>
      </div>
      <ul className="list-inside list-disc px-1">
        {descriptions.map((description, index) => (
          <li key={index}>{description}</li>
        ))}
      </ul>
      {buttonLink && (
        <div className="mt-auto flex justify-end">
          <Link href={buttonLink}>
            <Button variant={buttonVarient ? buttonVarient : "primary"}>
              {buttonName}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
