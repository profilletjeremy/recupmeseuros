"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

/* ── Barème IR 2026 (revenus 2025) ─────────────────────────── */

const TRANCHES = [
  { min: 0, max: 11294, taux: 0 },
  { min: 11294, max: 28797, taux: 0.11 },
  { min: 28797, max: 82341, taux: 0.30 },
  { min: 82341, max: 177106, taux: 0.41 },
  { min: 177106, max: Infinity, taux: 0.45 },
];

/** Plafond de l'avantage QF par demi-part supplémentaire */
const PLAFOND_QF = 1759;
/** Plafond spécial veuf(ve) avec enfants, 1re demi-part */
const PLAFOND_VEUF = 4024;

type Situation = "celibataire" | "marie" | "divorce" | "veuf";

const SITUATION_OPTIONS: { key: Situation; label: string }[] = [
  { key: "celibataire", label: "Celibataire" },
  { key: "marie", label: "Marie(e) / Pacse(e)" },
  { key: "divorce", label: "Divorce(e)" },
  { key: "veuf", label: "Veuf(ve)" },
];

/* ── Calcul IR pour un quotient donné ──────────────────────── */

function calculateIR(revenu: number, parts: number): number {
  const quotient = revenu / parts;
  let impotParPart = 0;

  for (let i = 0; i < TRANCHES.length; i++) {
    const t = TRANCHES[i];
    const prevMax = i === 0 ? 0 : TRANCHES[i - 1].max;
    if (quotient <= prevMax) break;
    const base = Math.min(quotient, t.max) - prevMax;
    impotParPart += base * t.taux;
  }

  return Math.round(impotParPart * parts);
}

/* ── Calcul des parts ──────────────────────────────────────── */

interface PartsBreakdown {
  label: string;
  value: number;
}

function computeParts(
  situation: Situation,
  enfants: number,
  gardeAlternee: number,
  handicap: number,
  parentIsole: boolean
): { total: number; breakdown: PartsBreakdown[] } {
  const breakdown: PartsBreakdown[] = [];

  // Base parts
  const base = situation === "marie" ? 2 : 1;
  breakdown.push({
    label: situation === "marie" ? "Couple (mariage/PACS)" : "Declarant",
    value: base,
  });

  // Children at full charge
  const enfantsPlein = Math.max(0, enfants - gardeAlternee);

  // Parts for full-charge children
  if (enfantsPlein > 0) {
    const first2 = Math.min(enfantsPlein, 2);
    const beyond2 = Math.max(0, enfantsPlein - 2);

    if (first2 > 0) {
      const val = first2 * 0.5;
      breakdown.push({
        label: `${first2} enfant${first2 > 1 ? "s" : ""} a charge (0.5 part)`,
        value: val,
      });
    }
    if (beyond2 > 0) {
      const val = beyond2 * 1;
      breakdown.push({
        label: `${beyond2} enfant${beyond2 > 1 ? "s" : ""} supplementaire${beyond2 > 1 ? "s" : ""} (1 part)`,
        value: val,
      });
    }
  }

  // Shared custody children
  if (gardeAlternee > 0) {
    // Shared custody children count half for the thresholds
    // We need to compute the additional parts they bring considering children already counted
    const totalChildrenSoFar = enfantsPlein;
    let gardeVal = 0;

    for (let i = 0; i < gardeAlternee; i++) {
      const childIndex = totalChildrenSoFar + i + 1; // 1-based child position
      const fullPart = childIndex <= 2 ? 0.5 : 1;
      gardeVal += fullPart / 2; // Half for shared custody
    }

    breakdown.push({
      label: `${gardeAlternee} enfant${gardeAlternee > 1 ? "s" : ""} en garde alternee (demi-parts divisees)`,
      value: gardeVal,
    });
  }

  // Handicap bonus: +0.5 per handicapped child
  if (handicap > 0) {
    breakdown.push({
      label: `${handicap} enfant${handicap > 1 ? "s" : ""} handicape${handicap > 1 ? "s" : ""} (+0.5)`,
      value: handicap * 0.5,
    });
  }

  // Parent isolé (case T): +0.5 part
  if (parentIsole && situation !== "marie") {
    breakdown.push({
      label: "Parent isole (case T)",
      value: 0.5,
    });
  }

  const total = breakdown.reduce((sum, b) => sum + b.value, 0);
  return { total, breakdown };
}

/* ── Plafonnement du QF ────────────────────────────────────── */

