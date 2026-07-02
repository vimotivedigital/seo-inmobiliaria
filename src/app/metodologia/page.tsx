import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildEditorialMetadata } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Metodologia: como calculamos y verificamos nuestros datos",
  "De donde salen los precios, tipos de interes y costes que usamos en nuestras calculadoras, con que frecuencia se actualizan y su nivel de confianza.",
  "/metodologia"
);

export default function MetodologiaPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Metodologia", href: "/metodologia" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Metodologia</h1>

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Este sitio es un proyecto de contenido en el nicho de vivienda (YMYL). Nos tomamos en
        serio que los datos que publicamos puedan influir en decisiones financieras reales, por
        eso cada cifra que mostramos indica su fuente, su fecha de actualizacion y su nivel de
        confianza (dato oficial o estimacion).
      </p>

      <h2>Fuentes de datos que usamos</h2>
      <ul>
        <li><strong>Precio de venta y alquiler por m2:</strong> medias de anuncios activos en portales inmobiliarios (Idealista, Fotocasa), contrastadas cuando es posible con los informes trimestrales del INE y de Tinsa.</li>
        <li><strong>Tipos de interes hipotecario:</strong> Euribor a 12 meses (Banco de Espana) y media de ofertas publicadas por bancos con actividad en Espana para el TIN a 20-30 anios.</li>
        <li><strong>Impuestos de compraventa (ITP/IVA/AJD):</strong> normativa autonomica y estatal vigente.</li>
        <li><strong>Coste de reforma y mudanza:</strong> medias de presupuestos sectoriales, marcadas siempre como estimacion.</li>
      </ul>

      <h2>Frecuencia de actualizacion</h2>
      <p>
        Los tipos de interes y los precios de referencia se revisan con la periodicidad indicada
        en cada pagina (diaria para tipos hipotecarios, semanal para precios de vivienda, mensual
        para impuestos y costes de reforma/mudanza). La fecha exacta de la ultima actualizacion
        de cada dato aparece en la caja &quot;Sobre estos datos&quot; de la pagina donde se usa.
      </p>

      <h2>Como decidimos que paginas publicamos</h2>
      <p>
        No generamos paginas para todas las combinaciones matematicamente posibles de ciudad,
        ruta o parametro. Cada pagina programatica pasa un control de calidad automatico antes de
        ser indexable: necesita volumen de busqueda verificado (o razonablemente estimado), un
        minimo de contenido editorial unico, al menos un dato con fuente verificada y al menos un
        insight especifico de la entidad (no una plantilla con el nombre cambiado). Las paginas
        que no lo superan se sirven en <code>noindex</code> hasta que se completa el dato que les
        falta o se confirma su demanda de busqueda real en Google Search Console.
      </p>

      <h2>Limitaciones</h2>
      <p>
        Los datos marcados como &quot;estimacion&quot; son aproximaciones de mercado, no cifras
        oficiales cerradas. Los calculos de nuestras herramientas (hipoteca, comprar vs alquilar,
        reforma, mudanza, gastos de compra) son simplificaciones con fines informativos y no
        sustituyen el asesoramiento de un profesional cualificado para tu caso concreto.
      </p>
    </article>
  );
}
