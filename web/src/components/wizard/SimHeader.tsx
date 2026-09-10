import { Logo } from "@/components/brand/Logo";

/** En-tête du simulateur : logo + action(s) propres à l'écran. */
export function SimHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="print:hidden relative flex items-center justify-between gap-4 px-[22px] py-4 sm:px-12 sm:py-6 mx-auto w-full max-w-[1200px]">
      <Logo />
      {children ? <div className="flex items-center gap-2.5 text-base">{children}</div> : null}
    </header>
  );
}
