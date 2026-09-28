import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import { SITE } from '@/utils/site';
import ContactForm from './components/ContactForm';

const infoItems = [
  { icon: 'ri-phone-line', label: 'Phone', value: SITE.phoneDisplay, href: SITE.phoneHref },
  { icon: 'ri-mail-line', label: 'Email', value: SITE.email, href: SITE.emailHref },
  { icon: 'ri-time-line', label: 'Office Hours', value: SITE.hours },
  { icon: 'ri-map-pin-2-line', label: 'Office Address', value: SITE.address },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Gilgit%20city%20skyline%20nestled%20among%20mountains%20in%20Gilgit%20Baltistan%20Pakistan%20at%20soft%20golden%20light%2C%20wide%20cinematic%20landscape%20photography&width=1600&height=600&seq=zamin-contact-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
            <div className="mt-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
                <i className="ri-customer-service-2-line text-accent-400"></i>
                We&apos;re Here to Help
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
                Get in Touch With Zamin
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">
                Whether you&apos;re buying, selling, renting or just have a question, our Gilgit
                team is ready to help. Call, WhatsApp, email or send us a message below.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <a
                href={SITE.phoneHref}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-800 px-4 py-4 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <i className="ri-phone-line text-lg"></i>
                </span>
                Call Now
              </a>
              <a
                href={SITE.emailHref}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-primary-300 bg-background-50 px-4 py-4 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <i className="ri-mail-line text-lg"></i>
                </span>
                Email Us
              </a>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-primary-300 bg-background-50 px-4 py-4 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <i className="ri-whatsapp-line text-lg"></i>
                </span>
                WhatsApp Us
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col rounded-card border border-background-200 bg-background-50 p-5"
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                        <i className={`${item.icon} text-xl`}></i>
                      </span>
                      <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 text-sm font-semibold text-foreground-900 transition-colors hover:text-primary-700"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="mt-1 text-sm font-semibold text-foreground-900">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-card border border-background-200 bg-background-50">
                  <div className="h-80 w-full">
                    <iframe
                      title="Zamin Real Estate office location in Gilgit-Baltistan"
                      src={SITE.mapEmbed}
                      className="h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-background-200 bg-background-50 p-5 md:p-8">
                <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-sm text-foreground-600">
                  Fill in the form and a member of our team will get back to you.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}