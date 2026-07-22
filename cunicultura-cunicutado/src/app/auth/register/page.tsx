"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock register
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🐰</span>
          <div>
            <span className="block font-poppins font-bold text-lg bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] bg-clip-text text-transparent">
              Cunicutado
            </span>
            <span className="block text-xs text-gray-500 -mt-1">Cunicultura</span>
          </div>
        </Link>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h1 className="font-poppins font-bold text-2xl text-[#212121] text-center mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Preencha seus dados para se cadastrar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-8888"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar senha *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-[#1B5E20] focus:ring-[#4CAF50]" />
              <span className="text-xs text-gray-500">
                Concordo com os{" "}
                <Link href="/termos" className="text-[#1B5E20] hover:underline">Termos de Uso</Link>
                {" "}e{" "}
                <Link href="/privacidade" className="text-[#1B5E20] hover:underline">Política de Privacidade</Link>.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-poppins font-semibold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Criar Conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Já tem conta?{" "}
              <Link href="/auth/login" className="text-[#1B5E20] font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
