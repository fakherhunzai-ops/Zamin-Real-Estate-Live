import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSeo } from '@/seo/config';
import { applySeoHead, applyJsonLd } from '@/utils/seo';

export function useSeoManager(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const { head, jsonLd } = getPageSeo(pathname);
    applySeoHead(head);
    applyJsonLd(jsonLd);
  }, [pathname]);
}