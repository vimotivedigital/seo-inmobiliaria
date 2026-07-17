import type { City, CcaaPurchaseCost, ReformaCost, MudanzaRoute, SourcedValue } from "@/types/data";
import type { VenderViviendaLocalidad } from "@/types/vender-vivienda";
import type { FaqItem } from "@/lib/jsonld";
import { formatEur, formatPercent } from "@/lib/seo";
import { computeEffectiveRate, computeMarginalRate, computeProgressiveTaxAmount } from "@/lib/tax-brackets";

/** Vivienda de referencia usada para ilustrar tipos/importes en el texto (80 m2 al precio medio de la ciudad). */
const REFERENCE_SQM = 80;

/**
 * Adapta un `CcaaPurchaseCost` (que tiene una unica fuente a nivel de
 * registro, no por campo) a la forma que espera `SourceBox`. `value` no se
 * usa para render (SourceBox solo muestra source/source_url/fecha/nota),
 * pero se rellena con el tipo general para dejar el objeto autoexplicativo.
 */
export function ccaaCostToSourcedValue(costs: CcaaPurchaseCost): SourcedValue {
  return {
    value: costs.tipo === "fijo" ? costs.tramos[0].porcentaje : NaN,
    source: costs.source,
    source_url: costs.source_url,
    last_updated: costs.last_updated,
    confidence: costs.confidence,
    nota: costs.notes,
  };
}

/**
 * Generadores del contenido editorial unico de cada plantilla programatica
 * (parrafo introductorio + FAQs). Viven aqui (y no duplicados dentro de
 * cada `page.tsx`) porque el mismo texto se usa dos veces: para renderizar
 * la pagina y para evaluar su calidad/indexabilidad en
 * src/lib/sitemap-entries.ts. Si divergieran, el sitemap podria incluir una
 * URL cuya pagina real ya no pasa el control de calidad, o al reves.
 *
 * El texto de las FAQ cuenta como contenido unico igual que la intro: es
 * lo que evita que una pagina con una intro corta pero respuestas ricas en
 * datos especificos de la entidad se marque erroneamente como plantilla
 * vacia.
 */

export function combineUniqueContent(intro: string, faqs: FaqItem[]): string {
  return [intro, ...faqs.map((f) => f.answer)].join(" ");
}

export function buildComprarVsAlquilarContent(city: City): string {
  return `Comprar vivienda en ${city.name} tiene un precio medio de ${formatEur(city.price_per_sqm.value)} por metro cuadrado, con una variacion interanual del ${formatPercent(city.price_yoy_change.value)}. ${city.local_context} Antes de decidir si comprar o seguir alquilando en ${city.name}, calcula tu propio punto de equilibrio con los datos reales de tu situacion: precio de la vivienda que valoras, entrada disponible y alquiler equivalente en la zona. La decision no depende solo del precio por m2, sino de cuanto tiempo planeas quedarte, de tu capacidad de ahorro mensual y del tipo de interes al que puedas acceder en tu hipoteca. En general, cuanto mas tiempo permanezcas en la vivienda, mas se diluyen los gastos fijos de la compra (impuestos, notaria, registro) frente al coste acumulado de seguir pagando alquiler.`;
}

export function buildComprarVsAlquilarFaqs(city: City): FaqItem[] {
  return [
    {
      question: `¿Es mas caro comprar que alquilar en ${city.name} ahora mismo?`,
      answer: `Con un precio medio de ${formatEur(city.price_per_sqm.value)}/m2 y un alquiler medio de ${formatEur(city.rent_per_sqm.value)}/m2 al mes en ${city.name}, la respuesta depende del horizonte temporal: usa la calculadora de esta pagina para ver a partir de que año comprar sale a cuenta con tus propios numeros.`,
    },
    {
      question: `¿Como ha evolucionado el precio de la vivienda en ${city.name}?`,
      answer: `El precio medio en ${city.name} ha variado un ${formatPercent(city.price_yoy_change.value)} en el ultimo año segun datos de mercado (ver fuente en la caja "Sobre estos datos" de esta pagina). ${city.local_context}`,
    },
  ];
}

