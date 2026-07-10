import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { AmazonDisclosure } from "@/components/affiliate/AmazonDisclosure";
import { AmazonProductCard } from "@/components/affiliate/AmazonProductCard";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { FaqSection } from "@/components/seo/FaqSection";
import { getBlogPostMeta } from "@/lib/blog";
import { getAffiliateCategoryBySlug } from "@/lib/amazon";
import { buildEditorialMetadata } from "@/lib/seo";

const SLUG = "antes-de-reformar-herramientas-basicas";

export const metadata: Metadata = (() => {
  const post = getBlogPostMeta(SLUG)!;
  return buildEditorialMetadata(post.title, post.metaDescription, `/blog/${SLUG}`);
})();

export default function AntesDeReformarPost() {
  const post = getBlogPostMeta(SLUG);
  const category = getAffiliateCategoryBySlug("reformas-bricolaje");
  if (!post || !category) notFound();

  const humedad = category.products.find((p) => p.asin === "B07Q5TFB74")!;
  const vigas = category.products.find((p) => p.asin === "B003IQJULS")!;
  const caja = category.products.find((p) => p.asin === "B07V3TD5Q7")!;

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${SLUG}` },
        ]}
      />

      <BlogPostHeader post={post} />

      <p className="text-lg text-slate-600 dark:text-slate-300">
        Antes de reformar cualquier cosa en casa, desde repintar una habitacion hasta colgar
        una estanteria, hay una tentacion muy comun: llamar a un profesional para cada tarea
        pequeña. Tiene sentido para lo grande (fontaneria, electricidad, estructura), pero para
        lo pequeño te puede salir mucho mas caro en tiempo y dinero que resolverlo tu mismo con
        las herramientas adecuadas. Esto es lo que recomendamos tener antes de empezar.
      </p>

      <h2>1. Un medidor de humedad, antes de pintar nada</h2>
      <p>
        Este es el error mas caro y mas comun: pintar sobre una pared con humedad oculta. El
        resultado son manchas que vuelven a los pocos meses y pintura que se levanta, y para
        entonces ya has gastado el material y el fin de semana. Un medidor de humedad digital
        (se apoya sobre la pared o la madera y da una lectura en segundos) te dice si esa mancha
        sospechosa es solo estetica o si hay un problema de fondo que hay que resolver antes de
        maquillarlo con pintura.
      </p>

      <AmazonProductCard product={humedad} />

      <h2>2. Un detector de vigas y cables, antes de taladrar</h2>
      <p>
        Colgar una estanteria pesada o un mueble de pared sin saber que hay detras de la pared es
        jugar a la loteria: puede que aciertes en un hueco vacio y el anclaje no aguante nada, o
        peor, que taladres justo donde pasa un cable. Un detector de vigas y metales es barato y
        evita ambos problemas -- lo pasas por la pared y te avisa donde hay un montante solido o
        un cable antes de perforar.
      </p>

      <AmazonProductCard product={vigas} />

      <h2>3. Un kit de herramientas completo, no herramientas sueltas</h2>
      <p>
        Comprar cada destornillador, llave y broca por separado segun te va haciendo falta es la
        forma mas cara de acabar con un cajon lleno de herramientas de mala calidad. Un kit
        basico completo (habitualmente entre 100 y 200 piezas) cubre el 90% de los arreglos
        domesticos con una sola compra, y suele incluir una caja organizadora que evita que acabes
        buscando el destornillador de estrella por toda la casa.
      </p>

      <AmazonProductCard product={caja} />

      <p>
        Con estas tres cosas resueltas -- saber si una pared tiene humedad, saber que hay detras
        antes de taladrar, y tener las herramientas basicas a mano -- ya puedes encargarte tu
        mismo de la mayoria de tareas pequeñas de una reforma. Para lo que sí requiere un
        profesional (fontaneria, electricidad, estructura), calcula antes el presupuesto
        aproximado en nuestra{" "}
        <a href="/reformas">guia de coste de reforma por m2</a>.
      </p>

      <AmazonDisclosure />

      <FaqSection
        heading="Preguntas frecuentes"
        items={[
          {
            question: "¿Necesito un medidor de humedad si no veo ninguna mancha?",
            answer:
              "Si vas a pintar una pared exterior o una zona cercana a un baño o cocina, merece la pena comprobarlo aunque no haya mancha visible: la humedad suele notarse en la pintura antes de verse a simple vista en la pared.",
          },
          {
            question: "¿Sirve un detector de vigas en paredes de ladrillo o solo en tabiques de pladur?",
            answer:
              "Funciona en ambos, aunque la deteccion de montantes metalicos es mas fiable en tabiques de pladur; en paredes de ladrillo macizo su utilidad principal es detectar cableado antes de taladrar.",
          },
        ]}
      />

      <InternalLinks
        items={[
          { href: "/recomendados/reformas-bricolaje", label: "Ver todo el kit de reforma recomendado" },
          { href: "/reformas", label: "Calculadora de coste de reforma por m2" },
        ]}
      />
    </article>
  );
}
