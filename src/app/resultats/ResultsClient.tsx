"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { evaluateTaxOpportunities } from "@/lib/engine";
import { QuestionnaireAnswers } from "@/data/types";
import type { TaxResult, TaxOpportunity } from "@/data/types";
import { isPremium, setPremium, PREMIUM_TIERS, PREMIUM_PRICE } from "@/lib/premium";
import type { PremiumTier } from "@/lib/premium";
import Disclaimer from "@/components/Disclaimer";

const SCORE_CONFIG = {
  faible: {
    label: "Faible",
    color: "text-text-light",
    bg: "bg-gray-100",
    desc: "Peu d'opportunités détectées, mais vérifiez quand même !",
  },
  moyen: {
    label: "Moyen",
    color: "text-amber-700",
    bg: "bg-amber-50",
    desc: "Quelques avantages à vérifier sur votre déclaration.",
  },
  eleve: {
    label: "Élevé",
    color: "text-green-700",
    bg: "bg-green-50",
    desc: "Plusieurs opportunités détectées. Prenez le temps de vérifier !",
  },
};

const TYPE_BADGE = {
  credit: { label: "Crédit d'impôt", class: "bg-green-100 text-green-800" },
  reduction: { label: "Réduction d'impôt", class: "bg-blue-100 text-blue-800" },
  deduction: { label: "Déduction", class: "bg-purple-100 text-purple-800" },
  info: { label: "Information", class: "bg-gray-100 text-gray-700" },
};

// ─── Free card: shows title + estimation but locks details ───
function FreeOpportunityCard({ opp, onUnlock }: { opp: TaxOpportunity; onUnlock: () => void }) {
  const badge = TYPE_BADGE[opp.type];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${badge.class}`}>
              {badge.label}
            </span>
            <h3 className="font-bold text-lg">{opp.title}</h3>
            {opp.estimatedSaving && (
              <p className="text-secondary font-semibold mt-1">
                Gain estimé :{" "}
                {opp.estimatedSaving.min === opp.estimatedSaving.max
                  ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} €`
                  : `${opp.estimatedSaving.min.toLocaleString("fr-FR")} à ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`}
              </p>
            )}
            <p className="text-sm text-text-light mt-2 line-clamp-2">{opp.description}</p>
          </div>
        </div>
      </div>
      {/* Locked section */}
      <div className="relative border-t border-gray-100 bg-gray-50 p-5">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-gray-100/95 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
          <span className="text-2xl mb-2">🔒</span>
          <p className="text-sm font-semibold text-text mb-1">
            Cases, formulaires et justificatifs
          </p>
          <p className="text-xs text-text-light mb-3">
            Débloquez le guide complet pour remplir votre déclaration
          </p>
          <button
            type="button"
            onClick={onUnlock}
            className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Débloquer pour {PREMIUM_PRICE} €
          </button>
        </div>
        {/* Blurred placeholder content behind the overlay */}
        <div className="opacity-30 select-none pointer-events-none" aria-hidden>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-lg p-3 h-14" />
            <div className="bg-white rounded-lg p-3 h-14" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white rounded w-3/4" />
            <div className="h-4 bg-white rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Premium card: shows everything ───
