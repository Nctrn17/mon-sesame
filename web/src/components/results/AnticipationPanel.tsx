"use client";

import { useMemo } from "react";
import { buildReport } from "@/domain/eligibility/engine";
import { projectToRetirement } from "@/domain/eligibility/projection";
import type { Profile } from "@/domain/profile/types";

/**
 * Carte « Et une fois à la retraite ? » : les aides qui s'ouvriraient au
 * passage à la retraite, quand les revenus baissent. Projection qualitative,
 * sans montant demandé ni affiché.
 */
export function AnticipationPanel({
  profile,
  currentActiveIds,
}: {
  profile: Profile;
  currentActiveIds: ReadonlySet<string>;
}) {
  const newlyOpened = useMemo(() => {
    const report = buildReport(projectToRetirement(profile));
    return report.results.filter(
      (r) =>
        (r.status === "eligible" || r.status === "to_check") && !currentActiveIds.has(r.aid.id),
    );
  }, [profile, currentActiveIds]);

  return (
    <div className="rounded-[18px] border border-border bg-surface p-[26px]">
      <p className="text-[15px] text-muted">Et une fois à la retraite ?</p>
      {newlyOpened.length > 0 ? (
        <>
          <p className="mt-2.5 text-[17px] leading-[1.6]">
            Quand les revenus baissent, d&apos;autres aides s&apos;ouvrent souvent. Le moment
            venu, pensez à :
          </p>
          <ul className="mt-3 flex flex-col">
            {newlyOpened.map((r) => (
              <li key={r.aid.id} className="border-t border-border py-2.5">
                <p className="font-serif text-xl leading-tight text-foreground">{r.aid.name}</p>
                <p className="mt-0.5 text-[15px] text-muted">
                  Le moment venu : {r.aid.howToApply.organism}.
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[15px] leading-[1.55] text-muted">
            Projection indicative, à refaire une fois à la retraite.
          </p>
        </>
      ) : (
        <p className="mt-2.5 text-[17px] leading-[1.6]">
          Au passage à la retraite, les revenus baissent souvent d&apos;un coup et de nouvelles
          aides s&apos;ouvrent. Pensez à refaire le point à ce moment-là.
        </p>
      )}
    </div>
  );
}
