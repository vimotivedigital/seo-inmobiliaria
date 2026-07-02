import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ReformaCalculator } from "@/components/calculators/ReformaCalculator";
import { SourceBox } from "@/components/seo/SourceBox";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { getCityBySlug, getReformaCostByCity } from "@/lib/data";
import reformaCostsJson from "@data/reforma-costs.json";
import { evaluateCityPageQuality } from "@/lib/quality-control";
import { buildReformaContent, buildReformaFaqs, combineUniqueContent } from "@/lib/content-builders";
import { buildProgrammaticMetadata, formatEur } from "@/lib/seo";

export const revalidate = 2592000;

interface Params {
  params: { ciudad: string };
}

/**
 * Solo se generan paginas para ciudades que tienen coste de reforma
 * verificado en /data/reforma-costs.json -- si no hay dato, no hay pagina
 * (no se genera una plantilla vacia con el nombre de la ciudad).
 */
export function generateStaticParams() {
  return (reformaCostsJson as { city_slug: string }[]).map((r) => ({ ciudad: r.city_slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const city = getCityBySlug(params.ciudad);
  const cost = getReformaCostByCity(params.ciudad);
  if (!city || !cost) return {};

  const uniqueContent = combineUniqueContent(buildReformaContent(city, cost), buildReformaFaqs(city, cost));
  const quality = evaluateCityPageQuality(city, uniqueContent);

  return buildProgrammaticMetadata({
    title: `Coste de reforma por m2 en ${city.name}: rangos 2026`,
    description: `Cuanto cuesta reformar un piso en ${city.name} por m2, desde una reforma basica (${formatEur(cost.low.value)}/m2) hasta integral (${formatEur(cost.high.value)}/m2).`,
    path: `/coste-reforma-m2/${city.slug}`,
    quality,
  });
}

export default function CosteReformaM2CiudadPage({ params }: Params) {
  const city = getCityBySlug(params.ciudad);
  const cost = getReformaCostByCity(params.ciudad);
  if (!city || !cost) notFound();

  const introContent = buildReformaContent(city, cost);
  const faqs = buildReformaFaqs(city, cost);
  const quality = evaluateCityPageQuality(city, combineUniqueContent(introContent, faqs));

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Reformas", href: "/reformas" },
          { name: `Coste de reforma en ${city.name}`, href: `/coste-reforma-m2/${city.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Coste de reforma por m2 en {city.name}</h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">{introContent}</p>

      <AdSlot slotId="1818181818" placement="top" />

      <ReformaCalculator cityName={city.name} cost={cost} />

      <SourceBox
        items={[
          { label: "Reforma basica", data: cost.low },
          { label: "Reforma media", data: cost.medium },
          { label: "Reforma integral", data: cost.high },
        ]}
      />

      <Disclaimer />

      <AdSlot slotId="1919191919" placement="after-results" />

      <FaqSection
        heading={`Preguntas frecuentes sobre reformas en ${city.name}`}
        items={faqs}
      />

      <InternalLinks
        items={[
          { href: `/comprar-vs-alquilar/${city.slug}`, label: `Comprar vs alquilar en ${city.name}` },
          { href: `/coste-compra-vivienda/${city.slug}`, label: `Gastos de comprar vivienda en ${city.name}` },
        ]}
      />

      {process.env.NODE_ENV !== "production" && !quality.indexable && (
        <p className="mt-8 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          [Solo visible en desarrollo] Esta pagina esta en <code>noindex</code>: {quality.reasons.join(" ")}
        </p>
      )}
    </article>
  );
}
