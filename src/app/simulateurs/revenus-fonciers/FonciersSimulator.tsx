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
const PS_TAUX = 0.172;
const MICRO_ABATTEMENT = 0.30;
const MICRO_PLAFOND = 15000;
const DEFICIT_FONCIER_MAX = 10700;

function calcIR(revenu: number, parts: number) {
  const q = revenu / parts;
  let impot = 0;
  for (let i = 0; i < TRANCHES.length; i++) {
    const t = TRANCHES[i];
    const prev = i === 0 ? 0 : TRANCHES[i - 1].max;
    if (q <= prev) break;
    impot += (Math.min(q, t.max) - prev) * t.taux;
  }
  return Math.round(impot * parts);
}

export default function FonciersSimulator() {
  const [loyers, setLoyers] = useState(0);
  const [autresRevenus, setAutresRevenus] = useState(0);
  const [situation, setSituation] = useState<"seul" | "couple">("seul");
  const [enfants, setEnfants] = useState(0);

  // Charges réelles
  const [interets, setInterets] = useState(0);
  const [travaux, setTravaux] = useState(0);
  const [copro, setCopro] = useState(0);
  const [assurance, setAssurance] = useState(0);
  const [taxeFonciere, setTaxeFonciere] = useState(0);
  const [fraisGestion, setFraisGestion] = useState(0);
  const [autresCharges, setAutresCharges] = useState(0);
  const [showCharges, setShowCharges] = useState(false);

  const result = useMemo(() => {
    if (loyers <= 0) return null;

    const parts = (situation === "couple" ? 2 : 1) + (enfants <= 2 ? enfants * 0.5 : 1 + (enfants - 2));
    const totalCharges = interets + travaux + copro + assurance + taxeFonciere + fraisGestion + autresCharges;

    // ─── Micro-foncier ───
    const microDisponible = loyers <= MICRO_PLAFOND;
    const microNetFoncier = Math.round(loyers * (1 - MICRO_ABATTEMENT));
    const microRevenuGlobal = autresRevenus + microNetFoncier;
    const microIR = calcIR(microRevenuGlobal, parts) - calcIR(autresRevenus, parts);
    const microPS = Math.round(microNetFoncier * PS_TAUX);
    const microTotal = Math.max(0, microIR) + microPS;

    // ─── Régime réel ───
    const reelNetFoncier = loyers - totalCharges;
    let reelRevenuGlobal: number;
    let deficitImpute = 0;
    let deficitReporte = 0;

    if (reelNetFoncier < 0) {
      // Déficit foncier
      const deficitHorsInterets = Math.abs(reelNetFoncier) - interets;
      if (deficitHorsInterets > 0) {
        deficitImpute = Math.min(deficitHorsInterets, DEFICIT_FONCIER_MAX);
        deficitReporte = Math.abs(reelNetFoncier) - deficitImpute;
      }
      reelRevenuGlobal = Math.max(0, autresRevenus - deficitImpute);
    } else {
      reelRevenuGlobal = autresRevenus + reelNetFoncier;
    }

    const reelIRGlobal = calcIR(reelRevenuGlobal, parts);
    const reelIRSansLoc = calcIR(autresRevenus, parts);
    const reelIR = reelNetFoncier >= 0 ? reelIRGlobal - reelIRSansLoc : -(reelIRSansLoc - reelIRGlobal);
    const reelPS = reelNetFoncier > 0 ? Math.round(reelNetFoncier * PS_TAUX) : 0;
    const reelTotal = Math.max(0, reelIR) + reelPS;

    const bestOption = !microDisponible ? "reel" : reelTotal <= microTotal ? "reel" : "micro";
    const economie = Math.abs(microTotal - reelTotal);
    const chargesPct = loyers > 0 ? Math.round((totalCharges / loyers) * 100) : 0;

    return {
      parts,
      microDisponible,
      microNetFoncier,
      microIR: Math.max(0, microIR),
      microPS,
      microTotal,
      reelNetFoncier,
      reelIR: Math.max(0, reelIR < 0 ? 0 : reelIR),
      reelPS,
      reelTotal,
      totalCharges,
      deficitImpute,
      deficitReporte,
      bestOption,
      economie,
      chargesPct,
    };
  }, [loyers, autresRevenus, situation, enfants, interets, travaux, copro, assurance, taxeFonciere, fraisGestion, autresCharges]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
        ← Retour au dashboard
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        Simulateur revenus fonciers
      </h1>
      <p className="text-text-light mb-8">
        Comparez micro-foncier et régime réel pour vos revenus locatifs (location vide).
      </p>

      <div className="space-y-6">
        {/* ── Inputs ── */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Loyers bruts annuels</label>
            <div className="relative">
              <input
                type="number" inputMode="numeric" min={0}
                value={loyers || ""}
                onChange={(e) => setLoyers(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 12000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Autres revenus du foyer (hors foncier)</label>
            <div className="relative">
              <input
                type="number" inputMode="numeric" min={0}
                value={autresRevenus || ""}
                onChange={(e) => setAutresRevenus(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 35000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Situation</label>
            <div className="flex gap-2">
              {(["seul", "couple"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSituation(s)}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                    situation === s ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {s === "seul" ? "Seul(e)" : "Couple"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Enfants à charge</label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEnfants(n)}
                  className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                    enfants === n ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Charges réelles ── */}
        <div className="bg-white rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setShowCharges(!showCharges)}
            className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-sm">Charges réelles (régime réel)</span>
            <span className={`text-xl transition-transform ${showCharges ? "rotate-180" : ""}`}>▾</span>
          </button>
          {showCharges && (
            <div className="px-4 pb-4 grid md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              {[
                { label: "Intérêts d'emprunt", value: interets, set: setInterets },
                { label: "Travaux", value: travaux, set: setTravaux },
                { label: "Charges de copropriété", value: copro, set: setCopro },
                { label: "Assurance PNO", value: assurance, set: setAssurance },
                { label: "Taxe foncière", value: taxeFonciere, set: setTaxeFonciere },
                { label: "Frais de gestion", value: fraisGestion, set: setFraisGestion },
                { label: "Autres charges", value: autresCharges, set: setAutresCharges },
              ].map((c) => (
                <div key={c.label}>
                  <label className="block text-xs font-medium mb-1 text-text-light">{c.label}</label>
                  <div className="relative">
                    <input
                      type="number" inputMode="numeric" min={0}
                      value={c.value || ""}
                      onChange={(e) => c.set(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="0"
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-lighter text-xs">€</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {!result ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-text-lighter">Renseignez vos loyers pour comparer les régimes.</p>
          </div>
        ) : (
          <>
            {/* Side by side comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Micro-foncier */}
              <div className={`rounded-xl border-2 p-5 ${
                result.bestOption === "micro" && result.microDisponible ? "border-green-400 bg-green-50/30" : "border-gray-200 bg-white"
              } ${!result.microDisponible ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg">Micro-foncier</h3>
                  {result.bestOption === "micro" && result.microDisponible && (
                    <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">Meilleur choix</span>
                  )}
                </div>
                {!result.microDisponible && (
                  <p className="text-sm text-red-600 font-medium mb-2">Non disponible (loyers &gt; 15 000 €)</p>
                )}
                <div className="space-y-2 text-sm">
                  <Row label="Loyers bruts" value={`${loyers.toLocaleString("fr-FR")} €`} />
                  <Row label="Abattement 30 %" value={`-${Math.round(loyers * 0.3).toLocaleString("fr-FR")} €`} sub />
                  <Row label="Revenu net foncier" value={`${result.microNetFoncier.toLocaleString("fr-FR")} €`} bold />
                  <div className="border-t border-gray-100 pt-2">
                    <Row label="IR sur foncier" value={`${result.microIR.toLocaleString("fr-FR")} €`} />
                    <Row label="PS (17,2 %)" value={`${result.microPS.toLocaleString("fr-FR")} €`} />
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <Row label="Total impôt" value={`${result.microTotal.toLocaleString("fr-FR")} €`} bold />
                  </div>
                </div>
              </div>

              {/* Régime réel */}
              <div className={`rounded-xl border-2 p-5 ${
                result.bestOption === "reel" ? "border-green-400 bg-green-50/30" : "border-gray-200 bg-white"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg">Régime réel</h3>
                  {result.bestOption === "reel" && (
                    <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">Meilleur choix</span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <Row label="Loyers bruts" value={`${loyers.toLocaleString("fr-FR")} €`} />
                  <Row label="Charges déduites" value={`-${result.totalCharges.toLocaleString("fr-FR")} €`} sub />
                  <Row label="Revenu net foncier" value={`${result.reelNetFoncier.toLocaleString("fr-FR")} €`} bold />
                  {result.reelNetFoncier < 0 && (
                    <>
                      <Row label="Déficit imputé (revenu global)" value={`-${result.deficitImpute.toLocaleString("fr-FR")} €`} sub />
                      {result.deficitReporte > 0 && (
                        <Row label="Déficit reporté (10 ans)" value={`${result.deficitReporte.toLocaleString("fr-FR")} €`} sub />
                      )}
                    </>
                  )}
                  <div className="border-t border-gray-100 pt-2">
                    <Row label="IR sur foncier" value={`${result.reelIR.toLocaleString("fr-FR")} €`} />
                    <Row label="PS (17,2 %)" value={`${result.reelPS.toLocaleString("fr-FR")} €`} />
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <Row label="Total impôt" value={`${result.reelTotal.toLocaleString("fr-FR")} €`} bold />
                  </div>
                </div>
              </div>
            </div>

            {/* Economy */}
            {result.economie > 0 && result.microDisponible && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <p className="text-sm text-green-700">
                  Le <strong>{result.bestOption === "micro" ? "micro-foncier" : "régime réel"}</strong> vous fait économiser{" "}
                  <strong className="text-green-800 text-lg">{result.economie.toLocaleString("fr-FR")} €</strong> d&apos;impôt
                </p>
              </div>
            )}

            {/* Deficit info */}
            {result.reelNetFoncier < 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-sm text-blue-800 mb-2">Déficit foncier</h3>
                <p className="text-sm text-blue-700">
                  Vos charges dépassent vos loyers de <strong>{Math.abs(result.reelNetFoncier).toLocaleString("fr-FR")} €</strong>.
                  Jusqu&apos;à {DEFICIT_FONCIER_MAX.toLocaleString("fr-FR")} € peuvent être déduits de vos autres revenus (hors intérêts d&apos;emprunt).
                  Le surplus est reportable sur vos revenus fonciers des 10 prochaines années.
                </p>
              </div>
            )}

            {/* Charges bar */}
            {result.totalCharges > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-sm mb-3">Charges vs loyers</h3>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${result.chargesPct > 30 ? "bg-green-400" : "bg-amber-400"} rounded-l-full`}
                    style={{ width: `${Math.min(result.chargesPct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-text-lighter mt-1">
                  Charges = {result.chargesPct}% des loyers
                  {result.chargesPct > 30
                    ? " → le régime réel est probablement plus avantageux"
                    : " → le micro-foncier (30%) peut suffire"}
                </p>
              </div>
            )}

            {/* Tip */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2">Quand choisir le régime réel ?</h3>
              <ul className="text-sm text-text-light space-y-1">
                <li>- Vos charges réelles dépassent <strong>30 % des loyers</strong></li>
                <li>- Vous avez des <strong>travaux importants</strong> à déduire</li>
                <li>- Vous remboursez un <strong>emprunt immobilier</strong></li>
                <li>- Vous voulez créer un <strong>déficit foncier</strong></li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="font-bold text-sm text-green-800 mb-2">Optimisez votre déclaration</p>
              <p className="text-sm text-green-700 mb-3">
                Vérifiez tous vos avantages fiscaux en quelques minutes.
              </p>
              <Link
                href="/questionnaire"
                className="inline-block text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Analyser mes économies possibles
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex justify-between items-baseline ${sub ? "pl-4 text-text-lighter" : ""}`}>
      <span className={`text-sm ${bold ? "font-semibold" : ""}`}>{label}</span>
      <span className={`font-mono text-sm ${bold ? "font-bold text-primary" : ""}`}>{value}</span>
    </div>
  );
}
