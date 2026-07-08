# Servimil — Sitio Web

Sitio web de marketing de **SERVIMIL**: servicios y beneficios para la fuerza pública de Colombia y sus familias (bono de condolencia, asistencia financiera y jurídica, salud y bienestar, calculadora de crédito).

- **Producción:** https://servimil.pages.dev (dominio de negocio `servimil.co` pendiente de conectar)
- **Stack:** [Astro 5](https://astro.build) (sitio estático) + [Tailwind CSS v4](https://tailwindcss.com) (vía `@tailwindcss/vite`, tokens en `src/styles/global.css`, sin `tailwind.config`)
- **Hosting:** Cloudflare Pages (proyecto `servimil`), deploy con Wrangler 4

> 📖 **Contexto completo del proyecto** (historial, decisiones de diseño, detalle por sección y pendientes): ver **[`CLAUDE.md`](./CLAUDE.md)**. Este README es el arranque rápido; aquel es la fuente de verdad detallada.

## Estructura del sitio

Sitio **multipágina** (no one-page). El menú navega entre páginas:

| Ruta | Archivo | Contenido |
|------|---------|-----------|
| `/` | `src/pages/index.astro` | Home: hero con video, contador, planes, CTA |
| `/conocenos` | `src/pages/conocenos.astro` | Quiénes somos, misión, valores |
| `/servicios` | `src/pages/servicios.astro` | Planes, servicios en detalle (zig-zag), testimonios Google |
| `/testimonios` | `src/pages/testimonios.astro` | Grid de 6 videos reales + CTA |

Lugares clave para editar:

- **Contenido / contacto / configuración de la calculadora:** `src/lib/site.ts`
- **Fórmula del crédito:** `src/components/CreditWidget.astro` (función `payment()`)
- **Paleta / tipografía / estilos globales:** `src/styles/global.css`
- **Layout compartido:** `src/layouts/Page.astro` (Header + Footer + widget de crédito)

## Cómo arrancarlo

Requisitos: Node.js 18+ y npm.

```bash
git clone https://github.com/Marlonoficial777/sitio-web-servimil.git
cd sitio-web-servimil
npm install
npm run dev        # desarrollo local (http://localhost:4321)
```

Scripts disponibles:

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción → dist/
npm run preview    # previsualizar el build localmente
npm run deploy     # build + deploy DIRECTO a producción
```

## Deploy ⚠️ IMPORTANTE

**Producción = rama `main` → https://servimil.pages.dev**

```bash
npm run deploy
```

Equivale a: `astro build && wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true`

Reglas críticas:

- **SIEMPRE `--branch=main`.** NUNCA usar `master` ni omitir `--branch` al correr wrangler a mano: eso publica a entorno **Preview** (URL `*.servimil.pages.dev` de preview) y NO actualiza producción. Ya pasó una vez.
- Cuenta de Cloudflare: `rappicreditcolombia`, proyecto `servimil`. Necesitas estar autenticado en wrangler con acceso a esa cuenta.
- El repositorio git y el deploy son independientes: Cloudflare Pages **no** hace deploy automático desde GitHub; se despliega manualmente con wrangler.

### Workaround bug de deploy en Windows (libuv)

En Windows, `npm run deploy` a veces crashea con `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76` (bug de libuv/Node, no del código). Si pasa, correr build y deploy por separado:

```bash
npm run build
npx wrangler pages deploy dist --project-name=servimil --branch=main --commit-dirty=true
```

## Marca (no cambiar)

Paleta definida como tokens `@theme` en `src/styles/global.css` (clases `bg-navy`, `text-orange`, etc.):

| Token | Hex | Uso |
|-------|-----|-----|
| `navy` | `#011126` | Azul oscuro: fondos, header con scroll, footer, títulos |
| `orange` | `#F34616` | Naranja: CTAs clave, badges, botón flotante |
| `cyan` | `#96DDED` | Cian: íconos, detalles, hover |
| `ice` | `#E8F3F9` | Azul claro: fondos de secciones/cards |
| `beige` | `#EAE5DD` | Beige: fondos de respiro alternos |

Tipografía: **Poppins** (fallback `ui-sans-serif, system-ui, sans-serif`).

## Assets

- **Imágenes y videos:** alojados en **Cloudinary** (cloud `dzh85ye7y`). Las URLs usan transformaciones como `q_auto/f_auto` (optimización), `e_trim` (logo) y `so_0,f_jpg` (posters = fotograma 0 del video).
- **Videos pesados/largos:** van embebidos desde **YouTube** (iframe, ej. el testimonio en `/servicios`).

## Estado y pendientes (resumen)

Detalle completo y actualizado en la sección "PENDIENTES ABIERTOS" de [`CLAUDE.md`](./CLAUDE.md). En breve:

- [ ] **Validar cifras de la calculadora de crédito con Julián** — comparar los resultados de la web contra su script `cotizar.py` (fórmula ya implementada: amortización francesa 1.99% m.v. + aporte administrativo $45.600; falta el visto bueno numérico del cliente).
- [ ] **Conectar el dominio `servimil.co`** a Cloudflare Pages (hoy solo `servimil.pages.dev`).
- [ ] **Autorización escrita para el uso de logos** de terceros (p. ej. plataformas de streaming en la sección Entretenimiento) — *pendiente de confirmar con el cliente*.
- [ ] **Video real de testimonios en el Home** + botón "Conoce más" → `/testimonios` (los videos de `/testimonios` y el de `/servicios` ya están).
- [ ] **Confirmar la URL exacta de la ficha de Google Business** — hoy el badge de reseñas en `/servicios` apunta a una búsqueda por nombre en Google Maps, no a la ficha canónica.
- [ ] **Imagen real** de fondo en `CierreEmocional.astro` (Home) — hoy placeholder.
- [ ] **Limpieza de deuda técnica:** componentes huérfanos sin uso (`Servicios`, `Bienestar`, `NuevosServicios`, `ResumenServicios`, `TrustBar`) y dependencia `three` en `package.json` sin uso.

## Contacto del negocio

- WhatsApp vigente: `+57 318 162 6167` (centralizado en `src/lib/site.ts`).
