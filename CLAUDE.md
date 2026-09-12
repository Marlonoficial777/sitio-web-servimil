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

## Arquitectura — SITIO MULTIPÁGINA ⚠️

**Ya NO es one-page.** 4 páginas reales (Astro routing en `src/pages/`). El menú navega entre páginas, NO hace scroll a secciones.

- `/` → **index.astro** (Home; cierra con **`MapaUbicacion.astro`** — banda "Encuéntranos" con Google Maps clickeable, SOLO en Home, arriba del footer)
- `/conocenos` → **conocenos.astro** (quiénes somos, misión, valores, CTA)
- `/servicios` → **servicios.astro** (sección Ecosistema = esfera 3D + acordeón)
- `/testimonios` → **testimonios.astro** (grid de videos + CTA, ver abajo)

### `layouts/Base.astro` — `<head>` y SEO
Título, descripción, Poppins, favicon y el observer de `[data-reveal]`. **Desde 2026-09-12 emite también `<link rel="canonical">`, `og:url`, `og:image` (1200×630 generada por Cloudinary desde el fotograma 0 del video del hero), `og:site_name`, `og:locale` y `twitter:card`** — antes el link compartido por WhatsApp salía **sin imagen de vista previa**. Prop opcional **`image`** para sobrescribir la portada por página.

### Layout compartido — `layouts/Page.astro`
Envuelve TODAS las páginas: `Base` + `Header` + `<main><slot/></main>` + `Footer` + `CreditWidget`. Prop `solidHeader` (bool) → header sólido desde arriba (páginas internas sin hero oscuro). Home NO lo pasa (header transparente sobre hero).

### Header
- `fixed` overlay. Transparente sobre hero; al scroll (>40px) gana `.is-scrolled` → fondo sólido `rgba(1,17,38,.92)` + sombra + blur. Prop `solid` (vía `data-solid`) → siempre sólido (lo usan páginas internas).
- **Link activo:** `aria-current="page"` + color cian, según `Astro.url.pathname` (desktop + móvil).
- Altura `h-[80px] md:h-[88px]`, 3 alineados (`items-center`). Stagger `.h-stagger`. Hover links `scale-[1.06]`+cian.

### Home (`index.astro`) — orden
1. **Hero** (`Hero`) — video Cloudinary full-screen. Título 2 líneas, sin badge, CTA WhatsApp izquierda. **Video sin `q_auto/f_auto`** (calidad original, pesa más).
2. ~~TrustBar~~ — **QUITADO del Home** (2026-06-23). Componente sigue en `components/` sin uso. Orden ahora: Hero → ValorContador → PorQue → Planes → CierreEmocional → CtaFinal.
3. **ValorContador** — "Todo lo que tu familia necesita" + lista de checks (stagger) izquierda; card glassmorphism con **contador animado** "20.664" (easeOutCubic ~2s, viewport) + mini-stats 24/7 y 100% derecha. **Lista de checks CLICKEABLE** (2026-06-23): cada ítem es `<a>` a `/servicios#ancla` (nómina→administracion-nomina, seguros→seguros-auxilios, refinanciación→asistencia-financiera, jurídica→asistencia-juridica, streaming→entretenimiento, "muchos más"→/servicios). Hover texto→naranja + `translate-x-1`.
4. **PorQue** — 2 columnas. Título central "¿Por qué Servimil?" (blanco normal). Izquierda: **video escudo** Cloudinary con `mix-blend-mode:screen` + máscara radial (fondo negro desaparece, escudo flota) + glow cian + flotación. Derecha: "No somos una empresa más…" + 4 razones en lista (copy emocional). Sin logo sobrepuesto (se quitó).
5. **Planes** — "Elige tu plan" (sin eyebrow). 3 cards con **fotos reales** Cloudinary, conteo animado en cobertura ($1M/$2M/$3M, ~2.5s stagger). Mensualidades: **PLUS $39.900 / PLUS SUPERIOR $49.900 (destacada, "El preferido por las familias") / ELITE $59.900**. Sin línea "al día". Botón "Más información" → **/servicios#plan-...** (deep-link a la card del plan, con highlight de llegada — ver Servicios). Cierre: "Sin letra pequeña engañosa. Estamos para cumplirte."
6. **CierreEmocional** — banda oscura cálida "Trabajamos hasta lograrlo" (imagen de fondo placeholder).
7. **CtaFinal** — "Afíliate hoy…" (Regístrate + WhatsApp + Solicita tu crédito).

### Conócenos (`conocenos.astro`) — storytelling premium
1. **Hero cinematográfico** — video Cloudinary full-screen (`100svh`, object-cover, autoplay/muted/loop, poster so_0). Overlay degradado navy (30%→75%) + viñeteado. Texto alineado izquierda con el logo (`max-w-[1200px]`), centrado vertical. Sin eyebrow. Entrada cascada al cargar (`.cn-in` + delays). Indicador scroll "Conoce nuestra historia" + bounce.
2. **Quiénes somos** — "Más de 3 años caminando a tu lado", 2 col (texto + img placeholder).
3. **Stats conteo** — 20.664 / +3 / 100% (banda navy).
4. **Nuestro propósito — SECCIÓN UNIFICADA** (2026-07-15, antes eran 2: "Nuestro propósito" + "Propuesta de valor", ambas con video de soldado — se veían duplicadas). UNA banda con **IMAGEN ESTÁTICA** Cloudinary `v1784133364` (soldado con bandera al atardecer), `object-position:68% center`, overlay navy ~60% + radial naranja, SIN video/Ken Burns. Texto: eyebrow NUESTRO PROPÓSITO → título con "protegemos, respaldamos y acompañamos" naranja → párrafo con resaltados naranja → firma "EL COMPROMISO DE SERVIMIL" (sin guion). Encapsulado `{/* === 4. NUESTRO PROPÓSITO — SECCIÓN UNIFICADA === */}`.
6. **Valores** — 4 cards (Compromiso, Transparencia, Cercanía, Disponibilidad). Rayita superior naranja/cian (`<span>` accent). **Borde naranja + glow al hover/active/focus-within** (2026-07-03): clase `.val-card` (estilo scoped `/* === BORDE NARANJA HOVER/ACTIVE ... === */`), `border-color:#F34616` + box-shadow (elevación + contorno `0 0 0 1px` + glow `.22`), `cursor:pointer`, transición `.3s`. Conserva la rayita superior y la elevación `-translate-y-2`.
7. **Para quiénes trabajamos / Respaldo institucional** — frase Ministerio de Defensa + fila de **6 entidades** (2026-07-15): Ejército, Armada, Fuerza Aérea, Policía Nacional, **CREMIL** (`landmark`), **CASUR** (`piggy-bank`) — íconos genéricos Lucide en verde `#9CB04A`, grid 2/3/6 col.
8. **CTA final** — "Escríbenos ahora" (WhatsApp) + "Conoce nuestros servicios" (/servicios).

