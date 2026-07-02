"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ResultsView } from "@/components/results/ResultsView";
import { type Question, resolveText, visibleQuestions } from "@/domain/profile/questions";
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
  // Message affiché si la personne clique sur Continuer sans avoir répondu.
  // Le bouton reste actif : un bouton grisé sans explication bloque les
  // utilisateurs qui ne comprennent pas pourquoi il ne réagit pas.
  const [showAnswerHint, setShowAnswerHint] = useState(false);

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

  // Les questions visibles dépendent des réponses déjà données (ex. la
  // question "aidant" n'est pas posée quand on remplit pour un proche).
  // L'index est borné : la liste peut rétrécir après un retour en arrière.
  const questions = visibleQuestions(profile);
  const index = Math.min(step, questions.length - 1);
  const question = questions[index];
  if (!question) return null;

  const total = questions.length;
  const answered = isAnswered(question, profile);
  const titleId = `question-title-${question.id}`;
  const title = resolveText(question.title, profile);
  const help = question.help ? resolveText(question.help, profile) : undefined;

  function answer(next: Profile) {
    setProfile(next);
    setShowAnswerHint(false);
  }

  function goNext() {
    if (!answered) {
      setShowAnswerHint(true);
      return;
    }
    setShowAnswerHint(false);
    if (index < total - 1) setStep(index + 1);
    else setDone(true);
  }

  function goBack() {
    setShowAnswerHint(false);
    setStep(Math.max(0, index - 1));
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-2 flex items-center justify-between text-muted">
        <span>
          Question {index + 1} sur {total}
        </span>
        <span>{Math.round(((index + 1) / total) * 100)} %</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuetext={`Question ${index + 1} sur ${total}`}
        aria-label="Progression du questionnaire"
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-base text-muted">
        Anonyme et sans inscription : vos réponses ne sont pas conservées.
      </p>

      <div
        key={question.id}
        ref={questionRef}
        tabIndex={-1}
        aria-labelledby={titleId}
        className="mt-10 outline-none"
      >
        {question.kind === "choice" ? (
          <ChoiceField
            legend={title}
            legendId={titleId}
            help={help}
            name={question.id}
            options={question.options}
            value={question.get(profile)}
            onChange={(v) => answer(question.set(profile, v))}
          />
        ) : null}

        {question.kind === "date" ? (
          <div>
            <h2 id={titleId} className="text-2xl font-semibold text-foreground">
              {title}
            </h2>
            {help ? <p className="mt-2 text-[1.05rem] text-muted">{help}</p> : null}
            <input
              type="date"
              max={today}
              min="1900-01-01"
              value={question.get(profile) ?? ""}
              onChange={(e) => answer(question.set(profile, e.target.value))}
              aria-labelledby={titleId}
              aria-describedby={`${question.id}-format`}
              className="mt-6 w-full rounded-xl border-2 border-border bg-card p-4 text-lg focus-visible:border-brand"
            />
            <p id={`${question.id}-format`} className="mt-2 text-base text-muted">
              Indiquez le jour, le mois puis l&apos;année. Par exemple : 05/12/1948.
            </p>
          </div>
        ) : null}

        {question.kind === "commune" ? (
          <div>
            <h2 id={titleId} className="text-2xl font-semibold text-foreground">
              {title}
            </h2>
            {help ? <p className="mt-2 text-[1.05rem] text-muted">{help}</p> : null}
            <CommuneAutocomplete
              selected={profile.commune}
              onSelect={(commune) => answer(updateProfile(profile, { commune }))}
              labelledById={titleId}
            />
          </div>
        ) : null}
      </div>

      {showAnswerHint ? (
        <p role="alert" className="mt-8 rounded-xl bg-warn-light p-4 text-lg font-medium text-warn">
          Choisissez une réponse pour continuer.
        </p>
      ) : null}

      <nav className={`${showAnswerHint ? "mt-4" : "mt-12"} flex items-center justify-between gap-4`}>
        <button
          type="button"
          onClick={goBack}
          disabled={index === 0}
          className="rounded-lg border-2 border-border px-6 py-3 text-lg font-medium text-foreground transition hover:border-brand active:translate-y-px disabled:opacity-40 disabled:hover:border-border"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={goNext}
          className="rounded-lg bg-brand px-8 py-3 text-lg font-semibold text-white transition hover:bg-brand-dark active:translate-y-px"
        >
          {index === total - 1 ? "Voir mes droits" : "Continuer"}
        </button>
      </nav>
    </div>
  );
}
