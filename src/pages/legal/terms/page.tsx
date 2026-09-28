import LegalDoc, { type LegalSection } from '@/pages/legal/components/LegalDoc';
import { SITE } from '@/utils/site';

const sections: LegalSection[] = [
  {
    id: 'agreement',
    title: 'Agreement to Terms',
    content: (
      <>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of the {SITE.brand} website and
          services. By accessing or using the website, you agree to be bound by these Terms.
        </p>
        <p>
          If you do not agree with any part of these Terms, please do not use the website.
        </p>
      </>
    ),
  },
  {
    id: 'about-us',
    title: 'About Zamin Real Estate',
    content: (
      <p>
        {SITE.brand} is a real estate agency operating across Gilgit-Baltistan, including Hunza,
        Gilgit, Skardu, Nagar, Ghizer and Chilas. We help clients buy, sell, rent, value and invest
        in property.
      </p>
    ),
  },
  {
    id: 'use-of-website',
    title: 'Use of the Website',
    content: (
      <>
        <p>You agree to use the website lawfully and responsibly. In particular, you agree not to:</p>
        <ul>
          <li>Use the website for any unlawful or fraudulent purpose.</li>
          <li>Attempt to gain unauthorised access to the website or its systems.</li>
          <li>Copy, scrape or reproduce listings and content without our permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'listings',
    title: 'Property Listings & Accuracy',
    content: (
      <>
        <p>
          We take care to keep listings accurate, but property details, prices, availability and
          images may change and are provided for general information only. Listings do not form a
          binding offer.
        </p>
        <p>
          We recommend that you verify all important details, documents and measurements
          independently before making any decision.
        </p>
      </>
    ),
  },
  {
    id: 'enquiries',
    title: 'Enquiries &amp; Communications',
    content: (
      <p>
        When you submit an enquiry, you consent to us contacting you by phone, email or WhatsApp to
        respond to your request. Enquiry information is handled in line with our{' '}
        <a href="/privacy">Privacy Policy</a>.
      </p>
    ),
  },
  {
    id: 'tools-and-saves',
    title: 'Saved Properties, Reports &amp; Tools',
    content: (
      <>
        <p>
          Our calculators and saving features are provided as helpful tools only. Results are
          estimates based on the figures you enter and do not constitute financial, legal or
          professional advice.
        </p>
        <p>
          Your saved properties, saved reports and remembered searches are stored locally on your
          device and may be cleared at any time by your browser.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <p>
        All content on the website, including text, graphics, logos and images, is owned by or
        licensed to {SITE.brand} and is protected by applicable laws. You may not use it without our
        prior written permission.
      </p>
    ),
  },
  {
    id: 'prohibited-conduct',
    title: 'Prohibited Conduct',
    content: (
      <>
        <p>You must not:</p>
        <ul>
          <li>Impersonate another person or provide false information.</li>
          <li>Interfere with the security or performance of the website.</li>
          <li>Post or transmit harmful, offensive or misleading content.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-Party Services &amp; Links',
    content: (
      <p>
        The website may contain links to third-party services. We do not control and are not
        responsible for their content, terms or practices. Your use of those services is at your own
        risk.
      </p>
    ),
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of Warranties',
    content: (
      <p>
        The website and its content are provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind, whether express or implied. We do not warrant that the
        website will be uninterrupted, error-free or completely accurate.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: (
      <p>
        To the fullest extent permitted by law, {SITE.brand} shall not be liable for any indirect,
        incidental or consequential losses arising from your use of the website, including reliance
        on any listing, estimate or content.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: (
      <p>
        These Terms are governed by and construed in accordance with the laws of Pakistan. Any
        disputes will be subject to the jurisdiction of the courts of Gilgit-Baltistan.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    content: (
      <p>
        We may update these Terms from time to time. Changes take effect when posted on this page.
        Continued use of the website after changes means you accept the updated Terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <>
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul>
          <li>
            Email: <a href={SITE.emailHref}>{SITE.email}</a>
          </li>
          <li>
            Phone: <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
          </li>
          <li>Address: {SITE.address}</li>
        </ul>
      </>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalDoc
      breadcrumbLabel="Terms of Service"
      eyebrow="Legal"
      eyebrowIcon="ri-file-list-3-line"
      title="Terms of Service"
      intro="The rules and conditions that apply when you use the Zamin Real Estate & Consultants website and services."
      lastUpdated="23 September 2026"
      sections={sections}
    />
  );
}