import type { Metadata } from "next";

export function generateMetadata({
  params: { city },
}: {
  params: { city: string };
}): Metadata {
  if (!city) {
    return {};
  }

  const metadataDescription = `Easily book nearby pet services online in ${city}. Furclub helps you find top local pet groomers, pet boarders, and vets for all your pet care needs. Manage appointments and health records in one user-friendly platform. Discover quality pet care in your neighborhood today.`;

  return {
    description: metadataDescription,
    openGraph: {
      description: metadataDescription,
    },
    twitter: {
      description: metadataDescription,
    },
  };
}
export default async function RootLayout(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}
