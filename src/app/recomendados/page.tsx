import Link from "next/link";
import type { Metadata } from "next";
import { Hammer, Truck, Zap, Boxes, ShoppingBag } from "lucide-react";
import { getAllAffiliateCategories } from "@/lib/amazon";
import { buildEditorialMetadata } from "@/lib/seo";
import { AmazonDisclosure } from "@/components/affiliate/AmazonDisclosure";

const CATEGORY_ICONS: Record<string, typeof Hammer> = {
  "reformas-bricolaje": Hammer,
  mudanza: Truck,
  "ahorro-energetico": Zap,
  "organizacion-hogar": Boxes,
};

export const metadata: Metadata = buildEditorialMetadata(
  "Recomendados: productos utiles para tu casa",
  "Herramientas de bricolaje, material de mudanza, ahorro energetico y organizacion del hogar, seleccionados para cada etapa de comprar, alquilar o reformar una vivienda.",
  "/recomendados"
);

export default function RecomendadosPage() {
  const categories = getAllAffiliateCategories();

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
          <ShoppingBag size={20} />
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Recomendados para tu casa
        </h1>
      </div>

      <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        Selecciones de productos concretos para cada etapa: reformar, mudarte, ahorrar en
        suministros u organizar tu nuevo piso. Nada de listas genericas -- solo lo que
        realmente usarias en cada situacion.
      </p>

      <AmazonDisclosure />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug] ?? ShoppingBag;
          return (
            <Link
              key={category.slug}
              href={`/recomendados/${category.slug}`}
              className="group rounded-lg border border-slate-200 p-5 transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-slate-700 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-400">
                  <Icon size={20} />
                </span>
                <h2 className="font-semibold text-slate-900 dark:text-white">{category.title}</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{category.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
