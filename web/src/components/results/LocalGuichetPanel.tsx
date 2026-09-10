"use client";

import { useEffect, useState } from "react";
import { findGuichets, type Guichets, type LocalGuichet } from "@/domain/geo/guichet";
import type { Commune } from "@/domain/geo/types";

function Contact({ titre, guichet }: { titre: string; guichet: LocalGuichet }) {
  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="text-[15px] text-muted">{titre}</p>
      <p className="mt-0.5 font-medium text-foreground">{guichet.nom ?? titre}</p>
      {guichet.adresse ? <p className="mt-0.5 text-base text-body">{guichet.adresse}</p> : null}
      {guichet.telephone ? (
        <p className="mt-0.5 text-base">
          <a
            href={`tel:${guichet.telephone.replace(/\s/g, "")}`}
            className="link-sienna text-foreground"
          >
            {guichet.telephone}
          </a>
        </p>
      ) : null}
      {guichet.siteInternet ? (
        <p className="mt-0.5 text-base">
          <a
            href={guichet.siteInternet}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Site internet de ${guichet.nom ?? titre} (nouvelle fenêtre)`}
            className="link-sienna text-foreground"
          >
            Site internet
          </a>
        </p>
      ) : null}
    </div>
  );
}

/** Carte « Pour commencer » : le CCAS et le département de la commune. */
export function LocalGuichetPanel({ commune }: { commune?: Commune }) {
  const [guichets, setGuichets] = useState<Guichets>({ ccas: null, departement: null });

  useEffect(() => {
    if (!commune) return;
    const controller = new AbortController();
    findGuichets(commune.code, commune.codeDepartement, controller.signal).then(setGuichets);
    return () => controller.abort();
  }, [commune]);

  const { ccas, departement } = guichets;

  return (
    <div className="rounded-[18px] border border-border bg-surface p-[26px]">
      <p className="text-[15px] text-muted">Pour commencer</p>
      <p className="mt-2.5 text-[17px] leading-[1.6]">
        Le CCAS de votre mairie peut vous accompagner pour plusieurs de ces démarches,
        gratuitement. France Services aussi.
      </p>
      {ccas ? <Contact titre="Votre CCAS (mairie)" guichet={ccas} /> : null}
      {departement ? <Contact titre="Votre conseil départemental" guichet={departement} /> : null}
      <a
        href="https://www.france-services.gouv.fr/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Trouver l'espace France Services le plus proche (nouvelle fenêtre)"
        className="link-sienna mt-3 inline-block text-base text-foreground"
      >
        Trouver le plus proche
      </a>
    </div>
  );
}
