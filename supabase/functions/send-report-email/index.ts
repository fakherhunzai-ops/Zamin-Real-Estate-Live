const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_DOMAIN = Deno.env.get('RESEND_FROM_DOMAIN');

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const isEmail = (value: unknown): value is string =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

type ReportPayload = {
  to?: string;
  subject?: string;
  html?: string;
  text?: string;
  bcc?: string;
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let payload: ReportPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const to = typeof payload.to === 'string' ? payload.to.trim() : '';
  if (!isEmail(to)) {
    return json({ error: 'A valid "to" email address is required.' }, 400);
  }

  if (!RESEND_API_KEY || !RESEND_FROM_DOMAIN) {
    return json(
      {
        error:
          'Email service is not configured. Add RESEND_API_KEY and RESEND_FROM_DOMAIN to the Supabase Edge Function secrets.',
      },
      503,
    );
  }

  const subject =
    typeof payload.subject === 'string' && payload.subject.trim()
      ? payload.subject.trim()
      : 'Your property summary';
  const text = typeof payload.text === 'string' ? payload.text : '';
  const html =
    typeof payload.html === 'string'
      ? payload.html
      : `<p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#17221c;">${escapeHtml(
          text,
        ).replace(/\n/g, '<br />')}</p>`;
  const bcc = isEmail(payload.bcc) ? payload.bcc.trim() : undefined;

  const from = `Zamin Real Estate <noreply@${RESEND_FROM_DOMAIN}>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        bcc: bcc ? [bcc] : undefined,
        subject,
        html,
        text,
      }),
    });

    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    if (!res.ok) {
      return json({ error: 'Failed to send email', detail: data }, 502);
    }
    return json({ ok: true, id: data?.id ?? null });
  } catch (error) {
    return json({ error: 'Unexpected error sending email', detail: String(error) }, 500);
  }
});
