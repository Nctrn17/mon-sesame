import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibilité : Boussole",
  description: "Engagement d'accessibilité du service Boussole.",
};

export default function AccessibilitePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground">Accessibilité</h1>

      <p className="mt-4 text-lg leading-relaxed">
        Boussole s&apos;adresse d&apos;abord aux personnes retraitées et à leurs proches. Le
        site est conçu pour être lisible et utilisable par le plus grand nombre : texte
        agrandi par défaut, contrastes élevés, navigation possible entièrement au clavier,
        compatibilité avec les lecteurs d&apos;écran, respect du réglage « réduire les
        animations » de votre appareil.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">État de conformité</h2>
      <p className="mt-3 text-lg leading-relaxed">
        Le site vise la conformité au référentiel général d&apos;amélioration de
        l&apos;accessibilité (RGAA). Un audit formel n&apos;a pas encore été réalisé : le site
        est donc, à ce stade, non audité au sens du RGAA. Cette page sera mise à jour dès
        qu&apos;un audit aura été mené.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">
        Signaler un problème
      </h2>
      <p className="mt-3 text-lg leading-relaxed">
        Si vous rencontrez une difficulté pour utiliser le site (texte trop petit, élément
        inaccessible au clavier, contenu incompréhensible), écrivez-nous à [adresse
        électronique de contact] en décrivant le problème et la page concernée. Nous nous
        engageons à vous répondre.
      </p>
    </div>
  );
}
