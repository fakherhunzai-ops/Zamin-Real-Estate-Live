import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '@/utils/site';
import type { BlogArticle, BlogBlock } from '@/mocks/blog';
import TableOfContents from './TableOfContents';
import RelatedTools from './RelatedTools';

export default function ArticleSidebar({
  article,
  blocks,
}: {
  article: BlogArticle;
  blocks: BlogBlock[];
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${article.title} — Zamin Real Estate & Rentals`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
      <TableOfContents blocks={blocks} />

      <div className="rounded-card border border-background-200 bg-background-50 p-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-800 text-background-50">
          <i className="ri-customer-service-2-line text-2xl"></i>
        </span>
        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground-950">
          Need advice on the ground?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground-600">
          Talk to a Zamin adviser about buying, selling or investing in Gilgit-Baltistan — free and
          with no obligation.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          <a
            href={SITE.phoneHref}
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
          >
            <i className="ri-phone-line text-base"></i>
            Call {SITE.phoneDisplay}
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 bg-background-50 px-4 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
          >
            <i className="ri-whatsapp-line text-base"></i>
            WhatsApp Us
          </a>
          <Link
            to="/contact"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-200 bg-background-50 px-4 py-3 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100"
          >
            <i className="ri-mail-send-line text-base"></i>
            Send an Enquiry
          </Link>
        </div>
      </div>

      <div className="rounded-card border border-background-200 bg-background-50 p-6">
        <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
          Share this article
        </h4>
        <div className="mt-4 flex items-center gap-2.5">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700 transition-colors hover:bg-primary-700 hover:text-background-50"
          >
            <i className="ri-whatsapp-line text-lg"></i>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700 transition-colors hover:bg-primary-700 hover:text-background-50"
          >
            <i className="ri-facebook-fill text-lg"></i>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700 transition-colors hover:bg-primary-700 hover:text-background-50"
          >
            <i className="ri-linkedin-fill text-lg"></i>
          </a>
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy link"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-primary-50 text-primary-700 transition-colors hover:bg-primary-700 hover:text-background-50"
          >
            <i className={`${copied ? 'ri-check-line' : 'ri-link'} text-lg`}></i>
          </button>
        </div>
        {copied && <p className="mt-2 text-xs text-primary-700">Link copied</p>}

        <h4 className="mt-6 font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
          Topics
        </h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-900"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <RelatedTools article={article} />
    </aside>
  );
}