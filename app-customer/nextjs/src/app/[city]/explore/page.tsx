// import CentersNearYouSection from "~/app/_components/landing-page/centers-near-you-section";
import HeroSection from "~/app/_components/landing-page/hero-section";
// import BestCentersInCity from "~/app/_components/landing-page/top-rated-centers-in-city";
import WhyUsePetzoSection from "~/app/_components/landing-page/why-use-petzo";
import WhatsAppButton from "~/app/_components/whats-app-contact-button";
import { api } from "~/trpc/server";
import { RecordEvent } from "~/web-analytics/react";

export default async function HomePage({
  params: { city },
}: {
  params: { city: string };
}) {
  // You can await this here if you don't want to show Suspense fallback below
  const cities = await api.geography.getActiveCities();
  const cityName = cities.find((c) => c.publicId === city)?.name;

  return (
    <div className="container-2 !gap-7">
      <RecordEvent name="screenview_city_explore_home_page" data={{ city }} />
      <HeroSection cityPublicId={city} cityName={cityName!} />
      {/* <CentersNearYouSection cityPublicId={city} /> */}
      {/* <BestCentersInCity cityPublicId={city} cityName={cityName!} /> */}
      <WhyUsePetzoSection />
      <WhatsAppButton />
    </div>
  );
}
