import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { SourceBox } from "@/components/seo/SourceBox";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { AdSlot } from "@/components/ads/AdSlot";
import { getMortgageRates } from "@/lib/data";
import { buildEditorialMetadata, formatPercent } from "@/lib/seo";

export const revalidate = 86400; // los tipos de interes cambian; ISR diario

export const metadata: Metadata = buildEditorialMetadata(
  "Hipotecas en Espana: tipos, requisitos y como elegir la mejor",
  "Guia completa de hipotecas: tipo fijo vs variable, tipos de interes actuales, requisitos de la banca y como comparar ofertas.",
  "/hipotecas"
);

export default function HipotecasHubPage() {
  const rates = getMortgageRates();

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Hipotecas", href: "/hipotecas" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hipotecas en Espana</h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Elegir hipoteca es probablemente la decision financiera de mayor impacto que tomaras en
        una decada. Esta guia explica como funcionan los tipos fijo, variable y mixto, que exige
        la banca espanola en 2026 para conceder financiacion, y como usar nuestra{" "}
        <Link href="/hipoteca-calculadora">calculadora de hipoteca</Link> para comparar
        escenarios reales antes de firmar.
      </p>

      <AdSlot slotId="1111111111" placement="top" />

      <h2>Tipo fijo vs variable: la decision que mas importa</h2>
      <p>
        Con el Euribor a 12 meses en {formatPercent(rates.euribor_12m.value)}, la banca espanola
        ofrece de media un tipo fijo en torno al {formatPercent(rates.avg_fixed_rate.value)} y un
        variable de referencia (euribor + diferencial) cercano al{" "}
        {formatPercent(rates.avg_variable_rate.value)}. El fijo da certeza de cuota durante toda
        la vida del prestamo; el variable suele partir mas bajo pero se mueve con el mercado. La
        eleccion depende de tu aversion al riesgo y del plazo: a mas anios de hipoteca, mayor es
        el impacto potencial de una subida del Euribor sobre un variable.
      </p>

      <h2>Que pide la banca para aprobar tu hipoteca</h2>
      <ul>
        <li>Cuota mensual (todas tus deudas incluidas) por debajo del 35% de tus ingresos netos.</li>
        <li>
          Ahorros propios para cubrir al menos el 20% del precio de compra, mas el 10-12% de
          gastos e impuestos (ver{" "}
          <Link href="/comprar-vivienda">gastos de comprar vivienda</Link>), ya que la mayoria de
          entidades financia hasta un {rates.avg_ltv.value}% del valor de tasacion en primera
          vivienda.
        </li>
        <li>Estabilidad laboral: contrato indefinido o, en autonomos, al menos 2 anios de actividad.</li>
        <li>Historial crediticio limpio en ficheros de morosidad (ASNEF, RAI).</li>
      </ul>

      <SourceBox
        items={[
          { label: "Euribor 12 meses", data: rates.euribor_12m },
          { label: "Tipo fijo medio ofertado", data: rates.avg_fixed_rate },
          { label: "Tipo variable medio ofertado", data: rates.avg_variable_rate },
          { label: "LTV medio concedido", data: rates.avg_ltv },
        ]}
      />

      <Disclaimer />

      <AdSlot slotId="2222222222" placement="in-content" />

      <FaqSection
        heading="Preguntas frecuentes sobre hipotecas"
        items={[
          {
            question: "¿Cuanto puedo pedir de hipoteca segun mi sueldo?",
            answer:
              "La banca suele limitar la cuota mensual (de todas tus deudas) al 35% de tus ingresos netos. Usa la calculadora de hipoteca para ver que cuota corresponde a distintos importes y plazos, y comparalo con tu nomina.",
          },
          {
            question: "¿Merece la pena amortizar anticipadamente?",
            answer:
              "Depende del tipo de interes de tu hipoteca frente a la rentabilidad que podrias obtener invirtiendo ese dinero. Con tipos fijos por encima del 3%, amortizar suele ser mas rentable que la mayoria de alternativas de bajo riesgo.",
          },
          {
            question: "¿Que diferencia hay entre TIN y TAE?",
            answer:
              "El TIN es el tipo de interes nominal puro. El TAE incluye ademas comisiones y gastos asociados, por lo que es el dato mas fiable para comparar ofertas entre bancos.",
          },
        ]}
      />
    </article>
  );
}
