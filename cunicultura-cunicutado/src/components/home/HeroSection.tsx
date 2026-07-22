"use client";

import React from "react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#144317]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#81C784]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A5D6A7]/5 rounded-full blur-3xl" />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site text-center px-4">
        <div className="animate-fadeIn">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-6 border border-white/10">
            🐰 Referência Nacional em Cunicultura
          </span>

          <h1 className="font-poppins font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 text-balance">
            Cunicultura
            <br />
            <span className="bg-gradient-to-r from-[#A5D6A7] to-[#81C784] bg-clip-text text-transparent">
              Cunicutado
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-[#A5D6A7] max-w-2xl mx-auto mb-10 font-inter">
            Qualidade, genética e paixão na criação de coelhos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalogo"
              className="btn btn-accent btn-lg text-base px-8 py-4"
            >
              Comprar Agora
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/sobre"
              className="btn btn-white btn-lg text-base px-8 py-4"
            >
              Conheça a Empresa
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Coelhos Entregues" },
            { value: "50+", label: "Raças Diferentes" },
            { value: "6+", label: "Anos de Experiência" },
            { value: "98%", label: "Clientes Satisfeitos" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="font-poppins font-bold text-2xl md:text-3xl text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-[#A5D6A7] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
}
