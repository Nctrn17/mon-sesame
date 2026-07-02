"use client";

/*
  Écran d'erreur global : remplace l'écran technique de Next par un message
  compréhensible, avec une action simple pour reprendre.
*/
export default function ErrorPage({ reset }: { readonly reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-foreground">
        Une erreur est survenue
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Ce n&apos;est pas de votre faute. Vos réponses ne sont pas perdues ailleurs :
        rien n&apos;est enregistré. Vous pouvez réessayer tout de suite.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg bg-brand px-8 py-4 text-xl font-semibold text-white transition hover:bg-brand-dark active:translate-y-px"
      >
        Réessayer
      </button>
      <p className="mt-6 text-base text-muted">
        Si le problème continue, revenez un peu plus tard.
      </p>
    </div>
  );
}
