import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildEditorialMetadata } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Aviso legal",
  "Condiciones de uso, titularidad del sitio y limitacion de responsabilidad de TipoFijo.",
  "/aviso-legal"
);

export default function AvisoLegalPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Aviso legal", href: "/aviso-legal" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Aviso legal</h1>

      <h2>Naturaleza informativa del contenido</h2>
      <p>
        Todo el contenido de TipoFijo, incluidas sus calculadoras, tiene una finalidad
        exclusivamente informativa. No constituye asesoramiento financiero, fiscal, legal ni
        inmobiliario, ni una recomendacion de compra, venta, alquiler o contratacion de ningun
        producto financiero. Antes de tomar decisiones con impacto economico, consulta con un
        profesional cualificado.
      </p>

      <h2>Exactitud de los datos</h2>
      <p>
        Empleamos fuentes publicas y estimaciones sectoriales, indicando su procedencia y fecha
        de actualizacion en cada pagina (ver <a href="/metodologia">metodologia</a>). No
        garantizamos que los datos reflejen con exactitud la situacion de un inmueble o
        transaccion concretos.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, calculos y diseño de este sitio son propiedad de TipoFijo salvo
        indicacion contraria. Queda prohibida su reproduccion total o parcial sin autorizacion.
      </p>
    </article>
  );
}
