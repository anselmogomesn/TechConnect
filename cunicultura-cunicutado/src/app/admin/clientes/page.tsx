"use client";

import React from "react";
import Link from "next/link";

const mockClients = [
  { id: 1, name: "Carlos Silva", email: "carlos@email.com", orders: 5, spent: "R$ 3.450,00", since: "Jan 2025" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", orders: 3, spent: "R$ 1.890,00", since: "Mar 2025" },
  { id: 3, name: "João Oliveira", email: "joao@email.com", orders: 8, spent: "R$ 6.200,00", since: "Set 2024" },
  { id: 4, name: "Ana Costa", email: "ana@email.com", orders: 2, spent: "R$ 890,00", since: "Fev 2026" },
  { id: 5, name: "Pedro Souza", email: "pedro@email.com", orders: 4, spent: "R$ 2.560,00", since: "Jun 2025" },
];

export default function AdminClientsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Dashboard</Link>
          <h1 className="font-poppins font-bold text-2xl">Clientes</h1>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Cliente</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Email</th>
                <th className="text-center px-6 py-4 text-gray-500 font-medium">Pedidos</th>
                <th className="text-right px-6 py-4 text-gray-500 font-medium">Total Gasto</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Cliente Desde</th>
              </tr>
            </thead>
            <tbody>
              {mockClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-[#212121]">{client.name}</td>
                  <td className="px-6 py-4 text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 text-center text-gray-500">{client.orders}</td>
                  <td className="px-6 py-4 text-right font-medium text-[#212121]">{client.spent}</td>
                  <td className="px-6 py-4 text-gray-500">{client.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
