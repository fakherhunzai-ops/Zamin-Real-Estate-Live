export type ReportEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  bcc?: string;
};

/**
 * Attempts to send a calculator summary via the connected backend + email service.
 * Returns false when no backend is configured or the request fails, so the caller
 * can gracefully fall back to opening the visitor's own mail app.
 */
export async function sendReportEmail(payload: ReportEmailPayload): Promise<boolean> {
  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) return false;

  try {
    const response = await fetch(`${url}/functions/v1/send-report-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}