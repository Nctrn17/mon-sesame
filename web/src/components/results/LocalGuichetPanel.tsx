"use client";

import { useEffect, useState } from "react";
import { findGuichets, type Guichets, type LocalGuichet } from "@/domain/geo/guichet";
import type { Commune } from "@/domain/geo/types";

function ContactCard({
  titre,
  pourQuoi,
  guichet,
}: {
  titre: string;
  pourQuoi: string;
  guichet: LocalGuichet;
}) {
  return (
    <div className="rounded-xl bg-card p-4">
      <p className="text-sm font-medium text-brand-dark">{titre}</p>
      <p className="font-semibold text-foreground">{guichet.nom ?? titre}</p>
      <p className="mt-1 text-muted">{pourQuoi}</p>
      {guichet.adresse ? <p className="mt-1 text-foreground">{guichet.adresse}</p> : null}
      {guichet.telephone ? (
        <p className="mt-1 text-lg text-foreground">
          Téléphone :{" "}
          <a
            href={`tel:${guichet.telephone.replace(/\s/g, "")}`}
            className="font-semibold text-brand-dark underline"
          >
            {guichet.telephone}
          </a>
        </p>
      ) : null}
      {guichet.siteInternet ? (
        <p className="mt-1">
          <a
            href={guichet.siteInternet}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-dark underline"
          >
            Site internet
          </a>
        </p>
      ) : null}
    </div>
  );
}

export function LocalGuichetPanel({ commune }: { commune?: Commune }) {
  const [loaded, setLoaded] = useState(!commune);
  const [guichets, setGuichets] = useState<Guichets>({ ccas: null, departement: null });

  useEffect(() => {
    if (!commune) return;
    const controller = new AbortController();
    findGuichets(commune.code, commune.codeDepartement, controller.signal).then((g) => {
      setGuichets(g);
      setLoaded(true);
    });
    return () => controller.abort();
  }, [commune]);

  if (!loaded) return null;

  const { ccas, departement } = guichets;
  const hasAny = ccas || departement;

  return (
    <aside className="mt-8 rounded-2xl border-2 border-brand bg-brand-light p-6">
      <h2 className="text-xl font-semibold text-brand-dark">Où vous faire aider près de chez vous</h2>
      {hasAny ? (
        <>
          <p className="mt-2 text-foreground">
            Selon la démarche, voici vos interlocuteurs de proximité :
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {ccas ? (
              <ContactCard
                titre="Votre CCAS (mairie)"
                pourQuoi="Aide sociale communale, forfait Améthyste, secours, téléassistance."
                guichet={ccas}
              />
            ) : null}
            {departement ? (
              <ContactCard
                titre="Votre conseil départemental"
                pourQuoi="APA, aide à domicile, aide à l'hébergement (ASH), carte mobilité inclusion."
                guichet={departement}
              />
            ) : null}
          </div>
        </>
      ) : (
        <p className="mt-2 text-foreground">
          Pour plusieurs démarches, deux bons interlocuteurs : le CCAS (demandez « le CCAS » à
          l&apos;accueil de votre mairie) et le conseil départemental (APA, aide à domicile). C&apos;est
          gratuit et ils sont là pour vous aider.
        </p>
      )}
    </aside>
  );
}
