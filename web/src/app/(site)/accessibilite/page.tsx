import type { Metadata } from "next";
import { LegalH2, LegalLayout, LegalP } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Accessibilité : Mon sésame",
  description: "Engagement d'accessibilité du service Mon sésame.",
};

export default function AccessibilitePage() {
  return (
    <LegalLayout current="/accessibilite" title="Accessibilité">

      <LegalP first>
        Mon sésame s&apos;adresse d&apos;abord aux personnes retraitées et à leurs proches. Le
        site est conçu pour être lisible et utilisable par le plus grand nombre : texte
        agrandi par défaut, contrastes élevés, navigation possible entièrement au clavier,
        compatibilité avec les lecteurs d&apos;écran, respect du réglage « réduire les
        animations » de votre appareil.
      </LegalP>

      <LegalH2>État de conformité</LegalH2>
      <LegalP>
        Le site vise la conformité au référentiel général d&apos;amélioration de
        l&apos;accessibilité (RGAA). Un audit formel n&apos;a pas encore été réalisé : le site
        est donc, à ce stade, non audité au sens du RGAA. Cette page sera mise à jour dès
        qu&apos;un audit aura été mené.
      </LegalP>

      <LegalH2>Signaler un problème</LegalH2>
      <LegalP>
        Si vous rencontrez une difficulté pour utiliser le site (texte trop petit, élément
        inaccessible au clavier, contenu incompréhensible), écrivez-nous à [adresse
        électronique de contact] en décrivant le problème et la page concernée. Nous nous
        engageons à vous répondre.
      </LegalP>
    </LegalLayout>
  );
}
