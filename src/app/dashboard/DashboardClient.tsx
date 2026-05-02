"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { evaluateTaxOpportunities } from "@/lib/engine";
import { QuestionnaireAnswers } from "@/data/types";
import type { TaxResult, TaxOpportunity, ScoreLevel } from "@/data/types";
import { isPremium } from "@/lib/premium";
import { CALENDRIER_FISCAL } from "@/data/taxRules2026";
import Disclaimer from "@/components/Disclaimer";

// ─── Checklist item ───
interface CheckItem {
  id: string;
  label: string;
  detail: string;
  category: "preparation" | "formulaire" | "verification";
}

function buildChecklist(result: TaxResult): CheckItem[] {
  const items: CheckItem[] = [];

  // Preparation
  items.push({
    id: "prep_avis",
    label: "Récupérer votre dernier avis d'imposition",
    detail: "Vous y trouverez votre numéro fiscal, votre revenu fiscal de référence, et votre plafond d'épargne retraite.",
    category: "preparation",
  });
  items.push({
    id: "prep_login",
    label: "Se connecter sur impots.gouv.fr",
    detail: "Munissez-vous de votre numéro fiscal (13 chiffres) et de votre mot de passe. Accédez à « Déclarer mes revenus ».",
    category: "preparation",
  });
  items.push({
    id: "prep_prerempli",
    label: "Vérifier les montants pré-remplis",
    detail: "Salaires, pensions, revenus de capitaux mobiliers... Vérifiez que tout correspond à vos bulletins de paie et relevés.",
    category: "preparation",
  });

  // One item per opportunity
  for (const opp of result.opportunities) {
    const boxStr = opp.boxes.length > 0 ? ` → Case${opp.boxes.length > 1 ? "s" : ""} ${opp.boxes.join(", ")}` : "";

    items.push({
      id: `opp_${opp.id}`,
      label: `${opp.title}${boxStr}`,
      detail: buildStepByStep(opp),
      category: "formulaire",
    });
  }

  // Final verification
  items.push({
    id: "verif_relecture",
    label: "Relire l'ensemble de la déclaration",
    detail: "Parcourez chaque page de votre déclaration en ligne. Vérifiez les montants, la situation familiale, et les annexes ajoutées.",
    category: "verification",
  });
  items.push({
    id: "verif_simulation",
    label: "Lancer la simulation d'impôt",
    detail: "Avant de valider, cliquez sur « Estimer mon impôt » en bas de la déclaration. Comparez avec votre avis précédent.",
    category: "verification",
  });
  items.push({
    id: "verif_signer",
    label: "Signer et valider la déclaration",
    detail: "Cliquez sur « Signer ma déclaration ». Vous recevrez un accusé de réception par email. Vous pouvez modifier jusqu'à la date limite.",
    category: "verification",
  });
  items.push({
    id: "verif_justificatifs",
    label: "Archiver tous les justificatifs",
    detail: "Conservez vos justificatifs pendant 3 ans minimum (délai de reprise de l'administration fiscale). Scannez-les si possible.",
    category: "verification",
  });

  return items;
}

function buildStepByStep(opp: TaxOpportunity): string {
  const steps: string[] = [];

  if (opp.form === "2042-RICI") {
    steps.push("Dans votre déclaration en ligne, cliquez sur « Revenus et charges » puis cochez « Réductions et crédits d'impôt » pour ajouter le formulaire 2042-RICI.");
  } else if (opp.form === "2042-C-PRO") {
    steps.push("Cochez « Revenus des professions non salariées » pour accéder au formulaire 2042-C-PRO.");
  } else if (opp.form === "2044") {
    steps.push("Cochez « Revenus fonciers » pour accéder au formulaire 2044 (déclaration des revenus fonciers).");
  }

  if (opp.boxes.length > 0) {
    steps.push(`Recherchez la case ${opp.boxes[0]} (utilisez Ctrl+F ou le champ de recherche de la déclaration en ligne). Renseignez le montant correspondant.`);
    if (opp.boxes.length > 1) {
      steps.push(`Cases alternatives : ${opp.boxes.slice(1).join(", ")} (selon votre situation : déclarant 1, déclarant 2, personne à charge).`);
    }
  }

  if (opp.justificatifs.length > 0) {
    steps.push(`Justificatifs à conserver : ${opp.justificatifs.join(" ; ")}.`);
  }

  return steps.join("\n\n");
}

const SCORE_COLORS: Record<ScoreLevel, string> = {
  faible: "from-gray-400 to-gray-500",
  moyen: "from-amber-400 to-amber-500",
  eleve: "from-green-400 to-green-500",
};

