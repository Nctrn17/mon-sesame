import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE_URL } from "./site";
import "./globals.css";

/* Police dessinée pour la basse vision (Braille Institute) :
   formes de lettres non ambiguës, adaptée au public senior. */
const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mon sésame : vos aides de retraité, sans rien laisser passer",
  description:
    "Découvrez en quelques minutes les aides, exonérations et tarifs réduits auxquels vous avez droit. Service gratuit, sans inscription obligatoire.",
  openGraph: {
    title: "Mon sésame : vos aides de retraité, sans rien laisser passer",
    description:
      "Répondez à une douzaine de questions simples et découvrez les aides auxquelles vous avez droit. Gratuit, anonyme, sans inscription.",
    url: SITE_URL,
    siteName: "Mon sésame",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${atkinson.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu principal
        </a>
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
