import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MudanzaCalculator } from "@/components/calculators/MudanzaCalculator";
import { SourceBox } from "@/components/seo/SourceBox";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllMudanzaRoutes, getCityBySlug, getMudanzaRouteBySlug } from "@/lib/data";
import { evaluatePageQuality } from "@/lib/quality-control";
import { buildMudanzaContent, buildMudanzaFaqs, combineUniqueContent } from "@/lib/content-builders";
import { buildProgrammaticMetadata } from "@/lib/seo";

export const revalidate = 2592000;

interface Params {
  params: { ruta: string };
}

/**
 * Rutas de mudanza: a diferencia de la calculadora de hipoteca, aqui SI
 * generamos una URL estatica por ruta origen-destino porque son un numero
 * acotado y con demanda de busqueda verificable ("mudanza madrid barcelona"
 * es una consulta real), no una combinatoria libre de parametros numericos.
 */
export function generateStaticParams() {
  return getAllMudanzaRoutes().map((r) => ({ ruta: r.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const route = getMudanzaRouteBySlug(params.ruta);
  if (!route) return {};
  const origin = getCityBySlug(route.origin_slug);
  const destination = getCityBySlug(route.destination_slug);
  if (!origin || !destination) return {};

  const uniqueContent = combineUniqueContent(buildMudanzaContent(origin, destination, route), buildMudanzaFaqs(origin, destination, route));
  const quality = evaluatePageQuality({
    searchVolumeTier: route.search_volume_tier,
    uniqueContent,
    hasVerifiedSource: Boolean(route.cost_medium.source),
    hasUniqueDatapoint: true,
  });

  return buildProgrammaticMetadata({
    title: `Coste de mudanza de ${origin.name} a ${destination.name}`,
    description: `Cuanto cuesta una mudanza de ${origin.name} a ${destination.name} (${route.distance_km} km) segun el tamano del piso, con calculadora.`,
    path: `/coste-mudanza/${route.slug}`,
    quality,
  });
}

export default function CosteMudanzaRutaPage({ params }: Params) {
  const route = getMudanzaRouteBySlug(params.ruta);
  if (!route) notFound();
  const origin = getCityBySlug(route.origin_slug);
  const destination = getCityBySlug(route.destination_slug);
  if (!origin || !destination) notFound();

  const introContent = buildMudanzaContent(origin, destination, route);
  const faqs = buildMudanzaFaqs(origin, destination, route);
  const quality = evaluatePageQuality({
    searchVolumeTier: route.search_volume_tier,
    uniqueContent: combineUniqueContent(introContent, faqs),
    hasVerifiedSource: Boolean(route.cost_medium.source),
    hasUniqueDatapoint: true,
  });

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Comprar vivienda", href: "/comprar-vivienda" },
          { name: `Mudanza ${origin.name}-${destination.name}`, href: `/coste-mudanza/${route.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Coste de mudanza de {origin.name} a {destination.name}
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">{introContent}</p>

      <AdSlot slotId="2222222221" placement="top" />

      <MudanzaCalculator route={route} originName={origin.name} destinationName={destination.name} />

      <SourceBox
        items={[
          { label: "Coste piso pequeno/estudio", data: route.cost_small },
          { label: "Coste piso mediano (60-100m2)", data: route.cost_medium },
          { label: "Coste piso grande (>100m2)", data: route.cost_large },
        ]}
      />

      <Disclaimer />

      <AdSlot slotId="2323232323" placement="after-results" />

      <FaqSection
        heading={`Preguntas frecuentes sobre la mudanza ${origin.name}-${destination.name}`}
        items={faqs}
      />

      <InternalLinks
        items={[
          { href: `/comprar-vs-alquilar/${origin.slug}`, label: `Comprar vs alquilar en ${origin.name}` },
          { href: `/comprar-vs-alquilar/${destination.slug}`, label: `Comprar vs alquilar en ${destination.name}` },
          { href: "/recomendados/mudanza", label: "Material de embalaje recomendado" },
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
