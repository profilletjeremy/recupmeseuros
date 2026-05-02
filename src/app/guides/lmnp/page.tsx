import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "LMNP : guide fiscal du loueur meublé non professionnel | RécupMesEuros",
  description:
    "Guide complet LMNP : micro-BIC vs régime réel, amortissements, seuils, formulaire 2042-C-PRO et optimisation fiscale.",
};

export default function GuideLMNP() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            LMNP : le guide fiscal du loueur meublé non professionnel
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Le statut <strong>LMNP</strong> est l&apos;un des régimes fiscaux les plus avantageux pour
            les propriétaires qui louent un bien meublé. Micro-BIC ou régime réel ? Voici tout ce qu&apos;il faut savoir.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Micro-BIC vs Régime réel</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold mb-2">Micro-BIC</h3>
                <ul className="text-sm text-text-light space-y-1">
                  <li>Abattement forfaitaire de <strong>50%</strong></li>
                  <li>Seuil : recettes &lt; 77 700 €/an</li>
                  <li>Simple à déclarer</li>
                  <li>Pas de comptabilité obligatoire</li>
                </ul>
              </div>
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="font-bold mb-2 text-primary">Régime réel (souvent plus avantageux)</h3>
                <ul className="text-sm text-text-light space-y-1">
                  <li>Déduction des charges réelles</li>
                  <li><strong>Amortissement</strong> du bien et du mobilier</li>
                  <li>Peut aboutir à un résultat imposable = 0 €</li>
                  <li>Nécessite un expert-comptable</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Charges déductibles (régime réel)</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li><strong>Intérêts d&apos;emprunt</strong> et assurance emprunteur</li>
              <li><strong>Amortissement</strong> du bien (hors terrain, sur 25-30 ans)</li>
              <li><strong>Amortissement du mobilier</strong> (sur 5-10 ans)</li>
              <li>Taxe foncière</li>
              <li>Charges de copropriété</li>
              <li>Assurance PNO (propriétaire non occupant)</li>
              <li>Travaux d&apos;entretien et de réparation</li>
              <li>Frais de gestion et comptabilité</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Déclaration</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 space-y-2">
              <p className="text-text-light"><strong>Micro-BIC :</strong> Case <span className="font-mono text-primary">5ND</span> du formulaire <strong>2042-C-PRO</strong> (recettes brutes)</p>
              <p className="text-text-light"><strong>Régime réel :</strong> Liasse fiscale <strong>2031</strong> + report sur <strong>2042-C-PRO</strong></p>
              <p className="text-sm text-text-lighter mt-2">N&apos;oubliez pas la déclaration de début d&apos;activité au greffe (formulaire P0i).</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Points d&apos;attention</h2>
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Réforme 2025 :</strong> les amortissements déduits seront pris en compte dans le calcul de la plus-value à la revente pour les biens acquis après 2025. Anticipez l&apos;impact.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>LMNP vs LMP :</strong> si vos recettes dépassent 23 000 €/an ET représentent plus de 50% de vos revenus, vous passez en LMP (professionnel). Régime fiscal différent.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.impots.gouv.fr/particulier/les-revenus-de-la-location-meublee" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">impots.gouv.fr — Location meublée →</a></li>
              <li><a href="https://www.service-public.fr/particuliers/vosdroits/F32805" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">service-public.fr — LMNP →</a></li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Propriétaire bailleur ? Analysez votre situation</h2>
            <p className="text-blue-100 mb-6">Notre questionnaire détecte les optimisations possibles pour vos revenus locatifs.</p>
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
