import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import QuestionnaireClient from "./QuestionnaireClient";

export const metadata: Metadata = {
  title: "Questionnaire fiscal",
  description:
    "Répondez à quelques questions pour découvrir les avantages fiscaux que vous oubliez peut-être sur votre déclaration 2026.",
};

export default function QuestionnairePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <QuestionnaireClient />
          <div className="mt-6">
            <Disclaimer compact />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
