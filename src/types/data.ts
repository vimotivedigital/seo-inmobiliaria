/**
 * Modelo de datos central. Cada dato con relevancia financiera lleva
 * procedencia verificable: valor, fuente, fecha de actualizacion y nivel
 * de confianza. Nunca se muestra un numero en una pagina indexable sin
 * estos campos disponibles para render en el SourceBox.
 *
 * Principio: cada dato debe poder responder "¿de donde sale exactamente
 * esta cifra y cuando se actualizo?" con una URL concreta. Si no existe una
 * fuente oficial/semi-oficial verificable para un dato, se queda como
 * `confidence: "estimado"` y debe llevar `fuentes` (2-3 citas concretas con
 * URL y fecha de consulta) y una `nota` visible explicando por que no hay
 * una fuente unica oficial -- nunca un `source: "sector"` generico.
 */

export type Confidence = "real" | "estimado";

/** Volumen de busqueda estimado para una entidad (ciudad, ruta, etc). */
export type SearchVolumeTier = "alto" | "medio" | "bajo" | "sin_datos";

/** Una cita concreta usada para construir un dato sin fuente oficial unica. */
export interface SourceCitation {
  /** Nombre del comparador/informe consultado (p.ej. "HelpMyCash"). */
  nombre: string;
  source_url: string;
  /** Fecha (ISO) en la que se consulto esta fuente. */
  consultado: string;
}

/** Un dato individual con procedencia. */
export interface SourcedValue<T = number> {
  value: T;
  /** Resumen legible de la fuente (nombre de la institucion/informe/norma). */
  source: string;
  /** URL exacta a la fuente, cuando existe una fuente oficial/semi-oficial citable. */
  source_url?: string;
  last_updated: string; // ISO date
  confidence: Confidence;
  /**
   * Cuando no existe una fuente oficial unica (diferencial bancario medio,
   * coste de reforma/mudanza), aqui van las 2-3 fuentes privadas realmente
   * consultadas para construir el rango, cada una con URL y fecha de
   * consulta. `source` sigue siendo el resumen; `fuentes` es el detalle
   * verificable.
   */
  fuentes?: SourceCitation[];
  /** Aviso visible en el SourceBox explicando la naturaleza del dato estimado. */
  nota?: string;
  /** Fecha (ISO) en la que este dato deberia revisarse manualmente de nuevo. */
  next_review_due?: string;
}

export interface City {
  slug: string;
  name: string;
  province: string;
  ccaa: string;
  population: number;
  /** Precio medio de venta EUR/m2. Se ensambla en runtime desde data/precio-m2.json. */
  price_per_sqm: SourcedValue;
  /** Precio medio de alquiler EUR/m2/mes */
  rent_per_sqm: SourcedValue;
  /** Variacion interanual del precio de venta, en % */
  price_yoy_change: SourcedValue;
  /**
   * Tier de volumen de busqueda para las keywords programaticas de esta
   * ciudad ("comprar vivienda en {ciudad}", "hipoteca {ciudad}", etc).
   * Se rellena a partir de keyword research real (Search Console /
   * herramienta de KW), nunca se asume.
   */
  search_volume_tier: SearchVolumeTier;
  /** Contexto editorial especifico de la ciudad, no generico. */
  local_context: string;
}

/**
 * Forma cruda de /data/cities.json: todo `City` menos los campos que ahora
 * viven en /data/precio-m2.json (para no duplicar el mismo numero en dos
 * sitios y arriesgar que diverjan). `getAllCities()`/`getCityBySlug()` en
 * src/lib/data.ts ensamblan el `City` completo a partir de ambos ficheros.
 */
export type CityRecord = Omit<City, "price_per_sqm">;

/** Entrada de /data/precio-m2.json: precio de venta por m2, con recordatorio de revision. */
export interface PrecioM2Entry {
  city_slug: string;
  price_per_sqm: SourcedValue;
}

