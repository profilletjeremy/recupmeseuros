"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

/* ── Barème IR 2026 (revenus 2025) ── */

const TRANCHES = [
  { min: 0, max: 11294, taux: 0 },
  { min: 11294, max: 28797, taux: 0.11 },
  { min: 28797, max: 82341, taux: 0.30 },
  { min: 82341, max: 177106, taux: 0.41 },
  { min: 177106, max: Infinity, taux: 0.45 },
];

const TAUX_LABELS = ["0 %", "11 %", "30 %", "41 %", "45 %"];
const TAUX_COLORS = [
  "bg-gray-100 text-gray-600",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
  "bg-orange-100 text-orange-800",
  "bg-red-100 text-red-800",
];
const BAR_COLORS = [
  "bg-gray-300",
  "bg-green-400",
  "bg-amber-400",
  "bg-orange-400",
  "bg-red-400",
];

/* Plafond quotient familial : 1 759 € par demi-part */
const PLAFOND_QF = 1759;

/* Décote */
const DECOTE_SEUIL_SEUL = 1929;
const DECOTE_SEUIL_COUPLE = 3191;
const DECOTE_COEFF = 0.4525;

/* Réductions / crédits */
const TAUX_DONS = 0.66;
const TAUX_EMPLOI_DOMICILE = 0.50;

/* ── Calcul impôt par tranche (pour un quotient donné) ── */

function impotParQuotient(quotient: number) {
  let impot = 0;
  for (let i = 0; i < TRANCHES.length; i++) {
    const t = TRANCHES[i];
    const prevMax = i === 0 ? 0 : TRANCHES[i - 1].max;
    if (quotient <= prevMax) break;
    const base = Math.min(quotient, t.max) - prevMax;
    impot += base * t.taux;
  }
  return impot;
}

/* ── Détail des tranches pour affichage ── */

function trancheDetails(quotient: number) {
  const details: {
    taux: number;
    label: string;
    base: number;
    impot: number;
    color: string;
    barColor: string;
  }[] = [];
  let tmi = 0;
  let tmiIndex = 0;

  for (let i = 0; i < TRANCHES.length; i++) {
    const t = TRANCHES[i];
    const prevMax = i === 0 ? 0 : TRANCHES[i - 1].max;
    if (quotient <= prevMax) break;

    const base = Math.min(quotient, t.max) - prevMax;
    const impotTranche = Math.round(base * t.taux);

    details.push({
      taux: t.taux,
      label: TAUX_LABELS[i],
      base: Math.round(base),
      impot: impotTranche,
      color: TAUX_COLORS[i],
      barColor: BAR_COLORS[i],
    });

    if (t.taux > 0 && base > 0) {
      tmi = t.taux;
      tmiIndex = i;
    }
  }

  return { details, tmi, tmiIndex };
}

/* ── Calcul complet ── */

interface IRResult {
  parts: number;
  quotient: number;
  impotBrut: number;
  decote: number;
  reductionDons: number;
  creditEmploi: number;
  impotNet: number;
  tauxEffectif: number;
  tmi: number;
  tmiIndex: number;
  trancheDetails: ReturnType<typeof trancheDetails>["details"];
}

