"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

/* ── Constants ────────────────────────────────────────────────── */

type Activite = "vente" | "service_bic" | "service_bnc";

const ACTIVITES: { key: Activite; label: string }[] = [
  { key: "vente", label: "Vente de marchandises" },
  { key: "service_bic", label: "Prestations BIC" },
  { key: "service_bnc", label: "Prestations BNC" },
];

const ABATTEMENTS: Record<Activite, number> = {
  vente: 0.71,
  service_bic: 0.50,
  service_bnc: 0.34,
};

const COTISATIONS_SOCIALES: Record<Activite, number> = {
  vente: 0.123,
  service_bic: 0.212,
  service_bnc: 0.211,
};

const VERSEMENT_LIBERATOIRE_IR: Record<Activite, number> = {
  vente: 0.01,
  service_bic: 0.017,
  service_bnc: 0.022,
};

const SEUILS_CA: Record<Activite, number> = {
  vente: 188700,
  service_bic: 77700,
  service_bnc: 77700,
};

const CFE = 200;

const TRANCHES = [
  { min: 0, max: 11294, taux: 0 },
  { min: 11294, max: 28797, taux: 0.11 },
  { min: 28797, max: 82341, taux: 0.30 },
  { min: 82341, max: 177106, taux: 0.41 },
  { min: 177106, max: Infinity, taux: 0.45 },
];

/* ── IR calculation ───────────────────────────────────────────── */

function calculateIR(revenuImposable: number, parts: number): number {
  const quotient = revenuImposable / parts;
  let impot = 0;

  for (let i = 0; i < TRANCHES.length; i++) {
    const t = TRANCHES[i];
    const prevMax = i === 0 ? 0 : TRANCHES[i - 1].max;
    if (quotient <= prevMax) break;
    const base = Math.min(quotient, t.max) - prevMax;
    impot += base * t.taux;
  }

  return Math.round(impot * parts);
}

/* ── Charge bar colors ────────────────────────────────────────── */

const CHARGE_COLORS = [
  { key: "cotisations", label: "Cotisations sociales", bar: "bg-blue-400", text: "bg-blue-100 text-blue-800" },
  { key: "ir", label: "Impôt sur le revenu", bar: "bg-amber-400", text: "bg-amber-100 text-amber-800" },
  { key: "cfe", label: "CFE", bar: "bg-gray-400", text: "bg-gray-100 text-gray-700" },
];

/* ── Component ────────────────────────────────────────────────── */

