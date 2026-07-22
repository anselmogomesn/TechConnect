"use client";

import React, { useState } from "react";
import { portfolioItems } from "@/data/portfolio";
import { PortfolioCategory } from "@/types";

const categories: { value: PortfolioCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "projetos", label: "Projetos" },
  { value: "clientes", label: "Clientes" },
  { value: "granjas", label: "Granjas" },
  { value: "instalacoes", label: "Instalações" },
  { value: "eventos", label: "Eventos" },
  { value: "feiras", label: "Feiras" },
  { value: "exposicoes", label: "Exposições" },
  { value: "entregas", label: "Entregas" },
  { value: "producao", label: "Produção" },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "todos">("todos");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filtered = activeCategory === "todos"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
        <div className="container-site text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-4">
            PORTFÓLIO
          </span>
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">
            Nosso Portfólio
          </h1>
          <p className="text-[#A5D6A7] text-lg max-w-2xl mx-auto">
            Conheça nossos projetos, eventos e realizações.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section-padding">
        <div className="container-site">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-[#1B5E20] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center overflow-hidden">
                  <span className="text-6xl transition-transform duration-500 group-hover:scale-110">📸</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <span className="text-xs font-semibold text-[#A5D6A7] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-poppins font-bold text-lg text-white mt-1">{item.title}</h3>
                    <p className="text-sm text-gray-300 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-[#4CAF50] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-poppins font-semibold text-[#212121] mt-1">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Modal */}
          {selectedItem && (() => {
            const item = portfolioItems.find((p) => p.id === selectedItem);
            if (!item) return null;
            return (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedItem(null)}
              >
                <div
                  className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-scaleIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="aspect-video bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center relative">
                    <span className="text-6xl">📸</span>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6 md:p-8">
                    <span className="text-xs font-semibold text-[#4CAF50] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h2 className="font-poppins font-bold text-2xl text-[#212121] mt-2 mb-3">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                    {item.client && (
                      <p className="text-sm text-gray-500">
                        <strong>Cliente:</strong> {item.client}
                      </p>
                    )}
                    {item.location && (
                      <p className="text-sm text-gray-500">
                        <strong>Local:</strong> {item.location}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      <strong>Data:</strong> {new Date(item.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
