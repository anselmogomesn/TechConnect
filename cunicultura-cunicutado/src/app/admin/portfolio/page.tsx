"use client";

import React from "react";
import Link from "next/link";
import { portfolioItems } from "@/data/portfolio";

export default function AdminPortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B5E20] text-white">
        <div className="container-site py-12">
          <Link href="/admin" className="text-sm text-[#A5D6A7] hover:text-white mb-2 inline-block">← Dashboard</Link>
          <div className="flex items-center justify-between">
            <h1 className="font-poppins font-bold text-2xl">Portfólio</h1>
            <button className="px-4 py-2 bg-white text-[#1B5E20] rounded-lg text-sm font-semibold">+ Novo Item</button>
          </div>
        </div>
      </div>
      <div className="container-site -mt-6 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-[#4CAF50] uppercase">{item.category}</span>
                <h3 className="font-poppins font-semibold text-[#212121] mt-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
