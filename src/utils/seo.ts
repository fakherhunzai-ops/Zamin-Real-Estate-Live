import type { HeadSeo } from '@/seo/config';

type JsonLd = object | object[];

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applySeoHead(seo: HeadSeo): void {
  document.title = seo.title;

  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'keywords', seo.keywords);
  upsertCanonical(seo.canonical);

  upsertMeta('property', 'og:title', seo.ogTitle);
  upsertMeta('property', 'og:description', seo.ogDescription);
  upsertMeta('property', 'og:url', seo.ogUrl);
  upsertMeta('property', 'og:image', seo.ogImage);
  upsertMeta('property', 'og:type', seo.ogType);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.twitterTitle);
  upsertMeta('name', 'twitter:description', seo.twitterDescription);
  upsertMeta('name', 'twitter:image', seo.twitterImage);
}

const JSONLD_ID = 'zamin-route-jsonld';

export function applyJsonLd(data: JsonLd | null): void {
  const existing = document.getElementById(JSONLD_ID);
  if (existing) {
    existing.remove();
  }
  if (!data) {
    return;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = JSONLD_ID;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}