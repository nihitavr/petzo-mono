import HomePageServicesCards from "./_components/home-page-service-cards";
import { SelectCityAndSearch } from "./_components/select-city-and-search-input";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div className="flex flex-col gap-4">
      {/* <AuthShowcase /> */}

      {/* City + Search */}
      <SelectCityAndSearch className="mt-2 md:mt-4" />

      <div className="flex flex-col gap-2">
        <div className="md:w-[50%]">
          <HomePageServicesCards />
        </div>
      </div>
    </div>
  );
}
