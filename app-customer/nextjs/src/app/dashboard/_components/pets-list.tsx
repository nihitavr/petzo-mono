import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { FiArrowUpRight } from "react-icons/fi";

import type { Pet } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { getTimePassed } from "@petzo/utils";

import DeletePetButton from "./delete-pet-button";

export default async function PetsList({ pets }: { pets: Pet[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      {pets.map((pet, idx) => {
        return (
          <div
            key={idx}
            className="relative flex w-full items-start gap-2 rounded-lg bg-muted"
          >
            <div className="relative h-full min-h-28 min-w-28">
              <Link href={`/dashboard/pets/${pet.publicId}`} key={idx}>
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  src={
                    pet.images?.[0]
                      ? pet.images?.[0]?.url
                      : pet.type !== "cat"
                        ? "/dog-avatar.jpeg"
                        : "/cat-avatar.jpeg"
                  }
                  alt="pet profile"
                  className="aspect-square rounded-lg"
                  sizes="112px"
                />
              </Link>
            </div>
            <div className="flex h-full w-full flex-col justify-between gap-1 p-1 text-foreground md:p-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-1">
                  <Link
                    href={`/dashboard/pets/${pet.publicId}`}
                    className="cursor-pointer text-sm hover:underline md:text-base"
                  >
                    <p className="line-clamp-1 font-semibold">{pet.name}</p>
                  </Link>
                  <div className="flex items-center gap-1">
                    <DeletePetButton petId={pet.id} petName={pet.name} />
                    <Link
                      className="mr-1 flex h-min cursor-pointer items-center gap-1 text-sm opacity-80 hover:underline md:text-base"
                      href={`/dashboard/pets/${pet.publicId}`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs md:px-3 md:text-sm"
                      >
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>

                {pet.breed && (
                  <div className="flex items-center gap-1 text-xs md:text-2sm">
                    <p className="opacity-70">Breed: </p>
                    <p className="font-medium opacity-80">{pet.breed}</p>
                  </div>
                )}

                {pet?.dateOfBirth && (
                  <div className="flex items-center gap-1 text-xs md:text-2sm">
                    <p className="opacity-70">Age: </p>
                    <p className="font-medium opacity-80">
                      {getTimePassed(pet?.dateOfBirth)}
                    </p>
                  </div>
                )}

                {pet?.dateOfBirth && (
                  <div className="flex items-center gap-1 text-xs md:text-2sm">
                    <p className="opacity-70">DOB: </p>
                    <p className="font-medium opacity-80">
                      {format(pet?.dateOfBirth, "ccc do MMM yy")}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-1 flex w-full gap-5">
                <Link
                  className="cursor-pointer text-xs font-medium text-primary hover:underline md:text-sm"
                  href={`/dashboard/medical-records?petId=${pet.publicId}`}
                >
                  Medical Records
                </Link>
                <Link
                  className="flex cursor-pointer items-center text-xs font-medium hover:underline md:text-sm"
                  href={`/pet/${pet.publicId}`}
                  target="_blank"
                >
                  <span>View Profile</span>
                  <FiArrowUpRight className="inline" size={16} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
