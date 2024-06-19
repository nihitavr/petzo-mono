import { track } from "@vercel/analytics/server";

import ServicesCheckoutPage from "~/app/_components/services-checkout-page";

export default async function Page() {
  await track("services-checkout-page");

  return <ServicesCheckoutPage />;
}
