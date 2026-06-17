# Servimil — Sitio Web

Landing page de **Servimil**: beneficios y bienestar para las Fuerzas Armadas de Colombia y sus familias (bono de condolencia, asistencia financiera/jurídica, salud, nuevos servicios, calculadora de crédito).

## Stack

- **Astro 5** (sitio estático) + **Tailwind CSS v4** (vía `@tailwindcss/vite`, sin archivo `tailwind.config`; tokens definidos con `@theme` en `src/styles/global.css`).
- **Cloudflare Pages** — proyecto `servimil`, cuenta **rappicreditcolombia**.
- Deploy con **Wrangler 4**.

### Scripts (`package.json`)

```
npm run dev      # astro dev (desarrollo local)
npm run build    # astro build → dist/
npm run preview  # astro preview
npm run deploy   # astro build && wrangler pages deploy dist --project-name=servimil
```

- URL en vivo: https://servimil.pages.dev
- `site` canónico en `astro.config.mjs`: `https://servimil.pages.dev`
- Dominio de negocio (en contenido): `https://www.servimil.co`

## Marca

### Paleta (en `src/styles/global.css`, tokens `@theme`)

| Token        | Hex       | Uso                                            |
|--------------|-----------|------------------------------------------------|
| `navy`       | `#011126` | fondos de impacto, header, footer, títulos     |
| `orange`     | `#F34616` | CTA clave, badges "NUEVO", botón flotante      |
| `cyan`       | `#96DDED` | íconos, detalles, hover                         |
| `ice`        | `#E8F3F9` | fondos de secciones/cards (fondo de body)      |
| `beige`      | `#EAE5DD` | fondos de respiro alternos                      |

Uso en clases Tailwind: `bg-navy`, `text-orange`, `border-cyan`, `bg-ice`, etc.

### Tipografía

**Poppins** (`--font-sans`). Fallback: `ui-sans-serif, system-ui, sans-serif`.

## Estructura

```
src/
  layouts/Base.astro          # shell HTML, <head>, fuente, meta
  pages/index.astro           # única página; compone todas las secciones
  lib/site.ts                 # CONFIG CENTRAL: contacto, contenido, fórmula calculadora
  styles/global.css           # @theme paleta + tipografía + animaciones (reveal, pulse, fade)
  components/
    Logo.astro                # logo Servimil
    Icon.astro                # íconos por nombre (heart, money, bank, whatsapp, ...)
    Header.astro              # nav fijo
    Hero.astro                # héroe + placeholder foto familia militar
    TrustBar.astro            # barra de confianza
    Servicios.astro           # servicios actuales
    Bienestar.astro           # bienestar y salud
    NuevosServicios.astro     # nuevos servicios (badge naranja "NUEVO")
    Testimonios.astro         # testimonios
    CtaFinal.astro            # CTA final / registro
    Footer.astro              # pie
    CreditWidget.astro        # botón flotante + modal calculadora de crédito
public/
  favicon.svg, _headers
```

### Configuración central — `src/lib/site.ts`

Punto único de edición para contenido y datos. Cambiar aquí se refleja en todo el sitio:

- **Contacto:** `WHATSAPP_NUMBER` (573157019885), `WHATSAPP_URL`, `WHATSAPP_DISPLAY`, `WEBSITE`, `REGISTER_HREF` (`#registro`).
- **Nav:** `NAV_LINKS`.
- **Contenido:** `SERVICIOS`, `BIENESTAR`, `NUEVOS`, `TESTIMONIOS`, `REQUISITOS`.
- **Calculadora:** `CREDIT_CONFIG` (ver abajo).

## Calculadora flotante de crédito (`CreditWidget.astro`)

Botón flotante naranja (abajo-derecha, con animación pulse) → abre modal accesible (role dialog, Escape/click-fuera cierra). Slider de monto + select de cuotas → cuota mensual estimada + total, y CTA a WhatsApp.

- Config en `CREDIT_CONFIG` (`site.ts`): `min` 1.000.000, `max` 50.000.000, `step` 500.000, `defaultMonto` 8.000.000, `defaultCuotas` 24, `plazos` [6,12,18,24,36,48], `monthlyRate` **0.015 (placeholder 1.5%)**.
- Fórmula en `CreditWidget.astro` → `monthlyPayment(P, n)`: amortización francesa con `monthlyRate`. **Es placeholder** — único lugar a cambiar cuando se definan condiciones reales.
- Requisitos mostrados: `REQUISITOS` en `site.ts`.

## Pendientes (TODO)

- [ ] **Foto del hero**: `Hero.astro` usa placeholder con patrón rayado y texto "foto · familia militar". Reemplazar por imagen real de familia militar.
- [ ] **Fórmula de la calculadora**: `monthlyRate` y `monthlyPayment()` son placeholder (1.5% mensual). Definir tasa/condiciones reales.
- [ ] Revisar imágenes/fotos del resto de secciones si aplican.
- [ ] Confirmar requisitos de crédito reales (carencia, edades, elegibilidad).

## Notas

- Animaciones respetan `prefers-reduced-motion`.
- Íconos: agregar nuevos en `Icon.astro` y referenciar por `name` desde `site.ts`.
