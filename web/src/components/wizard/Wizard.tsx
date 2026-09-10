"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SeedShape } from "@/components/brand/SeedShape";
import { ResultsView } from "@/components/results/ResultsView";
import { type Question, resolveText, visibleQuestions } from "@/domain/profile/questions";
import { EMPTY_PROFILE, type Profile, updateProfile } from "@/domain/profile/types";
import { ChoiceField } from "./ChoiceField";
import { CommuneAutocomplete } from "./CommuneAutocomplete";
import { SimHeader } from "./SimHeader";

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

const FIELD_CLASS =
  "mt-6 w-full rounded-[14px] border-[1.5px] border-border bg-surface px-[18px] py-[18px] text-lg text-foreground focus-visible:border-foreground sm:mt-9 sm:px-6 sm:py-[22px] sm:text-xl";

export function Wizard({ initialProfile = EMPTY_PROFILE }: { initialProfile?: Profile }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
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
  }, [step, done]);

  if (done) {
    return (
      <ResultsView
        profile={profile}
        onRestart={() => {
          setProfile(EMPTY_PROFILE);
          setStep(0);
          setDone(false);
        }}
        onEdit={() => {
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
  const why = question.why ? resolveText(question.why, profile) : undefined;

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

  const titleClass =
    "font-serif text-[36px] leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[52px] sm:leading-[1.08]";
  const helpClass = "mt-3 text-[17px] leading-[1.5] text-muted sm:mt-4 sm:text-[19px]";

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <SeedShape
        className="hidden lg:block"
        wrapper={{ right: -120, bottom: -320, width: 760, height: 760 }}
        shape={{ left: 190, top: 60, width: 400, height: 640 }}
        rotate={-34}
        blur={20}
        opacity={0.9}
      />
      <SeedShape
        className="lg:hidden"
        wrapper={{ right: -220, bottom: -260, width: 520, height: 560 }}
        shape={{ left: 130, top: 50, width: 270, height: 430 }}
        rotate={-34}
        blur={14}
        opacity={0.6}
        grain2={false}
      />
      <SimHeader>
        <Link href="/" className="text-[17px] text-muted underline underline-offset-4 hover:text-foreground">
          Quitter
        </Link>
      </SimHeader>

      <main
        id="contenu"
        className="relative mx-auto flex w-full max-w-[720px] flex-1 flex-col px-[22px] pb-7 pt-6 sm:px-10 sm:pb-24 sm:pt-14"
      >
        {/* Progression : un point par question, pas de barre ni de pourcentage. */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuetext={`Question ${index + 1} sur ${total}`}
            aria-label="Progression du questionnaire"
            className="flex flex-wrap items-center gap-1.5 sm:gap-2"
          >
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={`dot ${i <= index ? "dot-warm" : "dot-off"}`} />
            ))}
          </div>
          <span className="ml-2 text-[15px] text-muted sm:ml-2.5 sm:text-base">
            <span className="hidden sm:inline">Question </span>
            {index + 1} sur {total}
          </span>
        </div>

        <div
          key={question.id}
          ref={questionRef}
          tabIndex={-1}
          aria-labelledby={titleId}
          className="mt-6 outline-none sm:mt-8"
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
              <h1 id={titleId} className={titleClass}>
                {title}
              </h1>
              {help ? <p className={helpClass}>{help}</p> : null}
              <input
                type="date"
                max={today}
                min="1900-01-01"
                value={question.get(profile) ?? ""}
                onChange={(e) => answer(question.set(profile, e.target.value))}
                aria-labelledby={titleId}
                aria-describedby={`${question.id}-format`}
                className={FIELD_CLASS}
              />
              <p id={`${question.id}-format`} className="mt-2 text-base text-muted">
                Indiquez le jour, le mois puis l&apos;année. Par exemple : 05/12/1948.
              </p>
            </div>
          ) : null}

          {question.kind === "commune" ? (
            <div>
              <h1 id={titleId} className={titleClass}>
                {title}
              </h1>
              {help ? <p className={helpClass}>{help}</p> : null}
              <CommuneAutocomplete
                selected={profile.commune}
                onSelect={(commune) => answer(updateProfile(profile, { commune }))}
                labelledById={titleId}
                inputClassName={FIELD_CLASS}
              />
            </div>
          ) : null}
        </div>

        {why ? (
          <details className="group mt-4 sm:mt-6">
            <summary className="link-sienna inline-block cursor-pointer list-none text-base text-foreground [&::-webkit-details-marker]:hidden sm:text-[17px]">
              Pourquoi cette question ?
              <span aria-hidden className="ml-1.5 inline-block transition group-open:rotate-90">
                ›
              </span>
            </summary>
            <p className="mt-3 max-w-[600px] text-[17px] leading-[1.55] text-muted">{why}</p>
          </details>
        ) : null}

        {showAnswerHint ? (
          <p
            role="alert"
            className="mt-6 rounded-[14px] bg-warn-light px-5 py-4 text-lg font-medium text-warn"
          >
            Choisissez une réponse pour continuer.
          </p>
        ) : null}

        <nav
          aria-label="Navigation entre les questions"
          className="mt-auto flex flex-col gap-2.5 pt-7 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:border-t sm:border-border"
        >
          <button
            type="button"
            onClick={goBack}
            disabled={index === 0}
            className="pill pill-white order-2 min-h-[52px] px-6 py-[15px] text-lg disabled:cursor-default disabled:opacity-40 disabled:hover:border-border sm:order-1"
          >
            Précédent
          </button>
          <button
            type="button"
            onClick={goNext}
            className="pill pill-honey order-1 min-h-[56px] px-8 py-4 text-lg sm:order-2"
          >
            {index === total - 1 ? "Voir mes droits" : "Continuer"}
          </button>
        </nav>
      </main>
    </div>
  );
}
