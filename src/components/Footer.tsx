import React from 'react';
import { Instagram, MapPin, Clock, Phone, Sparkles, ArrowUpRight } from 'lucide-react';
import { COMPANY } from '../data/company';
import { PremiumWhatsAppIcon } from './PremiumWhatsAppIcon';

interface FooterProps {
  onOpenChat: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChat, onSelectCategory }) => {
  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 text-left border-t border-stone-800">
      {/* Massive High-Contrast Action CTA Chapter */}
      <div className="py-28 md:py-40 border-b border-stone-800/80 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-semibold tracking-[0.35em] uppercase text-fuchsia-300 mb-4 block drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
            Atendimento Direto &amp; Personalizado
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6 text-balance">
            Encontre a peça exata para vestir sua autenticidade.
          </h2>
          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Nossa equipe em Birigui tira suas dúvidas sobre tecidos, caimento e medidas em tempo real.
          </p>

          {/* Ultra High-Contrast Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href={COMPANY.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-2xl hover:scale-105 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <PremiumWhatsAppIcon size={20} className="w-5 h-5" glow />
              <span>Chamar no WhatsApp</span>
            </a>
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(217,70,239,0.45)] hover:shadow-[0_0_40px_rgba(217,70,239,0.7)] hover:scale-105 flex items-center justify-center space-x-2.5 cursor-pointer border border-fuchsia-400/40"
            >
              <img
                src="/images/icon-vaidosaAI-1.webp"
                alt="IA"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/60 shadow-[0_0_8px_rgba(217,70,239,0.8)]"
              />
              <span>Consultora com Inteligência Artificial</span>
            </button>
          </div>
        </div>

        {/* Ambient radial blur with pink/purple soft luminescence */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-gradient-to-r from-purple-900/30 via-fuchsia-900/35 to-pink-900/25 blur-[130px] -z-10 pointer-events-none" />
      </div>

      {/* Clean Architectural Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-stone-800/80">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <button
                onClick={() => scrollTo('inicio')}
                className="relative inline-block group text-left cursor-pointer bg-transparent border-0 p-0"
                title="Voltar ao Início"
              >
                {/* Luminous aura behind transparent logo */}
                <div className="absolute -inset-2 bg-gradient-to-r from-fuchsia-600/30 via-purple-600/25 to-pink-500/20 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <img
                  src="/images/logo.webp"
                  alt={COMPANY.nome}
                  className="h-9 sm:h-10 w-auto max-w-[195px] object-contain relative z-10 drop-shadow-[0_0_14px_rgba(217,70,239,0.6)] drop-shadow-[0_0_28px_rgba(168,85,247,0.35)] transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </button>
              <p className="text-xs font-semibold text-fuchsia-300 tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(217,70,239,0.35)]">
                Moda Plus Size • Birigui - SP
              </p>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed max-w-md font-light">
              Acervo selecionado com peças femininas até o tamanho 70 e masculinas até o 80. Modelagens pensadas para valorizar com conforto, presença e dignidade.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-stone-900 hover:bg-stone-800 text-fuchsia-300 hover:text-fuchsia-200 transition-colors border border-stone-800 shadow-[0_0_12px_rgba(217,70,239,0.2)]"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={COMPANY.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-stone-900 hover:bg-stone-800 text-emerald-400 transition-colors border border-stone-800 flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <PremiumWhatsAppIcon size={18} className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => scrollTo('inicio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('bento')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Arquitetura de Formas
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('curadoria')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curadoria de Estúdio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('catalogo')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vitrine Completa
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('loja')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Espaço Físico &amp; Provador
                </button>
              </li>
            </ul>
          </div>

          {/* Store Location & Hours (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
              Atendimento Presencial
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                <span>{COMPANY.endereco}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                <span>{COMPANY.horarios.dias}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-fuchsia-300 shrink-0 mt-0.5" />
                <span>{COMPANY.telefone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} {COMPANY.nome}. Todos os direitos reservados.</p>
          <p>Birigui - SP • Brasil</p>
        </div>
      </div>
    </footer>
  );
};
