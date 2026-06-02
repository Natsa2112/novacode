/// <reference path="../.astro/types.d.ts" />
/// <reference path="../worker-configuration.d.ts" />

declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY: string;
  }
}

interface Env extends Cloudflare.Env {}
