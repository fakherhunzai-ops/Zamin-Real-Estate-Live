import LegalDoc, { type LegalSection } from '@/pages/legal/components/LegalDoc';
import { SITE } from '@/utils/site';

const sections: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <p>
          {SITE.brand} (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;) is committed to
          protecting the privacy of everyone who uses our website. This Privacy Policy explains what
          information we collect, how we use it, and the choices you have.
        </p>
        <p>
          By using our website and services, you agree to the practices described in this policy. If
          you do not agree, please do not use the website.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <p>We collect information in a few different ways:</p>
        <ul>
          <li>
            <strong>Information you give us</strong> — such as your name, phone number, email
            address and message when you submit an enquiry, request a valuation, list a property or
            contact us.
          </li>
          <li>
            <strong>Information collected automatically</strong> — such as your device type, browser,
            approximate location and the pages you view, gathered through standard analytics.
          </li>
          <li>
            <strong>Information stored on your device</strong> — such as your saved properties,
            saved calculator reports and remembered search filters (see below).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your enquiries and connect you with the right property or adviser.</li>
          <li>Arrange viewings, valuations and follow-up communication you have requested.</li>
          <li>Improve our website, listings and services based on how they are used.</li>
          <li>Send updates or offers where you have asked to receive them.</li>
          <li>Comply with legal and regulatory obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies-and-storage',
    title: 'Cookies & Local Storage',
    content: (
      <>
        <p>
          We use cookies and browser storage to keep the website working smoothly. This includes
          remembering preferences and, importantly, storing your <strong>saved properties</strong>,
          your <strong>saved calculator reports</strong> and your <strong>recent search filters</strong>.
        </p>
        <p>
          This saved data is kept <strong>locally on your own device</strong> and is not stored on
          our servers or linked to your identity. Clearing your browser data will remove it.
        </p>
      </>
    ),
  },
  {
    id: 'sharing-information',
    title: 'How We Share Information',
    content: (
      <>
        <p>
          We do not sell your personal information. We may share it with trusted partners only where
          necessary, such as:
        </p>
        <ul>
          <li>Our own advisers working on your enquiry.</li>
          <li>Service providers who help us operate the website and send emails on our behalf.</li>
          <li>Authorities, where we are legally required to do so.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <p>
        We keep enquiry and client information only for as long as it is needed to provide our
        services and meet legal requirements. When it is no longer needed, we securely delete or
        anonymise it.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: (
      <>
        <p>Subject to local law, you have the right to:</p>
        <ul>
          <li>Ask for a copy of the personal information we hold about you.</li>
          <li>Ask us to correct information that is inaccurate or out of date.</li>
          <li>Ask us to delete information we no longer need.</li>
          <li>Withdraw consent for marketing messages at any time.</li>
        </ul>
        <p>
          To exercise any of these rights, please email us at{' '}
          <a href={SITE.emailHref}>{SITE.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'How We Protect Your Data',
    content: (
      <p>
        We take reasonable technical and organisational measures to protect your information against
        loss, misuse and unauthorised access. However, no method of transmission over the internet is
        completely secure, so we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: 'children',
    title: "Children's Privacy",
    content: (
      <p>
        Our services are intended for adults. We do not knowingly collect personal information from
        children. If you believe a child has provided us with information, please contact us so we
        can remove it.
      </p>
    ),
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    content: (
      <p>
        Our website may link to third-party sites, such as social media or mapping services. We are
        not responsible for their privacy practices, and we encourage you to read their policies.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page
        with an updated &quot;last updated&quot; date. We encourage you to review it periodically.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: (
      <>
        <p>If you have any questions about this Privacy Policy, please reach out to us:</p>
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

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc
      breadcrumbLabel="Privacy Policy"
      eyebrow="Legal"
      eyebrowIcon="ri-shield-keyhole-line"
      title="Privacy Policy"
      intro="How Zamin Real Estate & Consultants collects, uses and protects your information when you browse, enquire or work with us."
      lastUpdated="23 September 2026"
      sections={sections}
    />
  );
}