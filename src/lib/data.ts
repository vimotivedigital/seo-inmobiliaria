import citiesJson from "@data/cities.json";
import precioM2Json from "@data/precio-m2.json";
import tiposInteresJson from "@data/tipos-interes.json";
import mortgageRatesJson from "@data/mortgage-rates.json";
import reformaCostsJson from "@data/reforma-costs.json";
import mudanzaRoutesJson from "@data/mudanza-routes.json";
import purchaseCostsJson from "@data/purchase-costs-ccaa.json";
import ivaViviendaNuevaJson from "@data/iva-vivienda-nueva.json";
import type {
  City,
  CityRecord,
  PrecioM2Entry,
  MortgageRateSnapshot,
  ReformaCost,
  MudanzaRoute,
  CcaaPurchaseCost,
  SourcedValue,
} from "@/types/data";

/**
 * Capa de acceso a datos. Hoy lee de JSON versionado en /data; el mismo
 * contrato permite sustituir estas funciones por llamadas a SQLite/Turso
 * sin tocar las paginas que las consumen.
 *
 * El precio por m2 y el euribor viven en su propio fichero (precio-m2.json,
 * tipos-interes.json) separados de cities.json/mortgage-rates.json para no
 * duplicar el mismo numero en dos sitios y arriesgar que diverjan. Las
 * funciones de esta capa ensamblan el objeto completo en runtime, asi que
 * las paginas que consumen `City`/`MortgageRateSnapshot` no notan el cambio.
 */

const cityRecords = citiesJson as CityRecord[];
const precioM2Entries = precioM2Json as PrecioM2Entry[];
const reformaCosts = reformaCostsJson as ReformaCost[];
const mudanzaRoutes = mudanzaRoutesJson as MudanzaRoute[];
const purchaseCosts = purchaseCostsJson as CcaaPurchaseCost[];

function assembleCity(record: CityRecord): City {
  const precio = precioM2Entries.find((p) => p.city_slug === record.slug);
  if (!precio) {
    throw new Error(
      `Falta precio_per_sqm para "${record.slug}" en data/precio-m2.json. ` +
        "Cada ciudad de data/cities.json debe tener su entrada correspondiente."
    );
  }
  return { ...record, price_per_sqm: precio.price_per_sqm };
}

const cities: City[] = cityRecords.map(assembleCity);

export function getAllCities(): City[] {
  return cities;
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getMortgageRates(): MortgageRateSnapshot {
  const tiposInteres = tiposInteresJson as { euribor_12m: SourcedValue };
  const composite = mortgageRatesJson as Omit<MortgageRateSnapshot, "euribor_12m">;
  return {
    euribor_12m: tiposInteres.euribor_12m,
    ...composite,
  };
}

export function getReformaCostByCity(citySlug: string): ReformaCost | undefined {
  return reformaCosts.find((r) => r.city_slug === citySlug);
}

export function getAllMudanzaRoutes(): MudanzaRoute[] {
  return mudanzaRoutes;
}

export function getMudanzaRouteBySlug(slug: string): MudanzaRoute | undefined {
  return mudanzaRoutes.find((r) => r.slug === slug);
}

export function getPurchaseCostByCcaa(ccaa: string): CcaaPurchaseCost | undefined {
  return purchaseCosts.find((p) => p.ccaa === ccaa);
}

export function getPurchaseCostForCity(citySlug: string): CcaaPurchaseCost | undefined {
  const city = getCityBySlug(citySlug);
  if (!city) return undefined;
  return getPurchaseCostByCcaa(city.ccaa);
}

/** IVA nacional para vivienda de obra nueva (tipo unico, no varia por CCAA). */
export function getIvaViviendaNueva(): SourcedValue {
  return (ivaViviendaNuevaJson as { general: SourcedValue }).general;
}
