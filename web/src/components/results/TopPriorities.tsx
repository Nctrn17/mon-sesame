import type { AidResult } from "@/domain/eligibility/types";

/**
 * Les démarches les plus importantes, en tête de résultats, pour qu'un
 * senior sache par quoi commencer sans lire toute la page.
 */
export function TopPriorities({ items }: { items: readonly AidResult[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border-2 border-money bg-money-light p-6">
      <h2 className="text-xl font-bold text-money">Par où commencer</h2>
      <p className="mt-1 text-foreground">Vos démarches les plus importantes, dans l&apos;ordre :</p>
      <ol className="mt-4 space-y-3">
        {items.map((r, i) => (
          <li key={r.aid.id} className="rounded-xl bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-money font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-foreground">{r.aid.name}</p>
                <p className="text-foreground">{r.aid.valueStatement}</p>
                <p className="mt-1 text-base text-muted">À demander à : {r.aid.howToApply.organism}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
