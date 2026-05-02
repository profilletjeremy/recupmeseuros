import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Simulateurs fiscaux gratuits 2026 — RecupMesEuros",
  description:
    "11 simulateurs fiscaux gratuits : impôt sur le revenu, frais réels, micro-entrepreneur, PER, dons, quotient familial, plus-value immobilière, revenus fonciers.",
};

const SIMULATEURS = [
  { href: "/simulateurs/impot-revenu", icon: "💰", title: "Impôt sur le revenu", desc: "Estimez votre IR 2026 : barème progressif, décote, quotient familial, réductions et crédits d'impôt." },
  { href: "/simulateurs/tmi", icon: "📊", title: "Tranche marginale (TMI)", desc: "Calculez votre TMI et visualisez la répartition de votre impôt par tranche." },
  { href: "/simulateurs/frais-reels", icon: "🚗", title: "Frais réels", desc: "Frais kilométriques, repas, télétravail. Comparez avec l'abattement forfaitaire de 10%." },
  { href: "/simulateurs/micro-entrepreneur", icon: "🏪", title: "Micro-entrepreneur", desc: "Barème classique vs versement libératoire. Cotisations sociales, CFE et impôt." },
  { href: "/simulateurs/emploi-domicile", icon: "🏠", title: "Crédit emploi à domicile", desc: "Ménage, jardinage, garde d'enfants, soutien scolaire. Crédit d'impôt de 50%." },
  { href: "/simulateurs/per", icon: "🏦", title: "Plan Épargne Retraite (PER)", desc: "Économie d'impôt de vos versements PER selon votre TMI et votre plafond." },
  { href: "/simulateurs/dons", icon: "❤️", title: "Réduction pour dons", desc: "Dons aux associations (66%), aide aux personnes (75%), partis politiques." },
  { href: "/simulateurs/quotient-familial", icon: "👨‍👩‍👧‍👦", title: "Quotient familial", desc: "Impact du mariage, PACS, enfants, garde alternée et parent isolé sur l'impôt." },
  { href: "/simulateurs/rattachement-pension", icon: "👨‍👩‍👧", title: "Rattachement ou pension ?", desc: "Comparez le rattachement d'un enfant majeur vs la déduction d'une pension alimentaire." },
  { href: "/simulateurs/revenus-fonciers", icon: "🏘️", title: "Revenus fonciers", desc: "Micro-foncier vs régime réel. Déficit foncier et prélèvements sociaux." },
  { href: "/simulateurs/plus-value-immobiliere", icon: "🔑", title: "Plus-value immobilière", desc: "Taxe sur la plus-value : abattements par durée de détention, IR, PS et surtaxe." },
];

export default function SimulateursPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Simulateurs fiscaux gratuits
          </h1>
          <p className="text-text-light mb-8 text-lg">
            11 outils pour estimer votre impôt, comparer les régimes et optimiser votre déclaration 2026.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {SIMULATEURS.map((sim) => (
              <Link
                key={sim.href}
                href={sim.href}
                className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <span className="text-2xl mb-2 block">{sim.icon}</span>
                <h2 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {sim.title}
                </h2>
                <p className="text-sm text-text-light mb-3">{sim.desc}</p>
                <span className="text-sm text-primary font-medium">Lancer le simulateur →</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
            <h2 className="font-bold text-lg mb-2">Vous voulez aller plus loin ?</h2>
            <p className="text-text-light mb-4">
              Notre questionnaire analyse votre situation complète et détecte tous vos avantages fiscaux.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Analyser ma situation — Gratuit
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