export interface MortgageRateSnapshot {
  /** Euribor a 12 meses, en %. Fuente oficial (Banco de Espana). */
  euribor_12m: SourcedValue;
  /** Tipo medio de oferta fija a 20-30 años, en %. Sin fuente oficial unica. */
  avg_fixed_rate: SourcedValue;
  /** Tipo medio de oferta variable (euribor + diferencial medio), en %. Sin fuente oficial unica. */
  avg_variable_rate: SourcedValue;
  /** LTV medio concedido para primera vivienda, en %. Estimacion sectorial. */
  avg_ltv: SourcedValue;
}

export interface ReformaCost {
  city_slug: string;
  /** EUR/m2 */
  low: SourcedValue;
  medium: SourcedValue;
  high: SourcedValue;
  /**
   * Rango de presupuesto TOTAL (no por m2) para un proyecto de reforma
   * tipico en esta ciudad, cuando la fuente lo publica desglosado por
   * ciudad (a diferencia de low/medium/high, que son una referencia
   * nacional). Opcional: no todas las ciudades tienen este dato.
   */
  total_project_range?: SourcedValue<{ low: number; high: number }>;
}

export interface MudanzaRoute {
  slug: string; // origen-destino
  origin_slug: string;
  destination_slug: string;
  distance_km: number;
  /** Coste EUR para una mudanza de piso de tamano medio (~80m2) */
  cost_small: SourcedValue; // <40m2 / estudio
  cost_medium: SourcedValue; // 60-100m2
  cost_large: SourcedValue; // >100m2
  search_volume_tier: SearchVolumeTier;
}

/** Un tramo de una escala progresiva: se aplica `porcentaje` a la parte de
 * la base imponible entre el limite del tramo anterior y `hasta`.
 * `hasta: null` marca el ultimo tramo (sin limite superior). */
export interface ItpBracket {
  hasta: number | null;
  porcentaje: number;
}

/** Tipo reducido de ITP para un colectivo especifico (jovenes, familia
 * numerosa, VPO...), documentado con sus condiciones de acceso. */
export interface ItpReduccion {
  colectivo: string;
  porcentaje: number;
  condiciones: string;
}

interface CcaaPurchaseCostBase {
  ccaa: string;
  /** AJD (Actos Juridicos Documentados) general de la CCAA, en % */
  ajd_general: number;
  reducciones: ItpReduccion[];
  /** Nombre de la hacienda autonomica / norma que regula el tipo. */
  source: string;
  /** URL a la web oficial de tributos de esa CCAA (nunca un agregador privado). */
  source_url: string;
  last_updated: string;
  confidence: Confidence;
  notes?: string;
}

/**
 * ITP para vivienda de segunda mano por CCAA. No existe una tabla oficial
 * agregada: cada CCAA regula su propio tipo, y varias aplican una escala
 * progresiva por tramos de valor en vez de un tipo fijo (p.ej. Cataluna
 * desde 2025). El campo `tipo` obliga a modelar cada caso explicitamente en
 * vez de asumir un porcentaje plano para todas.
 *
 * Los territorios forales (Pais Vasco, Navarra) se rigen por su Concierto/
 * Convenio Economico, no por el regimen comun -- se marcan con
 * `tipo: "foral"` y no deben tratarse como una CCAA de regimen comun mas.
 */
export type CcaaPurchaseCost =
  | (CcaaPurchaseCostBase & { tipo: "fijo"; tramos: [ItpBracket] })
  | (CcaaPurchaseCostBase & { tipo: "progresivo"; tramos: ItpBracket[] })
  | (CcaaPurchaseCostBase & {
      tipo: "foral";
      regimen: "concierto_economico" | "convenio_economico";
      tramos: ItpBracket[];
    });

/**
 * Flag de control de calidad por pagina programatica. Se calcula en build
 * time (ver src/lib/quality-control.ts) y determina si la pagina se sirve
 * indexable o con `noindex`.
 */
export interface PageQualityResult {
  indexable: boolean;
  reasons: string[];
  word_count: number;
  has_unique_datapoint: boolean;
  has_verified_source: boolean;
}
