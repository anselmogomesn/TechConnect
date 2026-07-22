"use client";

import React from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white transition-colors mb-2 inline-block">
            ← Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-poppins font-bold text-2xl">Produtos</h1>
            <button className="px-4 py-2 bg-white text-[#1B5E20] rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
              + Novo Produto
            </button>
          </div>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Produto</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Categoria</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Estoque</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-6 py-4 text-gray-500 font-medium">Preço</th>
                  <th className="text-center px-6 py-4 text-gray-500 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">📦</div>
                        <span className="font-medium text-[#212121]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock <= 5 ? "text-red-500" : product.stock <= 10 ? "text-orange-500" : "text-gray-700"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.available ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#212121]">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-500 transition-colors" title="Editar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Excluir">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