function calculateIR(
  revenuSalaire: number,
  revenuFoncier: number,
  situation: "seul" | "couple",
  enfants: number,
  enfantsGA: number,
  dons: number,
  emploiDomicile: number
): IRResult | null {
  const revenuTotal = revenuSalaire + revenuFoncier;
  if (revenuTotal <= 0) return null;

  /* Parts */
  const partsBase = situation === "couple" ? 2 : 1;
  const partsEnfants =
    enfants <= 2 ? enfants * 0.5 : 1 + (enfants - 2) * 1;
  const partsGA = enfantsGA <= 2 ? enfantsGA * 0.25 : 0.5 + (enfantsGA - 2) * 0.5;
  const parts = partsBase + partsEnfants + partsGA;

  /* Quotient familial */
  const quotient = revenuTotal / parts;

  /* Impôt sans plafonnement (avec toutes les parts) */
  const impotAvecParts = Math.round(impotParQuotient(quotient) * parts);

  /* Impôt de référence (parts de base uniquement) */
  const quotientRef = revenuTotal / partsBase;
  const impotRef = Math.round(impotParQuotient(quotientRef) * partsBase);

  /* Plafonnement QF : le gain ne peut excéder PLAFOND_QF par demi-part supplémentaire */
  const demiPartsSup = (parts - partsBase) * 2; // nb de demi-parts
  const gainMax = Math.round(PLAFOND_QF * demiPartsSup);
  const gainReel = impotRef - impotAvecParts;
  const impotApresPlafond =
    gainReel > gainMax ? impotRef - gainMax : impotAvecParts;

  const impotBrut = Math.max(0, impotApresPlafond);

  /* Décote */
  const seuilDecote =
    situation === "couple" ? DECOTE_SEUIL_COUPLE : DECOTE_SEUIL_SEUL;
  let decote = 0;
  if (impotBrut > 0 && impotBrut < seuilDecote) {
    decote = Math.round(seuilDecote - DECOTE_COEFF * impotBrut);
    if (decote < 0) decote = 0;
  }

  const impotApresDecote = Math.max(0, impotBrut - decote);

  /* Réductions */
  const reductionDons = Math.round(dons * TAUX_DONS);
  const impotApresReductions = Math.max(0, impotApresDecote - reductionDons);

  /* Crédit d'impôt emploi domicile */
  const creditEmploi = Math.round(emploiDomicile * TAUX_EMPLOI_DOMICILE);
  const impotNet = Math.max(0, impotApresReductions - creditEmploi);

  /* Taux effectif */
  const tauxEffectif =
    revenuTotal > 0 ? (impotNet / revenuTotal) * 100 : 0;

  /* Détails tranches (affichage basé sur le quotient effectif) */
  const quotientAffichage =
    gainReel > gainMax ? quotientRef : quotient;
  const { details, tmi, tmiIndex } = trancheDetails(quotientAffichage);

  return {
    parts,
    quotient: Math.round(quotientAffichage),
    impotBrut,
    decote,
    reductionDons,
    creditEmploi,
    impotNet,
    tauxEffectif,
    tmi,
    tmiIndex,
    trancheDetails: details,
  };
}

/* ── Composant ── */