### Servicios (`servicios.astro`) — REDISEÑADO 2026-06-22 ⚠️
**Ya NO usa esfera 3D ni acordeón.** Three.js quitado de `Ecosistema.astro` (peso muerto fuera; dep `three` sigue en package.json sin uso). Orden actual:
1. **Hero** (`Ecosistema.astro`) — **video de fondo a pantalla completa** (`min-h-100svh`) de familia viendo película (Cloudinary, cálido). Capas: video `z-0` → overlay **NEGRO neutro** `rgba(0,0,0,~.55)` `z-[1]` (NO navy, para conservar tonos cálidos) → contenido `z-10`. Header **transparente** sobre el video (sin `solidHeader`). Texto centrado: eyebrow blanco "NUESTROS SERVICIOS" + título + subtítulo + flecha bounce decorativa. Video carga por JS solo si NO reduced-motion y NO móvil (`<768px` = solo poster `so_0`).
2. **Cinta marquee** (en `servicios.astro`) — UNA sola banda recta naranja `#F34616`, texto blanco mayúsculas, separador ✦, loop R→L 48s, `mask-image` fade en bordes, hover pausa. Array `CINTA`. **CLICKEABLE** (2026-06-23): cada nombre con bloque equivalente es `<a href="#id">` (mapa `CINTA_LINK` nombre→id; ambos sets del loop tienen enlaces). Scroll suave (global) + `scroll-margin-top:100px` en bloques. "Tecnología" sin bloque = texto plano. `.marquee-link` hover subrayado/opacidad.
3. **Nuestros planes — REESTRUCTURADO 2026-07-15** — 3 cards CORTAS (array `PLANES`, Élite $59.900 "MÁS POPULAR" / Plus Superior $49.900 / Plus $39.900): solo los **4 ítems que CAMBIAN** entre planes (bono condolencia, mascota, persona 75 años, entretenimiento) + caja cobertura + botón "Afíliate ahora" → `WHATSAPP`. Debajo del grid: **"+" centrado** (círculo naranja glow) y **UNA caja ancha ESTÁTICA "INCLUIDO EN TODOS LOS PLANES"** con los 8 beneficios comunes (const **`PLAN_COMUNES`**) en grid 3/2/1 col, checks naranjas. Nada desplegable. Nota legal "Aplican carencias..." **QUITADA** de esta sección (2026-07-15). **ids** `plan-plus / plan-plus-superior / plan-elite` + `scroll-margin-top:110px` + highlight de llegada (`.plan-highlight`) siguen igual.
4. **Servicios en detalle (zig-zag)** — 8 bloques alternados texto↔**foto real 4:3** (array `DETALLE`, campo `img` Cloudinary `q_auto/f_auto`): Bono, Asistencia financiera, Jurídica, Nómina, Seguros y auxilios, Entretenimiento, Bienestar y salud, Viajes. **Fotos reales puestas 2026-06-23.** Cada bloque con `id` (array `DETALLE_IDS`) + `scroll-margin-top:100px` (destino de cinta + lista Home). Reveal lateral opuesto (`data-reveal="left|right"`). **Animaciones premium**: stagger interno del texto (`.det-stagger` `--det-i`), hover imagen zoom `scale(1.05)` (`overflow-hidden`) + sombra ↑, parallax sutil del bloque decorativo (`.det-decor`), ícono entrada `scale`+rebote. Todo respeta reduced-motion. Eyebrow blanco.
5. **Testimonios (badge + reseñas propias)** (rehecho 2026-07-03) — tras "Servicios en detalle", antes del footer. Fondo **navy `#011126`**. Título único "TESTIMONIOS" blanco extrabold (32/40/46px). Debajo: **VIDEO NATIVO mp4 propio** (2026-07-15, antes iframe YouTube Short `xl4GR_wP-Bg` que superponía "IMG 1870"/"RAPPI CREDIT", imposible ocultar por parámetros): archivo **`public/videos/testimonio-servimil.mp4`** (720×1280, 5.5MB, descargado del canal del cliente) + poster `.jpg`, `<video controls playsinline preload="metadata">`, **vertical 9:16** (`aspect-[9/16]`, `max-w-[360px]` centrado — ajustar tamaño ahí), `rounded-2xl` + sombra, sin autoplay. Encapsulado `{/* === VIDEO TESTIMONIO ... === */}`. ⚠️ **Trustindex ELIMINADO** (prueba de 7 días vencida → mostraba mensaje rojo "trial period has expired"). Reemplazado por:
   - **Badge Google propio** (HTML/CSS, sin servicios externos, `max-w-[440px]`): card blanca + logo Google (SVG oficial 4 colores) + "Reseñas de Google" + **4.7** grande navy + estrellas (capa naranja recortada al **94%**=4.7/5 sobre grises) + "Reseñas reales de nuestras familias" + botón naranja `btn-shine` **"Ver reseñas en Google"** → `https://www.google.com/maps/place/SERVIMIL+COLOMBIA` (`target=_blank`). Encapsulado `{/* === BADGE RESEÑAS DE GOOGLE ... === */ ... /* === FIN === */ }`.
   - **Grid de 4 reseñas reales** (array `RESENAS` en frontmatter, `max-w-[920px]`, `grid-cols-1 md:grid-cols-2` = 2×2): cada card blanca (`h-full flex-col`, altura pareja, sombra) con **avatar circular inicial+color**, nombre, 5 estrellas naranja, ícono Google + "Google", y texto exacto de la reseña. Reviewers: Davinson Banguera, Carlos Murillo, Juancarlos Campo, Nicolas Davila. Encapsulado `{/* === GRID DE RESEÑAS DE GOOGLE ... === */ }`.
   - ⚠️ (histórico) Se intentó marquee auto-scroll de las cards del viejo Trustindex → **revertido**.

- **Patrón eyebrow** (repetido a pedido del usuario): eyebrows de sección en **blanco** `text-[16px] sm:text-[18px]` (no cian, no 13px).
- **Patrón reveal lateral**: `data-reveal="left"` / `"right"` (translateX ±48px) definido en `global.css` (junto al `data-reveal` base). Usado en conocenos ("Quiénes somos") y servicios (zig-zag).

### Testimonios (`testimonios.astro` + `components/Testimonios.astro`) — CARRUSEL 2026-07-16 ⚠️
**Ya NO es carrusel de citas en texto** (2026-06-23) **ni grid de placeholders** (2026-07-06) **ni grid de 6 videos** (2026-07-16). Ahora:
1. **Encabezado** — eyebrow "TESTIMONIOS" **naranja** `text-[16px] sm:text-[18px]` (agrandado 2026-06-24, antes 13px gris) + título grande "La voz de quienes ya nos eligieron" **navy** (`40/52/60px`).
2. **CARRUSEL de 6 VIDEOS REALES verticales 9:16** (2026-07-16, commit `95ce6f2`; antes grid 3×2 del `4761b58` — revertir desde `59b42b8`). Array `VIDEOS` en frontmatter (encapsulado `/* === VIDEOS REALES DE TESTIMONIOS === */`): 6 rutas Cloudinary (`v1783372764`–`808`, incl. 2 `.mov` — `f_auto` transcodifica; poster = fotograma 0, `so_0,f_jpg,q_auto`). **UN video a la vez** centrado (viewport `max-w-[315px]`, card `aspect-[9/16] max-h-[560px]`, fondo navy + borde sup. naranja): track flex con `translateX` (transición .45s, off con reduced-motion), **flechas ‹ ›** circulares a los lados (blancas, hover naranja, navegación **CIRCULAR**), **6 dots clickeables** debajo (`.tst-dot`, activo naranja `.is-active` escala 1.25). **Al cambiar de slide se pausan los videos no visibles** (script `is:inline`, encapsulado `{/* === CARRUSEL TESTIMONIOS === */}`). `<video>` nativo: `controls`, **SIN autoplay**, `playsinline`, `preload="metadata"`, `object-cover`.
3. **CTA cierre** — banda navy `#011126` (conecta sin corte con footer navy): "¿Listo para que tu familia también esté respaldada?" + subtítulo cian + botón naranja "Contáctanos por WhatsApp" (`wa.me/573181626167`, `btn-shine`).

