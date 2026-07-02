import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="print:hidden border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="flex items-center gap-2 py-2 text-xl font-bold text-brand-dark">
          <span aria-hidden>🧭</span>
          <span>Boussole</span>
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
