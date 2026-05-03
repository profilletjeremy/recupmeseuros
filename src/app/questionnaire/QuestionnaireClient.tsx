"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import type { ProfileType } from "@/data/types";

type Answers = Record<string, unknown>;

const STORAGE_KEY = "recupmeseuros_answers";
const DRAFT_KEY = "recupmeseuros_draft";

function deriveProfiles(answers: Answers): ProfileType[] {
  const profiles: ProfileType[] = [];
  if (answers.est_salarie) profiles.push("salarie");
  if (answers.est_retraite) profiles.push("retraite");
  if (answers.a_enfants) profiles.push("parent");
  if (answers.est_proprietaire) profiles.push("proprietaire_occupant");
  if (answers.est_locataire_flag) profiles.push("locataire");
  if (answers.est_bailleur) profiles.push("proprietaire_bailleur");
  if (answers.est_aidant) profiles.push("aidant_familial");
  if (answers.est_handicap) profiles.push("handicap");
  if (answers.est_micro_entrepreneur_flag) profiles.push("micro_entrepreneur");
  if (answers.est_premiere_declaration_flag) profiles.push("premiere_declaration");
  return profiles;
}

function loadDraft(): { answers: Answers; index: number; ts: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data.answers === "object" && typeof data.index === "number") {
      return { ...data, ts: data.ts || Date.now() };
    }
  } catch { /* ignore */ }
  return null;
}

export default function QuestionnaireClient() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResume, setShowResume] = useState(false);
  const [draftTs, setDraftTs] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft.answers).length > 0) {
      setShowResume(true);
      setAnswers(draft.answers);
      setCurrentIndex(draft.index);
      setDraftTs(draft.ts);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, index: currentIndex, ts: Date.now() }));
    }
  }, [answers, currentIndex, initialized]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  const derivedProfiles = useMemo(() => deriveProfiles(answers), [answers]);

  const visibleQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (!q.showIf) return true;
      return q.showIf(answers, derivedProfiles);
    });
  }, [answers, derivedProfiles]);

  const currentQuestion = visibleQuestions[currentIndex];
  const totalQuestions = visibleQuestions.length;
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const setAnswer = useCallback((field: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setAnimKey((k) => k + 1);
      setCurrentIndex((i) => i + 1);
    } else {
      const data = {
        profiles: deriveProfiles(answers),
        ...answers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.removeItem(DRAFT_KEY);
      router.push("/resultats");
    }
  }, [currentIndex, totalQuestions, answers, router]);

  // Auto-advance after a short delay (for boolean + select)
  const autoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      goNext();
    }, 250);
  }, [goNext]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setAnimKey((k) => k + 1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const startFresh = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    localStorage.removeItem(DRAFT_KEY);
    setShowResume(false);
  }, []);

  const resumeDraft = useCallback(() => {
    setShowResume(false);
  }, []);

  // Skeleton while loading
  if (!initialized) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-2 bg-gray-200 rounded-full" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-3 mt-8">
          <div className="flex-1 h-14 bg-gray-200 rounded-xl" />
          <div className="flex-1 h-14 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  // ─── Resume prompt ───
  if (showResume) {
    const draftAnswerCount = Object.keys(answers).length;
    const timeAgo = draftTs > 0
      ? new Date(draftTs).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
      : null;
    return (
      <div className="animate-fadeIn">
        <div className="bg-white rounded-2xl border-2 border-primary/20 p-6 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-bold mb-2">Reprendre votre questionnaire ?</h2>
          <p className="text-text-light text-sm mb-2">
            Vous avez un questionnaire en cours ({draftAnswerCount} réponses).
          </p>
          {timeAgo && (
            <p className="text-text-lighter text-xs mb-6">Sauvegardé le {timeAgo}</p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={startFresh}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-text-light font-medium hover:border-gray-300 transition-colors"
            >
              Recommencer
            </button>
            <button
              type="button"
              onClick={resumeDraft}
              className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Reprendre
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isNumberType = currentQuestion.type === "number";
  const isMultiBoolean = currentQuestion.type === "multi_boolean";

  return (
    <div key={animKey} className="animate-fadeIn">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-text-lighter mb-1">
          <span>{currentQuestion.section} {currentQuestion.sectionIcon}</span>
          <span>{currentIndex + 1}/{totalQuestions}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">{currentQuestion.text}</h2>
      {currentQuestion.subtext && (
        <p className="text-text-light text-sm mb-4">{currentQuestion.subtext}</p>
      )}

      {currentQuestion.tooltip && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">{currentQuestion.tooltip}</p>
        </div>
      )}

      <div className="my-6">
        {/* Boolean — auto-advance on click */}
        {currentQuestion.type === "boolean" && (
          <div className="flex gap-3">
            {[
              { value: true, label: "Oui" },
              { value: false, label: "Non" },
            ].map(({ value, label }) => {
              const selected = answers[currentQuestion.field] === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setAnswer(currentQuestion.field, value);
                    autoAdvance();
                  }}
                  className={`flex-1 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                    selected
                      ? "border-primary bg-blue-50 text-primary scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-gray-300 active:scale-95"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Number — Suivant button, Enter to advance */}
        {currentQuestion.type === "number" && (
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              autoFocus
              value={answers[currentQuestion.field] !== undefined ? String(answers[currentQuestion.field]) : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setAnswer(currentQuestion.field, undefined);
                } else {
                  const num = Number(val);
                  setAnswer(currentQuestion.field, num < 0 ? 0 : num);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goNext();
                }
              }}
              placeholder={currentQuestion.placeholder}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
            />
            {currentQuestion.suffix && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-lighter font-medium">
                {currentQuestion.suffix}
              </span>
            )}
          </div>
        )}

        {/* Select — auto-advance on click */}
        {currentQuestion.type === "select" && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.field] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setAnswer(currentQuestion.field, opt.value);
                    autoAdvance();
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selected
                      ? "border-primary bg-blue-50 text-primary scale-[1.01]"
                      : "border-gray-200 bg-white hover:border-gray-300 active:scale-[0.98]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Multi-boolean — manual advance via Suivant */}
        {isMultiBoolean && currentQuestion.fields && (
          <div className="space-y-2">
            {currentQuestion.fields.map((f) => {
              const checked = !!answers[f.field];
              return (
                <label
                  key={f.field}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    checked
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setAnswer(f.field, e.target.checked)}
                    className="w-5 h-5 rounded text-primary focus:ring-primary"
                  />
                  <span className={`text-sm ${checked ? "text-primary font-medium" : ""}`}>
                    {f.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation — show Suivant only for number + multi_boolean */}
      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-text-light font-medium hover:border-gray-300 transition-colors"
          >
            ←
          </button>
        )}
        {(isNumberType || isMultiBoolean || isLastQuestion) && (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            {isLastQuestion ? "Voir mes résultats" : "Suivant →"}
          </button>
        )}
      </div>

      {/* Skip — only for number questions */}
      {isNumberType && !isLastQuestion && (
        <button
          type="button"
          onClick={goNext}
          className="w-full text-center text-sm text-text-lighter mt-3 hover:text-text-light transition-colors"
        >
          Je ne sais pas
        </button>
      )}
    </div>
  );
}
