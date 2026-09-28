type Props = {
  status: 'idle' | 'loading' | 'success' | 'error';
  successMsg?: string;
  errorMsg?: string;
  loadingMsg?: string;
};

export default function FormStatus({ status, successMsg, errorMsg, loadingMsg }: Props) {
  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-md border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800"
      >
        <span className="w-5 h-5 flex items-center justify-center text-primary-600 shrink-0">
          <i className="ri-checkbox-circle-fill text-lg"></i>
        </span>
        <span>{successMsg || 'Thank you! Your message has been received.'}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-md border border-foreground-300 bg-background-100 px-4 py-3 text-sm text-foreground-900"
      >
        <span className="w-5 h-5 flex items-center justify-center text-foreground-700 shrink-0">
          <i className="ri-error-warning-fill text-lg"></i>
        </span>
        <span>{errorMsg || 'Something went wrong. Please try again.'}</span>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <p className="flex items-center gap-2 text-sm text-foreground-600" role="status">
        <i className="ri-loader-4-line animate-spin text-lg text-primary-600"></i>
        {loadingMsg || 'Sending…'}
      </p>
    );
  }

  return null;
}