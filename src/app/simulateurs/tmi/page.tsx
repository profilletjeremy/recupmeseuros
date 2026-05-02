import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TMISimulator from "./TMISimulator";

export const metadata: Metadata = {
  title: "Simulateur TMI — Calculez votre tranche marginale d'imposition 2025",
  description:
    "Calculez votre tranche marginale d'imposition (TMI), votre impôt sur le revenu et visualisez la répartition par tranche. Barème 2025.",
};

export default function SimulateurTMI() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <TMISimulator />
      </main>
      <Footer />
    </>
  );
}
