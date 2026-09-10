import Image from "next/image";
import Link from "next/link";
import { SeedShape } from "@/components/brand/SeedShape";
import portrait from "@/images/john-thomas.jpg";

export default function Home() {
  return (
    <div>
      {/* Héro : la graine en fond, jamais au-dessus du texte */}
      <section className="relative flex min-h-[640px] flex-col justify-center overflow-hidden px-[22px] pb-16 pt-6 sm:min-h-[880px] sm:px-12 sm:pb-24 sm:pt-10 mx-auto w-full max-w-[1200px]">
        <SeedShape
          className="hidden lg:block"
          wrapper={{ right: -80, top: 10, width: 900, height: 900 }}
          shape={{ left: 220, top: 80, width: 440, height: 700 }}
          rotate={-34}
          blur={20}
        />
        <SeedShape
          className="lg:hidden"
          wrapper={{ right: -200, top: 320, width: 520, height: 560 }}
          shape={{ left: 130, top: 50, width: 270, height: 430 }}
          rotate={-34}
          blur={14}
          opacity={0.7}
        />
        <div className="relative mt-6 max-w-[820px] sm:mt-[120px]">
          <p className="text-[15px] tracking-[0.02em] text-muted sm:text-base">
            Information gratuite, sans inscription
          </p>
          <h1 className="mt-3.5 font-serif text-[60px] leading-none tracking-[-0.02em] text-foreground sm:mt-6 sm:text-[112px] sm:leading-[0.96] sm:tracking-[-0.03em]">
            Sésame,
            <br />
            ouvre-toi.
          </h1>
          <p className="mt-5 max-w-[560px] text-lg leading-[1.5] text-body sm:mt-8 sm:text-[22px] sm:leading-[1.55]">
            Pour chaque aide, il existe un mot qui ouvre la porte : son nom exact, le bon
            organisme, la phrase à dire au guichet. Répondez à quelques questions, nous vous
            donnons ce mot.
          </p>
          <div className="mt-8 flex flex-col gap-2.5 sm:mt-10 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/simulateur"
              className="pill pill-honey min-h-[56px] px-8 py-[18px] text-lg sm:text-[19px]"
            >
              Faire le point
            </Link>
            <Link
              href="/simulateur?pour=proche"
              className="link-sienna py-3.5 text-center text-[17px] text-foreground sm:py-0 sm:text-[19px] sm:[text-underline-offset:5px]"
            >
              Pour un proche
            </Link>
          </div>
        </div>
        <p className="absolute bottom-10 right-12 hidden max-w-[300px] text-right font-serif text-xl italic leading-[1.4] text-muted lg:block">
          Une graine de sésame : presque rien, et pourtant elle ouvre des portes.
        </p>
      </section>

      {/* Comment ça marche */}
      <section
        id="comment-ca-marche"
        className="grid gap-10 border-t border-border px-[22px] py-14 sm:px-12 sm:py-20 lg:grid-cols-[320px_1fr] lg:gap-16 mx-auto w-full max-w-[1200px]"
      >
        <h2 className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
          Comment
          <br className="hidden lg:inline" /> ça marche
        </h2>
        <ol className="grid gap-8 sm:grid-cols-3 sm:gap-10">
          <Etape titre="Vous décrivez votre situation" gradient="linear-gradient(165deg,#f3e7b0,#dcae4a 50%,#b85c2f)">
            Âge, commune, retraite, logement, santé. Une question à la fois, en mots courants.
          </Etape>
          <Etape titre="Nous comparons aux règles officielles" gradient="linear-gradient(165deg,#dcae4a,#b85c2f 55%,#4b2b3f)">
            Aides nationales, caisse de retraite, département, commune. Chaque règle est sourcée
            et datée.
          </Etape>
          <Etape titre="Vous repartez avec le mot qui ouvre" gradient="linear-gradient(165deg,#b85c2f,#4b2b3f)">
            Pour chaque aide : ce qu&apos;elle change pour vous, l&apos;organisme à contacter, la
            phrase exacte à dire.
          </Etape>
        </ol>
      </section>

      {/* Bande sombre : à la fin, une page à garder */}
      <section className="relative overflow-hidden bg-plum text-background">
        <div className="relative grid items-center gap-12 px-[22px] py-16 sm:px-12 sm:py-24 lg:grid-cols-[1fr_520px] lg:gap-20 mx-auto w-full max-w-[1200px]">
        <SeedShape
          wrapper={{ left: -200, bottom: -420, width: 700, height: 700 }}
          shape={{ left: 150, top: 40, width: 360, height: 580 }}
          rotate={-34}
          blur={26}
          opacity={0.5}
          grain2={false}
          grainOpacity={0}
        />
        <div className="relative">
          <h2 className="font-serif text-[40px] leading-[1.08] tracking-[-0.02em] sm:text-[48px]">
            À la fin, une page à garder.
          </h2>
          <p className="mt-5 max-w-[480px] text-lg leading-[1.55] text-plum-text sm:text-xl">
            Les aides qui vous concernent, classées en deux listes : celles à demander, celles à
            vérifier avec quelqu&apos;un. Pour chacune, l&apos;organisme et la phrase à dire. À
            imprimer ou à faire lire à un proche.
          </p>
          <ul className="mt-9 flex flex-col border-t border-[rgba(251,249,244,0.18)]">
            <Engagement>Nous ne promettons aucun montant : seul l&apos;organisme décide.</Engagement>
            <Engagement>Nous ne vendons rien : pas de publicité, pas d&apos;intermédiaire.</Engagement>
            <Engagement>
              Nous ne gardons pas vos réponses : aucun compte, rien d&apos;enregistré.
            </Engagement>
          </ul>
        </div>
        <div
          aria-hidden
          className="relative rounded-[20px] bg-background px-[34px] py-8 text-foreground shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
        >
          <p className="text-sm text-muted">D&apos;après vos réponses</p>
          <p className="mt-2 font-serif text-[34px] leading-[1.05] tracking-[-0.02em]">
            Voici ce qui
            <br />
            vous concerne.
          </p>
          <p className="mt-[22px] flex items-center gap-2.5 text-[15px] font-medium">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-honey" />À demander
          </p>
          <ul className="mt-2 flex flex-col">
            <ApercuLigne nom="Complémentaire santé solidaire" detail="Une mutuelle sans reste à charge · Assurance Maladie" />
            <ApercuLigne nom="Forfait Améthyste" detail="Transports gratuits ou réduits · CCAS de votre commune" />
            <ApercuLigne nom="Aide au logement" detail="Réduit votre loyer · La CAF" last />
          </ul>
          <p className="mt-[18px] flex items-center gap-2.5 text-[15px] font-medium">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-dot-off" />À vérifier avec
            quelqu&apos;un
          </p>
          <ul className="mt-2 flex flex-col">
            <ApercuLigne nom="Téléassistance" detail="Selon votre commune · CCAS" last />
          </ul>
        </div>
        </div>
      </section>

      {/* Pourquoi ce service */}
      <section className="grid gap-10 border-t border-border px-[22px] py-14 sm:px-12 sm:py-20 sm:pb-24 lg:grid-cols-[320px_1fr] lg:gap-16 mx-auto w-full max-w-[1200px]">
        <h2 className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
          Pourquoi
          <br className="hidden lg:inline" /> ce service
        </h2>
        <div className="grid items-start gap-8 sm:grid-cols-[300px_1fr] sm:gap-12">
          <Image
            src={portrait}
            alt=""
            width={300}
            height={380}
            sizes="(min-width: 640px) 300px, 100vw"
            placeholder="blur"
            className="h-[380px] w-full max-w-[300px] rounded-2xl object-cover [filter:sepia(0.35)_saturate(0.8)_contrast(0.95)]"
          />
          <div>
            <p className="font-serif text-[28px] leading-[1.3] tracking-[-0.01em] sm:text-[34px]">
              Ma mère avait droit aux transports gratuits depuis des années. Personne ne le lui
              avait dit.
            </p>
            <p className="mt-5 text-lg leading-[1.55] text-muted">
              Il lui manquait un mot : « forfait Améthyste ». Les aides qu&apos;on ne sait pas
              nommer sont des aides qu&apos;on n&apos;a pas. Mon sésame existe pour donner ce mot
              à temps.
            </p>
            <Link href="/simulateur" className="pill pill-ink mt-8 px-8 py-[18px] text-[19px]">
              Faire le point
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Etape({
  titre,
  gradient,
  children,
}: {
  titre: string;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <span aria-hidden className="dot block" style={{ background: gradient }} />
      <h3 className="mt-5 text-[22px] font-medium leading-snug">{titre}</h3>
      <p className="mt-2 text-lg leading-[1.55] text-muted">{children}</p>
    </li>
  );
}

function Engagement({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3.5 border-b border-[rgba(251,249,244,0.18)] py-3.5 text-[17px] text-plum-text">
      <span aria-hidden className="text-honey">
        —
      </span>
      <span>{children}</span>
    </li>
  );
}

function ApercuLigne({ nom, detail, last = false }: { nom: string; detail: string; last?: boolean }) {
  return (
    <li className={`border-t border-border py-3 ${last ? "border-b" : ""}`}>
      <p className="font-serif text-[21px]">{nom}</p>
      <p className="mt-0.5 text-sm text-muted">{detail}</p>
    </li>
  );
}
