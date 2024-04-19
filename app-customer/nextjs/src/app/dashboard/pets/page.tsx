import Image from "next/image";
import Link from "next/link";
import { PiPawPrintFill } from "react-icons/pi";

import { auth } from "@petzo/auth-customer-app";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

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
        <div className="mt-4 grid grid-cols-2 gap-5 md:grid-cols-4">
          {pets.length ? (
            pets.map((pet, idx) => {
              return (
                <div key={idx} className="relative flex flex-col items-start">
                  <div className="relative aspect-square w-full">
                    <Link
                      href={`/dashboard/pets/${pet.id}`}
                      key={idx}
                      className="cols-1"
                    >
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
                  <div className="font-semibold text-foreground">
                    {pet.name}
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
