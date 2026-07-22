"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-4">
      <div className="text-center">
        <span className="text-8xl block mb-4">🐰</span>
        <h1 className="font-poppins font-bold text-6xl text-[#1B5E20] mb-2">404</h1>
        <h2 className="font-poppins font-semibold text-2xl text-[#212121] mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          A página que você procura não existe, foi movida ou está indisponível.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary btn-lg">
            Página Inicial
          </Link>
          <Link href="/catalogo" className="btn btn-secondary btn-lg">
            Ver Coelhos
          </Link>
        </div>
      </div>
    </div>
  );
}
