"use client";

import React from "react";
import Link from "next/link";

const stats = [
  { label: "Produtos", value: "47", icon: "📦", color: "from-blue-500 to-blue-600" },
  { label: "Pedidos", value: "156", icon: "📋", color: "from-green-500 to-green-600" },
  { label: "Clientes", value: "234", icon: "👥", color: "from-purple-500 to-purple-600" },
  { label: "Receita (mês)", value: "R$ 28.450", icon: "💰", color: "from-[#FF9800] to-[#F57C00]" },
];

const recentOrders = [
  { id: "#0001", client: "Carlos Silva", items: 2, total: "R$ 890,00", status: "Entregue", date: "10/03" },
  { id: "#0002", client: "Maria Santos", items: 1, total: "R$ 450,00", status: "A caminho", date: "09/03" },
  { id: "#0003", client: "João Oliveira", items: 3, total: "R$ 1.250,00", status: "Processando", date: "08/03" },
  { id: "#0004", client: "Ana Costa", items: 1, total: "R$ 320,00", status: "Pendente", date: "07/03" },
  { id: "#0005", client: "Pedro Souza", items: 2, total: "R$ 670,00", status: "Entregue", date: "06/03" },
];

const adminMenu = [
  { icon: "📦", label: "Produtos", href: "/admin/produtos", count: 47 },
  { icon: "📁", label: "Categorias", href: "/admin/categorias", count: 12 },
  { icon: "📋", label: "Pedidos", href: "/admin/pedidos", count: 156 },
  { icon: "👥", label: "Clientes", href: "/admin/clientes", count: 234 },
  { icon: "📊", label: "Estoque", href: "/admin/estoque" },
  { icon: "✍️", label: "Blog", href: "/admin/blog", count: 4 },
  { icon: "🖼️", label: "Portfólio", href: "/admin/portfolio", count: 7 },
  { icon: "📈", label: "Relatórios", href: "/admin/relatorios" },
  { icon: "💳", label: "Financeiro", href: "/admin/financeiro" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl">🐰</Link>
              <div>
                <h1 className="font-poppins font-bold text-lg">Admin</h1>
                <p className="text-xs text-[#A5D6A7]">Painel de Controle</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#A5D6A7]">Admin</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                  Hoje
                </span>
              </div>
              <p className="text-2xl font-poppins font-bold text-[#212121]">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu & Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Admin Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-poppins font-bold text-lg text-[#212121] mb-4">Gerenciar</h2>
              <div className="space-y-1">
                {adminMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    {"count" in item && item.count !== undefined && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-poppins font-bold text-lg text-[#212121]">Pedidos Recentes</h2>
                <Link href="/admin/pedidos" className="text-sm text-[#1B5E20] font-semibold hover:underline">
                  Ver Todos
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-gray-500 font-medium">Pedido</th>
                      <th className="text-left py-3 text-gray-500 font-medium">Cliente</th>
                      <th className="text-left py-3 text-gray-500 font-medium">Data</th>
                      <th className="text-left py-3 text-gray-500 font-medium">Status</th>
                      <th className="text-right py-3 text-gray-500 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-3 font-medium text-[#212121]">{order.id}</td>
                        <td className="py-3 text-gray-600">{order.client}</td>
                        <td className="py-3 text-gray-500">{order.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Entregue" ? "bg-green-100 text-green-700" :
                            order.status === "A caminho" ? "bg-blue-100 text-blue-700" :
                            order.status === "Processando" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-600"
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
      </div>
    </div>
  );
}
