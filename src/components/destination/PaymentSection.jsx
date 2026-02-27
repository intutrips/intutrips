import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Calendar, Shield } from 'lucide-react';
import { formatCurrency } from '@/utils';


export default function PaymentSection({ price_from, payment_options }) {
  const defaultPaymentOptions = [
    "PIX",
    "Boleto Parcelado Sem Juros",
    "Cartão de Crédito (4,7% de taxas se aplicam)",
    "Pagamento fragmentado (30% de entrada + valor final 30 dias antes do embarque)"
  ];

  const parsed = (() => {
    if (!payment_options) return [];
    if (typeof payment_options === 'string') {
      try { return JSON.parse(payment_options); } catch { return payment_options.split('\n'); }
    }
    return Array.isArray(payment_options) ? payment_options : [];
  })();
  const filtered = parsed.filter(o => typeof o === 'string' && o.trim().length > 0);
  const options = filtered.length > 0 ? filtered : defaultPaymentOptions;

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-light text-[#3C3333] mb-8 flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-[#6b9faf]" />
        Valores e Pagamento
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Price Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#92314D] to-[#6b9faf] text-white rounded-2xl p-8"
        >
          <DollarSign className="h-10 w-10 text-[#6b9faf] mb-4" />
          <span className="text-white/70 text-sm">Valor por pessoa</span>
          <div className="text-5xl font-light my-4">
            USD {formatCurrency(price_from)}

          </div>
          <p className="text-white/60 text-sm font-light leading-relaxed">
            *Valores expressos em dólares americanos (USD).
            Entre em contato para consultar as melhores condições de reserva.
          </p>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Shield className="h-4 w-4 text-[#6b9faf]" />
              <span>Pagamento 100% seguro</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm"
        >
          <h3 className="text-lg font-medium text-[#3C3333] mb-6">
            Formas de pagamento
          </h3>

          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-[#f8eee5] rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#6b9faf]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#6b9faf]" />
                </div>
                <span className="text-gray-700 font-light">{option}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 text-[#6b9faf] flex-shrink-0 mt-0.5" />
              <span className="font-light">
                Reserve sua vaga com antecedência e garanta as melhores condições de pagamento.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}