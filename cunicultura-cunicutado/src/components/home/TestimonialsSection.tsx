"use client";

import React, { useState } from "react";
import { testimonials } from "@/data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const t = testimonials[activeIndex];

  return (
    <section className="section-padding bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#81C784]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container-site relative z-10">
        <SectionTitle
          title="O que nossos clientes dizem"
          subtitle="A satisfação dos nossos clientes é o nosso maior reconhecimento."
          light
        />

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[280px] flex items-center justify-center">
            {/* Navigation Buttons */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
              aria-label="Próximo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Testimonial Card */}
            <div key={t.id} className="text-center px-4 animate-fadeIn">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A5D6A7] to-[#81C784] flex items-center justify-center text-[#1B5E20] font-poppins font-bold text-xl mx-auto mb-4">
                {t.avatar}
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#FF9800] fill-[#FF9800]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-lg md:text-xl text-[#C8E6C9] leading-relaxed italic mb-6 max-w-xl mx-auto">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p className="font-poppins font-bold text-white">{t.name}</p>
                <p className="text-sm text-[#A5D6A7]">{t.role}</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-white w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
