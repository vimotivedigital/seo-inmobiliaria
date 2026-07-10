import { CalendarDays } from "lucide-react";
import { CoverImage } from "@/components/seo/CoverImage";
import { buildArticleJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/seo";
import type { BlogPostMeta } from "@/lib/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

/** Cabecera comun a todos los articulos del blog: titulo, categoria, fechas,
 * imagen de portada y el JSON-LD de tipo Article. */
export function BlogPostHeader({ post }: { post: BlogPostMeta }) {
  const jsonLd = buildArticleJsonLd({
    headline: post.title,
    description: post.metaDescription,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
  });

  return (
    <>
      <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
        {post.category}
      </span>
      <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{post.title}</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <CalendarDays size={14} />
        Publicado el {formatDate(post.publishedDate)}
        {post.updatedDate !== post.publishedDate && <> · actualizado el {formatDate(post.updatedDate)}</>}
      </p>

      <CoverImage src={post.coverImage} alt={post.coverImageAlt} priority />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
