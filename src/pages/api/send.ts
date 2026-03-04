import type { APIRoute } from "astro";
import { Resend } from "resend";
import { buildNotificationEmail, buildConfirmationEmail } from "../../lib/email-templates";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body) {
    return new Response(
      JSON.stringify({ error: "Cuerpo de solicitud inválido." }),
      { status: 400 },
    );
  }

  const { name, email, phone, category, productRef, quantity, message } = body;

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Campos requeridos faltantes." }),
      { status: 422 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Email inválido." }), {
      status: 422,
    });
  }

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

  // ── 1. Notificación interna al equipo PRG ──────────────────────────────────
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

  // ── 2. Confirmación al usuario ────────────────────────────────────────────
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
    // No bloquea: la notificación ya se envió correctamente
    console.error("Error Resend (confirmación al usuario):", confirmError);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
