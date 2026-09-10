import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { SITE_URL } from "./site";
import "./globals.css";

/* Instrument Serif pour les titres, les noms d'aides et les citations ;
   Geist pour tout le reste. Auto-hébergées par next/font (aucune requête externe). */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mon sésame : le mot qui ouvre vos aides de retraité",
  description:
    "Pour chaque aide, il existe un mot qui ouvre la porte : son nom exact, le bon organisme, la phrase à dire. Répondez à quelques questions, nous vous le donnons. Gratuit, sans inscription.",
  openGraph: {
    title: "Mon sésame : le mot qui ouvre vos aides de retraité",
    description:
      "Répondez à quelques questions et repartez avec, pour chaque aide, le nom exact, l'organisme et la phrase à dire. Gratuit, sans inscription.",
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
    <html lang="fr" className={`${instrumentSerif.variable} ${geist.variable} h-full`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-honey focus:px-4 focus:py-2 focus:text-foreground"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
