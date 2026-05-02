"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import type { ProfileType } from "@/data/types";

type Answers = Record<string, unknown>;

/**
 * Dérive automatiquement les profils à partir des réponses de découverte.
 * Remplace la sélection manuelle qui ratait les combinaisons (salarié + bailleur).
 */
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

export default function QuestionnaireClient() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const derivedProfiles = useMemo(() => deriveProfiles(answers), [answers]);

  // Filter questions based on previous answers (profiles are derived, not selected)
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
      setCurrentIndex((i) => i + 1);
    } else {
      // Done — save to sessionStorage with derived profiles and navigate
      const data = {
        profiles: deriveProfiles(answers),
        ...answers,
      };
      sessionStorage.setItem("recupmeseuros_answers", JSON.stringify(data));
      router.push("/resultats");
    }
  }, [currentIndex, totalQuestions, answers, router]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  if (!currentQuestion) {
    return null;
  }

  // ─── Question screen ───
  return (
    <div className="animate-fadeIn">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-text-lighter mb-1">
          <span>{currentQuestion.section} {currentQuestion.sectionIcon}</span>
          <span>{currentIndex + 1}/{totalQuestions}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
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
        {/* Boolean question */}
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
                  }}
                  className={`flex-1 py-4 rounded-xl border-2 font-medium transition-all ${
                    selected
                      ? "border-primary bg-blue-50 text-primary"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Number question */}
        {currentQuestion.type === "number" && (
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={0}
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

        {/* Select question */}
        {currentQuestion.type === "select" && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.field] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswer(currentQuestion.field, opt.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selected
                      ? "border-primary bg-blue-50 text-primary"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Multi-boolean question */}
        {currentQuestion.type === "multi_boolean" && currentQuestion.fields && (
          <div className="space-y-2">
            {currentQuestion.fields.map((f) => {
              const checked = !!answers[f.field];
              return (
                <label
                  key={f.field}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
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

      {/* Navigation */}
      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-text-light font-medium hover:border-gray-300 transition-colors"
          >
            ← Retour
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          {currentIndex === totalQuestions - 1 ? "Voir mes résultats" : "Suivant →"}
        </button>
      </div>

      {/* Skip (not for multi-boolean or first 3 discovery questions) */}
      {currentQuestion.type !== "multi_boolean" && (
        <button
          type="button"
          onClick={goNext}
          className="w-full text-center text-sm text-text-lighter mt-3 hover:text-text-light"
        >
          Passer cette question
        </button>
      )}
    </div>
  );
}