/** Descripcion en prosa de la estructura del ITP (fijo/progresivo/foral) para una vivienda de referencia. */
function describeItpStructure(city: City, purchaseCosts: CcaaPurchaseCost, referenceValue: number): string {
  if (purchaseCosts.tipo === "fijo") {
    return `un tipo fijo del ${formatPercent(purchaseCosts.tramos[0].porcentaje)}, sea cual sea el valor de la vivienda`;
  }
  const effectiveRate = computeEffectiveRate(referenceValue, purchaseCosts.tramos);
  const marginalRate = computeMarginalRate(referenceValue, purchaseCosts.tramos);
  const foralNote = purchaseCosts.tipo === "foral" ? " (territorio foral, con normativa propia)" : "";
  return `una escala progresiva por tramos de valor${foralNote}, no un tipo unico: para una vivienda de ${formatEur(referenceValue, 0)} en ${city.name} (${REFERENCE_SQM} m2 al precio medio de la ciudad), el tramo marginal aplicable es del ${formatPercent(marginalRate)} y el tipo efectivo medio resultante sobre el total ronda el ${effectiveRate.toFixed(1)}%`;
}

export function buildCosteCompraContent(city: City, purchaseCosts: CcaaPurchaseCost): string {
  const referenceValue = city.price_per_sqm.value * REFERENCE_SQM;
  const structureNote = describeItpStructure(city, purchaseCosts, referenceValue);

  return `Comprar vivienda de segunda mano en ${city.name} tributa por ITP segun ${structureNote} vigente en ${city.ccaa}. Con un precio medio de ${formatEur(city.price_per_sqm.value)} por metro cuadrado en ${city.name}, este impuesto suele ser la partida mas grande dentro de los gastos de compra, por delante de notaria, registro y gestoria (a lo que se suma un AJD general del ${formatPercent(purchaseCosts.ajd_general)} en operaciones sujetas a este impuesto). A diferencia de otras webs que aplican un porcentaje generico a nivel nacional, aqui usamos la normativa especifica de ${city.ccaa}, que puede diferir sustancialmente de otras comunidades autonomas -- e incluso dentro de la misma comunidad, el tipo aplicable puede variar segun el tramo de valor de la vivienda o si perteneces a algun colectivo con tipo reducido. Calcula el desglose completo de tu operacion con el precio real de la vivienda que estas valorando en ${city.name}.`;
}

