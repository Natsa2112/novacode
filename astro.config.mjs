// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://novacode.com.ar',
  base: '/',
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});
