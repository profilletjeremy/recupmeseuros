"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

// ─── Abattements IR par année de détention ───
function abattementIR(annees: number): number {
  if (annees <= 5) return 0;
  if (annees <= 21) return (annees - 5) * 6;
  if (annees === 22) return 96 + 4; // 100%
  return 100;
}

// ─── Abattements PS par année de détention ───
function abattementPS(annees: number): number {
  if (annees <= 5) return 0;
  if (annees <= 21) return (annees - 5) * 1.65;
  if (annees === 22) return 26.4 + 1.6; // 28%
  if (annees <= 30) return 28 + (annees - 22) * 9;
  return 100;
}

// ─── Surtaxe sur PV nette IR > 50 000 € ───
function surtaxe(pvNetteIR: number): number {
  if (pvNetteIR <= 50000) return 0;
  const tranches = [
    { max: 60000, taux: 0.02 },
    { max: 100000, taux: 0.02 },
    { max: 110000, taux: 0.03 },
    { max: 150000, taux: 0.03 },
    { max: 160000, taux: 0.04 },
    { max: 200000, taux: 0.04 },
    { max: 210000, taux: 0.05 },
    { max: 250000, taux: 0.05 },
    { max: 260000, taux: 0.06 },
    { max: Infinity, taux: 0.06 },
  ];
  let total = 0;
  let prev = 50000;
  for (const t of tranches) {
    if (pvNetteIR <= prev) break;
    const base = Math.min(pvNetteIR, t.max) - prev;
    total += base * t.taux;
    prev = t.max;
  }
  return Math.round(total);
}

