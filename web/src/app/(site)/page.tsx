import Image from "next/image";
import Link from "next/link";
import mainTenue from "@/images/main-tenue.webp";
import mainLilas from "@/images/main-lilas.webp";

export default function Home() {
  return (
    <div>
      {/* Héro « pleine présence » : la photo touche le header et la bande promesses */}
      <section className="mx-auto max-w-[1400px]">
        <div className="grid items-stretch lg:grid-cols-[1fr_430px]">
          <div className="flex flex-col justify-center px-6 pb-16 pt-16 sm:pt-24 lg:pb-[72px] lg:pl-[60px] lg:pr-14 lg:pt-[88px]">
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              Vous avez travaillé toute une vie. Ces aides sont{" "}
              <span className="underline decoration-brand decoration-[6px] underline-offset-[10px]">
                à vous
              </span>
              .
            </h1>
            <p className="mt-[34px] max-w-[560px] text-xl leading-relaxed">
              On vous pose une douzaine de questions simples, et on vous dit quelles aides
              demander, où et comment. Comme le ferait un proche qui connaît bien les démarches.
            </p>
            <div className="mt-[38px] flex flex-wrap items-center gap-[22px]">
              <Link
                href="/simulateur"
                className="inline-block whitespace-nowrap rounded-lg bg-brand px-8 py-4 text-xl font-bold text-white transition hover:bg-brand-dark active:translate-y-px"
              >
                Découvrir mes droits
              </Link>
              <span className="text-muted">Gratuit, anonyme, environ 5 minutes.</span>
            </div>
          </div>
          <div className="relative hidden min-h-[560px] lg:block">
            <Image
              src={mainTenue}
              alt="La main d'une personne âgée qui serre celle qui l'accompagne"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 430px, 0px"
              className="object-cover object-[35%_center]"
              priority
            />
            {/* Voile de raccord très subtil entre le fond crème et la photo */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(253,251,247,0.6)_0%,rgba(253,251,247,0)_8%)]"
            />
          </div>
        </div>
      </section>

      {/* Promesses : bande sable pleine largeur, filets verticaux terracotta */}
      <section aria-label="Nos engagements" className="border-t border-border bg-card">
        <ul className="mx-auto grid max-w-5xl gap-8 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
          <Promesse>Gratuit et sans publicité</Promesse>
          <Promesse>Aucune inscription obligatoire</Promesse>
          <Promesse>Des mots simples, jamais de jargon</Promesse>
          <Promesse>Des sources officielles, vérifiées</Promesse>
        </ul>
      </section>

      {/* L'histoire qui a fait naître le service : bande pleine largeur, à plat */}
      {/* Citation : bande sombre pleine largeur, la photo occupe le tiers droit
          et se fond dans le fond (une photo macro en pleine largeur paraîtrait géante) */}
      <section className="bg-[#1c140e]">
        <div className="relative flex min-h-[380px] items-center">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 sm:block">
            <Image
              src={mainLilas}
              alt="La main d'une personne âgée qui tient une branche de lilas en bouton"
              fill
              placeholder="blur"
              sizes="40vw"
              className="object-cover"
            />
            {/* Fondu de la photo vers le fond sombre de la bande */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(90deg,#1c140e_0%,rgba(28,20,14,0.35)_45%,rgba(28,20,14,0)_100%)]"
            />
          </div>
          <div className="relative mx-auto w-full max-w-5xl px-6 py-[72px]">
            <blockquote className="max-w-[640px] sm:max-w-[52%]">
              <p className="text-3xl font-bold leading-[1.35] tracking-tight text-background">
                «&nbsp;Ma mère avait droit au passe Améthyste depuis des années. Personne ne le lui
                avait dit.&nbsp;»
              </p>
              <footer className="mt-[18px] text-[19px] text-[#e8ddcf]">
                L&apos;histoire qui a fait naître ce service
              </footer>
            </blockquote>
          </div>
        </div>
        {/* Mobile : la photo passe sous le texte au lieu de se glisser derrière */}
        <div className="relative h-52 sm:hidden">
          <Image
            src={mainLilas}
            alt="La main d'une personne âgée qui tient une branche de lilas en bouton"
            fill
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Étapes : grands chiffres, colonnes à filets */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Comment ça marche</h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          <Etape n={1} titre="Vous répondez">
            Des questions simples : âge, commune, situation. Jamais de montant précis.
          </Etape>
          <Etape n={2} titre="On vérifie tout">
            Aides nationales, caisse de retraite, territoire : tout est passé en revue.
          </Etape>
          <Etape n={3} titre="Vous demandez">
            Pour chaque aide : pourquoi vous y avez droit et le bon guichet où la demander.
          </Etape>
        </ol>
        <div className="mt-14">
          <Link
            href="/simulateur"
            className="inline-block whitespace-nowrap rounded-lg bg-brand px-8 py-4 text-xl font-bold text-white transition hover:bg-brand-dark active:translate-y-px"
          >
            Découvrir mes droits
          </Link>
        </div>
      </section>
    </div>
  );
}

function Promesse({ children }: { children: React.ReactNode }) {
  return (
    <li className="border-l-[3px] border-brand pl-4 text-lg font-bold leading-snug">
      {children}
    </li>
  );
}

function Etape({
  n,
  titre,
  children,
}: {
  n: number;
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-t-2 border-foreground pt-5">
      <span aria-hidden className="text-5xl font-bold leading-none text-brand">
        {n}
      </span>
      <h3 className="mt-4 text-xl font-bold">{titre}</h3>
      <p className="mt-2 text-lg leading-relaxed text-muted">{children}</p>
    </li>
  );
}
