"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

/* ── Constants ──────────────────────────────────────────────── */

const TAUX_CREDIT = 0.5;
const PLAFOND_BASE = 12_000;
const MAJORATION_PAR_PERSONNE = 1_500;
const PLAFOND_MAX = 15_000;

interface Service {
  id: string;
  label: string;
  plafond: number | null; // null = no individual cap
  color: string;
  barColor: string;
}

const SERVICES: Service[] = [
  { id: "menage", label: "Ménage / entretien", plafond: null, color: "bg-blue-100 text-blue-800", barColor: "bg-blue-400" },
  { id: "jardinage", label: "Jardinage", plafond: 5_000, color: "bg-green-100 text-green-800", barColor: "bg-green-400" },
  { id: "garde", label: "Garde d’enfants à domicile", plafond: null, color: "bg-purple-100 text-purple-800", barColor: "bg-purple-400" },
  { id: "soutien", label: "Soutien scolaire", plafond: null, color: "bg-amber-100 text-amber-800", barColor: "bg-amber-400" },
  { id: "informatique", label: "Aide informatique", plafond: 3_000, color: "bg-cyan-100 text-cyan-800", barColor: "bg-cyan-400" },
  { id: "bricolage", label: "Bricolage", plafond: 500, color: "bg-orange-100 text-orange-800", barColor: "bg-orange-400" },
  { id: "dependance", label: "Aide aux personnes dépendantes", plafond: null, color: "bg-rose-100 text-rose-800", barColor: "bg-rose-400" },
];

/* ── Component ──────────────────────────────────────────────── */

