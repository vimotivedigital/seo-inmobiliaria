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

const SLUG = "checklist-mudanza-que-necesitas";

export const metadata: Metadata = (() => {
  const post = getBlogPostMeta(SLUG)!;
  return buildEditorialMetadata(post.title, post.metaDescription, `/blog/${SLUG}`);
})();

export default function ChecklistMudanzaPost() {
  const post = getBlogPostMeta(SLUG);
  const category = getAffiliateCategoryBySlug("mudanza");
  if (!post || !category) notFound();

  const cajas = category.products.find((p) => p.asin === "B0BDF5JCWF")!;
  const cinta = category.products.find((p) => p.asin === "B000WL2YOC")!;
  const burbujas = category.products.find((p) => p.asin === "B0BVRXBC7M")!;
  const correas = category.products.find((p) => p.asin === "B06X6D5G2P")!;

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
        La parte mas cara de una mudanza mal planificada no suele ser el transporte, sino los
        objetos rotos y el tiempo perdido improvisando con lo que hay en casa. Con material de
        embalaje adecuado (y comprado con antelacion, no la noche antes) la diferencia se nota
        desde la primera caja.
      </p>

      <h2>Cajas de verdad, no las que sobran del super</h2>
      <p>
        Las cajas de fruta o de electrodomesticos que guardas &ldquo;por si acaso&rdquo; no estan pensadas
        para apilarse ni para cargar peso de forma segura, y suelen ceder a mitad de mudanza.
        Unas cajas de mudanza reforzadas, en un tamaño manejable, aguantan el peso sin combarse y
        se apilan sin aplastarse entre ellas.
      </p>

      <AmazonProductCard product={cajas} />

      <h2>Un dispensador de cinta, no un rollo suelto</h2>
      <p>
        Parece un detalle menor hasta que llevas cerradas quince cajas a mano y se te han acabado
        las uñas. Un dispensador con cuchilla incorporada corta la cinta de un movimiento y hace
        que cerrar cada caja sea cuestion de segundos, no de pelearte con el rollo.
      </p>

      <AmazonProductCard product={cinta} />

      <h2>Plastico de burbujas para lo fragil (todo lo fragil)</h2>
      <p>
        Vajilla, cristaleria, marcos con cristal, pantallas... todo lo que se rompe si se golpea
        necesita una capa de proteccion antes de ir a la caja. Es la partida que menos cuesta y la
        que mas dinero (y disgustos) ahorra si algo se golpea durante el transporte.
      </p>

      <AmazonProductCard product={burbujas} />

      <h2>Correas de carga para lo pesado</h2>
      <p>
        Mover un sofa, un armario o una lavadora entre dos personas sin ayuda suele acabar mal
        para la espalda de alguien. Unas correas de elevacion reparten el peso entre los dos
        porteadores y hacen que cargar muebles grandes sea mucho mas seguro (y menos agotador).
      </p>

      <AmazonProductCard product={correas} />

      <p>
        Si todavia no tienes claro cuanto te va a costar el transporte en si, calcula un rango
        realista con nuestra{" "}
        <a href="/coste-mudanza/madrid-barcelona">calculadora de coste de mudanza</a>{" "}
        segun la ruta y el tamaño de tu piso.
      </p>

      <AmazonDisclosure />

      <FaqSection
        heading="Preguntas frecuentes"
        items={[
          {
            question: "¿Cuantas cajas necesito para un piso de una habitacion?",
            answer:
              "Como referencia orientativa, un piso pequeño (estudio o una habitacion) suele necesitar entre 15 y 25 cajas de tamaño mediano, ademas de las que uses para libros o objetos pesados en formato mas pequeño.",
          },
          {
            question: "¿Merece la pena contratar empresa de mudanza o hacerlo por mi cuenta?",
            answer:
              "Depende del volumen y de si tienes ayuda disponible: para un piso pequeño con ayuda de amigos y una furgoneta alquilada puede compensar hacerlo tu mismo; para pisos grandes o mudanzas de larga distancia, una empresa suele salir a cuenta por el tiempo y el riesgo que te ahorras.",
          },
        ]}
      />

      <InternalLinks
        items={[
          { href: "/recomendados/mudanza", label: "Ver todo el material de mudanza recomendado" },
          { href: "/coste-mudanza/madrid-barcelona", label: "Calculadora de coste de mudanza" },
        ]}
      />
    </article>
  );
}
