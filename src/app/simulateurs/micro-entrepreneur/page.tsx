import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MicroSimulator from "./MicroSimulator";

export const metadata: Metadata = {
  title: "Simulateur micro-entrepreneur 2026 — Impôt et cotisations",
  description:
    "Calculez l’impôt et les cotisations sociales de votre micro-entreprise. Comparez versement libératoire vs barème classique.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <MicroSimulator />
      </main>
      <Footer />
    </>
  );
}
