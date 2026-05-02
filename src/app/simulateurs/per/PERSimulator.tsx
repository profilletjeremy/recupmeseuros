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

/* ── Plafond PER ────────────────────────────────────────────── */
const PER_PLANCHER = 4399;
const PER_PLAFOND_MAX = 35194;
const PLAFOND_QF = 1759; // par demi-part au-delà de 1 ou 2

/* ── Helpers ────────────────────────────────────────────────── */
function calculateIR(revenuImposable: number, parts: number) {
  const quotient = revenuImposable / parts;
  let impotParPart = 0;
  let tmi = 0;

  for (let i = 0; i < TRANCHES.length; i++) {
    const t = TRANCHES[i];
    const prevMax = i === 0 ? 0 : TRANCHES[i - 1].max;
    if (quotient <= prevMax) break;
    const base = Math.min(quotient, t.max) - prevMax;
    impotParPart += base * t.taux;
    if (t.taux > 0 && base > 0) tmi = t.taux;
  }

  return {
    impotTotal: Math.round(impotParPart * parts),
    tmi,
    quotient: Math.round(quotient),
    impotParPart: Math.round(impotParPart),
  };
}

function getParts(situation: "seul" | "couple", enfants: number) {
  const base = situation === "couple" ? 2 : 1;
  const partsEnfants = enfants <= 2 ? enfants * 0.5 : 1 + (enfants - 2) * 1;
  return base + partsEnfants;
}

function computePlafondPER(revenu: number) {
  const raw = Math.round(revenu * 0.1);
  return Math.max(PER_PLANCHER, Math.min(raw, PER_PLAFOND_MAX));
}

function fmt(n: number) {
  return n.toLocaleString("fr-FR");
}

/* ── Simulation scenarios table ─────────────────────────────── */
const SCENARIOS = [1000, 2000, 5000, 10000];