export default function MicroSimulator() {
  const [activite, setActivite] = useState<Activite>("service_bnc");
  const [ca, setCa] = useState<number>(0);
  const [autresRevenus, setAutresRevenus] = useState<number>(0);
  const [situation, setSituation] = useState<"seul" | "couple">("seul");
  const [versementLib, setVersementLib] = useState(false);

  const result = useMemo(() => {
    if (ca <= 0) return null;

    const parts = situation === "couple" ? 2 : 1;
    const abattement = ABATTEMENTS[activite];
    const cotisationsRate = COTISATIONS_SOCIALES[activite];
    const vlRate = VERSEMENT_LIBERATOIRE_IR[activite];
    const seuil = SEUILS_CA[activite];

    const cotisations = Math.round(ca * cotisationsRate);

    /* Option 1 : barème classique */
    const revenuMicro = Math.round(ca * (1 - abattement));
    const revenuImposableClassique = revenuMicro + autresRevenus;
    const irClassique = calculateIR(revenuImposableClassique, parts);
    const totalClassique = cotisations + irClassique + CFE;
    const netClassique = ca - totalClassique;

    /* Option 2 : versement libératoire */
    const irVL = Math.round(ca * vlRate);
    const irAutres = calculateIR(autresRevenus, parts);
    const irLiberatoire = irVL + irAutres;
    const totalLiberatoire = cotisations + irLiberatoire + CFE;
    const netLiberatoire = ca - totalLiberatoire;

    const saving = Math.abs(totalClassique - totalLiberatoire);
    const bestOption: "classique" | "liberatoire" =
      totalClassique <= totalLiberatoire ? "classique" : "liberatoire";

    return {
      ca,
      cotisations,
      irClassique,
      irLiberatoire,
      totalClassique,
      totalLiberatoire,
      netClassique,
      netLiberatoire,
      bestOption,
      saving,
      seuilDepasse: ca > seuil,
      seuil,
    };
  }, [ca, autresRevenus, situation, activite, versementLib]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard" className="text-text-light hover:text-primary text-sm">
          &larr; Retour au dashboard
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Simulateur micro-entrepreneur 2026
      </h1>
      <p className="text-text-light mb-8">
        Comparez bar&egrave;me classique et versement lib&eacute;ratoire pour optimiser vos charges.
      </p>

      {/* ── Inputs ─────────────────────────────────────────── */}
      <div className="space-y-5 mb-8">
        {/* Type d'activité */}
        <div>
          <label className="block text-sm font-medium mb-1">Type d&apos;activit&eacute;</label>
          <div className="flex gap-2">
            {ACTIVITES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivite(key)}
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all text-sm ${
                  activite === key
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* CA annuel */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chiffre d&apos;affaires annuel
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={ca || ""}
                onChange={(e) => setCa(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 45000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">&euro;</span>
            </div>
          </div>

          {/* Autres revenus */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Autres revenus du foyer <span className="text-text-lighter">(optionnel)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={autresRevenus || ""}
                onChange={(e) => setAutresRevenus(Math.max(0, Number(e.target.value) || 0))}
                placeholder="Ex: 25000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-lighter">&euro;</span>
            </div>
          </div>
        </div>

        {/* Situation */}
        <div>
          <label className="block text-sm font-medium mb-1">Situation</label>
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

        {/* Versement libératoire toggle */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <div>
            <p className="text-sm font-medium">Versement lib&eacute;ratoire de l&apos;IR</p>
            <p className="text-xs text-text-lighter">
              Pr&eacute;l&egrave;vement forfaitaire sur le CA au lieu du bar&egrave;me progressif
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={versementLib}
            onClick={() => setVersementLib(!versementLib)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              versementLib ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                versementLib ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────── */}
      {!result ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-text-lighter">
            Renseignez votre chiffre d&apos;affaires pour lancer la simulation.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Seuil warning */}
          {result.seuilDepasse && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
              <span className="text-red-500 text-xl shrink-0">&#9888;</span>
              <p className="text-sm text-red-700">
                Votre CA d&eacute;passe le seuil de{" "}
                <strong>{result.seuil.toLocaleString("fr-FR")} &euro;</strong>.
                Vous risquez de sortir du r&eacute;gime micro-entrepreneur.
              </p>
            </div>
          )}

          {/* Side-by-side comparison */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Barème classique */}
            <ComparisonCard
              title="Barème classique"
              isBest={result.bestOption === "classique"}
              ca={result.ca}
              cotisations={result.cotisations}
              ir={result.irClassique}
              cfe={CFE}
              total={result.totalClassique}
              net={result.netClassique}
            />

            {/* Versement libératoire */}
            <ComparisonCard
              title="Versement libératoire"
              isBest={result.bestOption === "liberatoire"}
              ca={result.ca}
              cotisations={result.cotisations}
              ir={result.irLiberatoire}
              cfe={CFE}
              total={result.totalLiberatoire}
              net={result.netLiberatoire}
            />
          </div>

          {/* Savings banner */}
          {result.saving > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-800">
                Le <strong>{result.bestOption === "classique" ? "barème classique" : "versement libératoire"}</strong> vous
                fait &eacute;conomiser{" "}
                <strong className="text-lg">{result.saving.toLocaleString("fr-FR")} &euro;</strong> par an.
              </p>
            </div>
          )}

          {/* Charges breakdown bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm mb-3">R&eacute;partition des charges (meilleure option)</h3>
            {(() => {
              const best = result.bestOption === "classique"
                ? { cotisations: result.cotisations, ir: result.irClassique, cfe: CFE, total: result.totalClassique }
                : { cotisations: result.cotisations, ir: result.irLiberatoire, cfe: CFE, total: result.totalLiberatoire };
              const items = [
                { ...CHARGE_COLORS[0], value: best.cotisations },
                { ...CHARGE_COLORS[1], value: best.ir },
                { ...CHARGE_COLORS[2], value: best.cfe },
              ];
              return (
                <>
                  <div className="flex rounded-full overflow-hidden h-6 mb-4">
                    {items
                      .filter((c) => c.value > 0)
                      .map((c) => {
                        const width = best.total > 0 ? (c.value / best.total) * 100 : 0;
                        return (
                          <div
                            key={c.key}
                            className={`${c.bar} relative`}
                            style={{ width: `${width}%` }}
                            title={`${c.label} : ${c.value.toLocaleString("fr-FR")} €`}
                          />
                        );
                      })}
                  </div>
                  <div className="space-y-2">
                    {items
                      .filter((c) => c.value > 0)
                      .map((c) => (
                        <div key={c.key} className="flex items-center gap-3 text-sm">
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${c.text}`}>
                            {c.label}
                          </span>
                          <span className="flex-1" />
                          <span className="font-mono font-bold">
                            {c.value.toLocaleString("fr-FR")} &euro;
                          </span>
                        </div>
                      ))}
                    <div className="border-t border-gray-100 pt-2 flex items-center gap-3 text-sm">
                      <span className="text-xs font-bold px-2 py-0.5">TOTAL</span>
                      <span className="flex-1" />
                      <span className="font-mono font-bold text-primary">
                        {best.total.toLocaleString("fr-FR")} &euro;
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* CTA */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-bold text-sm text-green-800 mb-2">
              Optimisez votre d&eacute;claration
            </h3>
            <p className="text-sm text-green-700 mb-3">
              V&eacute;rifiez que vous n&apos;oubliez aucune d&eacute;duction ou cr&eacute;dit d&apos;imp&ocirc;t gr&acirc;ce
              &agrave; notre questionnaire personnalis&eacute;.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
              Lancer le questionnaire
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}

/* ── Comparison card ──────────────────────────────────────────── */

function ComparisonCard({
  title,
  isBest,
  ca,
  cotisations,
  ir,
  cfe,
  total,
  net,
}: {
  title: string;
  isBest: boolean;
  ca: number;
  cotisations: number;
  ir: number;
  cfe: number;
  total: number;
  net: number;
}) {
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  return (
    <div
      className={`rounded-xl p-5 border-2 ${
        isBest ? "border-green-400 bg-green-50/50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-sm">{title}</h3>
        {isBest && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
            Meilleur choix
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <Row label="Chiffre d&apos;affaires" value={`${fmt(ca)} €`} />
        <Row label="Cotisations sociales" value={`− ${fmt(cotisations)} €`} muted />
        <Row label="Impôt sur le revenu" value={`− ${fmt(ir)} €`} muted />
        <Row label="CFE" value={`− ${fmt(cfe)} €`} muted />
        <div className="border-t border-gray-100 pt-2">
          <Row label="Total charges" value={`${fmt(total)} €`} bold />
        </div>
        <div className="border-t border-gray-100 pt-2">
          <Row
            label="Revenu net"
            value={`${fmt(net)} €`}
            bold
            highlight={isBest}
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline">
      <span
        className={muted ? "text-text-lighter" : ""}
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <span
        className={`font-mono ${bold ? "font-bold text-base" : ""} ${
          highlight ? "text-green-700" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
