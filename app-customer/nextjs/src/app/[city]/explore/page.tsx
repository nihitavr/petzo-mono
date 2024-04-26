import HomePageServicesCards from "~/app/_components/home-page-service-cards";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  return (
    <div className="container-2">
      <div className="md:w-[50%]">
        <HomePageServicesCards />
      </div>
    </div>
  );
}