- **FONDO BEIGE (2026-06-24)** — sección encabezado+grid: fondo **beige `#EAE5DD`** con degradado vertical MUY sutil (`linear-gradient(170deg,#F0ECE4,#EAE5DD,#E5DFD5)`) + 2 blobs naranja `blur(130px)` opacidad 0.06/0.07 en esquinas (atmósfera casi imperceptible, peso cero, sin animación). Cards blancas resaltan sobre el beige. Empalme beige→CTA navy→footer navy = corte definido limpio. Todo en `<style>` scoped, encapsulado `/* === FONDO BEIGE TESTIMONIOS (reversible) === */ ... /* === FIN === */` (clases `.tst-hero` `.tst-mesh` `.tst-blob`). Antes se probó fondo navy+mesh cian/naranja → cambiado a beige a pedido.

```
src/
  layouts/Base.astro          # shell HTML, <head>, fuente, meta, observer reveal
  layouts/Page.astro          # Base + Header + main + Footer + CreditWidget (prop solidHeader)
  pages/index.astro           # Home
  pages/conocenos.astro
  pages/servicios.astro       # usa Ecosistema
  pages/testimonios.astro     # usa Testimonios
  lib/site.ts                 # CONFIG CENTRAL: NAV_LINKS (rutas reales), contacto, contenido, calculadora
  styles/global.css           # @theme paleta + Poppins + animaciones + header scroll
  components/                 # Logo, Icon, Header, Hero, TrustBar, ValorContador, PorQue,
                              # Planes, CierreEmocional, Ecosistema, Testimonios, CtaFinal,
                              # Footer, CreditWidget
                              # (huérfanos sin uso: Servicios, Bienestar, NuevosServicios, ResumenServicios)

# Patrón contador animado (reutilizado): span con data-count / data-prefix /
# data-suffix / data-delay + script is:inline con IntersectionObserver +
# easeOutCubic + toLocaleString("es-CO"). Está en ValorContador, Planes y conocenos.
# Patrón "video sin caja": mix-blend-mode:screen + mask-image radial (PorQue).
public/  favicon.svg, _headers
```

## Hero — video de fondo

- Video Cloudinary (autoplay, muted, loop, playsinline), `object-cover` a pantalla completa de la sección, detrás del header.
- URL: `https://res.cloudinary.com/dzh85ye7y/video/upload/q_auto/f_auto/v1781727489/hf_20260617_200631_87bd6292-1278-4edf-b339-65579f26455e_zd1gav.mp4`
- Overlay `#011126` a ~58% encima del video para legibilidad del texto blanco.
- **Poster** fallback = fotograma 0 del propio video (Cloudinary `so_0,f_jpg`).
- Respeta **`prefers-reduced-motion`**: si está activo, NO reproduce el video, muestra solo el poster (la fuente se carga por JS solo si no hay reduced-motion).
- ⚠️ **VERSIÓN MÓVIL (2026-09-12)**: el `<source>` lleva **`data-src-mobile`** con la misma URL + **`w_720,q_auto`**. El script elige según `(max-width: 767px)`: móvil → 390 KB, desktop → los 5,3 MB originales. En móvil **sigue habiendo video** (no es imagen fija); la pérdida de resolución no se nota bajo el overlay al 58%. Mismo patrón en `conocenos.astro` (`HERO_VIDEO_MOBILE`, 517 KB vs 8,7 MB). **El hero de /servicios (`Ecosistema.astro`) NO carga video en móvil** (solo poster) — eso es de antes y se deja así.
- z-index: video `-z-20`, overlay `-z-10`, contenido `z-10`.

## Calculadora de crédito (`CreditWidget.astro`)

- Botón flotante naranja **"Analiza tu crédito"** (abajo-derecha, `z-50`) → abre modal accesible en la misma página (slider monto + select cuotas → cuota mensual estimada + CTA WhatsApp).
- ⚠️ **MÓVIL (2026-09-12):** el botón flotante pasa a **círculo 56×56** (`max-sm:h-14 max-sm:w-14 max-sm:p-0 …`) y el texto va en `<span class="max-sm:sr-only">`. Antes ocupaba el 55-65% del ancho y **tapaba el botón "Afíliate ahora"** de las tarjetas de plan. El `<select>` de cuotas lleva **`max-sm:text-[16px]`** (Safari iOS hace **zoom automático** con fuente < 16px) y el panel usa **`max-h-[92svh]`** (no `vh`, que no descuenta la barra de direcciones). Nada de esto toca la fórmula ni el desktop.
- ⚠️ **OCULTOS DE LA VISTA (2026-07-15, a pedido del cliente):** la línea "Total estimado a pagar" y la nota "Incluye aporte administrativo de $45.600" llevan atributo `hidden` (comentario reversible en `CreditWidget.astro`). **SOLO visual**: el aporte se SIGUE sumando a la cuota y el JS sigue calculando el total. Cuota verificada idéntica tras el cambio.
- **FÓRMULA REAL (HECHA) — UNA SOLA LÍNEA** ⚠️ **Servimil presta ÚNICAMENTE hasta $1.000.000** (corregido 2026-07-03, commit `01a2b27`; la "Línea 2 / aliados" fue **eliminada**):
  - **Slider monto:** `min $200.000 → max $1.000.000` (antes $50M, mal). `defaultMonto $500.000`. Etiqueta tope "$1.000.000".
  - **Cálculo (SIEMPRE, todo monto ≤ $1M):** amortización francesa `cuota_credito = P·i(1+i)^n / [(1+i)^n − 1]` con `i = monthlyRate = 0.0199` (1.99% m.v.), **+ `aporteAdmin = $45.600`** (cuota SICOD) sumado a CADA cuota. `total = cuota_total · n`. Formato COP `Intl.NumberFormat("es-CO")`. Función **`payment(P,n)`** en `CreditWidget.astro` (antes `line1Payment`).
  - **Plazos** (`CREDIT_CONFIG.plazos`): `12,14,…,36` (de 2 en 2). Aviso legal "Cálculo de referencia…" + nota "Incluye aporte administrativo de $45.600" visibles.
  - Condiciones en `src/lib/site.ts` → `CREDIT_CONFIG` (`min`, `max`=1M, `monthlyRate`, `aporteAdmin`, `plazos`). **Único lugar a tocar si cambian.** `line1Max`/`line2Box`/`lineaTag`/`PILL_L1/L2`/`esLinea1` **eliminados** (sin código muerto).
  - ⚠️ **Pendiente validar** los números con un ejemplo verificado de Julián (comparar contra su `cotizar.py`).
- **Números verificados en vivo (dev, 2026-07-03)** — para validar con cliente:
  | Monto | Plazo | Cuota mensual total | Total a pagar |
  |-------|-------|---------------------|---------------|
  | $1.000.000 | 12 | **$140.102** | $1.681.218 |
  | $1.000.000 | 24 | **$98.411**  | $2.361.869 |
  | $500.000   | 12 | **$92.851**  | $1.114.209 |

## Animaciones y estados de interacción (UX)

Aplicado vía skill **`ui-ux-pro-max`** (ver abajo). Todo respeta `prefers-reduced-motion` y usa `transform`/`opacity` (sin layout shift), ease-out 200-600ms. Definiciones en `global.css`.

