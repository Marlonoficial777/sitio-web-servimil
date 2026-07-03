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

- `/` → **index.astro** (Home)
- `/conocenos` → **conocenos.astro** (quiénes somos, misión, valores, CTA)
- `/servicios` → **servicios.astro** (sección Ecosistema = esfera 3D + acordeón)
- `/testimonios` → **testimonios.astro** (grid de videos + CTA, ver abajo)

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
4. **Nuestro propósito** — banda cinematográfica. **Fondo VIDEO Cloudinary** (2026-06-23, antes imagen Ken Burns): `<video autoplay muted loop playsinline preload="metadata">` + `poster` = la imagen anterior, `object-cover -z-20`. Overlay navy + texto quietos encima.
5. **Propuesta de valor** — clímax. **Fondo VIDEO Cloudinary** (2026-06-23, antes imagen Ken Burns): mismo patrón video+poster. Overlay navy radial naranja + cita grande + firma "El compromiso de Servimil". **Ken Burns y sway eliminados** en estas 2 (el video trae su movimiento). Encapsulado `{/* === FONDO VIDEO === */}`.
6. **Valores** — 4 cards (Compromiso, Transparencia, Cercanía, Disponibilidad).
7. **Para quiénes trabajamos** — frase Ministerio de Defensa.
8. **CTA final** — "Escríbenos ahora" (WhatsApp) + "Conoce nuestros servicios" (/servicios).

### Servicios (`servicios.astro`) — REDISEÑADO 2026-06-22 ⚠️
**Ya NO usa esfera 3D ni acordeón.** Three.js quitado de `Ecosistema.astro` (peso muerto fuera; dep `three` sigue en package.json sin uso). Orden actual:
1. **Hero** (`Ecosistema.astro`) — **video de fondo a pantalla completa** (`min-h-100svh`) de familia viendo película (Cloudinary, cálido). Capas: video `z-0` → overlay **NEGRO neutro** `rgba(0,0,0,~.55)` `z-[1]` (NO navy, para conservar tonos cálidos) → contenido `z-10`. Header **transparente** sobre el video (sin `solidHeader`). Texto centrado: eyebrow blanco "NUESTROS SERVICIOS" + título + subtítulo + flecha bounce decorativa. Video carga por JS solo si NO reduced-motion y NO móvil (`<768px` = solo poster `so_0`).
2. **Cinta marquee** (en `servicios.astro`) — UNA sola banda recta naranja `#F34616`, texto blanco mayúsculas, separador ✦, loop R→L 48s, `mask-image` fade en bordes, hover pausa. Array `CINTA`. **CLICKEABLE** (2026-06-23): cada nombre con bloque equivalente es `<a href="#id">` (mapa `CINTA_LINK` nombre→id; ambos sets del loop tienen enlaces). Scroll suave (global) + `scroll-margin-top:100px` en bloques. "Tecnología" sin bloque = texto plano. `.marquee-link` hover subrayado/opacidad.
3. **Nuestros planes** — 3 cards (array `PLANES`): Plus $39.900 / **Plus Superior $49.900 destacada "MÁS POPULAR"** / Élite $59.900. Precio grande, caja cobertura bono cian, checks, botón "Afíliate ahora" → `WHATSAPP` (wa.me/573181626167). Eyebrow blanco. **ids** `plan-plus / plan-plus-superior / plan-elite` + `scroll-margin-top:110px` (destino de los botones del Home). **Highlight de llegada**: script lee `location.hash` en `load`/`hashchange` → clase `.plan-highlight` (glow+borde naranja+scale, anim `planArrive` 2s una vez, autolimpia en `animationend`).
4. **Servicios en detalle (zig-zag)** — 8 bloques alternados texto↔**foto real 4:3** (array `DETALLE`, campo `img` Cloudinary `q_auto/f_auto`): Bono, Asistencia financiera, Jurídica, Nómina, Seguros y auxilios, Entretenimiento, Bienestar y salud, Viajes. **Fotos reales puestas 2026-06-23.** Cada bloque con `id` (array `DETALLE_IDS`) + `scroll-margin-top:100px` (destino de cinta + lista Home). Reveal lateral opuesto (`data-reveal="left|right"`). **Animaciones premium**: stagger interno del texto (`.det-stagger` `--det-i`), hover imagen zoom `scale(1.05)` (`overflow-hidden`) + sombra ↑, parallax sutil del bloque decorativo (`.det-decor`), ícono entrada `scale`+rebote. Todo respeta reduced-motion. Eyebrow blanco.
5. **Testimonios (Trustindex)** (2026-06-23) — tras "Servicios en detalle", antes del footer. Fondo **navy `#011126`**. Título único "TESTIMONIOS" blanco extrabold (32/40/46px). Debajo: **placeholder VIDEO 16:9** (`aspect-video`, `max-w-3xl`, bg blanco, comentario TODO iframe). Luego **widget Google Reviews Trustindex**: `<script is:inline defer async src=".../loader.js?5eb6c5b7485b953155662c28bb3">` antes de `</Page>` (sobrevive al build). El widget se inyecta solo (~1s). `max-w-[820px]`, sin caja/sombra (va directo sobre navy). ⚠️ Se intentó marquee auto-scroll de las cards → **revertido** (peleaba con el slider de Trustindex, se veía mal).

