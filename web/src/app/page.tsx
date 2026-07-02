import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Héro : purement typographique, l'accent terracotta souligne la promesse */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
          Vous avez travaillé toute une vie. Ces aides sont{" "}
          <span className="underline decoration-brand decoration-[6px] underline-offset-[10px]">
            à vous
          </span>
          .
        </h1>
        <p className="mt-9 max-w-2xl text-xl leading-relaxed">
          On vous pose une douzaine de questions simples, et on vous dit quelles aides demander,
          où et comment. Comme le ferait un proche qui connaît bien les démarches.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/simulateur"
            className="inline-block whitespace-nowrap rounded-lg bg-brand px-8 py-4 text-xl font-bold text-white transition hover:bg-brand-dark active:translate-y-px"
          >
            Découvrir mes droits
          </Link>
          <span className="text-muted">Gratuit, anonyme, environ 5 minutes.</span>
        </div>
      </section>

      {/* Promesses : quatre colonnes à filets, sans titre de section */}
      <section aria-label="Nos engagements" className="mx-auto max-w-5xl px-6 pb-20">
        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          <Promesse>Gratuit et sans publicité</Promesse>
          <Promesse>Aucune inscription obligatoire</Promesse>
          <Promesse>Des mots simples, jamais de jargon</Promesse>
          <Promesse>Des sources officielles, vérifiées</Promesse>
        </ul>
      </section>

      {/* L'histoire qui a fait naître le service : bande pleine largeur, à plat */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <blockquote className="max-w-3xl">
            <p className="text-3xl font-bold leading-snug tracking-tight">
              «&nbsp;Ma mère avait droit au passe Améthyste depuis des années. Personne ne le lui
              avait dit.&nbsp;»
            </p>
            <footer className="mt-5 text-lg text-muted">
              L&apos;histoire qui a fait naître ce service
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Étapes : grands chiffres, colonnes à filets */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Comment ça marche</h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          <Etape n={1} titre="Vous répondez">
            Des questions simples : âge, commune, situation. Jamais de montant précis.
          </Etape>
          <Etape n={2} titre="On vérifie tout">
            Aides nationales, caisse de retraite, territoire : tout est passé en revue.
          </Etape>
          <Etape n={3} titre="Vous demandez">
            Pour chaque aide : pourquoi vous y avez droit et le bon guichet où la demander.
          </Etape>
        </ol>
        <div className="mt-14">
          <Link
            href="/simulateur"
            className="inline-block whitespace-nowrap rounded-lg bg-brand px-8 py-4 text-xl font-bold text-white transition hover:bg-brand-dark active:translate-y-px"
          >
            Découvrir mes droits
          </Link>
        </div>
      </section>
    </div>
  );
}

function Promesse({ children }: { children: React.ReactNode }) {
  return (
    <li className="border-t-2 border-foreground pt-4 text-lg font-bold leading-snug">
      {children}
    </li>
  );
}

function Etape({
  n,
  titre,
  children,
}: {
  n: number;
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-t-2 border-foreground pt-5">
      <span aria-hidden className="text-5xl font-bold leading-none text-brand">
        {n}
      </span>
      <h3 className="mt-4 text-xl font-bold">{titre}</h3>
      <p className="mt-2 text-lg leading-relaxed text-muted">{children}</p>
    </li>
  );
}
