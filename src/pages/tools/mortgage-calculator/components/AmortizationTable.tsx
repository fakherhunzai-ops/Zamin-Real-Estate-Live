import { formatPKR } from '@/utils/format';

export type ScheduleRow = {
  year: number;
  principal: number;
  interest: number;
  balance: number;
};

export default function AmortizationTable({ rows }: { rows: ScheduleRow[] }) {
  if (rows.length === 0) return null;

  return (
    <div className="mt-8 rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
          Yearly Repayment Schedule
        </h3>
        <span className="text-xs text-foreground-500">Principal vs interest each year</span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-background-200 text-left text-xs uppercase tracking-wide text-foreground-500">
              <th className="pb-3 pr-4 font-semibold">Year</th>
              <th className="pb-3 pr-4 text-right font-semibold">Principal Paid</th>
              <th className="pb-3 pr-4 text-right font-semibold">Interest Paid</th>
              <th className="pb-3 text-right font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.year}
                className="border-b border-background-100 last:border-0 text-foreground-700"
              >
                <td className="py-3 pr-4 font-semibold text-foreground-900">Year {row.year}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{formatPKR(row.principal)}</td>
                <td className="py-3 pr-4 text-right tabular-nums text-accent-700">
                  {formatPKR(row.interest)}
                </td>
                <td className="py-3 text-right tabular-nums">{formatPKR(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}