"use client";

import React from "react";
import { advantages } from "@/data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function AdvantageCard({
  icon,
  title,
  description,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`text-center p-6 md:p-8 rounded-2xl bg-white border border-gray-100 shadow-soft hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 ${
        isVisible ? "animate-fadeIn" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="text-4xl md:text-5xl mb-4">{icon}</div>
      <h3 className="font-poppins font-bold text-lg text-[#212121] mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export function AdvantagesSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-site">
        <SectionTitle
          title="Por que escolher a Cunicutado?"
          subtitle="Oferecemos excelência em cada aspecto da cunicultura, desde a genética dos animais até o suporte ao cliente."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, index) => (
            <AdvantageCard key={adv.title} {...adv} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
