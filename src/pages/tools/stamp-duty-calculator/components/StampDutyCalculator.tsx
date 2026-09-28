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

type RateField = {
  id: string;
  label: string;
  value: string;
  setValue: (next: string) => void;
  suffix: string;
  step: string;
  hint: string;
};

function computeStamp(input: {
  price: string;
  stamp: string;
  registration: string;
  mutation: string;
  commission: string;
  legal: string;
  other: string;
}) {
  const value = Math.max(0, parseNum(input.price));
  const rate = (raw: string) => Math.max(0, parseNum(raw));

  const stampDuty = (value * rate(input.stamp)) / 100;
  const registrationFee = (value * rate(input.registration)) / 100;
  const mutationFee = (value * rate(input.mutation)) / 100;
  const agencyFee = (value * rate(input.commission)) / 100;
  const legalFee = Math.max(0, rate(input.legal));
  const otherFee = Math.max(0, rate(input.other));

  const lineItems = [
    { key: 'stamp', label: 'Stamp duty', amount: stampDuty },
    { key: 'registration', label: 'Registration fee', amount: registrationFee },
    { key: 'mutation', label: 'Mutation / transfer fee', amount: mutationFee },
    { key: 'agency', label: 'Agency commission', amount: agencyFee },
    { key: 'legal', label: 'Legal & documentation', amount: legalFee },
    { key: 'other', label: 'Other charges', amount: otherFee },
  ];

  const totalCosts = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = value + totalCosts;
  const costPercent = value > 0 ? (totalCosts / value) * 100 : 0;

  return { value, lineItems, totalCosts, grandTotal, costPercent };
}

