import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PERSimulator from "./PERSimulator";

export const metadata: Metadata = {
  title: "Simulateur PER 2026 — Economie d'impot Plan Epargne Retraite",
  description:
    "Calculez l'economie d'impot de vos versements PER. Simulez selon votre tranche marginale et votre plafond disponible.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <PERSimulator />
      </main>
      <Footer />
    </>
  );
}
