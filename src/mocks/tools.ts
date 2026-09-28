export type ToolItem = {
  key: string;
  name: string;
  short: string;
  description: string;
  href: string;
  icon: string;
  tag: string;
};

export const tools: ToolItem[] = [
  {
    key: 'mortgage-calculator',
    name: 'Mortgage & EMI Calculator',
    short: 'Work out your monthly instalment, total interest and full repayment schedule.',
    description:
      'Estimate what a home loan will cost each month before you commit, and see exactly how the rate and term change the total you repay.',
    href: '/tools/mortgage-calculator',
    icon: 'ri-calculator-line',
    tag: 'Buying & Finance',
  },
  {
    key: 'rental-yield-calculator',
    name: 'Rental Yield Calculator',
    short: 'See the gross and net return a rental property could deliver.',
    description:
      'Compare gross yield, net yield and payback period for any property so you can judge an investment on real numbers, not guesswork.',
    href: '/tools/rental-yield-calculator',
    icon: 'ri-line-chart-line',
    tag: 'Investment',
  },
  {
    key: 'stamp-duty-calculator',
    name: 'Transfer Cost Estimator',
    short: 'Estimate stamp duty, registration, transfer and agency costs.',
    description:
      'Add up the fees that sit on top of the purchase price — stamp duty, registration, mutation, commission and legal — before you budget.',
    href: '/tools/stamp-duty-calculator',
    icon: 'ri-file-list-3-line',
    tag: 'Buying & Legal',
  },
];