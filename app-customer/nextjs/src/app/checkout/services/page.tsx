import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import ServicesCheckoutPage from "~/app/_components/services-checkout-page";
import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";

export default async function Page() {
  const authUser = (await auth())?.user;
  if (!authUser) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view Your
              Cart
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const user = await api.user.getUserProfile({ id: authUser.id });

  return <ServicesCheckoutPage user={user} />;
}
