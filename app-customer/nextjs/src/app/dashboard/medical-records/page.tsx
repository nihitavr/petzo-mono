import Link from "next/link";
import { PiPawPrintFill } from "react-icons/pi";

import { auth } from "@petzo/auth-customer-app";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import MedicalRecordsSection from "~/app/dashboard/_components/medical-records-section";
import { api } from "~/trpc/server";
import AddNewPetButton from "../_components/add-new-pet-button";
import NoPetsFallback from "../_components/no-pets-fallback";

export default async function MedicalRecordsPage({
  searchParams: { petId: petId },
}: {
  searchParams: { petId: string };
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view Your
              Pet&apos;s medical records.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const pets = await api.pet.getPetProfiles();

  return (
    <div>
      <h1 className="text-xl font-semibold">Medical Records</h1>

      {pets?.length ? (
        <MedicalRecordsSection pets={pets} petId={petId} />
      ) : (
        <NoPetsFallback />
      )}
    </div>
  );
}
