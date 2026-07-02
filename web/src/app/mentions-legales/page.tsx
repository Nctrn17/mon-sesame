import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales : Boussole",
  description: "Mentions légales du service Boussole.",
};

/*
  Les champs entre crochets sont à compléter avant la mise en ligne publique :
  identité de l'éditeur et coordonnées de contact.
*/
export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground">Mentions légales</h1>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">Éditeur du site</h2>
      <p className="mt-3 text-lg leading-relaxed">
        Le site Boussole est édité par [Nom ou raison sociale de l&apos;éditeur],
        [adresse], joignable à l&apos;adresse [adresse électronique de contact].
      </p>
      <p className="mt-3 text-lg leading-relaxed">
        Directeur de la publication : [nom du directeur de la publication].
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">Hébergement</h2>
      <p className="mt-3 text-lg leading-relaxed">
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
        États-Unis (vercel.com).
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">Nature du service</h2>
      <p className="mt-3 text-lg leading-relaxed">
        Boussole est un service d&apos;information gratuit. Les résultats affichés sont des
        estimations non contractuelles, fondées sur des sources officielles. Seuls les
        organismes compétents (caisses de retraite, départements, communes, administrations)
        décident de l&apos;attribution et du montant des aides.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">Nous contacter</h2>
      <p className="mt-3 text-lg leading-relaxed">
        Pour toute question sur le site ou son contenu, écrivez à [adresse électronique de
        contact].
      </p>
    </div>
  );
}
