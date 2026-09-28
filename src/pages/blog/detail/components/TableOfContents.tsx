import { useEffect, useMemo, useState } from 'react';
import { slugifyHeading } from '@/utils/slug';
import type { BlogBlock } from '@/mocks/blog';

type Heading = { id: string; text: string };

export default function TableOfContents({ blocks }: { blocks: BlogBlock[] }) {
  const headings = useMemo<Heading[]>(
    () =>
      blocks
        .filter((block): block is { type: 'heading'; text: string } => block.type === 'heading')
        .map((block) => ({ id: slugifyHeading(block.text), text: block.text })),
    [blocks],
  );

  const [active, setActive] = useState(headings[0]?.id ?? '');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -68% 0px', threshold: 0 },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-card border border-background-200 bg-background-50 p-6"
    >
      <h4 className="flex items-center gap-2 font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
        <span className="flex h-4 w-4 items-center justify-center">
          <i className="ri-list-check-2 text-sm"></i>
        </span>
        On this page
      </h4>
      <ul className="mt-4 flex flex-col gap-1 border-l border-background-200">
        {headings.map((heading) => {
          const isActive = active === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`-ml-px block border-l-2 py-1.5 pl-3.5 text-sm leading-snug transition-colors ${
                  isActive
                    ? 'border-primary-700 font-semibold text-primary-800'
                    : 'border-transparent text-foreground-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}