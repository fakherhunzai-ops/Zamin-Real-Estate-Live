import { Link } from 'react-router-dom';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-32 text-center">
      <span className="w-16 h-16 flex items-center justify-center rounded-full bg-accent-100 text-accent-700 mb-6">
        <i className="ri-tools-line text-3xl"></i>
      </span>
      <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground-950">
        {title}
      </h1>
      <p className="mt-3 text-foreground-600 max-w-md">
        This page is currently being built. We&apos;re working on it right now — check back shortly!
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary-800 text-background-50 px-5 py-3 text-sm font-semibold hover:bg-primary-900 transition-colors"
      >
        <i className="ri-arrow-left-line"></i>
        Back to Home
      </Link>
    </div>
  );
}