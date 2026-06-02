# Plan de actualización - novacode.com.ar

**Fecha:** 2026-06-02
**Stack actual:** Astro 5.1.7 (SSR) · @astrojs/cloudflare 12.2.1 · TypeScript 5.6.3 · Cloudflare Pages
**Descripción:** Sitio institucional de la agencia digital NovaCode (página única, formulario de contacto, 404 y página de gracias).

---

## Etapas a realizar

Marca con `[x]` las etapas que se van a ejecutar. Las que queden sin marcar quedan como referencia/futuro.

- [x] **Etapa 1** — Bugs críticos y funcionalidad rota (🔴)
- [x] **Etapa 2** — Seguridad y configuración del proyecto (🟠)
- [x] **Etapa 3** — Rendimiento y SEO (🟡)
- [x] **Etapa 4** — Accesibilidad (a11y) (🟢)
- [ ] **Etapa 5** — Calidad de código y DX (🔵)
- [ ] **Etapa 6** — Funcionalidades nuevas / opcional (⚪)

## Progreso general

| Etapa | Tareas | Estado |
|-------|--------|--------|
| Etapa 1 — Bugs críticos (🔴) | 8 | ✅ Completada |
| Etapa 2 — Seguridad y config (🟠) | 6 | ✅ Completada |
| Etapa 3 — Rendimiento y SEO (🟡) | 12 | ✅ Completada |
| Etapa 4 — Accesibilidad (a11y) (🟢) | 9 | ✅ Completada |
| Etapa 5 — Calidad y DX (🔵) | 12 | ⏳ Pendiente |
| Etapa 6 — Nuevas funcionalidades (⚪) | 4 | ⏳ Pendiente |
| **Total** | **51** | **35 / 51** |

> Actualizá la columna "Estado" a `🔄 En curso` o `✅ Completada` y el contador `0/51` a medida que avances.

---

## Etapa 1 — Bugs críticos y funcionalidad rota 🔴

> 8 tareas. Impacto directo en producción. **Hacer primero.**

- [x] Corregir URL hardcodeada en `src/components/Contact.astro:52` — el input oculto `_next` apunta a `http://localhost:4321/gracias`. En producción no redirige al dominio real. Reemplazar por `https://novacode.com.ar/gracias` o, mejor, usar `Astro.site` o una variable de entorno.
- [x] Eliminar el archivo huérfano `src/css/styles.css` — no se importa en ningún lado y contiene CSS inválido (`rgb (var(--accent))` con espacios no es sintaxis válida). Está engañando a la búsqueda de estilos del proyecto.
- [x] Eliminar componentes huérfanos no utilizados — `src/components/Card.astro` (del template starter de Astro) e `src/components/Intro.astro` (duplica el contenido de `About.astro`) no se importan en `index.astro`. Borrarlos para no mantener código muerto.
- [x] Corregir el link roto del footer en `src/components/Footer.astro:13` — dice `<a href="#plans">Planes</a>` pero el id real es `planes`. Cambiar a `#planes`.
- [x] Quitar los íconos de Font Awesome del footer (`src/components/Footer.astro:20-23`) — la dependencia Font Awesome **no está declarada ni cargada** en el proyecto, por lo que los `<i class="fa fa-...">` no renderizan nada. Reemplazar por SVGs inline (mismo patrón usado en `Contact.astro`) o eliminar las redes sociales no configuradas.
- [x] Crear o eliminar la referencia a `/logo-novacode.svg` en `src/components/Footer.astro:5` — el archivo no existe en `public/`, por lo que se ve el alt "NovaCode" como texto roto. O subir el logo o quitar la etiqueta `<img>`.
- [x] Corregir la redirección por JS en `src/pages/gracias.astro:87-89` — `setTimeout` con `window.location.href` rompe la accesibilidad (usuarios de lector de pantalla no pueden leer el mensaje antes del redirect, no se puede cancelar) y no es SEO-friendly. Reemplazar por un `<meta http-equiv="refresh">` con tiempo mayor + link visible prominente.
- [x] Migrar el formulario de `formsubmit.co` a una solución propia — usar `astro:actions` (Astro 5) o un endpoint `src/pages/api/contact.ts` que envíe vía Resend/Cloudflare Email Workers. Reduce dependencia de terceros y permite validar y rate-limitar.

