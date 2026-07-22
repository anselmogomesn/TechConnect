"use client";

import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function ExchangesPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
          <div className="container-site py-20 md:py-28 text-center">
            <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">Trocas e Devoluções</h1>
            <p className="text-[#A5D6A7] text-lg">Política de garantia e satisfação</p>
          </div>
        </div>
        <div className="container-site py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 shadow-card space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">1. Garantia Sanitária</h2>
              <p>Todos os animais comercializados pela Cunicultura Cunicutado possuem garantia sanitária conforme especificado na ficha do produto. O prazo de garantia varia de 30 a 90 dias dependendo da categoria do animal.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">2. Condições para Troca</h2>
              <p>Para solicitar troca ou devolução, o cliente deve:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Comunicar a Cunicutado em até 7 dias corridos do recebimento</li>
                <li>Apresentar laudo veterinário em caso de problema sanitário</li>
                <li>Manter o animal nas condições originais de recebimento</li>
              </ul>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">3. Produtos</h2>
              <p>Para produtos (rações, acessórios, etc.), o prazo de desistência é de 7 dias após o recebimento, conforme CDC. O produto deve estar em sua embalagem original, sem sinais de uso.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">4. Reembolso</h2>
              <p>O reembolso será processado em até 15 dias úteis após o recebimento e conferência do item devolvido, utilizando o mesmo método de pagamento da compra.</p>
            </section>
            <section>
              <h2 className="font-poppins font-bold text-xl text-[#212121] mb-3">5. Exceções</h2>
              <p>Não aceitamos devoluções de animais após 7 dias do recebimento, exceto em casos de garantia sanitária contratada. Produtos personalizados ou sob encomenda não podem ser devolvidos.</p>
            </section>
            <div className="bg-orange-50 rounded-xl p-5 border border-orange-200 mt-6">
              <p className="text-sm text-orange-800">
                <strong>📞 Para solicitar troca ou devolução:</strong> Entre em contato pelo WhatsApp (11) 99999-8888 ou email contato@cuniculturacunicutado.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
