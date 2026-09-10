import type { CSSProperties } from "react";

/**
 * La graine de sésame : signature graphique unique, toujours en fond.
 *
 * Structure imposée par le rendu du grain (mix-blend-mode) :
 *   wrapper (absolute, pointer-events:none, JAMAIS d'opacity)
 *     └ shape (rotate, blur, opacity)  ← l'opacité va ici
 *     └ grain-1 / grain-2 (overlay + soft-light)
 */

interface Props {
  /** Position et taille du wrapper (px), relatif au parent `position:relative`. */
  readonly wrapper: { left?: number; right?: number; top?: number; bottom?: number; width: number; height: number };
  /** Position et taille de la forme dans le wrapper. */
  readonly shape: { left: number; top: number; width: number; height: number };
  readonly rotate: number;
  readonly blur: number;
  readonly opacity?: number;
  /** `full` = graine entière ; `open` = deux moitiés qui s'écartent (résultats). */
  readonly variant?: "full" | "open";
  /** Mouvement lent du héro. */
  readonly drift?: boolean;
  /** Second calque de grain (soft-light). */
  readonly grain2?: boolean;
  readonly grainOpacity?: number;
  readonly className?: string;
  /** Opacité du wrapper interdite : on expose uniquement des classes utilitaires (ex. responsive). */
}

function fullPath(w: number, h: number): string {
  const r = (n: number) => Math.round(n);
  return `M${r(0.5 * w)} 0 C${r(0.78 * w)} ${r(0.25 * h)},${w} ${r(0.5 * h)},${w} ${r(0.7 * h)} C${w} ${r(0.88 * h)},${r(0.78 * w)} ${h},${r(0.5 * w)} ${h} C${r(0.22 * w)} ${h},0 ${r(0.88 * h)},0 ${r(0.7 * h)} C0 ${r(0.5 * h)},${r(0.22 * w)} ${r(0.25 * h)},${r(0.5 * w)} 0 Z`;
}

function leftPath(w: number, h: number): string {
  const r = (n: number) => Math.round(n);
  return `M${r(0.5 * w)} 0 C${r(0.22 * w)} ${r(0.25 * h)},0 ${r(0.5 * h)},0 ${r(0.7 * h)} C0 ${r(0.88 * h)},${r(0.22 * w)} ${h},${r(0.5 * w)} ${h} Z`;
}

function rightPath(w: number, h: number): string {
  const r = (n: number) => Math.round(n);
  return `M${r(0.5 * w)} 0 C${r(0.78 * w)} ${r(0.25 * h)},${w} ${r(0.5 * h)},${w} ${r(0.7 * h)} C${w} ${r(0.88 * h)},${r(0.78 * w)} ${h},${r(0.5 * w)} ${h} Z`;
}

export function SeedShape({
  wrapper,
  shape,
  rotate,
  blur,
  opacity = 1,
  variant = "full",
  drift = false,
  grain2 = true,
  grainOpacity = 0.85,
  className = "",
}: Props) {
  const wrapperStyle: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    left: wrapper.left,
    right: wrapper.right,
    top: wrapper.top,
    bottom: wrapper.bottom,
    width: wrapper.width,
    height: wrapper.height,
  };
  // Flou et opacité : sur la forme entière, ou sur chaque moitié quand elles
  // s'animent (sinon le parent flouté est re-rasterisé à chaque image et
  // l'animation fige les machines modestes).
  const layerFx: CSSProperties = { filter: `blur(${blur}px)`, opacity, willChange: "transform" };
  const shapeStyle: CSSProperties = {
    position: "absolute",
    left: shape.left,
    top: shape.top,
    width: shape.width,
    height: shape.height,
    transform: `rotate(${rotate}deg)`,
    ...(variant === "full" ? layerFx : {}),
  };
  const fill: CSSProperties = { background: "var(--seed-gradient)" };
  // Le grain est fondu vers les bords du wrapper : sans masque, le calque en
  // mix-blend-mode dessine un rectangle visible sur le fond papier.
  const cx = shape.left + shape.width / 2;
  const cy = shape.top + shape.height / 2;
  const radius = Math.max(shape.width, shape.height) * 0.7;
  const mask = `radial-gradient(${radius}px ${radius}px at ${cx}px ${cy}px, #000 30%, transparent 85%)`;
  const grainMask: CSSProperties = { maskImage: mask, WebkitMaskImage: mask };

  return (
    <div aria-hidden className={`seed-wrapper ${className}`} style={wrapperStyle}>
      <div className={drift ? "seed-drift" : undefined} style={shapeStyle}>
        {variant === "full" ? (
          <div
            style={{ ...fill, width: "100%", height: "100%", clipPath: `path('${fullPath(shape.width, shape.height)}')` }}
          />
        ) : (
          <>
            <div
              className="seed-glow"
              style={{
                position: "absolute",
                left: shape.width * 0.27,
                top: shape.height * 0.36,
                width: shape.width * 0.45,
                height: shape.width * 0.45,
                borderRadius: "50%",
                background: "radial-gradient(circle,#fff7d6 0%,rgba(255,247,214,0) 70%)",
                opacity,
              }}
            />
            <div
              className="seed-open-l"
              style={{ ...fill, ...layerFx, position: "absolute", inset: 0, clipPath: `path('${leftPath(shape.width, shape.height)}')` }}
            />
            <div
              className="seed-open-r"
              style={{ ...fill, ...layerFx, position: "absolute", inset: 0, clipPath: `path('${rightPath(shape.width, shape.height)}')` }}
            />
          </>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/noise-a.svg)",
          backgroundSize: "300px 300px",
          mixBlendMode: "overlay",
          opacity: grainOpacity,
          ...grainMask,
        }}
      />
      {grain2 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/noise-b.svg)",
            backgroundSize: "220px 220px",
            mixBlendMode: "soft-light",
            opacity: 0.9,
            ...grainMask,
          }}
        />
      ) : null}
    </div>
  );
}
