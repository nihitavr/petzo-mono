import Image from "next/image";
import Link from "next/link";
import { LuPencil } from "react-icons/lu";
import { PiPawPrintFill } from "react-icons/pi";

import { auth } from "@petzo/auth-customer-app";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";
import { Label } from "@petzo/ui/components/label";
import { getTimePassed } from "@petzo/utils";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";

export default async function PetsDasoboardPage() {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view Your
              Pets
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const pets = await api.pet.getPetProfiles();

  return (
    <div className="flex flex-col gap-5">
      {/* Your Pets */}
      <div>
        <div className="flex w-full items-center justify-start gap-4 font-semibold">
          <span className="text-xl">Your Pets</span>
          {pets.length > 0 && (
            <div className="flex-grow">
              <Link className="float-right" href={"/dashboard/pets/add"}>
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
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          {pets.length ? (
            pets.map((pet, idx) => {
              return (
                <div
                  key={idx}
                  className="relative flex w-full items-start gap-2 rounded-lg bg-primary/10"
                >
                  <div className="relative aspect-square h-28 md:h-40">
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
                        className="rounded-lg"
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
                        <LuPencil
                          strokeWidth={3}
                          className="size-3 md:size-3.5"
                        />
                      </Link>
                    </div>

                    <div className="flex w-full flex-col">
                      <Label className="text-xs opacity-60 md:text-sm">
                        Medical Records
                      </Label>
                      <div className="flex gap-4">
                        <Link
                          className="cursor-pointer text-sm text-primary hover:underline md:text-base"
                          href={`/dashboard/pets/${pet.publicId}/medical-records`}
                        >
                          View
                        </Link>

                        <Link
                          className="cursor-pointer text-sm text-primary hover:underline md:text-base"
                          href={`/dashboard/pets/${pet.publicId}/medical-records`}
                        >
                          Add New
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 flex h-[20vh] flex-col items-center justify-center gap-2 text-center text-foreground/80 md:col-span-4">
              <span>
                No pets added yet. Click{" "}
                <span className="font-semibold">Add Pet </span> to create a new
                pet profile.
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
      </div>
    </div>
  );
}