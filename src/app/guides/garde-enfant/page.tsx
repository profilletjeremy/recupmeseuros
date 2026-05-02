import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Frais de garde d\u2019enfant : quelles cases v\u00e9rifier ? | R\u00e9cupMesEuros",
  description:
    "Cr\u00e9dit d\u2019imp\u00f4t de 50\u00a0% pour les frais de garde d\u2019enfant de moins de 6 ans : plafond 3\u00a0500\u00a0\u20ac, cr\u00e8che, assistante maternelle, cases 7GA/7GB/7GC.",
};

export default function GuideGardeEnfant() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Frais de garde d&apos;enfant : quelles cases v\u00e9rifier ?
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Si vous faites garder vos enfants de moins de 6 ans en dehors de votre
            domicile, vous b\u00e9n\u00e9ficiez d&apos;un{" "}
            <strong>cr\u00e9dit d&apos;imp\u00f4t de 50&nbsp;%</strong> des frais engag\u00e9s, dans la
            limite de 3&nbsp;500&nbsp;\u20ac par enfant.
          </p>

          {/* Principe */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe</h2>
            <p className="text-text-light mb-4">
              Le cr\u00e9dit d&apos;imp\u00f4t couvre <strong>50&nbsp;%</strong> des d\u00e9penses de garde
              d&apos;enfant <strong>hors du domicile</strong>. Comme il s&apos;agit d&apos;un cr\u00e9dit
              (et non d&apos;une simple r\u00e9duction), si le montant d\u00e9passe votre imp\u00f4t,
              vous \u00eates rembours\u00e9.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Conditions</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text-light">
                <li>L&apos;enfant doit avoir <strong>moins de 6 ans</strong> au 1er janvier 2025 (n\u00e9 apr\u00e8s le 31/12/2018)</li>
                <li>La garde doit avoir lieu <strong>hors du domicile</strong></li>
                <li>Les d\u00e9penses sont retenues <strong>apr\u00e8s d\u00e9duction des aides</strong> (CAF, employeur)</li>
              </ul>
            </div>
          </section>

          {/* Plafond */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Plafond et cr\u00e9dit maximum</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">3&nbsp;500&nbsp;\u20ac</p>
                  <p className="text-sm text-text-light">Plafond de d\u00e9penses par enfant</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">1&nbsp;750&nbsp;\u20ac</p>
                  <p className="text-sm text-text-light">Cr\u00e9dit d&apos;imp\u00f4t max par enfant</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              En cas de garde altern\u00e9e, le plafond est divis\u00e9 par deux (1&nbsp;750&nbsp;\u20ac de
              d\u00e9penses, soit 875&nbsp;\u20ac de cr\u00e9dit).
            </p>
          </section>

          {/* Modes de garde */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Modes de garde \u00e9ligibles</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li><strong>Cr\u00e8che collective</strong> ou micro-cr\u00e8che</li>
              <li><strong>Assistante maternelle agr\u00e9\u00e9e</strong></li>
              <li><strong>Garderie p\u00e9riscolaire</strong></li>
              <li><strong>Centre de loisirs</strong> sans h\u00e9bergement</li>
              <li><strong>Jardin d&apos;enfants</strong></li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">
              La garde \u00e0 domicile (baby-sitter, au pair) rel\u00e8ve du cr\u00e9dit d&apos;imp\u00f4t
              pour l&apos;emploi \u00e0 domicile (case 7DB), pas de ce dispositif.
            </p>
          </section>

          {/* D\u00e9duire la CAF */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">D\u00e9duire les aides de la CAF</h2>
            <p className="text-text-light mb-4">
              Vous devez imp\u00e9rativement <strong>soustraire les aides per\u00e7ues</strong> avant
              de reporter vos d\u00e9penses :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Compl\u00e9ment de libre choix du mode de garde (CMG) de la CAF/MSA</li>
              <li>Aide de l&apos;employeur (CESU pr\u00e9financ\u00e9, ch\u00e8ques vacances...)</li>
            </ul>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 mt-4">
              <p className="font-semibold mb-2">Exemple</p>
              <p className="text-sm text-text-light">
                Frais de cr\u00e8che : <strong>4&nbsp;200&nbsp;\u20ac</strong> / an. Aide CAF (CMG) :{" "}
                <strong>1&nbsp;500&nbsp;\u20ac</strong>. D\u00e9penses nettes : 4&nbsp;200 - 1&nbsp;500 ={" "}
                <strong>2&nbsp;700&nbsp;\u20ac</strong>. Cr\u00e9dit d&apos;imp\u00f4t : 2&nbsp;700 \u00d7 50&nbsp;% ={" "}
                <strong>1&nbsp;350&nbsp;\u20ac</strong>.
              </p>
            </div>
          </section>

          {/* Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases \u00e0 remplir (2042-RICI)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">Case</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-mono text-primary">7GA</td>
                    <td className="p-3 text-text-light">Frais de garde du 1er enfant \u00e0 charge</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7GB</td>
                    <td className="p-3 text-text-light">Frais de garde du 2\u00e8me enfant \u00e0 charge</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7GC</td>
                    <td className="p-3 text-text-light">Frais de garde du 3\u00e8me enfant \u00e0 charge (et suivants)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              En garde altern\u00e9e, utilisez les cases 7GE, 7GF et 7GG.
            </p>
          </section>

          {/* Sources */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.impots.gouv.fr/particulier/frais-de-garde-denfants"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr \u2014 Frais de garde d&apos;enfants \u2192
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr \u2014 Cr\u00e9dit d&apos;imp\u00f4t frais de garde \u2192
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Ne passez pas \u00e0 c\u00f4t\u00e9 de 1&nbsp;750&nbsp;\u20ac par enfant
            </h2>
            <p className="text-blue-100 mb-6">
              V\u00e9rifiez en quelques minutes si vos cases sont bien remplies.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
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
