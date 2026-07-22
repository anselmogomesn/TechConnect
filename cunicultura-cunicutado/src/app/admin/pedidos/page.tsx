"use client";

import React from "react";
import Link from "next/link";

const allOrders = [
  { id: "#0001", client: "Carlos Silva", email: "carlos@email.com", items: 2, total: "R$ 890,00", status: "Entregue", payment: "Cartão", date: "10/03/2026" },
  { id: "#0002", client: "Maria Santos", email: "maria@email.com", items: 1, total: "R$ 450,00", status: "A caminho", payment: "PIX", date: "09/03/2026" },
  { id: "#0003", client: "João Oliveira", email: "joao@email.com", items: 3, total: "R$ 1.250,00", status: "Processando", payment: "Boleto", date: "08/03/2026" },
  { id: "#0004", client: "Ana Costa", email: "ana@email.com", items: 1, total: "R$ 320,00", status: "Pendente", payment: "Cartão", date: "07/03/2026" },
  { id: "#0005", client: "Pedro Souza", email: "pedro@email.com", items: 2, total: "R$ 670,00", status: "Entregue", payment: "PIX", date: "06/03/2026" },
];

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white transition-colors mb-2 inline-block">
            ← Dashboard
          </Link>
          <h1 className="font-poppins font-bold text-2xl">Pedidos</h1>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Pedido</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Cliente</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Data</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Pagamento</th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-6 py-4 text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-[#212121]">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-700">{order.client}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 text-gray-500">{order.payment}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Entregue" ? "bg-green-100 text-green-700" :
                        order.status === "A caminho" ? "bg-blue-100 text-blue-700" :
                        order.status === "Processando" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
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
