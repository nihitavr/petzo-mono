import Link from "next/link";

import type { Center } from "@petzo/db";
import { auth } from "@petzo/auth-center-app";
import { Button } from "@petzo/ui/components/button";

import { api } from "~/trpc/server";
import HomePageCenterButton from "./_components/homepage-center-button";
import SignIn from "./_components/sign-in";

export default async function HomePage() {
  const user = (await auth())?.user;

  let centers: Center[] = [];
  if (user) {
    centers = await api.center.getCenters();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="mt-6 text-3xl">
        Hello, <span className="font-semibold">{user?.name ?? ""}</span>
      </h1>
      <h2 className="text-center text-lg">
        Welcome to Furclub! The one-stop solution for managing your pet
        services.
      </h2>
      {!user ? (
        <div className="mt-2 flex flex-col items-center gap-2">
          <span className="text-xl">
            Start by <span className="font-semibold">signing up </span>
            on Furclub
          </span>
          <SignIn />
        </div>
      ) : centers?.length > 0 ? (
        <div className="flex w-full flex-col items-center gap-1 md:w-3/4">
          <h2 className="text-2xl font-medium">Select Center</h2>
          <div
            className={`grid w-full grid-cols-1 flex-col items-center gap-1 ${centers?.length == 1 ? "md:grid-cols-1" : "md:grid-cols-2"}`}
          >
            {centers.map((center) => (
              <HomePageCenterButton key={center.publicId} center={center} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-col items-center gap-2">
          <span className="text-xl">
            Start by creating a{" "}
            <span className="font-semibold">new center.</span>
          </span>
          <Link href={"/dashboard/center/create"}>
            <Button>Create New Center</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
