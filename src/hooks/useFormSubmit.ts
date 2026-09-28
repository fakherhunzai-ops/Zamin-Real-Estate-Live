import { useState } from 'react';
import { sendAutoReply, type AutoReplyType } from '@/utils/autoReplyEmail';

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type SubmitOptions = {
  successMessage?: string;
  onSuccess?: () => void;
  autoReply?: { to?: string; name?: string; type?: AutoReplyType };
};

/**
 * Shared form submission logic for the built-in Form endpoints.
 * Handles the anti-spam honeypot, x-www-form-urlencoded encoding and
 * success/error parsing so every form behaves consistently.
 */
export function useFormSubmit(url: string) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
    options?: SubmitOptions,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem('website_alt') as HTMLInputElement)?.value?.trim();
    if (honeypot) {
      setStatus('success');
      setSuccessMsg(options?.successMessage ?? 'Thank you! We will be in touch shortly.');
      form.reset();
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData(form);
      formData.delete('website_alt');
      const params = new URLSearchParams();
      formData.forEach((value, key) => {
        if (typeof value === 'string') params.append(key, value);
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const responseText = await response.text();
      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = {};
      }

      const message = (
        (parsed?.meta as { message?: string })?.message ||
        (parsed?.message as string) ||
        ''
      ).trim();

      const isSpamResponse = /spam/i.test(message) || /spam/i.test(responseText);
      const hasOkCode = parsed?.code === 'OK';
      const hasFallbackSuccess = response.ok && (!parsed || Object.keys(parsed).length === 0 || parsed?.code === undefined);

      const failed =
        !response.ok ||
        isSpamResponse ||
        (!hasOkCode && !hasFallbackSuccess && parsed?.code !== undefined);

      if (failed) {
        setStatus('error');
        setErrorMsg(message || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setSuccessMsg(options?.successMessage ?? message ?? 'Thank you! We will be in touch shortly.');
      form.reset();
      options?.onSuccess?.();

      const replyTo = options?.autoReply?.to?.trim();
      if (replyTo) {
        void sendAutoReply({
          to: replyTo,
          name: options?.autoReply?.name,
          type: options?.autoReply?.type,
        });
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return { status, errorMsg, successMsg, submit, reset };
}