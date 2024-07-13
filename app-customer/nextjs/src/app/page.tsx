import HeroSection from "./_components/landing-page/hero-section";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div className="container-2">
      {/* <AuthShowcase /> */}

      <HeroSection cityPublicId="bengaluru" cityName="Bengaluru" />
    </div>
  );
}
