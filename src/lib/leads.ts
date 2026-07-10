import { promises as fs } from "fs";
import path from "path";
import type { SellLeadInput, SellLeadRecord } from "@/types/lead";

/**
 * Validacion y persistencia del lead de "vender vivienda". Vive fuera del
 * route handler para poder testear la logica sin montar una request HTTP.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Telefono espanol, con o sin prefijo +34, admite espacios/guiones. */
const PHONE_RE = /^(\+34|0034|34)?[\s-]?[6789]\d{2}[\s-]?\d{3}[\s-]?\d{3}$/;

export interface ValidationError {
  ok: false;
  error: string;
}

export interface ValidationSuccess {
  ok: true;
  data: SellLeadInput & { consentPrivacidad: boolean; consentAgencia: boolean };
}

/**
 * Valida el payload en el servidor (nunca confiar solo en la validacion de
 * cliente). Devuelve un unico motivo de error legible; no hace falta mas
 * granularidad porque el formulario ya valida en cliente antes de enviar.
 */
export function validateSellLeadPayload(body: unknown): ValidationSuccess | ValidationError {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Peticion invalida." };
  }
  const b = body as Record<string, unknown>;

  // Honeypot: campo oculto que un usuario real nunca rellena. Si llega con
  // contenido, es casi con toda seguridad un bot -- se rechaza en silencio
  // (mismo mensaje generico) para no revelar la tecnica anti-spam.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return { ok: false, error: "No se pudo procesar la solicitud." };
  }

  const nombre = typeof b.nombre === "string" ? b.nombre.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const telefono = typeof b.telefono === "string" ? b.telefono.trim() : "";
  const localidad = typeof b.localidad === "string" ? b.localidad.trim() : "";
  const mensaje = typeof b.mensaje === "string" ? b.mensaje.trim().slice(0, 2000) : undefined;

  if (nombre.length < 2 || nombre.length > 200) {
    return { ok: false, error: "Indica un nombre valido." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Indica un email valido." };
  }
  if (!PHONE_RE.test(telefono.replace(/[\s-]/g, ""))) {
    return { ok: false, error: "Indica un telefono valido." };
  }
  if (localidad.length < 2 || localidad.length > 200) {
    return { ok: false, error: "Indica la localidad de la vivienda." };
  }

  // Las dos casillas de consentimiento son obligatorias e independientes:
  // nunca se acepta el envio si falta cualquiera de las dos, y nunca se
  // combinan en una sola comprobacion (ver src/types/lead.ts).
  if (b.consentPrivacidad !== true) {
    return { ok: false, error: "Debes aceptar la politica de privacidad para enviar el formulario." };
  }
  if (b.consentAgencia !== true) {
    return { ok: false, error: "Debes aceptar la cesion de datos a la agencia colaboradora para enviar el formulario." };
  }

  return {
    ok: true,
    data: { nombre, email, telefono, localidad, mensaje, consentPrivacidad: true, consentAgencia: true },
  };
}

const AUDIT_LOG_PATH = path.join(process.cwd(), "data", "leads-audit.jsonl");

/**
 * Guarda una copia del lead (con timestamp y ambos consentimientos) para
 * poder demostrar cumplimiento RGPD si algun dia hace falta.
 *
 * IMPORTANTE (limite conocido): en Vercel/serverless el sistema de ficheros
 * es de solo lectura fuera de /tmp, y /tmp no persiste entre invocaciones ni
 * despliegues. Este `fs.appendFile` funciona en local (`npm run dev` /
 * `next start` en un servidor propio con disco persistente) pero NO es un
 * registro de auditoria fiable en Vercel. El envio por email (ver
 * src/app/api/leads/vender-vivienda/route.ts) es hoy la unica copia
 * realmente duradera en produccion. Antes de depender de esto para
 * demostrar cumplimiento RGPD ante una auditoria real, sustituir por un
 * almacen persistente (Vercel Postgres/KV, Turso -- mismo camino de
 * migracion ya previsto para el resto de datos en src/lib/data.ts).
 */
export async function appendLeadAudit(record: SellLeadRecord): Promise<void> {
  try {
    await fs.mkdir(path.dirname(AUDIT_LOG_PATH), { recursive: true });
    await fs.appendFile(AUDIT_LOG_PATH, JSON.stringify(record) + "\n", "utf-8");
  } catch (err) {
    console.error("[leads] No se pudo escribir el registro de auditoria local:", err);
  }
}

/**
 * Rate limiting best-effort en memoria (no distribuido: cada instancia
 * serverless tiene su propio estado, y se pierde en cada cold start). Sirve
 * para frenar reintentos rapidos de un mismo cliente, no como defensa unica
 * anti-spam -- se combina con el honeypot de `validateSellLeadPayload`.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}
