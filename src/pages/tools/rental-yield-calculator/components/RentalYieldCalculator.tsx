import { useMemo, useState } from 'react';
import { formatPKR, formatPrice } from '@/utils/format';
import ReportHeader from '@/components/feature/ReportHeader';
import PrintButton from '@/components/base/PrintButton';
import ScenarioCompare from '@/components/feature/ScenarioCompare';
import EmailSummaryButton from '@/components/base/EmailSummaryButton';
import SavedReportControls from '@/components/feature/SavedReportControls';

const parseNum = (value: string): number => {
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

type Field = {
  id: string;
  label: string;
  value: string;
  setValue: (next: string) => void;
  hint?: string;
  prefix?: string;
  suffix?: string;
  step?: string;
  max?: string;
};

function computeRental(input: {
  rent: string;
  price: string;
  expenses: string;
  management: string;
  vacancy: string;
}) {
  const monthlyRent = Math.max(0, parseNum(input.rent));
  const value = Math.max(0, parseNum(input.price));
  const annualExpenses = Math.max(0, parseNum(input.expenses));
  const mgmtPct = Math.min(Math.max(0, parseNum(input.management)), 100);
  const vacancyWeeks = Math.min(Math.max(0, parseNum(input.vacancy)), 52);

  const annualGross = monthlyRent * 12;
  const managementCost = (annualGross * mgmtPct) / 100;
  const vacancyLoss = (annualGross * vacancyWeeks) / 52;
  const netAnnual = annualGross - managementCost - vacancyLoss - annualExpenses;

  const grossYield = value > 0 ? (annualGross / value) * 100 : 0;
  const netYield = value > 0 ? (netAnnual / value) * 100 : 0;
  const paybackYears = netAnnual > 0 ? value / netAnnual : 0;
  const monthlyNet = netAnnual / 12;

  return {
    value,
    monthlyRent,
    annualGross,
    annualExpenses,
    managementCost,
    vacancyLoss,
    netAnnual,
    grossYield,
    netYield,
    paybackYears,
    monthlyNet,
  };
}

export default function RentalYieldCalculator() {
  const [rent, setRent] = useState('85000');
  const [price, setPrice] = useState('18000000');
  const [expenses, setExpenses] = useState('120000');
  const [management, setManagement] = useState('8');
  const [vacancy, setVacancy] = useState('4');
  const [rentB, setRentB] = useState('110000');
  const [priceB, setPriceB] = useState('22000000');

  const result = useMemo(
    () => computeRental({ rent, price, expenses, management, vacancy }),
    [rent, price, expenses, management, vacancy],
  );
  const resultB = useMemo(
    () => computeRental({ rent: rentB, price: priceB, expenses, management, vacancy }),
    [rentB, priceB, expenses, management, vacancy],
  );

  const reset = () => {
    setRent('85000');
    setPrice('18000000');
    setExpenses('120000');
    setManagement('8');
    setVacancy('4');
    setRentB('110000');
    setPriceB('22000000');
  };

  const emailSections = [
    {
      heading: 'Your Inputs',
      items: [
        { label: 'Purchase price', value: formatPKR(result.value) },
        { label: 'Monthly rent', value: formatPKR(result.monthlyRent) },
        { label: 'Annual running costs', value: formatPKR(result.annualExpenses) },
        { label: 'Management fee', value: `${management || 0}%` },
        { label: 'Expected vacancy', value: `${vacancy || 0} weeks / year` },
      ],
    },
    {
      heading: 'Results',
      items: [
        { label: 'Gross yield', value: `${result.grossYield.toFixed(2)}%` },
        { label: 'Net yield', value: `${result.netYield.toFixed(2)}%` },
        { label: 'Annual gross rent', value: formatPKR(result.annualGross) },
        { label: 'Net annual income', value: formatPKR(result.netAnnual) },
        { label: 'Net monthly cash flow', value: formatPKR(result.monthlyNet) },
        {
          label: 'Payback period',
          value: result.paybackYears > 0 ? `${result.paybackYears.toFixed(1)} years` : '—',
        },
      ],
    },
  ];

  const fields: Field[] = [
    {
      id: 'monthly-rent',
      label: 'Expected Monthly Rent',
      value: rent,
      setValue: setRent,
      prefix: 'PKR',
      step: '1000',
      hint: 'Typical annual gross rent: ' + formatPKR(result.annualGross),
    },
    {
      id: 'property-value',
      label: 'Purchase Price',
      value: price,
      setValue: setPrice,
      prefix: 'PKR',
      step: '100000',
      hint: '',
    },
    {
      id: 'annual-expenses',
      label: 'Annual Running Costs',
      value: expenses,
      setValue: setExpenses,
      prefix: 'PKR',
      step: '10000',
      hint: 'Maintenance, taxes, insurance and repairs per year.',
    },
    {
      id: 'management-fee',
      label: 'Management / Agent Fee',
      value: management,
      setValue: setManagement,
      suffix: '% of rent',
      step: '0.5',
      max: '100',
      hint: '',
    },
    {
      id: 'vacancy',
      label: 'Expected Vacancy',
      value: vacancy,
      setValue: setVacancy,
      suffix: 'weeks / year',
      step: '1',
      max: '52',
      hint: 'Weeks the property may sit empty between tenants.',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
              Rental Details
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

                {field.id === 'property-value' && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[8000000, 15000000, 25000000, 40000000].map((preset) => (
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

                {field.hint && <p className="mt-2 text-xs text-foreground-500">{field.hint}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-primary-200 bg-primary-50 p-6 md:p-8 lg:sticky lg:top-24">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
            Estimated Net Yield
          </span>
          <p className="mt-2 font-heading text-3xl font-bold text-primary-900 md:text-4xl">
            {result.netYield.toFixed(2)}%
          </p>
          <p className="mt-1 text-sm text-foreground-600">
            gross yield {result.grossYield.toFixed(2)}% · payback {result.paybackYears > 0 ? `${result.paybackYears.toFixed(1)} yrs` : '—'}
          </p>

          <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-background-200">
            <div className="h-full bg-primary-700" style={{ width: '60%' }} />
            <div className="h-full bg-accent-500" style={{ width: '40%' }} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-foreground-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-700" />
              Retained income
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-500" />
              Costs &amp; vacancy
            </span>
          </div>

          <dl className="mt-6 flex flex-col gap-3 border-t border-primary-200 pt-5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground-600">Annual Gross Rent</dt>
              <dd className="font-semibold tabular-nums text-foreground-900">
                {formatPKR(result.annualGross)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground-600">Annual Costs</dt>
              <dd className="font-semibold tabular-nums text-foreground-900">
                {formatPKR(result.managementCost + result.vacancyLoss + result.annualExpenses)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground-600">Net Annual Income</dt>
              <dd className="font-semibold tabular-nums text-accent-700">
                {formatPKR(result.netAnnual)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-primary-200 pt-3">
              <dt className="font-semibold text-foreground-900">Net Monthly Cash Flow</dt>
              <dd className="font-bold tabular-nums text-primary-900">
                {formatPKR(result.monthlyNet)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-foreground-500">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
              <i className="ri-information-line text-sm"></i>
            </span>
            Estimates only. Actual rents, costs and occupancy vary by area and season.
          </p>
        </div>
      </div>

      <ScenarioCompare
        title="Compare two properties"
        description="Test a second property against your current one. Change the rent and price of Scenario B to see which delivers the stronger yield and cash flow."
        labelA="Property A (current)"
        labelB="Property B (what if)"
        inputs={[
          {
            id: 'scenario-rent',
            label: 'Monthly Rent',
            value: rentB,
            onChange: setRentB,
            prefix: 'PKR',
            step: '1000',
          },
          {
            id: 'scenario-price',
            label: 'Purchase Price',
            value: priceB,
            onChange: setPriceB,
            prefix: 'PKR',
            step: '100000',
          },
        ]}
        metrics={[
          {
            label: 'Gross yield',
            valueA: result.grossYield,
            valueB: resultB.grossYield,
            format: (v) => `${v.toFixed(2)}%`,
            lowerIsBetter: false,
          },
          {
            label: 'Net yield',
            valueA: result.netYield,
            valueB: resultB.netYield,
            format: (v) => `${v.toFixed(2)}%`,
            lowerIsBetter: false,
          },
          {
            label: 'Net annual income',
            valueA: result.netAnnual,
            valueB: resultB.netAnnual,
            format: formatPKR,
            lowerIsBetter: false,
          },
          {
            label: 'Payback period',
            valueA: result.paybackYears,
            valueB: resultB.paybackYears,
            format: (v) => (v > 0 ? `${v.toFixed(1)} yrs` : '—'),
            lowerIsBetter: true,
          },
        ]}
        note="Both properties use the same costs, management fee and vacancy assumptions — only rent and price change."
      />

      <SavedReportControls
        className="mt-8"
        reportKey="rental-yield"
        data={{ rent, price, expenses, management, vacancy }}
        onRestore={(restored) => {
          setRent(restored.rent);
          setPrice(restored.price);
          setExpenses(restored.expenses);
          setManagement(restored.management);
          setVacancy(restored.vacancy);
        }}
      />

      <div className="print-area mt-8 rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
              Rental Yield Summary
            </h3>
            <p className="mt-1 text-sm text-foreground-600">
              Take this summary to your bank, lender or adviser.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <PrintButton />
            <EmailSummaryButton title="Rental Yield Calculator" sections={emailSections} />
          </div>
        </div>

        <div className="mt-6">
          <ReportHeader title="Rental Yield Calculator" />

          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
                Your Inputs
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Purchase price</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.value)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Monthly rent</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.monthlyRent)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Annual running costs</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.annualExpenses)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Management fee</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {management || 0}%
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Expected vacancy</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {vacancy || 0} weeks / year
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
                Results
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Gross yield</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {result.grossYield.toFixed(2)}%
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Net yield</span>
                  <span className="font-bold tabular-nums text-primary-900">
                    {result.netYield.toFixed(2)}%
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3 border-t border-background-200 pt-2.5">
                  <span className="text-foreground-600">Annual gross rent</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.annualGross)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Net annual income</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.netAnnual)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Net monthly cash flow</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {formatPKR(result.monthlyNet)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-foreground-600">Payback period</span>
                  <span className="font-semibold tabular-nums text-foreground-900">
                    {result.paybackYears > 0 ? `${result.paybackYears.toFixed(1)} years` : '—'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-6 border-t border-background-200 pt-4 text-xs leading-relaxed text-foreground-500">
            This summary is an estimate prepared for planning purposes only and is not a valuation
            or financial advice. Confirm actual rent, costs and returns before investing.
          </p>
        </div>
      </div>
    </div>
  );
}