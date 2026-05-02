"use client";

import { useState } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

interface CheckPoint {
  id: string;
  category: string;
  categoryIcon: string;
  question: string;
  detail: string;
  action: string;
  link?: string;
}

const CHECKPOINTS: CheckPoint[] = [
  // Montants pré-remplis
  {
    id: "salaire",
    category: "Montants pré-remplis",
    categoryIcon: "🔍",
    question: "Vos salaires / pensions pré-remplis sont-ils corrects ?",
    detail: "Comparez avec vos bulletins de paie de décembre ou votre attestation employeur. Erreur fréquente en cas de changement d'employeur.",
    action: "Vérifiez cases 1AJ / 1BJ (salaires) ou 1AS / 1BS (pensions)",
  },
  {
    id: "heures_sup",
    category: "Montants pré-remplis",
    categoryIcon: "🔍",
    question: "Le montant de vos heures supplémentaires exonérées est-il pré-rempli ?",
    detail: "Jusqu'à 7 500 € par an sont exonérés d'impôt. Vérifiez que le montant apparaît bien en case 1GH.",
    action: "Case 1GH — montant exonéré heures supplémentaires",
  },
  {
    id: "pas_trop_percu",
    category: "Montants pré-remplis",
    categoryIcon: "🔍",
    question: "Votre situation a-t-elle changé en 2025 (chômage, temps partiel, congé) ?",
    detail: "Si oui, vous avez peut-être trop payé de prélèvement à la source. La régularisation se fera via cette déclaration.",
    action: "Vérifiez que le taux de PAS a bien été ajusté",
  },

  // Réductions / crédits
  {
    id: "emploi_domicile",
    category: "Crédits et réductions oubliés",
    categoryIcon: "💰",
    question: "Avez-vous payé quelqu'un pour un service à domicile ?",
    detail: "Ménage, jardinage, garde d'enfant à domicile, soutien scolaire, aide aux personnes... 50% de crédit d'impôt.",
    action: "Formulaire 2042-RICI, cases 7DB / 7DL / 7DQ",
    link: "/guides/emploi-a-domicile",
  },
  {
    id: "garde",
    category: "Crédits et réductions oubliés",
    categoryIcon: "💰",
    question: "Frais de garde d'enfants de moins de 6 ans (crèche, nounou) ?",
    detail: "50% de crédit d'impôt, plafonné à 3 500 € par enfant. N'oubliez pas de déduire l'aide CAF.",
    action: "Formulaire 2042-RICI, cases 7GA / 7GB / 7GC",
    link: "/guides/garde-enfant",
  },
  {
    id: "dons",
    category: "Crédits et réductions oubliés",
    categoryIcon: "💰",
    question: "Avez-vous fait des dons à des associations en 2025 ?",
    detail: "66% de réduction pour les associations classiques, 75% pour l'aide aux personnes en difficulté (plafond 2 000 €).",
    action: "Formulaire 2042-RICI, cases 7UF (66%) / 7UD (75%)",
    link: "/guides/dons",
  },
  {
    id: "syndicat",
    category: "Crédits et réductions oubliés",
    categoryIcon: "💰",
    question: "Cotisation syndicale versée ?",
    detail: "66% de crédit d'impôt sur le montant de la cotisation.",
    action: "Formulaire 2042-RICI, cases 7AC / 7AE",
  },
  {
    id: "scolarite",
    category: "Crédits et réductions oubliés",
    categoryIcon: "💰",
    question: "Avez-vous des enfants scolarisés (collège, lycée, études sup) ?",
    detail: "Réduction forfaitaire automatique : 61 € par collégien, 153 € par lycéen, 183 € par étudiant.",
    action: "Formulaire 2042-RICI, cases 7EA-7EG",
  },
  {
    id: "borne",
    category: "Crédits et réductions oubliés",
    categoryIcon: "💰",
    question: "Installation d'une borne de recharge électrique ?",
    detail: "75% de crédit d'impôt, plafonné à 500 € par borne.",
    action: "Formulaire 2042-RICI, cases 7ZQ / 7ZR",
  },
  {
    id: "per",
    category: "Crédits et réductions oubliés",
    categoryIcon: "💰",
    question: "Versements sur un PER (Plan Épargne Retraite) ?",
    detail: "Déductible du revenu imposable jusqu'à 10% de vos revenus (plafond ~35 000 €). Le plafond disponible figure sur votre avis d'imposition.",
    action: "Formulaire 2042, cases 6NS / 6NT / 6NU",
  },

  // Déductions
  {
    id: "frais_reels",
    category: "Déductions à vérifier",
    categoryIcon: "📋",
    question: "Vos frais professionnels dépassent-ils l'abattement de 10% ?",
    detail: "Si vous faites plus de 30 km/jour ou avez des frais importants (repas, double résidence), calculez vos frais réels.",
    action: "Case 1AK (montant frais réels)",
    link: "/simulateurs/frais-reels",
  },
  {
    id: "pension",
    category: "Déductions à vérifier",
    categoryIcon: "📋",
    question: "Aidez-vous financièrement un enfant majeur ou un parent ?",
    detail: "Pension à enfant majeur : déductible jusqu'à 6 674 €/enfant. Pension à ascendant : montant réel déductible.",
    action: "Cases 6EL / 6EM (enfant) ou 6GP / 6GU (ascendant)",
    link: "/guides/pension-alimentaire",
  },
  {
    id: "ehpad",
    category: "Déductions à vérifier",
    categoryIcon: "📋",
    question: "Frais d'EHPAD ou de dépendance payés ?",
    detail: "25% de réduction d'impôt sur les frais de dépendance (pas l'hébergement), plafond 10 000 €.",
    action: "Formulaire 2042-RICI, cases 7CD / 7CE",
  },

  // Vérifications finales
  {
    id: "situation_familiale",
    category: "Vérifications finales",
    categoryIcon: "✅",
    question: "Votre situation familiale est-elle à jour ?",
    detail: "Mariage, PACS, divorce, naissance en 2025 : vérifiez que la situation déclarative correspond.",
    action: "Page 1 de la déclaration — État civil",
  },
  {
    id: "rattachement",
    category: "Vérifications finales",
    categoryIcon: "✅",
    question: "Enfant majeur : rattachement ou déclaration séparée ?",
    detail: "Comparez le gain du rattachement (+0,5 part) avec la déduction d'une pension alimentaire.",
    action: "Utilisez notre simulateur pour comparer",
    link: "/simulateurs/rattachement-pension",
  },
  {
    id: "simulation",
    category: "Vérifications finales",
    categoryIcon: "✅",
    question: "Avez-vous lancé la simulation d'impôt avant de signer ?",
    detail: "Cliquez sur « Estimer mon impôt » en bas de la déclaration en ligne pour voir le montant avant validation.",
    action: "Bouton « Estimer mon impôt » en fin de déclaration",
  },
];

