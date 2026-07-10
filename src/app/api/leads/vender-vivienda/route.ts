import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { validateSellLeadPayload, appendLeadAudit, isRateLimited } from "@/lib/leads";
import { PARTNER_AGENCY_NAME } from "@/lib/partner-agency";
import type { SellLeadRecord } from "@/types/lead";

export const runtime = "nodejs";

const LEAD_NOTIFICATION_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "TipoFijo <leads@tipofijo.com>";

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Demasiadas solicitudes. Intentalo mas tarde." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Peticion invalida." }, { status: 400 });
  }

  const validation = validateSellLeadPayload(body);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }

  const record: SellLeadRecord = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    partnerAgencyName: PARTNER_AGENCY_NAME,
    sourcePath: request.headers.get("referer") ?? "",
    ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
    ...validation.data,
  };

  // El registro de auditoria es best-effort (ver nota de limite conocido en
  // src/lib/leads.ts); un fallo aqui no debe impedir que el lead llegue por
  // email, que es la copia realmente duradera en produccion hoy.
  await appendLeadAudit(record);

  if (RESEND_API_KEY && LEAD_NOTIFICATION_EMAIL) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: LEAD_NOTIFICATION_EMAIL,
        replyTo: record.email,
        subject: `Nuevo lead vender vivienda: ${record.localidad}`,
        text: [
          `Nombre: ${record.nombre}`,
          `Email: ${record.email}`,
          `Telefono: ${record.telefono}`,
          `Localidad: ${record.localidad}`,
          record.mensaje ? `Mensaje: ${record.mensaje}` : null,
          "",
          `Agencia colaboradora destinataria: ${record.partnerAgencyName}`,
          `Consentimiento privacidad TipoFijo: si (${record.submittedAt})`,
          `Consentimiento cesion a la agencia: si (${record.submittedAt})`,
          `Origen: ${record.sourcePath || "desconocido"}`,
          `IP: ${record.ip ?? "desconocida"}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (err) {
      console.error("[leads] Fallo al enviar el email del lead via Resend:", err);
      return NextResponse.json(
        { ok: false, error: "No se pudo enviar tu solicitud. Intentalo de nuevo en unos minutos." },
        { status: 502 }
      );
    }
  } else {
    console.warn(
      "[leads] RESEND_API_KEY o LEAD_NOTIFICATION_EMAIL no configurados: el lead solo ha quedado en el log de auditoria local, no se ha enviado ningun email.",
      record.id
    );
  }

  return NextResponse.json({ ok: true });
}
