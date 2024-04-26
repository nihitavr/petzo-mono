import HeroSection from "./_components/landing-page/hero-section";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div className="mt-16 flex flex-col gap-4 md:mt-0">
      {/* <AuthShowcase /> */}

      <HeroSection />
    </div>
  );
}
