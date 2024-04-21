import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import MedicalRecordsSection from "~/app/dashboard/_components/medical-records-section";
import { api } from "~/trpc/server";

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

  return <MedicalRecordsSection pets={pets} petId={petId} />;
}
