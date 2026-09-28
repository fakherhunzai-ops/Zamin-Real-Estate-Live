import { useEffect, useState } from 'react';

/**
 * Thin reading-progress indicator fixed to the top of the viewport.
 * Progress is measured against the article element (targetId) so it
 * reaches 100% exactly when the reader finishes the article body.
 */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const element = document.getElementById(targetId);
      const viewport = window.innerHeight;

      if (element) {
        const rect = element.getBoundingClientRect();
        const total = rect.height - viewport;
        const scrolled = -rect.top;
        const value = total > 0 ? (scrolled / total) * 100 : rect.top < 0 ? 100 : 0;
        setProgress(Math.min(100, Math.max(0, value)));
        return;
      }

      const docTotal = document.documentElement.scrollHeight - viewport;
      setProgress(docTotal > 0 ? Math.min(100, Math.max(0, (window.scrollY / docTotal) * 100)) : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [targetId]);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-accent-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}