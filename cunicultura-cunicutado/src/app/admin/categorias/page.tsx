"use client";

import React from "react";
import Link from "next/link";
import { rabbitCategories } from "@/data/rabbits";

export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Dashboard</Link>
          <div className="flex items-center justify-between">
            <h1 className="font-poppins font-bold text-2xl">Categorias</h1>
            <button className="px-4 py-2 bg-white text-[#1B5E20] rounded-lg text-sm font-semibold">+ Nova Categoria</button>
          </div>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Categoria</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Descrição</th>
                <th className="text-center px-6 py-4 text-gray-500 font-medium">Itens</th>
                <th className="text-center px-6 py-4 text-gray-500 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rabbitCategories.map((cat) => (
                <tr key={cat.value} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-[#212121] capitalize">{cat.label}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.description}</td>
                  <td className="px-6 py-4 text-center text-gray-500">{cat.count}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-500" title="Editar">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