function PremiumOpportunityCard({ opp }: { opp: TaxOpportunity }) {
  const [open, setOpen] = useState(false);
  const badge = TYPE_BADGE[opp.type];

  return (
    <div className="bg-white rounded-xl border-2 border-primary/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge.class}`}>
                {badge.label}
              </span>
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                ✓ Guide complet
              </span>
            </div>
            <h3 className="font-bold text-lg">{opp.title}</h3>
            {opp.estimatedSaving && (
              <p className="text-secondary font-semibold mt-1">
                Gain estimé :{" "}
                {opp.estimatedSaving.min === opp.estimatedSaving.max
                  ? `${opp.estimatedSaving.min.toLocaleString("fr-FR")} €`
                  : `${opp.estimatedSaving.min.toLocaleString("fr-FR")} à ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`}
              </p>
            )}
          </div>
          <span className={`text-xl transition-transform ${open ? "rotate-180" : ""}`}>
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4 animate-fadeIn">
          <p className="text-sm text-text-light">{opp.description}</p>

          {/* Step-by-step guide */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-800 mb-2">Comment remplir :</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Connectez-vous sur <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline">impots.gouv.fr</a></li>
              <li>Accédez à votre déclaration en ligne</li>
              {opp.form !== "2042" && opp.form !== "2042 (automatique)" && (
                <li>Ajoutez le formulaire <strong>{opp.form}</strong> via &quot;Annexes&quot;</li>
              )}
              {opp.boxes.length > 0 && (
                <li>Renseignez le montant dans la case <strong>{opp.boxes.join(" ou ")}</strong></li>
              )}
              <li>Vérifiez et validez</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface rounded-lg p-3">
              <p className="text-xs font-semibold text-text-lighter mb-1">Formulaire</p>
              <p className="font-mono font-bold text-primary">{opp.form}</p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-xs font-semibold text-text-lighter mb-1">Cases à remplir</p>
              <p className="font-mono font-bold text-primary">{opp.boxes.length > 0 ? opp.boxes.join(", ") : "Automatique"}</p>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-3">
            <p className="text-xs font-semibold text-text-lighter mb-1">
              Niveau de confiance : <span className="capitalize font-bold">{opp.confidence}</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-lighter mb-2">Justificatifs à conserver</p>
            <ul className="text-sm text-text-light space-y-1">
              {opp.justificatifs.map((j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  {j}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={opp.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
            >
              Source officielle →
            </a>
            {opp.guideLink && (
              <Link href={opp.guideLink} className="text-sm bg-secondary/10 text-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/20 transition-colors">
                Lire le guide →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Premium unlock modal (tiered pricing) ───
function PremiumModal({ result, onClose, onUnlocked }: { result: TaxResult; onClose: () => void; onUnlocked: () => void }) {
  const handlePurchase = (tier: PremiumTier) => {
    // TODO: Intégrer Stripe / paiement réel
    // Pour le MVP, on simule le déblocage
    setPremium(tier);
    onUnlocked();
  };

  const tiers = Object.entries(PREMIUM_TIERS) as [PremiumTier, typeof PREMIUM_TIERS[PremiumTier]][];
  const hasFrontalier = result.opportunities.some((o) => o.id.startsWith("frontalier_"));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">🎯</span>
          <h2 className="text-2xl font-bold mb-2">
            Débloquez votre guide personnalisé
          </h2>
          <p className="text-text-light">
            {result.opportunities.length} avantage{result.opportunities.length > 1 ? "s" : ""} détecté{result.opportunities.length > 1 ? "s" : ""}
            {result.totalEstimatedMax > 0 && (
              <> pour un gain estimé jusqu&apos;à <strong className="text-secondary">{result.totalEstimatedMax.toLocaleString("fr-FR")} €</strong></>
            )}
          </p>
        </div>

        {result.totalEstimatedMax > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-center">
            <p className="text-sm text-green-800">
              Investissez <strong>39 €</strong> pour potentiellement récupérer
              {" "}<strong>{result.totalEstimatedMin.toLocaleString("fr-FR")} à {result.totalEstimatedMax.toLocaleString("fr-FR")} €</strong>
            </p>
          </div>
        )}

        {/* Tiers grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {tiers.map(([key, tier]) => {
            const isPopular = "popular" in tier && tier.popular;
            const isRecommended = key === "expert" && hasFrontalier;

            return (
              <div
                key={key}
                className={`relative rounded-xl border-2 p-5 flex flex-col ${
                  isPopular ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    Populaire
                  </span>
                )}
                {isRecommended && !isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                    Recommandé pour vous
                  </span>
                )}
                <h3 className="font-bold text-lg">{tier.name}</h3>
                <p className="text-xs text-text-lighter mb-3">{tier.subtitle}</p>
                <p className="text-3xl font-bold mb-4">{tier.price} <span className="text-sm font-normal text-text-lighter">€</span></p>
                <ul className="space-y-2 mb-5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-sm">
                      <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handlePurchase(key)}
                  className={`w-full py-3 rounded-xl font-bold transition-colors text-sm ${
                    isPopular
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-gray-100 text-text hover:bg-gray-200"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-text-lighter text-center mb-3">
          Paiement sécurisé — Satisfait ou remboursé 14 jours
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-center text-sm text-text-lighter hover:text-text-light"
        >
          Non merci, rester en version gratuite
        </button>
      </div>
    </div>
  );
}

// ─── Share component ───
function ShareResults({ count, maxSaving }: { count: number; maxSaving: number }) {
  const [copied, setCopied] = useState(false);

  const text = maxSaving > 0
    ? `J'ai trouvé ${count} avantage${count > 1 ? "s" : ""} fiscal(aux) oublié${count > 1 ? "s" : ""} pour un gain potentiel de ${maxSaving.toLocaleString("fr-FR")} € avec RecupMesEuros !`
    : `J'ai vérifié ma déclaration d'impôts avec RecupMesEuros et trouvé ${count} avantage${count > 1 ? "s" : ""} à vérifier !`;

  const url = "https://recupmeseuros.fr";

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${text} ${url}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm text-text-lighter">Partager :</span>
      <button
        type="button"
        onClick={shareTwitter}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
      >
        Twitter
      </button>
      <button
        type="button"
        onClick={shareWhatsApp}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-text-light hover:bg-gray-200 transition-colors"
      >
        {copied ? "Copié !" : "Copier"}
      </button>
    </div>
  );
}

// ─── Email capture component ───
function EmailCapture({ result }: { result: TaxResult }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) return;

    const lines = [
      "Bonjour,",
      "",
      `Voici le résumé de votre analyse fiscale RecupMesEuros (${new Date().toLocaleDateString("fr-FR")}).`,
      "",
      `Score d'opportunité : ${result.score.toUpperCase()}`,
      result.totalEstimatedMax > 0
        ? `Gain potentiel estimé : ${result.totalEstimatedMin.toLocaleString("fr-FR")} à ${result.totalEstimatedMax.toLocaleString("fr-FR")} €`
        : "",
      "",
      `${result.opportunities.length} avantage(s) détecté(s) :`,
      ...result.opportunities.map(
        (o) =>
          `- ${o.title}${o.estimatedSaving ? ` (${o.estimatedSaving.min.toLocaleString("fr-FR")} – ${o.estimatedSaving.max.toLocaleString("fr-FR")} €)` : ""}`
      ),
      "",
      result.warnings.length > 0 ? "Points d'attention :" : "",
      ...result.warnings.map((w) => `- ${w}`),
      "",
      "Retrouvez votre analyse complète sur RecupMesEuros.",
      "",
      "---",
      "Ce résumé est indicatif. Vérifiez sur impots.gouv.fr.",
    ]
      .filter(Boolean)
      .join("\n");

    const subject = encodeURIComponent("Mon analyse fiscale RecupMesEuros");
    const body = encodeURIComponent(lines);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center">
        <p className="text-sm text-green-800 font-medium">
          Votre client email s&apos;est ouvert avec le résumé. Vérifiez et envoyez !
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-gray-200 p-5 mb-8">
      <h3 className="font-bold text-sm mb-2">Recevez votre résumé par email</h3>
      <p className="text-xs text-text-light mb-3">
        Gardez une trace de vos résultats. Aucune donnée n&apos;est stockée sur nos serveurs.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1 p-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!email}
          className="bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-primary-dark disabled:opacity-40 transition-colors shrink-0"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

function generatePDF(result: TaxResult) {
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text("RecupMesEuros — Guide fiscal personnalisé", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — Déclaration 2026 (revenus 2025)`, margin, y);
    y += 12;

    // Score
    doc.setFontSize(14);
    doc.setTextColor(0);
    const scoreLabel = SCORE_CONFIG[result.score].label;
    doc.text(`Score d'opportunité : ${scoreLabel}`, margin, y);
    y += 8;

    if (result.totalEstimatedMax > 0) {
      doc.setFontSize(12);
      doc.text(
        `Gain potentiel estimé : ${result.totalEstimatedMin.toLocaleString("fr-FR")} à ${result.totalEstimatedMax.toLocaleString("fr-FR")} €`,
        margin,
        y
      );
      y += 10;
    }

    // Opportunities with full details
    for (const opp of result.opportunities) {
      if (y > 240) {
        doc.addPage();
        y = margin;
      }

      doc.setFontSize(13);
      doc.setTextColor(30, 64, 175);
      doc.text(`${opp.title}`, margin, y);
      y += 7;

      doc.setFontSize(9);
      doc.setTextColor(80);
      const lines = doc.splitTextToSize(opp.description, 170);
      doc.text(lines, margin + 4, y);
      y += lines.length * 4 + 3;

      // Boxes and forms - prominent
      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175);
      doc.text(`→ Formulaire : ${opp.form}`, margin + 4, y);
      y += 5;
      if (opp.boxes.length > 0) {
        doc.text(`→ Cases : ${opp.boxes.join(", ")}`, margin + 4, y);
        y += 5;
      }

      doc.setFontSize(9);
      doc.setTextColor(80);

      if (opp.estimatedSaving) {
        doc.text(
          `Gain estimé : ${opp.estimatedSaving.min.toLocaleString("fr-FR")} à ${opp.estimatedSaving.max.toLocaleString("fr-FR")} €`,
          margin + 4, y
        );
        y += 5;
      }

      doc.text(`Justificatifs : ${opp.justificatifs.join(" / ")}`, margin + 4, y);
      y += 8;

      // Separator
      doc.setDrawColor(200);
      doc.line(margin, y, 190, y);
      y += 5;
    }

    // Warnings
    if (result.warnings.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(12);
      doc.setTextColor(180, 80, 0);
      doc.text("Points d'attention :", margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor(80);
      for (const w of result.warnings) {
        const wLines = doc.splitTextToSize(`- ${w}`, 170);
        doc.text(wLines, margin + 4, y);
        y += wLines.length * 4 + 3;
      }
    }

    // Disclaimer
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      "Les résultats sont indicatifs. Vérifiez votre situation sur impots.gouv.fr ou auprès d'un professionnel.",
      margin, y
    );

    doc.save("recupmeseuros-guide-fiscal.pdf");
  }).catch(() => {
    alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
  });
}

export default function ResultsClient() {
  const router = useRouter();
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState(false);
  const [premium, setPremiumState] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setPremiumState(isPremium());

    const raw = sessionStorage.getItem("recupmeseuros_answers");
    if (!raw) {
      setError(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const validated = QuestionnaireAnswers.parse(parsed);
      const res = evaluateTaxOpportunities(validated);
      setResult(res);
    } catch {
      setError(true);
    }
  }, []);

  const handleUnlock = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleUnlocked = useCallback(() => {
    setPremiumState(true);
    setShowModal(false);
    router.push("/dashboard");
  }, [router]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Aucune donnée trouvée</h1>
        <p className="text-text-light mb-8">
          Veuillez d&apos;abord remplir le questionnaire pour obtenir vos résultats.
        </p>
        <Link
          href="/questionnaire"
          className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          Commencer le questionnaire
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
        </div>
      </div>
    );
  }

  const scoreConfig = SCORE_CONFIG[result.score];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Premium modal */}
      {showModal && (
        <PremiumModal
          result={result}
          onClose={() => setShowModal(false)}
          onUnlocked={handleUnlocked}
        />
      )}

      {/* Score — always visible */}
      <div className={`rounded-2xl p-6 md:p-8 mb-8 ${scoreConfig.bg}`}>
        <p className="text-sm font-semibold text-text-lighter mb-2">
          Score d&apos;opportunité fiscale
        </p>
        <p className={`text-3xl font-bold mb-2 ${scoreConfig.color}`}>
          {scoreConfig.label}
        </p>
        <p className="text-text-light">{scoreConfig.desc}</p>

        {result.totalEstimatedMax > 0 && (
          <div className="mt-4 p-4 bg-white/60 rounded-xl">
            <p className="text-sm text-text-lighter">Gain potentiel estimé</p>
            <p className="text-2xl font-bold text-secondary">
              {result.totalEstimatedMin === result.totalEstimatedMax
                ? `${result.totalEstimatedMin.toLocaleString("fr-FR")} €`
                : `${result.totalEstimatedMin.toLocaleString("fr-FR")} à ${result.totalEstimatedMax.toLocaleString("fr-FR")} €`}
            </p>
            <p className="text-xs text-text-lighter mt-1">
              Estimation indicative basée sur vos réponses
            </p>
          </div>
        )}
      </div>

      {/* Opportunities */}
      <h2 className="text-xl font-bold mb-4">
        {result.opportunities.length} avantage{result.opportunities.length > 1 ? "s" : ""} à vérifier
      </h2>

      {!premium && result.opportunities.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Version gratuite :</strong> vous voyez les avantages détectés et les estimations.
            Pour savoir exactement quelles cases remplir et comment, débloquez le guide complet.
          </p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {result.opportunities.map((opp) =>
          premium ? (
            <PremiumOpportunityCard key={opp.id} opp={opp} />
          ) : (
            <FreeOpportunityCard key={opp.id} opp={opp} onUnlock={handleUnlock} />
          )
        )}
      </div>

      {result.opportunities.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-200 mb-8">
          <p className="text-text-light">
            Aucune opportunité spécifique détectée avec vos réponses.
            <br />
            Essayez de remplir plus de questions ou consultez nos{" "}
            <Link href="/guides/emploi-a-domicile" className="text-primary hover:underline">
              guides pratiques
            </Link>
            .
          </p>
        </div>
      )}

      {/* CTA Premium — only if not premium */}
      {!premium && result.opportunities.length > 0 && (
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 md:p-8 mb-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">
            Savoir quoi vérifier, c&apos;est bien.
            <br />
            Savoir exactement où et comment, c&apos;est mieux.
          </h3>
          <p className="text-blue-100 mb-4 text-sm">
            Cases exactes, formulaires, justificatifs, guide pas-à-pas et PDF personnalisé.
          </p>
          {result.totalEstimatedMax > 0 && (
            <p className="text-blue-200 text-sm mb-4">
              Vous payez {PREMIUM_PRICE} € pour potentiellement récupérer jusqu&apos;à {result.totalEstimatedMax.toLocaleString("fr-FR")} €
            </p>
          )}
          <button
            type="button"
            onClick={handleUnlock}
            className="bg-accent hover:bg-accent-light text-gray-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Débloquer mon guide — {PREMIUM_PRICE} €
          </button>
        </div>
      )}

      {/* Warnings — always visible */}
      {result.warnings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Points d&apos;attention</h2>
          <div className="space-y-3">
            {result.warnings.map((w, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar — always visible */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Dates clés 2026</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {result.calendarReminders.slice(0, 5).map((c, i) => {
            const d = new Date(c.date);
            const formatted = d.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
            });
            return (
              <div key={i} className="flex items-center gap-3 p-3">
                <span className="text-sm font-mono font-semibold text-primary w-24">
                  {formatted}
                </span>
                <span className="text-sm text-text-light">{c.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {premium ? (
          <>
            <Link
              href="/dashboard"
              className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors text-center"
            >
              Accéder à mon espace
            </Link>
            <button
              type="button"
              onClick={() => generatePDF(result)}
              className="flex-1 border-2 border-primary text-primary font-bold py-3 px-6 rounded-xl hover:bg-primary/5 transition-colors"
            >
              Télécharger mon guide PDF
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleUnlock}
            className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <span>🔒</span> Télécharger mon guide PDF — {PREMIUM_PRICE} €
          </button>
        )}
        <Link
          href="/questionnaire"
          className="flex-1 text-center border-2 border-gray-200 font-bold py-3 px-6 rounded-xl hover:border-gray-300 transition-colors"
        >
          Refaire le questionnaire
        </Link>
      </div>

      {/* Share */}
      {result.opportunities.length > 0 && (
        <ShareResults
          count={result.opportunities.length}
          maxSaving={result.totalEstimatedMax}
        />
      )}

      {/* Email capture */}
      <EmailCapture result={result} />

      <Disclaimer />
    </div>
  );
}
