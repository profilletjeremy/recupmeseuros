import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonsSimulator from "./DonsSimulator";

export const metadata: Metadata = {
  title: "Simulateur réduction d'impôt dons 2026",
  description:
    "Calculez votre réduction d'impôt pour dons aux associations, aide aux personnes, organismes cultuels et partis politiques.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <DonsSimulator />
      </main>
      <Footer />
    </>
  );
}
