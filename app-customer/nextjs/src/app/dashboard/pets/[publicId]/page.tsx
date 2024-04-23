import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";
import { PetProfileForm } from "../../_components/form/pet-profile-form";

export default async function Pet({
  params: { publicId },
}: {
  params: { publicId: string };
}) {
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

  const petProfile = await api.pet.getPetProfile({ publicId: publicId });
  return <PetProfileForm petProfile={petProfile} />;
}
