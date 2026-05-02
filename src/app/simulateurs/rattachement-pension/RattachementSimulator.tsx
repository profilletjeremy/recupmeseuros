"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

// Barème IR 2025
const TRANCHES = [
  { max: 11294, taux: 0 },
  { max: 28797, taux: 0.11 },
  { max: 82341, taux: 0.30 },
  { max: 177106, taux: 0.41 },
  { max: Infinity, taux: 0.45 },
];

const PLAFOND_QF = 1759; // Plafond avantage demi-part
const PENSION_PLAFOND = 6674;

function calculateIR(revenuImposable: number, parts: number): number {
  const quotient = revenuImposable / parts;
  let impot = 0;
  let prev = 0;

  for (const tranche of TRANCHES) {
    if (quotient <= tranche.max) {
      impot += (quotient - prev) * tranche.taux;
      break;
    } else {
      impot += (tranche.max - prev) * tranche.taux;
      prev = tranche.max;
    }
  }

  return Math.round(impot * parts);
}

export default function RattachementSimulator() {
  const [revenu, setRevenu] = useState<number>(0);
  const [situation, setSituation] = useState<"seul" | "couple">("seul");
  const [pensionVersee, setPensionVersee] = useState<number>(0);
  const [enfantACharge, setEnfantACharge] = useState<number>(0);

  const result = useMemo(() => {
    if (revenu <= 0) return null;

    const partsBase = situation === "couple" ? 2 : 1;
    // Parts pour enfants déjà à charge (avant le majeur)
    const partsEnfants = enfantACharge <= 2 ? enfantACharge * 0.5 : 1 + (enfantACharge - 2) * 1;
    const partsActuelles = partsBase + partsEnfants;

    // Option 1: Rattachement (ajoute 0.5 part)
    const partsAvecRattachement = partsActuelles + 0.5;
    const irSansRattachement = calculateIR(revenu, partsActuelles);
    const irAvecRattachement = calculateIR(revenu, partsAvecRattachement);
    const gainRattachementBrut = irSansRattachement - irAvecRattachement;
    const gainRattachement = Math.min(gainRattachementBrut, PLAFOND_QF);

    // Option 2: Pension alimentaire déductible
    const pensionDeductible = Math.min(pensionVersee, PENSION_PLAFOND);
    const revenuApresPension = revenu - pensionDeductible;
    const irAvecPension = calculateIR(revenuApresPension, partsActuelles);
    const gainPension = irSansRattachement - irAvecPension;

    const meilleurChoix = gainRattachement >= gainPension ? "rattachement" : "pension";
    const ecart = Math.abs(gainRattachement - gainPension);

    return {
      irSansRien: irSansRattachement,
      gainRattachement,
      gainPension,
      pensionDeductible,
      meilleurChoix,
      ecart,
      partsActuelles,
      partsAvecRattachement,
      plafonne: gainRattachementBrut > PLAFOND_QF,
    };
  }, [revenu, situation, pensionVersee, enfantACharge]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          ← Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Rattachement ou pension alimentaire ?
      </h1>
      <p className="text-text-light mb-8">
        Comparez les deux options pour un enfant majeur et trouvez la plus avantageuse.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ─── Inputs ─── */}
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
                value={revenu || ""}
                onChange={(e) => setRevenu(Number(e.target.value) || 0)}
                placeholder="Ex: 45000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Enfants déjà à charge (hors l&apos;enfant majeur)
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEnfantACharge(n)}
                  className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                    enfantACharge === n
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Montant de pension versée à l&apos;enfant majeur
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={pensionVersee || ""}
                onChange={(e) => setPensionVersee(Number(e.target.value) || 0)}
                placeholder="Ex: 5000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€/an</span>
            </div>
            <p className="text-xs text-text-lighter mt-1">
              Plafond déductible : {PENSION_PLAFOND.toLocaleString("fr-FR")} € / enfant
            </p>
          </div>
        </div>

        {/* ─── Results ─── */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-text-lighter">Renseignez votre revenu pour voir la comparaison.</p>
            </div>
          ) : (
            <>
              {/* Option 1: Rattachement */}
              <div className={`rounded-xl p-5 border-2 transition-all ${
                result.meilleurChoix === "rattachement"
                  ? "bg-green-50 border-green-300"
                  : "bg-white border-gray-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Option 1 : Rattachement</h3>
                  {result.meilleurChoix === "rattachement" && (
                    <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                      Meilleur choix
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-light mb-3">
                  L&apos;enfant est rattaché à votre foyer fiscal ({result.partsActuelles} → {result.partsAvecRattachement} parts).
                </p>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm">Économie d&apos;impôt</span>
                  <span className="font-mono font-bold text-xl text-green-700">
                    {result.gainRattachement.toLocaleString("fr-FR")} €
                  </span>
                </div>
                {result.plafonne && (
                  <p className="text-xs text-amber-600 mt-1">
                    Plafonné à {PLAFOND_QF.toLocaleString("fr-FR")} € (plafond quotient familial)
                  </p>
                )}
              </div>

              {/* Option 2: Pension */}
              <div className={`rounded-xl p-5 border-2 transition-all ${
                result.meilleurChoix === "pension"
                  ? "bg-green-50 border-green-300"
                  : "bg-white border-gray-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Option 2 : Pension alimentaire</h3>
                  {result.meilleurChoix === "pension" && (
                    <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                      Meilleur choix
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-light mb-3">
                  Déduction de {result.pensionDeductible.toLocaleString("fr-FR")} € de votre revenu imposable.
                  {pensionVersee > PENSION_PLAFOND && (
                    <span className="text-amber-600"> (plafonné à {PENSION_PLAFOND.toLocaleString("fr-FR")} €)</span>
                  )}
                </p>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm">Économie d&apos;impôt</span>
                  <span className="font-mono font-bold text-xl text-green-700">
                    {result.gainPension.toLocaleString("fr-FR")} €
                  </span>
                </div>
                <p className="text-xs text-text-lighter mt-1">
                  L&apos;enfant doit déclarer cette pension de son côté.
                </p>
              </div>

              {/* Verdict */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5">
                <h3 className="font-bold text-primary mb-2">Verdict</h3>
                {result.meilleurChoix === "rattachement" ? (
                  <p className="text-sm">
                    Le <strong>rattachement</strong> est plus avantageux de{" "}
                    <strong className="text-green-700">{result.ecart.toLocaleString("fr-FR")} €</strong>.
                    L&apos;enfant n&apos;a pas à déclarer de revenus séparément.
                  </p>
                ) : (
                  <p className="text-sm">
                    La <strong>pension alimentaire</strong> est plus avantageuse de{" "}
                    <strong className="text-green-700">{result.ecart.toLocaleString("fr-FR")} €</strong>.
                    Attention : l&apos;enfant devra déclarer la pension comme revenu.
                  </p>
                )}
                {result.ecart < 100 && (
                  <p className="text-xs text-text-lighter mt-2">
                    L&apos;écart est faible. D&apos;autres facteurs peuvent jouer (aides sociales de l&apos;enfant, APL, etc.).
                  </p>
                )}
              </div>

              {/* Cases */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-sm mb-3">Comment déclarer ?</h3>
                {result.meilleurChoix === "rattachement" ? (
                  <ul className="text-sm text-text-light space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      L&apos;enfant signe une demande de rattachement
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      Cochez <strong>&quot;Personnes à charge&quot;</strong> dans votre déclaration
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      Renseignez les informations de l&apos;enfant majeur rattaché
                    </li>
                  </ul>
                ) : (
                  <ul className="text-sm text-text-light space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      Case <strong className="font-mono text-primary">6EL</strong> : montant de la pension
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      Formulaire <strong>2042</strong> (déclaration principale)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">→</span>
                      L&apos;enfant déclare la pension reçue dans sa propre déclaration
                    </li>
                  </ul>
                )}
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
