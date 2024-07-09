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

import { api } from "~/trpc/server";
import { InitializeCustomEvents } from "~/web-analytics/react";
import Footer from "./_components/footer";
import Header from "./_components/header";
import ViewCartButton from "./_components/view-cart-button";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://furclub.in"
      : "http://localhost:3000",
  ),
  title: "Furclub",
  icons: [{ rel: "icon", url: "/furclub-logo-icon.svg" }],
  description:
    "Furclub | Book Vet Consultation, Pet Grooming and Pet boarding services online.",
  openGraph: {
    title: "Furclub",
    images: [{ url: "/furclub-logo-icon.svg" }],
    description:
      "Furclub is an online platform for booking Pet Home Grooming, Vet Consultation, Pet Grooming and Pet boarding services online from nearby centers. Also features Pet Profile, Pet Booking/Health records and more.",
    url: "https://furclub.in",
    siteName: "Furclub App",
  },
  twitter: {
    title: "Furclub",
    images: [{ url: "/furclub-logo-icon.svg" }],
    description:
      "Furclub is an online platform for booking Vet Consultation, Pet Grooming and Pet boarding services online. ",
    card: "summary_large_image",
    site: "@furclubapp",
    creator: "@furclubapp",
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
            <main className="px-3 py-[4.4rem] pb-[5.4rem] md:py-[4.8rem] lg:px-24 xl:px-48">
              {props.children}
            </main>
            <ViewCartButton />
            <Footer />
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
