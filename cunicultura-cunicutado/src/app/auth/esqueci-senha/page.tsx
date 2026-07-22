"use client";

import React from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🐰</span>
          <div>
            <span className="block font-poppins font-bold text-lg bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] bg-clip-text text-transparent">Cunicutado</span>
            <span className="block text-xs text-gray-500 -mt-1">Cunicultura</span>
          </div>
        </Link>
        <div className="bg-white rounded-2xl shadow-card p-8">
          <h1 className="font-poppins font-bold text-2xl text-[#212121] text-center mb-2">Recuperar Senha</h1>
          <p className="text-gray-500 text-sm text-center mb-6">Digite seu email e enviaremos instruções para redefinir sua senha.</p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" placeholder="seu@email.com" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-poppins font-semibold text-sm rounded-xl hover:shadow-lg transition-all">
              Enviar Instruções
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-[#1B5E20] font-semibold hover:underline">← Voltar ao Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
