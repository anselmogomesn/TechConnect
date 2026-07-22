"use client";

import React from "react";
import Link from "next/link";
import { rabbits } from "@/data/rabbits";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

// Combine featured rabbits and products
const featuredRabbits = rabbits
  .filter((r) => r.featured)
  .slice(0, 4)
  .map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    image: r.images[0],
    price: r.price,
    originalPrice: r.originalPrice,
    rating: r.rating,
    reviewCount: r.reviewCount,
    category: "Coelhos " + r.category.charAt(0).toUpperCase() + r.category.slice(1),
    type: "rabbit" as const,
    available: r.available,
  }));

const featuredProducts = products
  .filter((p) => p.featured)
  .slice(0, 4)
  .map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0],
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
    type: "product" as const,
    available: p.available,
  }));

const saleItems = rabbits
  .filter((r) => r.onSale)
  .slice(0, 4)
  .map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    image: r.images[0],
    price: r.price,
    originalPrice: r.originalPrice,
    rating: r.rating,
    reviewCount: r.reviewCount,
    category: "Oferta",
    type: "rabbit" as const,
    available: r.available,
  }));

export function FeaturedSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-site">
        {/* Featured */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-poppins font-bold text-[clamp(1.5rem,4vw,2.5rem)] text-[#212121]">
                Destaques
              </h2>
              <div className="w-[60px] h-[3px] bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] rounded-full mt-2" />
            </div>
            <Link
              href="/catalogo"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#1B5E20] hover:gap-2 transition-all"
            >
              Ver Todos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <TabSection
            tabs={[
              { label: "Coelhos", items: featuredRabbits },
              { label: "Produtos", items: featuredProducts },
            ]}
            emptyMessage="Nenhum destaque disponível no momento."
          />
        </div>

        {/* On Sale */}
        {saleItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-poppins font-bold text-[clamp(1.5rem,4vw,2.5rem)] text-[#212121]">
                  <span className="text-[#FF9800]">Promoções</span> Especiais
                </h2>
                <div className="w-[60px] h-[3px] bg-gradient-to-r from-[#FF9800] to-[#F57C00] rounded-full mt-2" />
              </div>
              <Link
                href="/catalogo?promocoes=true"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#FF9800] hover:gap-2 transition-all"
              >
                Ver Ofertas
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleItems.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TabSection({
  tabs,
  emptyMessage,
}: {
  tabs: { label: string; items: any[] }[];
  emptyMessage: string;
}) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === i
                ? "bg-[#1B5E20] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs[activeTab].items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabs[activeTab].items.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">{emptyMessage}</div>
      )}
    </div>
  );
}