function computeIRWithPlafond(
  revenu: number,
  parts: number,
  situation: Situation,
  hasChildren: boolean
): { ir: number; plafonne: boolean } {
  // IR with quotient familial
  const irAvecQF = calculateIR(revenu, parts);

  // IR with only the base parts (no children, no parent isole)
  const baseParts = situation === "marie" ? 2 : 1;

  if (parts <= baseParts) {
    return { ir: irAvecQF, plafonne: false };
  }

  const irBase = calculateIR(revenu, baseParts);

  // Extra half-parts
  const extraDemiParts = (parts - baseParts) * 2; // number of demi-parts

  // For veuf with children, the first extra demi-part has a higher cap
  let plafondTotal: number;
  if (situation === "veuf" && hasChildren) {
    const firstDemiPartPlafond = PLAFOND_VEUF;
    const remainingDemiParts = Math.max(0, extraDemiParts - 1);
    plafondTotal = firstDemiPartPlafond + remainingDemiParts * PLAFOND_QF;
  } else {
    plafondTotal = extraDemiParts * PLAFOND_QF;
  }

  // The advantage from QF cannot exceed the cap
  const avantageQF = irBase - irAvecQF;
  if (avantageQF > plafondTotal) {
    return { ir: irBase - plafondTotal, plafonne: true };
  }

  return { ir: irAvecQF, plafonne: false };
}

/* ── Component ─────────────────────────────────────────────── */

