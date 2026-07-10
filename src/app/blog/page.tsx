import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Newspaper, CalendarDays } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog";
import { buildEditorialMetadata } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Blog: guias practicas sobre reformas, mudanzas y ahorro en casa",
  "Guias practicas y consejos concretos sobre reformar, mudarte, ahorrar en casa y organizar tu piso, con productos recomendados en cada tema.",
  "/blog"
);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Newspaper size={20} />
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog</h1>
      </div>

      <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        Guias practicas sobre reformar, mudarte, ahorrar en casa y organizar tu piso -- con
        recomendaciones concretas de producto en cada tema, no listas genericas.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
                {post.category}
              </span>
              <h2 className="mt-1 font-semibold text-slate-900 dark:text-white">{post.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <CalendarDays size={13} />
                {formatDate(post.publishedDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
