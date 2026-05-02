import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Impôts à Mayotte : abattement DOM 40% | RécupMesEuros",
  description:
    "Guide complet sur l'abattement fiscal DOM de 40% à Mayotte : plafond 4 050 €, régime social spécifique, conditions de résidence et exemple chiffré.",
};

const faqData = [
  {
    question: "Pourquoi l'abattement est-il de 40% à Mayotte ?",
    answer:
      "Mayotte et la Guyane bénéficient d'un taux majoré de 40% (contre 30% pour la Martinique, la Guadeloupe et La Réunion) en raison d'un coût de la vie plus élevé et de contraintes géographiques spécifiques.",
  },
  {
    question: "Quel est le plafond de l'abattement à Mayotte ?",
    answer:
      "L'abattement de 40% est plafonné à 4 050 € par an et par foyer fiscal. Au-delà, l'excédent n'est pas déduit.",
  },
  {
    question: "Le régime social de Mayotte impacte-t-il l'abattement fiscal ?",
    answer:
      "Non, le régime social spécifique de Mayotte (convergence progressive avec le droit commun) n'affecte pas l'abattement fiscal DOM. L'abattement s'applique sur l'impôt sur le revenu indépendamment du régime social.",
  },
  {
    question: "L'abattement DOM est-il appliqué automatiquement par les impôts ?",
    answer:
      "Oui, si votre adresse fiscale est bien enregistrée à Mayotte, l'abattement est calculé automatiquement par l'administration. Vérifiez cependant que votre avis d'imposition mentionne bien l'abattement.",
  },
];

export default function ImpotsMayotte() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqData.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Impôts à Mayotte : abattement DOM de 40%
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Les contribuables domiciliés à <strong>Mayotte (976)</strong> bénéficient d&apos;un
            abattement automatique de <strong>40% sur leur impôt sur le revenu</strong>, plafonné à
            4 050 € par an. Mayotte dispose également d&apos;un régime social spécifique en cours
            de convergence avec le droit commun.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe de l&apos;abattement DOM</h2>
            <p className="text-text-light mb-4">
              L&apos;État accorde aux résidents des départements d&apos;outre-mer un abattement sur l&apos;impôt
              sur le revenu pour compenser le coût de la vie plus élevé. À Mayotte, cet abattement est
              de <strong>40%</strong> du montant de l&apos;impôt calculé, dans la limite de <strong>4 050 €</strong>.
              Ce taux majoré (contre 30% dans les autres DOM) reflète les contraintes spécifiques du territoire.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Exemple :</strong> Votre impôt sur le revenu calculé est de 8 000 € →
                Abattement de 40% = 3 200 € → Impôt final = <strong>4 800 €</strong>.
                L&apos;économie de 3 200 € est bien sous le plafond de 4 050 €, vous en profitez intégralement.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Conditions</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Être <strong>domicilié fiscalement à Mayotte au 31 décembre</strong> de l&apos;année d&apos;imposition</li>
              <li>Mayotte doit être votre <strong>résidence principale</strong></li>
              <li>L&apos;abattement s&apos;applique à l&apos;impôt sur le revenu (IR) uniquement</li>
              <li>Le plafond est de <strong>4 050 €</strong> par foyer fiscal</li>
              <li>L&apos;abattement est calculé <strong>automatiquement</strong> par l&apos;administration fiscale</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Plafond et calcul</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="text-text-light mb-2">
                <strong>Taux :</strong> 40% de l&apos;impôt sur le revenu
              </p>
              <p className="text-text-light mb-2">
                <strong>Plafond :</strong> 4 050 € par an
              </p>
              <p className="text-text-light">
                Si 40% de votre IR dépasse 4 050 €, l&apos;abattement sera limité à ce plafond.
                Par exemple, pour un IR de 12 000 €, 40% = 4 800 €, mais l&apos;abattement sera
                plafonné à <strong>4 050 €</strong>. Votre impôt final serait alors de 7 950 €.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Spécificité du régime social de Mayotte</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Note importante :</strong> Mayotte dispose d&apos;un régime de sécurité sociale
                spécifique, en cours de convergence progressive avec le droit commun métropolitain.
                Les cotisations sociales et certaines prestations peuvent différer. Toutefois, cela
                n&apos;impacte pas l&apos;abattement fiscal DOM qui s&apos;applique uniquement sur
                l&apos;impôt sur le revenu.
              </p>
            </div>
            <p className="text-text-light">
              La fiscalité mahoraise rejoint progressivement le droit commun depuis la départementalisation
              de 2011. L&apos;impôt sur le revenu y est désormais calculé selon les mêmes règles qu&apos;en
              métropole, avec l&apos;abattement DOM en plus.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases et déclaration</h2>
            <p className="text-text-light mb-4">
              L&apos;abattement DOM est appliqué <strong>automatiquement</strong> par l&apos;administration
              fiscale si votre adresse est bien enregistrée à Mayotte. Vous n&apos;avez pas de case
              spécifique à remplir. Vérifiez simplement que votre adresse fiscale est correcte sur
              votre déclaration de revenus.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Justificatifs de domicile</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Factures d&apos;énergie (EDM, eau) à votre adresse à Mayotte</li>
              <li>Avis de taxe foncière ou de taxe d&apos;habitation</li>
              <li>Attestation d&apos;assurance habitation</li>
              <li>Bail ou titre de propriété</li>
              <li>Relevés bancaires mentionnant votre adresse mahoraise</li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">Conservez ces documents <strong>3 ans</strong> en cas de contrôle.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Erreurs fréquentes</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li><strong>Adresse non mise à jour :</strong> si vous avez déménagé à Mayotte en cours d&apos;année, vérifiez que votre adresse au 31/12 est bien enregistrée</li>
              <li><strong>Confusion avec le taux des autres DOM :</strong> Mayotte bénéficie de 40% (et non 30% comme la Martinique, la Guadeloupe ou La Réunion)</li>
              <li><strong>Double domicile :</strong> si vous avez un logement en métropole et à Mayotte, c&apos;est le lieu de votre résidence principale au 31/12 qui compte</li>
              <li><strong>Confusion régime social / fiscal :</strong> le régime social spécifique de Mayotte n&apos;impacte pas l&apos;abattement fiscal DOM</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Questions fréquentes</h2>
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-text-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.service-public.fr/particuliers/vosdroits/F31410" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">service-public.fr — Abattement fiscal outre-mer →</a></li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Découvrez tous vos avantages fiscaux</h2>
            <p className="text-blue-100 mb-6">Notre assistant détecte automatiquement les abattements et crédits d&apos;impôt auxquels vous avez droit.</p>
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
