export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted">
        <p className="font-medium text-foreground">Boussole, vos droits de retraité</p>
        <p className="mt-2 max-w-2xl">
          Service d&apos;information gratuit. Les résultats sont des estimations non
          contractuelles : seuls les organismes compétents décident de l&apos;attribution et du
          montant des aides. Nous nous appuyons sur des sources officielles (service-public.fr,
          caisses de retraite, Anah, Île-de-France Mobilités).
        </p>
        <p className="mt-3">
          Vos réponses servent au calcul et ne sont pas conservées sans votre accord. Données
          minimisées, traitées en France et dans l&apos;Union européenne.
        </p>
      </div>
    </footer>
  );
}
