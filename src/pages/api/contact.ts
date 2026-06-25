import { env } from 'cloudflare:workers';
import { contactSchema } from '../../config/validation';

export const prerender = false;

// Rate limiting in-memory (resets entre invocaciones del worker)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

interface ContactPayload {
  nombre?: string;
  email?: string;
  telefono?: string;
  servicio?: string;
  mensaje?: string;
}

interface ResendResponse {
  id?: string;
  error?: { message: string; statusCode?: number };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const wantsHtml = (request: Request) => (request.headers.get('accept') ?? '').includes('text/html');

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildEmailHtml = (data: {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  receivedAt: string;
}) => `
<!doctype html>
<html lang="es">
  <body style="font-family: system-ui, sans-serif; color: #222; line-height: 1.5;">
    <h2 style="color: #b978cc;">Nuevo contacto desde novacode.com.ar</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
      <tr><td style="padding: 8px 0; color: #666;">Nombre</td><td style="padding: 8px 0;"><strong>${escapeHtml(data.nombre)}</strong></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Teléfono</td><td style="padding: 8px 0;">${escapeHtml(data.telefono)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Servicio</td><td style="padding: 8px 0;">${escapeHtml(data.servicio)}</td></tr>
    </table>
    <h3 style="margin-top: 24px;">Mensaje</h3>
    <p style="white-space: pre-wrap; background: #f7f7f7; padding: 12px; border-radius: 8px;">${escapeHtml(data.mensaje)}</p>
    <p style="color: #999; font-size: 12px; margin-top: 24px;">Recibido el ${data.receivedAt}</p>
  </body>
</html>`;

async function sendViaResend(
  data: {
    nombre: string;
    email: string;
    telefono: string;
    servicio: string;
    mensaje: string;
    receivedAt: string;
  },
  env: Cloudflare.Env,
  ctx: ExecutionContext | undefined,
) {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  const from = env.PUBLIC_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { sent: false as const, reason: 'no-credentials' as const };
  }

  const body = {
    from,
    to: [to],
    reply_to: [data.email],
    subject: `Nuevo contacto: ${data.nombre} (${data.servicio})`,
    html: buildEmailHtml(data),
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      ctx?.waitUntil(Promise.resolve(console.error('[contact] Resend error', res.status, text)));
      return { sent: false as const, reason: 'resend-error' as const, status: res.status };
    }

    const json = (await res.json()) as ResendResponse;
    if (json.error) {
      ctx?.waitUntil(Promise.resolve(console.error('[contact] Resend API error', json.error)));
      return { sent: false as const, reason: 'resend-api-error' as const };
    }

    return { sent: true as const, id: json.id };
  } catch (err) {
    ctx?.waitUntil(Promise.resolve(console.error('[contact] Resend fetch error', err)));
    return { sent: false as const, reason: 'network-error' as const };
  }
}

export const POST = async ({
  request,
  redirect,
  locals,
}: {
  request: Request;
  redirect: (url: string, status?: 301 | 302 | 303 | 307 | 308) => Response;
  locals: { cfContext?: ExecutionContext };
}) => {
  let data: ContactPayload;
  const contentType = request.headers.get('content-type') ?? '';

  const clientIp = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!checkRateLimit(clientIp)) {
    return json(
      { ok: false, error: 'Demasiadas solicitudes. Intentá de nuevo en un minuto.' },
      429,
    );
  }

  try {
    if (contentType.includes('application/json')) {
      data = (await request.json()) as ContactPayload;
    } else {
      const form = await request.formData();
      data = Object.fromEntries(form.entries()) as ContactPayload;
    }
  } catch {
    return json({ ok: false, error: 'Payload inválido.' }, 400);
  }

  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
    return json({ ok: false, errors }, 422);
  }

  const ctx = locals.cfContext;
  const receivedAt = new Date().toISOString();

  const logData = { ...parsed.data, receivedAt };

  const result = await sendViaResend(logData, env, ctx);
  if (!result.sent) {
    console.log('[contact] (no enviado, fallback a log)', result.reason, logData);
  } else {
    console.log('[contact] Email enviado', { id: result.id, ...logData });
  }

  if (wantsHtml(request)) {
    return redirect('/gracias', 303);
  }
  return json({ ok: true });
};

export const GET = () => json({ ok: false, error: 'Método no permitido.' }, 405);
