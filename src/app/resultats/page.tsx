import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResultsClient from "./ResultsClient";

export const metadata: Metadata = {
  title: "Vos résultats fiscaux",
  description: "Découvrez les avantages fiscaux que vous pouvez vérifier sur votre déclaration 2026.",
};

export default function ResultatsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <ResultsClient />
      </main>
      <Footer />
    </>
  );
}
