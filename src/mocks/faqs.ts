export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export const faqCategories = [
  'Buying',
  'Selling',
  'Renting',
  'Commission',
  'Property Verification',
  'Documentation',
  'General',
];

export const faqs: Faq[] = [
  {
    id: 'f1',
    category: 'Buying',
    question: 'How do I start the process of buying a property?',
    answer:
      'Simply share your budget, preferred area and requirements through our contact form or by phone. We prepare a shortlist, arrange viewings and guide you through negotiation and paperwork all the way to handover.',
  },
  {
    id: 'f2',
    category: 'Buying',
    question: 'Can overseas Pakistanis buy property in Gilgit-Baltistan?',
    answer:
      'Yes. Many of our clients buy from abroad. We provide video viewings, detailed reports and remote documentation support, and we can act on your behalf with a properly authorised power of attorney.',
  },
  {
    id: 'f3',
    category: 'Selling',
    question: 'How do I list my property with Zamin?',
    answer:
      'Submit your property details through our listing form or speak to an agent. We then arrange a free valuation, take professional photographs and market your property to our buyer and tenant network.',
  },
  {
    id: 'f4',
    category: 'Selling',
    question: 'How long does it usually take to sell a property?',
    answer:
      'Timelines vary by location and price, but well-priced properties in popular areas such as Hunza, Gilgit and Skardu typically attract serious interest within a few weeks.',
  },
  {
    id: 'f5',
    category: 'Renting',
    question: 'What is required to rent a property?',
    answer:
      'You will need a valid CNIC or passport, references and the agreed security deposit. We prepare the rental agreement and complete a documented move-in inspection.',
  },
  {
    id: 'f6',
    category: 'Renting',
    question: 'Do you manage rental properties for landlords?',
    answer:
      'Yes. We screen tenants, draft agreements and handle inspections and handovers. Many landlords prefer our end-to-end management so their property stays occupied and well maintained.',
  },
  {
    id: 'f7',
    category: 'Commission',
    question: 'What is your commission for selling property?',
    answer:
      'We charge a transparent 2.5% to 3% of the final sale price, with no hidden fees. The exact rate is confirmed in writing before we begin marketing your property.',
  },
  {
    id: 'f8',
    category: 'Commission',
    question: 'How much do you charge for rental properties?',
    answer:
      'Our rental commission is equivalent to one month’s rent for a successful placement. There are no additional platform or marketing charges.',
  },
  {
    id: 'f9',
    category: 'Property Verification',
    question: 'How do you verify that a property is legitimate?',
    answer:
      'We cross-check ownership documents, mutation records and seller identity before listing or recommending any property, and we accompany you through the verification steps.',
  },
  {
    id: 'f10',
    category: 'Property Verification',
    question: 'Can you help me confirm land boundaries?',
    answer:
      'Yes. We coordinate with the relevant revenue authorities and local representatives to confirm boundaries and any access rights before you commit.',
  },
  {
    id: 'f11',
    category: 'Documentation',
    question: 'What documents are required for property transfer?',
    answer:
      'Typical documents include proof of ownership, CNIC copies, recent photographs, mutation records and a sale agreement. Our documentation team guides you through every requirement.',
  },
  {
    id: 'f12',
    category: 'Documentation',
    question: 'Do you help with property registration?',
    answer:
      'Yes. We prepare and review the required paperwork and coordinate with the relevant offices so registration and transfer proceed smoothly.',
  },
  {
    id: 'f13',
    category: 'General',
    question: 'Which areas do you cover?',
    answer:
      'We serve Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas, along with surrounding valleys across Gilgit-Baltistan.',
  },
  {
    id: 'f14',
    category: 'General',
    question: 'Is a property valuation really free?',
    answer:
      'Yes. Our initial valuation and market assessment are completely free, whether or not you decide to list with us.',
  },
];