import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import ServicesCheckoutPage from "~/app/_components/services-checkout-page";
import SignIn from "~/app/_components/sign-in";

export default async function Page() {
  if (!(await auth())?.user) {
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

  return <ServicesCheckoutPage />;
}
