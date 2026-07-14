import { SourceBox } from "@/components/seo/SourceBox";
import type { SourcedValue } from "@/types/data";

/**
 * Nota fiscal generica reutilizada en todas las paginas de plataforma
 * (misma logica que el disclaimer YMYL): la fiscalidad de estos productos
 * no depende de la plataforma concreta, sino del tipo de rendimiento
 * (capital mobiliario) en el IRPF. No se encontro una fuente primaria de la
 * Agencia Tributaria parseable de forma fiable para los tramos 2026, asi que
 * se trata como `estimado` con varias fuentes cruzadas, siguiendo el mismo
 * criterio que el resto del proyecto para datos sin fuente oficial unica
 * verificada directamente (ver purchase-costs-ccaa.json / tipos-interes.json).
 */
const irpfSavingsBrackets: SourcedValue<string> = {
  value: "19% hasta 6.000€; 21% de 6.000 a 50.000€; 23% de 50.000 a 200.000€; 27% de 200.000 a 300.000€; 30% a partir de 300.000€",
  source: "Tramos del IRPF 2026 para la base del ahorro (varias fuentes cruzadas)",
  last_updated: "2026-07-14",
  confidence: "estimado",
  fuentes: [
    {
      nombre: "idealista/news - Novedades fiscales en ahorro e inversion para 2026",
      source_url: "https://www.idealista.com/news/finanzas/economia/2026/02/12/884145-novedades-fiscales-en-ahorro-e-inversion-para-2026-asi-son-los-nuevos-tipos-de-hasta-el",
      consultado: "2026-07-14",
    },
    {
      nombre: "Wolters Kluwer - Tramos y retenciones IRPF 2026",
      source_url: "https://www.wolterskluwer.com/es-es/expert-insights/tramos-retenciones-irpf-2026-novedades",
      consultado: "2026-07-14",
    },
  ],
  nota: "No se pudo verificar este dato directamente en un documento parseable de la Agencia Tributaria; se muestra como estimado con dos fuentes especializadas cruzadas. Confirma los tramos vigentes en el ejercicio en que declares con la Agencia Tributaria o un asesor fiscal.",
};

export function FiscalidadCrowdfunding() {
  return (
    <>
      <h2>Fiscalidad</h2>
      <p>
        Los rendimientos obtenidos en plataformas de crowdfunding inmobiliario (intereses de
        prestamos, plusvalias de proyectos de equity, rentas de alquiler) tributan en el IRPF como
        rendimientos del capital mobiliario o ganancias patrimoniales, dentro de la base del
        ahorro, con tramos progresivos segun el importe total del ejercicio.
      </p>
      <SourceBox title="Sobre estos tramos fiscales" items={[{ label: "Tramos IRPF base del ahorro", data: irpfSavingsBrackets }]} />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Esta informacion es general y no sustituye el asesoramiento fiscal personalizado: tu
        situacion concreta (otras rentas del ejercicio, perdidas compensables, residencia fiscal)
        puede cambiar el resultado. Consulta con un asesor fiscal antes de declarar.
      </p>
    </>
  );
}
