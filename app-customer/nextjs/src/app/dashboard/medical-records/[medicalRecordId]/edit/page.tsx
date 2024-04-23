import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { MedicalRecordsForm } from "~/app/dashboard/_components/form/medical-records-form";
import { api } from "~/trpc/server";

export default async function Page({
  params: { medicalRecordId },
  searchParams: { petId: petPublicId },
}: {
  params: { medicalRecordId: string };
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

  const petMedicalRecord = await api.petMedicalRecord.getPetMedicalRecord({
    id: +medicalRecordId,
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit Medical Record </h1>
      <MedicalRecordsForm
        pets={pets}
        defaultPetPublicId={petPublicId}
        petMedicalRecord={petMedicalRecord}
      />
    </div>
  );
}
