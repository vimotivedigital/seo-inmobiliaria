# Checklist de cumplimiento AdSense + GDPR antes de lanzar anuncios

Usa esta lista antes de activar `NEXT_PUBLIC_ADSENSE_CLIENT_ID` en produccion.

## Consentimiento (GDPR / ePrivacy)

- [ ] El banner de cookies (`src/components/ads/CookieConsent.tsx`) se muestra
      antes de cargar cualquier script de Google (Analytics/AdSense).
- [ ] "Rechazar todas" tiene el mismo peso visual que "Aceptar todas" (sin dark
      patterns) -- verificar visualmente, no solo en el codigo.
- [ ] Google Consent Mode v2 esta inicializado con denegacion por defecto
      (`gtagConsentDefault()` en `consent.ts`) antes de que exista cualquier
      posibilidad de carga de anuncios.
- [ ] El consentimiento granular (necesarias / analitica / publicidad) se
      guarda y se puede modificar despues desde el enlace "Cookies" del
      footer, en cualquier momento.
- [ ] Existe politica de cookies (`/politica-cookies`) y aviso legal
      (`/aviso-legal`) enlazados desde el footer y desde el propio banner.
- [ ] El sitio no carga el script de AdSense (`pagead2.googlesyndication.com`)
      hasta que `consent.ads === true`. Verificar en pestaña Network del
      navegador con las cookies rechazadas.

## Cuenta y politicas de AdSense

- [ ] Cuenta de AdSense aprobada para el dominio de produccion (no funciona
      en `localhost` ni en dominios de preview no verificados).
- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` configurado con el `ca-pub-XXXXXXXXXX`
      real; sustituir los `data-ad-slot` de ejemplo (`1111111111`, etc.) por
      los IDs de bloque de anuncio reales creados en la consola de AdSense.
- [ ] Contenido suficiente por pagina: ninguna pagina con anuncios debe tener
      mas anuncios que contenido util. Las paginas en `noindex` (ver
      `npm run qc:report`) no deben mostrarse a trafico de busqueda mientras
      no pasen el control de calidad, aunque tecnicamente puedan servir
      anuncios si reciben trafico directo.
- [ ] Ningun anuncio esta colocado de forma que induzca a clics accidentales
      cerca de botones de la calculadora (revisar visualmente en movil: los
      slots `top` e `in-content` deben tener separacion clara del boton de
      "Calcular" / inputs).
- [ ] Los anuncios llevan la etiqueta "Publicidad" visible (ya implementado
      en `AdSlot.tsx`), diferenciandolos claramente del contenido editorial.
- [ ] No hay anuncios en paginas de politica de cookies, aviso legal o
      metodologia (contenido puramente informativo/legal).

## Core Web Vitals / rendimiento

- [ ] Los anuncios fuera del viewport inicial se cargan de forma diferida
      (`IntersectionObserver` en `AdSlot.tsx`) -- verificar que no aparecen
      en el HTML inicial antes de hacer scroll.
- [ ] `next build` no muestra advertencias de imagenes sin optimizar ni JS
      excesivo por ruta (ver tabla de tamanios que imprime `next build`).
- [ ] Medir LCP/CLS/INP reales en PageSpeed Insights sobre 2-3 paginas tras
      activar AdSense, no solo antes: los anuncios son la causa mas comun de
      regresion de CLS si no reservan espacio (`min-height` del contenedor).

## Antes de cada despliegue con contenido nuevo

- [ ] Ejecutar `npm run qc:report` y revisar que ninguna pagina que se
      espera indexable haya caido a `noindex` de forma inesperada (y
      viceversa).
- [ ] Revisar en Google Search Console la cobertura de indexacion del lote
      anterior antes de anadir el siguiente (ver `/metodologia`, rollout por
      lotes).
