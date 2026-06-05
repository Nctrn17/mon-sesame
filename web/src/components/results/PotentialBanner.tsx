interface Props {
  readonly eligibleCount: number;
  readonly toCheckCount: number;
}

export function PotentialBanner({ eligibleCount, toCheckCount }: Props) {
  if (eligibleCount === 0 && toCheckCount === 0) {
    return (
      <div className="rounded-2xl border-2 border-border bg-card p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Aucune aide détectée avec ces réponses
        </h2>
        <p className="mt-2 text-lg text-muted">
          Cela peut changer, par exemple une fois à la retraite, quand vos revenus baissent. Vous
          pouvez recommencer en ajustant vos réponses.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-money bg-money-light p-6 sm:p-8">
      <p className="text-lg font-medium text-money">Bonne nouvelle</p>
      {eligibleCount > 0 ? (
        <p className="mt-1 text-3xl font-bold text-money sm:text-4xl">
          Vous avez droit à {eligibleCount} aide{eligibleCount > 1 ? "s" : ""}
        </p>
      ) : (
        <p className="mt-1 text-2xl font-bold text-foreground">
          {toCheckCount} aide{toCheckCount > 1 ? "s" : ""} à confirmer avec vous
        </p>
      )}
      <p className="mt-3 text-lg text-foreground">
        Certaines, comme l&apos;ASPA ou la complémentaire santé, peuvent représenter plusieurs
        centaines d&apos;euros par mois. La plupart ne sont pas versées automatiquement : il faut
        les demander, et on vous montre exactement comment.
      </p>
      {eligibleCount > 0 && toCheckCount > 0 ? (
        <p className="mt-2 text-foreground">
          {toCheckCount} autre{toCheckCount > 1 ? "s" : ""} sont à confirmer avec vous, juste en
          dessous.
        </p>
      ) : null}
    </div>
  );
}