export function buildCosteCompraFaqs(city: City, purchaseCosts: CcaaPurchaseCost): FaqItem[] {
  const referenceValue = city.price_per_sqm.value * REFERENCE_SQM;
  const itpAmount = computeProgressiveTaxAmount(referenceValue, purchaseCosts.tramos);
  const estimatedNotaryRegistryGestoria = referenceValue * 0.015; // estimacion, ver notaria/registro/gestoria en la calculadora
  const totalCosts = itpAmount + estimatedNotaryRegistryGestoria;
  const primeraReduccion = purchaseCosts.reducciones[0];

  const faqs: FaqItem[] = [
    {
      question: `¿Cuanto es el ITP en ${city.name}?`,
      answer:
        purchaseCosts.tipo === "fijo"
          ? `El tipo general de ITP para vivienda de segunda mano en ${city.ccaa} es fijo, del ${formatPercent(purchaseCosts.tramos[0].porcentaje)}, independientemente del valor de la vivienda. ${purchaseCosts.notes ?? ""}`.trim()
          : `${city.ccaa} aplica una escala progresiva: ${purchaseCosts.tramos
              .map((t, i) => {
                const from = i === 0 ? 0 : purchaseCosts.tramos[i - 1]?.hasta;
                return t.hasta === null
                  ? `desde ${formatEur(from ?? 0, 0)} en adelante, ${formatPercent(t.porcentaje)}`
                  : `hasta ${formatEur(t.hasta, 0)}, ${formatPercent(t.porcentaje)}`;
              })
              .join("; ")}. ${purchaseCosts.notes ?? ""}`.trim(),
    },
    {
      question: "¿El ITP se paga sobre el precio de escritura o sobre el valor de referencia catastral?",
      answer:
        "Se paga sobre el mayor de los dos: el precio pactado en la escritura o el valor de referencia que publica el Catastro, para evitar declarar un precio artificialmente bajo.",
    },
    {
      question: `¿Cuanto suman en total los gastos de comprar una vivienda de ${formatEur(referenceValue, 0)} en ${city.name}?`,
      answer: `Para una vivienda de unos ${REFERENCE_SQM} m2 al precio medio de ${city.name} (${formatEur(referenceValue, 0)}), el ITP resultante en ${city.ccaa} es de aproximadamente ${formatEur(itpAmount, 0)}. Sumando notaria, registro y gestoria (en torno a otro 1,5% adicional, ${formatEur(estimatedNotaryRegistryGestoria, 0)}), el total de gastos ronda los ${formatEur(totalCosts, 0)}, al margen de la entrada.`,
    },
  ];

  if (primeraReduccion) {
    faqs.push({
      question: `¿Existen tipos reducidos de ITP en ${city.ccaa}?`,
      answer: `Si. Por ejemplo, ${primeraReduccion.colectivo.toLowerCase()} puede acceder a un tipo del ${formatPercent(primeraReduccion.porcentaje)} en lugar del general: ${primeraReduccion.condiciones} Consulta con la hacienda autonomica si cumples los requisitos antes de dar por hecho el tipo general.`,
    });
  }

  return faqs;
}

export function buildReformaContent(city: City, cost: ReformaCost): string {
  const totalProjectNote = cost.total_project_range
    ? ` Para ${city.name} en concreto, Habitissimo publica ademas un presupuesto total tipico de reforma integral de entre ${formatEur(cost.total_project_range.value.low, 0)} y ${formatEur(cost.total_project_range.value.high, 0)} para un piso completo, un dato especifico de esta ciudad y no solo una extrapolacion del precio nacional por m2.`
    : ` Para ${city.name} no tenemos un desglose de presupuesto total especifico de la ciudad, asi que la referencia por m2 de esta pagina es la nacional.`;

  return `Reformar un piso en Espana cuesta entre ${formatEur(cost.low.value)}/m2 en una reforma basica y ${formatEur(cost.high.value)}/m2 en una reforma integral con materiales de gama alta, segun datos de presupuestos reales agregados por Habitissimo (referencia nacional, no especifica de ${city.name}).${totalProjectNote} Antes de pedir presupuestos a empresas de reforma en ${city.name}, usa el calculo por m2 de esta pagina como punto de partida para negociar y detectar presupuestos fuera de mercado, tanto por exceso como por defecto. Ten en cuenta ademas que el coste por m2 no suele ser lineal: baños y cocinas (con fontaneria, azulejado e instalaciones) cuestan bastante mas por metro cuadrado que salones o dormitorios, por lo que dos pisos del mismo tamano pueden tener presupuestos muy distintos segun cuantas estancias humedas incluyan.`;
}

