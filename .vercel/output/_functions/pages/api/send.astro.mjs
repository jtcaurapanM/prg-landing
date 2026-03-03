import 'resend';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: "Cuerpo de solicitud inválido." }), { status: 400 });
  }
  const { name, email, company, phone, category, productRef, quantity, message } = body;
  if (!name || !email || !company || !message) {
    return new Response(JSON.stringify({ error: "Campos requeridos faltantes." }), { status: 422 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Email inválido." }), { status: 422 });
  }
  {
    console.error("Variables de entorno de Resend no configuradas.");
    return new Response(JSON.stringify({ error: "Error de configuración del servidor." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
