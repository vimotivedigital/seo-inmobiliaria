import { getAllCities, getAllMudanzaRoutes, getCityBySlug, getReformaCostByCity, getPurchaseCostForCity } from "../src/lib/data";
import { evaluateCityPageQuality, evaluatePageQuality } from "../src/lib/quality-control";
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
} from "../src/lib/content-builders";

/**
 * Informe de control de calidad e indexacion, pensado para correrse antes
 * de cada despliegue (`npm run qc:report`). Enumera, para cada pagina
 * programatica generada, si quedaria `index` o `noindex` y por que -- asi
 * se puede revisar de un vistazo el estado del rollout progresivo sin
 * tener que inspeccionar el HTML generado pagina a pagina.
 */

let indexableCount = 0;
let noindexCount = 0;

function report(path: string, quality: { indexable: boolean; reasons: string[] }) {
  if (quality.indexable) {
    indexableCount++;
    console.log(`[INDEX]   ${path}`);
  } else {
    noindexCount++;
    console.log(`[NOINDEX] ${path} -- ${quality.reasons.join(" | ")}`);
  }
}

const cities = getAllCities();

for (const city of cities) {
  report(
    `/comprar-vs-alquilar/${city.slug}`,
    evaluateCityPageQuality(city, combineUniqueContent(buildComprarVsAlquilarContent(city), buildComprarVsAlquilarFaqs(city)))
  );

  const purchaseCosts = getPurchaseCostForCity(city.slug);
  if (purchaseCosts) {
    report(
      `/coste-compra-vivienda/${city.slug}`,
      evaluateCityPageQuality(city, combineUniqueContent(buildCosteCompraContent(city, purchaseCosts), buildCosteCompraFaqs(city, purchaseCosts)))
    );
  }

  const reformaCost = getReformaCostByCity(city.slug);
  if (reformaCost) {
    report(
      `/coste-reforma-m2/${city.slug}`,
      evaluateCityPageQuality(city, combineUniqueContent(buildReformaContent(city, reformaCost), buildReformaFaqs(city, reformaCost)))
    );
  }

  report(
    `/certificado-energetico/${city.slug}`,
    evaluateCityPageQuality(city, combineUniqueContent(buildCertificadoEnergeticoContent(city), buildCertificadoEnergeticoFaqs(city)))
  );
}

for (const route of getAllMudanzaRoutes()) {
  const origin = getCityBySlug(route.origin_slug);
  const destination = getCityBySlug(route.destination_slug);
  if (!origin || !destination) continue;

  const quality = evaluatePageQuality({
    searchVolumeTier: route.search_volume_tier,
    uniqueContent: combineUniqueContent(buildMudanzaContent(origin, destination, route), buildMudanzaFaqs(origin, destination, route)),
    hasVerifiedSource: Boolean(route.cost_medium.source),
    hasUniqueDatapoint: true,
  });
  report(`/coste-mudanza/${route.slug}`, quality);
}

console.log(`\nTotal: ${indexableCount} indexables, ${noindexCount} en noindex.`);
