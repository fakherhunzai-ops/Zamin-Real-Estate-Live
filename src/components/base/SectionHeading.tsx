type Props = {
  eyebrow?: string;
  eyebrowIcon?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = 'left',
  className = '',
  light = false,
}: Props) {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${
            light ? 'text-accent-300' : 'text-accent-600'
          }`}
        >
          {eyebrowIcon && (
            <span className="w-4 h-4 flex items-center justify-center">
              <i className={`${eyebrowIcon} text-sm`}></i>
            </span>
          )}
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-3 font-heading text-2xl md:text-4xl font-bold leading-tight ${
          light ? 'text-background-50' : 'text-foreground-950'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-sm md:text-base leading-relaxed max-w-2xl ${
            light ? 'text-background-300' : 'text-foreground-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}