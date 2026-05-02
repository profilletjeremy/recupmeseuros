"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

/* ── Constants ──────────────────────────────────────────── */
const TAUX_CLASSIQUE = 0.66;
const TAUX_AIDE_PERSONNES = 0.75;
const PLAFOND_AIDE_75 = 2000;
const PLAFOND_GLOBAL_PCT = 0.20;
const PLAFOND_PARTIS = 15000;

/* ── Types ──────────────────────────────────────────────── */
interface CategoryResult {
  label: string;
  montant: number;
  tauxLabel: string;
  reduction: number;
  coutReel: number;
  detail?: string;
}

interface SimResult {
  categories: CategoryResult[];
  totalDons: number;
  totalReduction: number;
  plafondGlobal: number;
  plafondAtteint: boolean;
  exces: number;
}

/* ── Calculation ────────────────────────────────────────── */
function calculate(
  revenu: number,
  donsIG: number,
  donsAide: number,
  donsCultuels: number,
  donsPartis: number,
): SimResult {
  // Plafond partis politiques
  const partisEffectif = Math.min(donsPartis, PLAFOND_PARTIS);

  // Aide aux personnes: first 2000 at 75%, excess at 66%
  const aideAt75 = Math.min(donsAide, PLAFOND_AIDE_75);
  const aideExcess = Math.max(0, donsAide - PLAFOND_AIDE_75);
  const reductionAide = Math.round(aideAt75 * TAUX_AIDE_PERSONNES + aideExcess * TAUX_CLASSIQUE);

  // Other categories at 66%
  const reductionIG = Math.round(donsIG * TAUX_CLASSIQUE);
  const reductionCultuels = Math.round(donsCultuels * TAUX_CLASSIQUE);
  const reductionPartis = Math.round(partisEffectif * TAUX_CLASSIQUE);

  let totalReductionBrute = reductionAide + reductionIG + reductionCultuels + reductionPartis;
  const totalDons = donsIG + donsAide + donsCultuels + partisEffectif;

  // Plafond global: 20% du revenu imposable
  const plafondGlobal = Math.round(revenu * PLAFOND_GLOBAL_PCT);
  const plafondAtteint = totalDons > plafondGlobal && revenu > 0;
  let exces = 0;

  if (plafondAtteint) {
    // Scale down reduction proportionally
    const ratio = plafondGlobal / totalDons;
    totalReductionBrute = Math.round(totalReductionBrute * ratio);
    exces = totalDons - plafondGlobal;
  }

  const categories: CategoryResult[] = [];

  if (donsAide > 0) {
    const catReduction = plafondAtteint
      ? Math.round(reductionAide * (plafondGlobal / totalDons))
      : reductionAide;
    categories.push({
      label: "Aide aux personnes en difficulté",
      montant: donsAide,
      tauxLabel: donsAide > PLAFOND_AIDE_75 ? `75 % (≤ ${PLAFOND_AIDE_75.toLocaleString("fr-FR")} €) puis 66 %` : "75 %",
      reduction: catReduction,
      coutReel: donsAide - catReduction,
      detail: donsAide > PLAFOND_AIDE_75
        ? `${aideAt75.toLocaleString("fr-FR")} € à 75 % + ${aideExcess.toLocaleString("fr-FR")} € à 66 %`
        : undefined,
    });
  }

  if (donsIG > 0) {
    const catReduction = plafondAtteint
      ? Math.round(reductionIG * (plafondGlobal / totalDons))
      : reductionIG;
    categories.push({
      label: "Associations d'intérêt général",
      montant: donsIG,
      tauxLabel: "66 %",
      reduction: catReduction,
      coutReel: donsIG - catReduction,
    });
  }

  if (donsCultuels > 0) {
    const catReduction = plafondAtteint
      ? Math.round(reductionCultuels * (plafondGlobal / totalDons))
      : reductionCultuels;
    categories.push({
      label: "Organismes cultuels",
      montant: donsCultuels,
      tauxLabel: "66 %",
      reduction: catReduction,
      coutReel: donsCultuels - catReduction,
    });
  }

  if (partisEffectif > 0) {
    const catReduction = plafondAtteint
      ? Math.round(reductionPartis * (plafondGlobal / totalDons))
      : reductionPartis;
    categories.push({
      label: "Partis politiques",
      montant: partisEffectif,
      tauxLabel: "66 %",
      reduction: catReduction,
      coutReel: partisEffectif - catReduction,
      detail: donsPartis > PLAFOND_PARTIS
        ? `Plafonné à ${PLAFOND_PARTIS.toLocaleString("fr-FR")} € par personne`
        : undefined,
    });
  }

  return {
    categories,
    totalDons,
    totalReduction: totalReductionBrute,
    plafondGlobal,
    plafondAtteint,
    exces,
  };
}

