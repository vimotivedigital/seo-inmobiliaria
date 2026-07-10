import affiliateCategoriesJson from "@data/afiliados-amazon.json";
import type { AffiliateCategory } from "@/types/affiliate";

/** Tag de Amazon Afiliados de este sitio. Se anexa a todos los enlaces de producto. */
export const AMAZON_ASSOCIATE_TAG = "tipofijo-21";

const categories = affiliateCategoriesJson as AffiliateCategory[];

export function getAllAffiliateCategories(): AffiliateCategory[] {
  return categories;
}

export function getAffiliateCategoryBySlug(slug: string): AffiliateCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Construye la URL de afiliado para un ASIN dado. */
export function buildAmazonProductUrl(asin: string): string {
  return `https://www.amazon.es/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ogi&th=1`;
}
