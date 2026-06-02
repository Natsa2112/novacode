# NovaCode

Sitio web estático de [novacode.com.ar](https://novacode.com.ar): servicios de
desarrollo web, planes y formulario de contacto. Construido con
[Astro](https://astro.build/) y desplegado en
[Cloudflare Workers](https://workers.cloudflare.com/) con un único endpoint SSR
para el envío de correos vía [Resend](https://resend.com/).

## Requisitos

- Node.js `>=22.12.0` (ver `.nvmrc`)
- npm `>=9.6.5`
- Una cuenta de Cloudflare con el Worker `novacode` configurado
- Una API key de Resend (solo requerida para el endpoint `/api/contact`)

## Configuración local

1. Clonar el repositorio e instalar dependencias:

   ```sh
   npm install
   ```

2. Generar los tipos del runtime de Cloudflare (lee `wrangler.jsonc`):

   ```sh
   npm run cf:types
   ```

3. Para producción, definir las variables y secretos en
   `wrangler.jsonc` o con `wrangler secret put`:

   | Variable            | Descripción                                            |
   | :------------------ | :----------------------------------------------------- |
   | `PUBLIC_SITE_URL`   | URL canónica del sitio (ej. `https://novacode.com.ar`) |
   | `PUBLIC_FROM_EMAIL` | Remitente verificado en Resend                         |
   | `CONTACT_TO_EMAIL`  | Destinatario del formulario de contacto                |
   | `RESEND_API_KEY`    | API key de Resend (secret)                             |

## Scripts

| Comando                | Acción                                                                    |
| :--------------------- | :------------------------------------------------------------------------ |
| `npm run dev`          | Genera tipos de Wrangler y arranca el servidor de dev en `localhost:4321` |
| `npm run build`        | Genera tipos, corre `astro check` y compila el sitio a `./dist/`          |
| `npm run preview`      | Previsualiza el build localmente con el runtime de Cloudflare             |
| `npm run cf:types`     | Regenera `worker-configuration.d.ts` desde `wrangler.jsonc`               |
| `npm run cf:deploy`    | Despliega el Worker a Cloudflare                                          |
| `npm run lint`         | Corre ESLint sobre `src/` y archivos de configuración                     |
| `npm run lint:fix`     | Aplica correcciones automáticas de ESLint                                 |
| `npm run format`       | Formatea todos los archivos con Prettier                                  |
| `npm run format:check` | Verifica el formato sin modificar archivos                                |
| `npm run astro`        | Acceso directo a la CLI de Astro                                          |

## Estructura del proyecto

```text
/
├── .github/workflows/  # CI: lint, format check, build en cada push y PR
├── public/             # Assets estáticos servidos tal cual (favicon, og-image, _headers, robots.txt)
├── src/
│   ├── assets/         # Imágenes optimizadas por astro:assets
│   ├── components/     # Componentes .astro reutilizables (Header, Footer, Icon, etc.)
│   ├── config/         # Configuración tipada del sitio (site, colors, services, plans, contactInfo)
│   ├── layouts/        # Layouts (Layout.astro con meta, OG, canonical, skip-link)
│   ├── pages/          # Rutas; el resto son páginas estáticas, /api/contact es SSR
│   ├── styles/         # CSS global (variables, reset, utilidades, reduced-motion)
│   ├── types/          # Tipos compartidos (Service, Plan, IconName, etc.)
│   ├── env.d.ts        # Augmentación de Cloudflare.Env (RESEND_API_KEY)
│   └── middleware.ts   # Cabeceras de seguridad para respuestas SSR
├── astro.config.mjs    # Configuración de Astro (output: static, sitemap, integrations)
├── eslint.config.js    # Flat config de ESLint (js, ts, astro)
├── .prettierrc.json    # Configuración de Prettier (con prettier-plugin-astro)
├── wrangler.jsonc      # Configuración del Worker de Cloudflare
└── package.json
```

## Despliegue

El sitio se compila con `output: 'static'` (todo HTML prerenderizado excepto
`/api/contact`, que se sirve vía SSR) y se publica como Cloudflare Worker:

```sh
npm run build
npm run cf:deploy
```

El build de producción corre `astro check` antes de compilar, así que un build
verde garantiza que no hay errores de TypeScript ni de Astro.

## Seguridad

- Cabeceras de seguridad (CSP, HSTS, X-Frame-Options, etc.) definidas en dos
  capas: `src/middleware.ts` (rutas SSR) y `public/_headers` (assets estáticos).
- Formulario de contacto protegido por CSRF nativo de Astro 6: rechaza
  peticiones cross-site sin `Origin` coincidente con `PUBLIC_SITE_URL`.
- `SECURITY.md` (si existe) detalla cómo reportar vulnerabilidades.

## Licencia

Privado. Todos los derechos reservados.