/* ── Component ──────────────────────────────────────────── */
export default function DonsSimulator() {
  const [revenu, setRevenu] = useState<number>(0);
  const [donsIG, setDonsIG] = useState<number>(0);
  const [donsAide, setDonsAide] = useState<number>(0);
  const [donsCultuels, setDonsCultuels] = useState<number>(0);
  const [donsPartis, setDonsPartis] = useState<number>(0);

  const hasInput = donsIG > 0 || donsAide > 0 || donsCultuels > 0 || donsPartis > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    return calculate(revenu, donsIG, donsAide, donsCultuels, donsPartis);
  }, [revenu, donsIG, donsAide, donsCultuels, donsPartis, hasInput]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          ← Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Simulateur réduction d&apos;impôt — Dons
      </h1>
      <p className="text-text-light mb-8">
        Calculez votre réduction d&apos;impôt pour vos dons aux associations, aide aux personnes en difficulté, organismes cultuels et partis politiques.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── Inputs ── */}
        <div className="space-y-5">
          <InputField
            label="Revenu net imposable"
            value={revenu}
            onChange={setRevenu}
            placeholder="Ex: 35000"
            hint="Nécessaire pour calculer le plafond de 20 %"
          />

          <InputField
            label="Dons aide aux personnes en difficulté"
            value={donsAide}
            onChange={setDonsAide}
            placeholder="Ex: 500"
            hint="Restos du Coeur, Croix-Rouge, Secours populaire..."
          />

          <InputField
            label="Dons associations d'intérêt général"
            value={donsIG}
            onChange={setDonsIG}
            placeholder="Ex: 200"
            hint="Associations reconnues d'utilité publique, fondations..."
          />

          <InputField
            label="Dons organismes cultuels"
            value={donsCultuels}
            onChange={setDonsCultuels}
            placeholder="Ex: 100"
          />

          <InputField
            label="Dons partis politiques"
            value={donsPartis}
            onChange={setDonsPartis}
            placeholder="Ex: 500"
            hint={`Plafond ${PLAFOND_PARTIS.toLocaleString("fr-FR")} € par personne`}
          />
        </div>

        {/* ── Results ── */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-text-lighter">
                Renseignez vos dons pour calculer votre réduction d&apos;impôt.
              </p>
            </div>
          ) : (
            <>
              {/* Big number */}
              <div className="rounded-xl p-6 border-2 border-green-300 bg-green-50">
                <p className="text-sm font-medium mb-1 text-green-700">
                  Votre réduction d&apos;impôt totale
                </p>
                <p className="text-4xl font-bold text-green-800 mb-2">
                  {result.totalReduction.toLocaleString("fr-FR")} €
                </p>
                <p className="text-sm text-green-700">
                  Sur {result.totalDons.toLocaleString("fr-FR")} € de dons déclarés
                </p>
              </div>

              {/* Breakdown per category */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-bold text-sm">Détail par catégorie</h3>

                {result.categories.map((cat, i) => (
                  <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium">{cat.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                        {cat.tauxLabel}
                      </span>
                    </div>
                    {cat.detail && (
                      <p className="text-xs text-text-lighter mb-1">{cat.detail}</p>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-text-light">Donné</span>
                      <span className="font-mono">{cat.montant.toLocaleString("fr-FR")} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-light">Réduction</span>
                      <span className="font-mono text-green-700">
                        -{cat.reduction.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Coût réel</span>
                      <span className="font-mono text-primary">
                        {cat.coutReel.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual: pour 100€ */}
              {donsAide > 0 && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                  <h3 className="font-bold text-sm mb-2">Le saviez-vous ?</h3>
                  <p className="text-sm text-text-light">
                    Un don de <strong>100 €</strong> aux Restos du Coeur ne vous coûte que{" "}
                    <strong className="text-primary">25 €</strong> grâce à la réduction de 75 %.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: "75%" }} />
                    </div>
                    <span className="text-xs font-bold text-green-700">75 % récupéré</span>
                  </div>
                </div>
              )}

              {/* Plafond warning */}
              {result.plafondAtteint && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <h3 className="font-bold text-sm text-amber-800 mb-2">
                    Plafond de 20 % atteint
                  </h3>
                  <p className="text-sm text-amber-700">
                    Vos dons ({result.totalDons.toLocaleString("fr-FR")} €) dépassent le plafond de{" "}
                    {result.plafondGlobal.toLocaleString("fr-FR")} € (20 % de votre revenu imposable).
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    L&apos;excédent de <strong>{result.exces.toLocaleString("fr-FR")} €</strong> peut
                    être reporté sur les <strong>5 années suivantes</strong> dans les mêmes conditions.
                  </p>
                </div>
              )}

              {/* Generic visual for all dons */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-sm mb-3">Pour 100 € donnés, vous ne payez que :</h3>
                <div className="space-y-3">
                  <CostBar label="Aide aux personnes (75 %)" cost={25} />
                  <CostBar label="Associations / Cultuels / Partis (66 %)" cost={34} />
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/questionnaire"
                className="block text-center bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-colors"
              >
                Découvrir toutes mes économies possibles
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

/* ── Sub-components ─────────────────────────────────────── */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={value || ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          placeholder={placeholder}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
      </div>
      {hint && <p className="text-xs text-text-lighter mt-1">{hint}</p>}
    </div>
  );
}

function CostBar({ label, cost }: { label: string; cost: number }) {
  const recovered = 100 - cost;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-light">{label}</span>
        <span className="font-bold text-primary">{cost} €</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-4">
        <div className="bg-green-400" style={{ width: `${recovered}%` }} />
        <div className="bg-gray-200" style={{ width: `${cost}%` }} />
      </div>
      <div className="flex justify-between text-xs mt-0.5 text-text-lighter">
        <span>Récupéré : {recovered} €</span>
        <span>Coût réel : {cost} €</span>
      </div>
    </div>
  );
}
