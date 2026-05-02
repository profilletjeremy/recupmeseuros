import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Mon espace fiscal — Guide personnalisé",
  description: "Votre guide fiscal personnalisé : checklist, simulateurs, cases à remplir pas-à-pas.",
  robots: "noindex",
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface min-h-screen">
        <DashboardClient />
      </main>
      <Footer />
    </>
  );
}