export default function PlusValueSimulator() {
  const [prixAchat, setPrixAchat] = useState(0);
  const [prixVente, setPrixVente] = useState(0);
  const [duree, setDuree] = useState(0);
  const [fraisMode, setFraisMode] = useState<"forfait" | "reel">("forfait");
  const [fraisReel, setFraisReel] = useState(0);
  const [travauxMode, setTravauxMode] = useState<"forfait" | "reel">("forfait");
  const [travauxReel, setTravauxReel] = useState(0);
  const [residencePrincipale, setResidencePrincipale] = useState(false);

  const result = useMemo(() => {
    if (prixVente <= 0 || prixAchat <= 0) return null;

    const fraisAcq = fraisMode === "forfait" ? Math.round(prixAchat * 0.075) : fraisReel;
    const travaux = travauxMode === "forfait" && duree >= 5 ? Math.round(prixAchat * 0.15) : travauxReel;

    const pvBrute = prixVente - prixAchat - fraisAcq - travaux;
    if (pvBrute <= 0) return { pvBrute, exonere: false, residencePrincipale, noGain: true } as const;
    if (residencePrincipale) return { pvBrute, exonere: true, residencePrincipale: true, noGain: false } as const;

    const abIR = abattementIR(duree);
    const abPS = abattementPS(duree);

    const pvNetteIR = Math.round(pvBrute * (1 - abIR / 100));
    const pvNettePS = Math.round(pvBrute * (1 - abPS / 100));

    const ir = Math.round(pvNetteIR * 0.19);
    const ps = Math.round(pvNettePS * 0.172);
    const st = surtaxe(pvNetteIR);
    const total = ir + ps + st;

    return {
      pvBrute,
      fraisAcq,
      travaux,
      abIR,
      abPS,
      pvNetteIR,
      pvNettePS,
      ir,
      ps,
      surtaxe: st,
      total,
      netVendeur: prixVente - total,
      exonereIR: abIR >= 100,
      exonerePS: abPS >= 100,
      exonere: abIR >= 100 && abPS >= 100,
      residencePrincipale: false,
      noGain: false,
    } as const;
  }, [prixAchat, prixVente, duree, fraisMode, fraisReel, travauxMode, travauxReel, residencePrincipale]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
        ← Retour au dashboard
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
        Simulateur plus-value immobilière
      </h1>
      <p className="text-text-light mb-8">
        Calculez l&apos;impôt sur la plus-value lors de la vente d&apos;un bien immobilier (hors résidence principale).
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── Inputs ── */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Résidence principale ?</label>
            <div className="flex gap-2">
              {([false, true] as const).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setResidencePrincipale(v)}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                    residencePrincipale === v
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {v ? "Oui" : "Non"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix d&apos;achat</label>
            <div className="relative">
              <input
                type="number" inputMode="numeric" min={0}
                value={prixAchat || ""}
                onChange={(e) => setPrixAchat(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 200000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix de vente</label>
            <div className="relative">
              <input
                type="number" inputMode="numeric" min={0}
                value={prixVente || ""}
                onChange={(e) => setPrixVente(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 300000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Durée de détention (années)</label>
            <input
              type="number" inputMode="numeric" min={0} max={40}
              value={duree || ""}
              onChange={(e) => setDuree(Math.max(0, Math.min(40, Number(e.target.value) || 0)))}
              placeholder="Ex: 10"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frais d&apos;acquisition</label>
            <div className="flex gap-2 mb-2">
              {(["forfait", "reel"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFraisMode(m)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    fraisMode === m ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {m === "forfait" ? "Forfait 7,5 %" : "Montant réel"}
                </button>
              ))}
            </div>
            {fraisMode === "reel" && (
              <div className="relative">
                <input
                  type="number" inputMode="numeric" min={0}
                  value={fraisReel || ""}
                  onChange={(e) => setFraisReel(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="Frais réels"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Travaux</label>
            <div className="flex gap-2 mb-2">
              {(["forfait", "reel"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTravauxMode(m)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    travauxMode === m ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {m === "forfait" ? `Forfait 15 %${duree < 5 ? " (après 5 ans)" : ""}` : "Montant réel"}
                </button>
              ))}
            </div>
            {travauxMode === "reel" && (
              <div className="relative">
                <input
                  type="number" inputMode="numeric" min={0}
                  value={travauxReel || ""}
                  onChange={(e) => setTravauxReel(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="Montant travaux"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">€</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Results ── */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-text-lighter">Renseignez les informations de votre vente.</p>
            </div>
          ) : result.residencePrincipale ? (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
              <span className="text-4xl block mb-2">🏠</span>
              <p className="text-2xl font-bold text-green-800 mb-1">Exonéré</p>
              <p className="text-sm text-green-700">La plus-value sur votre résidence principale est totalement exonérée d&apos;impôt.</p>
            </div>
          ) : result.noGain ? (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
              <p className="text-xl font-bold text-blue-800 mb-1">Pas de plus-value</p>
              <p className="text-sm text-blue-700">
                Plus-value brute : {result.pvBrute.toLocaleString("fr-FR")} €.
                {result.pvBrute < 0 ? " Vous êtes en moins-value." : " Aucun impôt dû."}
              </p>
            </div>
          ) : result.exonere ? (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="text-2xl font-bold text-green-800 mb-1">Exonération totale</p>
              <p className="text-sm text-green-700">Après {duree} ans de détention, vous ne payez ni IR ni prélèvements sociaux.</p>
            </div>
          ) : (
            <>
              {/* Total */}
              <div className="bg-white rounded-xl border-2 border-red-200 p-5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-text-light">Total à payer</span>
                  <span className="font-mono font-bold text-2xl text-red-600">
                    {result.total.toLocaleString("fr-FR")} €
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-lighter">Net vendeur</span>
                  <span className="font-mono font-bold text-sm text-green-700">
                    {result.netVendeur.toLocaleString("fr-FR")} €
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <h3 className="font-bold text-sm mb-2">Détail du calcul</h3>
                <Row label="Plus-value brute" value={`${result.pvBrute.toLocaleString("fr-FR")} €`} />
                <Row label={`Abattement IR (${result.abIR}%)`} value={`-${Math.round(result.pvBrute * result.abIR / 100).toLocaleString("fr-FR")} €`} sub />
                <Row label="PV nette IR" value={`${result.pvNetteIR.toLocaleString("fr-FR")} €`} bold />
                <Row label={`Abattement PS (${result.abPS.toFixed(1)}%)`} value={`-${Math.round(result.pvBrute * result.abPS / 100).toLocaleString("fr-FR")} €`} sub />
                <Row label="PV nette PS" value={`${result.pvNettePS.toLocaleString("fr-FR")} €`} bold />
                <div className="border-t border-gray-100 pt-2">
                  <Row label="IR (19%)" value={`${result.ir.toLocaleString("fr-FR")} €`} />
                  <Row label="Prélèvements sociaux (17,2%)" value={`${result.ps.toLocaleString("fr-FR")} €`} />
                  {result.surtaxe > 0 && (
                    <Row label="Surtaxe" value={`${result.surtaxe.toLocaleString("fr-FR")} €`} />
                  )}
                </div>
              </div>

              {/* Exoneration badges */}
              {result.exonereIR && !result.exonerePS && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    <strong>Exonéré d&apos;IR</strong> après 22 ans — il reste les prélèvements sociaux (exonération totale après 30 ans).
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-sm mb-3">Progression vers l&apos;exonération</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>IR (exonération à 22 ans)</span>
                      <span className="font-bold">{Math.min(result.abIR, 100)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${result.abIR >= 100 ? "bg-green-400" : "bg-blue-400"}`}
                        style={{ width: `${Math.min(result.abIR, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>PS (exonération à 30 ans)</span>
                      <span className="font-bold">{Math.min(Math.round(result.abPS), 100)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${result.abPS >= 100 ? "bg-green-400" : "bg-purple-400"}`}
                        style={{ width: `${Math.min(result.abPS, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
            <h3 className="font-bold text-sm mb-2">Bon à savoir</h3>
            <ul className="text-sm text-text-light space-y-1">
              <li>- La <strong>résidence principale</strong> est toujours exonérée</li>
              <li>- Exonération IR après <strong>22 ans</strong> de détention</li>
              <li>- Exonération totale (IR + PS) après <strong>30 ans</strong></li>
              <li>- Une surtaxe s&apos;applique si la PV nette dépasse 50 000 €</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="font-bold text-sm text-green-800 mb-2">Optimisez votre déclaration</p>
            <p className="text-sm text-green-700 mb-3">
              Vérifiez si vous avez d&apos;autres avantages fiscaux à déclarer.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
              Analyser mes économies possibles
            </Link>
          </div>
        </div>
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
