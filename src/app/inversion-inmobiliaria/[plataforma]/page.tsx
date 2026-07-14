import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BadgeCheck, ShieldQuestion, TriangleAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InvestmentDisclaimer } from "@/components/seo/InvestmentDisclaimer";
import { SourceBox } from "@/components/seo/SourceBox";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { PlatformCTA } from "@/components/inversion/PlatformCTA";
import { FiscalidadCrowdfunding } from "@/components/inversion/FiscalidadCrowdfunding";
import {
  getAllCrowdfundingPlatforms,
  getCrowdfundingPlatformBySlug,
  psfpRegistrationToSourcedValue,
  buildPlatformFaqs,
} from "@/lib/inversion";
import { CROWDFUNDING_MODEL_LABELS } from "@/types/inversion";
import { buildEditorialMetadata, SITE_URL } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/jsonld";

interface Params {
  params: { plataforma: string };
}

export function generateStaticParams() {
  return getAllCrowdfundingPlatforms().map((p) => ({ plataforma: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const platform = getCrowdfundingPlatformBySlug(params.plataforma);
  if (!platform) return {};

  return buildEditorialMetadata(
    `${platform.name}: analisis, regulacion CNMV y riesgos`,
    `Que es ${platform.name}, si esta regulada por la CNMV como PSFP, ticket minimo, liquidez y riesgos especificos de invertir a traves de esta plataforma de crowdfunding inmobiliario.`,
    `/inversion-inmobiliaria/${platform.slug}`
  );
}

export default function CrowdfundingPlatformPage({ params }: Params) {
  const platform = getCrowdfundingPlatformBySlug(params.plataforma);
  if (!platform) notFound();

  const faqs = buildPlatformFaqs(platform);
  const jsonLd = buildArticleJsonLd({
    headline: `${platform.name}: analisis, regulacion CNMV y riesgos`,
    description: platform.modelDescription,
    url: `${SITE_URL}/inversion-inmobiliaria/${platform.slug}`,
    datePublished: platform.psfpRegistration?.last_updated ?? "2026-07-14",
    dateModified: platform.psfpRegistration?.last_updated ?? "2026-07-14",
  });

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Inversion inmobiliaria", href: "/inversion-inmobiliaria" },
          { name: platform.name, href: `/inversion-inmobiliaria/${platform.slug}` },
        ]}
      />

      <InvestmentDisclaimer />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{platform.name}</h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">
        {platform.name} ({platform.legalName}) es una plataforma de crowdfunding inmobiliario que
        opera en Espana. {platform.rebrandNote}
      </p>

      <h2>Como funciona</h2>
      <p>{platform.modelDescription}</p>
      <ul>
        {platform.models.map((m) => (
          <li key={m}>{CROWDFUNDING_MODEL_LABELS[m]}</li>
        ))}
      </ul>

      <h2>Estado regulatorio</h2>
      {platform.regulatedByCnmv && platform.psfpRegistration ? (
        <>
          <p className="flex items-center gap-2">
            <BadgeCheck size={18} className="shrink-0 text-success-600 dark:text-success-500" />
            Registrada como Proveedor de Servicios de Financiacion Participativa (PSFP) en la CNMV.
          </p>
          <SourceBox
            title="Registro CNMV"
            items={[{ label: "Registro PSFP", data: psfpRegistrationToSourcedValue(platform.psfpRegistration) }]}
          />
        </>
      ) : (
        <p className="flex items-center gap-2 text-warning-700 dark:text-warning-400">
          <ShieldQuestion size={18} className="shrink-0" />
          No se ha podido verificar un registro vigente de esta plataforma en el registro publico
          de PSFP de la CNMV. Comprueba tu mismo el{" "}
          <a
            href="https://www.cnmv.es/portal/consultas/servicios-financiacion-participativa/listado-proveedores"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            registro oficial
          </a>{" "}
          antes de invertir.
        </p>
      )}

      <h2>Ticket minimo y liquidez</h2>
      {platform.minInvestment ? (
        <SourceBox title="Inversion minima" items={[{ label: "Ticket minimo declarado", data: platform.minInvestment }]} />
      ) : (
        <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
          <strong>Dato no verificado:</strong> {platform.minInvestmentNota}
        </p>
      )}
      <p>{platform.liquidity}</p>

      <h2>Rentabilidad declarada por la plataforma</h2>
      {platform.historicalReturn ? (
        <SourceBox title="Rentabilidad" items={[{ label: "Rentabilidad declarada", data: platform.historicalReturn }]} />
      ) : (
        <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/60">
          <strong>Dato no verificado:</strong> {platform.historicalReturnNota}
        </p>
      )}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Rentabilidades pasadas o proyectadas no garantizan resultados futuros.
      </p>

      <h2>Riesgos especificos</h2>
      <ul>
        {platform.specificRisks.map((risk) => (
          <li key={risk}>{risk}</li>
        ))}
      </ul>

      {platform.sanctions && platform.sanctions.length > 0 && (
        <>
          <h2 className="flex items-center gap-2">
            <TriangleAlert size={20} className="shrink-0 text-warning-600 dark:text-warning-500" />
            Historial regulatorio
          </h2>
          <ul>
            {platform.sanctions.map((s) => (
              <li key={`${s.anio}-${s.importe_eur}`}>
                <strong>{s.anio}:</strong> {s.descripcion}
                {s.importe_eur ? ` (${s.importe_eur.toLocaleString("es-ES")} EUR)` : ""}. Estado: {s.estado}.{" "}
                <a href={s.source_url} target="_blank" rel="noopener noreferrer nofollow">
                  {s.source}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <FiscalidadCrowdfunding />

      <PlatformCTA platformName={platform.name} affiliateUrl={platform.website} />

      <FaqSection heading={`Preguntas frecuentes sobre ${platform.name}`} items={faqs} />

      <InternalLinks
        items={[
          { href: "/inversion-inmobiliaria", label: "Ver todas las plataformas" },
          { href: "/inversion-inmobiliaria/comparativa", label: "Comparativa completa" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
