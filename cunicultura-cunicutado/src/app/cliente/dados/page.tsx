"use client";

import React from "react";
import Link from "next/link";

export default function ClientDataPage() {
  const user = { name: "Cliente", email: "cliente@email.com", phone: "(11) 99999-8888" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
        <div className="container-site py-12">
          <Link href="/cliente" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Minha Conta</Link>
          <h1 className="font-poppins font-bold text-2xl">Dados Pessoais</h1>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 max-w-2xl">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
              <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
              <input type="tel" defaultValue={user.phone} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
            </div>
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-poppins font-bold text-[#212121] mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha atual</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova senha</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-poppins font-semibold text-sm rounded-xl hover:shadow-lg transition-all">
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
