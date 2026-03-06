import { CATEGORY_LABELS as CAT_LABELS } from '../data/categories';

export interface QuoteData {
  empresa?: string;
  name: string;
  email: string;
  phone?: string;
  category?: string;
  productRef?: string;
  quantity?: string;
  urgency?: string;
  message: string;
}

const URGENCY_LABELS: Record<string, string> = {
  'urgente':     'Lo antes posible',
  '1-2-semanas': 'En 1 a 2 semanas',
  '1-mes':       'En aproximadamente 1 mes',
  'mas-1-mes':   'En más de 1 mes',
};

// Re-exportar como Record<string, string> para uso interno flexible (DT-02)
const CATEGORY_LABELS: Record<string, string> = CAT_LABELS as Record<string, string>;

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseCategories(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(',')
    .map(s => CATEGORY_LABELS[s.trim()] ?? s.trim())
    .filter(Boolean);
}

// ── Reusable layout wrappers ────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="es" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings>
    <o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#EDEDED;-webkit-text-size-adjust:100%;mso-line-height-rule:exactly;">
  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#EDEDED;"><tr><td><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#EDEDED;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso | IE]></td></tr></table><![endif]-->
</body>
</html>`;
}

function dataRow(label: string, value: string, borderBottom = true): string {
  const border = borderBottom ? 'border-bottom:1px solid #E5E7EB;' : '';
  return `
    <tr>
      <td style="padding:10px 0;${border}width:42%;vertical-align:top;">
        <span style="color:#6B7280;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${label}</span>
      </td>
      <td align="right" style="padding:10px 0;${border}vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

function val(text: string): string {
  return `<span style="color:#101820;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${text}</span>`;
}

function emptyVal(text = 'No indicado'): string {
  return `<span style="color:#9CA3AF;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${text}</span>`;
}

// ── Notification email (to PRG team) ───────────────────────────────────────

