import { FORM_URLS } from '@/utils/site';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import FormStatus from '@/components/base/FormStatus';
import FormSuccessPanel from '@/components/base/FormSuccessPanel';

/**
 * Reusable "Get property alerts" signup band.
 * Reuses the site's existing newsletter form endpoint so all subscribers
 * land in the same place as the footer signup.
 */
export default function PropertyAlertsBand({ className = '' }: { className?: string }) {
  const { status, errorMsg, successMsg, submit, reset } = useFormSubmit(FORM_URLS.newsletter);

  return (
    <section className={`bg-background-100 py-14 md:py-16 ${className}`.trim()}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-card bg-primary-900 px-6 py-10 md:px-12 md:py-12">
          <div className="absolute inset-0 opacity-[0.12]">
            <img
              src="https://readdy.ai/api/search-image?query=Soft%20abstract%20artistic%20background%20of%20layered%20mountain%20silhouettes%20in%20deep%20forest%20green%20tones%20with%20subtle%20grain%20texture%2C%20minimal%20elegant%20gradient%2C%20clean%20modern%20premium%20aesthetic&width=1600&height=700&seq=zamin-alerts-band&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-300">
                <span className="flex h-4 w-4 items-center justify-center">
                  <i className="ri-notification-3-line text-sm"></i>
                </span>
                Property Alerts
              </span>
              <h4 className="mt-3 font-heading text-2xl font-bold leading-tight text-background-50 md:text-3xl">
                Get property alerts
              </h4>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-background-300">
                Be first to know when new homes, plots and rentals hit the market across Hunza,
                Gilgit, Skardu and beyond. Fresh listings and local market updates, straight to
                your inbox.
              </p>
            </div>

            {status === 'success' ? (
              <FormSuccessPanel
                title="You're subscribed!"
                message={successMsg}
                onReset={reset}
                resetLabel="Add another email"
              />
            ) : (
            <form
              id="property-alerts-form"
              data-readdy-form
              onSubmit={submit}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <label htmlFor="alerts-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="alerts-email"
                  type="email"
                  name="email"
                  required
                  placeholder="Your email address"
                  className="flex-1 rounded-md border border-primary-800 bg-primary-950 px-3.5 py-3 text-sm text-background-50 placeholder:text-background-400 focus:border-accent-400 focus:outline-none"
                />
                <label htmlFor="alerts-interest" className="sr-only">
                  I am interested in
                </label>
                <select
                  id="alerts-interest"
                  name="interest"
                  defaultValue="Buying"
                  className="cursor-pointer rounded-md border border-primary-800 bg-primary-950 px-3.5 py-3 text-sm text-background-50 focus:border-accent-400 focus:outline-none"
                >
                  <option value="Buying">Buying</option>
                  <option value="Renting">Renting</option>
                  <option value="Investing">Investing</option>
                  <option value="Selling">Selling</option>
                </select>
              </div>
              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="form-supplementary"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-background-50 px-5 py-3 text-sm font-semibold text-primary-900 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <i className="ri-mail-add-line text-base"></i>
                {status === 'loading' ? 'Subscribing…' : 'Get Alerts'}
              </button>
              <FormStatus status={status} successMsg={successMsg} errorMsg={errorMsg} />
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}