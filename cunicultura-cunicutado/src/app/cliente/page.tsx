"use client";

import React from "react";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function ClientDashboardPage() {
  const { favorites } = useFavorites();

  const menuItems = [
    {
      icon: "📋",
      title: "Meus Pedidos",
      description: "Acompanhe seus pedidos",
      href: "/cliente/pedidos",
      count: 3,
    },
    {
      icon: "❤️",
      title: "Favoritos",
      description: "Itens salvos",
      href: "/cliente/favoritos",
      count: favorites.length,
    },
    {
      icon: "📍",
      title: "Endereços",
      description: "Gerencie endereços",
      href: "/cliente/enderecos",
    },
    {
      icon: "👤",
      title: "Dados Pessoais",
      description: "Edite seu perfil",
      href: "/cliente/dados",
    },
    {
      icon: "💬",
      title: "Suporte",
      description: "Central de ajuda",
      href: "/contato",
    },
  ];

  const recentOrders = [
    { id: "#0001", date: "10/03/2026", status: "Entregue", total: "R$ 890,00" },
    { id: "#0002", date: "25/02/2026", status: "A caminho", total: "R$ 450,00" },
    { id: "#0003", date: "15/02/2026", status: "Entregue", total: "R$ 1.250,00" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
        <div className="container-site py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h1 className="font-poppins font-bold text-2xl">Olá, Cliente</h1>
              <p className="text-[#A5D6A7] text-sm">Bem-vindo à sua conta</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site -mt-6 pb-12">
        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-poppins font-semibold text-sm text-[#212121]">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
              {"count" in item && item.count !== undefined && item.count > 0 && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-[#FF9800] text-white text-xs rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-bold text-lg text-[#212121]">Últimos Pedidos</h2>
            <Link href="/cliente/pedidos" className="text-sm text-[#1B5E20] font-semibold hover:underline">
              Ver Todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-gray-500 font-medium">Pedido</th>
                  <th className="text-left py-3 text-gray-500 font-medium">Data</th>
                  <th className="text-left py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-3 text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-[#212121]">{order.id}</td>
                    <td className="py-3 text-gray-500">{order.date}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "Entregue" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-[#212121]">{order.total}</td>
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