- **Patrón eyebrow** (repetido a pedido del usuario): eyebrows de sección en **blanco** `text-[16px] sm:text-[18px]` (no cian, no 13px).
- **Patrón reveal lateral**: `data-reveal="left"` / `"right"` (translateX ±48px) definido en `global.css` (junto al `data-reveal` base). Usado en conocenos ("Quiénes somos") y servicios (zig-zag).

### Testimonios (`testimonios.astro` + `components/Testimonios.astro`) — REESCRITO 2026-06-23, FONDO BEIGE 2026-06-24 ⚠️
**Ya NO es carrusel de citas en texto.** Se eliminó la card con comilla + cita + nombre/rol + controles ‹ N/N › y su script (y los imports `Icon`/`TESTIMONIOS`). Ahora:
1. **Encabezado** — eyebrow "TESTIMONIOS" **naranja** `text-[16px] sm:text-[18px]` (agrandado 2026-06-24, antes 13px gris) + título grande "La voz de quienes ya nos eligieron" **navy** (`40/52/60px`).
2. **Grid 6 placeholders de video** — `aspect-video`, 3 col desktop / 2 tablet / 1 móvil, `rounded-2xl`, **fondo BLANCO** + sombra suave de elevación + **borde superior 2px naranja** (`border-t-2 border-orange/70`), "VIDEO" naranja tenue (`text-orange/40`), reveal con stagger. Cada uno con comentario `{/* TODO: reemplazar por <iframe> de YouTube del testimonio N */}` + ejemplo iframe. → **pendiente videos reales**.
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
- z-index: video `-z-20`, overlay `-z-10`, contenido `z-10`.

## Calculadora de crédito (`CreditWidget.astro`)

- Botón flotante naranja **"Analiza tu crédito"** (abajo-derecha, `z-50`) → abre modal accesible en la misma página (slider monto + select cuotas → cuota mensual estimada + total + CTA WhatsApp).
- **FÓRMULA REAL (HECHA, commit `7da2aee`) — DOS LÍNEAS:**
  - **Línea 1** (monto ≤ `line1Max` = $1.000.000, convenio Servimil): amortización francesa `cuota_credito = P·i(1+i)^n / [(1+i)^n − 1]` con `i = monthlyRate = 0.0199` (1.99% m.v.), **+ `aporteAdmin = $45.600`** (cuota SICOD) sumado a CADA cuota. `total = cuota_total · n`. Formato COP `Intl.NumberFormat("es-CO")`. Función `line1Payment(P,n)` en `CreditWidget.astro`.
  - **Línea 2** (monto > $1.000.000): NO calcula; muestra `line2Box` (mensaje aliados: compra de cartera / libre inversión / refinanciación) + CTA WhatsApp destacado.
  - **Plazos** (`CREDIT_CONFIG.plazos`): `12,14,…,36` (de 2 en 2). Aviso legal "Cálculo de referencia…" visible.
  - Condiciones en `src/lib/site.ts` → `CREDIT_CONFIG` (`monthlyRate`, `aporteAdmin`, `line1Max`, `plazos`). **Único lugar a tocar si cambian.**
  - ⚠️ **Pendiente validar** los números con un ejemplo verificado de Julián (comparar contra su `cotizar.py`) antes de dar por cerrada la fórmula con el cliente.
