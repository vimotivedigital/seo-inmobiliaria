import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Recorre todos los JSON de /data y lista los campos `next_review_due` ya
 * vencidos. Es un recordatorio manual, no una automatizacion: no existe
 * forma honesta de refrescar precios de mercado o costes sectoriales sin
 * scraping, y no vamos a hacer eso. Ejecutar con `npm run data:check-stale`
 * antes de cada revision trimestral de contenido.
 */

const DATA_DIR = join(__dirname, "..", "data");

interface StaleField {
  file: string;
  path: string;
  next_review_due: string;
  daysOverdue: number;
}

function walk(value: unknown, path: string, file: string, results: StaleField[]) {
  if (value === null || typeof value !== "object") return;

  if (!Array.isArray(value) && "next_review_due" in (value as Record<string, unknown>)) {
    const dueRaw = (value as Record<string, unknown>).next_review_due;
    if (typeof dueRaw === "string") {
      const due = new Date(dueRaw);
      const daysOverdue = Math.floor((Date.now() - due.getTime()) / 86_400_000);
      if (daysOverdue > 0) {
        results.push({ file, path, next_review_due: dueRaw, daysOverdue });
      }
    }
  }

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    walk(child, path ? `${path}.${key}` : key, file, results);
  }
}

function main() {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const results: StaleField[] = [];

  for (const file of files) {
    const raw = readFileSync(join(DATA_DIR, file), "utf-8");
    const json = JSON.parse(raw);
    const entries = Array.isArray(json) ? json : [json];
    entries.forEach((entry, i) => {
      walk(entry, Array.isArray(json) ? `[${i}]` : "", file, results);
    });
  }

  if (results.length === 0) {
    console.log("Sin campos vencidos: todos los `next_review_due` estan al dia.");
    return;
  }

  console.log(`${results.length} campo(s) con revision vencida:\n`);
  for (const r of results) {
    console.log(`  ${r.file}${r.path ? ` -> ${r.path}` : ""}`);
    console.log(`    next_review_due: ${r.next_review_due} (${r.daysOverdue} dia(s) de retraso)\n`);
  }
}

main();
