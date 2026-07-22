"use client";

import React from "react";
import Link from "next/link";

const addresses = [
  { id: 1, label: "Casa", street: "Rua das Flores", number: "123", complement: "", neighborhood: "Centro", city: "São Paulo", state: "SP", zip: "01000-000", default: true },
  { id: 2, label: "Trabalho", street: "Av. Paulista", number: "1000", complement: "Sala 501", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", zip: "01310-100", default: false },
];

export default function ClientAddressesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
        <div className="container-site py-12">
          <Link href="/cliente" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Minha Conta</Link>
          <div className="flex items-center justify-between">
            <h1 className="font-poppins font-bold text-2xl">Endereços</h1>
            <button className="px-4 py-2 bg-white text-[#1B5E20] rounded-lg text-sm font-semibold">+ Novo</button>
          </div>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl shadow-card p-6 relative">
              {addr.default && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#1B5E20] text-white text-xs rounded-full">Principal</span>
              )}
              <h3 className="font-poppins font-semibold text-[#212121] mb-1">{addr.label}</h3>
              <p className="text-sm text-gray-600">
                {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ""}
              </p>
              <p className="text-sm text-gray-600">{addr.neighborhood} - {addr.city}/{addr.state}</p>
              <p className="text-sm text-gray-500">{addr.zip}</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-[#1B5E20] font-medium hover:underline">Editar</button>
                <button className="text-sm text-red-500 font-medium hover:underline">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
