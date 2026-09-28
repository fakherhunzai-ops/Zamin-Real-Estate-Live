import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

export default function StaysNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-background-50 px-4 pt-24 pb-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <i className="ri-compass-3-line text-3xl"></i>
        </span>
        <h1 className="mt-6 font-heading text-2xl font-bold text-foreground-950 md:text-4xl">
          This stay is no longer available
        </h1>
        <p className="mt-3 max-w-md text-sm text-foreground-600 md:text-base">
          The page you&apos;re looking for may have been unpublished or renamed. Explore our latest
          stays across Gilgit-Baltistan instead.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/stays"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
          >
            <i className="ri-arrow-left-line text-base"></i>
            Back to ZAMIN Stays
          </Link>
          <Link
            to="/properties-for-sale"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
          >
            <i className="ri-home-4-line text-base"></i>
            Browse Properties for Sale
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}