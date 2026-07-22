"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [completed, setCompleted] = useState(false);

  const shipping = subtotal > 299 ? 0 : 29.9;
  const total = subtotal + shipping;

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3);
    } else {
      setCompleted(true);
      clearCart();
    }
  };

  if (completed) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-poppins font-bold text-2xl text-[#212121] mb-2">Pedido Confirmado! 🎉</h1>
            <p className="text-gray-500 mb-6">Seu pedido foi recebido com sucesso. Você receberá um email com os detalhes e o código de rastreio em breve.</p>
            <Link href="/catalogo" className="btn btn-primary">Continuar Comprando</Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (items.length === 0 && !completed) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl block mb-4">🛒</span>
            <h1 className="font-poppins font-bold text-2xl text-gray-400 mb-2">Carrinho Vazio</h1>
            <Link href="/catalogo" className="btn btn-primary mt-4">Ver Produtos</Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
          <div className="container-site py-12">
            <h1 className="font-poppins font-bold text-2xl md:text-3xl">Checkout</h1>
            {/* Steps */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { num: 1, label: "Endereço" },
                { num: 2, label: "Pagamento" },
                { num: 3, label: "Confirmar" },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s.num ? "bg-white text-[#1B5E20]" : "bg-white/20 text-white"
                  }`}>{s.num}</div>
                  <span className={`text-sm ${step >= s.num ? "text-white" : "text-white/50"}`}>{s.label}</span>
                  {s.num < 3 && <div className={`w-8 h-0.5 ${step > s.num ? "bg-white" : "bg-white/20"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container-site -mt-6 pb-12">
          <form onSubmit={handleFinishOrder}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Address */}
                {step === 1 && (
                  <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                    <h2 className="font-poppins font-bold text-lg text-[#212121] mb-5">Endereço de Entrega</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {["CEP", "Rua", "Número", "Complemento", "Bairro", "Cidade", "Estado"].map((field) => (
                        <div key={field} className={field === "Complemento" || field === "Rua" || field === "Cidade" ? "sm:col-span-2" : ""}>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">{field} *</label>
                          <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                    <h2 className="font-poppins font-bold text-lg text-[#212121] mb-5">Forma de Pagamento</h2>
                    <div className="space-y-3">
                      {[
                        { value: "credit", label: "Cartão de Crédito", desc: "Parcele em até 12x", icon: "💳" },
                        { value: "pix", label: "PIX", desc: "Aprovação instantânea", icon: "⚡" },
                        { value: "boleto", label: "Boleto Bancário", desc: "Vencimento em 3 dias", icon: "📄" },
                        { value: "debit", label: "Cartão de Débito", desc: "Pagamento online", icon: "🏦" },
                      ].map((method) => (
                        <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.value ? "border-[#1B5E20] bg-green-50" : "border-gray-200 hover:border-gray-300"
                        }`}>
                          <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <p className="font-medium text-[#212121] text-sm">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                  <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                    <h2 className="font-poppins font-bold text-lg text-[#212121] mb-5">Confirmar Pedido</h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center text-xl">
                            {item.type === "rabbit" ? "🐰" : "📦"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#212121] truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                          </div>
                          <p className="font-poppins font-semibold text-[#1B5E20]">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-800">💳 Pagamento: <strong>{paymentMethod === "credit" ? "Cartão de Crédito" : paymentMethod === "pix" ? "PIX" : paymentMethod === "boleto" ? "Boleto" : "Cartão de Débito"}</strong></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                  <h2 className="font-poppins font-bold text-lg text-[#212121] mb-4">Resumo</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Itens ({items.length})</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Frete</span>
                      <span className={shipping === 0 ? "text-[#4CAF50] font-medium" : ""}>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-poppins font-bold text-[#212121]">Total</span>
                      <span className="font-poppins font-bold text-lg text-[#1B5E20]">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-poppins font-semibold text-sm rounded-xl hover:shadow-lg transition-all">
                    {step === 3 ? "Confirmar Pedido" : "Continuar"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