export default function EmploiDomicileSimulator() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [enfants, setEnfants] = useState(0);
  const [senior, setSenior] = useState(false);

  const toggle = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAmount = (id: string, value: number) => {
    setAmounts((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const result = useMemo(() => {
    const activeServices = SERVICES.filter((s) => enabled[s.id] && (amounts[s.id] ?? 0) > 0);
    if (activeServices.length === 0) return null;

    // Per-service breakdown
    const breakdown = activeServices.map((s) => {
      const declare = amounts[s.id] ?? 0;
      const retenu = s.plafond !== null ? Math.min(declare, s.plafond) : declare;
      const cappedByIndividual = s.plafond !== null && declare > s.plafond;
      return { ...s, declare, retenu, cappedByIndividual };
    });

    const totalRetenu = breakdown.reduce((sum, b) => sum + b.retenu, 0);

    // Global cap with majorations
    const majorations = enfants * MAJORATION_PAR_PERSONNE + (senior ? MAJORATION_PAR_PERSONNE : 0);
    const plafondGlobal = Math.min(PLAFOND_BASE + majorations, PLAFOND_MAX);
    const totalApresPlafond = Math.min(totalRetenu, plafondGlobal);
    const cappedByGlobal = totalRetenu > plafondGlobal;

    // Distribute global cap proportionally for per-service credit
    const ratio = totalRetenu > 0 ? totalApresPlafond / totalRetenu : 0;
    const details = breakdown.map((b) => {
      const retenuFinal = Math.round(b.retenu * ratio);
      return { ...b, retenuFinal, credit: Math.round(retenuFinal * TAUX_CREDIT) };
    });

    const creditTotal = Math.round(totalApresPlafond * TAUX_CREDIT);

    return { details, totalRetenu, plafondGlobal, totalApresPlafond, creditTotal, cappedByGlobal, majorations };
  }, [enabled, amounts, enfants, senior]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          &larr; Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Simulateur cr&eacute;dit d&apos;imp&ocirc;t emploi &agrave; domicile
      </h1>
      <p className="text-text-light mb-8">
        S&eacute;lectionnez vos services et renseignez les montants pour estimer votre cr&eacute;dit d&apos;imp&ocirc;t.
      </p>

      {/* ── Services ────────────────────────────────────── */}
      <div className="space-y-3 mb-8">
        {SERVICES.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!enabled[s.id]}
                onChange={() => toggle(s.id)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-medium flex-1">{s.label}</span>
              {s.plafond !== null && (
                <span className="text-xs text-text-lighter">
                  plafond {s.plafond.toLocaleString("fr-FR")} &euro;
                </span>
              )}
            </label>

            {enabled[s.id] && (
              <div className="mt-3 ml-8">
                <label className="block text-sm text-text-light mb-1">Montant annuel d&eacute;pens&eacute;</label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={amounts[s.id] || ""}
                    onChange={(e) => setAmount(s.id, Number(e.target.value) || 0)}
                    placeholder="Ex: 2000"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">&euro;</span>
                </div>
                {s.plafond !== null && (amounts[s.id] ?? 0) > s.plafond && (
                  <p className="text-xs text-amber-600 mt-1">
                    Plafond de {s.plafond.toLocaleString("fr-FR")} &euro; atteint &mdash; seul ce montant sera retenu.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Foyer ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8 space-y-5">
        <h2 className="font-bold text-sm">Composition du foyer</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre d&apos;enfants &agrave; charge</label>
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

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={senior}
              onChange={() => setSenior((v) => !v)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Membre du foyer de plus de 65 ans</span>
          </label>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────── */}
      {!result ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-text-lighter">
            Activez au moins un service et renseignez un montant pour calculer votre cr&eacute;dit d&apos;imp&ocirc;t.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Big number */}
          <div className="rounded-xl p-6 border-2 border-green-300 bg-green-50">
            <p className="text-sm font-medium mb-1 text-green-700">Votre cr&eacute;dit d&apos;imp&ocirc;t estim&eacute;</p>
            <p className="text-4xl font-bold text-green-800 mb-1">
              {result.creditTotal.toLocaleString("fr-FR")} &euro;
            </p>
            <p className="text-sm text-green-700">
              soit 50 % de {result.totalApresPlafond.toLocaleString("fr-FR")} &euro; de d&eacute;penses retenues
            </p>
          </div>

          {/* Stacked bar */}
          {result.totalApresPlafond > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm mb-3">R&eacute;partition par service</h3>
              <div className="flex rounded-full overflow-hidden h-6 mb-4">
                {result.details
                  .filter((d) => d.retenuFinal > 0)
                  .map((d) => {
                    const width = (d.retenuFinal / result.totalApresPlafond) * 100;
                    return (
                      <div
                        key={d.id}
                        className={`${d.barColor} relative`}
                        style={{ width: `${width}%` }}
                        title={`${d.label} : ${d.retenuFinal.toLocaleString("fr-FR")} €`}
                      />
                    );
                  })}
              </div>

              {/* Per-service breakdown */}
              <div className="space-y-2">
                {result.details.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 text-sm">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${d.color}`}>
                      {d.label}
                    </span>
                    <span className="flex-1 text-text-light">
                      {d.declare.toLocaleString("fr-FR")} &euro;
                      {d.cappedByIndividual && (
                        <span className="text-amber-600"> &rarr; {d.retenu.toLocaleString("fr-FR")} &euro;</span>
                      )}
                    </span>
                    <span className="font-mono font-bold">
                      {d.credit.toLocaleString("fr-FR")} &euro;
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex items-center gap-3 text-sm">
                  <span className="text-xs font-bold px-2 py-0.5">TOTAL</span>
                  <span className="flex-1 text-text-light">
                    {result.totalRetenu.toLocaleString("fr-FR")} &euro; d&eacute;clar&eacute;s &rarr; {result.totalApresPlafond.toLocaleString("fr-FR")} &euro; retenus
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {result.creditTotal.toLocaleString("fr-FR")} &euro;
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {result.details.some((d) => d.cappedByIndividual) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <span className="text-amber-500 text-lg shrink-0">&#9888;</span>
              <p className="text-sm text-amber-700">
                Un ou plusieurs plafonds sp&eacute;cifiques ont &eacute;t&eacute; atteints (jardinage 5 000 &euro;, informatique 3 000 &euro;, bricolage 500 &euro;).
                Seul le montant plafonn&eacute; est retenu pour le calcul.
              </p>
            </div>
          )}

          {result.cappedByGlobal && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <span className="text-amber-500 text-lg shrink-0">&#9888;</span>
              <p className="text-sm text-amber-700">
                Le plafond global de {result.plafondGlobal.toLocaleString("fr-FR")} &euro;
                {result.majorations > 0 && (
                  <> (12 000 &euro; + {result.majorations.toLocaleString("fr-FR")} &euro; de majorations)</>
                )} a &eacute;t&eacute; atteint.
                Le montant exc&eacute;dentaire ({(result.totalRetenu - result.totalApresPlafond).toLocaleString("fr-FR")} &euro;) n&apos;ouvre pas droit au cr&eacute;dit.
              </p>
            </div>
          )}

          {/* Info box */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
            <p className="text-sm text-text-light">
              <strong>Bon &agrave; savoir :</strong> ce cr&eacute;dit d&apos;imp&ocirc;t s&apos;applique m&ecirc;me si vous n&apos;&ecirc;tes pas imposable.
              Dans ce cas, le Tr&eacute;sor public vous verse directement la somme correspondante.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/questionnaire"
            className="block text-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            D&eacute;couvrez tous vos avantages fiscaux &rarr;
          </Link>
        </div>
      )}

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}
