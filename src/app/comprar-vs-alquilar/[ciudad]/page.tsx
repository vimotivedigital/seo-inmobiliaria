import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RentVsBuyCalculator } from "@/components/calculators/RentVsBuyCalculator";
import { SourceBox } from "@/components/seo/SourceBox";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllCities, getCityBySlug, getMortgageRates, getPurchaseCostForCity } from "@/lib/data";
import { evaluateCityPageQuality } from "@/lib/quality-control";
import { buildComprarVsAlquilarContent, buildComprarVsAlquilarFaqs, combineUniqueContent } from "@/lib/content-builders";
import { computeEffectiveRate } from "@/lib/tax-brackets";
import { buildProgrammaticMetadata, formatEur } from "@/lib/seo";

export const revalidate = 604800; // precios de referencia, revision semanal

interface Params {
  params: { ciudad: string };
}

/**
 * Se generan paginas para TODAS las ciudades del dataset (no solo las de
 * tier alto/medio) para poder servir `noindex` en las de bajo volumen en
 * lugar de un 404 -- asi mantenemos limpio el enlazado interno mientras
 * esa ciudad no pasa el control de calidad. Ver src/lib/quality-control.ts.
 */
export function generateStaticParams() {
  return getAllCities().map((c) => ({ ciudad: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const city = getCityBySlug(params.ciudad);
  if (!city) return {};

  const uniqueContent = combineUniqueContent(buildComprarVsAlquilarContent(city), buildComprarVsAlquilarFaqs(city));
  const quality = evaluateCityPageQuality(city, uniqueContent);

  return buildProgrammaticMetadata({
    title: `Comprar vs alquilar en ${city.name}: ¿cuando compensa? `,
    description: `Calcula si te compensa comprar o alquilar en ${city.name}. Precio medio: ${formatEur(city.price_per_sqm.value)}/m2. Punto de equilibrio con tus propios datos.`,
    path: `/comprar-vs-alquilar/${city.slug}`,
    quality,
  });
}

export default function ComprarVsAlquilarCiudadPage({ params }: Params) {
  const city = getCityBySlug(params.ciudad);
  if (!city) notFound();

  const rates = getMortgageRates();
  const purchaseCosts = getPurchaseCostForCity(city.slug);

  const introContent = buildComprarVsAlquilarContent(city);
  const faqs = buildComprarVsAlquilarFaqs(city);
  const quality = evaluateCityPageQuality(city, combineUniqueContent(introContent, faqs));

  const estimatedPrice = Math.round((city.price_per_sqm.value * 80) / 1000) * 1000; // piso tipo 80m2
  const estimatedRent = Math.round(city.rent_per_sqm.value * 80);
  const totalPurchaseCostsPct = purchaseCosts
    ? computeEffectiveRate(estimatedPrice, purchaseCosts.tramos) + 1.5 // + estimacion notaria/registro/gestoria
    : 11;

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Alquiler", href: "/alquiler" },
          { name: `Comprar vs alquilar en ${city.name}`, href: `/comprar-vs-alquilar/${city.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Comprar vs alquilar en {city.name}</h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">{introContent}</p>

      <AdSlot slotId="1414141414" placement="top" />

      <RentVsBuyCalculator
        defaultPrice={estimatedPrice}
        defaultRentMonthly={estimatedRent}
        mortgageRatePct={rates.avg_fixed_rate.value}
        purchaseCostsPct={totalPurchaseCostsPct}
      />

      <SourceBox
        items={[
          { label: `Precio medio en ${city.name}`, data: city.price_per_sqm },
          { label: `Alquiler medio en ${city.name}`, data: city.rent_per_sqm },
          { label: "Variacion interanual del precio", data: city.price_yoy_change },
        ]}
      />

      <Disclaimer />

      <AdSlot slotId="1515151515" placement="after-results" />

      <FaqSection
        heading={`Preguntas frecuentes sobre comprar vs alquilar en ${city.name}`}
        items={faqs}
      />

      <InternalLinks
        items={[
          { href: `/coste-compra-vivienda/${city.slug}`, label: `Gastos de comprar vivienda en ${city.name}` },
          { href: `/coste-reforma-m2/${city.slug}`, label: `Coste de reforma por m2 en ${city.name}` },
          { href: `/certificado-energetico/${city.slug}`, label: `Certificado energetico en ${city.name}` },
          { href: "/hipoteca-calculadora", label: "Calculadora de hipoteca" },
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
