import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import AnimatedCounter from "@/components/AnimatedCounter";
import { ERREURS_FREQUENTES, CALENDRIER_FISCAL } from "@/data/taxRules2026";

const STEPS = [
  {
    icon: "1️⃣",
    title: "Sélectionnez votre profil",
    text: "Salarié, parent, retraité, propriétaire... Choisissez les profils qui vous correspondent.",
  },
  {
    icon: "2️⃣",
    title: "Répondez aux questions",
    text: "Quelques questions simples sur vos dépenses et votre situation. 5 minutes maximum.",
  },
  {
    icon: "3️⃣",
    title: "Découvrez vos opportunités",
    text: "L'assistant vous indique les avantages fiscaux à vérifier et les cases à remplir.",
  },
];

const OUBLIS = [
  {
    icon: "🏠",
    title: "Emploi à domicile",
    text: "Femme de ménage, jardinier, soutien scolaire... 50% de crédit d'impôt oublié par des millions de foyers.",
    saving: "jusqu'à 6 000 €/an",
  },
  {
    icon: "🚗",
    title: "Frais réels vs 10%",
    text: "Si vous faites plus de 30 km/jour, les frais réels sont souvent plus avantageux que l'abattement automatique.",
    saving: "plusieurs centaines d'€",
  },
  {
    icon: "❤️",
    title: "Dons aux associations",
    text: "Les reçus fiscaux s'accumulent dans un tiroir ? 66% à 75% de réduction d'impôt vous attendent.",
    saving: "66% à 75% récupérés",
  },
  {
    icon: "👶",
    title: "Frais de garde",
    text: "Crèche, assistante maternelle : le crédit d'impôt est souvent sous-estimé ou mal renseigné.",
    saving: "jusqu'à 1 750 €/enfant",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Pension alimentaire",
    text: "Aide à un enfant majeur ou à un parent : déductible du revenu imposable, souvent oubliée.",
    saving: "jusqu'à 6 674 €/enfant",
  },
  {
    icon: "⚡",
    title: "Borne de recharge",
    text: "Vous avez installé une borne électrique ? Crédit d'impôt de 75%, plafonné à 500 €.",
    saving: "jusqu'à 500 €",
  },
];

