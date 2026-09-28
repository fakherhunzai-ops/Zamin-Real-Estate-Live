export default function PrintButton({
  label = 'Print / Save as PDF',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 ${className}`.trim()}
    >
      <span className="flex h-4 w-4 items-center justify-center">
        <i className="ri-printer-line text-base"></i>
      </span>
      {label}
    </button>
  );
}