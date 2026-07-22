"use client";

import React from "react";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";
import { rabbits } from "@/data/rabbits";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoriteRabbits = rabbits.filter((r) => favorites.includes(r.id));
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
        <div className="container-site py-12">
          <Link href="/cliente" className="text-sm text-[#A5D6A7] hover:text-white transition-colors mb-2 inline-block">
            ← Voltar
          </Link>
          <h1 className="font-poppins font-bold text-2xl">Meus Favoritos</h1>
          <p className="text-[#A5D6A7] text-sm mt-1">{favorites.length} itens salvos</p>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteRabbits.map((r) => (
              <ProductCard
                key={r.id}
                id={r.id}
                name={r.name}
                slug={r.slug}
                image={r.images[0]}
                price={r.price}
                originalPrice={r.originalPrice}
                rating={r.rating}
                reviewCount={r.reviewCount}
                category={r.breed}
                type="rabbit"
                available={r.available}
              />
            ))}
            {favoriteProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                image={p.images[0]}
                price={p.price}
                originalPrice={p.originalPrice}
                rating={p.rating}
                reviewCount={p.reviewCount}
                category={p.brand || "Produto"}
                type="product"
                available={p.available}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center">
            <span className="text-5xl block mb-4">❤️</span>
            <h2 className="font-poppins font-bold text-xl text-gray-400 mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-400 mb-6">
              Salve seus itens favoritos para encontrá-los facilmente depois.
            </p>
            <Link href="/catalogo" className="btn btn-primary">
              Explorar Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
