import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CoverImage } from "@/components/seo/CoverImage";
import { InvestmentDisclaimer } from "@/components/seo/InvestmentDisclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { getAllCrowdfundingPlatforms } from "@/lib/inversion";
import { CROWDFUNDING_MODEL_LABELS } from "@/types/inversion";
import { buildEditorialMetadata, SITE_URL } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildEditorialMetadata(
  "Crowdfunding inmobiliario en Espana 2026: plataformas reguladas por la CNMV",
  "Guia sobre crowdfunding inmobiliario para inversores minoristas en Espana: que plataformas estan reguladas por la CNMV como PSFP, modelos de inversion (deuda vs equity) y riesgos especificos de cada una.",
  "/inversion-inmobiliaria"
);

export default function InversionInmobiliariaHubPage() {
  const platforms = getAllCrowdfundingPlatforms();
  const jsonLd = buildArticleJsonLd({
    headline: "Crowdfunding inmobiliario en Espana: plataformas, regulacion y riesgos",
    description: "Guia sobre crowdfunding inmobiliario para inversores minoristas en Espana, con plataformas verificadas en el registro de la CNMV.",
    url: `${SITE_URL}/inversion-inmobiliaria`,
    datePublished: "2026-07-14",
    dateModified: "2026-07-14",
  });

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Inversion inmobiliaria", href: "/inversion-inmobiliaria" }]} />

      <InvestmentDisclaimer />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Crowdfunding inmobiliario en Espana
      </h1>

      <CoverImage src="/images/galeria-edificio-atardecer.jpg" alt="Edificio residencial al atardecer" priority />

      <p className="text-lg text-slate-600 dark:text-slate-300">
        El crowdfunding inmobiliario permite a inversores minoristas participar, con importes
        pequenos, en proyectos de compraventa, alquiler o financiacion de promotores
        inmobiliarios, sin tener que comprar una vivienda completa. No todas las plataformas
        funcionan igual ni tienen el mismo nivel de supervision: antes de invertir en cualquiera de
        ellas, conviene entender que modelo ofrece (deuda o equity), si esta registrada como
        Proveedor de Servicios de Financiacion Participativa (PSFP) ante la CNMV, y que riesgos
        especificos tiene.
      </p>

      <h2>Deuda vs equity: dos riesgos muy distintos</h2>
      <p>
        En un proyecto de <strong>deuda (crowdlending)</strong>, el inversor presta dinero al
        promotor a cambio de un interes fijo pactado, normalmente con garantia hipotecaria sobre el
        inmueble. En un proyecto de <strong>equity</strong>, el inversor entra como socio de la
        sociedad que compra, reforma o alquila el inmueble, y su retorno depende del resultado real
        del proyecto -- puede ser mayor si todo va bien, pero tambien puede perder mas si el
        proyecto no genera la plusvalia o la renta esperada. Ningun modelo esta libre de riesgo de
        perdida de capital.
      </p>

      <h2>Plataformas verificadas</h2>
      <p>
        Solo incluimos aqui plataformas cuyo estado regulatorio hemos podido verificar
        directamente en el registro publico de la CNMV a fecha de esta revision (ver{" "}
        <Link href="/metodologia">metodologia</Link>).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {platforms.map((p) => (
          <Link
            key={p.slug}
            href={`/inversion-inmobiliaria/${p.slug}`}
            className="not-prose rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">{p.name}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {p.models.map((m) => CROWDFUNDING_MODEL_LABELS[m]).join(" · ")}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
              {p.regulatedByCnmv ? `PSFP CNMV nº ${p.psfpRegistration?.numero}` : "Regulacion no verificada"}
            </p>
          </Link>
        ))}
      </div>

      <p>
        <Link href="/inversion-inmobiliaria/comparativa">Ver la comparativa completa</Link> con
        ticket minimo, liquidez, rentabilidad declarada y riesgos especificos de cada plataforma.
      </p>

      <FaqSection
        heading="Preguntas frecuentes sobre crowdfunding inmobiliario"
        items={[
          {
            question: "¿El crowdfunding inmobiliario esta cubierto por el Fondo de Garantia de Depositos?",
            answer:
              "No. A diferencia de una cuenta bancaria o un deposito, el dinero invertido en un proyecto de crowdfunding inmobiliario no esta protegido por ningun fondo de garantia. Si el proyecto o el promotor no cumplen, puedes perder parte o todo el capital invertido.",
          },
          {
            question: "¿Que significa que una plataforma este registrada como PSFP en la CNMV?",
            answer:
              "Significa que la CNMV ha autorizado a esa entidad a prestar servicios de financiacion participativa bajo el Reglamento europeo (UE) 2020/1503 (ECSPR), lo que implica ciertos requisitos de transparencia, informacion al inversor y separacion de fondos. No implica que la CNMV garantice ni supervise el exito de los proyectos concretos que se publican en la plataforma.",
          },
          {
            question: "¿Puedo perder mas dinero del que invierto?",
            answer:
              "No: en crowdfunding inmobiliario tu perdida maxima es el capital que hayas invertido en cada proyecto, no puedes perder mas de eso. Si puedes perder la totalidad de esa inversion si el proyecto fracasa por completo.",
          },
        ]}
      />

      <InternalLinks
        items={[
          { href: "/comprar-vivienda", label: "Si prefieres comprar una vivienda directamente" },
          { href: "/gastos-vivienda", label: "Gastos recurrentes de ser propietario" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
