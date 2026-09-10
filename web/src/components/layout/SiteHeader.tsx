import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * En-tête des pages éditoriales (accueil, pages légales).
 * Sur mobile, la navigation se réduit au bouton « Commencer ».
 */
export function SiteHeader({ current }: { current?: "accessibilite" }) {
  return (
    <header className="print:hidden relative z-[2] flex items-center justify-between gap-4 px-[22px] py-4 sm:px-12 sm:py-6 mx-auto w-full max-w-[1200px]">
      <Logo />
      <nav aria-label="Navigation principale" className="flex items-center gap-4 text-[17px] text-muted sm:gap-8">
        <Link href="/#comment-ca-marche" className="hidden hover:text-foreground lg:inline">
          Comment ça marche
        </Link>
        <Link href="/simulateur?pour=proche" className="hidden hover:text-foreground lg:inline">
          Pour un proche
        </Link>
        <Link
          href="/accessibilite"
          aria-current={current === "accessibilite" ? "page" : undefined}
          className={`hidden hover:text-foreground lg:inline ${current === "accessibilite" ? "text-foreground" : ""}`}
        >
          Accessibilité
        </Link>
        <Link href="/simulateur" className="pill pill-honey px-5 py-3 text-[17px]">
          Commencer
        </Link>
      </nav>
    </header>
  );
}
