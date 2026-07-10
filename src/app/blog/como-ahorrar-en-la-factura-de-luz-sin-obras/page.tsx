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

const SLUG = "como-ahorrar-en-la-factura-de-luz-sin-obras";

export const metadata: Metadata = (() => {
  const post = getBlogPostMeta(SLUG)!;
  return buildEditorialMetadata(post.title, post.metaDescription, `/blog/${SLUG}`);
})();

export default function AhorroEnergeticoPost() {
  const post = getBlogPostMeta(SLUG);
  const category = getAffiliateCategoryBySlug("ahorro-energetico");
  if (!post || !category) notFound();

  const termostato = category.products.find((p) => p.asin === "B07K49G5WY")!;
  const burlete = category.products.find((p) => p.asin === "B0DLB2Z1R3")!;
  const panel = category.products.find((p) => p.asin === "B0DS659BZ9")!;
  const enchufe = category.products.find((p) => p.asin === "B0872PFLJ5")!;
  const led = category.products.find((p) => p.asin === "B01KHIM7OG")!;

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
        No hace falta acometer una reforma de aislamiento completa para notar la diferencia en la
        factura. La mayoria de las perdidas de energia en una vivienda vienen de sitios muy
        concretos y muy baratos de arreglar. Este es el orden en el que nosotros lo abordariamos.
      </p>

      <h2>1. Deja de calentar la casa cuando no hay nadie</h2>
      <p>
        El cambio con mas impacto real suele ser el mas simple: no tener la calefaccion encendida
        a la misma temperatura todo el dia si no hay nadie en casa. Un termostato inteligente
        aprende tus horarios (o los programas tu mismo) y ajusta la temperatura automaticamente,
        en vez de depender de que alguien se acuerde de bajarla al salir.
      </p>

      <AmazonProductCard product={termostato} />

      <h2>2. Sella las rendijas de puertas y ventanas</h2>
      <p>
        Una puerta corredera o una ventana antigua sin sellar puede perder tanto calor como tener
        una ventana entreabierta todo el invierno. Un burlete autoadhesivo se instala en minutos,
        sin herramientas, y ataja una de las fugas de calor mas comunes en pisos con carpinteria
        antigua.
      </p>

      <AmazonProductCard product={burlete} />

      <h2>3. Pon un reflector detras del radiador</h2>
      <p>
        Si tu radiador esta en una pared exterior (la mas fria de la casa), buena parte del calor
        se va directamente a calentar la pared en vez de la habitacion. Un panel reflectante
        detras del radiador devuelve ese calor hacia dentro, especialmente notable en pisos sin
        aislamiento en fachada.
      </p>

      <AmazonProductCard product={panel} />

      <h2>4. Averigua que aparato dispara realmente tu factura</h2>
      <p>
        Antes de cambiar de tarifa o de compañia, merece la pena saber donde se va realmente el
        consumo. Un enchufe inteligente con medicion te dice cuanto gasta cada electrodomestico
        conectado, para que dejes de adivinar y empieces a apagar lo que de verdad importa.
      </p>

      <AmazonProductCard product={enchufe} />

      <h2>5. Cambia las bombillas que te queden por LED</h2>
      <p>
        Si todavia te queda alguna bombilla incandescente o halogena en casa, es el cambio mas
        barato y sencillo de toda esta lista: sin instalacion, sin electricista, con ahorro
        inmediato desde el primer dia.
      </p>

      <AmazonProductCard product={led} />

      <p>
        Para el resto de gastos fijos de ser propietario (IBI, comunidad, seguro de hogar),
        tenemos un repaso completo en{" "}
        <a href="/gastos-vivienda">gastos de vivienda en propiedad</a>.
      </p>

      <AmazonDisclosure />

      <FaqSection
        heading="Preguntas frecuentes"
        items={[
          {
            question: "¿Un termostato inteligente compensa en un piso de alquiler?",
            answer:
              "Depende del modelo: algunos termostatos inteligentes se instalan sin obra sobre el termostato existente y se pueden desmontar al mudarte, lo que los hace viables en alquiler; conviene comprobarlo antes de comprar si no eres el propietario.",
          },
          {
            question: "¿Los burletes sirven tambien para el ruido, no solo para el frio?",
            answer:
              "Si, al sellar la rendija por donde entra el aire tambien se reduce parte del ruido exterior que entra por ese mismo hueco, aunque su funcion principal es el aislamiento termico.",
          },
        ]}
      />

      <InternalLinks
        items={[
          { href: "/recomendados/ahorro-energetico", label: "Ver todos los productos de ahorro energetico" },
          { href: "/gastos-vivienda", label: "Gastos recurrentes de ser propietario" },
        ]}
      />
    </article>
  );
}
