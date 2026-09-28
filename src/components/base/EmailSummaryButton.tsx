import { useState } from 'react';
import { SITE } from '@/utils/site';
import { sendReportEmail } from '@/utils/reportEmail';

export type SummarySection = {
  heading: string;
  items: { label: string; value: string }[];
};

type Props = {
  title: string;
  sections: SummarySection[];
  note?: string;
  className?: string;
};

function buildText(title: string, sections: SummarySection[], note?: string): string {
  const lines: string[] = [`${SITE.brand} — ${title}`, ''];
  sections.forEach((section) => {
    lines.push(section.heading.toUpperCase());
    section.items.forEach((item) => lines.push(`  ${item.label}: ${item.value}`));
    lines.push('');
  });
  if (note) {
    lines.push(note);
    lines.push('');
  }
  lines.push(SITE.brand);
  lines.push(SITE.address);
  lines.push(`${SITE.phoneDisplay} · ${SITE.email}`);
  return lines.join('\n');
}

function buildHtml(title: string, sections: SummarySection[], note?: string): string {
  const body = sections
    .map((section) => {
      const rows = section.items
        .map(
          (item) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#55605a;">${item.label}</td><td style="padding:6px 0;font-weight:600;color:#17221c;text-align:right;">${item.value}</td></tr>`,
        )
        .join('');
      return `<h3 style="margin:20px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#123625;">${section.heading}</h3><table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>`;
    })
    .join('');

  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#17221c;">
    <p style="margin:0;font-size:16px;font-weight:700;">${SITE.brand}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#68736d;">${SITE.address} &middot; ${SITE.phoneDisplay}</p>
    <hr style="border:none;border-top:1px solid #e5e8e5;margin:16px 0;" />
    <h2 style="margin:0;font-size:18px;">${title}</h2>
    ${body}
    ${note ? `<p style="margin:20px 0 0;font-size:12px;color:#68736d;line-height:1.5;">${note}</p>` : ''}
    <p style="margin:20px 0 0;font-size:12px;color:#68736d;">This summary is an estimate for planning purposes only.</p>
  </div>`;
}

export default function EmailSummaryButton({ title, sections, note, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle');
  const [message, setMessage] = useState('');

  const subject = `${SITE.brand} — ${title}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = email.trim();
    if (!target) return;

    setStatus('sending');
    setMessage('');

    const text = buildText(title, sections, note);
    const html = buildHtml(title, sections, note);

    const sent = await sendReportEmail({ to: target, bcc: SITE.email, subject, html, text });
    if (sent) {
      setStatus('sent');
      setMessage(`Sent to ${target}. Check your inbox in a moment.`);
      return;
    }

    const mailto = `mailto:${target}?cc=${encodeURIComponent(SITE.email)}&subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;
    setStatus('fallback');
    setMessage('Opening your email app with the summary ready to send.');
  };

  return (
    <div className={`relative print:hidden ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
      >
        <span className="flex h-4 w-4 items-center justify-center">
          <i className="ri-mail-send-line text-base"></i>
        </span>
        Email me this summary
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-0 z-30 mt-2 w-80 rounded-md border border-background-200 bg-background-50 p-4 text-left"
        >
          <label htmlFor="summary-email" className="block text-sm font-semibold text-foreground-900">
            Send this report to your inbox
          </label>
          <p className="mt-1 text-xs leading-relaxed text-foreground-600">
            We&apos;ll email the summary, and copy Zamin so we can help if you have questions.
          </p>
          <input
            id="summary-email"
            type="email"
            name="summary-email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-3 w-full rounded-md border border-background-300 bg-background-50 px-3.5 py-2.5 text-sm text-foreground-950 placeholder:text-foreground-400 focus:border-primary-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-wait disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send summary'}
          </button>
          {message && (
            <p
              className={`mt-3 text-xs leading-relaxed ${
                status === 'sent' ? 'text-accent-700' : 'text-foreground-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}