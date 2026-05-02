"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import { PROFILE_LABELS, type ProfileType } from "@/data/types";

type Answers = Record<string, unknown>;

const ALL_PROFILES = Object.entries(PROFILE_LABELS) as [ProfileType, string][];

export default function QuestionnaireClient() {
  const router = useRouter();
  const [step, setStep] = useState<"profiles" | "questions" | "done">("profiles");
  const [selectedProfiles, setSelectedProfiles] = useState<ProfileType[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter questions based on selected profiles and previous answers
  const visibleQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (!q.showIf) return true;
      return q.showIf(answers, selectedProfiles);
    });
  }, [answers, selectedProfiles]);

  const currentQuestion = visibleQuestions[currentIndex];
  const totalQuestions = visibleQuestions.length;
  const progress = step === "profiles" ? 0 : Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const toggleProfile = useCallback((profile: ProfileType) => {
    setSelectedProfiles((prev) =>
      prev.includes(profile) ? prev.filter((p) => p !== profile) : [...prev, profile]
    );
  }, []);

  const setAnswer = useCallback((field: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Done — save to sessionStorage and navigate
      const data = {
        profiles: selectedProfiles,
        ...answers,
      };
      sessionStorage.setItem("recupmeseuros_answers", JSON.stringify(data));
      setStep("done");
      router.push("/resultats");
    }
  }, [currentIndex, totalQuestions, selectedProfiles, answers, router]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      setStep("profiles");
    }
  }, [currentIndex]);

  const startQuestions = useCallback(() => {
    if (selectedProfiles.length === 0) return;
    setStep("questions");
    setCurrentIndex(0);
  }, [selectedProfiles]);

  // ─── Profile selection screen ───
  if (step === "profiles") {
    return (
      <div className="animate-fadeIn">
        <h1 className="text-2xl font-bold mb-2">Quel est votre profil ?</h1>
        <p className="text-text-light mb-6">
          Sélectionnez tous les profils qui vous correspondent. Cela nous permet de
          vous poser les bonnes questions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {ALL_PROFILES.map(([key, label]) => {
            const selected = selectedProfiles.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleProfile(key)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={startQuestions}
          disabled={selectedProfiles.length === 0}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl disabled:opacity-40 hover:bg-primary-dark transition-colors"
        >
          Continuer ({selectedProfiles.length} profil{selectedProfiles.length > 1 ? "s" : ""} sélectionné{selectedProfiles.length > 1 ? "s" : ""})
        </button>
      </div>
    );
  }

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
        <button
          type="button"
          onClick={goPrev}
          className="px-6 py-3 rounded-xl border-2 border-gray-200 text-text-light font-medium hover:border-gray-300 transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          {currentIndex === totalQuestions - 1 ? "Voir mes résultats" : "Suivant →"}
        </button>
      </div>

      {/* Skip */}
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
