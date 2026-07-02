import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Données personnelles : Boussole",
  description:
    "Ce que Boussole fait de vos réponses : rien n'est conservé, aucun compte n'est requis.",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground">Vos données personnelles</h1>

      <p className="mt-4 text-lg leading-relaxed">
        Boussole est conçu pour fonctionner sans conserver vos informations. Cette page
        explique simplement ce qui se passe quand vous utilisez le simulateur.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">
        Ce que nous vous demandons
      </h2>
      <p className="mt-3 text-lg leading-relaxed">
        Le questionnaire porte sur votre date de naissance, votre commune et votre situation
        (retraite, logement, autonomie, santé). Nous ne demandons jamais votre nom, votre
        adresse précise, votre numéro de sécurité sociale ni vos montants exacts de revenus.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">
        Ce que deviennent vos réponses
      </h2>
      <p className="mt-3 text-lg leading-relaxed">
        Vos réponses restent dans votre navigateur, le temps du calcul. Elles ne sont pas
        enregistrées sur nos serveurs, ne sont pas transmises à des tiers à des fins
        commerciales et disparaissent quand vous fermez la page. Il n&apos;y a ni compte ni
        inscription.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">
        Les services techniques utilisés
      </h2>
      <p className="mt-3 text-lg leading-relaxed">
        Pour fonctionner, le site interroge des services publics ou d&apos;intérêt général :
        l&apos;annuaire des communes (geo.api.gouv.fr), l&apos;annuaire de
        l&apos;administration (service-public.fr) et le référentiel data·inclusion. Seule
        votre commune leur est transmise, jamais l&apos;ensemble de vos réponses. Ces
        traitements ont lieu en France et dans l&apos;Union européenne.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">Cookies</h2>
      <p className="mt-3 text-lg leading-relaxed">
        Le site ne dépose aucun cookie publicitaire ni traceur de suivi.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">Vos droits</h2>
      <p className="mt-3 text-lg leading-relaxed">
        Conformément au règlement général sur la protection des données (RGPD), vous disposez
        de droits d&apos;accès, de rectification et d&apos;effacement. Comme nous ne conservons
        aucune donnée, il n&apos;y a en pratique rien à effacer. Pour toute question, écrivez à
        [adresse électronique de contact]. Vous pouvez aussi saisir la CNIL (cnil.fr).
      </p>
    </div>
  );
}