export function buildNotificationEmail(d: QuoteData): { subject: string; html: string; text: string } {
  const cats = parseCategories(d.category);

  const dateStr = new Date().toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  const catPills = cats.length > 0
    ? cats.map(c =>
        `<span style="display:inline-block;background:#FEF3ED;color:#FA4616;border:1px solid #FBBF99;` +
        `font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;margin:2px 3px 2px 0;` +
        `font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.3px;">${esc(c)}</span>`
      ).join('')
    : emptyVal('No indicada');

  const body = `
    <!-- HEADER -->
    <tr>
      <td style="background-color:#101820;border-radius:12px 12px 0 0;padding:28px 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <span style="font-size:20px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">
                <span style="color:#FA4616;">PRG</span><span style="color:#ffffff;"> Inversiones</span>
              </span>
            </td>
            <td align="right">
              <span style="display:inline-block;background-color:#FA4616;color:#ffffff;font-size:10px;
                font-weight:700;padding:5px 12px;border-radius:4px;letter-spacing:0.8px;
                text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                Nueva cotización
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- ACCENT BAR -->
    <tr><td style="background-color:#FA4616;height:3px;font-size:0;line-height:0;mso-line-height-rule:exactly;"> </td></tr>

    <!-- BODY -->
    <tr>
      <td style="background-color:#ffffff;padding:36px 36px 32px;">

        <h1 style="margin:0 0 6px;color:#101820;font-size:22px;font-weight:700;
          font-family:Arial,Helvetica,sans-serif;line-height:1.3;">
          Nueva solicitud de cotización
        </h1>
        <p style="margin:0 0 32px;color:#9CA3AF;font-size:13px;font-family:Arial,Helvetica,sans-serif;">
          ${esc(dateStr)} · ${esc(timeStr)}
        </p>

        <!-- Contact data card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#F8F8F6;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px 4px;">
            <p style="margin:0;color:#9CA3AF;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.2px;font-family:Arial,Helvetica,sans-serif;">
              Datos del contacto
            </p>
          </td></tr>
          <tr><td style="padding:4px 24px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${d.empresa ? dataRow('Empresa', val(esc(d.empresa))) : ''}
              ${dataRow('Nombre', val(esc(d.name)))}
              ${dataRow('Correo',
                `<a href="mailto:${esc(d.email)}" style="color:#FA4616;font-size:13px;
                  font-family:Arial,Helvetica,sans-serif;text-decoration:none;">${esc(d.email)}</a>`
              )}
              ${dataRow('Teléfono', d.phone ? val(esc(d.phone)) : emptyVal(), false)}
            </table>
          </td></tr>
        </table>

        <!-- Quote details card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#F8F8F6;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px 4px;">
            <p style="margin:0;color:#9CA3AF;font-size:10px;font-weight:700;
              text-transform:uppercase;letter-spacing:1.2px;font-family:Arial,Helvetica,sans-serif;">
              Detalles de la solicitud
            </p>
          </td></tr>
          <tr><td style="padding:4px 24px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${dataRow('Línea de interés', catPills)}
              ${dataRow('Producto referencia', d.productRef ? val(esc(d.productRef)) : emptyVal())}
              ${dataRow('Cantidad aproximada', d.quantity ? val(esc(d.quantity)) : emptyVal())}
              ${dataRow('Urgencia', d.urgency ? val(esc(URGENCY_LABELS[d.urgency] ?? d.urgency)) : emptyVal(), false)}
            </table>
          </td></tr>
        </table>

        <!-- Message -->
        <p style="margin:0 0 12px;color:#9CA3AF;font-size:10px;font-weight:700;
          text-transform:uppercase;letter-spacing:1.2px;font-family:Arial,Helvetica,sans-serif;">
          Mensaje
        </p>
        <div style="background-color:#F8F8F6;border-left:3px solid #FA4616;
          border-radius:0 6px 6px 0;padding:16px 20px;margin-bottom:32px;">
          <p style="margin:0;color:#101820;font-size:14px;line-height:1.75;
            font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${esc(d.message)}</p>
        </div>

        <!-- CTA button -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                href="mailto:${esc(d.email)}" style="height:48px;v-text-anchor:middle;width:260px;"
                arcsize="13%" stroke="f" fillcolor="#FA4616">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">
                  Responder a ${esc(d.name)}
                </center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <a href="mailto:${esc(d.email)}"
                style="display:inline-block;background-color:#FA4616;color:#ffffff;font-size:14px;
                  font-weight:700;padding:14px 36px;border-radius:6px;text-decoration:none;
                  font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">
                Responder a ${esc(d.name.split(' ')[0])}
              </a>
              <!--<![endif]-->
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background-color:#F8F8F6;border-radius:0 0 12px 12px;padding:22px 36px;
        border-top:1px solid #E5E7EB;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <p style="margin:0 0 3px;color:#101820;font-size:13px;font-weight:700;
                font-family:Arial,Helvetica,sans-serif;">
                <span style="color:#FA4616;">PRG</span> Inversiones
              </p>
              <p style="margin:0;color:#9CA3AF;font-size:11px;font-family:Arial,Helvetica,sans-serif;">
                Santiago, Chile &nbsp;·&nbsp; FSC C143583
              </p>
            </td>
            <td align="right">
              <a href="https://prg.cl" style="color:#9CA3AF;font-size:11px;
                font-family:Arial,Helvetica,sans-serif;text-decoration:none;">prg.cl</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const text = `Nueva cotización — PRG Inversiones
${dateStr} · ${timeStr}

${d.empresa ? `Empresa:  ${d.empresa}\n` : ''}Nombre:   ${d.name}
Correo:   ${d.email}
Teléfono: ${d.phone || 'No indicado'}

Línea de interés: ${cats.join(', ') || 'No indicada'}
Producto:         ${d.productRef || 'No indicado'}
Cantidad:         ${d.quantity || 'No indicada'}
Urgencia:         ${d.urgency ? (URGENCY_LABELS[d.urgency] ?? d.urgency) : 'No indicada'}