export default function VerificationClient() {
  const [checked, setChecked] = useState<Record<string, "oui" | "non" | "na">>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = [...new Set(CHECKPOINTS.map((c) => c.category))];
  const totalDone = Object.keys(checked).length;
  const totalPoints = CHECKPOINTS.length;
  const progress = Math.round((totalDone / totalPoints) * 100);
  const issues = Object.entries(checked).filter(([, v]) => v === "non").length;

  const mark = (id: string, value: "oui" | "non" | "na") => {
    setChecked((prev) => ({ ...prev, [id]: value }));
    setExpanded(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-text-light hover:text-primary text-sm">
          ← Retour à l&apos;accueil
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Vérifiez votre déclaration pré-remplie
      </h1>
      <p className="text-text-light mb-6">
        Vous avez déjà commencé sur impots.gouv.fr ? Parcourez cette checklist pour vous assurer de ne rien oublier.
      </p>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-light">
            {totalDone}/{totalPoints} points vérifiés
            {issues > 0 && (
              <span className="text-amber-600 font-medium ml-2">
                ({issues} point{issues > 1 ? "s" : ""} à revoir)
              </span>
            )}
          </span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checkpoints by category */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const items = CHECKPOINTS.filter((c) => c.category === cat);
          const catDone = items.filter((c) => checked[c.id]).length;
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <span>{items[0].categoryIcon}</span>
                <h2 className="font-bold text-sm">{cat}</h2>
                <span className="text-xs text-text-lighter ml-auto">{catDone}/{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((cp) => {
                  const status = checked[cp.id];
                  const isExpanded = expanded === cp.id;

                  return (
                    <div
                      key={cp.id}
                      className={`bg-white rounded-lg border transition-all ${
                        status === "oui"
                          ? "border-green-200 bg-green-50/30"
                          : status === "non"
                            ? "border-amber-200 bg-amber-50/30"
                            : status === "na"
                              ? "border-gray-200 opacity-60"
                              : "border-gray-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : cp.id)}
                        className="w-full text-left p-4 flex items-start gap-3"
                      >
                        <span className="mt-0.5 shrink-0">
                          {status === "oui" ? "✅" : status === "non" ? "⚠️" : status === "na" ? "⏭️" : "⬜"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${status === "oui" || status === "na" ? "line-through text-text-lighter" : ""}`}>
                            {cp.question}
                          </p>
                          <p className="text-xs text-primary font-mono mt-0.5">{cp.action}</p>
                        </div>
                        <span className={`text-text-lighter transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                          ▾
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-3 animate-fadeIn">
                          <p className="text-sm text-text-light mb-3">{cp.detail}</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => mark(cp.id, "oui")}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                status === "oui"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                            >
                              C&apos;est fait
                            </button>
                            <button
                              type="button"
                              onClick={() => mark(cp.id, "non")}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                status === "non"
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                            >
                              À vérifier
                            </button>
                            <button
                              type="button"
                              onClick={() => mark(cp.id, "na")}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50 text-text-lighter hover:bg-gray-100 transition-colors"
                            >
                              Non concerné
                            </button>
                            {cp.link && (
                              <Link
                                href={cp.link}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              >
                                En savoir plus →
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Result summary */}
      {progress === 100 && (
        <div className={`mt-8 rounded-xl p-6 text-center ${
          issues === 0
            ? "bg-green-50 border-2 border-green-300"
            : "bg-amber-50 border-2 border-amber-300"
        }`}>
          {issues === 0 ? (
            <>
              <span className="text-4xl block mb-2">🎉</span>
              <h3 className="text-lg font-bold text-green-800 mb-1">Tout semble en ordre !</h3>
              <p className="text-sm text-green-700">
                Vous avez vérifié tous les points. Vous pouvez signer votre déclaration en toute sérénité.
              </p>
            </>
          ) : (
            <>
              <span className="text-4xl block mb-2">⚠️</span>
              <h3 className="text-lg font-bold text-amber-800 mb-1">
                {issues} point{issues > 1 ? "s" : ""} à revoir
              </h3>
              <p className="text-sm text-amber-700 mb-4">
                Utilisez notre questionnaire complet pour analyser ces points en détail.
              </p>
              <Link
                href="/questionnaire"
                className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Lancer l&apos;analyse complète
              </Link>
            </>
          )}
        </div>
      )}

      {/* CTA */}
      {progress < 100 && (
        <div className="mt-8 bg-primary/5 border border-primary/10 rounded-xl p-5 text-center">
          <p className="text-sm text-text-light mb-3">
            Vous préférez une analyse complète et personnalisée ?
          </p>
          <Link
            href="/questionnaire"
            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Commencer le questionnaire complet
          </Link>
        </div>
      )}

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}
