import type { Metadata } from "next";
import type { PageQualityResult } from "@/types/data";

export const SITE_NAME = "Guia de Vivienda";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.guiadevivienda.example";

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string;
  quality: PageQualityResult;
  ogImage?: string;
}

/**
 * Construye el `Metadata` de una pagina programatica aplicando la regla de
 * indexacion: si `quality.indexable` es false, se fuerza `noindex,follow`
 * sin importar lo que pida la plantilla. Esto es lo que impide que una
 * pagina de baja calidad se cuele en el sitemap o en resultados de Google
 * mientras el motor de pSEO escala.
 */
export function buildProgrammaticMetadata({
  title,
  description,
  path,
  quality,
  ogImage,
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: quality.indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export function buildEditorialMetadata(title: string, description: string, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "article",
    },
  };
}

export function formatEur(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value) + "%";
}
