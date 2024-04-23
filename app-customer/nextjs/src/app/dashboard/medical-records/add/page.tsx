import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";
import { MedicalRecordsForm } from "../../_components/form/medical-records-form";

export default async function Page({
  searchParams: { petId: petPublicId },
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
              Pet&apos;s Medical Record
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
      <h1 className="text-xl font-semibold">New Medical Record </h1>
      <MedicalRecordsForm pets={pets} defaultPetPublicId={petPublicId} />
    </div>
  );
}
