"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { calculateFraisKm, calculateAbattement10 } from "@/lib/engine";
import * as rules from "@/data/taxRules2026";
import Disclaimer from "@/components/Disclaimer";

export default function FraisReelsSimulator() {
  const [kmAllerRetour, setKmAllerRetour] = useState<number>(0);
  const [jours, setJours] = useState<number>(220);
  const [cv, setCv] = useState<number>(5);
  const [electrique, setElectrique] = useState(false);
  const [repas, setRepas] = useState(false);
  const [teletravail, setTeletravail] = useState(false);
  const [joursTT, setJoursTT] = useState<number>(50);
  const [salaire, setSalaire] = useState<number>(0);

  const result = useMemo(() => {
    let totalFraisReels = 0;
    const breakdown: { label: string; amount: number; detail: string }[] = [];

    // Km
    if (kmAllerRetour > 0) {
      const kmAnnuel = kmAllerRetour * jours;
      const fraisKm = calculateFraisKm(kmAnnuel, cv, electrique);
      totalFraisReels += fraisKm;
      breakdown.push({
        label: "Frais kilométriques",
        amount: fraisKm,
        detail: `${kmAllerRetour} km/jour × ${jours} jours = ${kmAnnuel.toLocaleString("fr-FR")} km/an — ${cv} CV ${electrique ? "(électrique +20%)" : ""}`,
      });
    }

    // Repas
    if (repas) {
      const joursRepas = jours;
      const fraisRepas = Math.round(rules.REPAS_DEDUCTION_PAR_JOUR * joursRepas);
      totalFraisReels += fraisRepas;
      breakdown.push({
        label: "Frais de repas",
        amount: fraisRepas,
        detail: `${rules.REPAS_DEDUCTION_PAR_JOUR.toFixed(2)} €/jour × ${joursRepas} jours (plafond ${rules.REPAS_PLAFOND_PAR_JOUR} € − forfait ${rules.REPAS_FORFAIT_PAR_JOUR} €)`,
      });
    }

    // Télétravail
    if (teletravail) {
      const fraisTT = Math.min(
        Math.round(joursTT * rules.TELETRAVAIL_FORFAIT_JOUR),
        rules.TELETRAVAIL_PLAFOND_ANNUEL
      );
      totalFraisReels += fraisTT;
      breakdown.push({
        label: "Télétravail",
        amount: fraisTT,
        detail: `${rules.TELETRAVAIL_FORFAIT_JOUR} €/jour × ${joursTT} jours (plafond ${rules.TELETRAVAIL_PLAFOND_ANNUEL} €/an)`,
      });
    }

    const abattement10 = salaire > 0 ? calculateAbattement10(salaire) : 0;
    const delta = totalFraisReels - abattement10;
    const isWorth = delta > 0 && salaire > 0;

    return { totalFraisReels, abattement10, delta, isWorth, breakdown };
  }, [kmAllerRetour, jours, cv, electrique, repas, teletravail, joursTT, salaire]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          ← Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">Simulateur frais réels</h1>
      <p className="text-text-light mb-8">
        Calculez vos frais professionnels et comparez avec l&apos;abattement forfaitaire de 10%.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ─── Inputs ─── */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Distance domicile-travail (aller-retour)</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={kmAllerRetour || ""}
                onChange={(e) => setKmAllerRetour(Number(e.target.value) || 0)}
                placeholder="Ex: 40"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">km</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jours travaillés sur site</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={jours}
                onChange={(e) => setJours(Number(e.target.value) || 0)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">jours</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Puissance fiscale</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCv(n)}
                  className={`flex-1 py-2 rounded-lg border-2 font-mono font-bold transition-all ${
                    cv === n ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {n} CV
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
            <input
              type="checkbox"
              checked={electrique}
              onChange={(e) => setElectrique(e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
            <div>
              <span className="font-medium text-sm">Véhicule 100% électrique</span>
              <p className="text-xs text-text-light">Majoration de 20% sur le barème</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
            <input
              type="checkbox"
              checked={repas}
              onChange={(e) => setRepas(e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
            <div>
              <span className="font-medium text-sm">Repas pris hors domicile</span>
              <p className="text-xs text-text-light">{rules.REPAS_DEDUCTION_PAR_JOUR.toFixed(2)} € déductibles par jour</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
            <input
              type="checkbox"
              checked={teletravail}
              onChange={(e) => setTeletravail(e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
            <div>
              <span className="font-medium text-sm">Télétravail</span>
              <p className="text-xs text-text-light">{rules.TELETRAVAIL_FORFAIT_JOUR} €/jour (plafonné à {rules.TELETRAVAIL_PLAFOND_ANNUEL} €/an)</p>
            </div>
          </label>

          {teletravail && (
            <div>
              <label className="block text-sm font-medium mb-1">Jours de télétravail</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={joursTT}
                  onChange={(e) => setJoursTT(Number(e.target.value) || 0)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">jours</span>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium mb-1">Salaire net imposable annuel</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={salaire || ""}
                onChange={(e) => setSalaire(Number(e.target.value) || 0)}
                placeholder="Ex: 28000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
            </div>
            <p className="text-xs text-text-lighter mt-1">Indiqué sur votre fiche de paie de décembre</p>
          </div>
        </div>

        {/* ─── Results ─── */}
        <div className="space-y-4">
          {/* Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold mb-3">Détail des frais réels</h3>
            {result.breakdown.length === 0 ? (
              <p className="text-sm text-text-lighter">Renseignez vos frais pour voir le détail.</p>
            ) : (
              <div className="space-y-3">
                {result.breakdown.map((item) => (
                  <div key={item.label} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className="font-mono font-bold text-primary">
                        {item.amount.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <p className="text-xs text-text-lighter mt-0.5">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comparison */}
          <div className={`rounded-xl p-5 border-2 ${
            result.isWorth
              ? "bg-green-50 border-green-300"
              : salaire > 0 && result.totalFraisReels > 0
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-gray-200"
          }`}>
            <h3 className="font-bold mb-4">Comparaison</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Frais réels estimés</span>
                <span className="font-mono font-bold text-lg">
                  {result.totalFraisReels.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Abattement forfaitaire 10%</span>
                <span className="font-mono font-bold text-lg">
                  {salaire > 0 ? `${result.abattement10.toLocaleString("fr-FR")} €` : "—"}
                </span>
              </div>
              <div className="border-t-2 border-current/10 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Différence</span>
                  <span className={`font-mono font-bold text-xl ${
                    result.delta > 0 ? "text-green-700" : result.delta < 0 ? "text-red-600" : ""
                  }`}>
                    {salaire > 0 && result.totalFraisReels > 0
                      ? `${result.delta > 0 ? "+" : ""}${result.delta.toLocaleString("fr-FR")} €`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {result.isWorth && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-sm font-semibold text-green-800">
                  Les frais réels sont plus avantageux dans votre cas !
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Économie supplémentaire estimée : {Math.round(result.delta * 0.11).toLocaleString("fr-FR")} à {Math.round(result.delta * 0.30).toLocaleString("fr-FR")} €
                  selon votre tranche d&apos;imposition.
                </p>
              </div>
            )}

            {salaire > 0 && result.totalFraisReels > 0 && !result.isWorth && (
              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <p className="text-sm font-semibold text-amber-800">
                  L&apos;abattement de 10% est plus avantageux.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Gardez l&apos;abattement automatique, il vous fait économiser {Math.abs(result.delta).toLocaleString("fr-FR")} € de déduction en plus.
                </p>
              </div>
            )}
          </div>

          {/* Cases info */}
          {result.totalFraisReels > 0 && result.isWorth && (
            <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
              <h3 className="font-bold text-sm mb-2">Si vous optez pour les frais réels :</h3>
              <ul className="text-sm text-text-light space-y-1">
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  Case <strong className="font-mono">1AK</strong> : montant total des frais réels
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  Formulaire <strong>2042</strong> (déclaration principale)
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  Joignez un détail de vos frais (pas obligatoire en ligne mais recommandé)
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}
