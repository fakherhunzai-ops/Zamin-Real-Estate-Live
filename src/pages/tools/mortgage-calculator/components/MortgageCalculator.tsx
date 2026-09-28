import { useMemo, useState } from 'react';
import { formatPKR, formatPrice } from '@/utils/format';
import ReportHeader from '@/components/feature/ReportHeader';
import PrintButton from '@/components/base/PrintButton';
import ScenarioCompare from '@/components/feature/ScenarioCompare';
import EmailSummaryButton from '@/components/base/EmailSummaryButton';
import SavedReportControls from '@/components/feature/SavedReportControls';
import AmortizationTable from './AmortizationTable';
import type { ScheduleRow } from './AmortizationTable';

const parseNum = (value: string): number => {
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const TERM_OPTIONS = [5, 10, 15, 20, 25];
const DOWN_PERCENT_OPTIONS = [10, 20, 30, 40];

type Field = {
  id: string;
  label: string;
  value: string;
  setValue: (next: string) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  max?: string;
};

function computeMortgage(input: { price: string; down: string; rate: string; years: string }) {
  const priceValue = Math.max(0, parseNum(input.price));
  const downValue = Math.min(Math.max(0, parseNum(input.down)), priceValue);
  const rateValue = Math.max(0, parseNum(input.rate));
  const yearsValue = Math.max(0, parseNum(input.years));

  const loan = Math.max(0, priceValue - downValue);
  const months = Math.round(yearsValue * 12);
  const monthlyRate = rateValue / 100 / 12;

  let emi = 0;
  if (loan > 0 && months > 0) {
    emi =
      monthlyRate > 0
        ? (loan * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1)
        : loan / months;
  }
  if (!Number.isFinite(emi)) emi = 0;

  const total = emi * months;
  const interest = Math.max(0, total - loan);

  const schedule: ScheduleRow[] = [];
  let balance = loan;
  for (let year = 1; year <= Math.ceil(yearsValue); year += 1) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    const monthsThisYear = Math.min(12, months - (year - 1) * 12);
    for (let month = 0; month < monthsThisYear; month += 1) {
      const interestPart = balance * monthlyRate;
      const principalPart = emi - interestPart;
      yearInterest += interestPart;
      yearPrincipal += principalPart;
      balance = Math.max(0, balance - principalPart);
    }
    schedule.push({ year, principal: yearPrincipal, interest: yearInterest, balance });
  }

  const downPercent = priceValue > 0 ? (downValue / priceValue) * 100 : 0;
  const principalShare = total > 0 ? (loan / total) * 100 : 100;

  return { priceValue, downValue, loan, months, emi, total, interest, schedule, downPercent, principalShare };
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState('25000000');
  const [down, setDown] = useState('5000000');
  const [rate, setRate] = useState('18');
  const [years, setYears] = useState('20');
  const [rateB, setRateB] = useState('15');
  const [yearsB, setYearsB] = useState('15');

  const result = useMemo(
    () => computeMortgage({ price, down, rate, years }),
    [price, down, rate, years],
  );
  const resultB = useMemo(
    () => computeMortgage({ price, down, rate: rateB, years: yearsB }),
    [price, down, rateB, yearsB],
  );

  const fields: Field[] = [
    {
      id: 'property-price',
      label: 'Property Price',
      value: price,
      setValue: setPrice,
      prefix: 'PKR',
      step: '100000',
    },
    {
      id: 'down-payment',
      label: 'Down Payment',
      value: down,
      setValue: setDown,
      prefix: 'PKR',
      step: '100000',
    },
    {
      id: 'interest-rate',
      label: 'Interest Rate',
      value: rate,
      setValue: setRate,
      suffix: '% / year',
      step: '0.25',
      max: '100',
    },
    {
      id: 'loan-term',
      label: 'Loan Term',
      value: years,
      setValue: setYears,
      suffix: 'years',
      step: '1',
      max: '40',
    },
  ];

  const applyDownPercent = (percent: number) => {
    setDown(String(Math.round(result.priceValue * (percent / 100))));
  };

  const reset = () => {
    setPrice('25000000');
    setDown('5000000');
    setRate('18');
    setYears('20');
    setRateB('15');
    setYearsB('15');
  };

  const emailSections = [
    {
      heading: 'Your Inputs',
      items: [
        { label: 'Property price', value: formatPKR(result.priceValue) },
        {
          label: 'Down payment',
          value: `${formatPKR(result.downValue)} (${result.downPercent.toFixed(0)}%)`,
        },
        { label: 'Interest rate', value: `${rate || 0}% / year` },
        { label: 'Loan term', value: `${years || 0} years` },
      ],
    },
    {
      heading: 'Results',
      items: [
        { label: 'Loan amount', value: formatPKR(result.loan) },
        { label: 'Monthly EMI', value: formatPKR(result.emi) },
        { label: 'Total interest', value: formatPKR(result.interest) },
        { label: 'Total repayment', value: formatPKR(result.total) },
      ],
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
              Loan Details
            </h2>
            <button
              type="button"
              onClick={reset}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
            >
              <i className="ri-refresh-line"></i>
              Reset
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5">
            {fields.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block text-sm font-semibold text-foreground-800"
                >
                  {field.label}
                </label>
                <div className="flex items-center rounded-md border border-background-300 bg-background-50 px-3.5 transition-colors focus-within:border-primary-500">
                  {field.prefix && (
                    <span className="mr-2 text-sm font-semibold text-foreground-500">
                      {field.prefix}
                    </span>
                  )}
                  <input
                    id={field.id}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max={field.max}
                    step={field.step}
                    value={field.value}
                    onChange={(event) => field.setValue(event.target.value)}
                    className="w-full bg-transparent py-3 text-sm font-medium text-foreground-950 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  {field.suffix && (
                    <span className="ml-2 whitespace-nowrap text-sm text-foreground-500">
                      {field.suffix}
                    </span>
                  )}
                </div>

                {field.id === 'property-price' && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[15000000, 25000000, 40000000, 60000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPrice(String(preset))}
                        className="cursor-pointer rounded-full border border-background-200 bg-background-100 px-3 py-1 text-xs font-medium text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                      >
                        {formatPrice(preset)}
                      </button>
                    ))}
                  </div>
                )}

                {field.id === 'down-payment' && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {DOWN_PERCENT_OPTIONS.map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => applyDownPercent(percent)}
                        className="cursor-pointer rounded-full border border-background-200 bg-background-100 px-3 py-1 text-xs font-medium text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                      >
                        {percent}%
                      </button>
                    ))}
                    <span className="text-xs text-foreground-500">
                      {result.downPercent.toFixed(0)}% of price
                    </span>
                  </div>
                )}

                {field.id === 'loan-term' && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TERM_OPTIONS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setYears(String(term))}
                        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          Number(years) === term
                            ? 'border-primary-700 bg-primary-700 text-background-50'
                            : 'border-background-200 bg-background-100 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
                        }`}
                      >
                        {term} yrs
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-primary-200 bg-primary-50 p-6 md:p-8 lg:sticky lg:top-24">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
            Estimated Monthly Payment
          </span>
          <p className="mt-2 font-heading text-3xl font-bold text-primary-900 md:text-4xl">
            {formatPKR(result.emi)}
          </p>
          <p className="mt-1 text-sm text-foreground-600">
            over {result.months || 0} months ({years || 0} years)
          </p>

          <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-background-200">
            <div className="h-full bg-primary-700" style={{ width: `${result.principalShare}%` }} />
            <div className="h-full bg-accent-500" style={{ width: `${100 - result.principalShare}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-foreground-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-700" />
              Principal {result.principalShare.toFixed(0)}%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-500" />
              Interest {(100 - result.principalShare).toFixed(0)}%
            </span>
          </div>

          <dl className="mt-6 flex flex-col gap-3 border-t border-primary-200 pt-5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground-600">Loan Amount</dt>
              <dd className="font-semibold tabular-nums text-foreground-900">
                {formatPKR(result.loan)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground-600">Down Payment</dt>
              <dd className="font-semibold tabular-nums text-foreground-900">
                {formatPKR(result.downValue)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground-600">Total Interest</dt>
              <dd className="font-semibold tabular-nums text-accent-700">
                {formatPKR(result.interest)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-primary-200 pt-3">
              <dt className="font-semibold text-foreground-900">Total Repayment</dt>
              <dd className="font-bold tabular-nums text-primary-900">{formatPKR(result.total)}</dd>
            </div>
          </dl>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-foreground-500">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
              <i className="ri-information-line text-sm"></i>
            </span>
            Estimates only. Actual rates, fees and approval terms depend on your bank or lender.
          </p>
        </div>
      </div>

      <AmortizationTable rows={result.schedule} />

      <ScenarioCompare
        title="Compare two loans"
        description="Weighing up two bank offers? Change the rate or term of Loan B and watch the monthly payment and total interest move — side by side with your current figures."
        labelA="Loan A (current)"
        labelB="Loan B (what if)"
        inputs={[
          {
            id: 'scenario-rate',
            label: 'Interest Rate',
            value: rateB,
            onChange: setRateB,
            suffix: '% / year',
            step: '0.25',
            max: '100',
          },
          {
            id: 'scenario-term',
            label: 'Loan Term',
            value: yearsB,
            onChange: setYearsB,
            suffix: 'years',
            step: '1',
            max: '40',
          },
        ]}
        metrics={[
          {
            label: 'Monthly EMI',
            valueA: result.emi,
            valueB: resultB.emi,
            format: formatPKR,
            lowerIsBetter: true,
          },
          {
            label: 'Total interest',
            valueA: result.interest,
            valueB: resultB.interest,
            format: formatPKR,
            lowerIsBetter: true,
          },
          {
            label: 'Total repayment',
            valueA: result.total,
            valueB: resultB.total,
            format: formatPKR,
            lowerIsBetter: true,
          },
        ]}
        note="Both scenarios share your current property price and down payment — only the rate and term differ."
      />

      <SavedReportControls
        className="mt-8"
        reportKey="mortgage"
        data={{ price, down, rate, years }}
        onRestore={(restored) => {
          setPrice(restored.price);
          setDown(restored.down);
          setRate(restored.rate);
          setYears(restored.years);
        }}
      />

      <div className="print-area mt-8 rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
              Mortgage Summary
            </h3>
            <p className="mt-1 text-sm text-foreground-600">
              Take this summary to your bank or lender.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <PrintButton />
            <EmailSummaryButton title="Mortgage & EMI Calculator" sections={emailSections} />
          </div>
        </div>

        <div className="mt-6">
          <ReportHeader title="Mortgage & EMI Calculator" />

          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
                Your Inputs
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Property price</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.priceValue)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Down payment</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.downValue)} ({result.downPercent.toFixed(0)}%)
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Interest rate</span>
                  <span className="font-semibold tabular-nums text-foreground-900">{rate || 0}% / year</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Loan term</span>
                  <span className="font-semibold tabular-nums text-foreground-900">{years || 0} years</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
                Results
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Loan amount</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.loan)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Monthly EMI</span>
                  <span className="font-bold tabular-nums text-primary-900">
                    {formatPKR(result.emi)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3 border-t border-background-200 pt-2.5">
                  <span className="text-foreground-600">Total interest</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.interest)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Total repayment</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.total)}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-6 border-t border-background-200 pt-4 text-xs leading-relaxed text-foreground-500">
            This summary is an estimate prepared for planning purposes only and is not a loan
            offer. Actual rates, fees and approval terms depend on your bank or lender.
          </p>
        </div>
      </div>
    </div>
  );
}