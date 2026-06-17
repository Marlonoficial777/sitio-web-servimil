# Servimil — Sitio Web

Landing page de **SERVIMIL**: servicios y beneficios para las **Fuerzas Armadas y el Ministerio de Defensa de Colombia** y sus familias (bono de condolencia, asistencia financiera/jurídica, salud y bienestar, nuevos servicios, calculadora de crédito).

## Stack

- **Astro 5** (sitio estático) + **Tailwind CSS v4** (vía `@tailwindcss/vite`; tokens con `@theme` en `src/styles/global.css`, sin `tailwind.config`).
- **Cloudflare Pages** — proyecto `servimil`, cuenta **rappicreditcolombia**. Deploy con **Wrangler 4**.

## DEPLOY ⚠️ IMPORTANTE

**Producción = rama `main` → https://servimil.pages.dev**

Deploy a producción con un solo comando (ya fija `--branch=main`):

```
npm run deploy
```

Equivale a: `astro build && wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true`

- **`npm run deploy` despliega DIRECTO a producción (rama `main`).** No requiere flags extra.
- **NO usar `master`** ni omitir `--branch` al correr wrangler a mano: eso publica a entorno **Preview** (URL `*.servimil.pages.dev` de preview), NO actualiza producción. Fue un error real ya cometido y corregido.
- URL canónica (`astro.config.mjs`): `https://servimil.pages.dev`. Dominio de negocio (en contenido): `https://www.servimil.co` (pendiente conectar).

### Scripts (`package.json`)

```
npm run dev      # astro dev
npm run build    # astro build → dist/
npm run preview  # astro preview
npm run deploy   # build + deploy DIRECTO a producción (--branch=main ya incluido)
```

## Marca

### Paleta (tokens `@theme` en `src/styles/global.css`)

| Token    | Hex       | Uso                                          |
|----------|-----------|----------------------------------------------|
| `navy`   | `#011126` | azul oscuro: fondos impacto, header scroll, footer, títulos |
| `orange` | `#F34616` | naranja: CTA clave, badges "NUEVO", botón flotante |
| `cyan`   | `#96DDED` | cian: íconos, detalles, hover                |
| `ice`    | `#E8F3F9` | azul claro: fondos de secciones/cards (body) |
| `beige`  | `#EAE5DD` | beige: fondos de respiro alternos            |

Clases: `bg-navy`, `text-orange`, `border-cyan`, `bg-ice`, etc.

### Tipografía

**Poppins** (`--font-sans`). Fallback `ui-sans-serif, system-ui, sans-serif`.

## Estructura de secciones (orden en `src/pages/index.astro`)

1. **Header** — overlay `fixed` transparente sobre el hero; al hacer scroll (>40px) gana clase `.is-scrolled` → fondo sólido `rgba(1,17,38,.92)` + sombra + blur (transición 0.3s, CSS en `global.css`). Logo/menú/WhatsApp en blanco. Hamburguesa en móvil. Altura `h-[80px] md:h-[88px]`. Entrada en cascada (stagger): logo → links → WhatsApp, vía `.h-stagger` + `animation-delay` escalonado (keyframe `headerIn`, respeta reduced-motion).
2. **Hero** — video de fondo Cloudinary a pantalla completa.
3. **Barra de confianza** (`TrustBar`).
4. **Servicios actuales** (`Servicios`).
5. **Bienestar y salud** (`Bienestar`).
6. **Nuevos servicios** (`NuevosServicios`) — Plan Mascota, Tecnología, Viajes Internacionales, Jurídica Especializada (badge naranja "NUEVO").
7. **Testimonios** (`Testimonios`).
8. **CTA final** (`CtaFinal`).
9. **Footer**.
10. **CreditWidget** — calculadora flotante (fuera de `<main>`).

```
src/
  layouts/Base.astro          # shell HTML, <head>, fuente, meta
  pages/index.astro           # única página; compone las secciones
  lib/site.ts                 # CONFIG CENTRAL: contacto, contenido, fórmula calculadora
  styles/global.css           # @theme paleta + Poppins + animaciones + estilos header scroll
  components/                 # Logo, Icon, Header, Hero, TrustBar, Servicios,
                              # Bienestar, NuevosServicios, Testimonios, CtaFinal,
                              # Footer, CreditWidget
public/  favicon.svg, _headers
```