const CATEGORY_LABELS = {
  preparation: { label: "Préparation", icon: "📋", color: "text-blue-700 bg-blue-50 border-blue-200" },
  formulaire: { label: "Cases à remplir", icon: "✍️", color: "text-primary bg-primary/5 border-primary/20" },
  verification: { label: "Vérification finale", icon: "✅", color: "text-green-700 bg-green-50 border-green-200" },
};

function generatePremiumPDF(result: TaxResult, checklist: CheckItem[], checked: Record<string, boolean>) {
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();
    const m = 20;
    let y = m;

    // Title
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text("RecupMesEuros", m, y);
    doc.setFontSize(14);
    doc.setTextColor(100);
    y += 8;
    doc.text("Guide fiscal personnalisé — Déclaration 2026 (revenus 2025)", m, y);
    y += 6;
    doc.setFontSize(9);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, m, y);
    y += 12;

    // Score
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Score d'opportunité : ${result.score.toUpperCase()}`, m, y);
    y += 7;

    if (result.totalEstimatedMax > 0) {
      doc.setFontSize(13);
      doc.setTextColor(5, 150, 105);
      doc.text(`Gain potentiel estimé : ${result.totalEstimatedMin.toLocaleString("fr-FR")} à ${result.totalEstimatedMax.toLocaleString("fr-FR")} €`, m, y);
      y += 10;
    }
    y += 3;

    // Separator
    doc.setDrawColor(200);
    doc.line(m, y, 190, y);
    y += 8;

    // Detailed opportunities
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("VOS AVANTAGES FISCAUX DÉTAILLÉS", m, y);
    y += 8;

    for (const opp of result.opportunities) {
      if (y > 230) { doc.addPage(); y = m; }

      // Title with type badge
      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175);
      doc.text(opp.title, m, y);
      y += 6;

      // Description
      doc.setFontSize(9);
      doc.setTextColor(60);
      const descLines = doc.splitTextToSize(opp.description, 170);
      doc.text(descLines, m, y);
      y += descLines.length * 3.8 + 2;

      // Box highlight
      doc.setFillColor(240, 245, 255);
      doc.roundedRect(m, y - 1, 170, opp.boxes.length > 0 ? 16 : 10, 2, 2, "F");

      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175);
      doc.text(`Formulaire : ${opp.form}`, m + 4, y + 4);
      if (opp.boxes.length > 0) {
        doc.setFontSize(11);
        doc.text(`Cases : ${opp.boxes.join("  /  ")}`, m + 4, y + 10);
        y += 18;
      } else {
        y += 12;
      }

      // Estimated saving
      if (opp.estimatedSaving) {
        doc.setFontSize(10);
        doc.setTextColor(5, 150, 105);
        doc.text(`Gain estimé : ${opp.estimatedSaving.min.toLocaleString("fr-FR")} à ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`, m, y);
        y += 5;
      }

      // Step-by-step
      doc.setFontSize(9);
      doc.setTextColor(60);
      const steps = buildStepByStep(opp);
      const stepLines = doc.splitTextToSize(steps, 165);
      doc.text(stepLines, m + 2, y);
      y += stepLines.length * 3.8 + 3;

      // Separator
      doc.setDrawColor(220);
      doc.line(m, y, 190, y);
      y += 6;
    }

    // Checklist
    if (y > 200) { doc.addPage(); y = m; }
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("CHECKLIST DE DÉCLARATION", m, y);
    y += 8;

    for (const item of checklist) {
      if (y > 270) { doc.addPage(); y = m; }
      const isChecked = checked[item.id];
      doc.setFontSize(9);
      doc.setTextColor(isChecked ? 150 : 0);
      doc.text(`${isChecked ? "☑" : "☐"} ${item.label}`, m, y);
      y += 4.5;
    }

    // Warnings
    if (result.warnings.length > 0) {
      if (y > 240) { doc.addPage(); y = m; }
      y += 5;
      doc.setFontSize(12);
      doc.setTextColor(180, 80, 0);
      doc.text("POINTS D'ATTENTION", m, y);
      y += 7;
      doc.setFontSize(9);
      doc.setTextColor(80);
      for (const w of result.warnings) {
        if (y > 270) { doc.addPage(); y = m; }
        const wl = doc.splitTextToSize(`⚠ ${w}`, 170);
        doc.text(wl, m, y);
        y += wl.length * 3.8 + 3;
      }
    }

    // Calendar
    if (y > 240) { doc.addPage(); y = m; }
    y += 5;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("DATES CLÉS 2026", m, y);
    y += 7;
    doc.setFontSize(9);
    doc.setTextColor(60);
    for (const c of CALENDRIER_FISCAL) {
      const d = new Date(c.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      doc.text(`${d} — ${c.label}`, m, y);
      y += 4.5;
    }

    // Footer
    if (y > 260) { doc.addPage(); y = m; }
    y += 8;
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text("Les résultats sont indicatifs. Vérifiez votre situation sur impots.gouv.fr ou auprès d'un professionnel.", m, y);
    y += 4;
    doc.text("© RecupMesEuros — Guide fiscal personnalisé", m, y);

    doc.save("recupmeseuros-guide-complet.pdf");
  }).catch(() => {
    alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
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

export default function DashboardClient() {
  const router = useRouter();
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"checklist" | "details" | "simulateurs">("checklist");

  useEffect(() => {
    if (!isPremium()) {
      router.push("/resultats");
      return;
    }

    const raw = sessionStorage.getItem("recupmeseuros_answers");
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

    // Load saved checklist state
    const saved = localStorage.getItem("recupmeseuros_checklist");
    if (saved) {
      try { setCheckedItems(JSON.parse(saved)); } catch { /* ignore */ }
    }

    setLoading(false);
  }, [router]);

  const toggleCheck = useCallback((id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("recupmeseuros_checklist", JSON.stringify(next));
      return next;
    });
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

  const checklist = buildChecklist(result);
  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = checklist.length;
  const progressPercent = Math.round((totalChecked / totalItems) * 100);
  const deadline = getNextDeadline();

  const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
    credit: { label: "Crédit d'impôt", cls: "bg-green-100 text-green-800" },
    reduction: { label: "Réduction d'impôt", cls: "bg-blue-100 text-blue-800" },
    deduction: { label: "Déduction", cls: "bg-purple-100 text-purple-800" },
    info: { label: "Information", cls: "bg-gray-100 text-gray-700" },
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
            <span className="text-blue-200">Avancement de votre déclaration</span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100
                  ? "bg-green-400"
                  : "bg-gradient-to-r from-accent to-accent-light"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-blue-200 mt-1">
            {totalChecked}/{totalItems} étapes complétées
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
          ["checklist", "Checklist déclaration", "📋"],
          ["details", "Détail par avantage", "🎯"],
          ["simulateurs", "Simulateurs", "🧮"],
        ] as const).map(([key, label, icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-text-light hover:text-text"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Checklist ─── */}
      {activeTab === "checklist" && (
        <div className="space-y-6 animate-fadeIn">
          {(["preparation", "formulaire", "verification"] as const).map((cat) => {
            const catItems = checklist.filter((c) => c.category === cat);
            if (catItems.length === 0) return null;
            const catConfig = CATEGORY_LABELS[cat];
            const catChecked = catItems.filter((c) => checkedItems[c.id]).length;

            return (
              <div key={cat}>
                <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border ${catConfig.color}`}>
                  <span>{catConfig.icon}</span>
                  <span className="font-semibold text-sm">{catConfig.label}</span>
                  <span className="ml-auto text-xs">{catChecked}/{catItems.length}</span>
                </div>
                <div className="space-y-2">
                  {catItems.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-lg border transition-all ${
                          isChecked ? "border-green-200 bg-green-50/30" : "border-gray-200"
                        }`}
                      >
                        <label className="flex items-start gap-3 p-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCheck(item.id)}
                            className="mt-0.5 w-5 h-5 rounded text-green-600 focus:ring-green-500 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${isChecked ? "line-through text-text-lighter" : ""}`}>
                              {item.label}
                            </p>
                            <p className="text-xs text-text-light mt-1 whitespace-pre-line">
                              {item.detail}
                            </p>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {progressPercent === 100 && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center animate-fadeIn">
              <span className="text-4xl block mb-2">🎉</span>
              <h3 className="text-lg font-bold text-green-800 mb-1">Déclaration terminée !</h3>
              <p className="text-sm text-green-700">
                Vous avez complété toutes les étapes. N&apos;oubliez pas de valider et signer votre déclaration sur impots.gouv.fr.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Details ─── */}
      {activeTab === "details" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Compact cases recap table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print:shadow-none">
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

          {result.opportunities.map((opp) => {
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
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                  <p className="text-sm text-text-light">{opp.description}</p>

                  {/* How-to box */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">Comment remplir, étape par étape :</h4>
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                      <li>Connectez-vous sur <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline font-medium">impots.gouv.fr</a> et accédez à votre déclaration</li>
                      {opp.form === "2042-RICI" && (
                        <li>Dans les annexes, cochez <strong>&quot;Réductions et crédits d&apos;impôt&quot;</strong> pour ajouter le formulaire <strong>2042-RICI</strong></li>
                      )}
                      {opp.form === "2042-C-PRO" && (
                        <li>Cochez <strong>&quot;Revenus des professions non salariées&quot;</strong> pour accéder au formulaire <strong>2042-C-PRO</strong></li>
                      )}
                      {opp.form === "2044" && (
                        <li>Cochez <strong>&quot;Revenus fonciers&quot;</strong> pour accéder au formulaire <strong>2044</strong></li>
                      )}
                      {opp.boxes.length > 0 && (
                        <li>
                          Cherchez la case <strong className="font-mono text-primary">{opp.boxes[0]}</strong>
                          {opp.boxes.length > 1 && <> (ou {opp.boxes.slice(1).map(b => <strong key={b} className="font-mono text-primary">{b}</strong>).reduce<React.ReactNode[]>((a, b) => a.length ? [...a, ", ", b] : [b], [])})</>}
                          {" "}et renseignez le montant
                        </li>
                      )}
                      <li>Vérifiez le résumé et passez à la suite</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <p className="text-xs font-semibold text-text-lighter mb-1">Formulaire</p>
                      <p className="font-mono font-bold text-primary text-lg">{opp.form}</p>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <p className="text-xs font-semibold text-text-lighter mb-1">Cases à remplir</p>
                      <p className="font-mono font-bold text-primary text-lg">{opp.boxes.length > 0 ? opp.boxes.join("  ") : "Automatique"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-text-lighter mb-2">Justificatifs à conserver (3 ans minimum)</h4>
                    <ul className="space-y-1">
                      {opp.justificatifs.map((j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-text-light">
                          <span className="text-green-600 mt-0.5">✓</span>
                          {j}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={opp.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Voir sur impots.gouv.fr →
                    </a>
                    {opp.guideLink && (
                      <Link href={opp.guideLink} className="text-sm bg-secondary/10 text-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/20 transition-colors">
                        Notre guide détaillé →
                      </Link>
                    )}
                  </div>
                </div>
              </details>
            );
          })}

          {result.opportunities.length === 0 && (
            <p className="text-center text-text-light py-8">Aucun avantage détecté.</p>
          )}
        </div>
      )}

      {/* ─── Tab: Simulateurs ─── */}
      {activeTab === "simulateurs" && (
        <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
          <Link
            href="/simulateurs/frais-reels"
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <span className="text-3xl mb-3 block">🚗</span>
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              Simulateur frais réels
            </h3>
            <p className="text-sm text-text-light mb-3">
              Calculez vos frais kilométriques, repas et télétravail. Comparez avec l&apos;abattement de 10% en temps réel.
            </p>
            <span className="text-sm text-primary font-medium">Lancer le simulateur →</span>
          </Link>

          <Link
            href="/simulateurs/rattachement-pension"
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <span className="text-3xl mb-3 block">👨‍👩‍👧</span>
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              Rattachement ou pension ?
            </h3>
            <p className="text-sm text-text-light mb-3">
              Comparez l&apos;impact fiscal du rattachement d&apos;un enfant majeur vs la déduction d&apos;une pension alimentaire.
            </p>
            <span className="text-sm text-primary font-medium">Lancer le simulateur →</span>
          </Link>

          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 opacity-60">
            <span className="text-3xl mb-3 block">🏠</span>
            <h3 className="font-bold text-lg mb-2">Simulateur revenus fonciers</h3>
            <p className="text-sm text-text-light mb-3">
              Micro-foncier vs régime réel, LMNP vs LMP... Comparez les régimes.
            </p>
            <span className="text-sm text-text-lighter font-medium">Bientôt disponible</span>
          </div>

          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 opacity-60">
            <span className="text-3xl mb-3 block">💰</span>
            <h3 className="font-bold text-lg mb-2">Simulateur d&apos;impôt complet</h3>
            <p className="text-sm text-text-light mb-3">
              Estimez votre impôt net après toutes les réductions et crédits détectés.
            </p>
            <span className="text-sm text-text-lighter font-medium">Bientôt disponible</span>
          </div>
        </div>
      )}

      {/* ─── Warnings ─── */}
      {result.warnings.length > 0 && (
        <div className="mt-8 mb-6">
          <h2 className="text-lg font-bold mb-3">Points d&apos;attention</h2>
          <div className="space-y-2">
            {result.warnings.map((w, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Actions ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 mb-6">
        <button
          type="button"
          onClick={() => generatePremiumPDF(result, checklist, checkedItems)}
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
