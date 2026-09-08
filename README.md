# Suplacard — Cotizador online

Landing de captación para campañas pagas. Vive en **https://forms.suplacard.com**.

No es el sitio institucional. Ese es `suplacard.com`, repo `suplacard-web`, y no comparte código con este.

El proyecto arrancó en Base44 y se migró a un repo propio. Quedan dependencias de esa etapa en `package.json` (ver "Deuda pendiente").

---

## Qué hace

Un cotizador guiado de 4 pasos. La persona elige producto (placard, vestidor o cocina), dice con qué arranca (planos, medidas y fotos, o nada), deja sus datos, y al enviar:

1. Se suben los archivos adjuntos a Supabase Storage.
2. Se guarda la consulta en la tabla `quotes` con un código `SUP-AAAA-XXXX`.
3. Se dispara el evento `Lead` a Meta y a Google.
4. Se abre WhatsApp con un mensaje ya armado, que incluye el resumen y un link al detalle completo.

El cliente manda ese mensaje y la conversación se atiende desde **Respond.io**. El landing no maneja la conversación, solo la origina.

---

## Stack

| | |
|---|---|
| Framework | React 18 + Vite 6 |
| Estilos | Tailwind 3 + shadcn/ui (Radix) |
| Animación | Framer Motion |
| Ruteo | react-router-dom 6 |
| Backend | Supabase (`jeeqyynfurdeitnisupi`) |
| Deploy | Railway, automático con cada push a `main` |

---

## Rutas

| Ruta | Componente | Qué es |
|---|---|---|
| `/` | `src/pages/Home.jsx` | El cotizador. Todo el flujo vive acá. |
| `/consulta/:id` | `src/pages/Consulta.jsx` | Detalle de una consulta. Es el link que va en el WhatsApp: el vendedor abre y ve fotos, planos y medidas. |
| `/terminos` | `src/pages/Terminos.jsx` | Términos y condiciones. |

---

## Supabase

**Tabla `quotes`** — una fila por consulta enviada.

Campos propios: `codigo`, `producto`, `entrada`, `medidas`, `descripcion`, `archivos` (array de URLs), `nombre`, `whatsapp`, `email`, `localidad`, `obra`, `urgencia`, `comentarios`, `extra_fields` (jsonb con la config completa por producto), `status`.

Campos de atribución: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `landing_url`, `referrer`.

**Storage `archivos`** — bucket público. Los adjuntos van a `consultas/{codigo}/{timestamp}-{nombre}`.

La clave que está hardcodeada en `Home.jsx` es la **publishable**, pensada para el front. La `service_role` nunca va acá.

---

## Medición

Este landing **no usa Google Tag Manager**. El pixel de Meta y la Google tag están directo en `index.html`.

| | |
|---|---|
| Pixel de Meta | `25867828236244012` |
| Google tag (GA4) | `G-DC778D6EQN` |
| Google Ads | `AW-10949447359`, vinculado desde el panel de la Google tag |

**Eventos**

- `PageView` — en `index.html`, al cargar.
- `Lead` — en `Home.jsx`, cuando el cotizador confirma el envío. Se dispara una sola vez por consulta y lleva el `codigo` como `eventID`.
- `generate_lead` — GA4, en el mismo momento.

**Atribución.** Las UTM y el `fbclid` se leen de la URL en el primer aterrizaje y se guardan en `sessionStorage` (`capturarAtribucion` en `Home.jsx`). Es necesario porque el formulario es de varios pasos y los parámetros se pierden al avanzar. Después se vuelcan a la fila de `quotes`.

El origen **no** va en el mensaje de WhatsApp: ese texto lo ve y lo manda el cliente. Está en la tabla, que es donde se necesita.

**Reporte de leads reales por campaña:**

```sql
select
  coalesce(utm_term, '(sin conjunto)')   as conjunto,
  coalesce(utm_content, '(sin anuncio)') as anuncio,
  count(*)                               as leads
from quotes
where utm_source = 'meta'
  and created_at >= now() - interval '7 days'
group by 1, 2
order by leads desc;
```

Ese número es el que vale. El que reporta Meta siempre va a ser más alto porque incluye conversiones modeladas.

---

## Dos cosas que ya rompieron y no hay que volver a romper

**1. El `Lead` va antes de abrir WhatsApp.**

Cuando el popup viene bloqueado —lo normal en celular, que es de donde llega el tráfico de las campañas— se usa `window.location.href` y el navegador abandona la página. Cualquier línea posterior no se ejecuta.

El tracking estuvo meses después de esa línea. El pixel registraba `PageView` y jamás un `Lead`.

**2. No usar `fbq('consent','revoke')` en este landing.**

`revoke` no significa "no guardar cookies": bloquea el envío de **todos** los eventos hasta que se llame a `grant`. En `suplacard.com` eso lo revierte el banner de cookies. Acá **no hay banner**, así que no había nada que pudiera otorgarlo y el pixel quedaba mudo para siempre.

Si algún día se suma un banner al landing, se vuelve al esquema de `denied` y el banner llama a `window.suplacardConsentimientoAceptado()`.

---

## Desarrollo local

```bash
npm install
npm run dev
```

Vite imprime la URL. No hace falta `.env`: las claves de Supabase y los IDs de medición están en el código, y son públicos por diseño.

```bash
npm run build     # build de producción
npm run preview   # sirve el build
npm run lint      # eslint
```

---

## Deploy

Railway está conectado a `main`. Cada push deploya solo. No hay pipeline ni build manual.

Dominio: `forms.suplacard.com`. Región: SFO.

---

## Deuda pendiente

**`package.json` arrastra la migración.** El `name` sigue siendo `base44-app` y quedan dependencias de esa etapa: `@base44/sdk` y `@base44/vite-plugin`. Antes de sacarlas hay que revisar si `vite.config.js` todavía usa el plugin.

También hay librerías que probablemente no se usan: `@stripe/*`, `three`, `react-leaflet`, `react-quill`, `jspdf`, `jszip`, `recharts`, `canvas-confetti`. Conviene auditarlas: engordan el bundle y hacen más lenta la carga, que en un landing de campañas se paga en leads perdidos.

**Falta el label de conversión de Google Ads.** En `Home.jsx` figura `AW-10949447359/ETIQUETA`. Mientras diga `ETIQUETA` no se envía nada. El valor real sale de Google Ads → Objetivos → Conversiones → la acción → Configurar etiqueta.

**API de Conversiones.** El `Lead` viaja hoy solo por el navegador. Mandarlo también desde el backend, con el mismo `codigo` como `event_id`, daría medición confiable aunque el navegador bloquee el pixel. Meta deduplica por ese ID.

**Brecha entre envío y chat.** El cotizador abre WhatsApp con el mensaje armado, pero la persona todavía tiene que apretar enviar. Los que no lo hacen quedan en `quotes` y nunca aparecen en Respond.io. Vale cruzar los dos números: son leads con teléfono y proyecto completo que hoy nadie contacta.

**Carpeta `base44/`.** Verificar si todavía cumple alguna función o quedó de la migración.
