import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CoverImage } from "@/components/seo/CoverImage";
import { FaqSection } from "@/components/seo/FaqSection";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllCities, getReformaCostByCity } from "@/lib/data";
import { filterIndexableEntities } from "@/lib/quality-control";
import { buildEditorialMetadata, formatEur } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Coste de reforma por m2 en Espana: rangos y que incluye cada nivel",
  "Cuanto cuesta reformar un piso por m2 segun el nivel (basico, medio, integral) y la ciudad, con rangos reales y fuente.",
  "/reformas"
);

export default function ReformasHubPage() {
  const cities = filterIndexableEntities(getAllCities()).filter((c) => getReformaCostByCity(c.slug));

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Reformas", href: "/reformas" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reformas de vivienda: cuanto cuestan por m2</h1>

      <CoverImage src="/images/reformas-habitacion-vacia.jpg" alt="Habitacion vacia recien reformada" priority />

      <p className="text-lg text-slate-600 dark:text-slate-300">
        El coste de una reforma depende sobre todo del alcance (pintura vs reforma integral) y en
        segundo lugar de la ciudad, por el coste de la mano de obra. Estos son los tres niveles
        que usamos en todas nuestras calculadoras de reforma:
      </p>

      <AdSlot slotId="7777777777" placement="top" />

      <h2>Los tres niveles de reforma</h2>
      <ul>
        <li><strong>Basica:</strong> pintura, suelos y un bano funcional, sin tocar instalaciones.</li>
        <li><strong>Media:</strong> cocina + bano completos, suelos, pintura y actualizacion de electricidad.</li>
        <li><strong>Integral:</strong> reforma completa incluyendo instalaciones (fontaneria, electricidad), distribucion y materiales de gama alta.</li>
      </ul>

      <h2>Coste por ciudad</h2>
      <p>
        La mano de obra especializada (fontaneros, electricistas, alicatadores) tiene tarifas muy
        distintas entre ciudades. Consulta el rango bajo/medio/alto y calcula tu presupuesto con
        tus propios metros cuadrados:
      </p>
      <ul className="grid gap-1 sm:grid-cols-2 list-none pl-0">
        {cities.map((city) => {
          const cost = getReformaCostByCity(city.slug)!;
          return (
            <li key={city.slug}>
              <Link href={`/coste-reforma-m2/${city.slug}`}>
                Reforma en {city.name} (desde {formatEur(cost.low.value)}/m2) →
              </Link>
            </li>
          );
        })}
      </ul>

      <Disclaimer />

      <AdSlot slotId="8888888888" placement="in-content" />

      <FaqSection
        heading="Preguntas frecuentes sobre reformas"
        items={[
          {
            question: "¿Necesito licencia de obras para reformar mi piso?",
            answer:
              "Depende del alcance. Reformas que no afectan a la estructura ni a elementos comunes suelen requerir solo una comunicacion previa al ayuntamiento; reformas que tocan estructura o fachada necesitan licencia de obra mayor.",
          },
          {
            question: "¿El IVA de la reforma es del 21% o del 10%?",
            answer:
              "El 10% se aplica a reformas de vivienda habitual con mas de 2 anios de antiguedad, cuando el coste de materiales no supera el 40% de la base imponible. Fuera de esos requisitos se aplica el 21% general.",
          },
        ]}
      />

      <InternalLinks
        heading="Herramientas recomendadas"
        items={[
          { href: "/recomendados/reformas-bricolaje", label: "Kit basico de herramientas para tu reforma" },
          { href: "/blog/antes-de-reformar-herramientas-basicas", label: "5 herramientas que te ahorran llamadas al profesional" },
        ]}
      />
    </article>
  );
}
