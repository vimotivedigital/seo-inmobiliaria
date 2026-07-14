import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, ShieldQuestion } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InvestmentDisclaimer } from "@/components/seo/InvestmentDisclaimer";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { getAllCrowdfundingPlatforms } from "@/lib/inversion";
import { CROWDFUNDING_MODEL_LABELS } from "@/types/inversion";
import { buildEditorialMetadata, SITE_URL } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildEditorialMetadata(
  "Comparativa de plataformas de crowdfunding inmobiliario en Espana",
  "Compara Urbanitae, Civislend, Wecity, Crowpire y StockCrowd IN por regulacion CNMV, modelo de inversion, ticket minimo, liquidez y riesgos.",
  "/inversion-inmobiliaria/comparativa"
);

export default function InversionInmobiliariaComparativaPage() {
  const platforms = getAllCrowdfundingPlatforms();
  const jsonLd = buildArticleJsonLd({
    headline: "Comparativa de plataformas de crowdfunding inmobiliario en Espana",
    description: "Comparativa por regulacion CNMV, modelo de inversion, ticket minimo, liquidez y riesgos de las principales plataformas de crowdfunding inmobiliario en Espana.",
    url: `${SITE_URL}/inversion-inmobiliaria/comparativa`,
    datePublished: "2026-07-14",
    dateModified: "2026-07-14",
  });

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Inversion inmobiliaria", href: "/inversion-inmobiliaria" },
          { name: "Comparativa", href: "/inversion-inmobiliaria/comparativa" },
        ]}
      />

      <InvestmentDisclaimer />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Comparativa de plataformas de crowdfunding inmobiliario
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Esta tabla no es un ranking: cada plataforma tiene un modelo de riesgo distinto (deuda vs
        equity), un ticket minimo distinto y, en algun caso, un historial regulatorio propio que
        conviene conocer antes de decidir. Revisa la fila de cada plataforma y despues su pagina
        individual para el detalle completo con fuentes.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <tr>
              <th className="p-3 font-semibold">Plataforma</th>
              <th className="p-3 font-semibold">Modelo</th>
              <th className="p-3 font-semibold">Regulacion CNMV</th>
              <th className="p-3 font-semibold">Ticket minimo</th>
              <th className="p-3 font-semibold">Liquidez</th>
              <th className="p-3 font-semibold">A tener en cuenta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {platforms.map((p) => (
              <tr key={p.slug} className="align-top text-slate-700 dark:text-slate-300">
                <td className="p-3 font-medium text-slate-900 dark:text-white">
                  <Link href={`/inversion-inmobiliaria/${p.slug}`}>{p.name}</Link>
                </td>
                <td className="p-3">{p.models.map((m) => CROWDFUNDING_MODEL_LABELS[m].split(" ")[0]).join(", ")}</td>
                <td className="p-3">
                  {p.regulatedByCnmv && p.psfpRegistration ? (
                    <span className="flex items-center gap-1 text-success-700 dark:text-success-500">
                      <BadgeCheck size={14} /> PSFP nº {p.psfpRegistration.numero}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-warning-700 dark:text-warning-500">
                      <ShieldQuestion size={14} /> No verificada
                    </span>
                  )}
                </td>
                <td className="p-3">{p.minInvestment ? `${p.minInvestment.value} €` : "No verificado"}</td>
                <td className="p-3">Sin mercado secundario</td>
                <td className="p-3">
                  {p.sanctions && p.sanctions.length > 0
                    ? `Historial de sanciones CNMV (ver detalle en su pagina)`
                    : p.models.length > 1
                      ? "Ofrece varios modelos: revisa cual aplica en cada proyecto concreto"
                      : `Modelo unico: ${p.models[0] ? CROWDFUNDING_MODEL_LABELS[p.models[0]] : "no especificado"}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Como leer esta tabla</h2>
      <ul>
        <li>
          <strong>Regulacion CNMV:</strong> que una plataforma este registrada como PSFP no
          significa que la CNMV avale o supervise cada proyecto concreto -- solo que la propia
          plataforma cumple los requisitos de autorizacion y transparencia del Reglamento europeo
          ECSPR. Verifica siempre el registro directamente en la{" "}
          <a
            href="https://www.cnmv.es/portal/consultas/servicios-financiacion-participativa/listado-proveedores"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            web oficial de la CNMV
          </a>
          , no en la propia plataforma ni en comparadores de terceros.
        </li>
        <li>
          <strong>Liquidez:</strong> ninguna de las plataformas de esta tabla ofrece hoy un mercado
          secundario donde vender tu posicion antes de que termine el proyecto. El dinero invertido
          queda inmovilizado durante todo el plazo del proyecto.
        </li>
        <li>
          <strong>Ticket minimo:</strong> cuando aparece &ldquo;No verificado&rdquo; es porque la propia
          plataforma no publica una cifra fija (varia por proyecto) o no se encontro un dato
          fiable en el momento de esta revision -- no significa que no exista minimo, sino que hay
          que confirmarlo en la web de la plataforma antes de invertir.
        </li>
      </ul>

      <FaqSection
        heading="Preguntas frecuentes sobre esta comparativa"
        items={[
          {
            question: "¿Cual es la mejor plataforma de crowdfunding inmobiliario?",
            answer:
              "No hay una respuesta unica: depende de tu perfil de riesgo. Si prefieres un retorno fijo pactado con garantia hipotecaria, un modelo de deuda (como Civislend) se ajusta mas a ese perfil. Si buscas mayor potencial de retorno asumiendo el riesgo empresarial del proyecto, un modelo de equity encaja mejor. Revisa la pagina individual de cada plataforma antes de decidir.",
          },
          {
            question: "¿Por que algunas plataformas no aparecen en esta comparativa?",
            answer:
              "Solo incluimos plataformas cuyo registro como PSFP hemos podido verificar directamente en la web oficial de la CNMV. Existen otros modelos de inversion inmobiliaria alternativa que operan fuera de ese registro; antes de invertir en cualquiera de ellos, comprueba tu mismo su situacion regulatoria en el registro publico de la CNMV.",
          },
        ]}
      />

      <InternalLinks
        items={[
          { href: "/inversion-inmobiliaria", label: "Volver al hub de inversion inmobiliaria" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
