import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RecupMesEuros — Découvrez vos économies fiscales oubliées",
    template: "%s | RecupMesEuros",
  },
  description:
    "Assistant gratuit d'aide à la déclaration d'impôts. Découvrez les réductions, crédits d'impôt et déductions que vous oubliez peut-être. Déclaration 2026 des revenus 2025.",
  keywords: [
    "déclaration impôts",
    "crédit impôt",
    "réduction impôt",
    "frais réels",
    "emploi à domicile",
    "dons associations",
    "garde enfant",
    "2042-RICI",
    "déclaration 2026",
  ],
  robots: "index, follow",
  openGraph: {
    title: "RecupMesEuros — Découvrez vos économies fiscales oubliées",
    description:
      "Répondez à quelques questions. L'assistant vous indique les avantages fiscaux à vérifier et les cases concernées.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
