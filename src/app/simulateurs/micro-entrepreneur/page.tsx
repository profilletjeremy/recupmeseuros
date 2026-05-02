import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MicroSimulator from "./MicroSimulator";

export const metadata: Metadata = {
  title: "Simulateur micro-entrepreneur 2026 — Imp\u00f4t et cotisations",
  description:
    "Calculez l\u2019imp\u00f4t et les cotisations sociales de votre micro-entreprise. Comparez versement lib\u00e9ratoire vs bar\u00e8me classique.",
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
