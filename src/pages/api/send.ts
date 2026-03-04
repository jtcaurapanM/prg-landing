import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body) {
    return new Response(
      JSON.stringify({ error: "Cuerpo de solicitud inválido." }),
      { status: 400 },
    );
  }

  const {
    name,
    email,
    phone,
    category,
    productRef,
    quantity,
    message,
  } = body;

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

  const apiKey = import.meta.env.RESEND_API_KEY;
  const fromEmail = import.meta.env.RESEND_FROM;
  const toEmail = import.meta.env.CONTACT_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Variables de entorno de Resend no configuradas.");
    return new Response(
      JSON.stringify({ error: "Error de configuración del servidor." }),
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  const emailBody = `
Nueva cotización desde prginversiones.cl

Nombre:    ${name}
Email:     ${email}
Teléfono:  ${phone || "No indicado"}

Línea de interés:     ${category || "No indicada"}
Producto referencia:  ${productRef || "No indicado"}
Cantidad aproximada:  ${quantity || "No indicada"}

Mensaje:
${message}
  `.trim();

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `[PRG] Nueva cotización de ${name}`,
    text: emailBody,
  });

  if (error) {
    console.error("Error Resend:", error);
    return new Response(
      JSON.stringify({ error: "No se pudo enviar el correo." }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
