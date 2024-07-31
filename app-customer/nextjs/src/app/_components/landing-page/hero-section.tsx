import HomePageServicesCard from "./hero-section-service-card";
import HeroSectionText from "./hero-section-text";

export default function HeroSection({
  cityPublicId,
  cityName,
}: {
  cityPublicId: string;
  cityName: string;
}) {
  return (
    <div className="space-y-6">
      <HeroSectionText city={cityName} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 ">
        <HomePageServicesCard
          name="Home Grooming"
          // label="Home Grooming Centers near you"
          imageUrl="/pet-home-grooming-card-image-removebg-preview.png"
          link={`/center/furclub-bengaluru/home-grooming`}
          // link={`/${cityPublicId}/centers?serviceType=home_grooming`}
        />

        <HomePageServicesCard
          name="Vet Cosultation"
          disabled={true}
          imageUrl="/vet-consultation-card-image-removebg-preview.png"
          link={`/${cityPublicId}/centers?serviceType=veterinary`}
          disabledToastText="Vet Consultation is coming soon. Stay tuned!"
        />

        <HomePageServicesCard
          name="In-store Grooming"
          // label="Grooming Centers near you"
          disabled={true}
          imageUrl="/pet-grooming-card-image-removebg-preview.png"
          link={`/${cityPublicId}/centers?serviceType=grooming`}
          disabledToastText="In-store Grooming is coming soon. Stay tuned!"
        />

        <HomePageServicesCard
          name="Pet Boarding"
          // label="Boarding Centers near you"
          disabled={true}
          imageUrl="/pet-boarding-card-image-removebg-preview.png"
          link={`/${cityPublicId}/centers?serviceType=boarding`}
          disabledToastText="Pet Boarding is coming soon. Stay tuned!"
        />
      </div>
    </div>
  );
}
