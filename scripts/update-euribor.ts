import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Descarga la tabla mensual oficial de tipos de interes del Banco de Espana
 * (Boletin Estadistico cap. 19) y actualiza el Euribor a 12 meses en
 * data/tipos-interes.json con el ultimo mes cerrado disponible.
 *
 * Usamos la tabla MENSUAL (be1901.csv), no la diaria (ti_1_7.csv): la
 * diaria da una cotizacion por dia, la mensual da la media oficial del mes
 * que es el dato que de verdad se usa como indice de referencia
 * hipotecario. Ver README para el detalle de por que se eligio esta tabla.
 *
 * Ejecutar con `npm run data:euribor`.
 */

const CSV_URL = "https://www.bde.es/webbe/es/estadisticas/compartido/datos/csv/be1901.csv";
const SERIES_ALIAS = "BE_19_1.5"; // "Tipo de interes. UEM. Mercado monetario. Euribor. A 12 meses"
const OUTPUT_PATH = join(__dirname, "..", "data", "tipos-interes.json");

const SPANISH_MONTHS: Record<string, number> = {
  ENE: 1, FEB: 2, MAR: 3, ABR: 4, MAY: 5, JUN: 6,
  JUL: 7, AGO: 8, SEP: 9, OCT: 10, NOV: 11, DIC: 12,
};

/** Parsea una fila de CSV con campos entre comillas separados por comas. */
function parseCsvLine(line: string): string[] {
  return line
    .split(",")
    .map((cell) => cell.trim().replace(/^"|"$/g, ""));
}

/** "MAY 2026" -> "2026-05-31" (ultimo dia del mes, para last_updated). */
function monthLabelToIsoDate(label: string): string {
  const [monthAbbr, yearStr] = label.trim().split(/\s+/);
  const month = monthAbbr ? SPANISH_MONTHS[monthAbbr.toUpperCase()] : undefined;
  const year = Number(yearStr);
  if (!month || !year) {
    throw new Error(`No se pudo interpretar la fecha del CSV: "${label}"`);
  }
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

async function fetchCsvLines(): Promise<string[]> {
  const res = await fetch(CSV_URL);
  if (!res.ok) {
    throw new Error(`Descarga fallida (${res.status}): ${CSV_URL}`);
  }
  const text = await res.text();
  return text.split(/\r?\n/).filter((l) => l.trim().length > 0);
}

/** Busca en las primeras filas de cabecera la columna cuyo alias coincide con SERIES_ALIAS. */
function findSeriesColumn(headerLines: string[]): number {
  for (const line of headerLines) {
    const cells = parseCsvLine(line);
    const idx = cells.findIndex((c) => c === SERIES_ALIAS);
    if (idx !== -1) return idx;
  }
  throw new Error(
    `No se encontro la columna con alias "${SERIES_ALIAS}" en las primeras filas del CSV. ` +
      "El Banco de Espana puede haber cambiado el formato -- revisar manualmente."
  );
}

async function main() {
  console.log(`Descargando ${CSV_URL} ...`);
  const lines = await fetchCsvLines();

  // El bloque de cabecera del CSV del Banco de Espana ocupa las primeras
  // filas (codigos de serie, alias, descripcion, unidades, frecuencia).
  const HEADER_ROWS = 6;
  const headerLines = lines.slice(0, HEADER_ROWS);
  const dataLines = lines.slice(HEADER_ROWS);

  const columnIndex = findSeriesColumn(headerLines);

  // Recorremos de la fila mas reciente hacia atras hasta encontrar un valor
  // cerrado (el ultimo mes puede aparecer como "_" si aun no se ha cerrado).
  for (let i = dataLines.length - 1; i >= 0; i--) {
    const line = dataLines[i];
    if (!line) continue;
    const cells = parseCsvLine(line);
    const rawValue = cells[columnIndex];
    const dateLabel = cells[0];
    if (rawValue && rawValue !== "_" && dateLabel) {
      const value = Number(rawValue);
      if (Number.isNaN(value)) continue;

      const lastUpdated = monthLabelToIsoDate(dateLabel);

      const currentJson = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
      currentJson.euribor_12m = {
        ...currentJson.euribor_12m,
        value,
        last_updated: lastUpdated,
        source:
          "Banco de España - Boletín Estadístico cap. 19, tabla mensual 'Tipos de interés: euríbor' (serie BE_19_1.5, 'Euríbor a 12 meses')",
        source_url: CSV_URL,
        confidence: "real",
        nota: `Ultimo mes cerrado de la serie mensual oficial del Banco de España en el momento de la actualizacion (${dateLabel.toLowerCase()}). Actualizado automaticamente por scripts/update-euribor.ts.`,
      };

      writeFileSync(OUTPUT_PATH, JSON.stringify(currentJson, null, 2) + "\n", "utf-8");
      console.log(`Actualizado: euribor_12m = ${value}% (${dateLabel}) -> ${OUTPUT_PATH}`);
      return;
    }
  }

  throw new Error("No se encontro ningun valor cerrado (no '_') para la serie en todo el CSV.");
}

main().catch((err) => {
  console.error("Error actualizando el euribor:", err);
  process.exitCode = 1;
});
