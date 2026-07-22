"use client";

import React from "react";
import { partners } from "@/data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function PartnersSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container-site">
        <SectionTitle
          title="Parceiros e Certificações"
          subtitle="Trabalhamos com as melhores empresas e certificações do setor."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center p-6 bg-white rounded-xl border border-gray-100 hover:shadow-card transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-3xl opacity-50">🏪</span>
              <span className="ml-2 font-poppins font-semibold text-sm text-gray-400">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
