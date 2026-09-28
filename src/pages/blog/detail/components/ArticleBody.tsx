import type { BlogBlock } from '@/mocks/blog';
import { slugifyHeading } from '@/utils/slug';

export default function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const id = slugifyHeading(block.text);
          return (
            <h2
              key={index}
              id={id}
              className="group mt-4 scroll-mt-28 font-heading text-xl font-bold text-foreground-950 md:text-2xl"
            >
              <a
                href={`#${id}`}
                className="inline-flex items-start gap-2 transition-colors hover:text-primary-700"
              >
                <span>{block.text}</span>
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-primary-400 opacity-0 transition-opacity group-hover:opacity-100">
                  <i className="ri-link text-base"></i>
                </span>
              </a>
            </h2>
          );
        }
        if (block.type === 'quote') {
          return (
            <blockquote
              key={index}
              className="rounded-card border-l-4 border-primary-600 bg-primary-50 px-5 py-4 font-heading text-base italic leading-relaxed text-primary-900 md:text-lg"
            >
              {block.text}
            </blockquote>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={index} className="flex flex-col gap-2.5">
              {block.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground-700 md:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-primary-600">
                    <i className="ri-checkbox-circle-fill text-base"></i>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-sm leading-relaxed text-foreground-700 md:text-base">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}