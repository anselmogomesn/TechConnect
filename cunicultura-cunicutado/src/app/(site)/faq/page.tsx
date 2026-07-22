"use client";

import React, { useState } from "react";
import { faqCategories } from "@/data/site";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const currentCategory = faqCategories.find((c) => c.id === activeCategory);
  const filteredQuestions = currentCategory?.questions.filter(
    (q) =>
      !searchQuery ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
        <div className="container-site text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-4">
            FAQ
          </span>
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-[#A5D6A7] text-lg max-w-2xl mx-auto">
            Tire suas dúvidas sobre cunicultura, produtos e serviços.
          </p>
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar perguntas..."
                className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Sidebar */}
            <div className="lg:w-64 shrink-0">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? "bg-[#1B5E20] text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="flex-1">
              {currentCategory && (
                <h2 className="font-poppins font-bold text-2xl text-[#212121] mb-6 flex items-center gap-2">
                  <span>{currentCategory.icon}</span>
                  {currentCategory.title}
                </h2>
              )}

              {filteredQuestions && filteredQuestions.length > 0 ? (
                <div className="space-y-3">
                  {filteredQuestions.map((q) => {
                    const isOpen = openItems.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-300"
                      >
                        <button
                          onClick={() => toggleItem(q.id)}
                          className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                        >
                          <span className="font-poppins font-medium text-[#212121] text-sm md:text-base flex-1">
                            {q.question}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 animate-fadeIn">
                            <div className="h-px bg-gray-100 mb-4" />
                            <p className="text-gray-600 text-sm leading-relaxed">{q.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-3">🔍</span>
                  <p className="text-gray-400">Nenhuma pergunta encontrada para esta pesquisa.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
