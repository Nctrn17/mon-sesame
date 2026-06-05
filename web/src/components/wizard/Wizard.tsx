"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ResultsView } from "@/components/results/ResultsView";
import { QUESTIONS, type Question } from "@/domain/profile/questions";
import { EMPTY_PROFILE, type Profile, updateProfile } from "@/domain/profile/types";
import { ChoiceField } from "./ChoiceField";
import { CommuneAutocomplete } from "./CommuneAutocomplete";

function isAnswered(question: Question, profile: Profile): boolean {
  switch (question.kind) {
    case "commune":
      return Boolean(profile.commune);
    case "date":
      return Boolean(question.get(profile));
    case "choice":
      return question.get(profile) !== undefined;
  }
}

export function Wizard() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const questionRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Déplace le focus vers la nouvelle question à chaque changement d'étape,
  // pour que les utilisateurs clavier et lecteur d'écran suivent la progression.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    questionRef.current?.focus();
  }, [step]);

  if (done) {
    return (
      <ResultsView
        profile={profile}
        onRestart={() => {
          setProfile(EMPTY_PROFILE);
          setStep(0);
          setDone(false);
        }}
      />
    );
  }

  const question = QUESTIONS[step];
  if (!question) return null;

  const total = QUESTIONS.length;
  const answered = isAnswered(question, profile);
  const titleId = `question-title-${question.id}`;

  function goNext() {
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-2 flex items-center justify-between text-muted">
        <span>
          Question {step + 1} sur {total}
        </span>
        <span>{Math.round(((step + 1) / total) * 100)} %</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuetext={`Question ${step + 1} sur ${total}`}
        aria-label="Progression du questionnaire"
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <div
        key={question.id}
        ref={questionRef}
        tabIndex={-1}
        aria-labelledby={titleId}
        className="mt-10 outline-none"
      >
        {question.kind === "choice" ? (
          <ChoiceField
            legend={question.title}
            legendId={titleId}
            help={question.help}
            name={question.id}
            options={question.options}
            value={question.get(profile)}
            onChange={(v) => setProfile(question.set(profile, v))}
          />
        ) : null}

        {question.kind === "date" ? (
          <div>
            <h2 id={titleId} className="text-2xl font-semibold text-foreground">
              {question.title}
            </h2>
            {question.help ? <p className="mt-2 text-[1.05rem] text-muted">{question.help}</p> : null}
            <input
              type="date"
              max={today}
              min="1900-01-01"
              value={question.get(profile) ?? ""}
              onChange={(e) => setProfile(question.set(profile, e.target.value))}
              aria-labelledby={titleId}
              className="mt-6 w-full rounded-xl border-2 border-border bg-card p-4 text-lg focus-visible:border-brand"
            />
          </div>
        ) : null}

        {question.kind === "commune" ? (
          <div>
            <h2 id={titleId} className="text-2xl font-semibold text-foreground">
              {question.title}
            </h2>
            {question.help ? <p className="mt-2 text-[1.05rem] text-muted">{question.help}</p> : null}
            <CommuneAutocomplete
              selected={profile.commune}
              onSelect={(commune) => setProfile(updateProfile(profile, { commune }))}
              labelledById={titleId}
            />
          </div>
        ) : null}
      </div>

      <nav className="mt-12 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-xl border-2 border-border px-6 py-3 text-lg font-medium text-foreground disabled:opacity-40"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!answered}
          className="rounded-xl bg-brand px-8 py-3 text-lg font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step === total - 1 ? "Voir mes droits" : "Continuer"}
        </button>
      </nav>
    </div>
  );
}
