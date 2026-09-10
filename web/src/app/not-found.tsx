import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <>
      <header className="flex items-center px-[22px] py-4 sm:px-12 sm:py-6">
        <Logo />
      </header>
      <main id="contenu" className="max-w-[760px] px-[22px] py-12 sm:px-12 sm:py-16">
        <h1 className="font-serif text-[40px] leading-[1.05] tracking-[-0.02em] sm:text-[60px]">
          Cette page n&apos;existe pas.
        </h1>
        <p className="mt-5 text-lg leading-[1.55] text-body sm:text-xl">
          L&apos;adresse est peut-être mal recopiée, ou la page a été déplacée.
        </p>
        <Link href="/" className="pill pill-honey mt-9 px-7 py-4 text-lg">
          Revenir à l&apos;accueil
        </Link>
      </main>
    </>
  );
}
