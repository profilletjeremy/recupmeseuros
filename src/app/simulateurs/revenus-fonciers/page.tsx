import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FonciersSimulator from "./FonciersSimulator";

export const metadata: Metadata = {
  title: "Simulateur revenus fonciers 2026 — Micro-foncier vs régime réel",
  description:
    "Comparez micro-foncier et régime réel pour vos revenus locatifs. Calculez votre impôt et trouvez le régime le plus avantageux.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <FonciersSimulator />
      </main>
      <Footer />
    </>
  );
}
