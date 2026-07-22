"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <span className="text-6xl block mb-4">📦</span>
            <h1 className="font-poppins font-bold text-2xl text-gray-400 mb-2">Produto não encontrado</h1>
            <p className="text-gray-400 mb-6">O produto que você procura não está disponível.</p>
            <Link href="/loja" className="btn btn-primary">Ver Loja</Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const fav = isFavorite(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      type: "product",
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="container-site py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
              <span>/</span>
              <Link href="/loja" className="hover:text-[#1B5E20]">Loja</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container-site py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center mb-4">
                <span className="text-9xl opacity-50">📦</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.brand && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    {product.brand}
                  </span>
                )}
                {product.discount && (
                  <span className="px-3 py-1 bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white text-xs font-bold rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <h1 className="font-poppins font-bold text-2xl md:text-3xl text-[#212121] mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-[#FF9800] fill-[#FF9800]" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount} avaliações)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-poppins font-bold text-3xl text-[#1B5E20]">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="font-inter text-gray-400 line-through text-lg">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.weight && (
                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Peso</p>
                    <p className="text-sm font-medium text-[#212121]">{product.weight}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Dimensões</p>
                    <p className="text-sm font-medium text-[#212121]">{product.dimensions}</p>
                  </div>
                )}
                <div className="bg-white rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400">Estoque</p>
                  <p className={`text-sm font-medium ${product.stock > 5 ? "text-green-600" : "text-orange-500"}`}>
                    {product.stock > 0 ? `${product.stock} unidades` : "Indisponível"}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.longDescription}</p>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center bg-white rounded-xl border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-50">-</button>
                  <span className="px-4 py-3 font-medium text-sm min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-50">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-xl font-poppins font-semibold text-sm transition-all ${
                    addedToCart ? "bg-green-500 text-white"
                    : product.stock === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {addedToCart ? "✓ Adicionado" : product.stock === 0 ? "Indisponível" : "Adicionar ao Carrinho"}
                </button>
                <button onClick={() => toggleFavorite(product.id)} className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50">
                  <svg className={`w-5 h-5 ${fav ? "text-red-500 fill-red-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <Link key={p.id} href={`/loja/${p.slug}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-square bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                        <span className="text-5xl opacity-50">📦</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-poppins font-semibold text-sm text-[#212121] group-hover:text-[#1B5E20]">{p.name}</h3>
                        <p className="font-poppins font-bold text-[#1B5E20] mt-1">{formatPrice(p.price)}</p>
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
