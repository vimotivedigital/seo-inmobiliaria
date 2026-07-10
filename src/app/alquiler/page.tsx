import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CoverImage } from "@/components/seo/CoverImage";
import { FaqSection } from "@/components/seo/FaqSection";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllCities } from "@/lib/data";
import { filterIndexableEntities } from "@/lib/quality-control";
import { buildEditorialMetadata, formatEur } from "@/lib/seo";

export const revalidate = 604800; // precios de alquiler, revision semanal

export const metadata: Metadata = buildEditorialMetadata(
  "Alquiler de vivienda en Espana: derechos, fianza y cuando compensa",
  "Guia de alquiler: duracion minima del contrato, fianza, actualizacion de renta y como saber si te compensa mas alquilar que comprar.",
  "/alquiler"
);

export default function AlquilerHubPage() {
  const cities = filterIndexableEntities(getAllCities());

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Alquiler", href: "/alquiler" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Alquiler de vivienda en Espana</h1>

      <CoverImage src="/images/alquiler-salon-acogedor.jpg" alt="Salon y comedor acogedores de un piso de alquiler" priority />

      <p className="text-lg text-slate-600 dark:text-slate-300">
        La Ley de Arrendamientos Urbanos (LAU) protege al inquilino con una duracion minima de
        contrato y limites a la actualizacion de renta, pero las condiciones reales varian mucho
        segun la ciudad y si esta declarada zona de mercado tensionado.
      </p>

      <AdSlot slotId="5555555555" placement="top" />

      <h2>Lo esencial del contrato de alquiler</h2>
      <ul>
        <li><strong>Duracion:</strong> minimo 5 anios si el arrendador es persona fisica (7 si es empresa), salvo pacto de menor duracion con prorroga obligatoria hasta esos minimos.</li>
        <li><strong>Fianza:</strong> un mes de renta en alquiler de vivienda habitual, deposito obligatorio en el organismo autonomico correspondiente.</li>
        <li><strong>Actualizacion de renta:</strong> vinculada a un indice de referencia (no libremente pactable al alza sin limite en zonas tensionadas).</li>
        <li><strong>Gastos:</strong> el IBI y los gastos de comunidad corresponden al propietario salvo pacto expreso en contrario.</li>
      </ul>

      <h2>¿Comprar o alquilar? No hay respuesta unica</h2>
      <p>
        La respuesta depende del precio de la vivienda frente al alquiler equivalente en tu
        ciudad, de cuanto tiempo planeas quedarte y de la rentabilidad alternativa de tu ahorro.
        Usa la calculadora de comprar vs alquilar en la pagina de tu ciudad para ver el punto de
        equilibrio con tus propios numeros:
      </p>
      <ul className="grid gap-1 sm:grid-cols-2 list-none pl-0">
        {cities.map((city) => (
          <li key={city.slug}>
            <Link href={`/comprar-vs-alquilar/${city.slug}`}>
              Comprar vs alquilar en {city.name} ({formatEur(city.rent_per_sqm.value)}/m2/mes) →
            </Link>
          </li>
        ))}
      </ul>

      <Disclaimer />

      <AdSlot slotId="6666666666" placement="in-content" />

      <FaqSection
        heading="Preguntas frecuentes sobre alquiler"
        items={[
          {
            question: "¿Puede el propietario subirme la renta cuando quiera?",
            answer:
              "No. La actualizacion solo puede aplicarse una vez al anio y conforme al indice pactado en el contrato (nunca superior al IPC en zonas de mercado tensionado declaradas).",
          },
          {
            question: "¿Que pasa si el propietario quiere vender el piso alquilado?",
            answer:
              "Salvo que el contrato incluya una clausula de no sujecion inscrita en el Registro, el nuevo propietario debe respetar el contrato de alquiler vigente hasta su vencimiento.",
          },
          {
            question: "¿Cuanto tiempo tiene el propietario para devolver la fianza?",
            answer:
              "Un mes desde la entrega de llaves. Pasado ese plazo sin devolucion, puedes reclamar intereses de demora.",
          },
        ]}
      />

      <InternalLinks
        heading="Para tu piso de alquiler"
        items={[
          { href: "/recomendados/organizacion-hogar", label: "Productos sin obra, ideales para alquiler" },
          { href: "/blog/organizar-piso-alquiler-sin-taladrar", label: "Como organizar un piso de alquiler sin agujerear las paredes" },
        ]}
      />
    </article>
  );
}
