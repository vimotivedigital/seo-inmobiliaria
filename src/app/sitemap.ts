import type { MetadataRoute } from "next";
import { getAllIndexableUrls } from "@/lib/sitemap-entries";

/**
 * Sitemaps segmentados: cada archivo tiene como maximo MAX_URLS_PER_SITEMAP
 * URLs (muy por debajo del limite de 50.000 de la spec de sitemaps, y del
 * <5.000 que pedimos para indexacion progresiva por lotes). Hoy con ~25
 * URLs esto genera un unico segmento; al escalar a miles de ciudades,
 * `generateSitemaps` devolvera tantos ids como lotes de 5.000 URLs existan,
 * y Google puede rastrear cada lote de forma independiente y progresiva.
 */
const MAX_URLS_PER_SITEMAP = 5000;

export async function generateSitemaps() {
  const totalUrls = getAllIndexableUrls().length;
  const segmentCount = Math.max(1, Math.ceil(totalUrls / MAX_URLS_PER_SITEMAP));
  return Array.from({ length: segmentCount }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const all = getAllIndexableUrls();
  const start = id * MAX_URLS_PER_SITEMAP;
  const chunk = all.slice(start, start + MAX_URLS_PER_SITEMAP);

  return chunk.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
  }));
}
