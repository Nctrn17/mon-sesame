import Link from "next/link";

/** Marque : point 12px en dégradé graine + wordmark Instrument Serif. */
export function Logo({ size = "desktop" }: { size?: "desktop" | "mobile" }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 font-serif tracking-[-0.01em] text-foreground ${
        size === "mobile" ? "text-2xl" : "text-2xl sm:text-[28px]"
      }`}
    >
      <span className="dot" aria-hidden />
      Mon sésame
    </Link>
  );
}
