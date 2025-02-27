// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://novacode.com.ar',
  base: '/',
  trailingSlash: 'never',
  output: 'server',
  adapter: cloudflare()
});