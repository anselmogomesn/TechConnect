"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
        <div className="container-site text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-4">
            CONTATO
          </span>
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">
            Fale Conosco
          </h1>
          <p className="text-[#A5D6A7] text-lg max-w-2xl mx-auto">
            Estamos prontos para atender você. Entre em contato!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-poppins font-bold text-2xl text-[#212121] mb-6">
                Informações de Contato
              </h2>

              <div className="space-y-6">
                {/* WhatsApp */}
                <div className="flex items-start gap-4 p-5 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-[#212121]">WhatsApp</h3>
                    <p className="text-sm text-gray-500 mt-1">Atendimento rápido e personalizado</p>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#25D366] hover:underline mt-2"
                    >
                      {siteConfig.phone}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#1B5E20] flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-[#212121]">Email</h3>
                    <p className="text-sm text-gray-500 mt-1">Respondemos em até 24h úteis</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-sm font-semibold text-[#1B5E20] hover:underline mt-2 block">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#8D6E63] flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-[#212121]">Endereço</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {siteConfig.address.street}, {siteConfig.address.number}
                    </p>
                    <p className="text-sm text-gray-500">
                      {siteConfig.address.neighborhood} - {siteConfig.address.city}/{siteConfig.address.state}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#FF9800] flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-[#212121]">Horário de Atendimento</h3>
                    <p className="text-sm text-gray-500 mt-1">{siteConfig.businessHours.weekdays}</p>
                    <p className="text-sm text-gray-500">{siteConfig.businessHours.saturday}</p>
                    <p className="text-sm text-gray-500">{siteConfig.businessHours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-poppins font-bold text-2xl text-[#212121] mb-6">
                Envie sua Mensagem
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-scaleIn">
                  <span className="text-4xl block mb-3">✅</span>
                  <h3 className="font-poppins font-bold text-lg text-green-800 mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-green-600 text-sm">
                    Recebemos sua mensagem e responderemos em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nome *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(11) 99999-8888"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Assunto *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      >
                        <option value="">Selecione...</option>
                        <option value="compras">Compras</option>
                        <option value="servicos">Serviços</option>
                        <option value="suporte">Suporte</option>
                        <option value="orcamento">Orçamento</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mensagem *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-poppins font-semibold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-3">📍</span>
          <p className="text-gray-500 font-inter">
            Mapa interativo será carregado aqui
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {siteConfig.address.street}, {siteConfig.address.number} - {siteConfig.address.city}/{siteConfig.address.state}
          </p>
        </div>
      </section>
    </div>
  );
}
