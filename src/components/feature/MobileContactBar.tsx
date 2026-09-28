import { useEffect, useState } from 'react';
import { SITE } from '@/utils/site';

const STORAGE_KEY = 'zamin-mobile-bar-visible';

/**
 * Persistent mobile-only action bar so contacting Zamin is always one tap away.
 * Hidden from lg upward where the header actions are always visible.
 * The bar can be collapsed with the toggle handle; the choice is remembered,
 * and a small floating button brings it back.
 */
export default function MobileContactBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'false') setVisible(false);
    } catch {
      /* ignore storage access errors */
    }
  }, []);

  const setBar = (next: boolean) => {
    setVisible(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore storage access errors */
    }
  };

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setBar(true)}
        aria-label="Show contact bar"
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary-800 text-background-50 transition-colors hover:bg-primary-900 lg:hidden"
      >
        <i className="ri-phone-line text-xl"></i>
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <button
        type="button"
        onClick={() => setBar(false)}
        aria-label="Hide contact bar"
        className="absolute -top-3 left-1/2 flex h-6 w-10 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-background-200 bg-background-50 text-foreground-500 transition-colors hover:text-foreground-800"
      >
        <i className="ri-arrow-down-s-line text-base"></i>
      </button>

      <div className="border-t border-background-200 bg-background-50 p-2">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={SITE.phoneHref}
            aria-label="Call Zamin Real Estate"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <i className="ri-phone-line text-lg"></i>
            </span>
            Call Now
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Zamin Real Estate on WhatsApp"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 bg-background-50 px-4 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <i className="ri-whatsapp-line text-lg"></i>
            </span>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}