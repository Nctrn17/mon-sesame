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
      <legend id={legendId} className="text-2xl font-semibold text-foreground">
        {legend}
      </legend>
      {help ? <p className="mt-2 text-[1.05rem] text-muted">{help}</p> : null}

      <div className="mt-6 grid gap-3">
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${
                checked
                  ? "border-brand bg-brand-light"
                  : "border-border bg-card hover:border-brand"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 h-5 w-5 shrink-0 accent-brand"
              />
              <span>
                <span className="block text-lg font-medium text-foreground">{opt.label}</span>
                {opt.hint ? <span className="block text-muted">{opt.hint}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
