import type { Metadata } from "next";
import { LegalH2, LegalLayout, LegalP } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Données personnelles : Mon sésame",
  description:
    "Ce que Mon sésame fait de vos réponses : rien n'est conservé, aucun compte n'est requis.",
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout current="/confidentialite" title="Vos données personnelles">

      <LegalP first>
        Mon sésame est conçu pour fonctionner sans conserver vos informations. Cette page
        explique simplement ce qui se passe quand vous utilisez le simulateur.
      </LegalP>

      <LegalH2>Ce que nous vous demandons</LegalH2>
      <LegalP>
        Le questionnaire porte sur votre date de naissance, votre commune et votre situation
        (retraite, logement, autonomie, santé). Nous ne demandons jamais votre nom, votre
        adresse précise, votre numéro de sécurité sociale ni vos montants exacts de revenus.
      </LegalP>

      <LegalH2>Ce que deviennent vos réponses</LegalH2>
      <LegalP>
        Vos réponses restent dans votre navigateur, le temps du calcul. Elles ne sont pas
        enregistrées sur nos serveurs, ne sont pas transmises à des tiers à des fins
        commerciales et disparaissent quand vous fermez la page. Il n&apos;y a ni compte ni
        inscription.
      </LegalP>

      <LegalH2>Les services techniques utilisés</LegalH2>
      <LegalP>
        Pour fonctionner, le site interroge des services publics ou d&apos;intérêt général :
        l&apos;annuaire des communes (geo.api.gouv.fr), l&apos;annuaire de
        l&apos;administration (service-public.fr) et le référentiel data·inclusion. Seule
        votre commune leur est transmise, jamais l&apos;ensemble de vos réponses. Ces
        traitements ont lieu en France et dans l&apos;Union européenne.
      </LegalP>

      <LegalH2>Cookies</LegalH2>
      <LegalP>
        Le site ne dépose aucun cookie publicitaire ni traceur de suivi.
      </LegalP>

      <LegalH2>Vos droits</LegalH2>
      <LegalP>
        Conformément au règlement général sur la protection des données (RGPD), vous disposez
        de droits d&apos;accès, de rectification et d&apos;effacement. Comme nous ne conservons
        aucune donnée, il n&apos;y a en pratique rien à effacer. Pour toute question, écrivez à
        contact@walidai.fr. Vous pouvez aussi saisir la CNIL (cnil.fr).
      </LegalP>
    </LegalLayout>
  );
}
