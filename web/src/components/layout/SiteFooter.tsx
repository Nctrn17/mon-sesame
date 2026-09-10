import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="print:hidden border-t border-border text-[15px] text-muted">
      <div className="flex flex-col justify-between gap-6 px-[22px] py-8 sm:flex-row sm:gap-10 sm:px-12 mx-auto w-full max-w-[1200px]">
      <p className="max-w-[600px] leading-[1.55]">
        Service d&apos;information. Les résultats sont des estimations non contractuelles.
        Sources : service-public.fr, caisses de retraite, Anah, Île-de-France Mobilités.
      </p>
      <nav aria-label="Liens légaux" className="flex flex-wrap gap-x-6 gap-y-2 sm:whitespace-nowrap">
        <Link href="/mentions-legales" className="underline underline-offset-4 hover:text-foreground">
          Mentions légales
        </Link>
        <Link href="/confidentialite" className="underline underline-offset-4 hover:text-foreground">
          Données personnelles
        </Link>
        <Link href="/accessibilite" className="underline underline-offset-4 hover:text-foreground">
          Accessibilité
        </Link>
      </nav>
      </div>
    </footer>
  );
}
