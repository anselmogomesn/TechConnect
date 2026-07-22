"use client";

import React from "react";
import Link from "next/link";
import { categoriesHome } from "@/data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function CategoryCard({
  name,
  href,
  count,
  index,
  emoji,
}: {
  name: string;
  href: string;
  count: number;
  index: number;
  emoji: string;
}) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div ref={ref} className={`${isVisible ? "animate-fadeIn" : "opacity-0"}`} style={{ animationDelay: `${index * 100}ms` }}>
      <Link
        href={href}
        className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-6 md:p-8 min-h-[200px] flex flex-col justify-between transition-all duration-500 hover:shadow-card-hover"
      >
      <div className="relative z-10">
        <span className="text-4xl md:text-5xl block mb-3">{emoji}</span>
        <h3 className="font-poppins font-bold text-lg md:text-xl text-[#1B5E20] mb-1">
          {name}
        </h3>
        <p className="text-sm text-[#4CAF50] font-medium">{count} itens</p>
      </div>
      <div className="relative z-10 mt-4">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B5E20] group-hover:gap-2 transition-all">
          Explorar
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
    </Link>
    </div>
  );
}

const emojis = ["🐰", "🐇", "🐣", "🌾", "🏠", "📦"];

export function CategoriesSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <SectionTitle
          title="Categorias"
          subtitle="Explore nossas categorias e encontre o que você precisa."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesHome.map((cat, index) => (
            <CategoryCard key={cat.name} {...cat} index={index} emoji={emojis[index]} />
          ))}
        </div>
      </div>
    </section>
  );
}
