export type Testimonial = {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Ahmed Karim',
    role: 'Property Buyer',
    location: 'Karachi',
    rating: 5,
    text: 'Zamin made buying a house in Hunza completely stress-free. Their local knowledge and transparent 3% commission meant zero surprises. I found my dream mountain home within two weeks.',
    initials: 'AK',
  },
  {
    id: 't2',
    name: 'Fatima Bibi',
    role: 'Property Seller',
    location: 'Gilgit',
    rating: 5,
    text: 'I listed my commercial property and they handled everything — valuation, marketing, and the paperwork. Sold at a great price with full transparency on fees.',
    initials: 'FB',
  },
  {
    id: 't3',
    name: 'Daniel Shaw',
    role: 'Tenant',
    location: 'London, UK',
    rating: 4,
    text: 'As an overseas investor, communication was everything. The team guided me through renting in Skardu remotely with regular updates and honest advice.',
    initials: 'DS',
  },
  {
    id: 't4',
    name: 'Sara Ali',
    role: 'Landlord',
    location: 'Islamabad',
    rating: 5,
    text: 'They found a reliable tenant for my Ghizer property in days. One month rent as commission felt completely fair for the quality of service.',
    initials: 'SA',
  },
  {
    id: 't5',
    name: 'Muhammad Yousuf',
    role: 'Investor',
    location: 'Dubai, UAE',
    rating: 5,
    text: 'Their investment advisory around tourism-driven growth in Gilgit-Baltistan was invaluable. I now own two income-generating properties thanks to their guidance.',
    initials: 'MY',
  },
];