- **Estados de interacción:** `focus-visible:ring-2` (cian sobre fondos oscuros, naranja sobre claros, navy sobre botones naranja) en links header/footer, CTAs, botón flotante, slider monto y select cuotas. `active:scale-95` en botones + hamburguesa. `cursor-pointer` en cards. `disabled:opacity-50 + cursor-not-allowed` listo en botón flotante (la calculadora computa síncrono, sin async real hoy).
- **Reveal on scroll:** `[data-reveal]` → fade + `translateY(38px)` + leve `scale`, con cascada por tarjeta vía `--reveal-delay` (asignado por índice en cada grid). Observer en `Base.astro`.
- **Hover cards** (Servicios/Nuevos): `-translate-y-2` + `scale-[1.03]` + sombra fuerte; ícono `group-hover:scale-110` + color cyan→navy.
- **Badge "NUEVO":** `.badge-nuevo` glow naranja sutil infinito lento (2.8s), discreto.
- **CTA primarios:** `.btn-shine` (barrido de brillo con `::before`, `overflow-hidden` no recorta el focus-ring porque es box-shadow) + sombra naranja viva al hover.

## Skill de diseño — `ui-ux-pro-max`

- Instalada **global** en `C:/Users/marlo/.claude/skills/ui-ux-pro-max/` (cubre todos los proyectos; NO local). CLI: `npx uipro-cli init --ai claude` (sin flag `--global`: se corre desde el home para que caiga en `.claude/` del usuario).
- Design system del proyecto persistido en **`design-system/servimil/MASTER.md`** (overrides por página en `design-system/servimil/pages/`).
- ⚠️ **La skill propone paleta/fuente genéricas fintech (navy #1E3A8A, gold, IBM Plex) — IGNORAR.** La marca Servimil (navy `#011126`, naranja `#F34616`, Poppins) manda siempre. Usar la skill solo para espaciado, jerarquía, animaciones y estados.

## Logo (`Logo.astro`)

- Imagen oficial Cloudinary PNG. **OJO:** el PNG original es 1200×1200 con mucho padding transparente (logo útil 968×170). Por eso la URL usa **`e_trim`** para recortar el espacio vacío — sin eso el logo se ve diminuto dentro de su caja.
- URL: `https://res.cloudinary.com/dzh85ye7y/image/upload/e_trim/q_auto/f_auto/v1781730267/Logo-Horizontal-Original-2_ys22y9.png`
- Blanco vía `filter:brightness(0) invert(1)` cuando `dark` (header + footer).
- Tamaño actual (ajustado a ojo con el usuario): `h-8 md:h-9`, `w-auto` (sin deformar). **El `mt-7` se quitó** — el wrapper del logo ahora es `flex items-center` y se alinea al mismo eje que menú y WhatsApp.
- Usado con `dark` en `Header.astro` y `Footer.astro`, con micro-hover.
- ⚠️ **`href` CONDICIONAL (2026-09-12, commit `5ca8a3a`)**: `#top` en Home (conserva el scroll suave al hero) y **`/` en las páginas internas**. Antes era `#top` fijo y como ese ancla solo existe en `Hero.astro`, en /conocenos, /servicios y /testimonios **el click al logo no hacía nada**.
- Área táctil ≥44px en móvil vía `max-sm:-my-2 max-sm:py-2` (el margen negativo cancela el padding → no mueve nada).

## Lugares clave para editar

- **Contenido / contacto / datos calculadora:** `src/lib/site.ts` (`SERVICIOS`, `BIENESTAR`, `NUEVOS`, `TESTIMONIOS`, `REQUISITOS`, `CREDIT_CONFIG`, WhatsApp).
- **Fórmula del crédito:** `src/components/CreditWidget.astro` → `payment()` (+ condiciones en `CREDIT_CONFIG` de `site.ts`).
- **Paleta / fuente / estilos globales:** `src/styles/global.css`.

## PENDIENTES ABIERTOS (al 2026-07-03)

**Copy / textos:**
- [x] ~~**Typos Home:** `"logralo"` → `"lograrlo"` y `"aquienes"` → `"a quienes"`~~ — **HECHO** (ya resuelto; `CierreEmocional.astro` dice "lograrlo", copy usa "a/para quienes").
- [x] ~~**Nota legal planes**~~ — **HECHO**: ya dice `"Aplican carencias y condiciones según cada servicio. Consulta términos completos."` en `Planes.astro` y `servicios.astro` (2 planes).

**Calculadora:**
- [ ] **Validar la cuota con un ejemplo verificado de Julián** — comparar el resultado de la web contra su `cotizar.py` (misma fórmula 1.99% m.v. + $45.600). Fórmula YA implementada (commit `7da2aee`); falta el visto bueno numérico del cliente. Casos ya calculados en la sección "Calculadora de crédito".

**Videos:**
- [x] ~~**Videos reales testimonios (página `/testimonios`)**~~ — **HECHO 2026-07-06** (commit `4761b58`): 6 videos reales Cloudinary en `<video>` nativo, cards verticales 9:16 (ver sección Testimonios).
- [ ] **Video real Testimonios Home** + botón "Conoce más" → `/testimonios`.
- [x] ~~**Placeholder VIDEO en servicios** (sección Testimonios, arriba del badge Google)~~ — **HECHO 2026-07-08**: Short YouTube `xl4GR_wP-Bg` embebido, vertical 9:16.

**Google reseñas:**
- [ ] **Confirmar URL de la ficha de Google** — hoy el botón apunta a `https://www.google.com/maps/place/SERVIMIL+COLOMBIA` (búsqueda por nombre, no la ficha canónica). Cuando el cliente pase el link exacto de su Google Business, cambiarlo en el badge de `servicios.astro`.

**Verificaciones / infra:**
- [x] ~~**Verificar en vivo** que el WhatsApp nuevo (`573181626167`) se sirve en **producción**~~ — **HECHO 2026-09-12**: confirmado en `servimil.pages.dev`, un solo número en todo el sitio.
- [x] ~~**Fórmula real de la calculadora**~~ — **HECHO** (commit `7da2aee`): 1.99% m.v. + aporte $45.600, dos líneas, plazos 12–36 paso 2. Verificada en dev 2026-07-03 (ver tabla de números arriba). Queda solo la validación con Julián (arriba).
- [ ] **Conectar dominio `servimil.co`** a Cloudflare Pages.
- [ ] **Imagen real** fondo `CierreEmocional.astro` (Home) → Cloudinary.

**Deuda técnica (arrastrada):**
- Componentes huérfanos sin uso: `Servicios`, `Bienestar`, `NuevosServicios`, `ResumenServicios`, `TrustBar`. Limpiar.
- Dep `three` en `package.json` sin uso (esfera 3D eliminada). Considerar quitar.
- ⚠️ **Deploy Windows:** `npm run deploy` a veces crashea (`src\win\async.c, line 76`, bug libuv, NO del código). Workaround: `npm run build` y luego `npx wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true` por separado.

- [x] ~~Fotos reales servicios (zig-zag)~~ — **HECHO** (`DETALLE.img`), 8/8 + Crédito fácil.

## Estado / último avance (al 2026-09-12) — QA completa + MÓVIL ⚠️

Todo commiteado, pusheado a `main` y **desplegado a producción** (verificado en vivo).

### Commits del día

- ✅ **`5ca8a3a`** **QA: 5 hallazgos de auditoría corregidos.** (1) **Logo** `href="#top"` no llevaba a ningún lado en páginas internas (`#top` solo existe en `Hero.astro`) → ahora `#top` en Home y `/` en el resto. (2) **Scroll horizontal en /conocenos**: la sección "Quiénes somos" era la única sin `overflow-hidden` y su hijo `data-reveal="right"` parte en `translateX(48px)`. (3) **`<h1>` faltante** en /servicios y /testimonios (h2→h1 en `Ecosistema.astro` y `Testimonios.astro`; sin cambio visual, el preflight de Tailwind hereda tamaño/peso). (4) **`og:image` + canonical** en `Base.astro` (al compartir por WhatsApp salía sin vista previa). (5) `aria-hidden` en la imagen decorativa de conócenos. Además `scroll-margin-top` de las tarjetas de plan 110→150px.
- ✅ **`c202878`** **MÓVIL: optimización completa sin tocar el desktop** (ver sección "Móvil" abajo).
- ✅ **`e8d28e1`** **Heroes: video liviano en móvil**, calidad original en desktop.
- ✅ **`06db1da`** **`preload="none"`** en el video de testimonio de /servicios.

### Móvil — cómo se hizo (patrón a seguir de aquí en adelante)

**Regla:** todo con variantes **`max-sm:`** (< 640px) o `max-[360px]:`, que solo existen por debajo del breakpoint → el desktop no se toca. Si hay que cambiar una clase base, solo cuando ya existe un `sm:` que restaura el valor de desktop (ej. `gap-14 sm:gap-24`).

Cambios aplicados:
- **Botón flotante** (`CreditWidget.astro`): en móvil pasa a **círculo 56×56** (`max-sm:h-14 max-sm:w-14 max-sm:p-0 …`). Ocupaba **55-65% del ancho** y tapaba el botón "Afíliate ahora" de las tarjetas de plan. El texto queda en un `<span class="max-sm:sr-only">` → el nombre accesible no cambia.
- **Áreas táctiles ≥44px** (mínimo Apple HIG): dots del carrusel (eran 10×10), enlaces de la cinta marquee (27px de alto), flecha del hero de servicios, teléfono/dirección/redes del footer, logo, botón del menú del hero, ítems de `ValorContador`. ⚠️ En los dots se usa `max-sm:box-content max-sm:bg-clip-content max-sm:p-[17px]` para agrandar el área sin agrandar el punto; **por eso `.tst-dot.is-active` usa `background-color` y NO el shorthand `background`** (el shorthand resetea `background-clip` y pintaría los 44px enteros de naranja).
- **`<select>` de cuotas a 16px en móvil** (`max-sm:text-[16px]`): Safari iOS hace **zoom automático** al enfocar cualquier control con fuente < 16px.
- **Panel de la calculadora** `max-h-[92vh]` → **`92svh`** (la barra de direcciones de Safari cortaba el contenido; en desktop `svh == vh`).
- **Texto < 14px** subido en móvil (19 clases). Los micro-rótulos en mayúscula se dejan en 13px a propósito, para no deformar las pastillas.
- **Carrusel de testimonios**: en móvil las flechas se **superponen** sobre los bordes del video (`max-sm:absolute`) en vez de ocupar fila propia → el video pasa de 215px a **315px** (y de 160 a 272px en pantallas de 320px).
- **Header angosto**: `max-sm:gap-3`, pastilla de WhatsApp como círculo (`max-sm:px-3`) y logo a 28px por debajo de 360px (`max-[360px]:[&_img]:h-7`). Antes, a 320px **la hamburguesa se salía ~30px del viewport** (no se detectaba como overflow por ser `fixed`).
- **Zig-zag servicios** `gap-20` → `gap-14 sm:gap-24` (~190px menos de scroll).

### ⚠️ PESO EN DATOS MÓVILES — dos trampas encontradas

1. **Videos de hero con `autoplay`**: se descargaban COMPLETOS en celular (Home 5,3 MB, Conócenos 8,7 MB). Solución: **segunda URL de Cloudinary con `w_720,q_auto`** + el script del hero elige según `(max-width: 767px)`. Atributo **`data-src-mobile`** en el `<source>` de `Hero.astro` y `conocenos.astro`. El hero **sigue siendo video** en móvil (no se cambió por imagen); no se nota porque va detrás de un overlay navy al 58%. **Desktop sirve la URL original sin `q_auto/f_auto`, que es la calidad que pidió el cliente.**
2. ⚠️ **Cloudflare Pages NO soporta peticiones Range** en archivos estáticos: a un `Range:` responde **`200` con el archivo entero** (no `206`) y sin `Accept-Ranges`. Por eso `preload="metadata"` en **`public/videos/testimonio-servimil.mp4`** bajaba los **5,5 MB completos en cada visita** a /servicios. Solución: **`preload="none"`** (el `poster` ya estaba, así que se ve igual y descarga solo al tocar play). **Los videos de Cloudinary NO tienen este problema** (responden `206` correctamente). **Regla: cualquier video servido desde `public/` va con `preload="none"`; si necesita `metadata`, súbelo a Cloudinary.**
   - ⚠️ **Al medir peso, hazlo contra PRODUCCIÓN**: en local `astro preview` sí responde a Range, así que este bug es invisible en dev (0,27 MB en local vs 5,71 MB en prod).

### Resultados medidos (bytes reales, CDP, perfil iPhone 14 Pro, contra producción)

| Página | Datos móviles antes | después | Desktop |
|---|---|---|---|
| `/` | 5,51 MB | **0,69 MB** | 6,27 MB (original, sin cambios) |
| `/conocenos` | 11,18 MB | **0,84 MB** | 8,88 MB (original, sin cambios) |
| `/servicios` | 5,71 MB | **0,18 MB** | sin cambios |
| `/testimonios` | 0,30 MB | 0,30 MB | sin cambios |

| Medida (iPhone SE / 14 Pro / Pixel 7 / 320px) | Antes | Ahora |
|---|---|---|
| Áreas táctiles < 44px | 9 / 7 / 42 / 13 por página | **0 en las 16 combinaciones** |
| Texto < 14px | 7 / 9 / 26 / 1 | 3 / 1 / 3 / 0 (micro-rótulos intencionales) |
| Botón flotante | 55-65% del ancho | **14-18%** |
| Scroll horizontal | 4 casos en /conocenos | **0 en 16 combinaciones** |

### 🔬 Cómo probar que NO se dañó el desktop (método, reutilizable)

Comparar capturas **NO sirve**: el contador animado hace que la misma página difiera consigo misma (home-1280 daba 2436 px de diferencia contra sí misma). Lo que sí sirve:

**Diff de geometría y estilos calculados.** Se recorren todos los elementos (`body *`) y se serializa `tagName | x | y | width | height | fontSize | color | backgroundColor | display | padding | margin | backgroundClip`, a 1280 y 1440px, con `reducedMotion: 'reduce'`. Se compara contra un build del código anterior (`git stash` → build → capturar → `git stash pop` → build). Resultado exigido: **0 cambios**.

- Resultado de esta tanda: **0 cambios** en los 341 / 302 / 762 / 184 elementos de cada página. Único nodo nuevo: el `<span>` del botón flotante, misma posición y estilos.
- Ojo: el campo `margin` de los elementos con `mx-auto` **fluctúa entre corridas idénticas** (Chrome a veces reporta el valor usado de `margin:auto` y a veces `0px`). No es una regresión — verificar siempre con una segunda corrida del MISMO código antes de perseguir una diferencia.

### Para retomar (2026-09-13)
- **Validar cuota calculadora** contra `cotizar.py` de Julián (único pendiente real de negocio).
- **URL real ficha Google** cuando el cliente la pase (badge en `servicios.astro`).
- **Video real Testimonios Home** + botón "Conoce más" → `/testimonios`.
- **Dominio `servimil.co`** a Cloudflare Pages.
- **Imagen real** fondo `CierreEmocional.astro` (Home).
- **Limpieza:** componentes huérfanos (`Servicios`, `Bienestar`, `NuevosServicios`, `ResumenServicios`, `TrustBar`) + dep `three`.
- Preguntar si también se quita la nota legal de planes del **Home** (`Planes.astro`).
- Opcionales evaluados y **descartados por poca ganancia**: `srcset` en 6 imágenes (ya tienen `q_auto/f_auto`, el ahorro real son decenas de KB) y reducir el alto de /servicios en móvil (12.700px — exige reestructurar y cambia lo que el cliente ya aprobó).

## Estado / avance previo (al 2026-07-16) — carrusel de testimonios

Todo commiteado y pusheado a `main`, deploy a producción hecho.

- ✅ **`95ce6f2`** **Testimonios (página): grid 3×2 → CARRUSEL** de videos. Un vertical 9:16 a la vez (~315px ancho / máx 560px alto), flechas ‹ › circulares (blancas → naranja al hover), 6 dots clickeables (activo naranja), track `translateX` con transición suave (respeta reduced-motion), **pausa automática de los videos no visibles al cambiar**. Mismos 6 videos Cloudinary. Encabezado, fondo beige y CTA navy intactos. Detalle en la sección "Testimonios".

### Para retomar (2026-07-17)
- **Validar cuota calculadora** contra `cotizar.py` de Julián (total y aporte ya NO se muestran, solo la cuota).
- **URL real ficha Google** cuando el cliente la pase (badge en servicios.astro).
- **Video real Testimonios Home** + botón "Conoce más" → `/testimonios` (único video pendiente).
- **Dominio `servimil.co`** a Cloudflare Pages.
- **Imagen real** fondo `CierreEmocional.astro` (Home).
- **Limpieza:** componentes huérfanos (`Servicios`, `Bienestar`, `NuevosServicios`, `ResumenServicios`, `TrustBar`) + dep `three`.
- Preguntar si también se quita la nota legal de planes del **Home** (`Planes.astro`).

## Estado / avance previo (al 2026-07-15) — tanda grande de ajustes del cliente

Todo commiteado y pusheado a `main`, deploy a producción tras cada cambio (build + wrangler por separado, workaround libuv). Commits del día, en orden:

- ✅ **`8babdad`** Tanda de 6 ajustes: (1) teléfono contacto en footer (luego eliminado, ver `4dbcb6f`); (2) dirección en footer; (3) **"asistencia jurídica" → "asesoría jurídica" en TODO el sitio** (servicios.astro: cinta+mapa anclas+título+alt+3 planes; site.ts ×2; Base.astro meta; ValorContador Home quedó "Asesoría jurídica y asistencia financiera"). Anclas `#asistencia-juridica` NO cambiaron; (4) iframe YouTube con `modestbranding` (insuficiente, ver `fedebac`); (5)+(6) **Calculadora: líneas "Total estimado a pagar" y nota del aporte $45.600 OCULTAS con `hidden`** (solo visual, comentario reversible; `payment()` intacto — cuota verificada IDÉNTICA: $1M/12=$140.102).
- ✅ **`bc0005b`** Footer: dirección real **"Cra 7C # 125-36, Bogotá, Colombia"** (ícono pin SVG inline).
- ✅ **`fedebac`** **Servicios/Testimonios: video nativo mp4 propio** en vez del iframe YouTube (el embed superponía título "IMG 1870" + canal "RAPPI CREDIT", imposible ocultar por parámetros). Short descargado con yt-dlp (720×1280, 1:23, 5.5MB) → **`public/videos/testimonio-servimil.mp4`** + poster `.jpg` (servidos por Pages). `<video controls playsinline preload="metadata">`, mismo marco 9:16 `max-w-[360px]`.
- ✅ **`7be7965`** + **`aa6d438`** **Conócenos: FUSIÓN de "Nuestro propósito" + "Propuesta de valor"** en UNA sección con **IMAGEN ESTÁTICA** (los 2 videos de soldado seguidos se veían duplicados). Imagen Cloudinary `v1784133364` (soldado con bandera al atardecer), `object-position:68% center` (soldado a la derecha, bien encuadrado en móvil), overlay navy ~60% (bordes sólidos) + radial naranja. Texto unificado: eyebrow NUESTRO PROPÓSITO → título "Así como tú proteges..." (resaltado naranja "protegemos, respaldamos y acompañamos") → párrafo ("peso del uniforme...", "...GRACIAS" en naranja) → firma "EL COMPROMISO DE SERVIMIL" (sin guion). Encapsulado reversible.
- ✅ **`4dbcb6f`** Footer: eliminado el teléfono `318 162 69 67` — queda SOLO WhatsApp `+57 318 162 6167` + dirección.
- ✅ **`6a10891`→`261a44b`** **Mapa "Encuéntranos"**: iteró (columna cuadradita en footer → revertida → franja full-width tras footer en todas las páginas → **solo Home, ARRIBA del footer**). Estado final: componente **`MapaUbicacion.astro`** renderizado solo en `index.astro` (última sección del main). Banda navy full-width: eyebrow ENCUÉNTRANOS + dirección + iframe Google Maps (pin Cra 7C # 125-36, zoom 16) 320/380px alto. **Todo el mapa es clickeable** (iframe `pointer-events-none` envuelto en `<a>` → `google.com/maps/dir` con destino la dirección); pastilla "Toca para ver cómo llegar" se agregó y QUITÓ a pedido.
- ✅ **`60d2a7d`** Footer: la **dirección también es link** a `google.com/maps/dir` (todas las páginas, hover cian).
- ✅ **`b5ec4c0`→`0098ab6`** **Servicios/Planes REESTRUCTURADOS** (v1 desplegable por tarjeta → REHECHA según boceto): tarjetas CORTAS solo con los **4 ítems que cambian** (bono condolencia, mascota, persona 75 años, entretenimiento) + CTA; **un "+" centrado** (círculo naranja glow) y debajo **UNA caja ancha ESTÁTICA "INCLUIDO EN TODOS LOS PLANES"** con los 8 comunes (const **`PLAN_COMUNES`**, textos exactos) en grid 3/2/1 col. Sin nada colapsable.
- ✅ **`6957a66`** Servicios/Planes: **nota legal "Aplican carencias..." QUITADA** (la del Home en `Planes.astro` SIGUE — el cliente no pidió quitarla ahí).
- ✅ **`040f9ac`** Servicios/Viajes (zig-zag): **imagen nueva** (familia con bus moderno, `v1784144890`, q_auto/f_auto), alt actualizado.
- ✅ **`0469b95`** **Conócenos/Respaldo institucional: + CREMIL y CASUR** (6 entidades). Íconos genéricos Lucide **nuevos en `Icon.astro`**: `landmark` (CREMIL) y `piggy-bank` (CASUR). Mismo verde `#9CB04A`. Grid 2/3/6 col (separadores solo lg).

### Para retomar (2026-07-16)
- **Validar cuota calculadora** contra `cotizar.py` de Julián (números en tabla "Calculadora de crédito"; ojo: total y aporte ya NO se muestran, solo la cuota).
- **URL real ficha Google** cuando el cliente la pase (badge en servicios.astro).
- **Video real Testimonios Home** + botón "Conoce más" → `/testimonios` (único video pendiente).
- **Dominio `servimil.co`** a Cloudflare Pages.
- **Imagen real** fondo `CierreEmocional.astro` (Home).
- **Limpieza:** componentes huérfanos (`Servicios`, `Bienestar`, `NuevosServicios`, `ResumenServicios`, `TrustBar`) + dep `three`.
- Preguntar si también se quita la nota legal de planes del **Home** (`Planes.astro`).

### Cambios de referencia rápida (2026-07-15)
- **Calculadora**: total y aporte ocultos con `hidden` en `CreditWidget.astro` (quitar `hidden` para restaurar). Fórmula intacta.
- **Planes servicios**: ítems comunes viven en `PLAN_COMUNES` (frontmatter servicios.astro); los de cada tarjeta en `PLANES[].items` (solo 4).
- **Video testimonio servicios**: archivo local `public/videos/testimonio-servimil.mp4` (NO Cloudinary, NO YouTube).
- **Mapa**: `src/components/MapaUbicacion.astro`, solo en Home.
- **"Asesoría jurídica"** es el término vigente en todo el sitio (no "asistencia jurídica").

## Estado / avance previo (al 2026-07-08) — video real en Servicios/Testimonios

Todo commiteado y pusheado a `main`. Deploy a producción hecho (build + wrangler por separado, workaround libuv).

- ✅ **Servicios/Testimonios: video real** — placeholder blanco "VIDEO" 16:9 → **iframe YouTube Short `xl4GR_wP-Bg`** vertical 9:16 (`aspect-[9/16]`, `max-w-[360px]` centrado, rounded-2xl + sombra, sin autoplay, allowfullscreen, lazy). Encapsulado `{/* === VIDEO TESTIMONIO === */}`.
- ✅ **`4761b58`** (2026-07-06) **Testimonios (página): 6 videos reales Cloudinary** en cards **verticales 9:16** (antes 6 placeholders 16:9 con TODO iframe YouTube). `<video>` nativo con `controls`/`playsinline`/`preload="metadata"`/sin autoplay, poster `so_0,f_jpg`, `f_auto,q_auto` (los 2 `.mov` se transcodifican solos). Grid 3×2 con `max-w` por breakpoint. Encabezado, fondo beige y CTA navy intactos. Detalle completo en la sección Testimonios.

### Para retomar
- **Validar cuota calculadora** contra `cotizar.py` de Julián.
- **URL real ficha Google** cuando el cliente la pase.
- **Videos pendientes:** Testimonios Home (los de `/testimonios` y el de Servicios YA están).
- **Dominio `servimil.co`** a Cloudflare Pages.
- **Limpieza:** componentes huérfanos + dep `three`.

## Estado / avance previo (al 2026-07-03) — calculadora solo $1M + testimonios Google + hover valores

Todo commiteado y pusheado a `main` (`github.com/Marlonoficial777/sitio-web-servimil`). Working tree limpio. Cada cambio con `npm run build` + `npx wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true` (workaround libuv). Commits del día, en orden:

- ✅ **`96a961b`** docs: calculadora marcada HECHA + sync pendientes (typos Home + nota legal planes ya estaban resueltos).
- ✅ **`01a2b27`** **Calculadora: SOLO presta hasta $1.000.000.** Slider `max` $50M → **$1M**, `defaultMonto $500k`. **Línea 2 eliminada** (ya no hay montos > $1M): fuera `line1Max`, `line2Box`, `lineaTag`, `PILL_L1/L2`, lógica `esLinea1`; `line1Payment`→`payment`. Siempre calcula (francesa 1.99% m.v. + $45.600). Mantiene aviso legal + nota aporte + requisitos + CTA.
- ✅ **`f4506d8`** **Conócenos/Valores:** las 4 cards → **borde naranja + glow al hover/active/focus-within** (`.val-card`, scoped, reversible). Conserva rayita superior, elevación, contenido.
- ✅ **`3dd5974`** **Servicios/Testimonios:** **quita widget Trustindex** (prueba de 7 días vencida → mensaje rojo) → **badge Google propio** (SVG logo + 4.7 + estrellas + botón).
- ✅ **`95db0e9`** Badge Google: **enlace real** `https://www.google.com/maps/place/SERVIMIL+COLOMBIA` + estrellas 4.7 (capa naranja al 94%) + subtexto "Reseñas reales de nuestras familias".
- ✅ **`c4acae7`** **Grid de 4 reseñas reales de Google** (array `RESENAS`) debajo del badge: avatar inicial+color, nombre, 5★ naranja, ícono Google, texto exacto. 2×2 desktop / 1 col móvil, altura pareja.

### Para retomar (2026-07-04)
- **Validar cuota calculadora** contra `cotizar.py` de Julián (números en tabla de la sección "Calculadora de crédito").
- **URL real ficha Google** cuando el cliente la pase (hoy es búsqueda por nombre).
- **Videos reales** testimonios (página `/testimonios` 6 placeholders + Home + placeholder video servicios).
- **Dominio `servimil.co`** a Cloudflare Pages.
- **Limpieza:** componentes huérfanos (`Servicios`, `Bienestar`, `NuevosServicios`, `ResumenServicios`, `TrustBar`) + dep `three` sin uso.

## Estado / avance previo (al 2026-07-02) — RESPALDO GIT + tanda "fuerza pública"

- ✅ **RESPALDO REMOTO (por fin):** todo el trabajo commiteado (`67ef2f3`) y pusheado a **repo privado nuevo** `github.com/Marlonoficial777/sitio-web-servimil`, rama **`main`** (upstream configurado). Antes el working tree llevaba días sin commitear y sin remoto. ⚠️ El repo `mundo-servimil` es OTRO proyecto (OCR/nómina), NO tocar. Deploy prod sigue por `npm run deploy` (repo git ≠ Cloudflare).
- ✅ **Copy "fuerza pública":** "militares"/"Fuerzas Armadas" → **"fuerza pública"** en todo el sitio (Footer, Servicios, Base, `site.ts`, conocenos, servicios) + SEO/meta.
- ✅ **Conócenos:** nombres de las fuerzas en **verde militar** (Respaldo Institucional); **mapa de Colombia (SVG)** en la banda de stats; resaltados de copy ("peso del uniforme" en naranja, "GRACIAS" en mayúscula); sección Valores retitulada **"Lo que no se negocia"**.
- ✅ **Home:** lista de servicios (`ValorContador`) **reordenada + enlazada**; contador con CTA "Escucha algunos testimonios"; **4 razones nuevas** en `PorQue.astro`; **menú desplegable en Hero** (`HeroMenu.astro`); **imagen de familia militar** reemplaza el video del escudo en `PorQue`.
- ✅ **Servicios:** reorg **"Servicios en detalle"** → **9 bloques** (se añadió **"Crédito fácil"** de primero); **imágenes reales nuevas** (banco/jurídica/nómina/crédito/viajes, 8/8 + crédito); **logos de streaming** en Entretenimiento; **planes de mayor a menor** con "MÁS POPULAR" en **Élite**; rótulo de cobertura → **"PROTECCIÓN"**; cinta marquee con indicación de clickeable.
- ✅ **WhatsApp:** número nuevo **`573181626167`** centralizado en `site.ts`.
- ✅ **Testimonios (página):** fondo **beige** + grid de 6 videos placeholder.

## Estado / avance previo (al 2026-06-24, sesión tarde)

- ✅ **PorQue.astro (Home):** video del escudo (col. izq, mix-blend screen) → **video nuevo** `v1782331584` (escudo cian + familia abrazada). Solo cambió `ESCUDO_VIDEO` + `ESCUDO_POSTER`, todo lo demás igual.
- ✅ **Planes.astro (Home, "Elige tu plan"):** (1) 3 **fotos nuevas** (`q_auto/f_auto`, `v1782332339/337/341`). (2) Destacado "MÁS POPULAR" + "El preferido por las familias" + borde/glow naranja + botón naranja **movido de Plus Superior → ELITE** (`popular: true` ahora en Élite). (3) **Hover/click sutil** en las 3 cards: `hover:border-orange/60` + glow naranja suave + `-translate-y-2`; `active:scale-[.99]` + `active:border-orange`; `cursor-pointer` + link estirado (`after:absolute after:inset-0`) → card entera navega a `/servicios#plan-...`.
- ✅ **servicios.astro ("Nuestros planes"):** (1) "MÁS POPULAR"/tagline/borde naranja/botón naranja **movido de Plus Superior → ELITE** (`popular`+`tagline` en Élite). (2) **Mismo patrón hover/click sutil** que Home (naranja `border-orange/50` + glow + active + cursor-pointer + link estirado `after:inset-0` → toda la card va a WhatsApp). (3) **Las 3 tarjetas ahora con lista COMPLETA** (12 ítems c/u, datos exactos del usuario) — se quitó el patrón "Todo lo del Plan X, y además:" (`intro` ya no se usa en ningún plan; el bloque `{p.intro && ...}` queda inerte). Igual altura: `items-stretch` + `ul flex-1` + botón `mt-auto`.
- ✅ **servicios.astro (zig-zag "Servicios en detalle"):** **7 de 8 fotos** reemplazadas por imágenes más realistas (`v1782334xxx`, `q_auto/f_auto`). **Falta Viajes** (ver PENDIENTES).
- ✅ **CtaFinal.astro (Home):** botón **"Regístrate" QUITADO** (quedan WhatsApp + "Solicita tu crédito"). Import `REGISTER_HREF` removido (sin uso). Const `REGISTER_HREF` sigue en `site.ts`.
- ⚠️ **Deploy wrangler en Windows:** `npm run deploy` a veces crashea con `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76` (bug libuv/Node, NO del código) — el `astro build` ya pasó. **Workaround:** correr build y deploy por separado → `npm run build` y luego `npx wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true`. Funcionó siempre.
- ⚠️ Git: sigue **SIN commitear** (working tree muy sucio, sin remoto). **Pendiente commit grande.**

## Estado / avance previo (al 2026-06-24)

- ✅ **Footer:** quitado el enlace `www.servimil.co` (la marca aún no tiene el dominio en vivo). Const `WEBSITE` sigue en `site.ts` sin uso (dejada por si se conecta el dominio).
- ✅ **Footer redes:** íconos **Facebook** e **Instagram** ahora clickeables → `facebook.com/share/1UFsiqQa7w/` y `instagram.com/servimil.col` (`target="_blank"` + `rel="noopener noreferrer"`). Aplica a las 4 páginas (footer compartido).
- ✅ **Testimonios (página):** fondo cambiado a **BEIGE `#EAE5DD`** (degradado sutil + blobs naranja tenues), eyebrow naranja agrandado, cards blancas con borde superior naranja. Ver sección Testimonios arriba.
- ⚠️ **WhatsApp:** número VIGENTE ahora **573181626167** (`+57 318 162 6167`) — cambiado en todo el sitio 2026-06-25 (vía `site.ts` `WHATSAPP_NUMBER`/`WHATSAPP_DISPLAY` + hardcodes en `servicios.astro` y `Testimonios.astro`). Antes era 573157019885; quedó obsoleto.
- ⚠️ **Hero Home:** se probó quitar el video y dejar fondo blanco (+ texto navy + `solidHeader`) y se **revirtió** a pedido → video Cloudinary + header transparente como antes. Sin cambios netos en Hero.
- ⚠️ Git: sigue **SIN commitear** (working tree muy sucio, sin remoto). **Pendiente commit grande.**

## Estado / avance previo (al 2026-06-23)

- ✅ **Servicios — Servicios en detalle:** 8 placeholders → **fotos reales** Cloudinary + animaciones premium (stagger texto, zoom hover imagen, parallax decor, ícono rebote). Bloques con `id` + `scroll-margin`.
- ✅ **Cinta marquee CLICKEABLE** → ancla a cada bloque zig-zag (mapa `CINTA_LINK`, ambos sets).
- ✅ **Servicios — sección Testimonios (Trustindex)** nueva: fondo navy, título "TESTIMONIOS", placeholder VIDEO 16:9 + widget Google Reviews. (Intento de marquee de las cards → revertido.)
- ✅ **Planes deep-link Home → Servicios:** botones "Más información" → `/servicios#plan-...` + **highlight de llegada** (`.plan-highlight`, glow naranja 2s).
- ✅ **Home lista ValorContador CLICKEABLE** → `/servicios#ancla`. **TrustBar QUITADO** del Home.
- ✅ **Conócenos:** "Nuestro propósito" y "Propuesta de valor" → **fondo VIDEO** Cloudinary (poster = imagen previa, `preload=metadata`). Ken Burns/sway fuera en esas 2.
- ✅ **Testimonios (página) REESCRITA:** carrusel de citas fuera → grid 6 placeholders video + CTA navy "Contáctanos por WhatsApp".
- ⚠️ Git: sigue **SIN commitear** (working tree muy sucio, sin remoto). **Pendiente commit grande.**

## Estado / avance previo (al 2026-06-22)

- ✅ **Conócenos rediseñado a fondo:** "Quiénes somos" con imagen real + bloque decorativo + reveal lateral; "Nuestro propósito" banda cinematográfica (imagen Cloudinary + **Ken Burns** + overlay navy); "Propuesta de valor" clímax (imagen épica + Ken Burns + glow naranja + firma "El compromiso de Servimil"); "Nuestros Valores" fondo **aurora CSS** (blobs + dots, sin fotos) + cards glassmorphism + íconos con micro-anim (heartbeat/tic-tac); "Respaldo institucional" banda navy + escudo marca de agua + 4 fuerzas (star/anchor/plane/shield). Stat "+3 años" quitado. Transiciones entre secciones afinadas (cortes limpios / fusiones a `#011126`).
- ✅ **Servicios rediseñado** (ver sección Servicios arriba): hero video full-screen + cinta marquee + planes + zig-zag detalle. Esfera 3D y acordeón **eliminados**.
- ✅ Íconos nuevos en `Icon.astro`: `activity`, `star`, `anchor`. Keyframes `kenBurns` + variantes `data-reveal="left|right"` en `global.css`.
- ✅ Sitio vivo: https://servimil.pages.dev (deploy directo a prod `--branch=main`).
- ⚠️ Git: cambios SIN commitear (working tree sucio). Repo local sin remoto. **Pendiente commitear avance grande.**
- ⚠️ Deploy: la subida a Cloudflare a veces tarda ~5 min (correr en background).

### Próximos pasos (mañana, 2026-06-24)

- **Videos reales testimonios:** meter 6 `<iframe>` YouTube en `components/Testimonios.astro` + video real en placeholder VIDEO de servicios (Trustindex).
- **Imagen real** fondo `CierreEmocional.astro` (Home).
- Atacar PENDIENTES (fórmula calculadora, dominio `servimil.co`).
- **Commitear** el avance grande (working tree muy sucio, sin remoto).
- Limpiar componentes huérfanos (Servicios, Bienestar, NuevosServicios, ResumenServicios, **TrustBar** ya sin uso) + considerar quitar dep `three` (sin uso).

## Notas

- ⚠️ **MÓVIL — regla fija (desde 2026-09-12):** todo ajuste para celular se hace con **`max-sm:`** (< 640px) o `max-[360px]:`, nunca tocando la clase base. Solo se cambia una clase base cuando ya existe un `sm:` que restaura el valor de desktop (ej. `gap-14 sm:gap-24`). Así el desktop queda intacto por construcción.
- ⚠️ **Videos en `public/`:** siempre **`preload="none"`** — Cloudflare Pages no soporta Range y con `metadata` el navegador se baja el archivo entero. Si hace falta `metadata`, súbelo a Cloudinary.
- ⚠️ **Medir peso siempre contra PRODUCCIÓN**, no contra `astro preview` (en local sí hay Range y el problema anterior es invisible).
- Animaciones respetan `prefers-reduced-motion`.
- Íconos: agregar en `Icon.astro`, referenciar por `name` desde `site.ts`.
- Repo git local (sin remoto aún). Commit en cada cambio para respaldo.
