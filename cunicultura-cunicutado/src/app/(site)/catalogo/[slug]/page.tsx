"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { rabbits } from "@/data/rabbits";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function RabbitDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const rabbit = rabbits.find((r) => r.slug === slug);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!rabbit) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <span className="text-6xl block mb-4">🐰</span>
            <h1 className="font-poppins font-bold text-2xl text-gray-400 mb-2">Coelho não encontrado</h1>
            <p className="text-gray-400 mb-6">O coelho que você procura não está disponível.</p>
            <Link href="/catalogo" className="btn btn-primary">Ver Catálogo</Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const fav = isFavorite(rabbit.id);
  const related = rabbits.filter((r) => r.category === rabbit.category && r.id !== rabbit.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: rabbit.id,
      type: "rabbit",
      name: rabbit.name,
      image: rabbit.images[0],
      price: rabbit.price,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-site py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#1B5E20] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/catalogo" className="hover:text-[#1B5E20] transition-colors">Catálogo</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{rabbit.name}</span>
            </div>
          </div>
        </div>

        <div className="container-site py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center mb-4 overflow-hidden">
                <span className="text-9xl opacity-50">🐰</span>
              </div>
              <div className="flex gap-3">
                {rabbit.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center border-2 transition-all ${
                      mainImage === i ? "border-[#1B5E20]" : "border-transparent"
                    }`}
                  >
                    <span className="text-2xl">🐰</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className="px-3 py-1 bg-green-50 text-[#4CAF50] text-xs font-semibold rounded-full">
                  {rabbit.breed}
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full">
                  {rabbit.sex === "macho" ? "♂ Macho" : "♀ Fêmea"}
                </span>
                {!rabbit.available && (
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                    Indisponível
                  </span>
                )}
              </div>

              <h1 className="font-poppins font-bold text-2xl md:text-3xl text-[#212121] mb-2">
                {rabbit.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(rabbit.rating) ? "text-[#FF9800] fill-[#FF9800]" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">({rabbit.reviewCount} avaliações)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-poppins font-bold text-3xl text-[#1B5E20]">
                  {formatPrice(rabbit.price)}
                </span>
                {rabbit.originalPrice && (
                  <span className="font-inter text-gray-400 line-through text-lg">
                    {formatPrice(rabbit.originalPrice)}
                  </span>
                )}
                {rabbit.discount && (
                  <span className="px-2 py-1 bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white text-xs font-bold rounded-full">
                    -{rabbit.discount}%
                  </span>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Raça", value: rabbit.breed },
                  { label: "Idade", value: rabbit.age },
                  { label: "Peso", value: rabbit.weight },
                  { label: "Sexo", value: rabbit.sex === "macho" ? "Macho" : "Fêmea" },
                  { label: "Origem", value: rabbit.origin },
                  { label: "Disponibilidade", value: rabbit.available ? "Disponível" : "Indisponível" },
                ].map((info) => (
                  <div key={info.label} className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">{info.label}</p>
                    <p className="text-sm font-medium text-[#212121]">{info.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{rabbit.description}</p>

              {/* Actions */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center bg-white rounded-xl border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-50 transition-colors">-</button>
                  <span className="px-4 py-3 font-medium text-sm min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-50 transition-colors">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!rabbit.available}
                  className={`flex-1 py-3 rounded-xl font-poppins font-semibold text-sm transition-all ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : !rabbit.available
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {addedToCart ? "✓ Adicionado ao Carrinho" : "Adicionar ao Carrinho"}
                </button>
                <button
                  onClick={() => toggleFavorite(rabbit.id)}
                  className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label="Favoritar"
                >
                  <svg className={`w-5 h-5 ${fav ? "text-red-500 fill-red-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Vaccination */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
                <h3 className="font-poppins font-bold text-sm text-[#212121] mb-2">💉 Vacinação</h3>
                <ul className="space-y-1">
                  {rabbit.vaccination.map((v, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-3.5 h-3.5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {v}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantee */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-sm text-orange-800">
                  <strong>🔒 Garantia:</strong> {rabbit.guarantee}
                </p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-card">
            <h2 className="font-poppins font-bold text-xl text-[#212121] mb-4">Sobre este animal</h2>
            <p className="text-gray-600 leading-relaxed">{rabbit.longDescription}</p>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-6">Coelhos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((r) => (
                  <Link key={r.id} href={`/catalogo/${r.slug}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-square bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                        <span className="text-5xl opacity-50">🐰</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-poppins font-semibold text-sm text-[#212121] group-hover:text-[#1B5E20] transition-colors">{r.name}</h3>
                        <p className="font-poppins font-bold text-[#1B5E20] mt-1">{formatPrice(r.price)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
