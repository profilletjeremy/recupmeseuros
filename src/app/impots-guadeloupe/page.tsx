import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Impôts en Guadeloupe : abattement DOM 30% | RécupMesEuros",
  description:
    "Guide complet sur l'abattement fiscal DOM de 30% en Guadeloupe : plafond 2 450 €, conditions de résidence, exemple chiffré et erreurs fréquentes.",
};

const faqData = [
  {
    question: "Quel est le montant de l'abattement fiscal en Guadeloupe ?",
    answer:
      "Les contribuables domiciliés en Guadeloupe (971) bénéficient d'un abattement de 30% sur leurs revenus imposables, plafonné à 2 450 € par an.",
  },
  {
    question: "Faut-il habiter en Guadeloupe toute l'année pour en bénéficier ?",
    answer:
      "Non, il faut être domicilié fiscalement en Guadeloupe au 31 décembre de l'année d'imposition. C'est votre résidence principale au 31/12 qui détermine votre éligibilité.",
  },
  {
    question: "Quels justificatifs fournir pour prouver sa résidence en Guadeloupe ?",
    answer:
      "Vous devez pouvoir présenter des justificatifs de domicile : factures d'énergie, avis de taxe foncière ou d'habitation, attestation d'assurance habitation, bail ou titre de propriété en Guadeloupe.",
  },
  {
    question: "L'abattement DOM est-il appliqué automatiquement par les impôts ?",
    answer:
      "Oui, si votre adresse fiscale est bien enregistrée en Guadeloupe, l'abattement est calculé automatiquement par l'administration. Vérifiez cependant que votre avis d'imposition mentionne bien l'abattement.",
  },
];

export default function ImpotsGuadeloupe() {
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
            Impôts en Guadeloupe : abattement DOM de 30%
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Les contribuables domiciliés en <strong>Guadeloupe (971)</strong> bénéficient d&apos;un
            abattement automatique de <strong>30% sur leur impôt sur le revenu</strong>, plafonné à
            2 450 € par an. Voici tout ce qu&apos;il faut savoir pour en profiter.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe de l&apos;abattement DOM</h2>
            <p className="text-text-light mb-4">
              L&apos;État accorde aux résidents des départements d&apos;outre-mer un abattement sur l&apos;impôt
              sur le revenu pour compenser le coût de la vie plus élevé. En Guadeloupe, cet abattement est
              de <strong>30%</strong> du montant de l&apos;impôt calculé, dans la limite de <strong>2 450 €</strong>.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Exemple :</strong> Votre impôt sur le revenu calculé est de 5 000 € →
                Abattement de 30% = 1 500 € → Impôt final = <strong>3 500 €</strong>.
                L&apos;économie de 1 500 € est bien sous le plafond de 2 450 €, vous en profitez intégralement.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Conditions</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Être <strong>domicilié fiscalement en Guadeloupe au 31 décembre</strong> de l&apos;année d&apos;imposition</li>
              <li>La Guadeloupe doit être votre <strong>résidence principale</strong></li>
              <li>L&apos;abattement s&apos;applique à l&apos;impôt sur le revenu (IR) uniquement</li>
              <li>Le plafond est de <strong>2 450 €</strong> par foyer fiscal</li>
              <li>L&apos;abattement est calculé <strong>automatiquement</strong> par l&apos;administration fiscale</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Plafond et calcul</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="text-text-light mb-2">
                <strong>Taux :</strong> 30% de l&apos;impôt sur le revenu
              </p>
              <p className="text-text-light mb-2">
                <strong>Plafond :</strong> 2 450 € par an
              </p>
              <p className="text-text-light">
                Si 30% de votre IR dépasse 2 450 €, l&apos;abattement sera limité à ce plafond.
                Par exemple, pour un IR de 10 000 €, 30% = 3 000 €, mais l&apos;abattement sera
                plafonné à <strong>2 450 €</strong>.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases et déclaration</h2>
            <p className="text-text-light mb-4">
              L&apos;abattement DOM est appliqué <strong>automatiquement</strong> par l&apos;administration
              fiscale si votre adresse est bien enregistrée en Guadeloupe. Vous n&apos;avez pas de case
              spécifique à remplir. Vérifiez simplement que votre adresse fiscale est correcte sur
              votre déclaration de revenus.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Justificatifs de domicile</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Factures d&apos;énergie (EDF, eau) à votre adresse en Guadeloupe</li>
              <li>Avis de taxe foncière ou de taxe d&apos;habitation</li>
              <li>Attestation d&apos;assurance habitation</li>
              <li>Bail ou titre de propriété</li>
              <li>Relevés bancaires mentionnant votre adresse guadeloupéenne</li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">Conservez ces documents <strong>3 ans</strong> en cas de contrôle.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Erreurs fréquentes</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li><strong>Adresse non mise à jour :</strong> si vous avez déménagé en Guadeloupe en cours d&apos;année, vérifiez que votre adresse au 31/12 est bien enregistrée</li>
              <li><strong>Confusion avec les réductions d&apos;impôt :</strong> l&apos;abattement DOM s&apos;applique sur l&apos;IR brut, avant les réductions et crédits d&apos;impôt</li>
              <li><strong>Double domicile :</strong> si vous avez un logement en métropole et en Guadeloupe, c&apos;est le lieu de votre résidence principale au 31/12 qui compte</li>
              <li><strong>Oubli de vérification :</strong> ne pas vérifier sur l&apos;avis d&apos;imposition que l&apos;abattement a bien été appliqué</li>
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