/* ── Component ──────────────────────────────────────────────── */
export default function PERSimulator() {
  const [revenu, setRevenu] = useState<number>(0);
  const [situation, setSituation] = useState<"seul" | "couple">("seul");
  const [enfants, setEnfants] = useState<number>(0);
  const [versement, setVersement] = useState<number>(0);
  const [plafondManuel, setPlafondManuel] = useState<string>("");

  const result = useMemo(() => {
    if (revenu <= 0) return null;

    const parts = getParts(situation, enfants);
    const plafondCalcule = computePlafondPER(revenu);
    const plafondDispo =
      plafondManuel !== "" && Number(plafondManuel) > 0
        ? Number(plafondManuel)
        : plafondCalcule;

    const montantDeduit = Math.min(Math.max(versement, 0), plafondDispo);

    const irSans = calculateIR(revenu, parts);
    const irAvec = calculateIR(Math.max(0, revenu - montantDeduit), parts);

    const economie = irSans.impotTotal - irAvec.impotTotal;
    const coutReel = montantDeduit - economie;

    // Simulations for different amounts
    const simulations = [...SCENARIOS, plafondDispo]
      .filter((v, i, a) => a.indexOf(v) === i) // deduplicate
      .sort((a, b) => a - b)
      .filter((v) => v > 0 && v <= plafondDispo)
      .map((v) => {
        const irSim = calculateIR(Math.max(0, revenu - v), parts);
        const eco = irSans.impotTotal - irSim.impotTotal;
        return { versement: v, economie: eco, coutReel: v - eco };
      });

    return {
      parts,
      plafondCalcule,
      plafondDispo,
      montantDeduit,
      irSans,
      irAvec,
      economie,
      coutReel,
      simulations,
    };
  }, [revenu, situation, enfants, versement, plafondManuel]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          &larr; Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Simulateur PER &mdash; Plan &Eacute;pargne Retraite
      </h1>
      <p className="text-text-light mb-8">
        Calculez l&apos;&eacute;conomie d&apos;imp&ocirc;t de vos versements PER selon votre
        tranche marginale et votre plafond disponible.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── Inputs ─────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Situation */}
          <div>
            <label className="block text-sm font-medium mb-1">Votre situation</label>
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

          {/* Revenu */}
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
                placeholder="Ex: 45000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">&euro;</span>
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

          {/* Versement PER */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Montant envisag&eacute; de versement PER
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={versement || ""}
                onChange={(e) => setVersement(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 5000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">&euro;</span>
            </div>
          </div>

          {/* Plafond manuel */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Plafond PER disponible{" "}
              <span className="text-text-lighter font-normal">(optionnel)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={plafondManuel}
                onChange={(e) => setPlafondManuel(e.target.value)}
                placeholder="Laisser vide = calcul automatique"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">&euro;</span>
            </div>
            <p className="text-xs text-text-lighter mt-1">
              Visible sur votre avis d&apos;imposition, rubrique &laquo;&nbsp;plafond
              &eacute;pargne retraite&nbsp;&raquo;.
            </p>
          </div>

          {/* Summary info */}
          {result && (
            <div className="bg-surface rounded-lg p-4 text-sm text-text-light space-y-1">
              <p>
                Nombre de parts : <strong className="text-text">{result.parts}</strong>
              </p>
              <p>
                Plafond PER{" "}
                {plafondManuel ? "renseign\u00e9" : "estim\u00e9"} :{" "}
                <strong className="text-text">{fmt(result.plafondDispo)} &euro;</strong>
              </p>
            </div>
          )}
        </div>

        {/* ── Results ────────────────────────────────────── */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-text-lighter">
                Renseignez votre revenu et un montant de versement pour lancer la simulation.
              </p>
            </div>
          ) : (
            <>
              {/* Big highlight: Economie */}
              <div className="rounded-xl p-6 border-2 border-green-300 bg-green-50">
                <p className="text-sm font-medium text-green-700 mb-1">
                  &Eacute;conomie d&apos;imp&ocirc;t estim&eacute;e
                </p>
                <p className="text-4xl font-bold text-green-800 mb-1">
                  {versement > 0 ? `${fmt(result.economie)} \u20AC` : "\u2014"}
                </p>
                {versement > 0 && result.montantDeduit < versement && (
                  <p className="text-xs text-green-600">
                    Montant d&eacute;duit plafonn&eacute; &agrave; {fmt(result.montantDeduit)} &euro;
                  </p>
                )}
              </div>

              {/* Cards: TMI, plafond, montant déduit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-text-lighter mb-1">TMI</p>
                  <p className="text-xl font-bold text-primary">
                    {result.irSans.tmi === 0
                      ? "0 %"
                      : `${(result.irSans.tmi * 100).toFixed(0)} %`}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-text-lighter mb-1">Plafond PER</p>
                  <p className="text-xl font-bold text-primary">{fmt(result.plafondDispo)} &euro;</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-text-lighter mb-1">D&eacute;duit</p>
                  <p className="text-xl font-bold text-primary">
                    {versement > 0 ? `${fmt(result.montantDeduit)} \u20AC` : "\u2014"}
                  </p>
                </div>
              </div>

              {/* IR comparison */}
              {versement > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-sm mb-3">Comparaison IR</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-text-light">IR sans PER</span>
                      <span className="font-mono font-bold">
                        {fmt(result.irSans.impotTotal)} &euro;
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-text-light">IR avec PER</span>
                      <span className="font-mono font-bold text-green-700">
                        {fmt(result.irAvec.impotTotal)} &euro;
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline text-sm">
                      <span className="font-medium">&Eacute;conomie</span>
                      <span className="font-mono font-bold text-green-700">
                        &minus; {fmt(result.economie)} &euro;
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Coût réel visualization */}
              {versement > 0 && result.montantDeduit > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-sm mb-3">Co&ucirc;t r&eacute;el de votre versement</h3>
                  <div className="relative h-8 rounded-full overflow-hidden bg-gray-100 mb-3">
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-400 rounded-l-full"
                      style={{
                        width: `${(result.coutReel / result.montantDeduit) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute inset-y-0 right-0 bg-green-400 rounded-r-full"
                      style={{
                        width: `${(result.economie / result.montantDeduit) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-light">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-400" />
                      Co&ucirc;t r&eacute;el : {fmt(result.coutReel)} &euro;
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
                      &Eacute;conomie : {fmt(result.economie)} &euro;
                    </span>
                  </div>
                  <p className="text-sm text-text-light mt-2">
                    Vous versez <strong>{fmt(result.montantDeduit)} &euro;</strong> mais
                    l&apos;&Eacute;tat vous &laquo;&nbsp;rembourse&nbsp;&raquo;{" "}
                    <strong className="text-green-700">{fmt(result.economie)} &euro;</strong>{" "}
                    via la r&eacute;duction d&apos;imp&ocirc;t. Co&ucirc;t r&eacute;el :{" "}
                    <strong>{fmt(result.coutReel)} &euro;</strong>.
                  </p>
                </div>
              )}

              {/* Simulation table */}
              {result.simulations.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-sm mb-3">
                    Simulations pour diff&eacute;rents versements
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-text-lighter border-b border-gray-100">
                          <th className="pb-2 font-medium">Versement</th>
                          <th className="pb-2 font-medium text-right">&Eacute;conomie</th>
                          <th className="pb-2 font-medium text-right">Co&ucirc;t r&eacute;el</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.simulations.map((s) => (
                          <tr
                            key={s.versement}
                            className={`border-b border-gray-50 ${
                              s.versement === result.montantDeduit
                                ? "bg-green-50 font-medium"
                                : ""
                            }`}
                          >
                            <td className="py-2">{fmt(s.versement)} &euro;</td>
                            <td className="py-2 text-right text-green-700 font-mono">
                              {fmt(s.economie)} &euro;
                            </td>
                            <td className="py-2 text-right font-mono">
                              {fmt(s.coutReel)} &euro;
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tip at TMI >= 30% */}
              {result.irSans.tmi >= 0.3 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="font-bold text-sm text-green-800 mb-2">
                    Avec votre TMI &agrave; {(result.irSans.tmi * 100).toFixed(0)}%, le PER est
                    particuli&egrave;rement int&eacute;ressant
                  </h3>
                  <p className="text-sm text-green-700">
                    Chaque <strong>1 000 &euro;</strong> vers&eacute; sur votre PER vous fait
                    &eacute;conomiser{" "}
                    <strong>{(result.irSans.tmi * 1000).toFixed(0)} &euro;</strong> d&apos;imp&ocirc;t.
                    Plus votre TMI est &eacute;lev&eacute;e, plus l&apos;avantage fiscal est important.
                  </p>
                </div>
              )}

              {/* Info box */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                <h3 className="font-bold text-sm mb-2">Comment fonctionne la d&eacute;duction PER ?</h3>
                <ul className="text-sm text-text-light space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">1.</span>
                    <span>
                      Les versements PER sont <strong>d&eacute;ductibles du revenu imposable</strong>,
                      pas un cr&eacute;dit d&apos;imp&ocirc;t. L&apos;&eacute;conomie d&eacute;pend
                      donc de votre TMI.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">2.</span>
                    <span>
                      Le plafond annuel = 10% de vos revenus nets, avec un minimum de{" "}
                      {fmt(PER_PLANCHER)} &euro; et un maximum de {fmt(PER_PLAFOND_MAX)} &euro;.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">3.</span>
                    <span>
                      Les plafonds non utilis&eacute;s des 3 ann&eacute;es pr&eacute;c&eacute;dentes
                      sont reportables. V&eacute;rifiez votre avis d&apos;imposition pour conna&icirc;tre
                      votre plafond exact.
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <Link
                href="/questionnaire"
                className="block text-center bg-green-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                D&eacute;couvrir toutes mes &eacute;conomies d&apos;imp&ocirc;t possibles
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
