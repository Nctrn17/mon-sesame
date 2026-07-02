import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="print:hidden border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="flex items-center gap-2 py-2 text-xl font-bold text-brand-dark">
          {/* Marque : même clé que l'icône du site, en une couleur. */}
          <svg viewBox="0 0 64 64" aria-hidden className="h-7 w-7">
            <circle cx="17" cy="32" r="10" fill="none" stroke="var(--brand)" strokeWidth="6" />
            <path
              d="M27 32 H56 M45 32 V42 M54 32 V44"
              stroke="var(--brand)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <span>Mon sésame</span>
        </Link>
        <Link
          href="/simulateur"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark active:translate-y-px"
        >
          Découvrir mes droits
        </Link>
      </div>
    </header>
  );
}
