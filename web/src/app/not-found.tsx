import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-foreground">
        Cette page n&apos;existe pas
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        L&apos;adresse est peut-être mal recopiée, ou la page a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-brand px-8 py-4 text-xl font-semibold text-white transition hover:bg-brand-dark active:translate-y-px"
      >
        Revenir à l&apos;accueil
      </Link>
    </div>
  );
}
