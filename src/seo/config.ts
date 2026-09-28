// Central SEO configuration for Zamin Real Estate & Consultants.
//
// Source-of-truth priority (highest first):
//   1. Authoritative embed_code SEO data (home page "/")
//   2. Platform/setting-managed Open Graph + Twitter tags (home page, index.html)
//   3. Existing reasonable site SEO data (home page)
//   4. Reasonable generated fallback (all other routes)

import { blogArticles } from '@/mocks/blog';

const rawOrigin = (import.meta.env.VITE_SITE_URL as string | undefined) || '';
const SITE_ORIGIN = rawOrigin.replace(/\/+$/, '');

export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return SITE_ORIGIN ? `${SITE_ORIGIN}${cleanPath}` : cleanPath;
}

// Existing brand/hero image already shipped in the project (index.html og:image).
export const OG_IMAGE =
  'https://readdy.ai/api/search-image?query=Breathtaking%20panoramic%20view%20of%20the%20Hunza%20Valley%20in%20Gilgit%20Baltistan%20Pakistan%20with%20snow%20capped%20Rakaposhi%20mountain%20peaks%20rising%20above%20lush%20green%20terraced%20fields%20and%20the%20turquoise%20Hunza%20river%20winding%20through%20the%20valley%20golden%20warm%20sunlight%20at%20golden%20hour%20with%20dramatic%20clouds%20cinematic%20wide%20landscape%20photography%20vibrant%20natural%20colors%20serene%20peaceful%20atmosphere&width=1600&height=900&seq=zamin-hero&orientation=landscape';

const AREAS = ['Hunza', 'Skardu', 'Gilgit', 'Chilas', 'Nagar', 'Ghizer'];
const AGENT_NAME = 'Zamin Real Estate & Consultants';

export interface HeadSeo {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface ResolvedSeo {
  head: HeadSeo;
  jsonLd: object | object[] | null;
}

function agentJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: AGENT_NAME,
    url: absoluteUrl('/'),
    logo: OG_IMAGE,
    description:
      'Trusted real estate agency serving Gilgit-Baltistan including Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer.',
    areaServed: AREAS,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gilgit',
      addressRegion: 'Gilgit-Baltistan',
      addressCountry: 'PK',
    },
  };
}

function websiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: AGENT_NAME,
    url: absoluteUrl('/'),
    description:
      'Buy, sell and rent property in Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer with transparent commission and expert local service.',
  };
}

function collectionJsonLd(name: string, description: string, path: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      '@type': 'WebSite',
      name: AGENT_NAME,
      url: absoluteUrl('/'),
    },
  };
}

function serviceJsonLd(
  name: string,
  serviceType: string,
  description: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    provider: {
      '@type': 'RealEstateAgent',
      name: AGENT_NAME,
      url: absoluteUrl('/'),
    },
    areaServed: AREAS,
  };
}

function faqJsonLd(): object {
  const qa = [
    {
      '@type': 'Question',
      name: 'What is your commission for selling property?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We charge 2.5% to 3% of the final sale price, with no hidden fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do you charge for rental properties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our rental commission is equivalent to one month\'s rent for a successful placement.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas do you cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We cover Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer across Gilgit-Baltistan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I list my property?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Submit your property details through our listing form, and we will arrange a free professional valuation, then market your property and find the right buyer or tenant.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you value properties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We assess location, market trends, comparable recent sales, property condition and tourism-driven demand to provide an accurate, competitive valuation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are required for property transfer in Gilgit-Baltistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typical documents include proof of ownership, CNIC copies, recent photographs, mutation records and a sale agreement. Our legal support team guides you through every step.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you help with property registration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we guide you through the complete registration and transfer process with our legal support team.',
      },
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa,
  };
}

interface RouteConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  jsonLd?: object | object[];
}

const HOME: RouteConfig = {
  title: 'Zamin Real Estate Gilgit-Baltistan',
  description:
    'Trusted real estate agency in Gilgit-Baltistan. Buy, sell and rent property in Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer with transparent 2.5 to 3 percent commission and expert local service.',
  keywords:
    'Gilgit-Baltistan real estate, Hunza property, Skardu property, buy property Pakistan, rent property Gilgit, Zamin Real Estate',
  ogTitle:
    'Zamin Real Estate & Consultants | Find Your Dream Property in Gilgit-Baltistan',
  ogDescription:
    'Buy, sell and rent property in Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer. Transparent commission and expert local knowledge.',
  twitterTitle: 'Zamin Real Estate & Consultants | Gilgit-Baltistan Property Experts',
  twitterDescription:
    'Buy, sell and rent property across Hunza, Skardu, Gilgit and beyond. Transparent pricing, no hidden fees.',
  jsonLd: [agentJsonLd(), websiteJsonLd()],
};

