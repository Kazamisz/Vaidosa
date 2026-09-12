import React, { lazy, Suspense } from 'react';
import { Instagram, MapPin, Clock, Phone, Sparkles, ArrowUpRight } from 'lucide-react';
import { COMPANY } from '../data/company';
import { PremiumWhatsAppIcon } from './PremiumWhatsAppIcon';
import { DeferredRender } from './DeferredRender';
import { motion } from 'motion/react';
import { triggerHapticFeedback } from '../utils/haptics';

const DarkVeil = lazy(() => import('./backgrounds/DarkVeil'));

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
    <footer className="relative isolate overflow-hidden bg-[linear-gradient(145deg,#080307_0%,#260611_46%,#47041B_100%)] text-left text-stone-300 border-t border-rose-900/15">
      <DeferredRender order={5} className="pointer-events-none absolute inset-0 z-0 canvas-mask-top" rootMargin="600px 0px">
        <div className="absolute inset-0" style={{ transform: 'scaleY(-1)' }} aria-hidden="true">
          <Suspense fallback={<div className="darkveil-fallback" />}>
            <DarkVeil
              hueShift={0}
              noiseIntensity={0.035}
              scanlineIntensity={0.04}
              scanlineFrequency={1.15}
              speed={0.32}
              warpAmount={0.16}
              resolutionScale={0.85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#090205]/75 via-transparent to-[#090205]/80" />
          </Suspense>
        </div>
      </DeferredRender>
      {/* Top seamless blend from store section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 md:h-48 bg-gradient-to-b from-[#080307] via-[#080307]/75 to-transparent z-[2]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at 14% 4%, rgba(239, 135, 170, 0.20), transparent 34%), radial-gradient(ellipse at 88% 76%, rgba(169, 41, 90, 0.26), transparent 38%), linear-gradient(118deg, rgba(9, 2, 5, 0.46) 0%, rgba(71, 4, 27, 0.08) 48%, rgba(9, 2, 5, 0.62) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(115deg,transparent_20%,rgba(246,202,217,0.08)_48%,transparent_72%)]"
        aria-hidden="true"
      />
      {/* Massive High-Contrast Action CTA Chapter */}
      <div className="relative overflow-hidden border-b border-rose-900/30 py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-semibold tracking-[0.35em] uppercase text-fuchsia-300 mb-4 block drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]"
          >
            Atendimento Direto &amp; Personalizado
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6 text-balance"
          >
            Encontre a peça exata para vestir sua autenticidade.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            Nossa equipe em Birigui tira suas dúvidas sobre tecidos, caimento e medidas em tempo real.
          </motion.p>

          {/* Ultra High-Contrast Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-5 lg:flex-row"
          >
            <a
              href={COMPANY.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHapticFeedback(20)}
              className="group relative w-full px-10 py-4.5 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_24px_rgba(37,211,102,0.38)] hover:shadow-[0_0_36px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer lg:flex-1"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md group-hover:bg-emerald-400/35 transition-all pointer-events-none" />
              <PremiumWhatsAppIcon size={20} className="w-5 h-5 relative z-10 text-[#128C7E] drop-shadow-[0_0_8px_rgba(37,211,102,0.8)]" glow />
              <span className="relative z-10">Chamar no WhatsApp</span>
            </a>
            <button
              onClick={() => {
                triggerHapticFeedback(15);
                onOpenChat();
              }}
              className="w-full px-10 py-4.5 rounded-full bg-gradient-to-r from-[#b52d62] via-[#8f123f] to-[#4e051e] hover:from-[#c93b70] hover:via-[#a51b4c] hover:to-[#630626] text-white font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_26px_rgba(121,9,49,0.46)] hover:shadow-[0_0_34px_rgba(169,41,90,0.58)] hover:scale-105 active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer border border-rose-200/30 lg:flex-1"
            >
              <img
                src="/images/icon-vaidosaAI-1-96.webp"
                alt="IA"
                className="h-5 w-5 rounded-full object-cover ring-1 ring-white/60 shadow-[0_0_8px_rgba(169,41,90,0.62)]"
              />
              <span>Consultora com Inteligência Artificial</span>
            </button>
          </motion.div>
        </div>

      </div>

      {/* Clean Architectural Footer Navigation */}
      <div className="relative z-10 w-full border-t border-rose-500/25 bg-gradient-to-r from-[#120208] via-[#350718] to-[#120208]">
        {/* Subtle luminous accent hairline on top */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent pointer-events-none" />
        {/* Subtle radial luminescence */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,70,239,0.12),transparent_75%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand Info (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-3">
              <button
                onClick={() => scrollTo('inicio')}
                className="relative inline-block group text-left cursor-pointer bg-transparent border-0 p-0"
                title="Voltar ao Início"
              >
                {/* Luminous aura behind transparent logo */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#790931]/20 via-[#a9295a]/18 to-[#d45a87]/14 rounded-2xl blur-md opacity-45 group-hover:opacity-65 transition-opacity duration-500 pointer-events-none" />
                <img
                  src="/images/logo-256.webp"
                  alt={COMPANY.nome}
                  className="h-9 sm:h-10 w-auto max-w-[195px] object-contain relative z-10 drop-shadow-[0_0_8px_rgba(169,41,90,0.36)] drop-shadow-[0_0_16px_rgba(121,9,49,0.18)] transition-transform duration-300 group-hover:scale-105"
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
                onClick={() => triggerHapticFeedback(15)}
                className="group relative p-3 rounded-full bg-stone-900 hover:bg-stone-800 text-emerald-400 hover:text-emerald-300 transition-all border border-emerald-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(37,211,102,0.4)] hover:shadow-[0_0_24px_rgba(37,211,102,0.75)] hover:scale-105"
                aria-label="WhatsApp"
              >
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-sm group-hover:bg-emerald-500/40 transition-opacity pointer-events-none" />
                <PremiumWhatsAppIcon size={18} className="w-4 h-4 relative z-10 drop-shadow-[0_0_6px_rgba(37,211,102,0.8)]" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 space-y-4"
          >
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
          </motion.div>

          {/* Store Location & Hours (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-4"
          >
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
          </motion.div>
        </div>
      </div>
      </div>

      {/* Premium Bottom Footer Bar - Exclusively styled with refined luxury gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full border-t border-rose-500/25 bg-gradient-to-r from-[#120208] via-[#350718] to-[#120208] shadow-[0_-8px_32px_rgba(0,0,0,0.6)]"
      >
        {/* Subtle luminous accent hairline on top */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent pointer-events-none" />
        {/* Subtle radial luminescence */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,70,239,0.12),transparent_75%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-300 gap-4">
          <p className="font-light tracking-wide text-center sm:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="font-medium text-white drop-shadow-[0_0_8px_rgba(244,114,182,0.35)]">
              {COMPANY.nome}
            </span>
            . Todos os direitos reservados.
          </p>
          <p className="text-stone-300/90 tracking-wider flex items-center justify-center gap-2 font-medium">
            <span>Birigui – SP</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,114,182,0.8)]" />
            <span className="text-rose-200">Brasil</span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

