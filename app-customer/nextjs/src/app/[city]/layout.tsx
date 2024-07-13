import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  {
    params: { city },
  }: {
    params: { city: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  if (!city) {
    return {};
  }
  const parentMetadata = (await parent) as Metadata;

  const metadataDescription = `Easily book nearby pet services online in ${city}. Furclub helps you find top local pet groomers, pet boarders, and vets for all your pet care needs. Manage appointments and health records in one user-friendly platform. Discover quality pet care in your neighborhood today.`;

  return {
    description: metadataDescription,
    openGraph: {
      ...parentMetadata?.openGraph,
      description: metadataDescription,
    },
    twitter: {
      ...parentMetadata.twitter,
      description: metadataDescription,
    },
  };
}
export default async function RootLayout(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}