export default function StampDutyCalculator() {
  const [price, setPrice] = useState('18000000');
  const [stamp, setStamp] = useState('3');
  const [registration, setRegistration] = useState('2');
  const [mutation, setMutation] = useState('1');
  const [commission, setCommission] = useState('2');
  const [legal, setLegal] = useState('50000');
  const [other, setOther] = useState('0');
  const [priceB, setPriceB] = useState('25000000');

  const result = useMemo(
    () => computeStamp({ price, stamp, registration, mutation, commission, legal, other }),
    [price, stamp, registration, mutation, commission, legal, other],
  );
  const resultB = useMemo(
    () =>
      computeStamp({
        price: priceB,
        stamp,
        registration,
        mutation,
        commission,
        legal,
        other,
      }),
    [priceB, stamp, registration, mutation, commission, legal, other],
  );

  const reset = () => {
    setPrice('18000000');
    setStamp('3');
    setRegistration('2');
    setMutation('1');
    setCommission('2');
    setLegal('50000');
    setOther('0');
    setPriceB('25000000');
  };

  const emailSections = [
    {
      heading: 'Purchase Details',
      items: [
        { label: 'Purchase price', value: formatPKR(result.value) },
        { label: 'Stamp duty', value: `${stamp || 0}%` },
        { label: 'Registration fee', value: `${registration || 0}%` },
        { label: 'Mutation / transfer fee', value: `${mutation || 0}%` },
        { label: 'Agency commission', value: `${commission || 0}%` },
        { label: 'Legal & documentation', value: formatPKR(result.lineItems[4].amount) },
      ],
    },
    {
      heading: 'Results',
      items: [
        { label: 'Stamp duty amount', value: formatPKR(result.lineItems[0].amount) },
        { label: 'Total transfer costs', value: formatPKR(result.totalCosts) },
        { label: 'Costs as % of price', value: `${result.costPercent.toFixed(2)}%` },
        { label: 'Total outlay (price + costs)', value: formatPKR(result.grandTotal) },
      ],
    },
  ];

  const rateFields: RateField[] = [
    {
      id: 'stamp-duty',
      label: 'Stamp Duty',
      value: stamp,
      setValue: setStamp,
      suffix: '% of price',
      step: '0.5',
      hint: 'Usually the largest single transfer charge. Confirm the current rate with your registrar.',
    },
    {
      id: 'registration-fee',
      label: 'Registration Fee',
      value: registration,
      setValue: setRegistration,
      suffix: '% of price',
      step: '0.5',
      hint: 'Charged when the transfer is officially recorded.',
    },
    {
      id: 'mutation-fee',
      label: 'Mutation / Transfer Fee',
      value: mutation,
      setValue: setMutation,
      suffix: '% of price',
      step: '0.5',
      hint: 'Updates the land records to reflect the new owner.',
    },
    {
      id: 'agency-commission',
      label: 'Agency Commission',
      value: commission,
      setValue: setCommission,
      suffix: '% of price',
      step: '0.5',
      hint: 'Zamin charges a transparent 2.5% to 3% on sales — set what applies to you.',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
              Property &amp; Fees
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

          <div className="mt-6">
            <label htmlFor="property-value" className="mb-2 block text-sm font-semibold text-foreground-800">
              Property Purchase Price
            </label>
            <div className="flex items-center rounded-md border border-background-300 bg-background-50 px-3.5 transition-colors focus-within:border-primary-500">
              <span className="mr-2 text-sm font-semibold text-foreground-500">PKR</span>
              <input
                id="property-value"
                type="number"
                inputMode="decimal"
                min="0"
                step="100000"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full bg-transparent py-3 text-sm font-medium text-foreground-950 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
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
          </div>

          <div className="mt-6 flex flex-col gap-5 border-t border-background-100 pt-6">
            {rateFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-2 block text-sm font-semibold text-foreground-800">
                  {field.label}
                </label>
                <div className="flex items-center rounded-md border border-background-300 bg-background-50 px-3.5 transition-colors focus-within:border-primary-500">
                  <input
                    id={field.id}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100"
                    step={field.step}
                    value={field.value}
                    onChange={(event) => field.setValue(event.target.value)}
                    className="w-full bg-transparent py-3 text-sm font-medium text-foreground-950 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="ml-2 whitespace-nowrap text-sm text-foreground-500">
                    {field.suffix}
                  </span>
                </div>
                <p className="mt-2 text-xs text-foreground-500">{field.hint}</p>
              </div>
            ))}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="legal-fee" className="mb-2 block text-sm font-semibold text-foreground-800">
                  Legal &amp; Documentation
                </label>
                <div className="flex items-center rounded-md border border-background-300 bg-background-50 px-3.5 transition-colors focus-within:border-primary-500">
                  <span className="mr-2 text-sm font-semibold text-foreground-500">PKR</span>
                  <input
                    id="legal-fee"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="5000"
                    value={legal}
                    onChange={(event) => setLegal(event.target.value)}
                    className="w-full bg-transparent py-3 text-sm font-medium text-foreground-950 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="other-fee" className="mb-2 block text-sm font-semibold text-foreground-800">
                  Other Charges
                </label>
                <div className="flex items-center rounded-md border border-background-300 bg-background-50 px-3.5 transition-colors focus-within:border-primary-500">
                  <span className="mr-2 text-sm font-semibold text-foreground-500">PKR</span>
                  <input
                    id="other-fee"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="5000"
                    value={other}
                    onChange={(event) => setOther(event.target.value)}
                    className="w-full bg-transparent py-3 text-sm font-medium text-foreground-950 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-card border border-primary-200 bg-primary-50 p-6 md:p-8 lg:sticky lg:top-24">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
            Estimated Transfer Costs
          </span>
          <p className="mt-2 font-heading text-3xl font-bold text-primary-900 md:text-4xl">
            {formatPKR(result.totalCosts)}
          </p>
          <p className="mt-1 text-sm text-foreground-600">
            {result.costPercent.toFixed(2)}% of the purchase price
          </p>

          <dl className="mt-6 flex flex-col gap-3 border-t border-primary-200 pt-5 text-sm">
            {result.lineItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3">
                <dt className="text-foreground-600">{item.label}</dt>
                <dd className="font-semibold tabular-nums text-foreground-900">
                  {formatPKR(item.amount)}
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 border-t border-primary-200 pt-3">
              <dt className="font-semibold text-foreground-900">Total Outlay</dt>
              <dd className="font-bold tabular-nums text-primary-900">
                {formatPKR(result.grandTotal)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-foreground-500">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
              <i className="ri-information-line text-sm"></i>
            </span>
            Rates vary by area and change over time. Confirm the current figures with the relevant
            registrar before you budget.
          </p>
        </div>
      </div>

      <ScenarioCompare
        title="Compare two purchase prices"
        description="Considering two different properties? Enter a second price to see how much extra the transfer costs add to each — before you commit."
        labelA="Property A (current)"
        labelB="Property B (what if)"
        inputs={[
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
            label: 'Total transfer costs',
            valueA: result.totalCosts,
            valueB: resultB.totalCosts,
            format: formatPKR,
          },
          {
            label: 'Costs as % of price',
            valueA: result.costPercent,
            valueB: resultB.costPercent,
            format: (v) => `${v.toFixed(2)}%`,
          },
          {
            label: 'Total outlay (price + costs)',
            valueA: result.grandTotal,
            valueB: resultB.grandTotal,
            format: formatPKR,
          },
        ]}
        note="Both properties use the same fee rates you set above — only the purchase price changes. Lower costs can simply mean a cheaper property, so judge them alongside what each home offers."
      />

      <SavedReportControls
        className="mt-8"
        reportKey="stamp-duty"
        data={{ price, stamp, registration, mutation, commission, legal, other }}
        onRestore={(restored) => {
          setPrice(restored.price);
          setStamp(restored.stamp);
          setRegistration(restored.registration);
          setMutation(restored.mutation);
          setCommission(restored.commission);
          setLegal(restored.legal);
          setOther(restored.other);
        }}
      />

      <div className="print-area mt-8 rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
              Transfer Cost Summary
            </h3>
            <p className="mt-1 text-sm text-foreground-600">
              A printable breakdown of your total purchase outlay.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <PrintButton />
            <EmailSummaryButton title="Transfer Cost Estimator" sections={emailSections} />
          </div>
        </div>

        <div className="mt-6">
          <ReportHeader title="Transfer Cost Estimator" />

          <table className="mt-6 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-background-200 text-left text-xs uppercase tracking-wide text-foreground-500">
                <th className="pb-3 pr-4 font-semibold">Item</th>
                <th className="pb-3 pr-4 text-right font-semibold">Rate</th>
                <th className="pb-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-background-100 text-foreground-700">
                <td className="py-3 pr-4 font-semibold text-foreground-900">Purchase price</td>
                <td className="py-3 pr-4 text-right tabular-nums">—</td>
                <td className="py-3 text-right tabular-nums">{formatPKR(result.value)}</td>
              </tr>
              <tr className="border-b border-background-100 text-foreground-700">
                <td className="py-3 pr-4">Stamp duty</td>
                <td className="py-3 pr-4 text-right tabular-nums">{stamp || 0}%</td>
                <td className="py-3 text-right tabular-nums">
                  {formatPKR(result.lineItems[0].amount)}
                </td>
              </tr>
              <tr className="border-b border-background-100 text-foreground-700">
                <td className="py-3 pr-4">Registration fee</td>
                <td className="py-3 pr-4 text-right tabular-nums">{registration || 0}%</td>
                <td className="py-3 text-right tabular-nums">
                  {formatPKR(result.lineItems[1].amount)}
                </td>
              </tr>
              <tr className="border-b border-background-100 text-foreground-700">
                <td className="py-3 pr-4">Mutation / transfer fee</td>
                <td className="py-3 pr-4 text-right tabular-nums">{mutation || 0}%</td>
                <td className="py-3 text-right tabular-nums">
                  {formatPKR(result.lineItems[2].amount)}
                </td>
              </tr>
              <tr className="border-b border-background-100 text-foreground-700">
                <td className="py-3 pr-4">Agency commission</td>
                <td className="py-3 pr-4 text-right tabular-nums">{commission || 0}%</td>
                <td className="py-3 text-right tabular-nums">
                  {formatPKR(result.lineItems[3].amount)}
                </td>
              </tr>
              <tr className="border-b border-background-100 text-foreground-700">
                <td className="py-3 pr-4">Legal &amp; documentation</td>
                <td className="py-3 pr-4 text-right tabular-nums">Fixed</td>
                <td className="py-3 text-right tabular-nums">
                  {formatPKR(result.lineItems[4].amount)}
                </td>
              </tr>
              <tr className="border-b border-background-100 text-foreground-700">
                <td className="py-3 pr-4">Other charges</td>
                <td className="py-3 pr-4 text-right tabular-nums">Fixed</td>
                <td className="py-3 text-right tabular-nums">
                  {formatPKR(result.lineItems[5].amount)}
                </td>
              </tr>
              <tr className="text-foreground-900">
                <td className="py-3 pr-4 font-semibold">Total transfer costs</td>
                <td className="py-3 pr-4 text-right tabular-nums">
                  {result.costPercent.toFixed(2)}%
                </td>
                <td className="py-3 text-right font-semibold tabular-nums">
                  {formatPKR(result.totalCosts)}
                </td>
              </tr>
              <tr className="bg-primary-50/60 text-primary-900">
                <td className="py-3 pr-4 font-bold">Total outlay (price + costs)</td>
                <td className="py-3 pr-4 text-right tabular-nums">—</td>
                <td className="py-3 text-right font-bold tabular-nums">
                  {formatPKR(result.grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-6 border-t border-background-200 pt-4 text-xs leading-relaxed text-foreground-500">
            This summary is a planning estimate only. Transfer taxes and fees are set by the
            relevant authorities and can change — always confirm the current rates before
            committing funds.
          </p>
        </div>
      </div>
    </div>
  );
}