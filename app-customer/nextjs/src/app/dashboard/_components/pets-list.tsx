import Image from "next/image";
import Link from "next/link";
import { LuPencil } from "react-icons/lu";
import { PiPawPrintFill } from "react-icons/pi";

import type { Pet } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { Label } from "@petzo/ui/components/label";
import { getTimePassed } from "@petzo/utils";

export default async function PetsList({ pets }: { pets: Pet[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
      {pets.length ? (
        pets.map((pet, idx) => {
          return (
            <div
              key={idx}
              className="relative flex w-full items-start gap-2 rounded-lg bg-primary/10"
            >
              <div className="relative h-full min-w-28 ">
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
              <div className="flex h-full w-full flex-col justify-between gap-1 p-1 font-semibold text-foreground md:p-2">
                <div className="flex justify-between">
                  <div className="flex  flex-col gap-0 ">
                    <Link
                      href={`/dashboard/pets/${pet.publicId}`}
                      className="cursor-pointer text-base hover:underline md:text-lg"
                    >
                      {pet.name}{" "}
                      {pet?.dateOfBirth && (
                        <span className="text-xs opacity-70 md:text-sm">
                          ({getTimePassed(pet?.dateOfBirth)})
                        </span>
                      )}
                    </Link>
                    {pet.breed && (
                      <span className="text-xs opacity-70 md:text-sm">
                        {pet.breed}
                      </span>
                    )}
                  </div>
                  <Link
                    className="mr-2 flex h-min cursor-pointer items-center gap-1 text-sm opacity-80 hover:underline md:text-base"
                    href={`/dashboard/pets/${pet.publicId}`}
                  >
                    <span>Edit</span>
                    <LuPencil strokeWidth={3} className="size-3 md:size-3.5" />
                  </Link>
                </div>

                <div className="mt-6 flex w-full flex-col">
                  <Link
                    className="cursor-pointer text-sm text-primary hover:underline md:text-base"
                    href={`/dashboard/medical-records?petId=${pet.publicId}`}
                  >
                    Medical Records
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-2 flex h-[20vh] flex-col items-center justify-center gap-2 text-center text-foreground/80 md:col-span-4">
          <span>
            No pets added yet. Click{" "}
            <span className="font-semibold">Add Pet </span> to create a new pet
            profile.
          </span>

          <Link href={"/dashboard/pets/add"}>
            <Button
              variant="primary"
              className="flex items-center justify-center gap-1"
            >
              Add Pet
              <PiPawPrintFill strokeWidth={2.5} className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
