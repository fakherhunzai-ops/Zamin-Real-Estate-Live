import { SITE } from '@/utils/site';

/**
 * Emails Zamin whenever a property enquiry is submitted, so no lead is missed.
 * Reuses the deployed send-report-email Edge Function (Resend under the hood).
 * Fails silently (returns false) when email is not configured, so the visitor
 * still sees a normal success message.
 */
export async function notifyEnquiry(fields: Record<string, string>): Promise<boolean> {
  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anonKey) return false;

  const entries = Object.entries(fields).filter(([, value]) => value.trim().length > 0);
  if (entries.length === 0) return false;

  const text = ['New property enquiry from the website', '', ...entries.map(([k, v]) => `${k}: ${v}`)].join(
    '\n',
  );
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;color:#17221c;">
    <h2 style="margin:0 0 12px;font-size:18px;">New property enquiry</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${entries
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#55605a;">${k}</td><td style="padding:6px 0;font-weight:600;text-align:right;">${v}</td></tr>`,
        )
        .join('')}
    </table>
    <p style="margin:16px 0 0;font-size:12px;color:#68736d;">Sent from the ${SITE.brand} website.</p>
  </div>`;

  try {
    const response = await fetch(`${url}/functions/v1/send-report-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify({
        to: SITE.email,
        subject: `New property enquiry — ${fields.Property || 'Website'}`,
        html,
        text,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}