import { Link } from 'react-router-dom';
import SectionHeading from '@/components/base/SectionHeading';
import { tools } from '@/mocks/tools';

type Props = {
  /** Key of the tool currently being viewed, so we don't link back to itself. */
  currentKey?: string;
  className?: string;
  tone?: 'light' | 'muted';
};

export default function ToolsSection({ currentKey, className = '', tone = 'light' }: Props) {
  const list = tools.filter((tool) => tool.key !== currentKey);

  if (list.length === 0) return null;

  const bg = tone === 'muted' ? 'bg-background-100' : 'bg-background-50';

  return (
    <section className={`${bg} py-14 md:py-20 ${className}`.trim()}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Free Tools"
          eyebrowIcon="ri-tools-line"
          title="More free property tools"
          description="Plan your purchase or investment with our free calculators — no sign-up, no cost, just clear numbers you can take to your bank."
        />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((tool) => (
            <Link
              key={tool.key}
              to={tool.href}
              className="group flex flex-col rounded-card border border-background-200 bg-background-50 p-6 transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-800 text-background-50">
                  <i className={`${tool.icon} text-2xl`}></i>
                </span>
                <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-900">
                  {tool.tag}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground-950">
                {tool.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-600">{tool.short}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                Open tool
                <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5"></i>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}