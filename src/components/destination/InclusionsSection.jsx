import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function InclusionsSection({ inclusions, exclusions }) {
  if ((!inclusions || inclusions.length === 0) && (!exclusions || exclusions.length === 0)) {
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-light text-[#1A1A1A] mb-8">
        O que está incluído
      </h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inclusions */}
        {inclusions && inclusions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-green-50 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">Incluído no pacote</h3>
            </div>
            
            <div className="space-y-3">
              {inclusions.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-light">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Exclusions */}
        {exclusions && exclusions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                <X className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">Não incluído</h3>
            </div>
            
            <div className="space-y-3">
              {exclusions.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 font-light">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}