## Hero — video de fondo

- Video Cloudinary (autoplay, muted, loop, playsinline), `object-cover` a pantalla completa de la sección, detrás del header.
- URL: `https://res.cloudinary.com/dzh85ye7y/video/upload/q_auto/f_auto/v1781727489/hf_20260617_200631_87bd6292-1278-4edf-b339-65579f26455e_zd1gav.mp4`
- Overlay `#011126` a ~58% encima del video para legibilidad del texto blanco.
- **Poster** fallback = fotograma 0 del propio video (Cloudinary `so_0,f_jpg`).
- Respeta **`prefers-reduced-motion`**: si está activo, NO reproduce el video, muestra solo el poster (la fuente se carga por JS solo si no hay reduced-motion).
- z-index: video `-z-20`, overlay `-z-10`, contenido `z-10`.

## Calculadora de crédito (`CreditWidget.astro`)

- Botón flotante naranja **"Analiza tu crédito"** (abajo-derecha, `z-50`) → abre modal accesible en la misma página (slider monto + select cuotas → cuota mensual estimada + total + CTA WhatsApp).
- **FÓRMULA AÚN ES PLACEHOLDER:** amortización francesa con `monthlyRate = 0.015` (1.5%/mes) en `CREDIT_CONFIG` / `monthlyPayment()`. **Pendiente datos reales de Servimil.**

## Logo (`Logo.astro`)

- Imagen oficial Cloudinary PNG. **OJO:** el PNG original es 1200×1200 con mucho padding transparente (logo útil 968×170). Por eso la URL usa **`e_trim`** para recortar el espacio vacío — sin eso el logo se ve diminuto dentro de su caja.
- URL: `https://res.cloudinary.com/dzh85ye7y/image/upload/e_trim/q_auto/f_auto/v1781730267/Logo-Horizontal-Original-2_ys22y9.png`
- Blanco vía `filter:brightness(0) invert(1)` cuando `dark` (header + footer).
- Tamaño actual (ajustado a ojo con el usuario): `h-8 md:h-9`, bajado con `mt-7` en el wrapper del Header. `w-auto` (sin deformar).
- Usado con `dark` en `Header.astro` y `Footer.astro`. Sigue siendo link a `#top`, con micro-hover.

## Lugares clave para editar

- **Contenido / contacto / datos calculadora:** `src/lib/site.ts` (`SERVICIOS`, `BIENESTAR`, `NUEVOS`, `TESTIMONIOS`, `REQUISITOS`, `CREDIT_CONFIG`, WhatsApp).
- **Fórmula del crédito:** `src/components/CreditWidget.astro` → `monthlyPayment()`.
- **Paleta / fuente / estilos globales:** `src/styles/global.css`.

## PENDIENTES

- [ ] **Fórmula real de la calculadora**: tasa real, montos mín/máx, plazos y condiciones (hoy placeholder 1.5%/mes).
- [ ] **Fotos reales de testimonios** (hoy sin foto / avatar decorativo).
- [ ] **Conectar dominio `servimil.co`** a Cloudflare Pages.

## Estado / último avance (al 2026-06-17)

- ✅ Hero con video de fondo Cloudinary a pantalla completa (`min-h-[100svh]`, contenido centrado), overlay, poster, reduced-motion. Badge "+5.000 familias" **eliminado**.
- ✅ Header overlay transparente → sólido al scroll, con entrada en cascada (stagger).
- ✅ Logo oficial Cloudinary con `e_trim`, blanco, tamaño afinado (`h-8 md:h-9`, `mt-7`).
- ✅ `npm run deploy` despliega directo a producción (`--branch=main`).
- ✅ Sitio vivo: https://servimil.pages.dev
- Último commit: `8a7eccb` (logo h-8/md h-9 + mt-7).

### Próximos pasos (mañana)

- Revisar resto de secciones (TrustBar, Servicios, Bienestar, NuevosServicios, Testimonios, CtaFinal, Footer) — pulir contenido/estilo.
- Atacar PENDIENTES de abajo (fórmula real calculadora, fotos testimonios, dominio).

## Notas

- Animaciones respetan `prefers-reduced-motion`.
- Íconos: agregar en `Icon.astro`, referenciar por `name` desde `site.ts`.
- Repo git local (sin remoto aún). Commit en cada cambio para respaldo.
