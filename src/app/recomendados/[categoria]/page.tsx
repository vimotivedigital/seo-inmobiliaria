import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AmazonDisclosure } from "@/components/affiliate/AmazonDisclosure";
import { AmazonProductCard } from "@/components/affiliate/AmazonProductCard";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { getAllAffiliateCategories, getAffiliateCategoryBySlug } from "@/lib/amazon";
import { buildEditorialMetadata } from "@/lib/seo";

const RELATED_BLOG_POST: Record<string, { href: string; label: string }> = {
  "reformas-bricolaje": {
    href: "/blog/antes-de-reformar-herramientas-basicas",
    label: "Leer: 5 herramientas que te ahorran llamadas al profesional",
  },
  mudanza: {
    href: "/blog/checklist-mudanza-que-necesitas",
    label: "Leer: checklist de mudanza, todo lo que necesitas",
  },
  "ahorro-energetico": {
    href: "/blog/como-ahorrar-en-la-factura-de-luz-sin-obras",
    label: "Leer: 7 formas de bajar la factura de la luz sin hacer obra",
  },
  "organizacion-hogar": {
    href: "/blog/organizar-piso-alquiler-sin-taladrar",
    label: "Leer: como organizar un piso de alquiler sin agujerear las paredes",
  },
};

interface Params {
  params: { categoria: string };
}

export function generateStaticParams() {
  return getAllAffiliateCategories().map((c) => ({ categoria: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const category = getAffiliateCategoryBySlug(params.categoria);
  if (!category) return {};

  return buildEditorialMetadata(
    `${category.title}: productos recomendados`,
    category.shortDescription,
    `/recomendados/${category.slug}`
  );
}

export default function RecomendadosCategoriaPage({ params }: Params) {
  const category = getAffiliateCategoryBySlug(params.categoria);
  if (!category) notFound();
  const relatedPost = RELATED_BLOG_POST[category.slug];

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Inicio", href: "/" },
          { name: "Recomendados", href: "/recomendados" },
          { name: category.title, href: `/recomendados/${category.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{category.title}</h1>

      <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{category.intro}</p>

      <AmazonDisclosure />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.products.map((product) => (
          <AmazonProductCard key={product.asin} product={product} />
        ))}
      </div>

      {relatedPost && <InternalLinks items={[relatedPost]} />}
    </div>
  );
}