const routes: Record<string, RouteConfig> = {
  '/': HOME,

  '/properties-for-sale': {
    title: 'Properties for Sale in Gilgit-Baltistan | Zamin Real Estate',
    description:
      'Browse houses, apartments, land and commercial properties for sale in Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer with transparent 2.5 to 3 percent commission.',
    keywords:
      'properties for sale Gilgit-Baltistan, buy property Hunza, buy property Skardu, Gilgit property for sale, land for sale Pakistan',
    ogTitle: 'Properties for Sale in Gilgit-Baltistan | Zamin Real Estate',
    ogDescription:
      'Browse houses, apartments, land and commercial properties for sale across Gilgit-Baltistan.',
    twitterTitle: 'Properties for Sale in Gilgit-Baltistan | Zamin Real Estate',
    twitterDescription:
      'Browse houses, apartments, land and commercial properties for sale across Gilgit-Baltistan.',
    jsonLd: collectionJsonLd(
      'Properties for Sale in Gilgit-Baltistan',
      'Houses, apartments, land and commercial properties for sale across Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer.',
      '/properties-for-sale',
    ),
  },

  '/properties-for-rent': {
    title: 'Properties for Rent in Gilgit-Baltistan | Zamin Real Estate',
    description:
      'Find houses and apartments for rent across Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer. One month rent commission and reliable tenant and landlord service.',
    keywords:
      'properties for rent Gilgit-Baltistan, rent house Hunza, rent apartment Skardu, Gilgit rental property',
    ogTitle: 'Properties for Rent in Gilgit-Baltistan | Zamin Real Estate',
    ogDescription:
      'Find houses and apartments for rent across Gilgit-Baltistan with reliable tenant and landlord service.',
    twitterTitle: 'Properties for Rent in Gilgit-Baltistan | Zamin Real Estate',
    twitterDescription:
      'Find houses and apartments for rent across Gilgit-Baltistan with reliable tenant and landlord service.',
    jsonLd: collectionJsonLd(
      'Properties for Rent in Gilgit-Baltistan',
      'Houses and apartments available for rent across Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer.',
      '/properties-for-rent',
    ),
  },

  '/sell-your-property': {
    title: 'Sell or Rent Your Property | Free Valuation | Zamin Real Estate',
    description:
      'List your property for sale or rent in Gilgit-Baltistan. Free professional valuation, expert marketing and transparent 2.5 to 3 percent sales commission.',
    keywords:
      'sell property Gilgit-Baltistan, list property for rent, free property valuation, property marketing Pakistan',
    ogTitle: 'Sell or Rent Your Property | Free Valuation | Zamin Real Estate',
    ogDescription:
      'List your property for sale or rent with a free professional valuation and transparent commission.',
    twitterTitle: 'Sell or Rent Your Property | Free Valuation | Zamin Real Estate',
    twitterDescription:
      'List your property for sale or rent with a free professional valuation and transparent commission.',
    jsonLd: serviceJsonLd(
      'Property Valuation in Gilgit-Baltistan',
      'Property Valuation',
      'Free professional property valuation, marketing and sales or rental placement across Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer.',
    ),
  },

  '/services': {
    title: 'Real Estate Services in Gilgit-Baltistan | Zamin Real Estate',
    description:
      'Buying, selling, renting, property valuation, legal support and investment advisory across Hunza, Skardu, Gilgit, Chilas, Nagar and Ghizer.',
    keywords:
      'real estate services, property valuation Gilgit, buying selling renting property, investment advisory Pakistan',
    ogTitle: 'Real Estate Services in Gilgit-Baltistan | Zamin Real Estate',
    ogDescription:
      'Buying, selling, renting, valuation, legal support and investment advisory across Gilgit-Baltistan.',
    twitterTitle: 'Real Estate Services in Gilgit-Baltistan | Zamin Real Estate',
    twitterDescription:
      'Buying, selling, renting, valuation, legal support and investment advisory across Gilgit-Baltistan.',
    jsonLd: serviceJsonLd(
      'Real Estate Services in Gilgit-Baltistan',
      'Real Estate Services',
      'Buying, selling, renting, property valuation, legal support and tourism-driven investment advisory across Gilgit-Baltistan.',
    ),
  },

  '/about': {
    title: 'About Us | Zamin Real Estate & Consultants Gilgit-Baltistan',
    description:
      'Meet Zamin Real Estate, Gilgit-Baltistan\'s trusted property agency with 10+ years of local expertise, transparent pricing and client-first service.',
    keywords:
      'about Zamin Real Estate, Gilgit-Baltistan real estate agency, local property experts',
    ogTitle: 'About Us | Zamin Real Estate & Consultants Gilgit-Baltistan',
    ogDescription:
      'Gilgit-Baltistan\'s trusted property agency with 10+ years of local expertise and transparent pricing.',
    twitterTitle: 'About Us | Zamin Real Estate & Consultants Gilgit-Baltistan',
    twitterDescription:
      'Gilgit-Baltistan\'s trusted property agency with 10+ years of local expertise and transparent pricing.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Zamin Real Estate & Consultants',
      url: absoluteUrl('/about'),
      about: {
        '@type': 'RealEstateAgent',
        name: AGENT_NAME,
        url: absoluteUrl('/'),
      },
    },
  },

  '/faq': {
    title: 'Frequently Asked Questions | Zamin Real Estate',
    description:
      'Answers to common questions about property commission, coverage areas, listing your property, valuation and document requirements in Gilgit-Baltistan.',
    keywords:
      'real estate FAQ, property commission, listing property Pakistan, property transfer documents',
    ogTitle: 'Frequently Asked Questions | Zamin Real Estate',
    ogDescription:
      'Answers to common questions about commission, coverage, listing, valuation and documents.',
    twitterTitle: 'Frequently Asked Questions | Zamin Real Estate',
    twitterDescription:
      'Answers to common questions about commission, coverage, listing, valuation and documents.',
    jsonLd: faqJsonLd(),
  },

  '/contact': {
    title: 'Contact Us | Zamin Real Estate & Consultants',
    description:
      'Get in touch with Zamin Real Estate for buying, selling, renting or property valuation in Gilgit-Baltistan. Call, email or WhatsApp us today.',
    keywords:
      'contact Zamin Real Estate, Gilgit-Baltistan real estate contact, property inquiry',
    ogTitle: 'Contact Us | Zamin Real Estate & Consultants',
    ogDescription:
      'Get in touch for buying, selling, renting or property valuation in Gilgit-Baltistan.',
    twitterTitle: 'Contact Us | Zamin Real Estate & Consultants',
    twitterDescription:
      'Get in touch for buying, selling, renting or property valuation in Gilgit-Baltistan.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Zamin Real Estate & Consultants',
      url: absoluteUrl('/contact'),
      about: {
        '@type': 'RealEstateAgent',
        name: AGENT_NAME,
        url: absoluteUrl('/'),
      },
    },
  },

  '/valuation': {
    title: 'Property Valuation | Zamin Real Estate',
    description:
      'Get a free professional valuation for your property in Gilgit-Baltistan. Our experts will assess the location, condition and market value.',
    keywords:
      'property valuation Gilgit-Baltistan, free property valuation, property assessment Pakistan',
    ogTitle: 'Property Valuation | Zamin Real Estate',
    ogDescription:
      'Get a free professional valuation for your property with a detailed report.',
    twitterTitle: 'Property Valuation | Zamin Real Estate',
    twitterDescription:
      'Get a free professional valuation for your property with a detailed report.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Valuation',
      name: 'Property Valuation',
      url: absoluteUrl('/valuation'),
      description:
        'Get a free professional valuation for your property in Gilgit-Baltistan. Our experts will assess the location, condition and market value.',
      publisher: {
        '@type': 'Organization',
        name: AGENT_NAME,
        logo: OG_IMAGE,
      },
    },
  },

  '/blog': {
    title: 'Blog & Resources | Gilgit-Baltistan Real Estate Insights',
    description:
      'Real estate market updates, buying and selling guides, local area guides and tourism investment insights for Gilgit-Baltistan.',
    keywords:
      'Gilgit-Baltistan real estate blog, property buying guide, Hunza area guide, property investment Pakistan',
    ogTitle: 'Blog & Resources | Gilgit-Baltistan Real Estate Insights',
    ogDescription:
      'Market updates, buying and selling guides, area guides and investment insights for Gilgit-Baltistan.',
    twitterTitle: 'Blog & Resources | Gilgit-Baltistan Real Estate Insights',
    twitterDescription:
      'Market updates, buying and selling guides, area guides and investment insights for Gilgit-Baltistan.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Gilgit-Baltistan Real Estate Blog & Resources',
      url: absoluteUrl('/blog'),
      description:
        'Real estate market updates, buying and selling guides, local area guides and investment insights for Gilgit-Baltistan.',
      publisher: {
        '@type': 'Organization',
        name: AGENT_NAME,
        logo: OG_IMAGE,
      },
    },
  },

  '/shortlist': {
    title: 'Saved Properties | Your Shortlist | Zamin Real Estate',
    description:
      'Review the properties you saved, then email or print a clean, PDF-ready shortlist summary to share with family, a partner or your bank.',
    keywords:
      'saved properties, property shortlist, favourite listings Gilgit-Baltistan, property comparison',
    ogTitle: 'Saved Properties | Your Shortlist | Zamin Real Estate',
    ogDescription:
      'Review your saved properties and email or print a clean shortlist summary.',
    twitterTitle: 'Saved Properties | Your Shortlist | Zamin Real Estate',
    twitterDescription:
      'Review your saved properties and email or print a clean shortlist summary.',
    jsonLd: collectionJsonLd(
      'Saved Properties',
      'A visitor shortlist of saved properties across Gilgit-Baltistan with an email or printable summary.',
      '/shortlist',
    ),
  },

  '/privacy': {
    title: 'Privacy Policy | Zamin Real Estate',
    description:
      'Learn how Zamin Real Estate collects, uses and protects your information when you browse, enquire or work with us across Gilgit-Baltistan.',
    keywords:
      'privacy policy, data protection, Zamin Real Estate privacy, how we use your data',
    ogTitle: 'Privacy Policy | Zamin Real Estate',
    ogDescription:
      'How Zamin Real Estate collects, uses and protects your information.',
    twitterTitle: 'Privacy Policy | Zamin Real Estate',
    twitterDescription:
      'How Zamin Real Estate collects, uses and protects your information.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy',
      url: absoluteUrl('/privacy'),
      description:
        'How Zamin Real Estate collects, uses and protects your information.',
      isPartOf: {
        '@type': 'WebSite',
        name: AGENT_NAME,
        url: absoluteUrl('/'),
      },
    },
  },

  '/terms': {
    title: 'Terms of Service | Zamin Real Estate',
    description:
      'Read the terms and conditions that apply when you use the Zamin Real Estate website and property services across Gilgit-Baltistan.',
    keywords:
      'terms of service, terms and conditions, website terms, Zamin Real Estate terms',
    ogTitle: 'Terms of Service | Zamin Real Estate',
    ogDescription:
      'The terms and conditions that apply when you use the Zamin Real Estate website.',
    twitterTitle: 'Terms of Service | Zamin Real Estate',
    twitterDescription:
      'The terms and conditions that apply when you use the Zamin Real Estate website.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms of Service',
      url: absoluteUrl('/terms'),
      description:
        'The terms and conditions that apply when you use the Zamin Real Estate website.',
      isPartOf: {
        '@type': 'WebSite',
        name: AGENT_NAME,
        url: absoluteUrl('/'),
      },
    },
  },

  '/tools/mortgage-calculator': {
    title: 'Mortgage & EMI Calculator | Zamin Real Estate',
    description:
      'Free mortgage and EMI calculator for Gilgit-Baltistan buyers. Estimate monthly instalments, total interest and a full yearly repayment schedule in PKR.',
    keywords:
      'mortgage calculator Pakistan, home loan EMI calculator, property finance Gilgit-Baltistan, monthly instalment calculator',
    ogTitle: 'Mortgage & EMI Calculator | Zamin Real Estate',
    ogDescription:
      'Estimate your monthly payment, total interest and full repayment schedule in PKR.',
    twitterTitle: 'Mortgage & EMI Calculator | Zamin Real Estate',
    twitterDescription:
      'Estimate your monthly payment, total interest and full repayment schedule in PKR.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Mortgage & EMI Calculator',
      url: absoluteUrl('/tools/mortgage-calculator'),
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description:
        'Free mortgage and EMI calculator to estimate monthly instalments, total interest and a yearly repayment schedule.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PKR',
      },
      publisher: {
        '@type': 'Organization',
        name: AGENT_NAME,
        logo: OG_IMAGE,
      },
    },
  },

  '/tools': {
    title: 'Free Property Tools & Calculators | Zamin Real Estate',
    description:
      'Free property calculators for Gilgit-Baltistan — mortgage and EMI, rental yield, and stamp duty and transfer cost estimators. Plan with clear numbers and print a summary.',
    keywords:
      'property calculators Pakistan, mortgage calculator, rental yield calculator, stamp duty calculator, transfer cost estimator Gilgit-Baltistan',
    ogTitle: 'Free Property Tools & Calculators | Zamin Real Estate',
    ogDescription:
      'Mortgage, rental yield and transfer cost calculators — free, no sign-up, printable summaries.',
    twitterTitle: 'Free Property Tools & Calculators | Zamin Real Estate',
    twitterDescription:
      'Mortgage, rental yield and transfer cost calculators — free, no sign-up, printable summaries.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Free Property Tools & Calculators',
      url: absoluteUrl('/tools'),
      description:
        'Free property calculators including mortgage and EMI, rental yield, and stamp duty and transfer cost estimators.',
      isPartOf: {
        '@type': 'WebSite',
        name: AGENT_NAME,
        url: absoluteUrl('/'),
      },
    },
  },

  '/tools/rental-yield-calculator': {
    title: 'Rental Yield Calculator | Zamin Real Estate',
    description:
      'Free rental yield calculator for Gilgit-Baltistan investors. Estimate gross and net yield, net monthly cash flow and payback period in PKR, then save a PDF summary.',
    keywords:
      'rental yield calculator, property investment Pakistan, net yield calculator, rental return Gilgit-Baltistan',
    ogTitle: 'Rental Yield Calculator | Zamin Real Estate',
    ogDescription:
      'Estimate gross and net rental yield, cash flow and payback period in PKR.',
    twitterTitle: 'Rental Yield Calculator | Zamin Real Estate',
    twitterDescription:
      'Estimate gross and net rental yield, cash flow and payback period in PKR.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Rental Yield Calculator',
      url: absoluteUrl('/tools/rental-yield-calculator'),
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description:
        'Free rental yield calculator to estimate gross and net yield, monthly cash flow and payback period.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PKR',
      },
      publisher: {
        '@type': 'Organization',
        name: AGENT_NAME,
        logo: OG_IMAGE,
      },
    },
  },

  '/tools/stamp-duty-calculator': {
    title: 'Stamp Duty & Transfer Cost Estimator | Zamin Real Estate',
    description:
      'Free stamp duty and property transfer cost estimator for Gilgit-Baltistan. Estimate registration, mutation, commission and legal fees on top of a purchase price in PKR.',
    keywords:
      'stamp duty calculator Pakistan, property transfer cost, registration fee estimator, mutation fee Gilgit-Baltistan',
    ogTitle: 'Stamp Duty & Transfer Cost Estimator | Zamin Real Estate',
    ogDescription:
      'Estimate stamp duty, registration, mutation, commission and legal fees on a property purchase.',
    twitterTitle: 'Stamp Duty & Transfer Cost Estimator | Zamin Real Estate',
    twitterDescription:
      'Estimate stamp duty, registration, mutation, commission and legal fees on a property purchase.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Stamp Duty & Transfer Cost Estimator',
      url: absoluteUrl('/tools/stamp-duty-calculator'),
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description:
        'Free estimator for stamp duty, registration, mutation, commission and legal fees on a property purchase.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PKR',
      },
      publisher: {
        '@type': 'Organization',
        name: AGENT_NAME,
        logo: OG_IMAGE,
      },
    },
  },
};

