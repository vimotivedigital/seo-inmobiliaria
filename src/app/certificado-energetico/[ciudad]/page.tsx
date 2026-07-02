import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EnergyLabelEstimator } from "@/components/calculators/EnergyLabelEstimator";
import { SourceBox } from "@/components/seo/SourceBox";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllCities, getCityBySlug } from "@/lib/data";
import { evaluateCityPageQuality } from "@/lib/quality-control";
import { buildCertificadoEnergeticoContent, buildCertificadoEnergeticoFaqs, combineUniqueContent } from "@/lib/content-builders";
import { buildProgrammaticMetadata } from "@/lib/seo";

export const revalidate = 2592000;

interface Params {
  params: { ciudad: string };
}

export function generateStaticParams() {
  return getAllCities().map((c) => ({ ciudad: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const city = getCityBySlug(params.ciudad);
  if (!city) return {};

  const uniqueContent = combineUniqueContent(buildCertificadoEnergeticoContent(city), buildCertificadoEnergeticoFaqs(city));
  const quality = evaluateCityPageQuality(city, uniqueContent);

  return buildProgrammaticMetadata({
    title: `Certificado energetico en ${city.name}: obligatoriedad y coste`,
    description: `Que es el certificado energetico, cuando es obligatorio en ${city.name} y como afecta al precio de venta o alquiler segun la etiqueta.`,
    path: `/certificado-energetico/${city.slug}`,
    quality,
  });
}

export default function CertificadoEnergeticoCiudadPage({ params }: Params) {
  const city = getCityBySlug(params.ciudad);
  if (!city) notFound();

  const introContent = buildCertificadoEnergeticoContent(city);
  const faqs = buildCertificadoEnergeticoFaqs(city);
  const quality = evaluateCityPageQuality(city, combineUniqueContent(introContent, faqs));

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Comprar vivienda", href: "/comprar-vivienda" },
          { name: `Certificado energetico en ${city.name}`, href: `/certificado-energetico/${city.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Certificado energetico en {city.name}</h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">{introContent}</p>

      <AdSlot slotId="2020202020" placement="top" />

      <EnergyLabelEstimator />

      <SourceBox
        items={[
          { label: `Precio medio en ${city.name}`, data: city.price_per_sqm },
        ]}
      />

      <Disclaimer />

      <AdSlot slotId="2121212121" placement="after-results" />

      <FaqSection
        heading={`Preguntas frecuentes sobre el certificado energetico en ${city.name}`}
        items={faqs}
      />

      <InternalLinks
        items={[
          { href: `/coste-compra-vivienda/${city.slug}`, label: `Gastos de comprar vivienda en ${city.name}` },
          { href: `/coste-reforma-m2/${city.slug}`, label: `Coste de reforma por m2 en ${city.name}` },
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
