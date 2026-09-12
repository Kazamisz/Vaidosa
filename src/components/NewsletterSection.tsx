import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';

export const NewsletterSection: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) return;

    triggerHapticFeedback([15, 30, 20]);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setPhone('');
    }, 600);
  };

  return (
    <section className="relative overflow-hidden bg-[#080307] py-14 sm:py-18 md:py-24 text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[620px] rounded-full bg-gradient-to-r from-fuchsia-900/25 via-rose-800/20 to-purple-900/20 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Glassmorphism Boutique Card */}
        <div className="sr-newsletter-card relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-stone-900/70 via-black/80 to-stone-950/90 p-8 sm:p-12 md:p-14 shadow-[0_32px_96px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          {/* Subtle light streak top border */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />

          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-rose-200 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(244,114,182,0.2)]">
              <span>Acesso Antecipado &amp; Novidades</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-[1.15]">
              Antecipe Lançamentos Exclusivos &amp; Curadorias
            </h2>

            <p className="mt-4 text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Receba avisos de reposição de peças cobiçadas, novos cortes sob medida e convites exclusivos via WhatsApp e SMS.
            </p>

            {isSubmitted ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-6 text-center backdrop-blur-md">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-bounce" />
                <h3 className="text-base font-semibold text-emerald-200">
                  Número cadastrado com elegância!
                </h3>
                <p className="text-xs text-stone-300 max-w-sm">
                  Em breve você receberá nossos avisos de lançamentos e novidades exclusivas diretamente no seu WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs text-rose-300 hover:text-rose-100 underline underline-offset-4 cursor-pointer"
                >
                  Cadastrar outro número
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 sm:mt-10">
                <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-lg mx-auto">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Digite seu número de WhatsApp..."
                      required
                      className="w-full rounded-full border border-white/20 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-stone-400 backdrop-blur-md outline-none transition-all duration-300 focus:border-rose-400 focus:bg-white/10 focus:ring-2 focus:ring-rose-400/20 shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200/30 bg-gradient-to-r from-[#b52d62] via-[#8f123f] to-[#4e051e] px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_8px_24px_rgba(121,9,49,.48)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#c93b70] hover:via-[#a51b4c] hover:to-[#630626] hover:shadow-[0_12px_32px_rgba(121,9,49,.54)] active:scale-95 disabled:opacity-70 cursor-pointer shrink-0"
                  >
                    <span>{isLoading ? 'Enviando...' : 'Cadastrar'}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                {/* Privacy micro-copy */}
                <p className="mt-4 text-[11px] text-stone-400">
                  Respeitamos sua privacidade: enviamos apenas lançamentos reais e curadorias selecionadas.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
