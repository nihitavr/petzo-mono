import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import type { Pet } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { getTimePassed } from "@petzo/utils";

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
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/dashboard/pets/${pet.publicId}`}
                    className="cursor-pointer text-sm hover:underline md:text-lg"
                  >
                    <span className="font-semibold">{pet.name} </span>
                    {pet?.dateOfBirth && (
                      <span className="text-xs opacity-70 md:text-sm">
                        ({getTimePassed(pet?.dateOfBirth)})
                      </span>
                    )}
                  </Link>
                  {pet.breed && (
                    <span className="text-xs font-medium opacity-70 md:text-sm">
                      {pet.breed}
                    </span>
                  )}
                  {pet?.dateOfBirth && (
                    <div className="flex items-center gap-1">
                      <p className="text-xs opacity-70 md:text-sm">DOB: </p>
                      <p className="text-xs font-medium opacity-70 md:text-sm ">
                        {format(pet?.dateOfBirth, "ccc do MMM yy")}
                      </p>
                    </div>
                  )}
                </div>
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
                  {/* <LuPencil strokeWidth={3} className="size-2.5 md:size-3.5" /> */}
                </Link>
              </div>

              <div className="mt-6 flex w-full flex-col">
                <Link
                  className="cursor-pointer text-xs font-medium text-primary hover:underline md:text-sm"
                  href={`/dashboard/medical-records?petId=${pet.publicId}`}
                >
                  Medical Records
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
