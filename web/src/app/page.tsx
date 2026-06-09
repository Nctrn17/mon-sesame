import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Héro */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 inline-block bg-brand-light px-3 py-1 text-sm font-semibold text-brand">
              Service gratuit et anonyme
            </p>
            <h1 className="text-4xl font-bold leading-tight text-brand sm:text-5xl">
              Vous partez à la retraite ? Ne laissez aucune aide de côté.
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-foreground">
              Chaque année, des milliards d&apos;euros d&apos;aides ne sont jamais réclamés, faute de
              savoir qu&apos;on y a droit. Répondez à quelques questions simples et découvrez, vous
              aussi, ce à quoi vous pouvez prétendre.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/simulateur"
                className="inline-block bg-brand px-8 py-4 text-xl font-semibold text-white transition hover:bg-brand-dark"
              >
                Découvrir mes droits
              </Link>
              <span className="text-muted">Gratuit · Sans inscription · Environ 3 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi */}
      <section className="bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-bold text-foreground">
            Pourquoi tant d&apos;aides passent inaperçues
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-muted">
            Les aides ne sont presque jamais versées automatiquement : il faut les connaître et les
            demander, souvent au bon guichet (le département ou la mairie, pas le transporteur ou la
            banque). Résultat : près d&apos;un senior sur deux qui aurait droit au minimum vieillesse
            ne le demande pas.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Stat number="≈ 10 Md€" label="d'aides non réclamées chaque année en France" />
            <Stat number="1 sur 2" label="senior éligible au minimum vieillesse ne le demande pas" />
            <Stat number="dès 60 ans" label="certains droits s'ouvrent bien avant 65 ans" />
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-bold text-foreground">Comment ça marche</h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          <Step n={1} title="Vous répondez à quelques questions">
            Âge, commune, situation : des questions simples, sans jamais demander de montant
            précis.
          </Step>
          <Step n={2} title="On croise votre profil avec les aides">
            Aides nationales, de votre caisse de retraite et de votre territoire : tout est passé
            en revue.
          </Step>
          <Step n={3} title="Vous obtenez la liste, les montants et le bon guichet">
            Pour chaque aide : pourquoi vous y avez droit, combien environ, et exactement où et
            comment la demander.
          </Step>
        </ol>
        <div className="mt-12">
          <Link
            href="/simulateur"
            className="inline-block bg-brand px-8 py-4 text-xl font-semibold text-white transition hover:bg-brand-dark"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Confiance */}
      <section className="bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-bold text-foreground">Un service de confiance</h2>
          <ul className="mt-6 max-w-3xl space-y-3 text-lg text-foreground">
            <Trust>Gratuit et sans publicité, pensé pour les retraités.</Trust>
            <Trust>
              Anonyme : aucune inscription obligatoire, vos réponses ne sont pas conservées.
            </Trust>
            <Trust>Des résultats fondés sur des sources officielles, mis à jour régulièrement.</Trust>
            <Trust>Des estimations claires, jamais présentées comme une décision définitive.</Trust>
          </ul>
          <p className="mt-8 max-w-3xl border-l-4 border-brand bg-background p-4 text-muted">
            Aujourd&apos;hui : aides nationales et Île-de-France. Bientôt : toute la France.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-l-4 border-brand bg-background p-6">
      <p className="text-3xl font-bold text-brand">{number}</p>
      <p className="mt-2 text-lg text-muted">{label}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li>
      <span className="flex h-12 w-12 items-center justify-center bg-brand text-xl font-bold text-white">
        {n}
      </span>
      <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-lg leading-relaxed text-muted">{children}</p>
    </li>
  );
}

function Trust({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="text-money">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}
