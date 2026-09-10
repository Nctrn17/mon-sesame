"use client";

import type { ChoiceOption } from "@/domain/profile/questions";

interface Props {
  readonly legend: string;
  readonly legendId?: string;
  readonly help?: string;
  readonly name: string;
  readonly options: readonly ChoiceOption[];
  readonly value?: string;
  readonly onChange: (value: string) => void;
}

export function ChoiceField({ legend, legendId, help, name, options, value, onChange }: Props) {
  return (
    <fieldset>
      <legend>
        <h1
          id={legendId}
          className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[52px] sm:leading-[1.08]"
        >
          {legend}
        </h1>
      </legend>
      {help ? <p className="mt-3 text-[17px] leading-[1.5] text-muted sm:mt-4 sm:text-[19px]">{help}</p> : null}

      <div className="mt-6 flex flex-col gap-2.5 sm:mt-9 sm:gap-3">
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex min-h-[60px] cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] bg-surface px-[18px] py-[18px] text-lg transition focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-[3px] focus-within:outline-sienna sm:gap-[18px] sm:px-6 sm:py-[22px] sm:text-xl ${
                checked ? "border-foreground" : "border-border hover:border-foreground"
              }`}
            >
              {/* Le bouton radio natif reste présent et accessible ; le point est décoratif. */}
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span aria-hidden className={`dot ${checked ? "dot-warm" : "dot-off"}`} />
              <span>
                <span className="block text-foreground">{opt.label}</span>
                {opt.hint ? <span className="block text-base text-muted">{opt.hint}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
