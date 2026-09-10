import Link from "next/link";

const PAGES = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Données personnelles" },
  { href: "/accessibilite", label: "Accessibilité" },
] as const;

export type LegalPage = (typeof PAGES)[number]["href"];

/** Pages d'information : menu latéral collant + article étroit. */
export function LegalLayout({
  current,
  title,
  children,
}: {
  current: LegalPage;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[1120px] items-start gap-10 px-[22px] py-10 sm:px-12 sm:py-14 lg:grid-cols-[320px_1fr] lg:gap-16">
      <nav aria-label="Pages d'information" className="lg:sticky lg:top-6">
        <p className="text-[15px] text-muted">Informations</p>
        <ul className="mt-3 flex flex-col text-lg">
          {PAGES.map((p, i) => {
            const active = p.href === current;
            return (
              <li
                key={p.href}
                className={`border-t border-border py-3 ${i === PAGES.length - 1 ? "border-b" : ""} ${active ? "font-medium" : ""}`}
              >
                <Link
                  href={p.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "text-foreground" : "text-muted hover:text-foreground"}
                >
                  {p.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <article className="legal max-w-[680px]">
        <h1 className="font-serif text-[40px] leading-[1.05] tracking-[-0.02em] sm:text-[56px]">
          {title}
        </h1>
        {children}
      </article>
    </div>
  );
}

export function LegalH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-11 font-serif text-[28px] tracking-[-0.01em] sm:text-[32px]">{children}</h2>
  );
}

export function LegalP({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <p className={`${first ? "mt-6" : "mt-3"} text-[19px] leading-[1.6] text-body`}>{children}</p>
  );
}
