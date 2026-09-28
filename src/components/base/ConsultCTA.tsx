import Button from '@/components/base/Button';

type Action = {
  label: string;
  to?: string;
  href?: string;
  icon?: string;
  variant?: 'primary' | 'gold' | 'outline' | 'outlineLight' | 'light' | 'ghost';
};

type Props = {
  eyebrow?: string;
  eyebrowIcon?: string;
  title: string;
  description: string;
  primary: Action;
  secondary?: Action;
};

export default function ConsultCTA({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  primary,
  secondary,
}: Props) {
  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-card bg-primary-900 px-6 py-12 md:px-14 md:py-16">
          <div className="absolute inset-0 opacity-[0.14]">
            <img
              src="https://readdy.ai/api/search-image?query=Soft%20abstract%20artistic%20background%20of%20layered%20mountain%20silhouettes%20in%20deep%20forest%20green%20tones%2C%20minimal%20elegant%20gradient%2C%20subtle%20grain%20texture%2C%20clean%20modern%20premium%20aesthetic&width=1600&height=700&seq=zamin-consult-cta&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-300">
                  {eyebrowIcon && (
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i className={`${eyebrowIcon} text-sm`}></i>
                    </span>
                  )}
                  {eyebrow}
                </span>
              )}
              <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-white md:text-4xl">
                {title}
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-background-200">{description}</p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button
                to={primary.to}
                href={primary.href}
                icon={primary.icon}
                variant={primary.variant || 'light'}
                size="lg"
                iconRight={primary.icon ? undefined : 'ri-arrow-right-line'}
              >
                {primary.label}
              </Button>
              {secondary && (
                <Button
                  to={secondary.to}
                  href={secondary.href}
                  icon={secondary.icon}
                  variant={secondary.variant || 'outlineLight'}
                  size="lg"
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}