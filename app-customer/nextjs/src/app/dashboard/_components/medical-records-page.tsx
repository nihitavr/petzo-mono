"use client";

import Image from "next/image";

import type { Pet } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";

export default function MedicalRecords({
  pets,
  petPublicId,
}: {
  pets: Pet[];
  petPublicId: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-start gap-2">
        <h1 className="text-xl font-semibold">Pets</h1>
      </div>
      <div className="flex gap-2 overflow-scroll pb-2">
        {pets.length > 0 &&
          pets.map((pet, idx) => {
            const image = pet.images?.[0]
              ? pet.images?.[0]?.url
              : pet.type !== "cat"
                ? "/dog-avatar.jpeg"
                : "/cat-avatar.jpeg";

            const isSelected = pet.publicId == petPublicId;
            return (
              <div
                key={idx}
                className={`flex w-min cursor-pointer flex-col items-center rounded-lg p-1.5 ${isSelected ? "border bg-primary/30 shadow-md" : "hover:bg-primary/10"}`}
              >
                <div className="relative aspect-square w-20 overflow-hidden rounded-full md:w-28">
                  <Image
                    src={image}
                    alt={pet.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <span className="font-semibold">{pet.name}</span>
              </div>
            );
          })}
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold opacity-80">Medical Records</h1>
          <Button size="sm">Add New</Button>
        </div>

        <div className="flex items-center justify-center p-10 text-center">
          <span>
            No Medical Records found for{" "}
            <span className="font-semibold">{pets[0]?.name}</span>.
          </span>
        </div>
      </div>
    </div>
  );
}
