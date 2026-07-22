"use client";

import React, { useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");

  const categories = ["todos", ...new Set(blogPosts.map((p) => p.category))];

  const filtered = blogPosts.filter((post) => {
    const matchCategory = activeCategory === "todos" || post.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
        <div className="container-site text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-4">
            BLOG
          </span>
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">
            Blog da Cunicutado
          </h1>
          <p className="text-[#A5D6A7] text-lg max-w-2xl mx-auto">
            Dicas, tutoriais e novidades sobre o mundo da cunicultura.
          </p>
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artigos..."
                className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="container-site">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#1B5E20] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat === "todos" ? "Todos" : cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center overflow-hidden">
                    <span className="text-5xl transition-transform duration-500 group-hover:scale-110">📝</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="px-2 py-1 bg-green-50 text-[#4CAF50] rounded font-medium">
                        {post.category}
                      </span>
                      <span>{post.readTime} de leitura</span>
                    </div>
                    <h3 className="font-poppins font-bold text-lg text-[#212121] mb-2 group-hover:text-[#1B5E20] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-xs font-bold">
                          {post.author.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700">{post.author}</p>
                          <p className="text-xs text-gray-400">{formatDate(post.date)}</p>
                        </div>
                      </div>
                      <span className="text-[#1B5E20] group-hover:translate-x-1 transition-transform">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">📝</span>
              <h3 className="font-poppins font-bold text-xl text-gray-400 mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-gray-400">Tente buscar por outro termo ou categoria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
