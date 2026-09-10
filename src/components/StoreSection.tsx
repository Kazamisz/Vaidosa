import React from 'react';
import { MapPin, Clock, Phone, AlertCircle, ExternalLink, MessageCircle } from 'lucide-react';
import { COMPANY } from '../data/company';

export const StoreSection: React.FC = () => {
  return (
    <section id="loja" className="py-32 md:py-48 bg-[#FAF8F5] border-t border-stone-200/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-fuchsia-700">
            Espaço de Atendimento &amp; Provador
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-stone-900 mt-3 leading-[1.15]">
            Loja Física em Birigui - SP
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-4 font-light leading-relaxed">
            Experimente as peças com privacidade, consultoria dedicada e provadores amplos pensados para o seu bem-estar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Information Column (5 cols) */}
          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-lg space-y-8">
            
            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="p-3.5 rounded-2xl bg-fuchsia-50/80 text-fuchsia-700 shrink-0 border border-fuchsia-100 shadow-[0_0_12px_rgba(217,70,239,0.15)]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-stone-900">Localização</h3>
                <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                  {COMPANY.endereco}
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  <a
                    href={COMPANY.google_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold tracking-wider uppercase text-fuchsia-700 hover:text-purple-800 hover:underline"
                  >
                    <span>Como chegar no Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Address Divergence Disclaimer Notice */}
            <div className="p-4.5 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-xs text-amber-900 flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="font-semibold">Orientação sobre o número:</strong> {COMPANY.endereco_observacao}
              </p>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start space-x-4 pt-4 border-t border-stone-100">
              <div className="p-3.5 rounded-2xl bg-stone-100 text-stone-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-stone-900">Horário de Funcionamento</h3>
                <p className="text-sm text-stone-600 mt-1">
                  {COMPANY.horarios.dias}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Domingos e feriados sob consulta.
                </p>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-4 border-t border-stone-100">
              <a
                href={COMPANY.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2.5 py-3.5 px-6 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer border border-stone-800 hover:border-fuchsia-500/40"
              >
                <MessageCircle className="w-4 h-4 text-fuchsia-300 drop-shadow-[0_0_6px_rgba(217,70,239,0.7)]" />
                <span>Conversar com a Loja</span>
              </a>
            </div>
          </div>

          {/* Map Embed Column (7 cols) */}
          <div className="lg:col-span-7 bg-white p-3 sm:p-4 rounded-3xl border border-stone-200/90 shadow-lg overflow-hidden">
            <div className="aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-stone-100 relative">
              <iframe
                title="Mapa de localização da loja Vaidosa Plus Size em Birigui"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.4851239121894!2d-50.34586322384022!3d-21.390456184852957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x949643c16a695d53%3A0x6b4457788448f7ee!2sAv.%20Cidade%20Jardim%2C%201100%20-%20Birigui%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
