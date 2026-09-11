import React from 'react';
import { Clock, ExternalLink, MapPin, MessageCircle } from 'lucide-react';
import { COMPANY } from '../data/company';
import DarkVeil from './backgrounds/DarkVeil';


const MAP_TILES = [36736, 36737, 36738].flatMap((y) =>
  [23605, 23606, 23607].map((x) => ({ x, y })),
);

export const StoreSection: React.FC = () => {
  return (
    <section id="loja" className="relative isolate overflow-hidden bg-[#2B0210] py-20 text-left text-white sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 z-0">
        <DarkVeil
          hueShift={-55}
          noiseIntensity={0.035}
          scanlineIntensity={0.04}
          scanlineFrequency={1.15}
          speed={0.32}
          warpAmount={0.16}
          resolutionScale={0.8}
        />
        <div className="absolute inset-0 bg-[#2B0210] mix-blend-color" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,3,7,.18),rgba(8,3,7,.62))]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl sm:mb-14">
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
          <div className="flex flex-col justify-between gap-7 rounded-3xl border border-white/12 bg-black/42 p-6 shadow-[0_24px_70px_rgba(0,0,0,.28)] backdrop-blur-xl sm:p-8 lg:col-span-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-200/20 bg-[#790931]/55 text-rose-100">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white">Localização</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-300">{COMPANY.endereco}</p>
                <a
                  href={COMPANY.google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-300 transition-colors hover:text-rose-100"
                >
                  Como chegar no Google Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-white/10 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-stone-200">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Horário de funcionamento</h3>
                <p className="mt-1 text-sm text-stone-300">{COMPANY.horarios.dias}</p>
                <p className="mt-1 text-xs text-stone-400">Domingos e feriados sob consulta.</p>
              </div>
            </div>

            <a
              href={COMPANY.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-950 transition-transform hover:scale-[1.01]"
            >
              <MessageCircle className="h-4 w-4 text-[#790931]" />
              Conversar com a loja
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/12 bg-white/95 p-2.5 shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-3 lg:col-span-7">
            <div className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-stone-200 sm:h-[460px] lg:h-full lg:min-h-[520px]">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 grid h-[768px] w-[768px] grid-cols-3 grid-rows-3"
                style={{ transform: 'translate(-404px, -347px)' }}
                aria-hidden="true"
              >
                {MAP_TILES.map(({ x, y }) => (
                  <img
                    key={`${x}-${y}`}
                    src={`https://tile.openstreetmap.org/16/${x}/${y}.png`}
                    alt=""
                    width="256"
                    height="256"
                    loading="lazy"
                    className="block h-64 w-64 max-w-none"
                  />
                ))}
              </div>

              <a
                href={COMPANY.google_maps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir a localização da Vaidosa Plus Size no Google Maps"
                className="absolute inset-0 z-10 cursor-pointer"
              />

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#790931] text-white shadow-[0_8px_28px_rgba(60,0,22,.38)]">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute bottom-2 right-2 z-20 rounded-md bg-white/90 px-2 py-1 text-[10px] text-stone-600 shadow-sm">
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-stone-950">© OpenStreetMap</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
