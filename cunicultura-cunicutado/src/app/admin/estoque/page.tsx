"use client";

import React from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function AdminStockPage() {
  const lowStock = products.filter((p) => p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Dashboard</Link>
          <h1 className="font-poppins font-bold text-2xl">Controle de Estoque</h1>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12 space-y-6">
        {/* Alerts */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-2xl font-poppins font-bold text-[#212121]">{products.length}</p>
            <p className="text-sm text-gray-500">Total de Produtos</p>
          </div>
          <div className="bg-orange-50 rounded-2xl border border-orange-200 p-5">
            <p className="text-2xl font-poppins font-bold text-orange-600">{lowStock.length}</p>
            <p className="text-sm text-orange-600">Estoque Baixo</p>
          </div>
          <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
            <p className="text-2xl font-poppins font-bold text-red-600">{outOfStock.length}</p>
            <p className="text-sm text-red-600">Indisponíveis</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Produto</th>
                <th className="text-center px-6 py-4 text-gray-500 font-medium">Estoque</th>
                <th className="text-center px-6 py-4 text-gray-500 font-medium">Status</th>
                <th className="text-right px-6 py-4 text-gray-500 font-medium">Preço</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-[#212121]">{p.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={p.stock <= 5 ? "text-red-500 font-bold" : p.stock <= 10 ? "text-orange-500" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.stock === 0 ? "bg-red-100 text-red-700" :
                      p.stock <= 10 ? "bg-orange-100 text-orange-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {p.stock === 0 ? "Indisponível" : p.stock <= 10 ? "Baixo" : "OK"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-[#212121]">{formatPrice(p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
