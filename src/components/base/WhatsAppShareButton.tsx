type Props = {
  /** The full message to pre-fill in WhatsApp. */
  text: string;
  /** Optional number to send to. Leave empty to let the visitor pick a contact. */
  phone?: string;
  label?: string;
  className?: string;
};

/**
 * Opens WhatsApp with a pre-filled message so a visitor can forward it to
 * family or friends in a single tap. Works on both desktop (web) and mobile.
 */
export default function WhatsAppShareButton({
  text,
  phone = '',
  label = 'Share on WhatsApp',
  className = '',
}: Props) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent-600 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-accent-700 ${className}`.trim()}
    >
      <span className="flex h-4 w-4 items-center justify-center">
        <i className="ri-whatsapp-line text-base"></i>
      </span>
      {label}
    </a>
  );
}