import Link from "next/link";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/seo";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = buildBreadcrumbJsonLd(items.map((i) => ({ name: i.name, url: `${SITE_URL}${i.href}` })));
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {i === items.length - 1 ? (
              <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-brand-700 dark:hover:text-brand-400">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
