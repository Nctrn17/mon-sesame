import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="print:hidden mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-8 text-base text-muted">
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
        <nav aria-label="Liens légaux" className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/mentions-legales" className="underline hover:text-foreground">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="underline hover:text-foreground">
            Données personnelles
          </Link>
          <Link href="/accessibilite" className="underline hover:text-foreground">
            Accessibilité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
