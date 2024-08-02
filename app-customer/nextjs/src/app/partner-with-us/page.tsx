import HeroSection from "./_components/hero-section";
import WhatYouGet from "./_components/what-you-get";

export default async function Page() {
  return (
    <div className="flex flex-col gap-10 md:gap-20">
      <HeroSection />
      <WhatYouGet />
    </div>
  );
}
