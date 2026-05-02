import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuotientSimulator from "./QuotientSimulator";

export const metadata: Metadata = {
  title: "Simulateur quotient familial 2026 — Impact mariage, PACS, enfants",
  description:
    "Simulez l'impact du quotient familial sur votre impôt : mariage, PACS, enfants à charge, garde alternée, parent isolé.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <QuotientSimulator />
      </main>
      <Footer />
    </>
  );
}
