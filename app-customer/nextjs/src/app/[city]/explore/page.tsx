import FadeInWhenVisible from "@petzo/ui/components/animation/fade-in-when-visible";

import HeroSection from "~/app/_components/landing-page/hero-section";
import TopCentersInCity from "~/app/_components/landing-page/top-centers-in-city";
import TopHomeCentersInCity from "~/app/_components/landing-page/top-home-centers-in-city";
import WhyUsePetzoSection from "~/app/_components/landing-page/why-use-petzo";
import WhatsAppButton from "~/app/_components/whats-app-contact-button";
import { api } from "~/trpc/server";
import { RecordEvent } from "~/web-analytics/react";

export default async function HomePage({
  params: { city, ref },
}: {
  params: { city: string; ref: string };
}) {
  // You can await this here if you don't want to show Suspense fallback below
  const cities = await api.geography.getActiveCities();
  const cityName = cities.find((c) => c.publicId === city)?.name;

  return (
    <div className="container-2 !gap-8 md:!gap-14">
      <RecordEvent
        name={
          ref
            ? "screenview_city_explore_home_page_ref"
            : "screenview_city_explore_home_page"
        }
        data={{ city, ref }}
      />
      <HeroSection cityPublicId={city} cityName={cityName!} />
      {/* <CentersNearYouSection cityPublicId={city} /> */}

      <FadeInWhenVisible>
        <TopHomeCentersInCity cityPublicId={city} cityName={cityName!} />
      </FadeInWhenVisible>
      <FadeInWhenVisible>
        <TopCentersInCity cityPublicId={city} cityName={cityName!} />
      </FadeInWhenVisible>
      <WhyUsePetzoSection />
      <WhatsAppButton />
    </div>
  );
}
