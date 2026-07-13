import Image from "next/image";
import { ExternalLink, Package } from "lucide-react";
import { buildAmazonProductUrl } from "@/lib/amazon";
import type { AffiliateProduct } from "@/types/affiliate";

/**
 * Tarjeta de producto de afiliado. El enlace lleva
 * rel="sponsored nofollow noopener" (recomendacion de Google para enlaces
 * pagados/de afiliado) y abre en pestana nueva.
 */
export function AmazonProductCard({ product }: { product: AffiliateProduct }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {product.image ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 320px, 45vw"
            className="object-contain p-2"
          />
        </div>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
          <Package size={20} />
        </span>
      )}
      <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{product.name}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">{product.description}</p>
      <a
        href={buildAmazonProductUrl(product.asin)}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Ver precio en Amazon
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
