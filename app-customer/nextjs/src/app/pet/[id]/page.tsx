import PetProfile from "~/app/_components/pet-profile";

export const generateMetadata = () => {
  return { title: "Find My Pet - Pet Profile" };
};

export default async function PetProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return <PetProfile id={params.id} />;
}
