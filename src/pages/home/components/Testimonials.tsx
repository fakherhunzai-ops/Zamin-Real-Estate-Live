import { useState } from 'react';
import { testimonials } from '@/mocks/testimonials';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const item = testimonials[current];

  return (
    <section className="bg-background-100 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600">
            <i className="ri-chat-3-line"></i>
            Client Stories
          </span>
          <h2 className="mt-2 font-heading text-2xl md:text-4xl font-bold text-foreground-950">
            What Our Clients Say
          </h2>
        </div>

        <div className="relative mt-10">
          <div className="rounded-lg border border-background-200 bg-background-50 p-8 md:p-12 text-center">
            <div className="flex justify-center gap-1 text-accent-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={`${i < item.rating ? 'ri-star-fill' : 'ri-star-line'} text-xl`}
                ></i>
              ))}
            </div>
            <p className="mt-6 text-base md:text-lg text-foreground-700 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{item.text}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-800 text-background-50 font-heading font-semibold">
                {item.initials}
              </span>
              <div className="text-left">
                <div className="font-heading font-semibold text-foreground-950">{item.name}</div>
                <div className="text-sm text-foreground-600">
                  {item.role} · {item.location}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-background-50 border border-background-300 text-foreground-700 hover:bg-primary-600 hover:text-background-50 hover:border-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line text-lg"></i>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-background-50 border border-background-300 text-foreground-700 hover:bg-primary-600 hover:text-background-50 hover:border-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-right-line text-lg"></i>
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                i === current ? 'w-6 bg-accent-500' : 'w-2.5 bg-background-300 hover:bg-background-400'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}