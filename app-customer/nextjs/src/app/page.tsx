import { api } from "~/trpc/server";
import CityDropdown from "./_components/city-dropdown";
import GlobalSearchInput from "./_components/global-search-input";
import HomePageServicesCards from "./_components/home-page-services-cards";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div className="flex flex-col gap-4">
      {/* <AuthShowcase /> */}
      {/* City + Search */}

      {/*  */}
      <div className="mt-4 flex items-center gap-2">
        <CityDropdown />
        <GlobalSearchInput />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-center text-2xl font-bold md:text-4xl">
          Our Services
        </h2>
        <div className="md:w-[50%]">
          <HomePageServicesCards />
        </div>
      </div>
    </div>
  );
}
