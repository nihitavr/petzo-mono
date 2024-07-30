import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@petzo/ui/components/theme";
import { Toaster } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { auth } from "@petzo/auth-center-app";

import { api } from "~/trpc/server";
import Header from "./_components/header";

const metadataTitle =
  "Pet Care Services, Home/In-store Grooming, Pet Boarding, Vet Consultation | Furclub";
const metadataDescription =
  "Easily book nearby pet services online. Furclub helps you find top local pet groomers, pet boarders, and vets for all your pet care needs. Manage appointments and health records in one user-friendly platform. Discover quality pet care in your neighborhood today.";
const metadataLogoIcon = "/website/furclub-logo-icon.svg";
const metadataSocialImage = "/website/furclub-social.png";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://center.furclub.in"
      : "http://localhost:3000",
  ),
  title: metadataTitle,
  icons: [{ rel: "icon", url: metadataLogoIcon }],
  description: metadataDescription,
  openGraph: {
    title: metadataTitle,
    images: metadataSocialImage,
    description: metadataDescription,
    url: "https://center.furclub.in",
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

  let centers;
  if (session?.user) {
    centers = await api.center.getCenters();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <main className="container-main">{props.children}</main>
          </TRPCReactProvider>
          <Header session={session} centers={centers} />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
