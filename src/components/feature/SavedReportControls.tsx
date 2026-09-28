import { useState } from 'react';
import { useSavedReport } from '@/hooks/useSavedReport';

type Props<T> = {
  reportKey: string;
  data: T;
  onRestore: (data: T) => void;
  className?: string;
};

/**
 * Lets a visitor save the current calculator inputs on their device and reopen
 * them later. Pair with any calculator that has a printable summary.
 */
export default function SavedReportControls<T>({
  reportKey,
  data,
  onRestore,
  className = '',
}: Props<T>) {
  const { saved, save, clear } = useSavedReport<T>(reportKey);
  const [dismissed, setDismissed] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    save(data);
    setDismissed(false);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2500);
  };

  const savedDate = saved
    ? new Date(saved.savedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className={`print:hidden ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
        >
          <span className="flex h-4 w-4 items-center justify-center">
            <i className={`${saved ? 'ri-bookmark-fill' : 'ri-bookmark-line'} text-base`}></i>
          </span>
          {saved ? 'Update saved report' : 'Save this report'}
        </button>
        {justSaved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-700">
            <i className="ri-check-line"></i>
            Saved on this device
          </span>
        )}
      </div>

      {saved && !dismissed && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md border border-primary-200 bg-primary-50 px-4 py-3">
          <span className="flex h-5 w-5 items-center justify-center text-primary-700">
            <i className="ri-history-line"></i>
          </span>
          <span className="text-sm text-foreground-700">
            You have a saved report from <strong className="font-semibold">{savedDate}</strong>.
          </span>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onRestore(saved.data)}
              className="cursor-pointer whitespace-nowrap rounded-md bg-primary-800 px-3.5 py-1.5 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-900"
            >
              Reopen it
            </button>
            <button
              type="button"
              onClick={clear}
              className="cursor-pointer whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold text-foreground-600 transition-colors hover:text-foreground-900"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss saved report notice"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-background-100 hover:text-foreground-800"
            >
              <i className="ri-close-line text-base"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}