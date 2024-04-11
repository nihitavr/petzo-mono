import GlobalSearchInput from "./_components/global-search-input";
import HomePageServicesCards from "./_components/home-page-service-cards";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div className="flex flex-col gap-4">
      {/* <AuthShowcase /> */}

      {/* City + Search */}

      <div className="mt-3 md:mt-4 md:hidden">
        <GlobalSearchInput />
      </div>

      <div className="flex flex-col gap-2 md:mt-6">
        <div className="md:w-[50%]">
          <HomePageServicesCards />
        </div>
      </div>
    </div>
  );
}