export default function QuotientSimulator() {
  const [revenu, setRevenu] = useState<number>(0);
  const [situation, setSituation] = useState<Situation>("celibataire");
  const [parentIsole, setParentIsole] = useState(false);
  const [enfants, setEnfants] = useState(0);
  const [gardeAlternee, setGardeAlternee] = useState(0);
  const [handicap, setHandicap] = useState(0);

  const showParentIsole = situation !== "marie";
  const hasChildren = enfants > 0;

  // Cap garde alternee and handicap to enfants
  const effectiveGarde = Math.min(gardeAlternee, enfants);
  const effectiveHandicap = Math.min(handicap, enfants);

  const result = useMemo(() => {
    if (revenu <= 0) return null;

    const { total: parts, breakdown } = computeParts(
      situation,
      enfants,
      effectiveGarde,
      effectiveHandicap,
      parentIsole && showParentIsole
    );

    const quotient = Math.round(revenu / parts);
    const { ir, plafonne } = computeIRWithPlafond(revenu, parts, situation, hasChildren);

    // IR for a single person (1 part) to show the economy
    const irSeul = calculateIR(revenu, 1);
    const economie = irSeul - ir;

    // Impact table: adding/removing 1 child
    const impactTable: { enfantsCount: number; parts: number; ir: number }[] = [];
    for (let e = Math.max(0, enfants - 1); e <= Math.min(6, enfants + 2); e++) {
      const eg = Math.min(effectiveGarde, e);
      const eh = Math.min(effectiveHandicap, e);
      const { total: p } = computeParts(situation, e, eg, eh, parentIsole && showParentIsole);
      const { ir: impot } = computeIRWithPlafond(revenu, p, situation, e > 0);
      impactTable.push({ enfantsCount: e, parts: p, ir: impot });
    }

    return { parts, breakdown, quotient, ir, irSeul, economie, plafonne, impactTable };
  }, [revenu, situation, enfants, effectiveGarde, effectiveHandicap, parentIsole, showParentIsole, hasChildren]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          &larr; Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Simulateur de quotient familial
      </h1>
      <p className="text-text-light mb-8">
        Calculez vos parts fiscales et mesurez l&apos;economie d&apos;impot liee a votre situation familiale.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── Inputs ──────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Situation */}
          <div>
            <label className="block text-sm font-medium mb-1">Votre situation</label>
            <div className="grid grid-cols-2 gap-2">
              {SITUATION_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSituation(key);
                    if (key === "marie") setParentIsole(false);
                  }}
                  className={`py-3 rounded-lg border-2 font-medium text-sm transition-all ${
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

          {/* Parent isole */}
          {showParentIsole && (
            <div>
              <label className="block text-sm font-medium mb-1">Parent isole (case T)</label>
              <div className="flex gap-2">
                {([
                  [false, "Non"],
                  [true, "Oui"],
                ] as const).map(([val, label]) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setParentIsole(val)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                      parentIsole === val
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Revenu */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Revenu net imposable total du foyer
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={revenu || ""}
                onChange={(e) => setRevenu(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 45000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">&euro;</span>
            </div>
          </div>

          {/* Enfants */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre d&apos;enfants a charge
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setEnfants(n);
                    if (n < gardeAlternee) setGardeAlternee(n);
                    if (n < handicap) setHandicap(n);
                  }}
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

          {/* Garde alternee */}
          {enfants > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Dont enfants en garde alternee
              </label>
              <div className="flex gap-2">
                {Array.from({ length: enfants + 1 }, (_, i) => i).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGardeAlternee(n)}
                    className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                      effectiveGarde === n
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enfants handicapes */}
          {enfants > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Dont enfants handicapes
              </label>
              <div className="flex gap-2">
                {Array.from({ length: enfants + 1 }, (_, i) => i).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setHandicap(n)}
                    className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                      effectiveHandicap === n
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Parts summary */}
          {result && (
            <div className="bg-surface rounded-lg p-4 text-sm text-text-light space-y-1">
              <p>
                Nombre de parts : <strong className="text-text">{result.parts}</strong>
              </p>
              <p>
                Quotient familial :{" "}
                <strong className="text-text">{result.quotient.toLocaleString("fr-FR")} &euro;</strong>
              </p>
            </div>
          )}
        </div>

        {/* ── Results ─────────────────────────────────────── */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-text-lighter">
                Renseignez votre revenu pour calculer votre quotient familial.
              </p>
            </div>
          ) : (
            <>
              {/* Economy highlight */}
              <div className="rounded-xl p-6 border-2 border-green-300 bg-green-50">
                <p className="text-sm font-medium mb-1 text-green-700">
                  Economie grace au quotient familial
                </p>
                <p className="text-4xl font-bold text-green-800 mb-2">
                  {result.economie > 0
                    ? `${result.economie.toLocaleString("fr-FR")} \u20AC`
                    : "0 \u20AC"}
                </p>
                <p className="text-sm text-green-600">
                  {result.parts > 1
                    ? `Avec ${result.parts} parts au lieu d\u2019une seule, votre impot baisse de ${result.economie.toLocaleString("fr-FR")} \u20AC.`
                    : "Vous etes a 1 part. Le quotient familial n\u2019apporte pas de reduction supplementaire."}
                </p>
              </div>

              {/* Comparison */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <h3 className="font-bold text-sm">Comparaison</h3>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-text-light">IR sans quotient (1 part)</span>
                  <span className="font-mono font-bold text-lg text-text-light">
                    {result.irSeul.toLocaleString("fr-FR")} &euro;
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-text-light">
                    IR avec quotient ({result.parts} part{result.parts > 1 ? "s" : ""})
                  </span>
                  <span className="font-mono font-bold text-2xl text-primary">
                    {result.ir.toLocaleString("fr-FR")} &euro;
                  </span>
                </div>
                {result.plafonne && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                    Le plafonnement du quotient familial s&apos;applique a votre foyer.
                    L&apos;avantage est limite a {PLAFOND_QF.toLocaleString("fr-FR")} &euro; par demi-part supplementaire.
                  </p>
                )}
              </div>

              {/* Visual parts breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-sm mb-3">Detail de vos parts</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.breakdown.map((b, i) => {
                    // Show icons: full circle for each full part, half circle for 0.5, quarter for 0.25
                    const icons: string[] = [];
                    let remaining = b.value;
                    while (remaining >= 1) {
                      icons.push("\u25CF"); // full circle
                      remaining -= 1;
                    }
                    if (remaining >= 0.5) {
                      icons.push("\u25D0"); // half circle
                      remaining -= 0.5;
                    }
                    if (remaining >= 0.25) {
                      icons.push("\u25D4"); // quarter circle
                      remaining -= 0.25;
                    }
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="text-primary text-lg">{icons.join("")}</span>
                        <span className="text-text-light">
                          {b.value} &mdash; {b.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm font-bold text-text border-t border-gray-100 pt-2">
                  Total : {result.parts} part{result.parts > 1 ? "s" : ""}
                </div>
              </div>

              {/* Impact table */}
              {result.impactTable.length > 1 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-sm mb-3">Impact du nombre d&apos;enfants</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-text-lighter border-b border-gray-100">
                          <th className="pb-2 pr-4">Enfants</th>
                          <th className="pb-2 pr-4">Parts</th>
                          <th className="pb-2 text-right">IR estime</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.impactTable.map((row) => (
                          <tr
                            key={row.enfantsCount}
                            className={`border-b border-gray-50 ${
                              row.enfantsCount === enfants ? "bg-primary/5 font-bold" : ""
                            }`}
                          >
                            <td className="py-2 pr-4">{row.enfantsCount}</td>
                            <td className="py-2 pr-4">{row.parts}</td>
                            <td className="py-2 text-right font-mono">
                              {row.ir.toLocaleString("fr-FR")} &euro;
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Plafond QF info box */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                <h3 className="font-bold text-sm mb-2">Comment fonctionne le plafond du QF ?</h3>
                <ul className="text-sm text-text-light space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">1.</span>
                    <span>
                      L&apos;impot est d&apos;abord calcule avec votre nombre de parts (quotient familial).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">2.</span>
                    <span>
                      L&apos;administration compare avec l&apos;impot a parts de base
                      ({situation === "marie" ? "2 parts couple" : "1 part"}).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">3.</span>
                    <span>
                      Si la reduction depasse <strong>{PLAFOND_QF.toLocaleString("fr-FR")} &euro;</strong> par
                      demi-part supplementaire, elle est plafonnee.
                      {situation === "veuf" && hasChildren && (
                        <> Exception veuf(ve) avec enfants : <strong>{PLAFOND_VEUF.toLocaleString("fr-FR")} &euro;</strong> pour la 1re demi-part.</>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Tip parent isole */}
              {showParentIsole && hasChildren && !parentIsole && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <h3 className="font-bold text-sm text-amber-800 mb-2">
                    Etes-vous parent isole ?
                  </h3>
                  <p className="text-sm text-amber-700">
                    Si vous vivez seul(e) avec vos enfants, cochez la <strong>case T</strong> de
                    votre declaration. Cela vous accorde une <strong>demi-part supplementaire</strong> et
                    peut reduire significativement votre impot.
                  </p>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/questionnaire"
                className="block w-full text-center bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                Decouvrir toutes mes economies possibles
              </Link>
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
