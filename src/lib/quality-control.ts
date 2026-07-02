import type { City, PageQualityResult, SearchVolumeTier } from "@/types/data";

/**
 * Puerta de control de calidad para paginas programaticas.
 *
 * Principio rector del proyecto: una pagina que no pasa este control no se
 * genera como indexable. Se sirve igualmente (para no romper URLs ya
 * compartidas o enlazadas), pero con `noindex,follow` hasta que:
 *   a) se confirme volumen de busqueda real, y
 *   b) se complete el dato/insight unico que le falta.
 *
 * Esto es deliberado: preferimos 100 paginas indexables que 10.000 con la
 * mitad `noindex`. El flag por defecto de cualquier pagina nueva es
 * `indexable: false` hasta pasar este chequeo.
 */

const MIN_UNIQUE_WORD_COUNT = 200;

const INDEXABLE_TIERS: SearchVolumeTier[] = ["alto", "medio"];

export interface QualityInput {
  /** Tier de volumen de busqueda de la entidad principal de la pagina. */
  searchVolumeTier: SearchVolumeTier;
  /** Texto editorial unico de la pagina (sin contar UI, nav, footer). */
  uniqueContent: string;
  /** Si la pagina expone al menos un dato verificado (SourcedValue). */
  hasVerifiedSource: boolean;
  /** Si el contenido incluye al menos un insight especifico de la entidad
   * (no una plantilla con el nombre intercambiado). */
  hasUniqueDatapoint: boolean;
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function evaluatePageQuality(input: QualityInput): PageQualityResult {
  const word_count = countWords(input.uniqueContent);
  const reasons: string[] = [];

  if (!INDEXABLE_TIERS.includes(input.searchVolumeTier)) {
    reasons.push(
      `Volumen de busqueda insuficiente o no verificado (tier: ${input.searchVolumeTier}).`
    );
  }
  if (word_count < MIN_UNIQUE_WORD_COUNT) {
    reasons.push(
      `Contenido unico por debajo del minimo (${word_count}/${MIN_UNIQUE_WORD_COUNT} palabras).`
    );
  }
  if (!input.hasVerifiedSource) {
    reasons.push("No expone ningun dato con fuente y fecha verificadas.");
  }
  if (!input.hasUniqueDatapoint) {
    reasons.push("No contiene ningun insight especifico de la entidad (posible plantilla vacia).");
  }

  return {
    indexable: reasons.length === 0,
    reasons,
    word_count,
    has_unique_datapoint: input.hasUniqueDatapoint,
    has_verified_source: input.hasVerifiedSource,
  };
}

/**
 * Atajo para paginas de ciudad: evalua a partir del registro `City` y del
 * texto editorial ya renderizado (introduccion + contexto local + FAQs).
 */
export function evaluateCityPageQuality(city: City, uniqueContent: string): PageQualityResult {
  return evaluatePageQuality({
    searchVolumeTier: city.search_volume_tier,
    uniqueContent,
    hasVerifiedSource: Boolean(city.price_per_sqm?.source),
    hasUniqueDatapoint: Boolean(city.local_context && city.local_context.length > 40),
  });
}

/**
 * Filtra un listado de entidades a las que deberian pasar a
 * `generateStaticParams()`, es decir, las que tienen tier indexable.
 * Esto es lo que evita el "generar todas las combinaciones matematicamente
 * posibles": si la entidad no tiene tier alto/medio verificado, ni siquiera
 * se construye su pagina estatica en esta fase de rollout.
 */
export function filterIndexableEntities<T extends { search_volume_tier: SearchVolumeTier }>(
  entities: T[]
): T[] {
  return entities.filter((e) => INDEXABLE_TIERS.includes(e.search_volume_tier));
}
