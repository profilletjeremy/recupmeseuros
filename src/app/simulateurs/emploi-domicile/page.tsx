import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmploiDomicileSimulator from "./EmploiDomicileSimulator";

export const metadata: Metadata = {
  title: "Simulateur crédit d'impôt emploi à domicile 2026",
  description:
    "Calculez votre crédit d'impôt pour emploi à domicile : ménage, jardinage, garde d'enfants, soutien scolaire, aide informatique.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <EmploiDomicileSimulator />
      </main>
      <Footer />
    </>
  );
}
