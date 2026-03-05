import type { APIRoute } from "astro";
import { Resend } from "resend";
import { buildNotificationEmail, buildConfirmationEmail } from "../../lib/email-templates";

export const prerender = false;

// ── Validación whitelist de categorías ────────────────────────────────────────
const VALID_CATEGORIES = new Set([
  'papeleria-corporativa',
  'grandes-formatos',
  'promocionales',
  'packaging-etiquetas',
]);

const VALID_QUANTITIES = new Set([
  '', '1-50', '51-200', '201-1000', '1000+',
]);

// ── Helpers ───────────────────────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

function sanitizeString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

function validateCategories(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  const cats = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (cats.length === 0) return null;
  const allValid = cats.every(c => VALID_CATEGORIES.has(c));
  return allValid ? cats.join(',') : null;
}

// ── Endpoint ──────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  // ── Verificación de origen (MEJ-04: rate limiting básico) ───────────────
  const origin  = request.headers.get('origin')  ?? '';
  const referer = request.headers.get('referer') ?? '';
  const isDev   = import.meta.env.DEV;

  if (!isDev && !origin.includes('prg.cl') && !referer.includes('prg.cl')) {
    return new Response(
      JSON.stringify({ error: "Solicitud no permitida." }),
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return new Response(
      JSON.stringify({ error: "Cuerpo de solicitud inválido." }),
      { status: 400 },
    );
  }

  // ── Validar y sanitizar campos ───────────────────────────────────────────
  const name    = sanitizeString(body.name,    100);
  const email   = sanitizeString(body.email,   254);
  const phone   = sanitizeString(body.phone,    30) ?? undefined;
  const message = sanitizeString(body.message, 5000);

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Campos requeridos faltantes o inválidos." }),
      { status: 422 },
    );
  }

  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: "Email inválido." }),
      { status: 422 },
    );
  }

  // Categorías: al menos una, todas válidas
  const category = validateCategories(body.category);
  if (!category) {
    return new Response(
      JSON.stringify({ error: "Línea de interés inválida." }),
      { status: 422 },
    );
  }

  // Campos opcionales con whitelist
  const productRef = sanitizeString(body.productRef, 200) ?? undefined;
  const quantity   = typeof body.quantity === 'string' && VALID_QUANTITIES.has(body.quantity)
    ? body.quantity
    : undefined;

  // ── Variables de entorno ─────────────────────────────────────────────────
  const apiKey    = import.meta.env.RESEND_API_KEY;
  const fromEmail = import.meta.env.RESEND_FROM;
  const toEmail   = import.meta.env.CONTACT_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Variables de entorno de Resend no configuradas.");
    return new Response(
      JSON.stringify({ error: "Error de configuración del servidor." }),
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  const data   = { name, email, phone, category, productRef, quantity, message };

  // ── 1. Notificación interna al equipo PRG ────────────────────────────────
  const notification = buildNotificationEmail(data);

  const { error: notifError } = await resend.emails.send({
    from:    fromEmail,
    to:      toEmail,
    replyTo: email,
    subject: notification.subject,
    html:    notification.html,
    text:    notification.text,
  });

  if (notifError) {
    console.error("Error Resend (notificación):", notifError);
    return new Response(
      JSON.stringify({ error: "No se pudo enviar el correo." }),
      { status: 500 },
    );
  }

  // ── 2. Confirmación al usuario ───────────────────────────────────────────
  const confirmation = buildConfirmationEmail(data);

  const { error: confirmError } = await resend.emails.send({
    from:    fromEmail,
    to:      email,
    replyTo: toEmail,
    subject: confirmation.subject,
    html:    confirmation.html,
    text:    confirmation.text,
  });

  if (confirmError) {
    console.error("Error Resend (confirmación al usuario):", confirmError);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
