import React, { lazy, Suspense } from 'react';
import { Clock, ExternalLink, MapPin, MessageCircle, Navigation } from 'lucide-react';
import { COMPANY } from '../data/company';
import { DeferredRender } from './DeferredRender';
import { triggerHapticFeedback } from '../utils/haptics';

const DarkVeil = lazy(() => import('./backgrounds/DarkVeil'));

export const StoreSection: React.FC = () => {
  return (
    <section id="loja" className="relative isolate overflow-hidden bg-[#080307] py-14 text-left text-white sm:py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 z-0">
        <DeferredRender order={4} className="absolute inset-0 canvas-seamless-mask" rootMargin="600px 0px">
          <Suspense fallback={null}>
            <DarkVeil
              hueShift={0}
              noiseIntensity={0.035}
              scanlineIntensity={0.04}
              scanlineFrequency={1.15}
              speed={0.32}
              warpAmount={0.16}
              resolutionScale={0.85}
            />
          </Suspense>
        </DeferredRender>
        {/* Soft luxury burgundy ambient glow that emerges without any hard edge */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(99,6,38,0.7)_0%,rgba(46,3,16,0.5)_55%,rgba(8,3,7,0.95)_100%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(71,4,27,.2)_40%,rgba(10,2,6,.65)_100%)]" aria-hidden="true" />
      {/* Seamless top and bottom feathering overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 md:h-72 bg-gradient-to-b from-[#080307] via-[#080307]/85 to-transparent z-[1]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 md:h-64 bg-gradient-to-t from-[#080307] via-[#080307]/85 to-transparent z-[1]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl 2xl:max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="sr-store-header mb-10 max-w-3xl sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">
            Espaço de atendimento e provador
          </span>
          <h2 className="mt-3 text-3xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl">
            Loja física em Birigui - SP
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-300 sm:text-base">
            Experimente as peças com privacidade, consultoria dedicada e provadores amplos.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-8">
          {/* Information Card - Balanced spacing without hollow gaps */}
          <div className="sr-store-card flex flex-col justify-between rounded-3xl border border-white/18 bg-black/65 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:col-span-5">
            <div className="space-y-5 sm:space-y-6">
              {/* Boutique Presence Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Atendimento Presencial Ativo</span>
              </div>

              {/* Location Block */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-300/35 bg-gradient-to-br from-rose-950/80 via-[#790931]/70 to-black/90 text-rose-100 backdrop-blur-xl shadow-[0_8px_30px_rgba(121,9,49,0.4)]">
                  <MapPin className="h-5 w-5 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-base">Localização</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-300">{COMPANY.endereco}</p>
                  <a
                    href={COMPANY.google_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerHapticFeedback(12)}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-300 transition-colors hover:text-rose-100"
                  >
                    Como chegar no Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Hours Block */}
              <div className="flex items-start gap-4 border-t border-white/10 pt-5 sm:pt-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 via-white/8 to-black/70 text-stone-100 backdrop-blur-xl shadow-[0_8px_30px_rgba(255,255,255,0.12)]">
                  <Clock className="h-5 w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Horário de funcionamento</h3>
                  <p className="mt-1 text-sm text-stone-200 font-medium">{COMPANY.horarios.dias}</p>
                  <p className="mt-0.5 text-xs text-stone-400">Domingos e feriados sob consulta prévia.</p>
                </div>
              </div>

              {/* In-Store Boutique Amenities & Highlights */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-stone-300 backdrop-blur-md space-y-2.5">
                <div className="flex items-center gap-2 text-rose-200 font-semibold uppercase tracking-wider text-[11px]">
                  <span>Comodidades da Loja Física</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span>Provadores amplos e privativos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span>Consultoria de estilo presencial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span>Estacionamento fácil na avenida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span>Peças femininas e masculinas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Button */}
            <div className="pt-6">
              <a
                href={COMPANY.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHapticFeedback(20)}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-950 transition-all hover:bg-stone-200 hover:scale-[1.01] active:scale-95 shadow-xl"
              >
                <MessageCircle className="h-4 w-4 text-[#790931]" />
                Conversar com a loja
              </a>
            </div>
          </div>

          <div className="sr-store-card flex flex-col justify-between gap-5 rounded-3xl border border-white/18 bg-black/65 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-200">
                    Google Maps • Local Oficial
                  </span>
                  <p className="text-xs text-stone-400">Av. Cidade Jardim, 1100 — Birigui, SP</p>
                </div>
              </div>

              <a
                href={COMPANY.google_maps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHapticFeedback(15)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-medium text-rose-200 backdrop-blur-md transition-colors hover:border-rose-300/60 hover:bg-rose-500/20 hover:text-white cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5 text-rose-300" />
                Abrir Rota
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            </div>

            <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-white/10 bg-stone-900 shadow-inner sm:h-[380px] lg:h-full lg:min-h-[460px]">
              <iframe
                title="Localização da Vaidosa Plus Size no Google Maps"
                src="https://maps.google.com/maps?q=Av.+Cidade+Jardim,+1100+-+Cidade+Jardim,+Birigui+-+SP,+16203-124&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full border-0 filter contrast-[1.03] brightness-[0.98]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
