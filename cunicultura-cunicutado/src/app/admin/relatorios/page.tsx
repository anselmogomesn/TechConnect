"use client";

import React from "react";
import Link from "next/link";

export default function AdminRelatoriosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Dashboard</Link>
          <h1 className="font-poppins font-bold text-2xl">Relatórios</h1>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Relatório de Vendas", desc: "Vendas por período, produto e categoria", icon: "📊" },
            { title: "Relatório de Clientes", desc: "Novos clientes, recorrência e ticket médio", icon: "👥" },
            { title: "Relatório de Estoque", desc: "Produtos com estoque baixo e giro", icon: "📦" },
            { title: "Relatório Financeiro", desc: "Receitas, despesas e fluxo de caixa", icon: "💰" },
            { title: "Relatório de Pedidos", desc: "Pedidos por status, região e período", icon: "📋" },
            { title: "Relatório de Faturamento", desc: "Faturamento mensal e anual", icon: "📈" },
          ].map((report) => (
            <div key={report.title} className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1 cursor-pointer">
              <span className="text-3xl block mb-3">{report.icon}</span>
              <h3 className="font-poppins font-semibold text-[#212121]">{report.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
              <button className="mt-4 text-sm font-semibold text-[#1B5E20] hover:underline">Gerar Relatório</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
