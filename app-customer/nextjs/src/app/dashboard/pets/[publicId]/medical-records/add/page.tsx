import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";

export default async function AddPetMedicalRecordPage({
  params: { publicId, medicalRecordId },
}: {
  params: { publicId: string; medicalRecordId: string };
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

  return (
    <div>
      <h1 className="text-xl font-semibold">Medical Record</h1>
    </div>
  );
}
