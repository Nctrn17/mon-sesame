"use client";

import { Logo } from "@/components/brand/Logo";

/*
  Écran d'erreur global : remplace l'écran technique de Next par un message
  compréhensible, avec une action simple pour reprendre.
*/
export default function ErrorPage({ reset }: { readonly reset: () => void }) {
  return (
    <>
      <header className="flex items-center px-[22px] py-4 sm:px-12 sm:py-6">
        <Logo />
      </header>
      <main id="contenu" className="max-w-[760px] px-[22px] py-12 sm:px-12 sm:py-16">
        <h1 className="font-serif text-[40px] leading-[1.05] tracking-[-0.02em] sm:text-[60px]">
          Une erreur est survenue.
        </h1>
        <p className="mt-5 text-lg leading-[1.55] text-body sm:text-xl">
          Ce n&apos;est pas de votre faute. Vos réponses ne sont pas perdues ailleurs : rien
          n&apos;est enregistré. Vous pouvez réessayer tout de suite.
        </p>
        <button type="button" onClick={reset} className="pill pill-honey mt-9 px-7 py-4 text-lg">
          Réessayer
        </button>
        <p className="mt-6 text-[17px] text-muted">Si le problème continue, revenez un peu plus tard.</p>
      </main>
    </>
  );
}
