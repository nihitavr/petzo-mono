import HeroSection from "~/app/_components/landing-page/hero-section";
import HeroSectionText from "~/app/_components/landing-page/hero-section-text";
import { api } from "~/trpc/server";

export default async function HomePage({
  params: { city },
}: {
  params: { city: string };
}) {
  // You can await this here if you don't want to show Suspense fallback below
  const cities = await api.city.getAllActiveCities();
  const cityName = cities.find((c) => c.publicId === city)?.name;

  return (
    <div className="container-2">
      <HeroSectionText city={cityName!} />
      <HeroSection city={city} />
    </div>
  );
}
