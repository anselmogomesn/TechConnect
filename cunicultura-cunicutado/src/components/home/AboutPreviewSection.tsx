"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export function AboutPreviewSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-30">🐰</span>
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-card p-5 max-w-[200px] hidden md:block">
              <div className="text-3xl mb-2">🏆</div>
              <p className="font-poppins font-bold text-sm text-[#212121]">
                {siteConfig.foundedYear} anos de excelência
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block px-3 py-1 bg-green-50 text-[#1B5E20] text-xs font-semibold rounded-full mb-4">
              NOSSA HISTÓRIA
            </span>
            <h2 className="font-poppins font-bold text-[clamp(1.5rem,4vw,2.5rem)] text-[#212121] mb-4">
              Paixão pela cunicultura que virou referência
            </h2>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] rounded-full mb-6" />
            <p className="text-gray-600 leading-relaxed mb-4">
              Fundada por <strong className="text-[#1B5E20]">{siteConfig.founder}</strong>,
              a Cunicultura Cunicutado nasceu da paixão pela criação de coelhos e do compromisso
              com a excelência genética. Desde o início, nossa missão foi clara: oferecer
              animais saudáveis, bem cuidados e com o melhor padrão genético do mercado.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Hoje, somos referência nacional em cunicultura, combinando tradição e inovação
              para oferecer o que há de melhor em genética, produtos e serviços para criadores
              de todos os níveis.
            </p>
            <Link
              href="/sobre"
              className="btn btn-primary inline-flex"
            >
              Conheça Nossa História
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
