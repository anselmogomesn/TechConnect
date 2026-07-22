"use client";

import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
          <div className="container-site py-20 md:py-28 text-center">
            <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">Termos de Uso</h1>
            <p className="text-[#A5D6A7] text-lg">Última atualização: Julho 2026</p>
          </div>
        </div>
        <div className="container-site py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 shadow-card space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">1. Aceitação dos Termos</h2>
              <p>Ao acessar e utilizar o site da Cunicultura Cunicutado, você concorda com os termos e condições descritos neste documento. Se não concordar, por favor, não utilize nossos serviços.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">2. Produtos e Serviços</h2>
              <p>A Cunicultura Cunicutado comercializa coelhos vivos, produtos e serviços relacionados à cunicultura. As características, preços e disponibilidade dos produtos estão sujeitos a alterações sem aviso prévio.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">3. Compras e Pagamentos</h2>
              <p>Os pedidos estão sujeitos à confirmação de pagamento. Reservamo-nos o direito de cancelar pedidos que apresentem inconsistências nos dados cadastrais ou suspeita de fraude.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">4. Entrega de Animais</h2>
              <p>O transporte de animais vivos segue regulamentações específicas de bem-estar animal. A Cunicutado se responsabiliza pela saúde dos animais até o momento da entrega, mediante cumprimento das orientações de recebimento.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">5. Propriedade Intelectual</h2>
              <p>Todo o conteúdo do site, incluindo textos, imagens, logos e design, é propriedade da Cunicultura Cunicutado, sendo proibida a reprodução sem autorização.</p>
            </section>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