---

## Etapa 2 — Seguridad y configuración del proyecto 🟠

> 6 tareas. Endurecer el proyecto y dejarlo listo para producción seria.

- [x] Marcar el paquete como privado en `package.json` — añadir `"private": true` para evitar publicaciones accidentales a npm.
- [x] Mover `@astrojs/check` y `typescript` a `devDependencies` — son herramientas de build, no se necesitan en runtime ni en el bundle de Cloudflare.
- [x] Añadir `"engines": { "node": ">=22.12.0" }` en `package.json` — Astro 6 y `@astrojs/cloudflare` 13 requieren Node 22.12+. También creado `.nvmrc` con la versión exacta.
- [x] Configurar cabeceras de seguridad — implementado en **dos capas**: `src/middleware.ts` para respuestas SSR (CSP, HSTS, X-Frame, X-Content-Type, Referrer-Policy, Permissions-Policy completa, COOP, CORP) y `public/_headers` para assets estáticos (X-Content-Type, Referrer-Policy, X-Frame, COOP, Cache-Control inmutable para `*.css|js|svg|png|jpg|webp|woff2`).
- [x] Crear `.dev.vars` y documentación de variables de entorno — `.dev.vars.example` creado, `PUBLIC_SITE_URL` / `PUBLIC_FROM_EMAIL` / `CONTACT_TO_EMAIL` en `wrangler.jsonc` → `vars`, `RESEND_API_KEY` como secret. `.gitignore` ignora `.dev.vars` y `.wrangler/`.
- [x] ~~Actualizar `functions/_routes.json` a `version: 2`~~ — **N/A**: migramos a Cloudflare Workers; ese archivo ya no se usa (reemplazado por `wrangler.jsonc`).

> **Bonus Etapa 2 — Email real:** El endpoint `/api/contact` ahora envía emails vía **Resend** (con fallback a `console.log` si no hay API key). HTML sanitizado, validación estricta, `reply-to` configurado al email del usuario, `ctx.waitUntil` para no bloquear la response. Para activarlo: `npx wrangler secret put RESEND_API_KEY`.

---

## Etapa 3 — Rendimiento y SEO 🟡

> 12 tareas. Mejorar Core Web Vitals y discoverability.

- [x] Reemplazar la fuente Inter de Google Fonts por una estrategia optimizada — usar `@fontsource-variable/inter` desde npm (self-hosted, sin request externo) o `astro:font` (Astro 5) con `preload` y `font-display: swap` para evitar render-blocking.
- [x] Hacer el meta `description` dinámico por página en `src/layouts/Layout.astro` — actualmente es estático. Añadir `description?: string` y `image?: string` a `Props` y poblar desde cada `.astro` page.
- [x] Añadir Open Graph y Twitter Card en `Layout.astro` — meta `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale=es_AR`, y sus equivalentes Twitter. Importante para compartir en WhatsApp/LinkedIn.
- [x] Añadir `link rel="canonical"` dinámico en `Layout.astro` para evitar contenido duplicado SEO.
- [x] Quitar `<meta name="keywords">` — Google lo ignora desde 2009; ocupa bytes y da una imagen anticuada.
- [x] Añadir `@astrojs/sitemap` e integrarlo en `astro.config.mjs` para generar `sitemap.xml` automáticamente.
- [x] Crear `public/robots.txt` — actualmente no existe. Permitir indexación y apuntar al sitemap.
- [x] Optimizar imágenes con `astro:assets` — el logo del footer y futuros assets deben importarse con `import logo from '../assets/logo.svg'` para que Astro los procese (WebP/AVIF, lazy, srcset).
- [x] Debounce/throttle del listener `scroll` en `src/components/Header.astro:214` — actualmente dispara en cada frame de scroll. Usar `requestAnimationFrame` o un throttle de 100ms.
- [x] Refactorizar `src/layouts/Layout.astro` — el `<style is:global>` es muy grande y se inyecta en cada página. Mover variables CSS y resets a `src/styles/global.css` e importar con `import '../styles/global.css';` en el frontmatter.
- [x] Externalizar las constantes (colores, secciones, redes) a un `src/config/site.ts` — actualmente los colores están hardcodeados en `Layout.astro` y se duplican en `Footer.astro` (`#000`, `#fff`, `#b978cc`, `#ffbb00`). Centralizar.
- [x] Actualizar `astro.config.mjs` a `output: 'static'` + `prerender` por página — el sitio es prácticamente estático; la única ruta "server" potencial es `/api/contact`. Cambiar a `output: 'static'` con `export const prerender = false` solo en el endpoint reduce coste y latencia en Cloudflare Pages.

