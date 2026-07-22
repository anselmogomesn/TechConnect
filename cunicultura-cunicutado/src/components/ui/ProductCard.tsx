"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  type: "rabbit" | "product";
  available?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  category,
  type,
  available = true,
}: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const fav = isFavorite(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      type,
      name,
      image,
      price,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const href = type === "rabbit" ? `/catalogo/${slug}` : `/loja/${slug}`;
  const discount = originalPrice ? calculateDiscount(originalPrice, price) : 0;

  return (
    <Link href={href} className="group block">
      <div className="card bg-white rounded-[16px] shadow-[0_2px_20px_rgba(27,94,32,0.08)] hover:shadow-[0_8px_40px_rgba(27,94,32,0.15)] transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {!available && (
            <span className="badge bg-gray-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Indisponível
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFav}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:bg-white hover:scale-110"
          aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              fav ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
            viewBox="0 0 24 24"
            fill={fav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          {!imgError ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
              <span className="text-4xl opacity-50">
                {type === "rabbit" ? "🐰" : "📦"}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-xs font-medium text-[#4CAF50] uppercase tracking-wider">
            {category}
          </span>
          <h3 className="mt-1 font-poppins font-semibold text-[#212121] text-sm leading-tight line-clamp-2 group-hover:text-[#1B5E20] transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(rating)
                    ? "text-[#FF9800] fill-[#FF9800]"
                    : "text-gray-200 fill-gray-200"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="font-poppins font-bold text-[#1B5E20] text-lg">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="font-inter text-gray-400 line-through text-sm">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!available}
            className={`mt-3 w-full py-2.5 rounded-[10px] font-poppins font-semibold text-sm transition-all duration-300 ${
              isAdded
                ? "bg-green-500 text-white"
                : !available
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {isAdded ? "✓ Adicionado" : !available ? "Indisponível" : "Adicionar ao Carrinho"}
          </button>
        </div>
      </div>
    </Link>
  );
}
