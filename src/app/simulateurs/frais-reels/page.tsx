import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FraisReelsSimulator from "./FraisReelsSimulator";

export const metadata: Metadata = {
  title: "Simulateur frais réels — Frais kilométriques, repas, télétravail",
  description: "Calculez vos frais réels et comparez avec l'abattement forfaitaire de 10%. Barème kilométrique officiel 2025.",
};

export default function SimulateurFraisReels() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <FraisReelsSimulator />
      </main>
      <Footer />
    </>
  );
}
