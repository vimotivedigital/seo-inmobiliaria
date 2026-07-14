import type { SourcedValue } from "@/types/data";

/**
 * Modelo de datos para la seccion de comparativa de crowdfunding
 * inmobiliario (contenido YMYL: donde la gente pone su dinero).
 *
 * Principio reforzado respecto al resto del sitio: aqui NUNCA se rellena un
 * hueco con una cifra inventada. Si un dato (ticket minimo, rentabilidad
 * historica) no se pudo verificar en una fuente primaria (la propia
 * plataforma o el registro oficial de la CNMV), el campo se deja `undefined`
 * y la pagina debe mostrar explicitamente "dato no verificado" en su lugar.
 *
 * Distincion de `confidence` en este dominio (reutiliza el tipo existente
 * `Confidence` de src/types/data.ts, no se crea uno nuevo):
 *  - "real": hecho verificable de forma independiente en un registro oficial
 *    (ej. inscripcion en el registro de PSFP de la CNMV, con URL directa a
 *    la ficha del proveedor).
 *  - "estimado": cifra declarada por la propia plataforma (ticket minimo,
 *    rentabilidad historica, comisiones) -- no es un dato official/auditado
 *    de forma independiente, por eso NUNCA se presenta como rentabilidad
 *    garantizada, y siempre lleva la coletilla de rentabilidades pasadas.
 */

export type CrowdfundingModel = "equity" | "deuda" | "alquiler";

export const CROWDFUNDING_MODEL_LABELS: Record<CrowdfundingModel, string> = {
  equity: "Equity (participacion en el capital)",
  deuda: "Deuda / crowdlending (prestamo)",
  alquiler: "Alquiler (rentas periodicas)",
};

/** Registro oficial en la CNMV como PSFP (Proveedor de Servicios de
 * Financiacion Participativa) bajo el Reglamento europeo ECSPR. */
export interface PsfpRegistration {
  numero: number;
  nif: string;
  fecha_registro: string; // ISO
  source: string;
  source_url: string;
  last_updated: string; // ISO, fecha en la que se verifico directamente en la CNMV
}

export interface RegulatorySanction {
  anio: number;
  descripcion: string;
  importe_eur?: number;
  estado: string; // p.ej. "Anulada por la Audiencia Nacional en 2024"
  source: string;
  source_url: string;
}

export interface CrowdfundingPlatform {
  slug: string;
  name: string;
  legalName: string;
  website: string;
  /** true solo si se verifico un registro PSFP vigente directamente en la CNMV. */
  regulatedByCnmv: boolean;
  psfpRegistration?: PsfpRegistration;
  models: CrowdfundingModel[];
  modelDescription: string;
  /** Ticket minimo declarado por la plataforma. `undefined` si no se pudo
   * verificar un importe fijo (ej. varia por proyecto y no hay cifra base). */
  minInvestment?: SourcedValue<number> & { nota: string };
  minInvestmentNota?: string; // usado cuando minInvestment queda sin verificar
  liquidity: string;
  /** Rentabilidad declarada por la propia plataforma. Nunca "real": siempre
   * `confidence: "estimado"` con nota explicando que es autodeclarada. */
  historicalReturn?: SourcedValue<string> & { nota: string };
  historicalReturnNota?: string; // usado cuando historicalReturn queda sin verificar
  specificRisks: string[];
  sanctions?: RegulatorySanction[];
  rebrandNote?: string;
}
