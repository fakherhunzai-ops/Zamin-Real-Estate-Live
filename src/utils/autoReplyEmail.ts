import { SITE } from '@/utils/site';

export type AutoReplyType = 'contact' | 'valuation' | 'listing' | 'enquiry';

type Copy = {
  subject: string;
  heading: string;
  intro: string;
  steps: string[];
};

const BRAND = '#20362b';
const ACCENT = '#c9a24b';

const COPY: Record<AutoReplyType, Copy> = {
  contact: {
    subject: 'We received your message — Zamin Real Estate',
    heading: 'Thanks for reaching out!',
    intro:
      'We have received your message and a member of our Gilgit team will get back to you within one working day.',
    steps: [
      'A Zamin advisor reviews your enquiry',
      'We call or email you to understand exactly what you need',
      'We share matching options and the next steps',
    ],
  },
  valuation: {
    subject: 'Your free valuation request — Zamin Real Estate',
    heading: 'Your valuation request is in!',
    intro:
      'Thanks for requesting a free property valuation. A Zamin advisor will contact you to arrange your assessment, usually within 48 hours.',
    steps: [
      'We review the property details you shared',
      'We arrange a convenient time to assess the property',
      'You receive a clear, no-obligation valuation',
    ],
  },
  listing: {
    subject: 'We received your property details — Zamin Real Estate',
    heading: 'Thanks — we have your property details!',
    intro:
      'Your property has been submitted to our team. A Zamin advisor will reach out shortly to arrange your free valuation and discuss listing.',
    steps: [
      'We review the property information you provided',
      'We confirm a time for your free valuation',
      'We prepare your listing and start marketing it',
    ],
  },
  enquiry: {
    subject: 'We received your enquiry — Zamin Real Estate',
    heading: 'Thanks for your enquiry!',
    intro: 'We have received your enquiry and a Zamin advisor will be in touch with you shortly.',
    steps: [
      'A Zamin advisor reviews your enquiry',
      'We contact you with the details you asked for',
      'We help you take the next step',
    ],
  },
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Sends a branded confirmation (auto-reply) email to a visitor who just
 * submitted a form. Reuses the deployed send-report-email Edge Function
 * (Resend under the hood). Fails silently (returns false) when email is not
 * configured, so the visitor still sees a normal success message.
 */
export async function sendAutoReply(params: {
  to: string;
  name?: string;
  type?: AutoReplyType;
}): Promise<boolean> {
  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

  const to = (params.to || '').trim();
  if (!url || !anonKey) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return false;

  const type: AutoReplyType = params.type && COPY[params.type] ? params.type : 'contact';
  const copy = COPY[type];
  const name = (params.name || '').trim();
  const greeting = name ? `Hi ${escapeHtml(name)},` : 'Hi there,';

  const text = [
    copy.heading,
    '',
    name ? `Hi ${name},` : 'Hi there,',
    '',
    copy.intro,
    '',
    'What happens next:',
    ...copy.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    `Need us sooner? Call ${SITE.phoneDisplay} or email ${SITE.email}.`,
    SITE.address,
    '',
    `This is an automated confirmation from ${SITE.brand}.`,
  ].join('\n');

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f2f4f1;">
    <div style="max-width:600px;margin:0 auto;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;color:#17221c;">
      <div style="background:${BRAND};border-radius:12px 12px 0 0;padding:24px;text-align:center;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.5px;">${SITE.brand}</p>
        <p style="margin:4px 0 0;color:#c9d6cd;font-size:12px;">${SITE.tagline}</p>
      </div>
      <div style="background:#ffffff;padding:28px 24px;">
        <h1 style="margin:0 0 14px;font-size:20px;color:#17221c;">${copy.heading}</h1>
        <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#17221c;">${greeting}</p>
        <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#3a423d;">${copy.intro}</p>
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#68736d;">What happens next</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3a423d;">
          ${copy.steps
            .map(
              (step, index) =>
                `<tr><td style="padding:5px 10px 5px 0;vertical-align:top;color:${ACCENT};font-weight:700;">${index + 1}.</td><td style="padding:5px 0;vertical-align:top;">${escapeHtml(step)}</td></tr>`,
            )
            .join('')}
        </table>
      </div>
      <div style="background:#ffffff;border-top:1px solid #e6eae7;padding:20px 24px;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#17221c;">Need us sooner?</p>
        <p style="margin:0 0 5px;font-size:13px;color:#3a423d;">Phone: <a href="${SITE.phoneHref}" style="color:${ACCENT};text-decoration:none;">${SITE.phoneDisplay}</a></p>
        <p style="margin:0 0 5px;font-size:13px;color:#3a423d;">WhatsApp: <a href="${SITE.whatsappHref}" style="color:${ACCENT};text-decoration:none;">Chat with us</a></p>
        <p style="margin:0 0 5px;font-size:13px;color:#3a423d;">Email: <a href="${SITE.emailHref}" style="color:${ACCENT};text-decoration:none;">${SITE.email}</a></p>
        <p style="margin:8px 0 0;font-size:12px;color:#68736d;">${SITE.address}</p>
      </div>
      <div style="background:#ffffff;border-radius:0 0 12px 12px;padding:16px 24px;text-align:center;border-top:1px solid #e6eae7;">
        <p style="margin:0;font-size:11px;line-height:1.5;color:#8a948e;">This is an automated confirmation from ${SITE.brand}. Please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
</html>`;

  try {
    const response = await fetch(`${url}/functions/v1/send-report-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify({
        to,
        subject: copy.subject,
        html,
        text,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}