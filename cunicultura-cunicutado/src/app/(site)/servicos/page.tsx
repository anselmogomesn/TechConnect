"use client";

import React from "react";
import Link from "next/link";
import { services } from "@/data/services";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function ServicosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
        <div className="container-site text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-4">
            SERVIÇOS
          </span>
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">
            Nossos Serviços
          </h1>
          <p className="text-[#A5D6A7] text-lg max-w-2xl mx-auto">
            Soluções completas em cunicultura, do planejamento à execução.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
                    {service.icon}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-poppins font-bold text-lg text-[#212121] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-[#4CAF50] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contato"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B5E20] group-hover:gap-2 transition-all"
                  >
                    {service.cta}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-center">
        <div className="container-site">
          <h2 className="font-poppins font-bold text-3xl text-white mb-4">
            Não encontrou o serviço que precisa?
          </h2>
          <p className="text-[#A5D6A7] text-lg max-w-xl mx-auto mb-8">
            Entre em contato conosco. Temos soluções personalizadas para cada cliente.
          </p>
          <Link href="/contato" className="btn btn-accent btn-lg">
            Fale Conosco
          </Link>
        </div>
      </section>
    </div>
  );
}
