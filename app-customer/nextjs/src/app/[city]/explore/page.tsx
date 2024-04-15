import HomePageServicesCards from "~/app/_components/home-page-service-cards";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div className="mt-16 flex flex-col gap-4 md:mt-0">
      {/* <AuthShowcase /> */}

      <div className="mt-2 flex flex-col gap-2 md:mt-6">
        <div className="md:w-[50%]">
          <HomePageServicesCards />
        </div>
      </div>
    </div>
  );
}