Mensaje:
${d.message}
`;

  return {
    subject: `[PRG] Nueva cotización de ${d.name}`,
    html: emailWrapper(body),
    text,
  };
}

// ── Confirmation email (to user) ────────────────────────────────────────────

export function buildConfirmationEmail(d: QuoteData): { subject: string; html: string; text: string } {
  const cats = parseCategories(d.category);
  const firstName = esc(d.name.split(' ')[0]);

  const steps = [
    {
      num: '1',
      title: 'Revisamos tu solicitud',
      desc: 'Nuestro equipo analiza los detalles de tu proyecto para preparar la mejor propuesta.',
    },
    {
      num: '2',
      title: 'Preparamos tu cotización',
      desc: 'Elaboramos una propuesta a medida, sin costo ni compromiso para ti.',
    },
    {
      num: '3',
      title: 'Te respondemos',
      desc: 'Recibirás nuestra respuesta en menos de 24 horas hábiles.',
    },
  ];

  const stepsHtml = steps.map(s => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="margin-bottom:20px;">
      <tr>
        <td style="width:40px;vertical-align:top;padding-right:16px;">
          <div style="width:30px;height:30px;background-color:#FA4616;border-radius:50%;
            text-align:center;line-height:30px;mso-line-height-rule:exactly;">
            <span style="color:#ffffff;font-size:13px;font-weight:700;
              font-family:Arial,Helvetica,sans-serif;">${s.num}</span>
          </div>
        </td>
        <td style="vertical-align:top;padding-top:5px;">
          <p style="margin:0 0 3px;color:#101820;font-size:14px;font-weight:700;
            font-family:Arial,Helvetica,sans-serif;">${s.title}</p>
          <p style="margin:0;color:#6B7280;font-size:13px;line-height:1.55;
            font-family:Arial,Helvetica,sans-serif;">${s.desc}</p>
        </td>
      </tr>
    </table>`).join('');

  const catPills = cats.map(c =>
    `<span style="display:inline-block;background:#FEF3ED;color:#FA4616;border:1px solid #FBBF99;` +
    `font-size:11px;font-weight:700;padding:3px 8px;border-radius:12px;margin:2px 0 2px 4px;` +
    `font-family:Arial,Helvetica,sans-serif;">${esc(c)}</span>`
  ).join('');

  const summaryRows = [
    d.empresa ? dataRow('Empresa', val(esc(d.empresa))) : '',
    cats.length > 0 ? dataRow('Línea de interés', catPills) : '',
    d.productRef ? dataRow('Producto', val(esc(d.productRef))) : '',
    d.quantity    ? dataRow('Cantidad',  val(esc(d.quantity)))  : '',
    d.urgency     ? dataRow('Urgencia',  val(esc(URGENCY_LABELS[d.urgency] ?? d.urgency))) : '',
    dataRow(
      'Mensaje',
      `<span style="color:#101820;font-size:13px;font-family:Arial,Helvetica,sans-serif;
        display:block;text-align:right;max-width:280px;word-break:break-word;">
        ${esc(d.message.length > 120 ? d.message.substring(0, 120) + '…' : d.message)}
      </span>`,
      false
    ),
  ].filter(Boolean).join('');

  const body = `
    <!-- HEADER -->
    <tr>
      <td style="background-color:#101820;border-radius:12px 12px 0 0;padding:36px 36px 32px;">
        <p style="margin:0 0 22px;font-size:20px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">
          <span style="color:#FA4616;">PRG</span>
          <span style="color:#ffffff;"> Inversiones</span>
        </p>
        <h1 style="margin:0 0 10px;color:#ffffff;font-size:26px;font-weight:700;
          font-family:Arial,Helvetica,sans-serif;line-height:1.3;">
          Hola, ${firstName}.
        </h1>
        <p style="margin:0;color:#9CA3AF;font-size:15px;font-family:Arial,Helvetica,sans-serif;
          line-height:1.6;">
          Recibimos tu solicitud de cotización.<br>
          Nos pondremos en contacto contigo pronto.
        </p>
      </td>
    </tr>
    <!-- ACCENT BAR -->
    <tr><td style="background-color:#FA4616;height:3px;font-size:0;line-height:0;mso-line-height-rule:exactly;"> </td></tr>

    <!-- BODY -->
    <tr>
      <td style="background-color:#ffffff;padding:36px 36px 32px;">

        <!-- Success badge -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="margin-bottom:32px;">
          <tr>
            <td style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:14px;vertical-align:middle;">
                    <div style="width:32px;height:32px;background-color:#22C55E;border-radius:50%;
                      text-align:center;line-height:32px;mso-line-height-rule:exactly;">
                      <span style="color:#ffffff;font-size:16px;font-weight:700;
                        font-family:Arial,Helvetica,sans-serif;">&#10003;</span>
                    </div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0 0 3px;color:#15803D;font-size:13px;font-weight:700;
                      font-family:Arial,Helvetica,sans-serif;">Solicitud recibida exitosamente</p>
                    <p style="margin:0;color:#16A34A;font-size:12px;font-family:Arial,Helvetica,sans-serif;">
                      Tiempo de respuesta: <strong>menos de 24 horas hábiles</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Steps -->
        <p style="margin:0 0 20px;color:#101820;font-size:16px;font-weight:700;
          font-family:Arial,Helvetica,sans-serif;">¿Qué sigue?</p>
        ${stepsHtml}

        <!-- Divider -->
        <div style="border-top:1px solid #E5E7EB;margin:28px 0;"></div>

        <!-- Summary -->
        <p style="margin:0 0 16px;color:#101820;font-size:16px;font-weight:700;
          font-family:Arial,Helvetica,sans-serif;">Resumen de tu solicitud</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#F8F8F6;border-radius:8px;margin-bottom:28px;">
          <tr><td style="padding:20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${summaryRows}
            </table>
          </td></tr>
        </table>

        <!-- Note -->
        <p style="margin:0;color:#9CA3AF;font-size:12px;font-family:Arial,Helvetica,sans-serif;
          line-height:1.7;">
          Si necesitas agregar información o tienes alguna duda, puedes responder directamente
          a este correo y lo recibiremos de inmediato.
        </p>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background-color:#101820;border-radius:0 0 12px 12px;padding:24px 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;
                font-family:Arial,Helvetica,sans-serif;">
                <span style="color:#FA4616;">PRG</span>
                <span style="color:#ffffff;"> Inversiones</span>
              </p>
              <p style="margin:0;color:#6B7280;font-size:11px;font-family:Arial,Helvetica,sans-serif;">
                Santiago, Chile &nbsp;·&nbsp; Fundada 2011 &nbsp;·&nbsp; FSC C143583
              </p>
            </td>
            <td align="right">
              <a href="https://prg.cl" style="color:#6B7280;font-size:11px;
                font-family:Arial,Helvetica,sans-serif;text-decoration:none;">prg.cl</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const text = `Hola, ${d.name}.

Recibimos tu solicitud de cotización en PRG Inversiones.
Nos pondremos en contacto contigo en menos de 24 horas hábiles.

¿Qué sigue?
1. Revisamos tu solicitud
2. Preparamos tu cotización a medida, sin costo
3. Te respondemos en menos de 24 horas hábiles

Resumen de tu solicitud:
${d.empresa ? `Empresa: ${d.empresa}\n` : ''}${cats.length > 0 ? `Línea de interés: ${cats.join(', ')}\n` : ''}${d.productRef ? `Producto: ${d.productRef}\n` : ''}${d.quantity ? `Cantidad: ${d.quantity}\n` : ''}${d.urgency ? `Urgencia: ${URGENCY_LABELS[d.urgency] ?? d.urgency}\n` : ''}Mensaje: ${d.message}

PRG Inversiones · Santiago, Chile · prg.cl
`;

  return {
    subject: `Recibimos tu solicitud · PRG Inversiones`,
    html: emailWrapper(body),
    text,
  };
}
