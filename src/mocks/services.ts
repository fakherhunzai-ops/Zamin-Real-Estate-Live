export type Service = {
  id: string;
  icon: string;
  title: string;
  short: string;
  description: string;
  benefits: string[];
};

export const services: Service[] = [
  {
    id: 'buying-assistance',
    icon: 'ri-home-heart-line',
    title: 'Buying Assistance',
    short: 'Find the right property with expert local guidance.',
    description:
      'From your first shortlist to final handover, we help you buy with confidence. We verify ownership, negotiate on your behalf and guide you through every legal step so there are no surprises.',
    benefits: [
      'Curated shortlists matching your budget',
      'On-site viewings across Gilgit-Baltistan',
      'Price negotiation and market insight',
      'Ownership and document verification',
    ],
  },
  {
    id: 'property-sales',
    icon: 'ri-hand-coin-line',
    title: 'Property Sales',
    short: 'Sell faster, at the right price, with full transparency.',
    description:
      'We market your property to a qualified network of local and overseas buyers, handle the negotiations and manage the paperwork from listing to closing.',
    benefits: [
      'Free professional valuation',
      'Quality photography and listing placement',
      'Qualified buyer matching',
      'Transparent 2.5%–3% commission',
    ],
  },
  {
    id: 'rental-services',
    icon: 'ri-key-2-line',
    title: 'Rental Services',
    short: 'Reliable tenants and quality rentals, quickly.',
    description:
      'Whether you are a landlord seeking dependable tenants or a family looking for a home, we manage the entire rental process — screening, agreements and handover.',
    benefits: [
      'Tenant screening and references',
      'Rental agreement drafting',
      'Move-in and move-out inspections',
      'One month rent commission, no hidden fees',
    ],
  },
  {
    id: 'property-valuation',
    icon: 'ri-survey-line',
    title: 'Property Valuation',
    short: 'Know exactly what your property is worth.',
    description:
      'Our valuation combines recent comparable sales, location analysis and current demand to give you a realistic, defensible figure before you list or invest.',
    benefits: [
      'On-site assessment',
      'Comparable market analysis',
      'Clear written valuation report',
      'Completely free of charge',
    ],
  },
  {
    id: 'investment-advisory',
    icon: 'ri-line-chart-line',
    title: 'Investment Advisory',
    short: 'Build a portfolio tuned to Gilgit-Baltistan’s growth.',
    description:
      'Tourism-driven demand is reshaping the region. We advise local and overseas investors on where to buy, what yields to expect and how to structure a sound investment.',
    benefits: [
      'Growth-area and yield analysis',
      'Overseas investor support',
      'Tourism rental strategy',
      'Portfolio diversification guidance',
    ],
  },
  {
    id: 'property-marketing',
    icon: 'ri-megaphone-line',
    title: 'Property Marketing',
    short: 'Present your property at its very best.',
    description:
      'Professional photography, compelling descriptions and targeted exposure to buyers and tenants across Pakistan and the diaspora give your listing the attention it deserves.',
    benefits: [
      'Professional property photography',
      'Written and visual listing creation',
      'Multi-channel local and overseas reach',
      'Regular performance updates',
    ],
  },
  {
    id: 'documentation-assistance',
    icon: 'ri-file-shield-2-line',
    title: 'Documentation Assistance',
    short: 'Clean, correct paperwork from start to finish.',
    description:
      'Property transfers in Gilgit-Baltistan need care. Our team prepares and reviews documentation, coordinates with the relevant authorities and keeps the process moving.',
    benefits: [
      'Sale agreement preparation',
      'Mutation and transfer coordination',
      'Document review and verification',
      'Guidance on registration requirements',
    ],
  },
];