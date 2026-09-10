// Contrôle des URLs sources du catalogue d'aides.
//
// Pour chaque URL trouvée dans src/domain/aids, affiche le code HTTP, l'URL
// finale et le TITRE de la page. Le titre est l'essentiel : un lien peut
// répondre 200 tout en pointant vers un mauvais sujet (fiche renumérotée).
// À relire à la main avant chaque déploiement.
//
//   node scripts/check-sources.mjs
//
// Sort avec le code 1 si une URL répond en 4xx/5xx (hors 403 anti-bot, signalé).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src/domain/aids", import.meta.url));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith(".ts") && !full.endsWith(".test.ts") ? [full] : [];
  });
}

const urls = new Map();
for (const file of walk(ROOT)) {
  const text = readFileSync(file, "utf-8");
  for (const m of text.matchAll(/https?:\/\/[^\s"'`)]+/g)) {
    const u = m[0];
    if (!urls.has(u)) urls.set(u, new Set());
    urls.get(u).add(file.slice(ROOT.length + 1));
  }
}

function decode(s) {
  return s.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

let failures = 0;
const rows = [];
for (const [url, files] of [...urls].sort()) {
  let status = "ERR";
  let title = "";
  let finalUrl = url;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "fr" }, redirect: "follow", signal: ctrl.signal });
    clearTimeout(t);
    status = String(res.status);
    finalUrl = res.url;
    const html = await res.text();
    title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "");
  } catch (e) {
    title = String(e?.message ?? e);
  }
  const bad = status === "ERR" || (Number(status) >= 400 && status !== "403");
  if (bad) failures++;
  const flag = bad ? "KO " : status === "403" ? "?? " : "ok ";
  rows.push(`${flag}${status.padEnd(4)} ${title.slice(0, 70).padEnd(70)} ${url}${finalUrl !== url ? `  -> ${finalUrl}` : ""}  [${[...files].join(", ")}]`);
}

console.log(rows.join("\n"));
console.log(`\n${urls.size} URLs, ${failures} en échec (403 = probable blocage anti-bot, à ouvrir à la main).`);
process.exit(failures ? 1 : 0);
