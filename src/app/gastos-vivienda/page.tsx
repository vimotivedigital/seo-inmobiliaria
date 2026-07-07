import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CoverImage } from "@/components/seo/CoverImage";
import { FaqSection } from "@/components/seo/FaqSection";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildEditorialMetadata } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Gastos de vivienda en propiedad: IBI, comunidad y mantenimiento",
  "Que gastos recurrentes tiene ser propietario en Espana: IBI, comunidad, seguro de hogar, suministros y mantenimiento anual.",
  "/gastos-vivienda"
);

export default function GastosViviendaHubPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Gastos de vivienda", href: "/gastos-vivienda" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gastos de vivienda en propiedad</h1>

      <CoverImage src="/images/gastos-estudio-ciudad.jpg" alt="Estudio con vistas a la ciudad" priority />

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Ser propietario no termina en la cuota de la hipoteca. Hay un conjunto de gastos
        recurrentes que conviene presupuestar antes de comprar, no despues.
      </p>

      <AdSlot slotId="9999999999" placement="top" />

      <h2>Gastos anuales tipicos</h2>
      <ul>
        <li><strong>IBI (Impuesto sobre Bienes Inmuebles):</strong> lo fija cada ayuntamiento sobre el valor catastral, normalmente entre el 0,4% y el 1,1% de dicho valor al anio.</li>
        <li><strong>Comunidad de propietarios:</strong> muy variable segun servicios (ascensor, portero, piscina); en pisos sin servicios adicionales suele rondar 30-60€/mes.</li>
        <li><strong>Seguro de hogar:</strong> obligatorio si tienes hipoteca, entre 150-350€/anio segun cobertura y valor de reconstruccion.</li>
        <li><strong>Mantenimiento:</strong> usa nuestra <Link href="/reformas">estimacion de coste de reforma</Link> como referencia para partidas puntuales grandes (cocina, bano); para mantenimiento general se suele presupuestar entre el 1% y el 1,5% del valor de la vivienda al anio.</li>
      </ul>

      <Disclaimer />

      <AdSlot slotId="1010101010" placement="in-content" />

      <FaqSection
        heading="Preguntas frecuentes sobre gastos de vivienda"
        items={[
          {
            question: "¿El IBI lo paga el propietario o el inquilino?",
            answer:
              "Por ley corresponde al propietario, aunque en alquiler puede pactarse su repercusion al inquilino si el contrato lo recoge expresamente.",
          },
          {
            question: "¿Es obligatorio contratar seguro de hogar?",
            answer:
              "No por ley, pero la practica totalidad de bancos lo exige como condicion para conceder una hipoteca, al menos en su modalidad de continente.",
          },
        ]}
      />
    </article>
  );
}
