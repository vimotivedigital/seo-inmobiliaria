import platformsJson from "@data/inversion-inmobiliaria.json";
import type { CrowdfundingPlatform, PsfpRegistration } from "@/types/inversion";
import type { SourcedValue } from "@/types/data";
import type { FaqItem } from "@/lib/jsonld";

const platforms = platformsJson as CrowdfundingPlatform[];

export function getAllCrowdfundingPlatforms(): CrowdfundingPlatform[] {
  return platforms;
}

export function getCrowdfundingPlatformBySlug(slug: string): CrowdfundingPlatform | undefined {
  return platforms.find((p) => p.slug === slug);
}

/**
 * Adapta un `PsfpRegistration` (registro CNMV verificado directamente en la
 * fuente oficial) a la forma que espera `SourceBox`. Es siempre
 * `confidence: "real"`: a diferencia del resto de datos de esta seccion
 * (ticket minimo, rentabilidad), la inscripcion en el registro de la CNMV es
 * un hecho verificable de forma independiente, no una cifra autodeclarada.
 */
export function psfpRegistrationToSourcedValue(reg: PsfpRegistration): SourcedValue<number> {
  return {
    value: reg.numero,
    source: reg.source,
    source_url: reg.source_url,
    last_updated: reg.last_updated,
    confidence: "real",
    nota: `Numero de registro PSFP: ${reg.numero} (NIF ${reg.nif}), inscrita el ${new Date(reg.fecha_registro).toLocaleDateString("es-ES")}.`,
  };
}

/**
 * FAQs especificas de cada plataforma, generadas a partir de sus propios
 * datos verificados (nunca texto generico con el nombre cambiado). No se
 * usa content-builders.ts para esto porque esta seccion no pasa por el gate
 * de calidad pSEO (igual que /blog y /recomendados): son paginas
 * editoriales curadas, no combinatorias.
 */
export function buildPlatformFaqs(platform: CrowdfundingPlatform): FaqItem[] {
  const faqs: FaqItem[] = [
    {
      question: `¿Esta ${platform.name} regulada por la CNMV?`,
      answer: platform.psfpRegistration
        ? `Si. ${platform.legalName} figura en el registro oficial de Proveedores de Servicios de Financiacion Participativa (PSFP) de la CNMV con el numero ${platform.psfpRegistration.numero}, inscrita el ${new Date(platform.psfpRegistration.fecha_registro).toLocaleDateString("es-ES")}. Puedes verificarlo tu mismo en el registro publico de la CNMV.`
        : `No se ha podido verificar un registro vigente de ${platform.name} como PSFP en el registro publico de la CNMV a fecha de esta revision.`,
    },
    {
      question: `¿Que pasa si el promotor no paga en un proyecto de ${platform.name}?`,
      answer: platform.models.includes("deuda")
        ? `En los proyectos de deuda con garantia hipotecaria, la plataforma o el vehiculo del proyecto puede ejecutar esa garantia, pero el proceso lleva tiempo y coste legal, y no garantiza recuperar el 100% del capital invertido. En los proyectos de equity, el riesgo es distinto: el inversor asume el riesgo empresarial del proyecto, no solo el de impago de un prestamo.`
        : `Al tratarse de proyectos de equity, el inversor participa como socio del proyecto y asume su riesgo empresarial (sobrecostes, retrasos, caida del precio de venta), no el riesgo de impago de un prestamo con garantia.`,
    },
  ];

  if (platform.sanctions && platform.sanctions.length > 0) {
    faqs.push({
      question: `¿Ha tenido ${platform.name} sanciones o incidencias regulatorias?`,
      answer: platform.sanctions
        .map((s) => `En ${s.anio}, la CNMV le impuso una sancion de ${s.importe_eur ? s.importe_eur.toLocaleString("es-ES") + " EUR" : "importe no especificado"} (${s.descripcion}). Estado actual: ${s.estado}.`)
        .join(" "),
    });
  }

  return faqs;
}
