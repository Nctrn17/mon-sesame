import type { Metadata } from "next";
import { Wizard } from "@/components/wizard/Wizard";
import { EMPTY_PROFILE, type Profile } from "@/domain/profile/types";

export const metadata: Metadata = {
  title: "Faire le point : vos aides de retraité",
  description:
    "Répondez à quelques questions pour découvrir les aides auxquelles vous avez droit. Gratuit, sans inscription.",
};

/* Le simulateur dessine son propre en-tête selon l'écran (question, résultats,
   détail). `?pour=proche` pré-remplit la première question. */
export default async function SimulateurPage({
  searchParams,
}: {
  searchParams: Promise<{ pour?: string }>;
}) {
  const { pour } = await searchParams;
  const initial: Profile = pour === "proche" ? { ...EMPTY_PROFILE, fillingFor: "relative" } : EMPTY_PROFILE;
  return <Wizard key={pour ?? "self"} initialProfile={initial} />;
}
