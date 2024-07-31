import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";
import AddNewPetButton from "../_components/add-new-pet-button";
import NoPetsFallback from "../_components/no-pets-fallback";
import PetsList from "../_components/pets-list";

export default async function PetsDashboardPage() {
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
    <div>
      {/* Your Pets */}
      <div className="flex w-full items-center justify-start gap-4 font-semibold">
        <h1 className="text-xl">Your Pets</h1>
        {pets.length > 0 && (
          <div className="flex-grow">
            <AddNewPetButton className="float-right" />
          </div>
        )}
      </div>
      {/* Pets List */}
      {pets?.length ? <PetsList pets={pets} /> : <NoPetsFallback />}
    </div>
  );
}
