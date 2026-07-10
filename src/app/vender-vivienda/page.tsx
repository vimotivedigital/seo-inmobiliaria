import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { SellLeadForm } from "@/components/leads/SellLeadForm";
import { getAllVenderViviendaLocalidades } from "@/lib/vender-vivienda";
import { evaluateVenderViviendaQuality } from "@/lib/quality-control";
import { buildVenderViviendaContent, buildVenderViviendaFaqs, combineUniqueContent } from "@/lib/content-builders";
import { buildEditorialMetadata, formatEur } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Vender tu vivienda en el Baix Llobregat Sud: valoracion gratuita",
  "Solicita una valoracion gratuita de tu vivienda en Castelldefels, Sitges, Gava, Viladecans, Sant Boi y otros municipios del Baix Llobregat Sud.",
  "/vender-vivienda"
);

export default function VenderViviendaHubPage() {
  const localidades = getAllVenderViviendaLocalidades();
  const indexableLocalidades = localidades.filter((l) =>
    evaluateVenderViviendaQuality(l, combineUniqueContent(buildVenderViviendaContent(l), buildVenderViviendaFaqs(l))).indexable
  );

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Vender vivienda", href: "/vender-vivienda" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Vender tu vivienda en el Baix Llobregat Sud
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Si tienes una vivienda en Castelldefels, Sitges, Gavà, Viladecans, Sant Boi de Llobregat,
        Vilanova i la Geltrú o alrededores, puedes solicitar una valoracion gratuita y sin
        compromiso. La gestiona una agencia inmobiliaria colaboradora especializada en la zona,
        no TipoFijo directamente -- mas abajo puedes ver quien recibe tus datos y por que.
      </p>

      <h2>El proceso de venta, paso a paso</h2>
      <ol>
        <li><strong>Valoracion inicial:</strong> con los datos de tu vivienda y comparables reales de la zona, sin compromiso.</li>
        <li><strong>Visita y ajuste de precio:</strong> un agente visita la vivienda para afinar el precio segun estado, orientacion y planta.</li>
        <li><strong>Publicacion y visitas:</strong> el inmueble se publica en los principales portales y se gestionan las visitas con compradores interesados.</li>
        <li><strong>Negociacion y arras:</strong> se negocia la oferta y se firma un contrato de arras con el comprador.</li>
        <li><strong>Notaria:</strong> firma de la escritura publica y entrega de llaves.</li>
      </ol>

      <h2>Localidades donde operamos</h2>
      <p>
        Publicamos una pagina especifica, con precio medio de mercado y factores propios de cada
        localidad, solo para los municipios con demanda confirmada. El resto se ira anadiendo
        segun se valide su volumen de busqueda (ver <Link href="/metodologia">metodologia</Link>).
      </p>
      <ul className="grid gap-1 sm:grid-cols-2 list-none pl-0">
        {indexableLocalidades.map((l) => (
          <li key={l.slug}>
            <Link href={`/vender-vivienda/${l.slug}`}>
              Vender vivienda en {l.name} ({formatEur(l.price_per_sqm.value)}/m2) →
            </Link>
          </li>
        ))}
      </ul>

      <SellLeadForm />

      <FaqSection
        heading="Preguntas frecuentes sobre vender tu vivienda"
        items={[
          {
            question: "¿Tiene algun coste solicitar la valoracion?",
            answer:
              "No, la valoracion inicial es gratuita y sin compromiso. Solo si decides encargar la venta a la agencia colaboradora se aplicarian sus honorarios habituales, que te detallaran antes de firmar cualquier encargo.",
          },
          {
            question: "¿Quien recibe mis datos si relleno el formulario?",
            answer:
              "Tus datos los procesa TipoFijo para contactarte, y ademas se ceden a la agencia inmobiliaria colaboradora nombrada junto al formulario, unicamente si marcas esa casilla de forma explicita. Puedes ver el detalle completo en la politica de privacidad.",
          },
          {
            question: "¿Puedo vender si mi municipio no aparece en la lista?",
            answer:
              "Si. El formulario acepta cualquier localidad de la zona; solo publicamos una pagina propia (con datos de precio y contexto local) para los municipios con demanda de busqueda ya confirmada.",
          },
        ]}
      />

      <InternalLinks
        items={[
          { href: "/comprar-vivienda", label: "Si en cambio quieres comprar vivienda" },
          { href: "/gastos-vivienda", label: "Gastos recurrentes de ser propietario" },
          { href: "/reformas", label: "Cuanto cuesta reformar antes de vender" },
        ]}
      />
    </article>
  );
}
