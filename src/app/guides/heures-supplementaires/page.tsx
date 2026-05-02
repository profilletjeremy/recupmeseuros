import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Heures supplémentaires exonérées : vérifiez la case 1GH | RécupMesEuros",
  description:
    "Guide complet sur l'exonération d'impôt des heures supplémentaires : plafond 7 500 €, case 1GH, erreurs fréquentes et vérifications.",
};

export default function GuideHeuresSup() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Heures supplémentaires exonérées : vérifiez votre déclaration
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Les heures supplémentaires sont <strong>exonérées d&apos;impôt</strong> jusqu&apos;à 7 500 € par an.
            Mais attention : des erreurs dans le montant pré-rempli sont fréquentes.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe</h2>
            <p className="text-text-light mb-4">
              Depuis 2019, les rémunérations des heures supplémentaires (et complémentaires pour les temps partiels)
              sont exonérées d&apos;impôt sur le revenu dans la limite de <strong>7 500 € net par an</strong>.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Concrètement :</strong> si vous avez perçu 3 000 € d&apos;heures sup, ces 3 000 €
                ne sont pas ajoutés à votre revenu imposable. Économie réelle = 3 000 € × votre TMI (11% à 45%).
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Case à vérifier</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-mono text-primary text-lg font-bold mb-1">1GH</p>
              <p className="text-text-light text-sm">Revenus d&apos;heures supplémentaires exonérées (déclarant 1)</p>
              <p className="font-mono text-primary text-lg font-bold mb-1 mt-3">1HH</p>
              <p className="text-text-light text-sm">Revenus d&apos;heures supplémentaires exonérées (déclarant 2)</p>
            </div>
            <p className="text-sm text-text-lighter mt-2">
              Ce montant est normalement <strong>pré-rempli</strong> par l&apos;administration à partir des données
              transmises par votre employeur. Mais vérifiez qu&apos;il correspond à vos bulletins de paie.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Erreurs fréquentes</h2>
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Montant pré-rempli incorrect :</strong> comparez avec la ligne « heures supplémentaires exonérées »
                  de votre bulletin de paie de décembre. En cas de changement d&apos;employeur, le cumul peut être erroné.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Dépassement du plafond :</strong> au-delà de 7 500 € net, les heures sup redeviennent imposables.
                  Vérifiez que la partie excédentaire est bien incluse en case 1AJ (salaires).
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Case vide :</strong> si la case 1GH est vide alors que vous avez fait des heures sup,
                  votre employeur n&apos;a peut-être pas transmis l&apos;information. Corrigez-la manuellement.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Qui est concerné ?</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Salariés du secteur privé et public</li>
              <li>Heures supplémentaires au-delà de la durée légale (35h)</li>
              <li>Heures complémentaires pour les temps partiels</li>
              <li>Jours de RTT monétisés (même régime depuis 2022)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.service-public.fr/particuliers/vosdroits/F390" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">service-public.fr — Heures supplémentaires →</a></li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Vérifiez votre déclaration pré-remplie</h2>
            <p className="text-blue-100 mb-6">Notre checklist vous aide à repérer les erreurs et oublis courants.</p>
            <Link href="/verification" className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold px-8 py-3 rounded-xl shadow-lg transition-all">
              Vérifier ma déclaration
            </Link>
          </section>

          <Disclaimer />
        </article>
      </main>
      <Footer />
    </>
  );
}
