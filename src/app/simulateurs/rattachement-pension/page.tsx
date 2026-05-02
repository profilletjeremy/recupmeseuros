import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RattachementSimulator from "./RattachementSimulator";

export const metadata: Metadata = {
  title: "Simulateur rattachement vs pension alimentaire — Enfant majeur",
  description: "Comparez l'impact fiscal : rattachement d'un enfant majeur à votre foyer fiscal ou déduction d'une pension alimentaire.",
};

export default function SimulateurRattachement() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <RattachementSimulator />
      </main>
      <Footer />
    </>
  );
}
