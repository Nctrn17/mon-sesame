"use client";

import { useEffect, useState } from "react";
import { findLocalServices, type LocalService } from "@/domain/geo/localAides";
import type { Commune } from "@/domain/geo/types";

/**
 * Aides et services locaux de la commune (data.inclusion). Ne s'affiche que
 * s'il y a des résultats (donc rien tant que la clé API n'est pas configurée).
 */
export function LocalAidsSection({ commune }: { commune?: Commune }) {
  const [services, setServices] = useState<LocalService[]>([]);

  useEffect(() => {
    if (!commune) return;
    const controller = new AbortController();
    findLocalServices(commune.code, controller.signal).then((r) => setServices(r.services));
    return () => controller.abort();
  }, [commune]);

  if (services.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-foreground">Aides et services près de chez vous</h2>
      <p className="mt-1 text-muted">
        Des structures locales qui peuvent vous accompagner dans vos démarches.
      </p>
      <div className="mt-4 space-y-4">
        {services.map((s, i) => (
          <article key={i} className="rounded-2xl border-2 border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground">{s.nom}</h3>
            {s.structure ? <p className="text-muted">{s.structure}</p> : null}
            {s.resume ? <p className="mt-2 text-foreground">{s.resume}</p> : null}
            {s.telephone ? (
              <p className="mt-2 text-foreground">
                Téléphone :{" "}
                <a
                  href={`tel:${s.telephone.replace(/\s/g, "")}`}
                  className="font-semibold text-brand-dark underline"
                >
                  {s.telephone}
                </a>
              </p>
            ) : null}
            {s.lien ? (
              <a
                href={s.lien}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`En savoir plus sur ${s.nom} (nouvelle fenêtre)`}
                className="mt-2 inline-block text-brand-dark underline"
              >
                En savoir plus (nouvelle fenêtre)
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
