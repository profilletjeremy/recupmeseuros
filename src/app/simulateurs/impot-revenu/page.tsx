import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IRSimulator from "./IRSimulator";

export const metadata: Metadata = {
  title: "Simulateur impôt sur le revenu 2026 — Calculez votre IR",
  description:
    "Estimez votre impôt sur le revenu 2026 (revenus 2025). Calcul par tranche, quotient familial, décote, réductions et crédits d'impôt.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <IRSimulator />
      </main>
      <Footer />
    </>
  );
}
