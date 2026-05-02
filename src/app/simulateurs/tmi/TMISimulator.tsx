"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

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

function calculateIRDetail(revenuImposable: number, parts: number) {
  const quotient = revenuImposable / parts;
  const trancheDetails: {
    taux: number;
    label: string;
    base: number;
    impot: number;
    color: string;
    barColor: string;
  }[] = [];
  let totalImpot = 0;
  let tmi = 0;
  let tmiIndex = 0;

  for (let i = 0; i < TRANCHES.length; i++) {
    const t = TRANCHES[i];
    const prevMax = i === 0 ? 0 : TRANCHES[i - 1].max;
    if (quotient <= prevMax) break;

    const base = Math.min(quotient, t.max) - prevMax;
    const impotTranche = Math.round(base * t.taux);

    trancheDetails.push({
      taux: t.taux,
      label: TAUX_LABELS[i],
      base: Math.round(base),
      impot: impotTranche,
      color: TAUX_COLORS[i],
      barColor: BAR_COLORS[i],
    });

    totalImpot += impotTranche;
    if (t.taux > 0 && base > 0) {
      tmi = t.taux;
      tmiIndex = i;
    }
  }

  const impotTotal = Math.round(totalImpot * parts);
  const tauxEffectif = revenuImposable > 0 ? (impotTotal / revenuImposable) * 100 : 0;

  return {
    quotient: Math.round(quotient),
    trancheDetails,
    impotParPart: Math.round(totalImpot),
    impotTotal,
    tmi,
    tmiIndex,
    tauxEffectif,
    parts,
  };
}

export default function TMISimulator() {
  const [revenu, setRevenu] = useState<number>(0);
  const [situation, setSituation] = useState<"seul" | "couple">("seul");
  const [enfants, setEnfants] = useState<number>(0);

  const result = useMemo(() => {
    if (revenu <= 0) return null;

    const partsBase = situation === "couple" ? 2 : 1;
    const partsEnfants = enfants <= 2 ? enfants * 0.5 : 1 + (enfants - 2) * 1;
    const parts = partsBase + partsEnfants;

    return calculateIRDetail(revenu, parts);
  }, [revenu, situation, enfants]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          ← Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Simulateur de tranche marginale d&apos;imposition (TMI)
      </h1>
      <p className="text-text-light mb-8">
        Calculez votre TMI, votre impôt et visualisez la répartition par tranche.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Votre situation</label>
            <div className="flex gap-2">
              {([
                ["seul", "Seul(e)"],
                ["couple", "Couple"],
              ] as const).map(([key, label]) => (
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
                onChange={(e) => setRevenu(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 35000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre d&apos;enfants à charge
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

          {result && (
            <div className="bg-surface rounded-lg p-4 text-sm text-text-light space-y-1">
              <p>Nombre de parts : <strong className="text-text">{result.parts}</strong></p>
              <p>Quotient familial : <strong className="text-text">{result.quotient.toLocaleString("fr-FR")} €</strong></p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-text-lighter">Renseignez votre revenu pour calculer votre TMI.</p>
            </div>
          ) : (
            <>
              {/* TMI highlight */}
              <div className={`rounded-xl p-6 border-2 ${TAUX_COLORS[result.tmiIndex].replace("text-", "border-").replace("100", "300")} ${TAUX_COLORS[result.tmiIndex].replace("text-", "bg-").split(" ")[0]}`}>
                <p className="text-sm font-medium mb-1 opacity-70">Votre tranche marginale</p>
                <p className="text-4xl font-bold mb-2">
                  {result.tmi === 0 ? "Non imposable" : `${(result.tmi * 100).toFixed(0)} %`}
                </p>
                <p className="text-sm opacity-80">
                  {result.tmi === 0
                    ? "Votre revenu est en dessous du seuil d'imposition."
                    : `Chaque euro supplémentaire gagné sera imposé à ${(result.tmi * 100).toFixed(0)}%.`}
                </p>
              </div>

              {/* Impôt total */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-text-light">Impôt sur le revenu estimé</span>
                  <span className="font-mono font-bold text-2xl text-primary">
                    {result.impotTotal.toLocaleString("fr-FR")} €
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-lighter">Taux effectif d&apos;imposition</span>
                  <span className="font-mono font-bold text-sm text-text-light">
                    {result.tauxEffectif.toFixed(1)} %
                  </span>
                </div>
              </div>

              {/* Visual bar */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-sm mb-3">Répartition par tranche</h3>
                <div className="flex rounded-full overflow-hidden h-6 mb-4">
                  {result.trancheDetails
                    .filter((t) => t.base > 0)
                    .map((t, i) => {
                      const width = (t.base / result.quotient) * 100;
                      return (
                        <div
                          key={i}
                          className={`${t.barColor} relative group`}
                          style={{ width: `${width}%` }}
                          title={`${t.label} : ${t.base.toLocaleString("fr-FR")} €`}
                        />
                      );
                    })}
                </div>

                <div className="space-y-2">
                  {result.trancheDetails
                    .filter((t) => t.base > 0)
                    .map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${t.color}`}>
                          {t.label}
                        </span>
                        <span className="flex-1 text-text-light">
                          {t.base.toLocaleString("fr-FR")} €
                        </span>
                        <span className="font-mono font-bold">
                          {t.impot.toLocaleString("fr-FR")} €
                        </span>
                      </div>
                    ))}
                  <div className="border-t border-gray-100 pt-2 flex items-center gap-3 text-sm">
                    <span className="text-xs font-bold px-2 py-0.5">TOTAL</span>
                    <span className="flex-1 text-text-light">
                      par part : {result.impotParPart.toLocaleString("fr-FR")} €
                    </span>
                    <span className="font-mono font-bold text-primary">
                      × {result.parts} = {result.impotTotal.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Explication */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                <h3 className="font-bold text-sm mb-2">TMI vs taux effectif : quelle différence ?</h3>
                <ul className="text-sm text-text-light space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">TMI</span>
                    <span>Le taux de la <strong>dernière tranche</strong> atteinte. C&apos;est le taux appliqué à chaque euro supplémentaire. Utile pour calculer le gain réel d&apos;une déduction.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">Taux effectif</span>
                    <span>L&apos;impôt total divisé par le revenu. C&apos;est le &quot;vrai&quot; taux moyen que vous payez. Toujours inférieur à la TMI.</span>
                  </li>
                </ul>
              </div>

              {/* Tip */}
              {result.tmi >= 0.30 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="font-bold text-sm text-green-800 mb-2">
                    Avec une TMI à {(result.tmi * 100).toFixed(0)}%, pensez à :
                  </h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>- <strong>PER</strong> : chaque 1 000 € versé vous fait économiser {(result.tmi * 1000).toFixed(0)} € d&apos;impôt</li>
                    <li>- <strong>Dons</strong> : réduction de 66% (associations) ou 75% (aide aux personnes)</li>
                    <li>- <strong>Frais réels</strong> : vérifiez si ils dépassent l&apos;abattement de 10%</li>
                  </ul>
                  <Link
                    href="/questionnaire"
                    className="inline-block mt-3 text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                  >
                    Analyser mes économies possibles
                  </Link>
                </div>
              )}
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
