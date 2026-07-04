import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="print:hidden border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="flex items-center gap-2 py-2 text-xl font-bold text-brand-dark">
          {/* Marque : mêmes feuilles de sésame que l'icône du site. */}
          <svg viewBox="0 0 64 64" aria-hidden className="h-8 w-8">
            <path d="M32 14 C39 24 40 38 32 47 C24 38 25 24 32 14 Z" fill="var(--brand)" />
            <path
              d="M32 14 C39 24 40 38 32 47 C24 38 25 24 32 14 Z"
              fill="#c97b52"
              transform="rotate(-42 32 50)"
            />
            <path
              d="M32 14 C39 24 40 38 32 47 C24 38 25 24 32 14 Z"
              fill="#c97b52"
              transform="rotate(42 32 50)"
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
