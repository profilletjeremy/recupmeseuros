"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { evaluateTaxOpportunities } from "@/lib/engine";
import { QuestionnaireAnswers } from "@/data/types";
import type { TaxResult, TaxOpportunity } from "@/data/types";
import { isPremium } from "@/lib/premium";
import { CALENDRIER_FISCAL } from "@/data/taxRules2026";
import Disclaimer from "@/components/Disclaimer";

// ─── Types ───
interface Step {
  id: string;
  phase: "preparation" | "declaration" | "verification";
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

// ─── Clipboard helper ───
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        copied
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Copié !
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10" /></svg>
          {label || text}
        </>
      )}
    </button>
  );
}

// ─── ICS calendar file generator ───
function generateICS(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RecupMesEuros//FR",
    "CALSCALE:GREGORIAN",
  ];
  for (const c of CALENDRIER_FISCAL) {
    const d = c.date.replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${d}`,
      `SUMMARY:${c.label}`,
      "DESCRIPTION:Rappel fiscal RecupMesEuros",
      `UID:recupmeseuros-${c.date}@recupmeseuros.fr`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Rappel fiscal demain",
      "END:VALARM",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS() {
  const data = generateICS();
  const blob = new Blob([data], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "calendrier-fiscal-2026.ics";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Impots.gouv deep links ───
const IMPOTS_LINKS = {
  login: "https://cfspart.impots.gouv.fr/LoginMDP",
  declaration: "https://cfspart.impots.gouv.fr/enp/ensu/accueilEnsu.do",
  annexes: "https://www.impots.gouv.fr/portail/formulaire/2042/declaration-des-revenus",
  rici: "https://www.impots.gouv.fr/portail/formulaire/2042-rici/declaration-des-revenus-reductions-dimpot-credits-dimpot",
};

// ─── Phase labels ───
const PHASE_CONFIG = {
  preparation: { label: "Préparation", icon: "1", color: "bg-blue-500", lightColor: "bg-blue-50 text-blue-700 border-blue-200" },
  declaration: { label: "Déclaration", icon: "2", color: "bg-primary", lightColor: "bg-primary/5 text-primary border-primary/20" },
  verification: { label: "Vérification", icon: "3", color: "bg-green-500", lightColor: "bg-green-50 text-green-700 border-green-200" },
};

// ─── Build opportunity step content ───
function OpportunityStep({ opp }: { opp: TaxOpportunity }) {
  const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
    credit: { label: "Crédit d'impôt", cls: "bg-green-100 text-green-800" },
    reduction: { label: "Réduction d'impôt", cls: "bg-blue-100 text-blue-800" },
    deduction: { label: "Déduction", cls: "bg-purple-100 text-purple-800" },
    info: { label: "Information", cls: "bg-gray-100 text-gray-700" },
  };
  const badge = TYPE_BADGE[opp.type];

  return (
    <div className="space-y-5">
      {/* Badge + saving — always visible */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.cls}`}>
          {badge.label}
        </span>
        {opp.estimatedSaving && (
          <span className="text-sm font-bold text-secondary">
            Gain estimé : {opp.estimatedSaving.min === opp.estimatedSaving.max
              ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} €`
              : `${opp.estimatedSaving.min.toLocaleString("fr-FR")} – ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-text-light">{opp.description}</p>

      {/* Visual step-by-step instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Comment faire, étape par étape
            </h4>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium text-blue-900">Accédez à votre déclaration</p>
                  <p className="text-sm text-blue-700 mt-0.5">
                    Connectez-vous sur{" "}
                    <a href={IMPOTS_LINKS.login} target="_blank" rel="noopener noreferrer" className="underline font-medium">impots.gouv.fr</a>
                    {" "}→ &quot;Accéder à la déclaration en ligne&quot;
                  </p>
                </div>
              </li>

              {opp.form !== "2042" && (
                <li className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <p className="font-medium text-blue-900">Ajoutez le formulaire {opp.form}</p>
                    <p className="text-sm text-blue-700 mt-0.5">
                      {opp.form === "2042-RICI" && "Dans les annexes, cochez « Réductions et crédits d'impôt (2042-RICI) »"}
                      {opp.form === "2042-C-PRO" && "Cochez « Revenus des professions non salariées (2042-C-PRO) »"}
                      {opp.form === "2044" && "Cochez « Revenus fonciers (2044) »"}
                    </p>
                    <CopyButton text={opp.form} label={`Copier "${opp.form}"`} />
                  </div>
                </li>
              )}

              {opp.boxes.length > 0 && (
                <li className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {opp.form !== "2042" ? "3" : "2"}
                  </span>
                  <div>
                    <p className="font-medium text-blue-900">
                      Remplissez la case {opp.boxes[0]}
                      {opp.boxes.length > 1 && ` (ou ${opp.boxes.slice(1).join(", ")})`}
                    </p>
                    <p className="text-sm text-blue-700 mt-0.5 mb-2">
                      Utilisez la recherche (Ctrl+F) pour trouver rapidement la case.
                      Renseignez le montant correspondant.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opp.boxes.map((box) => (
                        <CopyButton key={box} text={box} label={`Case ${box}`} />
                      ))}
                    </div>
                  </div>
                </li>
              )}

              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </span>
                <div>
                  <p className="font-medium text-green-800">Vérifiez et passez à la suite</p>
                  <p className="text-sm text-green-700 mt-0.5">Contrôlez que le montant est correct sur le résumé, puis continuez.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Form + Boxes quick reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-xs font-semibold text-text-lighter mb-1">Formulaire</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold text-primary text-lg">{opp.form}</p>
                <CopyButton text={opp.form} />
              </div>
            </div>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-xs font-semibold text-text-lighter mb-1">Case(s) à remplir</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold text-primary text-lg">{opp.boxes.length > 0 ? opp.boxes.join("  ") : "Automatique"}</p>
                {opp.boxes.length > 0 && <CopyButton text={opp.boxes.join(", ")} />}
              </div>
            </div>
          </div>

          {/* Justificatifs */}
          {opp.justificatifs.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Justificatifs à conserver (3 ans)
              </h4>
              <ul className="space-y-1">
                {opp.justificatifs.map((j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="mt-0.5">&#8226;</span>
                    {j}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            <a
              href={opp.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors font-medium"
            >
              Source officielle →
            </a>
            {opp.guideLink && (
              <Link href={opp.guideLink} className="text-sm bg-secondary/10 text-secondary px-4 py-2 rounded-lg hover:bg-secondary/20 transition-colors font-medium">
                Notre guide détaillé →
              </Link>
            )}
          </div>
    </div>
  );
}

// ─── Build all steps from result ───
function buildSteps(result: TaxResult): Step[] {
  const steps: Step[] = [];

  // ── Phase 1: Préparation ──
  // Step 1: Gather documents
  const allJustificatifs = new Map<string, string[]>();
  for (const opp of result.opportunities) {
    for (const j of opp.justificatifs) {
      const existing = allJustificatifs.get(j);
      if (existing) existing.push(opp.title);
      else allJustificatifs.set(j, [opp.title]);
    }
  }

  steps.push({
    id: "prep_documents",
    phase: "preparation",
    title: "Rassemblez vos documents",
    subtitle: "Avant de commencer, réunissez tous les justificatifs nécessaires",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-bold text-blue-900 mb-3">Documents indispensables</h4>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-medium text-blue-900">Dernier avis d&apos;imposition</p>
                <p className="text-sm text-blue-700">Numéro fiscal, revenu fiscal de référence, plafond PER</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-medium text-blue-900">Bulletins de paie de décembre 2025</p>
                <p className="text-sm text-blue-700">Cumuls annuels, heures supplémentaires exonérées</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-medium text-blue-900">Identifiants impots.gouv.fr</p>
                <p className="text-sm text-blue-700">Numéro fiscal (13 chiffres) + mot de passe</p>
              </div>
            </li>
          </ul>
        </div>

        {allJustificatifs.size > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h4 className="font-bold text-amber-800 mb-3">Justificatifs spécifiques à votre situation</h4>
            <ul className="space-y-2">
              {Array.from(allJustificatifs.entries()).map(([doc, opps]) => (
                <li key={doc} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <div>
                    <p className="text-sm font-medium text-amber-900">{doc}</p>
                    <p className="text-xs text-amber-600">Pour : {opps.join(", ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ),
  });

  // Step 2: Calendar + Deadlines
  steps.push({
    id: "prep_calendrier",
    phase: "preparation",
    title: "Dates limites et rappels",
    subtitle: "Téléchargez le calendrier fiscal pour ne rien oublier",
    content: (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {CALENDRIER_FISCAL.map((c, i) => {
            const d = new Date(c.date);
            const isPast = d < new Date();
            const isNext = !isPast && (i === 0 || new Date(CALENDRIER_FISCAL[i - 1].date) < new Date());
            return (
              <div
                key={c.date}
                className={`flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 ${
                  isPast ? "opacity-50" : ""
                } ${isNext ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
              >
                <div className="text-center shrink-0 w-14">
                  <p className="text-2xl font-bold text-primary">{d.getDate()}</p>
                  <p className="text-xs text-text-lighter uppercase">
                    {d.toLocaleDateString("fr-FR", { month: "short" })}
                  </p>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isNext ? "text-primary" : ""}`}>{c.label}</p>
                  {isNext && (
                    <p className="text-xs text-primary font-medium mt-0.5">
                      ← Prochaine échéance
                    </p>
                  )}
                </div>
                {isPast && <span className="text-xs text-text-lighter">Passée</span>}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={downloadICS}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Ajouter les dates à mon calendrier (.ics)
        </button>
      </div>
    ),
  });

  // Step 3: Connect to impots.gouv
  steps.push({
    id: "prep_connexion",
    phase: "preparation",
    title: "Connectez-vous sur impots.gouv.fr",
    subtitle: "Ouvrez votre espace fiscal pour commencer la déclaration",
    content: (
      <div className="space-y-5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium text-blue-900">Ouvrez le site des impôts</p>
                <a
                  href={IMPOTS_LINKS.login}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1 text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  Ouvrir impots.gouv.fr
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium text-blue-900">Connectez-vous avec votre numéro fiscal</p>
                <p className="text-sm text-blue-700 mt-0.5">Votre numéro fiscal à 13 chiffres est sur votre dernier avis d&apos;imposition.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-medium text-blue-900">Cliquez sur &quot;Déclarer mes revenus&quot;</p>
                <p className="text-sm text-blue-700 mt-0.5">Dans le menu, sélectionnez &quot;Accéder à la déclaration en ligne&quot;.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <p className="font-medium text-blue-900">Vérifiez les montants pré-remplis</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  Salaires, pensions, revenus de capitaux... Comparez avec vos bulletins de paie.
                  Les erreurs sur les montants pré-remplis sont fréquentes.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Forms needed */}
        {(() => {
          const forms = [...new Set(result.opportunities.map(o => o.form))];
          const nonStandard = forms.filter(f => f !== "2042");
          if (nonStandard.length === 0) return null;
          return (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h4 className="font-bold text-primary mb-2">Formulaires à activer sur impots.gouv.fr</h4>
              <p className="text-sm text-text-light mb-3">
                Sur la première page de votre déclaration en ligne, il faut <strong>cocher des cases pour ajouter les formulaires annexes</strong>. Sans ça, les cases à remplir n&apos;apparaîtront pas. Cochez :
              </p>
              <div className="space-y-2">
                {nonStandard.map(f => {
                  const explanations: Record<string, string> = {
                    "2042-RICI": "Cochez « Réductions et crédits d'impôt » — pour vos dons, emploi à domicile, garde d'enfant, scolarité, etc.",
                    "2042-C-PRO": "Cochez « Revenus des professions non salariées » — pour votre micro-entreprise ou activité indépendante.",
                    "2044": "Cochez « Revenus fonciers » — pour vos revenus locatifs (location vide).",
                    "2042 + 2047": "Cochez « Revenus encaissés à l'étranger » — pour déclarer vos revenus frontaliers.",
                  };
                  return (
                    <div key={f} className="flex items-start gap-3 bg-white border border-primary/30 rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-primary">{f}</span>
                        <CopyButton text={f} />
                      </div>
                      {explanations[f] && (
                        <p className="text-xs text-text-light mt-0.5">{explanations[f]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    ),
  });

  // ── Phase 2: Declaration (one step per opportunity) ──
  for (const opp of result.opportunities) {
    steps.push({
      id: `opp_${opp.id}`,
      phase: "declaration",
      title: opp.title,
      subtitle: opp.boxes.length > 0
        ? `Case${opp.boxes.length > 1 ? "s" : ""} ${opp.boxes.join(", ")} — Formulaire ${opp.form}`
        : `Formulaire ${opp.form}`,
      content: <OpportunityStep opp={opp} />,
    });
  }

  // ── Phase 3: Vérification ──
  steps.push({
    id: "verif_relecture",
    phase: "verification",
    title: "Relisez votre déclaration",
    subtitle: "Parcourez chaque page pour vérifier les montants",
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h4 className="font-bold text-green-900 mb-3">Checklist de vérification</h4>
          <ul className="space-y-3">
            {[
              "Situation familiale correcte (mariage, PACS, enfants)",
              "Salaires et pensions correspondent aux bulletins de paie",
              "Toutes les cases spécifiques sont remplies (voir récapitulatif ci-dessous)",
              "Les montants des crédits/réductions sont cohérents",
              "Revenus exceptionnels correctement déclarés",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Recap table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-bold text-sm">Récapitulatif de vos cases</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-2 font-semibold text-text-lighter">Avantage</th>
                  <th className="px-4 py-2 font-semibold text-text-lighter">Formulaire</th>
                  <th className="px-4 py-2 font-semibold text-text-lighter">Case(s)</th>
                  <th className="px-4 py-2 font-semibold text-text-lighter text-right">Gain estimé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{opp.title}</td>
                    <td className="px-4 py-2.5 font-mono text-primary text-xs">{opp.form}</td>
                    <td className="px-4 py-2.5 font-mono text-primary font-bold">
                      {opp.boxes.length > 0 ? opp.boxes.join(", ") : "Auto"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-secondary">
                      {opp.estimatedSaving
                        ? opp.estimatedSaving.min === opp.estimatedSaving.max
                          ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} €`
                          : `${opp.estimatedSaving.min.toLocaleString("fr-FR")} – ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              {result.totalEstimatedMax > 0 && (
                <tfoot>
                  <tr className="bg-primary/5 font-bold">
                    <td className="px-4 py-2.5" colSpan={3}>Total estimé</td>
                    <td className="px-4 py-2.5 text-right font-mono text-primary">
                      {result.totalEstimatedMin === result.totalEstimatedMax
                        ? `${result.totalEstimatedMin.toLocaleString("fr-FR")} €`
                        : `${result.totalEstimatedMin.toLocaleString("fr-FR")} – ${result.totalEstimatedMax.toLocaleString("fr-FR")} €`}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    ),
  });

  steps.push({
    id: "verif_simulation",
    phase: "verification",
    title: "Lancez la simulation d'impôt",
    subtitle: "Vérifiez le montant calculé avant de valider",
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium text-green-900">Cliquez sur &quot;Estimer mon impôt&quot;</p>
                <p className="text-sm text-green-700 mt-0.5">Ce bouton se trouve en bas de la dernière page de votre déclaration en ligne.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium text-green-900">Comparez avec votre avis précédent</p>
                <p className="text-sm text-green-700 mt-0.5">
                  Vérifiez que l&apos;impôt estimé est cohérent. Les réductions et crédits doivent apparaître dans le détail.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-medium text-green-900">Vérifiez le gain de vos avantages</p>
                <p className="text-sm text-green-700 mt-0.5">
                  {result.totalEstimatedMax > 0
                    ? `Vous devriez constater une réduction d'environ ${result.totalEstimatedMin.toLocaleString("fr-FR")} à ${result.totalEstimatedMax.toLocaleString("fr-FR")} € par rapport à une déclaration sans optimisation.`
                    : "Vérifiez que vos avantages sont bien pris en compte dans la simulation."}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    ),
  });

  steps.push({
    id: "verif_signer",
    phase: "verification",
    title: "Signez et validez !",
    subtitle: "Dernière étape : validez officiellement votre déclaration",
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium text-green-900">Cliquez sur &quot;Signer ma déclaration&quot;</p>
                <p className="text-sm text-green-700 mt-0.5">Le bouton se trouve en bas de la page récapitulative.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium text-green-900">Téléchargez votre accusé de réception</p>
                <p className="text-sm text-green-700 mt-0.5">Vous recevrez aussi un email de confirmation. Conservez-le.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-medium text-green-900">Archivez tous vos justificatifs</p>
                <p className="text-sm text-green-700 mt-0.5">
                  Conservez-les <strong>3 ans minimum</strong> (délai de reprise de l&apos;administration fiscale).
                  Scannez-les si possible pour une sauvegarde numérique.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Bon à savoir :</strong> vous pouvez modifier votre déclaration autant de fois que vous le souhaitez
            jusqu&apos;à la date limite. Seule la dernière version sera prise en compte.
          </p>
        </div>
      </div>
    ),
  });

  return steps;
}

// ─── PDF generation ───
function sanitize(text: string): string {
  // Replace problematic Unicode chars that jsPDF can't render with standard font
  return text
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/—/g, " - ")
    .replace(/–/g, "-")
    .replace(/ /g, " ")
    .replace(/…/g, "...")
    .replace(/€/g, "EUR")
    .replace(/→/g, "->")
    .replace(/•/g, "-")
    .replace(/⚠/g, "/!\\")
    .replace(/[☐☑☒✓✔✗✘]/g, "-")
    .replace(/[^\x00-\xFF]/g, ""); // Strip remaining non-latin1
}

function generatePremiumPDF(result: TaxResult, _steps: Step[], _completedSteps: Record<string, boolean>) {
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();
    const m = 20; // margin
    const pw = 170; // page width usable
    let y = m;

    const pageBreak = (need: number) => {
      if (y + need > 275) { doc.addPage(); y = m; }
    };

    const drawSectionTitle = (title: string) => {
      pageBreak(15);
      y += 4;
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(m, y - 5, pw, 10, 2, 2, "F");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(sanitize(title), m + 4, y + 1);
      y += 10;
    };

    // ─── Page 1: Header ───
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 55, "F");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("RecupMesEuros", m, 22);
    doc.setFontSize(13);
    doc.text("Guide fiscal personnalise - Declaration 2026", m, 32);
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 255);
    doc.text(`Genere le ${new Date().toLocaleDateString("fr-FR")}`, m, 42);
    y = 65;

    // Summary boxes
    const boxW = pw / 3 - 3;
    const boxes = [
      { label: "Avantages detectes", value: String(result.opportunities.length), color: [30, 64, 175] as [number, number, number] },
      { label: "Gain potentiel max", value: result.totalEstimatedMax > 0 ? `${result.totalEstimatedMax.toLocaleString("fr-FR")} EUR` : "-", color: [5, 150, 105] as [number, number, number] },
      { label: "Formulaires concernes", value: String(new Set(result.opportunities.map(o => o.form)).size), color: [100, 100, 100] as [number, number, number] },
    ];

    boxes.forEach((b, i) => {
      const x = m + i * (boxW + 4);
      doc.setFillColor(245, 247, 255);
      doc.roundedRect(x, y, boxW, 22, 3, 3, "F");
      doc.setFontSize(18);
      doc.setTextColor(...b.color);
      doc.text(sanitize(b.value), x + boxW / 2, y + 10, { align: "center" });
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(sanitize(b.label), x + boxW / 2, y + 17, { align: "center" });
    });
    y += 30;

    // ─── Recap table ───
    drawSectionTitle("RECAPITULATIF DES CASES A REMPLIR");

    // Table header
    doc.setFillColor(240, 243, 255);
    doc.rect(m, y, pw, 8, "F");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text("Avantage fiscal", m + 2, y + 5.5);
    doc.text("Formulaire", m + 95, y + 5.5);
    doc.text("Case(s)", m + 125, y + 5.5);
    doc.text("Gain estime", m + 150, y + 5.5);
    y += 10;

    for (const opp of result.opportunities) {
      pageBreak(12);

      // Alternate row color
      const rowIdx = result.opportunities.indexOf(opp);
      if (rowIdx % 2 === 0) {
        doc.setFillColor(250, 250, 255);
        doc.rect(m, y - 3, pw, 9, "F");
      }

      doc.setFontSize(8);
      doc.setTextColor(30, 30, 30);
      const titleTrunc = sanitize(opp.title).substring(0, 45) + (opp.title.length > 45 ? "..." : "");
      doc.text(titleTrunc, m + 2, y + 2);

      doc.setTextColor(30, 64, 175);
      doc.text(sanitize(opp.form), m + 95, y + 2);

      doc.setFontSize(9);
      doc.text(opp.boxes.length > 0 ? opp.boxes.join(", ") : "Auto", m + 125, y + 2);

      doc.setFontSize(8);
      doc.setTextColor(5, 150, 105);
      if (opp.estimatedSaving) {
        const savingText = opp.estimatedSaving.min === opp.estimatedSaving.max
          ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} EUR`
          : `${opp.estimatedSaving.min.toLocaleString("fr-FR")}-${opp.estimatedSaving.max.toLocaleString("fr-FR")} EUR`;
        doc.text(sanitize(savingText), m + 150, y + 2);
      } else {
        doc.setTextColor(160, 160, 160);
        doc.text("-", m + 150, y + 2);
      }

      y += 8;
    }

    // Total row
    if (result.totalEstimatedMax > 0) {
      pageBreak(12);
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(m, y - 2, pw, 10, 2, 2, "F");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("TOTAL ESTIME", m + 2, y + 4);
      doc.text(
        sanitize(`${result.totalEstimatedMin.toLocaleString("fr-FR")} a ${result.totalEstimatedMax.toLocaleString("fr-FR")} EUR`),
        m + 150, y + 4
      );
      y += 14;
    }

    // ─── Detail per opportunity ───
    drawSectionTitle("DETAIL DE VOS AVANTAGES FISCAUX");

    for (const opp of result.opportunities) {
      pageBreak(40);

      // Title bar
      doc.setFillColor(245, 247, 255);
      doc.roundedRect(m, y - 2, pw, 10, 2, 2, "F");
      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175);
      doc.text(sanitize(opp.title), m + 3, y + 4);
      y += 12;

      // Description
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(sanitize(opp.description), pw - 4);
      doc.text(descLines, m + 2, y);
      y += descLines.length * 3.5 + 3;

      // Form + Cases box
      doc.setFillColor(230, 240, 255);
      doc.roundedRect(m, y - 1, 80, 12, 2, 2, "F");
      doc.setFontSize(8);
      doc.setTextColor(30, 64, 175);
      doc.text(`Formulaire: ${sanitize(opp.form)}`, m + 3, y + 4);
      doc.text(`Cases: ${opp.boxes.length > 0 ? opp.boxes.join("  ") : "Automatique"}`, m + 3, y + 9);

      // Saving box
      if (opp.estimatedSaving) {
        doc.setFillColor(230, 255, 240);
        doc.roundedRect(m + 85, y - 1, 85, 12, 2, 2, "F");
        doc.setTextColor(5, 150, 105);
        const saving = opp.estimatedSaving.min === opp.estimatedSaving.max
          ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} EUR`
          : `${opp.estimatedSaving.min.toLocaleString("fr-FR")} a ${opp.estimatedSaving.max.toLocaleString("fr-FR")} EUR`;
        doc.text(`Gain estime: ${sanitize(saving)}`, m + 88, y + 4);

        const typeLabels: Record<string, string> = {
          credit: "Credit d'impot",
          reduction: "Reduction d'impot",
          deduction: "Deduction",
          info: "Information",
        };
        doc.setTextColor(100, 100, 100);
        doc.text(typeLabels[opp.type] || opp.type, m + 88, y + 9);
      }

      y += 16;

      // Justificatifs
      if (opp.justificatifs.length > 0) {
        doc.setFontSize(7);
        doc.setTextColor(140, 100, 0);
        doc.text("Justificatifs a conserver:", m + 2, y);
        y += 3.5;
        for (const j of opp.justificatifs) {
          pageBreak(6);
          doc.setTextColor(120, 90, 0);
          doc.text(`  - ${sanitize(j)}`, m + 2, y);
          y += 3.5;
        }
      }

      // Separator
      y += 2;
      doc.setDrawColor(220, 220, 220);
      doc.line(m, y, m + pw, y);
      y += 5;
    }

    // ─── Calendar ───
    drawSectionTitle("CALENDRIER FISCAL 2026");

    for (const c of CALENDRIER_FISCAL) {
      pageBreak(8);
      const d = new Date(c.date);
      const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      const isPast = d < new Date();

      doc.setFontSize(9);
      doc.setTextColor(isPast ? 160 : 30, isPast ? 160 : 64, isPast ? 160 : 175);
      doc.text(dateStr, m + 2, y + 1);
      doc.setTextColor(isPast ? 160 : 60, isPast ? 160 : 60, isPast ? 160 : 60);
      doc.text(sanitize(c.label), m + 30, y + 1);
      y += 6;
    }

    // ─── Warnings ───
    if (result.warnings.length > 0) {
      drawSectionTitle("POINTS D'ATTENTION");

      for (const w of result.warnings) {
        pageBreak(12);
        doc.setFillColor(255, 248, 235);
        const wLines = doc.splitTextToSize(sanitize(`/!\\ ${w}`), pw - 8);
        const boxH = wLines.length * 3.5 + 5;
        doc.roundedRect(m, y - 2, pw, boxH, 2, 2, "F");
        doc.setFontSize(7.5);
        doc.setTextColor(140, 80, 0);
        doc.text(wLines, m + 4, y + 2);
        y += boxH + 3;
      }
    }

    // ─── Footer ───
    pageBreak(15);
    y += 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(m, y, m + pw, y);
    y += 5;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Les resultats sont indicatifs. Verifiez votre situation sur impots.gouv.fr ou aupres d'un professionnel.", m, y);
    y += 3.5;
    doc.text("RecupMesEuros - Guide fiscal personnalise - recupmeseuros.vercel.app", m, y);

    doc.save("recupmeseuros-guide-fiscal.pdf");
  }).catch(() => {
    alert("Erreur lors de la generation du PDF. Veuillez reessayer.");
  });
}

// ─── Deadline countdown ───
function getNextDeadline(): { date: Date; label: string; daysLeft: number } | null {
  const now = new Date();
  for (const c of CALENDRIER_FISCAL) {
    const d = new Date(c.date);
    if (d > now) {
      const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { date: d, label: c.label, daysLeft: diff };
    }
  }
  return null;
}

// ─── Main component ───
export default function DashboardClient() {
  const router = useRouter();
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<"guide" | "recap" | "simulateurs">("guide");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPremium()) {
      router.push("/resultats");
      return;
    }

    const raw = localStorage.getItem("recupmeseuros_answers") || sessionStorage.getItem("recupmeseuros_answers");
    if (!raw) {
      router.push("/questionnaire");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const validated = QuestionnaireAnswers.parse(parsed);
      const res = evaluateTaxOpportunities(validated);
      setResult(res);
    } catch {
      router.push("/questionnaire");
      return;
    }

    // Load saved progress
    const saved = localStorage.getItem("recupmeseuros_progress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.completedSteps) setCompletedSteps(data.completedSteps);
        if (typeof data.currentStep === "number") setCurrentStepIndex(data.currentStep);
      } catch { /* ignore */ }
    }

    setLoading(false);
  }, [router]);

  // Save progress
  const saveProgress = useCallback((steps: Record<string, boolean>, stepIdx: number) => {
    localStorage.setItem("recupmeseuros_progress", JSON.stringify({
      completedSteps: steps,
      currentStep: stepIdx,
    }));
  }, []);

  if (loading || !result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  const steps = buildSteps(result);
  const currentStep = steps[currentStepIndex];
  const totalCompleted = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((totalCompleted / steps.length) * 100);
  const deadline = getNextDeadline();

  const phases = ["preparation", "declaration", "verification"] as const;
  const phaseSteps = (phase: typeof phases[number]) => steps.filter(s => s.phase === phase);

  const markCompleteAndNext = () => {
    const next = { ...completedSteps, [currentStep.id]: true };
    setCompletedSteps(next);
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      saveProgress(next, nextIdx);
    } else {
      saveProgress(next, currentStepIndex);
    }
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToStep = (idx: number) => {
    setCurrentStepIndex(idx);
    saveProgress(completedSteps, idx);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ─── Header banner ─── */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 md:p-8 mb-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Mon espace fiscal</p>
            <h1 className="text-2xl md:text-3xl font-bold">
              Votre guide de déclaration personnalisé
            </h1>
            <p className="text-blue-100 mt-1">
              {result.opportunities.length} avantage{result.opportunities.length > 1 ? "s" : ""} détecté{result.opportunities.length > 1 ? "s" : ""}
              {result.totalEstimatedMax > 0 && (
                <> — jusqu&apos;à <strong>{result.totalEstimatedMax.toLocaleString("fr-FR")} €</strong> de gain potentiel</>
              )}
            </p>
          </div>
          {deadline && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center shrink-0">
              <p className="text-3xl font-bold">{deadline.daysLeft}</p>
              <p className="text-xs text-blue-200">jours restants</p>
              <p className="text-xs text-blue-100 mt-1 max-w-[160px]">{deadline.label}</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-blue-200">Progression de votre guide</span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100 ? "bg-green-400" : "bg-gradient-to-r from-accent to-accent-light"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-blue-200 mt-1">
            Étape {currentStepIndex + 1} sur {steps.length}
          </p>
        </div>
      </div>

      {/* ─── Quick stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-primary">{result.opportunities.length}</p>
          <p className="text-xs text-text-light">Avantages détectés</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-secondary">
            {result.totalEstimatedMax > 0 ? `${result.totalEstimatedMax.toLocaleString("fr-FR")} €` : "—"}
          </p>
          <p className="text-xs text-text-light">Gain potentiel max</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold">{new Set(result.opportunities.map(o => o.form)).size}</p>
          <p className="text-xs text-text-light">Formulaires concernés</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold">{result.opportunities.reduce((n, o) => n + o.boxes.length, 0)}</p>
          <p className="text-xs text-text-light">Cases à remplir</p>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {([
          ["guide", "Guide pas à pas", "🚀"],
          ["recap", "Récapitulatif", "📊"],
          ["simulateurs", "Simulateurs", "🧮"],
        ] as const).map(([key, label, icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveView(key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeView === key
                ? "border-primary text-primary"
                : "border-transparent text-text-light hover:text-text"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ═══════════════ VIEW: GUIDE PAS À PAS ═══════════════ */}
      {activeView === "guide" && (
        <div className="animate-fadeIn" ref={contentRef}>
          {/* Phase navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {phases.map((phase) => {
              const config = PHASE_CONFIG[phase];
              const pSteps = phaseSteps(phase);
              const pCompleted = pSteps.filter(s => completedSteps[s.id]).length;
              const isCurrent = currentStep.phase === phase;
              return (
                <button
                  key={phase}
                  type="button"
                  onClick={() => {
                    const firstInPhase = steps.findIndex(s => s.phase === phase);
                    if (firstInPhase >= 0) goToStep(firstInPhase);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                    isCurrent
                      ? `${config.lightColor} border-2`
                      : "bg-white border-gray-200 text-text-light hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    pCompleted === pSteps.length && pSteps.length > 0 ? "bg-green-500" : config.color
                  }`}>
                    {pCompleted === pSteps.length && pSteps.length > 0 ? "✓" : config.icon}
                  </span>
                  {config.label}
                  <span className="text-xs opacity-70">{pCompleted}/{pSteps.length}</span>
                </button>
              );
            })}
          </div>

          {/* Step sidebar + content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar: step list */}
            <div className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-4 space-y-1 max-h-[60vh] overflow-y-auto">
                {steps.map((step, idx) => {
                  const isDone = completedSteps[step.id];
                  const isCurrent = idx === currentStepIndex;
                  // Show phase divider
                  const showDivider = idx === 0 || steps[idx - 1].phase !== step.phase;
                  return (
                    <div key={step.id}>
                      {showDivider && (
                        <p className={`text-xs font-bold uppercase tracking-wider px-3 pt-3 pb-1 ${
                          PHASE_CONFIG[step.phase].lightColor.split(" ")[1] || "text-text-lighter"
                        }`}>
                          {PHASE_CONFIG[step.phase].label}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => goToStep(idx)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          isCurrent
                            ? "bg-primary/10 text-primary font-semibold"
                            : isDone
                            ? "text-text-lighter hover:bg-gray-50"
                            : "text-text hover:bg-gray-50"
                        }`}
                      >
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                          isDone
                            ? "bg-green-500 border-green-500 text-white"
                            : isCurrent
                            ? "bg-primary border-primary text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}>
                          {isDone ? "✓" : idx + 1}
                        </span>
                        <span className={`truncate ${isDone && !isCurrent ? "line-through" : ""}`}>
                          {step.title}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 min-w-0">
              {/* Step header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PHASE_CONFIG[currentStep.phase].lightColor}`}>
                    {PHASE_CONFIG[currentStep.phase].label}
                  </span>
                  <span className="text-xs text-text-lighter">
                    Étape {currentStepIndex + 1} / {steps.length}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold">{currentStep.title}</h2>
                {currentStep.subtitle && (
                  <p className="text-text-light mt-1">{currentStep.subtitle}</p>
                )}
              </div>

              {/* Step content */}
              <div className="mb-8">
                {currentStep.content}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Précédent
                  </button>
                )}
                <button
                  type="button"
                  onClick={markCompleteAndNext}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    completedSteps[currentStep.id]
                      ? currentStepIndex < steps.length - 1
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-green-100 text-green-700"
                      : "bg-primary text-white hover:bg-primary-dark shadow-lg"
                  }`}
                >
                  {currentStepIndex === steps.length - 1 ? (
                    completedSteps[currentStep.id] ? (
                      <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Terminé !</>
                    ) : (
                      <>Terminer le guide</>
                    )
                  ) : (
                    completedSteps[currentStep.id] ? (
                      <>Étape suivante <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
                    ) : (
                      <>Valider et continuer <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
                    )
                  )}
                </button>
              </div>

              {/* Completion celebration */}
              {progressPercent === 100 && (
                <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center animate-fadeIn">
                  <span className="text-4xl block mb-2">🎉</span>
                  <h3 className="text-lg font-bold text-green-800 mb-1">Déclaration terminée !</h3>
                  <p className="text-sm text-green-700">
                    Vous avez complété toutes les étapes. N&apos;oubliez pas de valider et signer votre déclaration sur impots.gouv.fr.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ VIEW: RÉCAPITULATIF ═══════════════ */}
      {activeView === "recap" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Recap table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-sm">Récapitulatif des cases à remplir</h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-xs text-primary font-medium hover:underline print:hidden"
              >
                Imprimer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2 font-semibold text-text-lighter">Avantage</th>
                    <th className="px-4 py-2 font-semibold text-text-lighter">Formulaire</th>
                    <th className="px-4 py-2 font-semibold text-text-lighter">Case(s)</th>
                    <th className="px-4 py-2 font-semibold text-text-lighter text-right">Gain estimé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium">{opp.title}</td>
                      <td className="px-4 py-2.5 font-mono text-primary text-xs">{opp.form}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-primary font-bold">
                            {opp.boxes.length > 0 ? opp.boxes.join(", ") : "Auto"}
                          </span>
                          {opp.boxes.length > 0 && <CopyButton text={opp.boxes.join(", ")} />}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-secondary">
                        {opp.estimatedSaving
                          ? opp.estimatedSaving.min === opp.estimatedSaving.max
                            ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} €`
                            : `${opp.estimatedSaving.min.toLocaleString("fr-FR")} – ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {result.totalEstimatedMax > 0 && (
                  <tfoot>
                    <tr className="bg-primary/5 font-bold">
                      <td className="px-4 py-2.5" colSpan={3}>Total estimé</td>
                      <td className="px-4 py-2.5 text-right font-mono text-primary">
                        {result.totalEstimatedMin === result.totalEstimatedMax
                          ? `${result.totalEstimatedMin.toLocaleString("fr-FR")} €`
                          : `${result.totalEstimatedMin.toLocaleString("fr-FR")} – ${result.totalEstimatedMax.toLocaleString("fr-FR")} €`}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Details per opportunity */}
          {result.opportunities.map((opp) => {
            const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
              credit: { label: "Crédit d'impôt", cls: "bg-green-100 text-green-800" },
              reduction: { label: "Réduction d'impôt", cls: "bg-blue-100 text-blue-800" },
              deduction: { label: "Déduction", cls: "bg-purple-100 text-purple-800" },
              info: { label: "Information", cls: "bg-gray-100 text-gray-700" },
            };
            const badge = TYPE_BADGE[opp.type];
            return (
              <details key={opp.id} className="bg-white rounded-xl border-2 border-primary/10 group open:border-primary/30">
                <summary className="p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                          {badge.label}
                        </span>
                        {opp.estimatedSaving && (
                          <span className="text-xs font-bold text-secondary">
                            {opp.estimatedSaving.min === opp.estimatedSaving.max
                              ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} €`
                              : `${opp.estimatedSaving.min.toLocaleString("fr-FR")} – ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold">{opp.title}</h3>
                    </div>
                  </div>
                </summary>
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <OpportunityStep opp={opp} />
                </div>
              </details>
            );
          })}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Points d&apos;attention</h3>
              <div className="space-y-2">
                {result.warnings.map((w, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ VIEW: SIMULATEURS ═══════════════ */}
      {activeView === "simulateurs" && (
        <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
          {([
            { href: "/simulateurs/impot-revenu", icon: "💰", title: "Simulateur d'impôt sur le revenu", desc: "Estimez votre IR : barème, décote, quotient familial, réductions et crédits." },
            { href: "/simulateurs/frais-reels", icon: "🚗", title: "Simulateur frais réels", desc: "Frais kilométriques, repas, télétravail. Comparez avec l'abattement de 10%." },
            { href: "/simulateurs/tmi", icon: "📊", title: "Tranche marginale (TMI)", desc: "Calculez votre TMI et visualisez la répartition par tranche." },
            { href: "/simulateurs/micro-entrepreneur", icon: "🏪", title: "Micro-entrepreneur", desc: "Barème classique vs versement libératoire. Cotisations et impôt." },
            { href: "/simulateurs/emploi-domicile", icon: "🏠", title: "Crédit emploi à domicile", desc: "Ménage, jardinage, garde, soutien scolaire... Calculez votre crédit de 50%." },
            { href: "/simulateurs/per", icon: "🏦", title: "Simulateur PER", desc: "Économie d'impôt selon votre TMI et votre plafond PER disponible." },
            { href: "/simulateurs/dons", icon: "❤️", title: "Réduction pour dons", desc: "Dons associations (66%), aide aux personnes (75%), partis politiques." },
            { href: "/simulateurs/quotient-familial", icon: "👨‍👩‍👧‍👦", title: "Quotient familial", desc: "Impact du mariage, PACS, enfants et garde alternée sur votre impôt." },
            { href: "/simulateurs/rattachement-pension", icon: "👨‍👩‍👧", title: "Rattachement ou pension ?", desc: "Comparez rattachement d'un enfant majeur vs pension alimentaire." },
            { href: "/simulateurs/revenus-fonciers", icon: "🏘️", title: "Revenus fonciers", desc: "Micro-foncier vs régime réel. Déficit foncier et prélèvements sociaux." },
            { href: "/simulateurs/plus-value-immobiliere", icon: "🔑", title: "Plus-value immobilière", desc: "Taxe à la vente : abattements par durée, IR, PS et surtaxe." },
          ] as const).map((sim) => (
            <Link
              key={sim.href}
              href={sim.href}
              className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 block">{sim.icon}</span>
              <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{sim.title}</h3>
              <p className="text-sm text-text-light mb-2">{sim.desc}</p>
              <span className="text-sm text-primary font-medium">Lancer →</span>
            </Link>
          ))}
        </div>
      )}

      {/* ─── Actions ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 mb-6">
        <button
          type="button"
          onClick={() => generatePremiumPDF(result, steps, completedSteps)}
          className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors"
        >
          Télécharger le guide complet PDF
        </button>
        <Link
          href="/questionnaire"
          className="flex-1 text-center border-2 border-gray-200 font-bold py-3 px-6 rounded-xl hover:border-gray-300 transition-colors"
        >
          Refaire le questionnaire
        </Link>
      </div>

      <Disclaimer compact />
    </div>
  );
}
