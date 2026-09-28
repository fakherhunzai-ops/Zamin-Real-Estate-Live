import type { ReactNode } from 'react';

export type CompareInput = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  max?: string;
};

export type CompareMetric = {
  label: string;
  valueA: number;
  valueB: number;
  format: (value: number) => string;
  /** true → lower is better; false → higher is better; undefined → neutral (no judgement). */
  lowerIsBetter?: boolean;
};

type Props = {
  title: string;
  description?: string;
  labelA?: string;
  labelB?: string;
  inputs: CompareInput[];
  metrics: CompareMetric[];
  note?: string;
  action?: ReactNode;
};

/**
 * Reusable side-by-side "what if" comparison. Scenario A always reflects the
 * calculator's current inputs; Scenario B is driven by a small set of tweakable
 * inputs so buyers can weigh up two options at once.
 */
export default function ScenarioCompare({
  title,
  description,
  labelA = 'Scenario A',
  labelB = 'Scenario B',
  inputs,
  metrics,
  note,
  action,
}: Props) {
  return (
    <div className="mt-8 rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-700">
            <span className="flex h-4 w-4 items-center justify-center">
              <i className="ri-arrow-left-right-line text-sm"></i>
            </span>
            What if?
          </span>
          <h3 className="mt-2 font-heading text-lg font-bold text-foreground-950 md:text-xl">
            {title}
          </h3>
          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">{description}</p>
          )}
        </div>
        {action}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {inputs.map((input) => (
          <div key={input.id}>
            <label
              htmlFor={input.id}
              className="mb-2 block text-sm font-semibold text-foreground-800"
            >
              {input.label}
            </label>
            <div className="flex items-center rounded-md border border-background-300 bg-background-50 px-3.5 transition-colors focus-within:border-primary-500">
              {input.prefix && (
                <span className="mr-2 text-sm font-semibold text-foreground-500">
                  {input.prefix}
                </span>
              )}
              <input
                id={input.id}
                type="number"
                inputMode="decimal"
                min="0"
                max={input.max}
                step={input.step}
                value={input.value}
                onChange={(event) => input.onChange(event.target.value)}
                className="w-full bg-transparent py-2.5 text-sm font-medium text-foreground-950 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {input.suffix && (
                <span className="ml-2 whitespace-nowrap text-sm text-foreground-500">
                  {input.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-background-200 text-left text-xs uppercase tracking-wide text-foreground-500">
              <th className="pb-3 pr-4 font-semibold">Measure</th>
              <th className="pb-3 pr-4 text-right font-semibold">{labelA}</th>
              <th className="pb-3 pr-4 text-right font-semibold">{labelB}</th>
              <th className="pb-3 text-right font-semibold">Difference</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const diff = metric.valueB - metric.valueA;
              const judged = metric.lowerIsBetter !== undefined;
              const bIsBetter = judged
                ? metric.lowerIsBetter
                  ? metric.valueB < metric.valueA
                  : metric.valueB > metric.valueA
                : null;
              const aIsBetter = bIsBetter === null ? false : !bIsBetter;
              const diffLabel =
                diff === 0 ? '—' : `${diff > 0 ? '+' : '−'}${metric.format(Math.abs(diff))}`;

              return (
                <tr
                  key={metric.label}
                  className="border-b border-background-100 text-foreground-700 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-foreground-800">{metric.label}</td>
                  <td
                    className={`py-3 pr-4 text-right tabular-nums ${
                      aIsBetter ? 'font-bold text-primary-900' : 'font-semibold text-foreground-900'
                    }`}
                  >
                    {metric.format(metric.valueA)}
                  </td>
                  <td
                    className={`py-3 pr-4 text-right tabular-nums ${
                      bIsBetter ? 'font-bold text-primary-900' : 'font-semibold text-foreground-900'
                    }`}
                  >
                    {metric.format(metric.valueB)}
                  </td>
                  <td
                    className={`py-3 text-right font-semibold tabular-nums ${
                      bIsBetter === null
                        ? 'text-foreground-500'
                        : bIsBetter
                          ? 'text-accent-700'
                          : 'text-foreground-500'
                    }`}
                  >
                    {diffLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-foreground-500">
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
          <i className="ri-information-line text-sm"></i>
        </span>
        {note ||
          'The first column reflects your current inputs. Adjust the fields above to test a second option instantly.'}
      </p>
    </div>
  );
}