export function getPageSeo(pathname: string): ResolvedSeo {
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.slice('/blog/'.length);
    const article = blogArticles.find((item) => item.slug === slug);
    if (article) {
      const canonical = absoluteUrl(pathname);
      const head: HeadSeo = {
        title: `${article.title} | Zamin Real Estate Blog`,
        description: article.excerpt,
        keywords: [...article.tags, article.category, 'Gilgit-Baltistan real estate'].join(', '),
        canonical,
        ogTitle: article.title,
        ogDescription: article.excerpt,
        ogUrl: canonical,
        ogImage: article.image,
        ogType: 'article',
        twitterTitle: article.title,
        twitterDescription: article.excerpt,
        twitterImage: article.image,
      };
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        image: article.image,
        datePublished: article.date,
        articleSection: article.category,
        keywords: article.tags.join(', '),
        author: {
          '@type': 'Person',
          name: article.author,
        },
        publisher: {
          '@type': 'Organization',
          name: AGENT_NAME,
          logo: OG_IMAGE,
        },
        mainEntityOfPage: canonical,
      };
      return { head, jsonLd };
    }
  }

  const route = routes[pathname] ?? HOME;
  const canonical = absoluteUrl(pathname === '/' ? '/' : pathname);

  const head: HeadSeo = {
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    canonical,
    ogTitle: route.ogTitle,
    ogDescription: route.ogDescription,
    ogUrl: canonical,
    ogImage: OG_IMAGE,
    ogType: 'website',
    twitterTitle: route.twitterTitle,
    twitterDescription: route.twitterDescription,
    twitterImage: OG_IMAGE,
  };

  return { head, jsonLd: route.jsonLd ?? null };
}