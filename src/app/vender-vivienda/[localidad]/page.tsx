import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SourceBox } from "@/components/seo/SourceBox";
import { Disclaimer } from "@/components/seo/Disclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { SellLeadForm } from "@/components/leads/SellLeadForm";
import { getAllVenderViviendaLocalidades, getVenderViviendaLocalidadBySlug } from "@/lib/vender-vivienda";
import { evaluateVenderViviendaQuality } from "@/lib/quality-control";
import { buildVenderViviendaContent, buildVenderViviendaFaqs, combineUniqueContent } from "@/lib/content-builders";
import { buildProgrammaticMetadata, formatEur, SITE_URL } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/jsonld";
import { PARTNER_AGENCY_NAME } from "@/lib/partner-agency";

export const revalidate = 7776000; // precios trimestrales; ver next_review_due en el dato

interface Params {
  params: { localidad: string };
}

export function generateStaticParams() {
  return getAllVenderViviendaLocalidades().map((l) => ({ localidad: l.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const localidad = getVenderViviendaLocalidadBySlug(params.localidad);
  if (!localidad) return {};

  const content = buildVenderViviendaContent(localidad);
  const faqs = buildVenderViviendaFaqs(localidad);
  const quality = evaluateVenderViviendaQuality(localidad, combineUniqueContent(content, faqs));

  return buildProgrammaticMetadata({
    title: `Vender vivienda en ${localidad.name}: valoracion gratuita`,
    description: `Precio medio de venta en ${localidad.name} (${formatEur(localidad.price_per_sqm.value)}/m2) y valoracion gratuita de tu vivienda con una agencia colaboradora especializada en la zona.`,
    path: `/vender-vivienda/${localidad.slug}`,
    quality,
  });
}

export default function VenderViviendaLocalidadPage({ params }: Params) {
  const localidad = getVenderViviendaLocalidadBySlug(params.localidad);
  if (!localidad) notFound();

  const introContent = buildVenderViviendaContent(localidad);
  const faqs = buildVenderViviendaFaqs(localidad);
  const quality = evaluateVenderViviendaQuality(localidad, combineUniqueContent(introContent, faqs));

  const serviceJsonLd = buildServiceJsonLd({
    name: `Vender vivienda en ${localidad.name}`,
    description: introContent,
    url: `${SITE_URL}/vender-vivienda/${localidad.slug}`,
    areaServed: `${localidad.name}, ${localidad.provincia}`,
    providerName: PARTNER_AGENCY_NAME,
  });

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Vender vivienda", href: "/vender-vivienda" },
          { name: localidad.name, href: `/vender-vivienda/${localidad.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Vender vivienda en {localidad.name}
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">{introContent}</p>

      <h2>Lo que hace diferente el mercado en {localidad.name}</h2>
      <ul>
        {localidad.local_factors.map((factor) => (
          <li key={factor}>{factor}</li>
        ))}
      </ul>

      <SourceBox
        items={[{ label: `Precio medio de venta en ${localidad.name}`, data: localidad.price_per_sqm }]}
      />

      <SellLeadForm defaultLocalidad={localidad.name} fixedLocalidad />

      <h2>El proceso de venta, paso a paso</h2>
      <ol>
        <li><strong>Valoracion inicial:</strong> con los datos de tu vivienda y comparables reales de {localidad.name}, sin compromiso.</li>
        <li><strong>Visita y ajuste de precio:</strong> un agente visita la vivienda para afinar el precio segun estado, orientacion y planta.</li>
        <li><strong>Publicacion y visitas:</strong> el inmueble se publica en los principales portales y se gestionan las visitas con compradores interesados.</li>
        <li><strong>Negociacion y arras:</strong> se negocia la oferta y se firma un contrato de arras con el comprador.</li>
        <li><strong>Notaria:</strong> firma de la escritura publica y entrega de llaves.</li>
      </ol>

      <Disclaimer />

      <FaqSection heading={`Preguntas frecuentes sobre vender en ${localidad.name}`} items={faqs} />

      <InternalLinks
        items={[
          { href: "/vender-vivienda", label: "Ver el resto de localidades" },
          { href: "/reformas", label: "Cuanto cuesta reformar antes de vender" },
          { href: "/gastos-vivienda", label: "Gastos recurrentes de ser propietario" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      {process.env.NODE_ENV !== "production" && !quality.indexable && (
        <p className="mt-8 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          [Solo visible en desarrollo] Esta pagina esta en <code>noindex</code>: {quality.reasons.join(" ")}
        </p>
      )}
    </article>
  );
}
