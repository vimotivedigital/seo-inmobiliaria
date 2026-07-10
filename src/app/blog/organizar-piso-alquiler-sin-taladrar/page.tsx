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

const SLUG = "organizar-piso-alquiler-sin-taladrar";

export const metadata: Metadata = (() => {
  const post = getBlogPostMeta(SLUG)!;
  return buildEditorialMetadata(post.title, post.metaDescription, `/blog/${SLUG}`);
})();

export default function OrganizarAlquilerPost() {
  const post = getBlogPostMeta(SLUG);
  const category = getAffiliateCategoryBySlug("organizacion-hogar");
  if (!post || !category) notFound();

  const perchero = category.products.find((p) => p.asin === "B01N1M8XY5")!;
  const canaletas = category.products.find((p) => p.asin === "B07FFN2HN6")!;
  const cajas = category.products.find((p) => p.asin === "B0D7HCR5PB")!;
  const kit = category.products.find((p) => p.asin === "B07MWT2GL7")!;

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
        Muchos contratos de alquiler prohiben o limitan taladrar las paredes, y aunque el tuyo lo
        permita, nadie quiere dejar quince agujeros quando se muda. La buena noticia es que se
        puede organizar un piso entero sin tocar un taladro, con soluciones pensadas
        precisamente para eso.
      </p>

      <h2>Percheros de puerta en vez de percheros de pared</h2>
      <p>
        Para el recibidor, el baño o la parte de atras de la puerta del dormitorio, un perchero
        que se cuelga del marco de la puerta (sin ningun tornillo) cumple la misma funcion que uno
        atornillado a la pared, y se quita en un segundo cuando te mudes sin dejar marca.
      </p>

      <AmazonProductCard product={perchero} />

      <h2>Canaletas adhesivas para los cables</h2>
      <p>
        El salon recien amueblado con la tele, el router y las regletas a la vista deja de parecer
        nuevo en cuanto se ve el nido de cables por el suelo. Las canaletas adhesivas se pegan a
        la pared o al rodapie sin taladrar y ocultan el cableado en cuestion de minutos.
      </p>

      <AmazonProductCard product={canaletas} />

      <h2>Cajas apilables en vez de estanterias fijas</h2>
      <p>
        Si el armario o el trastero se te queda pequeño, antes de pensar en instalar estanterias
        fijas prueba con cajas de almacenaje apilables: aprovechan la altura igual que una
        estanteria, pero no necesitan ni un solo anclaje a la pared y se pliegan cuando no las
        usas.
      </p>

      <AmazonProductCard product={cajas} />

      <h2>Un kit de herramientas basico, para lo que si hace falta montar</h2>
      <p>
        Aunque no vayas a taladrar paredes, seguro que montas algun mueble de embalaje plano al
        mudarte. Un kit compacto de herramientas basicas cubre eso sin que tengas que comprar un
        maletin completo para un par de tornillos.
      </p>

      <AmazonProductCard product={kit} />

      <p>
        Si todavia estas decidiendo si te compensa mas alquilar o comprar en tu ciudad, tenemos
        una calculadora con tus propios numeros en{" "}
        <a href="/alquiler">nuestra guia de alquiler</a>.
      </p>

      <AmazonDisclosure />

      <FaqSection
        heading="Preguntas frecuentes"
        items={[
          {
            question: "¿Los percheros de puerta aguantan abrigos pesados?",
            answer:
              "Los modelos de acero cromado con varios ganchos suelen soportar varios kilos por gancho, suficiente para abrigos y bolsos; evita colgar objetos muy pesados en un solo gancho para no forzar el mecanismo de sujecion a la puerta.",
          },
          {
            question: "¿Puedo pedir permiso al casero para taladrar solo unos puntos?",
            answer:
              "Si, muchos propietarios aceptan un numero limitado de agujeros pequeños si se lo pides por escrito antes de hacerlo; queda documentado y evitas descuentos de la fianza al final del contrato.",
          },
        ]}
      />

      <InternalLinks
        items={[
          { href: "/recomendados/organizacion-hogar", label: "Ver todos los productos de organizacion" },
          { href: "/alquiler", label: "Guia de alquiler de vivienda" },
        ]}
      />
    </article>
  );
}
