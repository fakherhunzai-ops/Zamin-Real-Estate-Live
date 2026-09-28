import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import HostApplyForm from '@/pages/stays/host/components/HostApplyForm';
import { SITE } from '@/utils/site';

const ASSURANCES = [
  { icon: 'ri-shield-check-line', title: 'Verified first', text: 'We inspect and approve before anything goes live.' },
  { icon: 'ri-lock-2-line', title: 'Privacy kept', text: 'Ownership details stay private and are never shown.' },
  { icon: 'ri-calendar-check-line', title: 'No obligation', text: 'Submitting an application costs nothing.' },
];

export default function HostApplyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="border-b border-background-200 bg-background-50">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 md:px-6 md:pb-14 md:pt-32">
            <Breadcrumbs
              items={[
                { label: 'ZAMIN Stays', to: '/stays' },
                { label: 'Become a Host', to: '/stays/host' },
                { label: 'Apply' },
              ]}
            />
            <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-end">
              <div className="lg:col-span-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3.5 py-1.5 text-xs font-semibold text-primary-800">
                  <i className="ri-home-gear-line"></i>
                  Host onboarding
                </span>
                <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground-950 md:text-4xl">
                  List your property on ZAMIN Stays
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-600 md:text-base">
                  Tell us about your property in Gilgit-Baltistan. Your application goes straight to
                  our team as a pending review — we&apos;ll get in touch to arrange an inspection and
                  sort out pricing, photography and the listing.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-card border border-background-200 bg-background-100 p-5">
                {ASSURANCES.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-50 text-accent-700">
                      <i className={`${item.icon} text-lg`}></i>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground-950">{item.title}</p>
                      <p className="text-xs text-foreground-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
          <HostApplyForm />

          <div className="mt-10 flex flex-col items-start gap-4 rounded-card border border-background-200 bg-background-50 p-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-relaxed text-foreground-700">
              Prefer to talk it through first? Call or message our team and we&apos;ll walk you
              through the two hosting models.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <i className="ri-phone-line text-base"></i>
                {SITE.phoneDisplay}
              </a>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <i className="ri-whatsapp-line text-base"></i>
                WhatsApp
              </a>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-foreground-500">
            Not sure which model fits?{' '}
            <Link to="/stays/managed-hosting" className="font-semibold text-primary-700 hover:underline">
              Learn about managed hosting
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}