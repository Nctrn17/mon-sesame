import type { Metadata } from "next";
import { Wizard } from "@/components/wizard/Wizard";

export const metadata: Metadata = {
  title: "Simulateur : vos aides de retraité",
  description:
    "Répondez à quelques questions pour découvrir les aides auxquelles vous avez droit. Gratuit et anonyme.",
};

export default function SimulateurPage() {
  return (
    <div className="px-4 py-10 sm:py-14">
      <h1 className="sr-only">Simulateur d&apos;aides pour les retraités</h1>
      <Wizard />
    </div>
  );
}
