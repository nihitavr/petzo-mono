import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@petzo/ui/components/theme";
import { Toaster } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { Analytics } from "@vercel/analytics/react";

import { auth } from "@petzo/auth-customer-app";

import { env } from "~/env";
import { api } from "~/trpc/server";
import { InitializeCustomEvents } from "~/web-analytics/react";
import Footer from "./_components/footer";
import Header from "./_components/header";
import ViewCartButton from "./_components/view-cart-button";

const metadataTitle =
  "Pet Care Services, Home/In-store Grooming, Pet Boarding, Vet Consultation | Furclub";
const metadataDescription =
  "Easily book nearby pet services online. Furclub helps you find top local pet groomers, pet boarders, and vets for all your pet care needs. Manage appointments and health records in one user-friendly platform. Discover quality pet care in your neighborhood today.";
const metadataLogoIcon = "/website/furclub-logo-icon.svg";
const metadataSocialImage = "/website/furclub-social.png";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://furclub.in"
      : "http://localhost:3000",
  ),
  title: metadataTitle,
  icons: [{ rel: "icon", url: metadataLogoIcon }],
  description: metadataDescription,
  openGraph: {
    title: metadataTitle,
    images: metadataSocialImage,
    description: metadataDescription,
    url: "https://furclub.in",
    siteName: "Furclub",
  },
  twitter: {
    title: metadataTitle,
    images: metadataSocialImage,
    description: metadataDescription,
    card: "summary_large_image",
    site: "@furclubapp",
    creator: "@furclub",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();
  const cities = await api.geography.getActiveCities();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          "min-h-screen w-[100vw] overflow-y-scroll bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Analytics />
        <InitializeCustomEvents userId={session?.user?.id} />
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>
            <Header session={session} cities={cities} />
            <main className="px-3 pb-[5.4rem] pt-[4.4rem] md:pt-[4.8rem] lg:px-24 xl:px-48">
              {props.children}
            </main>
            <ViewCartButton />
            <Footer centerAppBaseUrl={env.CENTER_APP_BASE_URL} />
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
