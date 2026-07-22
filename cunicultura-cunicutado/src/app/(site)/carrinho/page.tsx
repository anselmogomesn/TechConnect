"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  const shipping = subtotal > 299 ? 0 : 29.9;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">🛒</span>
          <h1 className="font-poppins font-bold text-2xl text-gray-400 mb-2">Carrinho Vazio</h1>
          <p className="text-gray-400 mb-6">Você ainda não adicionou itens ao carrinho.</p>
          <Link href="/catalogo" className="btn btn-primary btn-lg">
            Ver Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
        <div className="container-site py-12">
          <h1 className="font-poppins font-bold text-2xl md:text-3xl">
            Carrinho ({items.length} {items.length === 1 ? "item" : "itens"})
          </h1>
        </div>
      </div>

      <div className="container-site -mt-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl shadow-card p-4 md:p-6 flex gap-4"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center shrink-0">
                  <span className="text-3xl">{item.type === "rabbit" ? "🐰" : "📦"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${item.type === "rabbit" ? "catalogo" : "loja"}/${item.type === "rabbit" ? "" : ""}`}
                    className="font-poppins font-semibold text-[#212121] hover:text-[#1B5E20] transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.type === "rabbit" ? "Coelho" : "Produto"}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        -
                      </button>
                      <span className="font-poppins font-medium text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-poppins font-bold text-[#1B5E20]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remover"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Limpar Carrinho
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="font-poppins font-bold text-lg text-[#212121] mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className={shipping === 0 ? "text-[#4CAF50] font-medium" : "text-gray-500"}>
                    {shipping === 0 ? "Grátis" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-[#4CAF50]">🎉 Frete grátis para pedidos acima de R$ 299,00</p>
                )}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-poppins font-bold text-[#212121]">Total</span>
                    <span className="font-poppins font-bold text-lg text-[#1B5E20]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2">Cupom de desconto</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o cupom"
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3.5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-poppins font-semibold text-sm rounded-xl text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Finalizar Pedido
              </Link>

              <Link
                href="/catalogo"
                className="block text-center text-sm text-gray-400 hover:text-[#1B5E20] transition-colors mt-3"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
