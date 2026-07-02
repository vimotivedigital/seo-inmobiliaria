import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { SourceBox } from "@/components/seo/SourceBox";
import { FaqSection } from "@/components/seo/FaqSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { getMortgageRates } from "@/lib/data";
import { buildEditorialMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = buildEditorialMetadata(
  "Calculadora de hipoteca: cuota mensual y tabla de amortizacion",
  "Calcula la cuota mensual de tu hipoteca y la tabla de amortizacion completa segun capital, tipo de interes y plazo.",
  "/hipoteca-calculadora"
);

/**
 * Esta es la UNICA URL indexable para la calculadora de hipoteca. Los
 * calculos por importe/interes/anios ocurren client-side (ver
 * MortgageCalculator) y NUNCA generan una ruta nueva del tipo
 * /hipoteca/{pais}/{importe}/{interes}/{anios}, que crearia miles de
 * paginas casi-duplicadas de bajo valor.
 */
export default function HipotecaCalculadoraPage() {
  const rates = getMortgageRates();

  return (
    <article>
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Calculadora de hipoteca", href: "/hipoteca-calculadora" }]} />

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Calculadora de hipoteca</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Introduce el capital, el plazo y el tipo de interes para ver tu cuota mensual y la tabla
        de amortizacion completa, anio a anio.
      </p>

      <AdSlot slotId="1212121212" placement="top" />

      <MortgageCalculator rates={rates} />

      <SourceBox
        items={[
          { label: "Tipo fijo medio", data: rates.avg_fixed_rate },
          { label: "Tipo variable medio", data: rates.avg_variable_rate },
        ]}
      />

      <Disclaimer />

      <AdSlot slotId="1313131313" placement="after-results" />

      <FaqSection
        items={[
          {
            question: "¿Como se calcula la cuota mensual?",
            answer:
              "Usamos el sistema de amortizacion frances (cuota constante), el mas habitual en hipotecas en Espana: cada mes pagas una cuota fija que al principio es sobre todo intereses y con el tiempo pasa a ser sobre todo capital.",
          },
          {
            question: "¿Puedo usar mi propio tipo de interes en vez de la media del mercado?",
            answer:
              "Si, hay un campo para introducir manualmente el tipo que te haya ofrecido tu banco y comparar el resultado con la media de mercado.",
          },
        ]}
      />
    </article>
  );
}
