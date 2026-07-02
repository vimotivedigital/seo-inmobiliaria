import { getAllCities, getAllMudanzaRoutes, getCityBySlug, getReformaCostByCity, getPurchaseCostForCity } from "@/lib/data";
import { evaluateCityPageQuality, evaluatePageQuality } from "@/lib/quality-control";
import {
  buildComprarVsAlquilarContent,
  buildComprarVsAlquilarFaqs,
  buildCosteCompraContent,
  buildCosteCompraFaqs,
  buildReformaContent,
  buildReformaFaqs,
  buildCertificadoEnergeticoContent,
  buildCertificadoEnergeticoFaqs,
  buildMudanzaContent,
  buildMudanzaFaqs,
  combineUniqueContent,
} from "@/lib/content-builders";
import { SITE_URL } from "@/lib/seo";

export interface SitemapEntry {
  url: string;
  lastModified: string;
}

const STATIC_EDITORIAL_PATHS = [
  "/",
  "/hipotecas",
  "/comprar-vivienda",
  "/alquiler",
  "/reformas",
  "/gastos-vivienda",
  "/hipoteca-calculadora",
  "/metodologia",
  "/sobre-nosotros",
];

/**
 * Reconstruye, para cada entidad, exactamente el mismo contenido (intro +
 * FAQs) y el mismo gate de calidad que usa su plantilla de pagina (ver
 * src/lib/content-builders.ts) para decidir si su URL entra en el sitemap.
 * Una pagina en `noindex` (ver src/lib/quality-control.ts) NUNCA debe
 * aparecer aqui, aunque su ruta estatica exista (generateStaticParams la
 * sirve igualmente para no romper enlaces internos).
 */
export function getAllIndexableUrls(): SitemapEntry[] {
  const now = new Date().toISOString();
  const entries: SitemapEntry[] = STATIC_EDITORIAL_PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
  }));

  const cities = getAllCities();

  for (const city of cities) {
    const comprarVsAlquilarText = combineUniqueContent(buildComprarVsAlquilarContent(city), buildComprarVsAlquilarFaqs(city));
    if (evaluateCityPageQuality(city, comprarVsAlquilarText).indexable) {
      entries.push({ url: `${SITE_URL}/comprar-vs-alquilar/${city.slug}`, lastModified: city.price_per_sqm.last_updated });
    }

    const purchaseCosts = getPurchaseCostForCity(city.slug);
    if (purchaseCosts) {
      const text = combineUniqueContent(buildCosteCompraContent(city, purchaseCosts), buildCosteCompraFaqs(city, purchaseCosts));
      if (evaluateCityPageQuality(city, text).indexable) {
        entries.push({ url: `${SITE_URL}/coste-compra-vivienda/${city.slug}`, lastModified: purchaseCosts.last_updated });
      }
    }

    const reformaCost = getReformaCostByCity(city.slug);
    if (reformaCost) {
      const text = combineUniqueContent(buildReformaContent(city, reformaCost), buildReformaFaqs(city, reformaCost));
      if (evaluateCityPageQuality(city, text).indexable) {
        entries.push({ url: `${SITE_URL}/coste-reforma-m2/${city.slug}`, lastModified: reformaCost.low.last_updated });
      }
    }

    const certText = combineUniqueContent(buildCertificadoEnergeticoContent(city), buildCertificadoEnergeticoFaqs(city));
    if (evaluateCityPageQuality(city, certText).indexable) {
      entries.push({ url: `${SITE_URL}/certificado-energetico/${city.slug}`, lastModified: city.price_per_sqm.last_updated });
    }
  }

  for (const route of getAllMudanzaRoutes()) {
    const origin = getCityBySlug(route.origin_slug);
    const destination = getCityBySlug(route.destination_slug);
    if (!origin || !destination) continue;

    const text = combineUniqueContent(
      buildMudanzaContent(origin, destination, route),
      buildMudanzaFaqs(origin, destination, route)
    );
    const quality = evaluatePageQuality({
      searchVolumeTier: route.search_volume_tier,
      uniqueContent: text,
      hasVerifiedSource: Boolean(route.cost_medium.source),
      hasUniqueDatapoint: true,
    });
    if (quality.indexable) {
      entries.push({ url: `${SITE_URL}/coste-mudanza/${route.slug}`, lastModified: route.cost_medium.last_updated });
    }
  }

  return entries;
}
