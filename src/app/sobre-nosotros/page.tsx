import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CoverImage } from "@/components/seo/CoverImage";
import { buildEditorialMetadata } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Sobre nosotros",
  "Quienes hacemos Guia de Vivienda, con que criterio editorial trabajamos y como puedes contactarnos.",
  "/sobre-nosotros"
);

export default function SobreNosotrosPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Sobre nosotros", href: "/sobre-nosotros" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sobre nosotros</h1>

      <CoverImage src="/images/sobre-nosotros-loft.jpg" alt="Interior de un loft moderno" priority />

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Guia de Vivienda es un proyecto editorial independiente centrado en ayudar a quien
        compra, alquila o reforma una vivienda en Espana a tomar decisiones con datos, no con
        suposiciones. Publicamos calculadoras interactivas y guias basadas en fuentes publicas y
        medias de mercado, siempre indicando su procedencia (ver{" "}
        <Link href="/metodologia">metodologia</Link>).
      </p>

      <h2>Nuestro criterio editorial</h2>
      <ul>
        <li>Publicamos primero un nucleo reducido de contenido de alta calidad y lo ampliamos por lotes, solo cuando hay evidencia de demanda de busqueda real.</li>
        <li>Toda cifra financiera lleva fuente, fecha y nivel de confianza visibles en la propia pagina.</li>
        <li>Nuestras calculadoras muestran de donde salen los porcentajes y tipos que usan.</li>
        <li>No ofrecemos asesoramiento financiero, fiscal ni legal personalizado: nuestras herramientas son informativas.</li>
      </ul>

      <h2>Contacto</h2>
      <p>
        Para consultas sobre datos, correcciones o colaboraciones, escribe a{" "}
        <a href="mailto:contacto@guiadevivienda.example">contacto@guiadevivienda.example</a>.
      </p>
    </article>
  );
}
