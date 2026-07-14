# TipoFijo — pSEO inmobiliario (YMYL)

Base de una web de programmatic SEO en el nicho de vivienda (Espana),
construida priorizando calidad y E-E-A-T sobre volumen de paginas. Ver el
principio rector completo en [`src/app/metodologia/page.tsx`](src/app/metodologia/page.tsx).

## Stack

- Next.js 14 (App Router) + TypeScript, SSG con ISR selectivo (`revalidate`)
- TailwindCSS (+ `@tailwindcss/typography`)
- Datos en JSON versionado bajo `/data` (sustituible por SQLite/Turso sin
  tocar las paginas, ver `src/lib/data.ts`)
- Sitemap segmentado (`generateSitemaps`) y `robots.ts` generados desde el
  mismo gate de calidad que las paginas

## Arranque

```bash
npm install
npm run dev        # http://localhost:3000
npm run build       # build de produccion (genera todas las paginas estaticas)
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run qc:report   # audita que paginas quedarian index/noindex y por que
```

Copia `.env.example` a `.env.local` y rellena `NEXT_PUBLIC_SITE_URL` (y,
cuando toque activar anuncios, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`).

## Estructura

```
data/
  cities.json                 Entidad ciudad: slug, ccaa, rent_per_sqm,
                              price_yoy_change, search_volume_tier,
                              local_context. price_per_sqm NO vive aqui
                              (ver precio-m2.json) para no duplicar el dato.
  precio-m2.json              Precio de venta €/m2 por ciudad (Fotocasa),
                              con next_review_due para revision trimestral.
  tipos-interes.json          Euribor 12m (Banco de España, oficial) +
                              diferencial hipotecario y rango de tipo fijo
                              (comparadores privados, marcados estimado).
  mortgage-rates.json         avg_fixed_rate/avg_variable_rate/avg_ltv,
                              compuestos a partir de tipos-interes.json.
  purchase-costs-ccaa.json    ITP/AJD por CCAA: tipo fijo o progresivo por
                              tramos, reducciones, fuente oficial por CCAA.
  iva-vivienda-nueva.json     IVA nacional obra nueva (Ley 37/1992, unico
                              para toda España, no varia por CCAA).
  reforma-costs.json          Coste de reforma €/m2 (Habitissimo, nacional)
                              + presupuesto total real por ciudad si existe.
  mudanza-routes.json         Coste de mudanza por ruta (Sirelo, estimado).
  vender-vivienda-localidades.json  7 municipios del Baix Llobregat Sud/Garraf
                              para la seccion de leads: precio €/m2 (Fotocasa,
                              real), search_volume_tier heuristico (ver
                              seccion propia mas abajo), local_factors.
src/types/data.ts             Modelo de datos: SourcedValue (con source_url/
                              fuentes/nota/next_review_due opcionales),
                              CcaaPurchaseCost (discriminated union fijo/
                              progresivo/foral), PageQualityResult.
src/lib/
  data.ts                     Capa de acceso a datos (hoy JSON, migrable a DB).
                              Ensambla City y MortgageRateSnapshot a partir de
                              varios ficheros en runtime (ver mas abajo).
  tax-brackets.ts              Calculo de ITP por tramos progresivos (marginal,
                              como el IRPF): cuota, tipo efectivo, tipo marginal.
  quality-control.ts          Gate de calidad/indexacion (ver mas abajo).
  content-builders.ts         Genera el contenido editorial unico (intro +
                              FAQ) por entidad; una sola fuente de verdad
                              usada tanto por las paginas como por el sitemap.
  sitemap-entries.ts           Recalcula el mismo gate de calidad para decidir
                              que URLs entran en el sitemap.
  seo.ts / jsonld.ts           Metadata dinamica, JSON-LD (FAQPage, Breadcrumb).
src/components/
  calculators/                5 calculadoras interactivas, client-side.
  seo/                        SourceBox (E-E-A-T, con enlace a source_url y
                              citas multiples), Disclaimer, FAQ, enlaces internos.
  ads/                        AdSlot (carga diferida + gated por consentimiento),
                              CookieConsent (CMP minimo, Consent Mode v2).
src/app/
  hipotecas|comprar-vivienda|alquiler|reformas|gastos-vivienda/   Hubs editoriales.
  hipoteca-calculadora/        Unica URL indexable de la calculadora de hipoteca.
  comprar-vs-alquilar|coste-compra-vivienda|coste-reforma-m2|
  certificado-energetico/[ciudad]/   Plantillas programaticas por ciudad.
  coste-mudanza/[ruta]/        Plantilla programatica por ruta origen-destino.
  vender-vivienda/[localidad]/  Captacion de leads (ver seccion propia mas abajo).
  api/leads/vender-vivienda/    Route handler: valida, envia por Resend, audita.
  sitemap.ts, robots.ts        Segmentados y derivados del gate de calidad.
scripts/
  quality-report.ts           `npm run qc:report`: lista index/noindex y el motivo.
  update-euribor.ts           `npm run data:euribor`: descarga el CSV mensual
                              oficial del Banco de España y actualiza el euribor.
  check-stale-data.ts         `npm run data:check-stale`: lista campos con
                              `next_review_due` vencido en todo /data.
docs/ADSENSE_GDPR_CHECKLIST.md Checklist antes de activar anuncios.
```

## Control de calidad e indexacion progresiva

Cada pagina programatica pasa `evaluatePageQuality()` /
`evaluateCityPageQuality()` (`src/lib/quality-control.ts`) antes de que su
`Metadata.robots` se decida (`src/lib/seo.ts#buildProgrammaticMetadata`). El
gate exige, para que una pagina sea `index`:

1. `search_volume_tier` de la entidad en `alto` o `medio` (viene del dato en
   `/data`, se rellena con keyword research real, nunca se asume).
2. Al menos ~200 palabras de contenido editorial **unico** (intro + FAQ
   especificas de la entidad, no plantilla con el nombre cambiado).
3. Al menos un dato con fuente y fecha verificadas.
4. Al menos un insight especifico de la entidad (no generico).

Si falla cualquiera, la pagina se sirve igualmente (no rompe enlaces
internos ni da 404) pero con `noindex, follow`. El mismo calculo alimenta
`sitemap.ts`, asi que una URL en `noindex` nunca aparece en el sitemap.

`npm run qc:report` imprime el resultado para todas las entidades del
dataset actual — utilizalo antes de cada despliegue para verificar que el
lote de ciudades/rutas que esperas publicar realmente pasa el control.

Con el dataset de ejemplo incluido (6 ciudades, 4 rutas de mudanza):
23 paginas quedan `index`, 4 quedan `noindex` (Teruel por `search_volume_tier:
"sin_datos"`, y la ruta Sevilla-Malaga por tier `"bajo"`) — demostrando el
gate en ambos sentidos.

## Calculadoras (sin URLs combinatorias)

Las 5 calculadoras (`src/components/calculators/`) son herramientas
client-side. Ninguna genera una ruta nueva por combinacion de parametros:
viven en una URL fija (p. ej. `/hipoteca-calculadora`) o dentro de la
pagina de la entidad correspondiente (`/coste-reforma-m2/madrid`). Esto es
deliberado: evita el patron `/hipoteca/{pais}/{importe}/{interes}/{años}`
que generaria miles de paginas casi-duplicadas de bajo valor.

## Estado real de los datos, por bloque

Principio: cada dato debe poder responder "¿de donde sale exactamente esta
cifra y cuando se actualizo?" con una URL concreta. Cuando no existe una
fuente oficial unica, el dato se queda `confidence: "estimado"` con `fuentes`
(2-3 citas con URL y fecha de consulta) y una `nota` visible en el SourceBox
explicando por que. Ver `npm run qc:report` para el detalle pagina a pagina.

| Bloque | Confidence | Fuente | Notas |
|---|---|---|---|
| Euribor 12m (`tipos-interes.json`) | **real** | Banco de España, Boletín Estadístico cap. 19 (tabla mensual `be1901.csv`) | `npm run data:euribor` lo refresca desde el CSV oficial en cada ejecucion. |
| Diferencial hipotecario / tipo fijo (`tipos-interes.json`, `mortgage-rates.json`) | estimado | HelpMyCash, Rastreator (mejores ofertas publicadas, no una media estadistica) | No existe fuente oficial de un diferencial/tipo "medio"; se documenta como rango de mejores ofertas, no de mercado. |
| LTV medio (`mortgage-rates.json`) | estimado | Sin fuente citable concreta | Pendiente: no se encontro ningun comparador que publique una media de LTV verificable. |
| Precio venta €/m2 (`precio-m2.json`) | **real** (5 ciudades) / estimado (Teruel) | Fotocasa - Índice Inmobiliario, por ciudad | Teruel queda `estimado` porque la propia fuente advierte que no tiene datos suficientes para esa ciudad -- coherente con su `search_volume_tier: "sin_datos"`. |
| ITP/AJD por CCAA (`purchase-costs-ccaa.json`) | **real** (Madrid, Cataluña, Andalucía, Aragón) / real con hueco documentado (C. Valenciana) | Hacienda/Agencia Tributaria de cada CCAA (URL oficial propia, no agregadores) | Valencia: el tipo general (9%/11%, Ley 5/2025) esta confirmado por multiples fuentes cruzadas, pero no se pudo renderizar el articulado exacto del BOE para verificar el detalle fino de las reducciones -- ver `notes` en el JSON. |
| IVA vivienda nueva (`iva-vivienda-nueva.json`) | **real** | Ley 37/1992 del IVA, art. 91 (nacional, no varia por CCAA) | |
| Coste de reforma (`reforma-costs.json`) | estimado | Habitissimo - informe de precios (nacional, no desglosado por ciudad) | Se aplica el mismo rango nacional a las 5 ciudades; 3 de ellas (Madrid, Barcelona, Valencia) tienen ademas un `total_project_range` real y especifico de la ciudad que la fuente si publica. |
| Coste de mudanza (`mudanza-routes.json`) | estimado | Sirelo - comparador de mudanzas (rangos por distancia y por volumen) | Los valores por ruta son una interpolacion propia dentro de los rangos publicados (Sirelo no cruza distancia x volumen); documentado en la `nota` de cada campo. |

### CCAA pendientes de verificar

Solo se ha verificado el ITP/AJD de las 5 CCAA con ciudades en el dataset
actual (Comunidad de Madrid, Cataluña, Comunidad Valenciana, Andalucía,
Aragón). Antes de anadir ciudades de otras comunidades:

- **Resto de CCAA de regimen comun** (Galicia, Castilla y León, Castilla-La
  Mancha, Extremadura, Murcia, Cantabria, La Rioja, Asturias, Baleares,
  Canarias): sin verificar. Asturias en particular tiene tramos 8/9/10% (no
  un tipo fijo) -- no asumir un porcentaje plano al anadirla.
- **País Vasco y Navarra (territorios forales)**: se rigen por Concierto
  Económico / Convenio Económico, con normativa y tipos propios de cada
  Diputación Foral (País Vasco) o de Navarra, **no** por el regimen comun.
  No usar el mismo esquema `tipo: "fijo"/"progresivo"` sin revisar antes su
  normativa foral especifica.

## Pendiente antes de produccion real

- Verificar el hueco documentado en el ITP de la Comunidad Valenciana (ver
  tabla de arriba) contra el texto legal completo de la Ley 5/2025.
- Ampliar `purchase-costs-ccaa.json` al resto de CCAA antes de escalar el
  dataset de ciudades (ver "CCAA pendientes de verificar").
- Vulnerabilidades conocidas de `next@14.2.35` (ultima version 14.x parcheada
  disponible en el momento de crear este proyecto) solo se resuelven
  saltando a Next 15/16, lo que implica migrar `params`/`searchParams` a
  `Promise` en Server Components. Evaluar ese salto como tarea aparte antes
  de ir a produccion.
- Completar `docs/ADSENSE_GDPR_CHECKLIST.md` con la cuenta de AdSense real.
- Ver "Vender vivienda: captacion de leads" mas abajo para lo pendiente
  especifico de esa seccion antes de publicarla.

## Vender vivienda: captacion de leads (Baix Llobregat Sud)

Seccion nueva (`/vender-vivienda`, `/vender-vivienda/[localidad]`) que capta
leads de propietarios para reenviarlos a una agencia inmobiliaria
colaboradora (modelo de referral). A diferencia del resto del sitio, esto
recoge datos personales reales, asi que tiene su propio circuito de
cumplimiento:

- `data/vender-vivienda-localidades.json` — 7 municipios (Castelldefels,
  Sitges, Vilanova i la Geltru, Gava, Viladecans, Sant Boi de Llobregat, Sant
  Feliu de Llobregat), precio de venta €/m2 real de Fotocasa (junio/mayo
  2026, con `source_url` propio por municipio). `search_volume_tier` aqui es
  una estimacion heuristica (poblacion + notoriedad turistica/inmobiliaria),
  **no** un dato de Search Console real -- la seccion es nueva y no tiene
  historial de trafico todavia. Revisar con datos reales en cuanto haya
  indexacion (ver `npm run qc:report`: hoy Sant Feliu de Llobregat queda
  `noindex` por tier `"bajo"`, los otros 6 quedan `index`).
- Consentimiento RGPD: el formulario (`src/components/leads/SellLeadForm.tsx`)
  tiene dos casillas independientes y sin premarcar -- una para que TipoFijo
  contacte al usuario, otra especifica para ceder los datos a la agencia
  colaboradora nombrada junto al formulario. El envio esta deshabilitado en
  cliente hasta marcar ambas, y se vuelve a validar en servidor
  (`src/lib/leads.ts#validateSellLeadPayload`) por si alguien salta el
  cliente.
- Backend del lead (`src/app/api/leads/vender-vivienda/route.ts`): honeypot +
  rate limiting best-effort en memoria, envio por email via Resend
  (`RESEND_API_KEY`/`LEAD_NOTIFICATION_EMAIL`), y una copia de auditoria en
  `data/leads-audit.jsonl` (gitignored).
- **El SDK de Resend no lanza excepcion en errores de la API** (dominio no
  verificado, remitente invalido, etc.) -- devuelve `{ data, error }`. El
  route handler comprueba explicitamente ese `error`; si no se comprobara,
  un fallo de envio se reportaria como exito silenciosamente (esto ocurrio
  de verdad durante el desarrollo: `tipofijo.com` no estaba verificado en
  Resend y el endpoint devolvia `200 ok` sin haber enviado nada). Mientras no
  se verifique un dominio propio en Resend, usa el remitente sandbox
  (`onboarding@resend.dev`, ver `.env.example`), que solo entrega al email
  de la cuenta de Resend.
- **Limite conocido de la auditoria local**: `data/leads-audit.jsonl` solo es
  fiable en local/`next start` con disco persistente. En Vercel el sistema de
  ficheros es de solo lectura fuera de `/tmp`, y `/tmp` no persiste entre
  invocaciones ni despliegues -- por tanto ese fichero **no** sirve hoy como
  prueba de cumplimiento RGPD en produccion. El email via Resend es la unica
  copia duradera actual; antes de depender de esto para una auditoria real,
  sustituir por un almacen persistente (Vercel Postgres/KV, Turso).

### Pendiente antes de publicar esta seccion en produccion

1. **Nombre y datos de contacto reales de la agencia colaboradora.**
   Mientras `NEXT_PUBLIC_PARTNER_AGENCY_NAME`/`NEXT_PUBLIC_PARTNER_AGENCY_CONTACT`
   no esten configurados, el sitio muestra el placeholder visible
   `[agencia colaboradora pendiente de confirmar]` en el formulario y en
   `/politica-privacidad`, precisamente para que no se pueda publicar sin
   configurarlos.
2. **`LEAD_NOTIFICATION_EMAIL` y `RESEND_API_KEY` configurados** en Vercel;
   sin ellos, el lead solo queda en el log de auditoria local (ver limite de
   arriba) y no llega ningun email.
3. **Acuerdo de cesion de datos firmado con la agencia.** Esto es una
   verificacion legal, no tecnica -- este proyecto no puede confirmar que
   exista un contrato/acuerdo de encargado o corresponsable del tratamiento
   con la agencia. No publicar el formulario en produccion sin esa
   confirmacion legal.
