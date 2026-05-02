import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlusValueSimulator from "./PlusValueSimulator";

export const metadata: Metadata = {
  title: "Simulateur plus-value immobilière 2026",
  description:
    "Calculez la taxe sur la plus-value lors de la vente d'un bien immobilier. Abattements par durée de détention, prélèvements sociaux, surtaxe.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <PlusValueSimulator />
      </main>
      <Footer />
    </>
  );
}
