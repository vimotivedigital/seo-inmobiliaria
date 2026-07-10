export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  coverImage: string;
  coverImageAlt: string;
  publishedDate: string; // ISO
  updatedDate: string; // ISO
  category: string;
}

/**
 * Registro de metadatos del blog. El contenido de cada articulo vive en su
 * propia pagina (src/app/blog/{slug}/page.tsx), igual que los hubs
 * editoriales -- con solo 4 articulos no compensa montar un pipeline de
 * contenido generico (JSON/MDX) para esto. Este array es solo lo que
 * necesita el indice (/blog) para listar tarjetas sin importar cada pagina.
 */
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "antes-de-reformar-herramientas-basicas",
    title: "Antes de reformar: 5 herramientas que te ahorran llamadas al profesional",
    excerpt: "Que tener a mano antes de empezar cualquier reforma, por pequeña que sea, para no depender de un profesional para cada tarea menor.",
    metaDescription: "Herramientas basicas para reformar tu piso: medidor de humedad, detector de vigas, taladro y mas. Que comprar antes de empezar y por que.",
    coverImage: "/images/reformas-habitacion-vacia.jpg",
    coverImageAlt: "Habitacion vacia lista para reformar",
    publishedDate: "2026-06-15",
    updatedDate: "2026-06-15",
    category: "Reformas",
  },
  {
    slug: "checklist-mudanza-que-necesitas",
    title: "Checklist de mudanza: todo lo que necesitas antes de cerrar la ultima caja",
    excerpt: "La lista de material de embalaje que de verdad hace falta, para no acabar improvisando con bolsas de basura a mitad de mudanza.",
    metaDescription: "Checklist completo de material para tu mudanza: cajas, cinta, plastico de burbujas y mas. Que comprar antes del dia de la mudanza.",
    coverImage: "/images/galeria-cocina-abierta.jpg",
    coverImageAlt: "Salon y cocina abierta de un piso reformado",
    publishedDate: "2026-06-20",
    updatedDate: "2026-06-20",
    category: "Mudanzas",
  },
  {
    slug: "como-ahorrar-en-la-factura-de-luz-sin-obras",
    title: "7 formas de bajar la factura de la luz sin hacer obra",
    excerpt: "Cambios sencillos, sin reforma ni instalador, que atacan las perdidas de energia mas comunes en una vivienda.",
    metaDescription: "Como ahorrar en la factura de la luz y el gas sin obras: termostato inteligente, burletes, paneles reflectantes y mas trucos practicos.",
    coverImage: "/images/gastos-estudio-ciudad.jpg",
    coverImageAlt: "Estudio con vistas a la ciudad",
    publishedDate: "2026-06-25",
    updatedDate: "2026-06-25",
    category: "Gastos de vivienda",
  },
  {
    slug: "organizar-piso-alquiler-sin-taladrar",
    title: "Como organizar un piso de alquiler sin agujerear las paredes",
    excerpt: "Soluciones de almacenaje y organizacion que no dejan marca, para cuando el contrato de alquiler no te deja taladrar a tu gusto.",
    metaDescription: "Como organizar y decorar un piso de alquiler sin taladrar: percheros de puerta, canaletas adhesivas, cajas de almacenaje y mas.",
    coverImage: "/images/alquiler-salon-acogedor.jpg",
    coverImageAlt: "Salon y comedor acogedores de un piso de alquiler",
    publishedDate: "2026-06-30",
    updatedDate: "2026-06-30",
    category: "Alquiler",
  },
];

export function getAllBlogPosts(): BlogPostMeta[] {
  return [...BLOG_POSTS].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export function getBlogPostMeta(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
