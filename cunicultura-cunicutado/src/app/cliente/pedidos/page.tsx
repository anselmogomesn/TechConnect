"use client";

import React from "react";
import Link from "next/link";

const orders = [
  { id: "#0001", date: "10/03/2026", status: "Entregue", items: 2, total: "R$ 890,00", payment: "Cartão de Crédito" },
  { id: "#0002", date: "25/02/2026", status: "A caminho", items: 1, total: "R$ 450,00", payment: "PIX" },
  { id: "#0003", date: "15/02/2026", status: "Entregue", items: 3, total: "R$ 1.250,00", payment: "Boleto" },
  { id: "#0004", date: "20/01/2026", status: "Cancelado", items: 1, total: "R$ 320,00", payment: "Cartão de Débito" },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
        <div className="container-site py-12">
          <Link href="/cliente" className="text-sm text-[#A5D6A7] hover:text-white transition-colors mb-2 inline-block">
            ← Voltar
          </Link>
          <h1 className="font-poppins font-bold text-2xl">Meus Pedidos</h1>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Pedido</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Data</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Pagamento</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-6 py-4 text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#212121]">{order.id}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 text-gray-500">{order.payment}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "Entregue" ? "bg-green-100 text-green-700" :
                        order.status === "A caminho" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#212121]">{order.total}</td>
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
