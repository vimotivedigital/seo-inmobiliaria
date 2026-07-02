import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PurchaseCostsCalculator } from "@/components/calculators/PurchaseCostsCalculator";
import { SourceBox } from "@/components/seo/SourceBox";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllCities, getCityBySlug, getPurchaseCostForCity, getIvaViviendaNueva } from "@/lib/data";
import { evaluateCityPageQuality } from "@/lib/quality-control";
import { buildCosteCompraContent, buildCosteCompraFaqs, combineUniqueContent, ccaaCostToSourcedValue } from "@/lib/content-builders";
import { buildProgrammaticMetadata, formatPercent } from "@/lib/seo";

export const revalidate = 2592000; // los tipos de ITP/IVA cambian poco; revision mensual

interface Params {
  params: { ciudad: string };
}

export function generateStaticParams() {
  return getAllCities().map((c) => ({ ciudad: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const city = getCityBySlug(params.ciudad);
  const purchaseCosts = city ? getPurchaseCostForCity(city.slug) : undefined;
  if (!city || !purchaseCosts) return {};

  const uniqueContent = combineUniqueContent(buildCosteCompraContent(city, purchaseCosts), buildCosteCompraFaqs(city, purchaseCosts));
  const quality = evaluateCityPageQuality(city, uniqueContent);

  const itpDescription =
    purchaseCosts.tipo === "fijo"
      ? `ITP del ${formatPercent(purchaseCosts.tramos[0].porcentaje)}`
      : "ITP progresivo por tramos";

  return buildProgrammaticMetadata({
    title: `Gastos de comprar vivienda en ${city.name}: ITP, notaria y registro`,
    description: `Cuanto pagaras de impuestos y gastos al comprar vivienda en ${city.name} (${itpDescription} en ${city.ccaa}), con calculadora del desglose completo.`,
    path: `/coste-compra-vivienda/${city.slug}`,
    quality,
  });
}

export default function CosteCompraViviendaCiudadPage({ params }: Params) {
  const city = getCityBySlug(params.ciudad);
  if (!city) notFound();
  const purchaseCosts = getPurchaseCostForCity(city.slug);
  if (!purchaseCosts) notFound();

  const iva = getIvaViviendaNueva();
  const introContent = buildCosteCompraContent(city, purchaseCosts);
  const faqs = buildCosteCompraFaqs(city, purchaseCosts);
  const quality = evaluateCityPageQuality(city, combineUniqueContent(introContent, faqs));

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Comprar vivienda", href: "/comprar-vivienda" },
          { name: `Gastos de compra en ${city.name}`, href: `/coste-compra-vivienda/${city.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Gastos de comprar vivienda en {city.name}
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">{introContent}</p>

      <AdSlot slotId="1616161616" placement="top" />

      <PurchaseCostsCalculator ccaaName={city.ccaa} costs={purchaseCosts} iva={iva} />

      <SourceBox
        items={[
          { label: `ITP y AJD en ${city.ccaa}`, data: ccaaCostToSourcedValue(purchaseCosts) },
          { label: "IVA vivienda nueva (tipo nacional)", data: iva },
        ]}
      />

      <Disclaimer />

      <AdSlot slotId="1717171717" placement="after-results" />

      <FaqSection
        heading={`Preguntas frecuentes sobre gastos de compra en ${city.name}`}
        items={faqs}
      />

      <InternalLinks
        items={[
          { href: `/comprar-vs-alquilar/${city.slug}`, label: `Comprar vs alquilar en ${city.name}` },
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
