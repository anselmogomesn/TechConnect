"use client";

import React, { useState, useMemo } from "react";
import { rabbits, rabbitCategories } from "@/data/rabbits";
import { ProductCard } from "@/components/ui/ProductCard";
import { RabbitCategory } from "@/types";

export default function CatalogoPage() {
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<string>("destaque");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRabbits = useMemo(() => {
    let result = [...rabbits];

    if (activeCategory !== "todos") {
      result = result.filter((r) => r.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.breed.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "preco-menor":
        result.sort((a, b) => a.price - b.price);
        break;
      case "preco-maior":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nome":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [activeCategory, sortBy, searchQuery]);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
        <div className="container-site">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-4">
              CATÁLOGO
            </span>
            <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">
              Nossos Coelhos
            </h1>
            <p className="text-[#A5D6A7] text-lg max-w-2xl mx-auto">
              Conheça nossas raças selecionadas com a melhor genética do mercado.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por raça, nome ou característica..."
                  className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="section-padding">
        <div className="container-site">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("todos")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "todos"
                  ? "bg-[#1B5E20] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Todos ({rabbits.length})
            </button>
            {rabbitCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-[#1B5E20] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Sort & Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {filteredRabbits.length} resultado{filteredRabbits.length !== 1 ? "s" : ""}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            >
              <option value="destaque">Mais relevantes</option>
              <option value="preco-menor">Menor preço</option>
              <option value="preco-maior">Maior preço</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </div>

          {/* Grid */}
          {filteredRabbits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRabbits.map((rabbit) => (
                <ProductCard
                  key={rabbit.id}
                  id={rabbit.id}
                  name={rabbit.name}
                  slug={rabbit.slug}
                  image={rabbit.images[0]}
                  price={rabbit.price}
                  originalPrice={rabbit.originalPrice}
                  rating={rabbit.rating}
                  reviewCount={rabbit.reviewCount}
                  category={rabbit.breed}
                  type="rabbit"
                  available={rabbit.available}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🐰</span>
              <h3 className="font-poppins font-bold text-xl text-gray-400 mb-2">
                Nenhum coelho encontrado
              </h3>
              <p className="text-gray-400">Tente ajustar os filtros ou buscar por outro termo.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