- **Números verificados en vivo (dev, 2026-07-03)** — para validar con cliente:
  | Monto | Plazo | Cuota mensual total | Total a pagar |
  |-------|-------|---------------------|---------------|
  | $1.000.000 | 12 | **$140.102** | $1.681.218 |
  | $1.000.000 | 24 | **$98.411**  | $2.361.869 |
  | $500.000   | 12 | **$92.851**  | $1.114.209 |
  | $5.000.000 | — | Línea 2 (no calcula, mensaje aliados) | — |

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
- Usado con `dark` en `Header.astro` y `Footer.astro`. Sigue siendo link a `#top`, con micro-hover.

## Lugares clave para editar

- **Contenido / contacto / datos calculadora:** `src/lib/site.ts` (`SERVICIOS`, `BIENESTAR`, `NUEVOS`, `TESTIMONIOS`, `REQUISITOS`, `CREDIT_CONFIG`, WhatsApp).
- **Fórmula del crédito:** `src/components/CreditWidget.astro` → `line1Payment()` (+ condiciones en `CREDIT_CONFIG` de `site.ts`).
- **Paleta / fuente / estilos globales:** `src/styles/global.css`.

## PENDIENTES ABIERTOS (al 2026-07-03)

**Copy / textos:**
- [x] ~~**Typos Home:** `"logralo"` → `"lograrlo"` y `"aquienes"` → `"a quienes"`~~ — **HECHO** (ya resuelto; `CierreEmocional.astro` dice "lograrlo", copy usa "a/para quienes").
- [x] ~~**Nota legal planes**~~ — **HECHO**: ya dice `"Aplican carencias y condiciones según cada servicio. Consulta términos completos."` en `Planes.astro` y `servicios.astro` (2 planes).

**Calculadora:**
- [ ] **Validar la cuota con un ejemplo verificado de Julián** — comparar el resultado de la web contra su `cotizar.py` (misma fórmula 1.99% m.v. + $45.600). Fórmula YA implementada (commit `7da2aee`); falta el visto bueno numérico del cliente. Casos ya calculados en la sección "Calculadora de crédito".

**Videos:**
- [ ] **Videos reales testimonios:** reemplazar los 6 placeholders VIDEO 16:9 de `components/Testimonios.astro` por `<iframe>` YouTube (estructura `aspect-video` lista, comentario TODO en cada uno).
- [ ] **Video real Testimonios Home** + botón "Conoce más" → `/testimonios`.
- [ ] **Placeholder VIDEO en servicios** (sección Testimonios Trustindex) → video real.

**Verificaciones / infra:**
- [ ] **Verificar en vivo** que el WhatsApp nuevo (`573181626167`) se sirve en **producción** (posible caché CDN de Cloudflare tras el cambio).
- [x] ~~**Fórmula real de la calculadora**~~ — **HECHO** (commit `7da2aee`): 1.99% m.v. + aporte $45.600, dos líneas, plazos 12–36 paso 2. Verificada en dev 2026-07-03 (ver tabla de números arriba). Queda solo la validación con Julián (arriba).
- [ ] **Conectar dominio `servimil.co`** a Cloudflare Pages.
- [ ] **Imagen real** fondo `CierreEmocional.astro` (Home) → Cloudinary.

**Deuda técnica (arrastrada):**
- Componentes huérfanos sin uso: `Servicios`, `Bienestar`, `NuevosServicios`, `ResumenServicios`, `TrustBar`. Limpiar.
- Dep `three` en `package.json` sin uso (esfera 3D eliminada). Considerar quitar.
- ⚠️ **Deploy Windows:** `npm run deploy` a veces crashea (`src\win\async.c, line 76`, bug libuv, NO del código). Workaround: `npm run build` y luego `npx wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true` por separado.

- [x] ~~Fotos reales servicios (zig-zag)~~ — **HECHO** (`DETALLE.img`), 8/8 + Crédito fácil.

## Estado / último avance (al 2026-07-02) — RESPALDO GIT + tanda "fuerza pública"

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

- Animaciones respetan `prefers-reduced-motion`.
- Íconos: agregar en `Icon.astro`, referenciar por `name` desde `site.ts`.
- Repo git local (sin remoto aún). Commit en cada cambio para respaldo.
