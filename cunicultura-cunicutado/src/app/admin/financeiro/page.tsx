"use client";

import React from "react";
import Link from "next/link";

export default function AdminFinanceiroPage() {
  const transactions = [
    { id: "#0001", type: "Recebido", client: "Carlos Silva", value: "R$ 890,00", method: "Cartão", date: "10/03", status: "Confirmado" },
    { id: "#0002", type: "Recebido", client: "Maria Santos", value: "R$ 450,00", method: "PIX", date: "09/03", status: "Confirmado" },
    { id: "#0003", type: "Pendente", client: "João Oliveira", value: "R$ 1.250,00", method: "Boleto", date: "08/03", status: "Aguardando" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Dashboard</Link>
          <h1 className="font-poppins font-bold text-2xl">Financeiro</h1>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-xs text-gray-400">Faturamento do Mês</p>
            <p className="text-2xl font-poppins font-bold text-[#212121]">R$ 28.450,00</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
            <p className="text-xs text-green-600">Recebido</p>
            <p className="text-2xl font-poppins font-bold text-green-700">R$ 26.800,00</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-5 border border-orange-200">
            <p className="text-xs text-orange-600">Pendente</p>
            <p className="text-2xl font-poppins font-bold text-orange-700">R$ 1.650,00</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Transação</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Tipo</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Cliente</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Método</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                <th className="text-right px-6 py-4 text-gray-500 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-50">
                  <td className="px-6 py-4 font-medium text-[#212121]">{t.id}</td>
                  <td className="px-6 py-4">{t.type}</td>
                  <td className="px-6 py-4 text-gray-500">{t.client}</td>
                  <td className="px-6 py-4 text-gray-500">{t.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === "Confirmado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">{t.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