---

## Etapa 4 — Accesibilidad (a11y) 🟢

> 9 tareas. Cumplir WCAG AA y mejorar la experiencia para usuarios con tecnologías de asistencia.

- [x] Añadir link "Saltar al contenido principal" en `Layout.astro` antes del header (visible al focus, oculto visualmente).
- [x] Añadir `aria-expanded` y `aria-controls` al botón de menú móvil en `Header.astro:8` — para que lectores de pantalla anuncien el estado.
- [x] Hacer que el menú móvil se cierre con la tecla `Escape` y atrape el foco mientras está abierto.
- [x] Añadir `prefers-reduced-motion: reduce` en `@keyframes glitch` de `src/pages/404.astro:47` y en las transiciones del header — la animación puede provocar mareos.
- [x] Marcar el `<option value="">` del select como `<option value="" disabled selected hidden>` en `Contact.astro:66` para que no sea seleccionable y actúe solo como placeholder.
- [x] Asociar `<label>` a cada input del formulario en `Contact.astro:55-75` — actualmente solo hay `placeholder` (no accesible para screen readers y desaparece al escribir). Usar `for` + `id` o envolver con `<label>`.
- [x] Revisar contraste de color — el secundario `#b978cc` sobre fondo negro `#000` falla WCAG AA para texto < 18px. Medir con axe DevTools y oscurecerlo o usarlo solo para elementos grandes/no textuales.
- [x] Añadir `aria-label` a los links de redes sociales del footer (`Footer.astro:20-23`) una vez corregidos.
- [x] Corregir la errata "Tambien somos" → "También somos" en `src/components/About.astro:5`.

---

## Etapa 5 — Calidad de código y DX 🔵

> 12 tareas. Dejar el código mantenible y preparado para el equipo.

- [ ] Crear `src/types/index.ts` con tipos para `Plan`, `Service`, `SocialLink`. Las cards de `Services.astro` y `Plans.astro` deberían iterar arrays tipados, no tener HTML repetido.
- [ ] Refactorizar `src/components/Services.astro` y `src/components/Plans.astro` — los tres `card` están duplicados. Convertir cada uno a un subcomponente `<ServiceCard title="..." icon="...">` que reciba props.
- [ ] Refactorizar `src/components/Contact.astro` — los tres `info-card` están duplicados. Misma estrategia: componente reutilizable.
- [ ] Convertir los SVG inline a un componente `<Icon name="instagram" />` centralizado en `src/components/Icon.astro` con un map `name -> svg`. Reduce peso y facilita el cambio a un set de iconos (Lucide, Tabler) más adelante.
- [ ] Ampliar `tsconfig.json` con `compilerOptions` explícitos: `baseUrl: "."`, `paths: { "~/*": ["src/*"] }`, y referencia a `types: ["astro/client"]`. Hoy hereda solo de `astro/tsconfigs/strict` sin path aliases.
- [ ] Configurar Prettier (`.prettierrc.json` con `printWidth: 100`, `singleQuote: true`) y un script `format` en `package.json`.
- [ ] Configurar ESLint con `eslint-plugin-astro` y un script `lint`. Hay varios `querySelector` inseguros en `Header.astro:199` que un linter podría detectar.
- [ ] Actualizar el `README.md` — actualmente es el del template `astro@latest --template basics`. Sustituirlo por uno real del proyecto con descripción, requisitos, comandos y deploy.
- [ ] Confirmar que `package-lock.json` está commiteado y que `npm ci` se usa en CI en lugar de `npm install` (es lo recomendado para aplicaciones).
- [ ] Añadir `.nvmrc` con la versión de Node (ej. `20`) para uniformidad entre entornos.
- [ ] Configurar GitHub Actions (`.github/workflows/ci.yml`) que ejecute `npm ci`, `npm run lint` y `npm run build` en cada PR.
- [ ] Reemplazar los `<script>` inline de `Header.astro` y `gracias.astro` por scripts con `is:inline` explícito o migrarlos a `client-side framework islands` solo si hace falta interactividad (no es el caso aquí).

