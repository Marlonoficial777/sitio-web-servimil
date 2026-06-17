# Servimil — Sitio Web

Landing page de **SERVIMIL**: servicios y beneficios para las **Fuerzas Armadas y el Ministerio de Defensa de Colombia** y sus familias (bono de condolencia, asistencia financiera/jurídica, salud y bienestar, nuevos servicios, calculadora de crédito).

## Stack

- **Astro 5** (sitio estático) + **Tailwind CSS v4** (vía `@tailwindcss/vite`; tokens con `@theme` en `src/styles/global.css`, sin `tailwind.config`).
- **Cloudflare Pages** — proyecto `servimil`, cuenta **rappicreditcolombia**. Deploy con **Wrangler 4**.

## DEPLOY ⚠️ IMPORTANTE

**Producción = rama `main` → https://servimil.pages.dev**

SIEMPRE desplegar a producción con `--branch=main`:

```
npm run build
npx wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true
```

- **NO usar `master`** ni omitir `--branch`: eso publica a entorno **Preview** (URL `*.servimil.pages.dev` de preview), NO actualiza producción. Ese fue un error real ya cometido.
- El script `npm run deploy` de `package.json` NO fija la rama → caería en Preview. Usar el comando de arriba.
- URL canónica (`astro.config.mjs`): `https://servimil.pages.dev`. Dominio de negocio (en contenido): `https://www.servimil.co` (pendiente conectar).

### Scripts (`package.json`)

```
npm run dev      # astro dev
npm run build    # astro build → dist/
npm run preview  # astro preview
npm run deploy   # build + deploy (OJO: sin --branch=main → Preview)
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

1. **Header** — overlay transparente sobre el hero; al hacer scroll cambia a fondo sólido `#011126` con sombra (transición suave). Logo/menú/WhatsApp en blanco. Hamburguesa en móvil.
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

## Lugares clave para editar

- **Contenido / contacto / datos calculadora:** `src/lib/site.ts` (`SERVICIOS`, `BIENESTAR`, `NUEVOS`, `TESTIMONIOS`, `REQUISITOS`, `CREDIT_CONFIG`, WhatsApp).
- **Fórmula del crédito:** `src/components/CreditWidget.astro` → `monthlyPayment()`.
- **Paleta / fuente / estilos globales:** `src/styles/global.css`.

## PENDIENTES

- [ ] **Fórmula real de la calculadora**: tasa real, montos mín/máx, plazos y condiciones (hoy placeholder 1.5%/mes).
- [ ] **Fotos reales de testimonios** (hoy sin foto / avatar decorativo).
- [ ] **Conectar dominio `servimil.co`** a Cloudflare Pages.

## Notas

- Animaciones respetan `prefers-reduced-motion`.
- Íconos: agregar en `Icon.astro`, referenciar por `name` desde `site.ts`.
- Repo git local (sin remoto aún). Commit en cada cambio para respaldo.
