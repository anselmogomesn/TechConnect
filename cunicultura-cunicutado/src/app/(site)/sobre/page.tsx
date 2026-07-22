"use client";

import React from "react";
import { siteConfig } from "@/data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function SobrePage() {
  const timeline = [
    { year: 2018, event: "Fundação da Cunicultura Cunicutado por Anselmo Gomes." },
    { year: 2019, event: "Primeira importação de matrizes europeias com genética premium." },
    { year: 2020, event: "Inauguração do criatório modelo com capacidade para 200 matrizes." },
    { year: 2021, event: "Lançamento do programa de melhoramento genético próprio." },
    { year: 2022, event: "Parceria com associações nacionais e internacionais de cunicultura." },
    { year: 2023, event: "Expansão para e-commerce e inauguração da loja virtual." },
    { year: 2024, event: "Reconhecimento como referência nacional em genética de coelhos." },
    { year: 2025, event: "Lançamento da linha de produtos próprios e serviços de consultoria." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-[#4CAF50]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#81C784]/10 rounded-full blur-3xl" />
        <div className="container-site relative z-10 text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-4">
            SOBRE NÓS
          </span>
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">
            Nossa História
          </h1>
          <p className="text-[#A5D6A7] text-lg max-w-2xl mx-auto">
            Conheça a trajetória da Cunicultura Cunicutado e nossa paixão pela criação de coelhos.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-poppins font-bold text-2xl md:text-3xl text-[#212121] mb-4">
                Uma paixão que virou propósito
              </h2>
              <div className="w-[60px] h-[3px] bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] rounded-full mb-6" />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A <strong className="text-[#1B5E20]">Cunicultura Cunicutado</strong> foi fundada por{" "}
                  <strong className="text-[#1B5E20]">Anselmo Gomes</strong>, um apaixonado pela criação
                  de coelhos desde jovem. O que começou como um pequeno criatório familiar, rapidamente
                  se transformou em uma referência nacional no setor.
                </p>
                <p>
                  Com investimento constante em genética, bem-estar animal e capacitação técnica,
                  a Cunicutado se destaca pela qualidade superior dos seus animais e pelo compromisso
                  com a satisfação dos clientes.
                </p>
                <p>
                  Hoje, oferecemos desde coelhos de estimação até reprodutores de elite para os
                  mais exigentes criadores comerciais, sempre com a garantia de qualidade que
                  tornou nossa marca reconhecida em todo o Brasil.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                <span className="text-8xl opacity-30">🐰</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-site">
          <SectionTitle
            title="Nossos Pilares"
            subtitle="Princípios que guiam cada aspecto do nosso trabalho."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Missão",
                items: [
                  "Oferecer animais de alta qualidade genética",
                  "Promover o bem-estar animal em todas as etapas",
                  "Capacitar e apoiar criadores em todo o Brasil",
                ],
              },
              {
                icon: "🔭",
                title: "Visão",
                items: [
                  "Ser referência nacional em cunicultura",
                  "Expandir a genética brasileira para o mercado internacional",
                  "Inovar constantemente em produtos e serviços",
                ],
              },
              {
                icon: "💚",
                title: "Valores",
                items: [
                  "Compromisso com o bem-estar animal",
                  "Excelência genética e operacional",
                  "Respeito ao meio ambiente e sustentabilidade",
                ],
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="font-poppins font-bold text-xl text-[#212121] mb-4">
                  {pillar.title}
                </h3>
                <ul className="space-y-2">
                  {pillar.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray-600 text-sm">
                      <svg className="w-4 h-4 text-[#4CAF50] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden aspect-square max-w-[400px] mx-auto bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center">
                <span className="text-8xl">👨‍🌾</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block px-3 py-1 bg-green-50 text-[#1B5E20] text-xs font-semibold rounded-full mb-4">
                FUNDADOR
              </span>
              <h2 className="font-poppins font-bold text-2xl md:text-3xl text-[#212121] mb-2">
                Anselmo Gomes
              </h2>
              <p className="text-[#4CAF50] font-medium mb-4">Fundador & CEO</p>
              <div className="w-[60px] h-[3px] bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] rounded-full mb-6" />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Criador apaixonado desde a infância, Anselmo transformou seu hobby em um negócio
                  de sucesso. Com formação em Zootecnia e especialização em melhoramento genético,
                  ele construiu a Cunicutado baseada em conhecimento técnico, dedicação e amor pelos animais.
                </p>
                <p>
                  Sua visão empreendedora e compromisso com a excelência fizeram da Cunicultura Cunicutado
                  uma referência no setor, inspirando novos criadores e elevando o padrão da cunicultura nacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-site">
          <SectionTitle
            title="Nossa Trajetória"
            subtitle="Marcos importantes na história da Cunicutado."
          />
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-poppins font-bold text-xs shrink-0">
                    {item.year.toString().slice(-2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-[#4CAF50] to-transparent" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="font-poppins font-bold text-[#1B5E20]">{item.year}</span>
                  <p className="text-gray-600 mt-1">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl p-8 md:p-10">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-poppins font-bold text-xl text-[#212121] mb-3">Compromisso Ambiental</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Adotamos práticas sustentáveis em todas as etapas da produção, desde o manejo
                de dejetos até a redução do consumo de água e energia. Acreditamos que cuidar
                do meio ambiente é cuidar do futuro da cunicultura.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] rounded-2xl p-8 md:p-10">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="font-poppins font-bold text-xl text-[#212121] mb-3">Bem-Estar Animal</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nossos animais são criados com os mais altos padrões de bem-estar, com
                instalações adequadas, nutrição balanceada, acompanhamento veterinário
                constante e muito carinho em cada etapa do desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
