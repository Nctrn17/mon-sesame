import type { Metadata } from "next";
import { LegalH2, LegalLayout, LegalP } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Mentions légales : Mon sésame",
  description: "Mentions légales du service Mon sésame.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout current="/mentions-legales" title="Mentions légales">

      <LegalH2>Éditeur du site</LegalH2>
      <LegalP>
        Le site Mon sésame est édité à titre non professionnel par une personne physique,
        conformément à l&apos;article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la
        confiance dans l&apos;économie numérique. Son identité a été communiquée à
        l&apos;hébergeur, qui la conserve. Vous pouvez joindre l&apos;éditeur à
        l&apos;adresse contact@walidai.fr.
      </LegalP>

      <LegalH2>Hébergement</LegalH2>
      <LegalP>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
        États-Unis (vercel.com).
      </LegalP>

      <LegalH2>Nature du service</LegalH2>
      <LegalP>
        Mon sésame est un service d&apos;information gratuit. Les résultats affichés sont des
        estimations non contractuelles, fondées sur des sources officielles. Seuls les
        organismes compétents (caisses de retraite, départements, communes, administrations)
        décident de l&apos;attribution et du montant des aides.
      </LegalP>

      <LegalH2>Nous contacter</LegalH2>
      <LegalP>
        Pour toute question sur le site ou son contenu, écrivez à contact@walidai.fr.
      </LegalP>
    </LegalLayout>
  );
}
