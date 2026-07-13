/**
 * Modelo de datos para la seccion de recomendados (afiliados de Amazon).
 * A diferencia del resto de /data, esto no son cifras financieras con
 * fuente/fecha/confianza -- son productos reales enlazados por ASIN, con
 * el enlace de afiliado construido en runtime (ver src/lib/amazon.ts).
 */
export interface AffiliateProduct {
  /** ASIN real de Amazon (10 caracteres), verificado antes de publicar. */
  asin: string;
  name: string;
  description: string;
  /** Ruta en /public a la foto de producto (real, no de stock). Opcional:
   * si falta, la tarjeta cae de nuevo al icono generico. */
  image?: string;
}

export interface AffiliateCategory {
  slug: string;
  title: string;
  /** Descripcion corta para la tarjeta de categoria en /recomendados. */
  shortDescription: string;
  /** Parrafo editorial de introduccion para la pagina de la categoria. */
  intro: string;
  products: AffiliateProduct[];
}
