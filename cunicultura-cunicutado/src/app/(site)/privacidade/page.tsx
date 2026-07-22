"use client";

import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
          <div className="container-site py-20 md:py-28 text-center">
            <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">Política de Privacidade</h1>
            <p className="text-[#A5D6A7] text-lg">Última atualização: Julho 2026</p>
          </div>
        </div>
        <div className="container-site py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 shadow-card space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">1. Introdução</h2>
              <p>A Cunicultura Cunicutado valoriza a privacidade dos seus clientes e está comprometida em proteger os dados pessoais coletados durante a navegação em nosso site e utilização de nossos serviços.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">2. Dados Coletados</h2>
              <p>Coletamos informações como nome, email, telefone, endereço e dados de navegação quando você:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Realiza um cadastro em nossa plataforma</li>
                <li>Efetua uma compra</li>
                <li>Assina nossa newsletter</li>
                <li>Entra em contato através do formulário</li>
                <li>Navega em nosso site</li>
              </ul>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">3. Uso das Informações</h2>
              <p>Utilizamos seus dados para:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Processar e entregar seus pedidos</li>
                <li>Melhorar sua experiência de navegação</li>
                <li>Enviar comunicações sobre promoções e novidades</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">4. Proteção de Dados</h2>
              <p>Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">5. Seus Direitos (LGPD)</h2>
              <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão dos dados</li>
                <li>Revogar o consentimento a qualquer momento</li>
              </ul>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">6. Contato</h2>
              <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato através do email: privacidade@cuniculturacunicutado.com.br</p>
            </section>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
