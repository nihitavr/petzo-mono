import HeroSection from "~/app/_components/landing-page/hero-section";
import HeroSectionText from "~/app/_components/landing-page/hero-section-text";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div className="container-2">
      <HeroSectionText />
      <HeroSection />
    </div>
  );
}
