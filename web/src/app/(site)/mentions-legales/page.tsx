import type { Metadata } from "next";
import { LegalH2, LegalLayout, LegalP } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Mentions légales : Mon sésame",
  description: "Mentions légales du service Mon sésame.",
};

/*
  Les champs entre crochets sont à compléter avant la mise en ligne publique :
  identité de l'éditeur et coordonnées de contact.
*/
export default function MentionsLegalesPage() {
  return (
    <LegalLayout current="/mentions-legales" title="Mentions légales">

      <LegalH2>Éditeur du site</LegalH2>
      <LegalP>
        Le site Mon sésame est édité par [Nom ou raison sociale de l&apos;éditeur],
        [adresse], joignable à l&apos;adresse [adresse électronique de contact].
      </LegalP>
      <LegalP>
        Directeur de la publication : [nom du directeur de la publication].
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
        Pour toute question sur le site ou son contenu, écrivez à [adresse électronique de
        contact].
      </LegalP>
    </LegalLayout>
  );
}
