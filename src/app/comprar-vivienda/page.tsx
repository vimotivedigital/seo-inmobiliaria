import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllCities } from "@/lib/data";
import { filterIndexableEntities } from "@/lib/quality-control";
import { buildEditorialMetadata } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Comprar vivienda en Espana: proceso, impuestos y gastos",
  "Guia paso a paso para comprar vivienda: senal, arras, notaria, registro e impuestos (ITP/IVA) segun tu comunidad autonoma.",
  "/comprar-vivienda"
);

export default function ComprarViviendaHubPage() {
  const cities = filterIndexableEntities(getAllCities());

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Comprar vivienda", href: "/comprar-vivienda" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Comprar vivienda en Espana</h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Comprar una vivienda implica bastante mas que negociar el precio con el vendedor. Entre
        impuestos, notaria, registro y gestoria, los gastos adicionales suelen suponer entre un
        10% y un 12% del precio de compra, y varian segun la comunidad autonoma.
      </p>

      <AdSlot slotId="3333333333" placement="top" />

      <h2>Las fases de una compra</h2>
      <ol>
        <li><strong>Reserva o arras:</strong> se entrega una senal (habitualmente el 10%) que compromete a ambas partes.</li>
        <li><strong>Financiacion:</strong> si necesitas hipoteca, este es el momento de comparar ofertas (ver <Link href="/hipotecas">hipotecas</Link>).</li>
        <li><strong>Notaria:</strong> firma de la escritura publica de compraventa.</li>
        <li><strong>Registro de la propiedad:</strong> inscripcion de la nueva titularidad.</li>
        <li><strong>Liquidacion de impuestos:</strong> ITP (segunda mano) o IVA+AJD (obra nueva), con plazo limitado tras la firma.</li>
      </ol>

      <h2>El impuesto de compra depende de donde compres</h2>
      <p>
        El ITP para vivienda de segunda mano es un impuesto cedido a las comunidades autonomas,
        por lo que el tipo aplicable varia significativamente entre regiones. Consulta el
        desglose completo, con el tipo vigente y el resto de gastos (notaria, registro, gestoria),
        en la pagina de tu ciudad:
      </p>
      <ul className="grid gap-1 sm:grid-cols-2 list-none pl-0">
        {cities.map((city) => (
          <li key={city.slug}>
            <Link href={`/coste-compra-vivienda/${city.slug}`}>
              Gastos de comprar vivienda en {city.name} →
            </Link>
          </li>
        ))}
      </ul>

      <Disclaimer />

      <AdSlot slotId="4444444444" placement="in-content" />

      <FaqSection
        heading="Preguntas frecuentes sobre comprar vivienda"
        items={[
          {
            question: "¿Que diferencia hay entre arras penitenciales y confirmatorias?",
            answer:
              "Las arras penitenciales permiten a cualquiera de las partes echarse atras perdiendo (comprador) o devolviendo el doble (vendedor) de la senal. Las confirmatorias obligan a cumplir el contrato y solo dan derecho a reclamar danos si se incumple.",
          },
          {
            question: "¿Cuando hay que pagar el ITP o el IVA?",
            answer:
              "El plazo general para autoliquidar el impuesto es de 30 dias habiles desde la firma de la escritura ante notario. Tu gestoria o notaria suele encargarse de recordartelo y tramitarlo.",
          },
          {
            question: "¿Es obligatorio el certificado energetico para comprar?",
            answer:
              "Si, el vendedor debe entregarlo antes de la firma. Es informativo y no impide la compra, pero puedes usarlo para estimar el gasto energetico futuro de la vivienda.",
          },
        ]}
      />
    </article>
  );
}