export function buildReformaFaqs(city: City, cost: ReformaCost): FaqItem[] {
  const faqs: FaqItem[] = [
    {
      question: `¿Cuanto cuesta una reforma integral de un piso de 80m2 en ${city.name}?`,
      answer: cost.total_project_range
        ? `Segun el presupuesto total especifico que Habitissimo recoge para ${city.name}, una reforma integral completa cuesta entre ${formatEur(cost.total_project_range.value.low, 0)} y ${formatEur(cost.total_project_range.value.high, 0)}. Aplicando en cambio la referencia nacional por m2 (${formatEur(cost.high.value)}/m2) a un piso de 80m2 saldrian unos ${formatEur(cost.high.value * 80, 0)}, un rango similar.`
        : `Con la referencia nacional de ${formatEur(cost.high.value)}/m2 usada en esta pagina, una reforma integral de 80m2 rondaria los ${formatEur(cost.high.value * 80, 0)}, sin contar imprevistos ni mobiliario. No tenemos un desglose de presupuesto especifico para ${city.name}, por lo que esta cifra es una extrapolacion de la media nacional, no un dato propio de la ciudad.`,
    },
    {
      question: `¿Que incluye una reforma basica frente a una media?`,
      answer: `La reforma basica (desde ${formatEur(cost.low.value)}/m2, referencia nacional) cubre pintura, suelos y un bano funcional sin tocar instalaciones; la media (${formatEur(cost.medium.value)}/m2) anade cocina completa y actualizacion de electricidad.`,
    },
    {
      question: `¿Por que varia tanto el precio de una reforma segun la empresa?`,
      answer: `El rango entre ${formatEur(cost.low.value)}/m2 y ${formatEur(cost.high.value)}/m2 refleja sobre todo la calidad de los materiales y si la empresa subcontrata gremios sueltos o tiene equipo propio. Pide siempre un desglose por partidas (demolicion, instalaciones, alicatado, pintura) para comparar presupuestos de forma justa, no solo el total.`,
    },
  ];

  return faqs;
}

export function buildCertificadoEnergeticoContent(city: City): string {
  return `El certificado de eficiencia energetica es obligatorio para vender o alquilar cualquier vivienda en ${city.name}, y su gestion corresponde a un tecnico competente registrado en ${city.ccaa}. Con un precio medio de ${formatEur(city.price_per_sqm.value)} por metro cuadrado en ${city.name}, una calificacion energetica baja (E, F o G) puede traducirse en un descuento apreciable en la negociacion, ya que el comprador asumira un gasto energetico recurrente mayor durante años. Usa el estimador de esta pagina para ver el impacto aproximado en la factura anual segun la etiqueta del inmueble que estas valorando en ${city.name}. El proceso de obtencion es sencillo: el tecnico visita la vivienda, mide sus caracteristicas constructivas (aislamiento, carpinterias, sistema de climatizacion) y emite el certificado, que despues debe registrarse en el organismo competente de ${city.ccaa} para tener validez legal.`;
}

export function buildCertificadoEnergeticoFaqs(city: City): FaqItem[] {
  return [
    {
      question: "¿Quien paga el certificado energetico, el comprador o el vendedor?",
      answer: `En ${city.name}, como en el resto de Espana, el vendedor o arrendador debe encargarlo y tenerlo disponible antes de publicar el anuncio de venta o alquiler.`,
    },
    {
      question: "¿Cuanto tiempo es valido un certificado energetico?",
      answer:
        "Diez años desde su registro, salvo que se realicen reformas que cambien sustancialmente la eficiencia energetica de la vivienda.",
    },
    {
      question: `¿Que factores influyen mas en la calificacion energetica de un piso en ${city.name}?`,
      answer: `El aislamiento termico de fachada y ventanas, la antiguedad de la caldera o sistema de calefaccion, y la orientacion son los factores con mayor peso. En el parque de vivienda mas antiguo de ${city.name}, es habitual encontrar calificaciones E o F que pueden mejorarse notablemente con una reforma de aislamiento sin tocar la estructura.`,
    },
  ];
}

