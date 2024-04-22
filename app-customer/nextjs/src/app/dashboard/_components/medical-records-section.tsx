"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiFileList3Line } from "react-icons/ri";

import type { Pet, PetMedicalRecord } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";

import { api } from "~/trpc/react";
import MedicalRecordsList from "./medical-records-list";

export default function MedicalRecordsSection({
  pets,
  petId,
}: {
  pets: Pet[];
  petId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedPetPublicId, setSelectedPetPublicId] = useState(
    petId || pets?.[0]?.publicId,
  );

  const { data: petMedicalRecords, isLoading } =
    api.petMedicalRecord.getPetMedicalRecords.useQuery(
      {
        petPublicId: selectedPetPublicId!,
        pagination: {
          page: 0,
          limit: 10,
        },
      },
      { enabled: !!selectedPetPublicId },
    );

  const pet = useMemo(
    () => pets.find((pet) => pet.publicId === selectedPetPublicId),
    [selectedPetPublicId, pets],
  );

  const onPetSelect = (publicId: string) => {
    setSelectedPetPublicId(publicId);
    router.replace(`${pathname}?petId=${publicId}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-start gap-2">
        <h1 className="text-xl font-semibold">Medical Records</h1>
      </div>
      <div className="flex gap-2 overflow-scroll pb-2">
        {pets.length > 0 &&
          pets.map((pet, idx) => {
            const image = pet.images?.[0]
              ? pet.images?.[0]?.url
              : pet.type !== "cat"
                ? "/dog-avatar.jpeg"
                : "/cat-avatar.jpeg";

            const isSelected = pet.publicId == selectedPetPublicId;
            return (
              <div
                onClick={() => onPetSelect(pet.publicId)}
                aria-hidden="true"
                key={idx}
                className={`flex w-min cursor-pointer flex-col items-center rounded-lg p-1.5 ${isSelected ? "border bg-primary/30 shadow-md" : "hover:bg-primary/10"}`}
              >
                <div className="relative aspect-square w-20 overflow-hidden rounded-full md:w-28">
                  <Image
                    src={image}
                    alt={pet.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(min-width: 780px) 112px, 80px"
                  />
                </div>
                <span className="font-semibold">{pet.name}</span>
              </div>
            );
          })}
      </div>
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="line-clamp-1 text-lg font-semibold">{pet?.name}</h2>
          <Link href={`/dashboard/pets/${pet?.publicId}/medical-records/add`}>
            <Button size="sm">
              New Medical Record
              <RiFileList3Line className="ml-1 size-3.5" />
            </Button>
          </Link>
        </div>

        <MedicalRecordsList
          petName={pet?.name}
          petMedicalRecords={petMedicalRecords as PetMedicalRecord[]}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
