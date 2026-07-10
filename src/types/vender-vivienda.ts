import type { SearchVolumeTier, SourcedValue } from "@/types/data";

/**
 * Localidad objetivo de la seccion de captacion de leads "vender vivienda".
 * A diferencia de `City` (data/cities.json, cubre las 5-6 grandes capitales
 * del resto del sitio), esto son municipios del Baix Llobregat Sud/Garraf
 * donde la agencia colaboradora opera. `search_volume_tier` aqui es una
 * estimacion heuristica (poblacion + notoriedad turistica/inmobiliaria de
 * cada municipio), NO un dato de Search Console/herramienta de keywords real
 * -- a diferencia del resto del dataset, el sitio todavia no tiene trafico
 * historico para esta seccion nueva. Debe revisarse con datos reales de
 * Search Console en cuanto haya al menos 3 meses de indexacion, y corregirse
 * si el tier asignado no se corresponde con el volumen real observado.
 */
export interface VenderViviendaLocalidad {
  slug: string;
  name: string;
  provincia: string;
  /** Comarca real (Baix Llobregat o Garraf) -- Sitges y Vilanova i la Geltru
   * son municipios colindantes del Garraf, no del Baix Llobregat en sentido
   * estricto; se mantienen en el dataset porque comparten mercado
   * inmobiliario y agencia colaboradora con el resto de la zona. */
  comarca: "Baix Llobregat" | "Garraf";
  ccaa: string;
  /** Poblacion aproximada (padron), sin fuente individual citada -- mismo
   * nivel de rigor que `City.population` en data/cities.json. */
  population: number;
  /** Precio medio de venta EUR/m2, con fuente y fecha verificables. */
  price_per_sqm: SourcedValue;
  search_volume_tier: SearchVolumeTier;
  /** 2-3 factores especificos de la localidad que afectan a la venta
   * (proximidad a Barcelona/aeropuerto, zona de playa, tipo de comprador
   * dominante, etc.) -- nunca una frase generica con el nombre cambiado. */
  local_factors: string[];
  /** Parrafo de contexto editorial especifico de la localidad, usado igual
   * que `City.local_context` para pasar el gate de `hasUniqueDatapoint`. */
  local_context: string;
}
