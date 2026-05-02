import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Crédit d'impôt borne de recharge électrique | RécupMesEuros",
  description:
    "Guide complet sur le crédit d'impôt pour l'installation d'une borne de recharge : 75%, plafond 500 €, cases 7ZQ/7ZR, conditions et justificatifs.",
};

export default function GuideBorneRecharge() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Crédit d&apos;impôt borne de recharge électrique
          </h1>

          <p className="text-text-light mb-8 text-lg">
            L&apos;installation d&apos;une borne de recharge pour véhicule électrique à votre domicile ouvre droit
            à un <strong>crédit d&apos;impôt de 75%</strong>, plafonné à 500 € par borne.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe</h2>
            <p className="text-text-light mb-4">
              L&apos;État encourage l&apos;installation de bornes de recharge résidentielles en accordant un crédit d&apos;impôt
              de 75% des dépenses engagées (achat + installation), plafonné à <strong>500 € par point de charge</strong>.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Exemple :</strong> Installation à 1 200 € → Crédit d&apos;impôt = 75% × 1 200 = 900 €,
                plafonné à <strong>500 €</strong>.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Conditions</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Résidence principale <strong>ou</strong> secondaire (maison ou appartement)</li>
              <li>Installation réalisée par un <strong>électricien certifié IRVE</strong></li>
              <li>Borne de recharge (pas une simple prise renforcée)</li>
              <li>Une borne par emplacement de stationnement</li>
              <li>Propriétaire, locataire ou occupant à titre gratuit</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Plafond</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="text-text-light"><strong>500 €</strong> par système de charge, par logement</p>
              <p className="text-text-light mt-2">Un couple dans une résidence principale + une résidence secondaire peut bénéficier de jusqu&apos;à <strong>4 × 500 = 2 000 €</strong> de crédit d&apos;impôt.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases à remplir</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">Case</th>
                    <th className="text-left p-3 font-semibold">Situation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-mono text-primary">7ZQ</td><td className="p-3 text-text-light">Dépenses pour borne de recharge — résidence principale</td></tr>
                  <tr><td className="p-3 font-mono text-primary">7ZR</td><td className="p-3 text-text-light">Dépenses pour borne de recharge — résidence secondaire</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-lighter mt-2">Formulaire 2042-RICI.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Justificatifs</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Facture détaillée de l&apos;installateur certifié IRVE</li>
              <li>Attestation de conformité de l&apos;installation</li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">Conservez ces documents <strong>3 ans</strong>.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.service-public.fr/particuliers/vosdroits/F36828" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">service-public.fr — Crédit d&apos;impôt borne de recharge →</a></li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Découvrez tous vos crédits d&apos;impôt</h2>
            <p className="text-blue-100 mb-6">Notre assistant détecte automatiquement les avantages auxquels vous avez droit.</p>
            <Link href="/questionnaire" className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold px-8 py-3 rounded-xl shadow-lg transition-all">
              Commencer le questionnaire gratuit
            </Link>
          </section>

          <Disclaimer />
        </article>
      </main>
      <Footer />
    </>
  );
}