---

## Etapa 6 — Funcionalidades nuevas / opcional ⚪

> 4 tareas. Mejoras que no son urgentes pero suman valor. Solo si las etapas anteriores están verdes.

- [ ] Implementar View Transitions (`<ClientRouter />`) de Astro 5 para transiciones suaves entre páginas (Astro 5 lo trae built-in).
- [ ] Migrar el sitio a Content Collections para preparar una sección de blog o portfolio de proyectos sin reestructurar.
- [ ] Añadir `astro check` al pre-commit hook (Husky) para no pushear código con errores de tipo.
- [ ] Crear una página de política de privacidad y de términos referenciada desde el footer (requerido legalmente para formularios que recolectan datos en Argentina según Ley 25.326).

---

## Leyenda de estados

- ⏳ **Pendiente** — no se empezó
- 🔄 **En curso** — alguna tarea en `[x]`, pero no todas
- ✅ **Completada** — todas las tareas en `[x]`

> **Cómo usar este archivo:**
> 1. Al inicio, marcá en la sección "Etapas a realizar" cuáles vas a encarar.
> 2. A medida que completés tareas, cambialas de `- [ ]` a `- [x]`.
> 3. Cuando una etapa esté completa, actualizá su estado en la tabla de "Progreso general" y el contador `0/51`.
> 4. Si decidís descartar una tarea, marcala como `- [x] ~~descartada~~` con un comentario al lado.

---

## ✅ Pre-chequeo migración Pages → Workers (completado el 2026-06-02)

El proyecto ya no usa el modelo de Cloudflare Pages. Está listo para deployarse como **Cloudflare Worker**.

### Lo que se hizo

- [x] Reemplazado `functions/_routes.json` por `wrangler.jsonc` (formato Workers)
- [x] `main: "@astrojs/cloudflare/entrypoints/server"` apunta al entrypoint unificado de v13
- [x] `assets.directory: "./dist"` + `binding: "ASSETS"` conectan los estáticos
- [x] `compatibility_flags: ["nodejs_compat"]` permite usar APIs Node si hicieran falta
- [x] `observability.enabled: true` habilita Workers Logs en el dashboard
- [x] `astro.config.mjs`: `imageService: 'compile'` (evita el binding `IMAGES` que requiere plan pago)
- [x] `package.json`: scripts `dev`, `start`, `build`, `preview` ahora corren `wrangler types` antes que Astro
- [x] `tsconfig.json` incluye `worker-configuration.d.ts` generado
- [x] `worker-configuration.d.ts` commiteado (tipos de bindings consistentes en el equipo)
- [x] `@types/node` instalado (peer de `nodejs_compat`)
- [x] `.dev.vars.example` documenta las variables de entorno esperadas
- [x] `.gitignore` ignora `.dev.vars`
- [x] `package.json` con `"private": true` (no se publica a npm)
- [x] `astro check` y `astro build` pasan sin errores ni warnings
- [x] `astro dev` arranca correctamente y el endpoint `/api/contact` valida y redirige como se espera

### Lo que falta del lado de Cloudflare (no se puede automatizar desde el repo)

- [ ] En el dashboard de Cloudflare: **Pages → Workers**. Crear un Worker nuevo (o usar `wrangler deploy` con `account_id` y `routes` configurados).
- [ ] Configurar el dominio personalizado (`novacode.com.ar`) — antes iba en Pages, ahora va en el Worker (`wrangler.jsonc` → `routes` + `custom_domain` o configuración en el dashboard).
- [ ] Definir `vars` y `secrets` en `wrangler.jsonc` o en el dashboard (no commitear secrets al repo).
- [ ] Configurar CI/CD (Etapa 5) que corra `npm ci` + `npm run build` y haga `wrangler deploy` con un `CLOUDFLARE_API_TOKEN`.

### Verificación local del deploy (antes de subir)

```bash
# 1. Validar tipos + build
npm run build

# 2. Previsualizar en runtime real de Cloudflare (workerd)
npm run preview

# 3. (Opcional) deploy manual
npx wrangler deploy
```
