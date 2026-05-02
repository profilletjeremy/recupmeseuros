import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerificationClient from "./VerificationClient";

export const metadata: Metadata = {
  title: "Vérifiez votre déclaration pré-remplie — Checklist oublis fréquents",
  description:
    "Vous avez déjà commencé votre déclaration sur impots.gouv.fr ? Vérifiez que vous n'oubliez rien avec notre checklist express.",
};

export default function Verification() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <VerificationClient />
      </main>
      <Footer />
    </>
  );
}