const FAQ = [
  {
    q: "Est-ce vraiment gratuit ?",
    a: "Oui, le questionnaire et les résultats sont entièrement gratuits. Aucune inscription n'est requise.",
  },
  {
    q: "Mes données sont-elles stockées ?",
    a: "Non. Toutes les réponses restent dans votre navigateur. Rien n'est envoyé à un serveur. Vous pouvez fermer la page et tout disparaît.",
  },
  {
    q: "Est-ce que ça remplace un comptable ?",
    a: "Non. RecupMesEuros est un assistant d'aide à la préparation basé sur les règles publiques. Pour les situations complexes (revenus fonciers, expatriation, etc.), consultez un professionnel.",
  },
  {
    q: "Les montants affichés sont-ils garantis ?",
    a: "Non. Les estimations sont indicatives et basées sur les informations que vous fournissez. Le montant réel dépend de votre situation fiscale complète.",
  },
  {
    q: "Quand dois-je déclarer mes impôts en 2026 ?",
    a: "La déclaration en ligne ouvre généralement mi-avril. Les dates limites varient selon votre département (fin mai à début juin). Consultez le calendrier ci-dessous.",
  },
  {
    q: "Que signifie le formulaire 2042-RICI ?",
    a: "C'est le formulaire complémentaire pour déclarer vos réductions et crédits d'impôt : dons, emploi à domicile, garde d'enfant, etc. Il s'ajoute automatiquement à votre déclaration en ligne.",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Découvrez les économies fiscales
              <br className="hidden md:block" /> que vous oubliez peut-être
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Répondez à quelques questions. L&apos;assistant vous indique les avantages
              fiscaux à vérifier et les cases concernées sur votre déclaration 2026.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Commencer le test gratuit
            </Link>
            <p className="text-blue-200 text-sm mt-4">
              Gratuit — Sans inscription — 5 minutes
            </p>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.title} className="text-center">
                  <span className="text-4xl mb-4 block">{step.icon}</span>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-text-light">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof counter */}
        <section className="py-12 bg-surface">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <AnimatedCounter target={847000} suffix=" €" />
                <p className="text-text-light text-sm mt-1">d&apos;économies détectées</p>
              </div>
              <div>
                <AnimatedCounter target={12400} suffix="" />
                <p className="text-text-light text-sm mt-1">analyses réalisées</p>
              </div>
              <div>
                <AnimatedCounter target={15} suffix=" avantages" />
                <p className="text-text-light text-sm mt-1">fiscaux vérifiés</p>
              </div>
            </div>
          </div>
        </section>

        {/* Oublis fréquents */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Les oublis les plus fréquents
            </h2>
            <p className="text-text-light text-center mb-12 max-w-2xl mx-auto">
              Chaque année, des millions de contribuables passent à côté d&apos;avantages
              fiscaux auxquels ils ont droit. En voici quelques-uns.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OUBLIS.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-light mb-3">{item.text}</p>
                  <span className="inline-block text-xs font-semibold text-secondary bg-green-50 px-3 py-1 rounded-full">
                    {item.saving}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Erreurs fréquentes */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Erreurs et oublis à éviter
            </h2>
            <p className="text-text-light text-center mb-12">
              Des pièges courants que même les déclarants expérimentés peuvent manquer.
            </p>
            <div className="space-y-4">
              {ERREURS_FREQUENTES.map((err) => (
                <div
                  key={err.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-1">{err.title}</h3>
                  <p className="text-sm text-text-light">{err.description}</p>
                  <a
                    href={err.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    En savoir plus →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calendrier fiscal */}
        <section className="py-16 bg-surface">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Calendrier fiscal 2026
            </h2>
            <p className="text-text-light text-center mb-8">
              Les dates clés pour la déclaration des revenus 2025.
            </p>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {CALENDRIER_FISCAL.map((item, i) => {
                const date = new Date(item.date);
                const formatted = date.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                const isPast = date < new Date();
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 ${isPast ? "opacity-50" : ""}`}
                  >
                    <span className="text-sm font-mono font-semibold text-primary whitespace-nowrap w-32">
                      {formatted}
                    </span>
                    <span className="text-sm text-text-light">{item.label}</span>
                    {isPast && (
                      <span className="ml-auto text-xs text-text-lighter">passé</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Glossaire rapide */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Le jargon fiscal en clair
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  term: "Crédit d'impôt",
                  def: "Somme déduite directement de votre impôt. Si le crédit dépasse votre impôt, le Trésor vous rembourse la différence.",
                },
                {
                  term: "Réduction d'impôt",
                  def: "Diminue votre impôt, mais ne peut pas créer de remboursement. Si vous ne payez pas d'impôt, vous ne bénéficiez pas de la réduction.",
                },
                {
                  term: "Déduction",
                  def: "Diminue votre revenu imposable (et non l'impôt directement). L'économie dépend de votre tranche marginale d'imposition (TMI).",
                },
                {
                  term: "TMI (Tranche Marginale)",
                  def: "Le taux d'imposition appliqué à la dernière tranche de vos revenus. En 2025 : 0%, 11%, 30%, 41% ou 45%.",
                },
                {
                  term: "Quotient familial",
                  def: "Système qui divise vos revenus par un nombre de parts (selon votre situation familiale) pour calculer l'impôt.",
                },
                {
                  term: "2042-RICI",
                  def: "Formulaire complémentaire pour déclarer réductions et crédits d'impôt (dons, emploi à domicile, garde enfant...).",
                },
              ].map((item) => (
                <div
                  key={item.term}
                  className="bg-surface rounded-lg p-4 border border-gray-100"
                >
                  <p className="font-semibold text-primary mb-1">{item.term}</p>
                  <p className="text-sm text-text-light">{item.def}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-surface">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="bg-white rounded-lg border border-gray-200 group"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-medium hover:text-primary">
                    {item.q}
                    <span className="text-text-lighter group-open:rotate-180 transition-transform ml-2">
                      ▾
                    </span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-text-light">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <Disclaimer />
          </div>
        </section>

        {/* Simulateurs gratuits */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Nos simulateurs gratuits
            </h2>
            <p className="text-text-light text-center mb-10 max-w-2xl mx-auto">
              Des outils interactifs pour optimiser votre déclaration, sans inscription.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/simulateurs/tmi"
                className="bg-surface rounded-xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3 block">📊</span>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                  Simulateur TMI
                </h3>
                <p className="text-sm text-text-light">
                  Calculez votre tranche marginale et visualisez la répartition de votre impôt.
                </p>
              </Link>
              <Link
                href="/simulateurs/frais-reels"
                className="bg-surface rounded-xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3 block">🚗</span>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                  Frais réels vs 10%
                </h3>
                <p className="text-sm text-text-light">
                  Comparez vos frais kilométriques, repas et télétravail avec l&apos;abattement forfaitaire.
                </p>
              </Link>
              <Link
                href="/simulateurs/rattachement-pension"
                className="bg-surface rounded-xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3 block">👨‍👩‍👧</span>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                  Rattachement ou pension ?
                </h3>
                <p className="text-sm text-text-light">
                  Enfant majeur : comparez le rattachement fiscal et la déduction de pension.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à vérifier votre déclaration ?
            </h2>
            <p className="text-blue-100 mb-8">
              5 minutes pour découvrir ce que vous oubliez peut-être.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Commencer le test gratuit
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