export function buildMudanzaContent(origin: City, destination: City, route: MudanzaRoute): string {
  return `Una mudanza de ${origin.name} a ${destination.name} recorre unos ${route.distance_km} km, lo que situa el coste medio para un piso de tamano estandar (60-100 m2) en torno a ${formatEur(route.cost_medium.value)}. El precio final depende del volumen de mobiliario, si hay que desmontar y montar armarios, si el origen o el destino tienen dificil acceso (piso sin ascensor, calle estrecha) y de la epoca del año: los fines de semana y los meses de verano suelen tener mayor demanda y precios ligeramente superiores. Para una mudanza de larga distancia como esta, la mayoria de empresas cobran un cargo fijo por el desplazamiento del camion mas un variable por volumen, por lo que suele compensar pedir presupuesto a 3 o 4 empresas distintas y comparar tanto el precio total como que es lo que incluye cada uno (embalaje, seguro, desmontaje).`;
}

export function buildMudanzaFaqs(origin: City, destination: City, route: MudanzaRoute): FaqItem[] {
  return [
    {
      question: `¿Cuanto se tarda en hacer la mudanza de ${origin.name} a ${destination.name}?`,
      answer: `Para los ${route.distance_km} km de distancia, la mayoria de empresas completan la mudanza en el mismo dia o, como maximo, al dia siguiente si el volumen es grande y requiere dos viajes.`,
    },
    {
      question: "¿El presupuesto de mudanza incluye el desmontaje de muebles?",
      answer:
        "Depende de la empresa: algunas lo incluyen de serie para armarios y camas, otras lo cobran aparte. Confirmalo siempre antes de aceptar un presupuesto cerrado.",
    },
    {
      question: `¿Merece la pena contratar un seguro para la mudanza de ${origin.name} a ${destination.name}?`,
      answer: `En un trayecto de ${route.distance_km} km con transporte por carretera, el riesgo de dano es bajo pero no nulo, especialmente en electrodomesticos y mobiliario voluminoso. La mayoria de empresas ofrecen una cobertura basica incluida y un seguro ampliado opcional; si mudas objetos de alto valor (arte, electronica profesional), suele compensar contratarlo.`,
    },
  ];
}

export function buildVenderViviendaContent(localidad: VenderViviendaLocalidad): string {
  return `Vender una vivienda en ${localidad.name} parte de un precio medio de mercado de ${formatEur(localidad.price_per_sqm.value)} por metro cuadrado. ${localidad.local_context} A la hora de fijar el precio de salida, lo mas habitual es partir de una valoracion basada en comparables reales de la zona (no solo en el precio medio del municipio, que puede variar mucho segun el barrio o la tipologia de vivienda) y ajustarla despues por el estado de conservacion, la orientacion y la planta del inmueble. El resto de esta pagina explica el proceso paso a paso y te permite solicitar una valoracion gratuita y sin compromiso.`;
}

export function buildVenderViviendaFaqs(localidad: VenderViviendaLocalidad): FaqItem[] {
  const [primerFactor, segundoFactor] = localidad.local_factors;
  return [
    {
      question: `¿Cuanto vale mi vivienda en ${localidad.name}?`,
      answer: `El precio medio de venta en ${localidad.name} ronda los ${formatEur(localidad.price_per_sqm.value)} por metro cuadrado (ver fuente y fecha en la caja "Sobre estos datos" de esta pagina), pero el valor real de tu vivienda concreta depende del barrio, la planta, el estado de conservacion y la orientacion. Solicita una valoracion gratuita con el formulario de esta pagina para tener una cifra ajustada a tu inmueble, no solo a la media del municipio.`,
    },
    {
      question: `¿Que hace diferente al mercado de ${localidad.name} frente a otros municipios cercanos?`,
      answer: `${primerFactor ?? ""} ${segundoFactor ?? ""}`.trim(),
    },
    {
      question: "¿Tiene algun coste solicitar la valoracion?",
      answer:
        "No. La valoracion inicial es gratuita y sin compromiso: un agente de la inmobiliaria colaboradora se pone en contacto contigo para concretar los detalles antes de proponer ningun encargo de venta.",
    },
  ];
}