export default function IRSimulator() {
  const [situation, setSituation] = useState<"seul" | "couple">("seul");
  const [revenu, setRevenu] = useState<number>(0);
  const [enfants, setEnfants] = useState<number>(0);
  const [enfantsGA, setEnfantsGA] = useState<number>(0);
  const [revenuFoncier, setRevenuFoncier] = useState<number>(0);
  const [dons, setDons] = useState<number>(0);
  const [emploiDomicile, setEmploiDomicile] = useState<number>(0);

  const result = useMemo(
    () =>
      calculateIR(
        revenu,
        revenuFoncier,
        situation,
        enfants,
        enfantsGA,
        dons,
        emploiDomicile
      ),
    [revenu, revenuFoncier, situation, enfants, enfantsGA, dons, emploiDomicile]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard"
          className="text-text-light hover:text-primary text-sm"
        >
          &larr; Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Simulateur d&apos;imp&ocirc;t sur le revenu 2026
      </h1>
      <p className="text-text-light mb-8">
        Estimez votre IR (revenus 2025) en tenant compte du bar&egrave;me, du
        quotient familial, de la d&eacute;cote et de vos r&eacute;ductions.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── Inputs ── */}
        <div className="space-y-5">
          {/* Situation */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Votre situation
            </label>
            <div className="flex gap-2">
              {(
                [
                  ["seul", "Seul(e)"],
                  ["couple", "Couple"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSituation(key)}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                    situation === key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Revenu net imposable */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Revenu net imposable du foyer
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={revenu || ""}
                onChange={(e) =>
                  setRevenu(Math.max(0, Number(e.target.value) || 0))
                }
                placeholder="Ex: 35000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">
                &euro;
              </span>
            </div>
          </div>

          {/* Enfants */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre d&apos;enfants &agrave; charge
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEnfants(n)}
                  className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                    enfants === n
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Enfants garde alternée */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Enfants en garde altern&eacute;e
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEnfantsGA(n)}
                  className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                    enfantsGA === n
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Revenus fonciers */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Revenus fonciers{" "}
              <span className="text-text-lighter font-normal">(optionnel)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={revenuFoncier || ""}
                onChange={(e) =>
                  setRevenuFoncier(Math.max(0, Number(e.target.value) || 0))
                }
                placeholder="0"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">
                &euro;
              </span>
            </div>
          </div>

          {/* Dons */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Dons aux associations{" "}
              <span className="text-text-lighter font-normal">(optionnel)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={dons || ""}
                onChange={(e) =>
                  setDons(Math.max(0, Number(e.target.value) || 0))
                }
                placeholder="0"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">
                &euro;
              </span>
            </div>
          </div>

          {/* Emploi domicile */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Emploi &agrave; domicile{" "}
              <span className="text-text-lighter font-normal">(optionnel)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={emploiDomicile || ""}
                onChange={(e) =>
                  setEmploiDomicile(Math.max(0, Number(e.target.value) || 0))
                }
                placeholder="0"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">
                &euro;
              </span>
            </div>
          </div>

          {/* Parts info */}
          {result && (
            <div className="bg-surface rounded-lg p-4 text-sm text-text-light space-y-1">
              <p>
                Nombre de parts :{" "}
                <strong className="text-text">{result.parts}</strong>
              </p>
              <p>
                Quotient familial :{" "}
                <strong className="text-text">
                  {result.quotient.toLocaleString("fr-FR")} &euro;
                </strong>
              </p>
            </div>
          )}
        </div>

        {/* ── Results ── */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-text-lighter">
                Renseignez votre revenu pour estimer votre imp&ocirc;t.
              </p>
            </div>
          ) : (
            <>
              {/* Impôt net estimé — big card */}
              <div className="rounded-xl p-6 border-2 border-primary bg-primary/5">
                <p className="text-sm font-medium mb-1 opacity-70">
                  Imp&ocirc;t net estim&eacute;
                </p>
                <p className="text-4xl font-bold text-primary mb-2">
                  {result.impotNet.toLocaleString("fr-FR")} &euro;
                </p>
                <p className="text-sm opacity-80">
                  {result.impotNet === 0
                    ? "Vous n’êtes pas imposable."
                    : `Après décote et réductions/crédits d’impôt.`}
                </p>
              </div>

              {/* Détail chiffres */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-text-light">
                    Imp&ocirc;t brut
                  </span>
                  <span className="font-mono font-bold">
                    {result.impotBrut.toLocaleString("fr-FR")} &euro;
                  </span>
                </div>
                {result.decote > 0 && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-text-light">
                      D&eacute;cote
                    </span>
                    <span className="font-mono font-bold text-green-600">
                      &minus; {result.decote.toLocaleString("fr-FR")} &euro;
                    </span>
                  </div>
                )}
                {result.reductionDons > 0 && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-text-light">
                      R&eacute;duction dons (66&nbsp;%)
                    </span>
                    <span className="font-mono font-bold text-green-600">
                      &minus;{" "}
                      {result.reductionDons.toLocaleString("fr-FR")} &euro;
                    </span>
                  </div>
                )}
                {result.creditEmploi > 0 && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-text-light">
                      Cr&eacute;dit emploi domicile (50&nbsp;%)
                    </span>
                    <span className="font-mono font-bold text-green-600">
                      &minus;{" "}
                      {result.creditEmploi.toLocaleString("fr-FR")} &euro;
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold">
                    Taux effectif d&apos;imposition
                  </span>
                  <span className="font-mono font-bold text-sm text-primary">
                    {result.tauxEffectif.toFixed(1)} %
                  </span>
                </div>
              </div>

              {/* Tranche marginale */}
              <div
                className={`rounded-xl p-5 border-2 ${TAUX_COLORS[result.tmiIndex]
                  .replace("text-", "border-")
                  .replace("100", "300")} ${
                  TAUX_COLORS[result.tmiIndex]
                    .replace("text-", "bg-")
                    .split(" ")[0]
                }`}
              >
                <p className="text-sm font-medium mb-1 opacity-70">
                  Tranche marginale
                </p>
                <p className="text-3xl font-bold">
                  {result.tmi === 0
                    ? "Non imposable"
                    : `${(result.tmi * 100).toFixed(0)} %`}
                </p>
              </div>

              {/* Visual bar chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-sm mb-3">
                  R&eacute;partition par tranche
                </h3>
                <div className="flex rounded-full overflow-hidden h-6 mb-4">
                  {result.trancheDetails
                    .filter((t) => t.base > 0)
                    .map((t, i) => {
                      const width =
                        (t.base / result.quotient) * 100;
                      return (
                        <div
                          key={i}
                          className={`${t.barColor} relative group`}
                          style={{ width: `${width}%` }}
                          title={`${t.label} : ${t.base.toLocaleString(
                            "fr-FR"
                          )} €`}
                        />
                      );
                    })}
                </div>

                <div className="space-y-2">
                  {result.trancheDetails
                    .filter((t) => t.base > 0)
                    .map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${t.color}`}
                        >
                          {t.label}
                        </span>
                        <span className="flex-1 text-text-light">
                          {t.base.toLocaleString("fr-FR")} &euro;
                        </span>
                        <span className="font-mono font-bold">
                          {t.impot.toLocaleString("fr-FR")} &euro;
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-sm text-green-800 mb-2">
                  Vous pouvez peut-&ecirc;tre &eacute;conomiser davantage
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  R&eacute;pondez &agrave; quelques questions pour d&eacute;couvrir
                  toutes les r&eacute;ductions et cr&eacute;dits d&apos;imp&ocirc;t
                  auxquels vous avez droit.
                </p>
                <Link
                  href="/questionnaire"
                  className="inline-block text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Analyser mes &eacute;conomies possibles
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}
