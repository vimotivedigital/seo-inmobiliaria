export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage JSON-LD. Las respuestas deben venir ya redactadas con datos
 * especificos de la entidad (ciudad, ruta, etc) desde la pagina que llama
 * a esta funcion -- este helper no genera texto, solo serializa.
 */
export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Service JSON-LD para las paginas de "vender vivienda". Se usa `Service`
 * (no `LocalBusiness`) porque TipoFijo no es el negocio que presta el
 * servicio de venta en si -- es el intermediario que deriva el lead a la
 * agencia colaboradora nombrada en `provider`.
 */
export function buildServiceJsonLd(args: {
  name: string;
  description: string;
  url: string;
  areaServed: string;
  providerName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Venta de vivienda",
    name: args.name,
    description: args.description,
    url: args.url,
    areaServed: { "@type": "Place", name: args.areaServed },
    provider: { "@type": "RealEstateAgent", name: args.providerName },
  };
}

export function buildArticleJsonLd(args: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    url: args.url,
    datePublished: args.datePublished,
    dateModified: args.dateModified,
    author: {
      "@type": "Organization",
      name: "TipoFijo",
    },
  };
}
