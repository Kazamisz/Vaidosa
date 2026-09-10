import React, { useState } from 'react';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { COMPANY } from '../data/company';
import { PremiumWhatsAppIcon } from './PremiumWhatsAppIcon';

interface HeaderProps {
  onOpenChat: () => void;
  onSearchFocus: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenChat,
  onSearchFocus,
  cartCount,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all">
      {/* Floating Glass Pill Navigation Bar */}
      <div className="bg-stone-950/85 backdrop-blur-xl border border-stone-800/90 shadow-2xl rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Brand Logo with Luminescent Soft Glow */}
        <a href="#" className="flex items-center space-x-2 group relative py-0.5">
          <div className="relative flex items-center">
            {/* Ambient subtle pink/purple luminous backlight */}
            <div className="absolute -inset-2 bg-gradient-to-r from-fuchsia-600/20 via-purple-600/15 to-pink-500/15 rounded-full blur-sm opacity-40 group-hover:opacity-70 group-hover:blur-md transition-all duration-500 pointer-events-none" />
            <img
              src="/images/logo.webp"
              alt={COMPANY.nome}
              className="h-8 sm:h-9 w-auto max-w-[155px] sm:max-w-[185px] object-contain relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(217,70,239,0.35)] drop-shadow-[0_0_16px_rgba(168,85,247,0.2)]"
              loading="eager"
            />
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium uppercase tracking-widest text-white">
          <button
            onClick={() => scrollTo('inicio')}
            className="relative group/navpy text-white hover:text-fuchsia-200 hover:drop-shadow-[0_0_16px_rgba(217,70,239,0.9)] hover:drop-shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-pointer py-1"
          >
            Início
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all duration-300 ease-out group-hover/navpy:w-full shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          </button>
          <button
            onClick={() => scrollTo('bento')}
            className="relative group/navpy text-white hover:text-fuchsia-200 hover:drop-shadow-[0_0_16px_rgba(217,70,239,0.9)] hover:drop-shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-pointer py-1"
          >
            Formas
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all duration-300 ease-out group-hover/navpy:w-full shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          </button>
          <button
            onClick={() => scrollTo('curadoria')}
            className="relative group/navpy text-white hover:text-fuchsia-200 hover:drop-shadow-[0_0_16px_rgba(217,70,239,0.9)] hover:drop-shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-pointer py-1"
          >
            Curadoria
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all duration-300 ease-out group-hover/navpy:w-full shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          </button>
          <button
            onClick={() => scrollTo('catalogo')}
            className="relative group/navpy text-white hover:text-fuchsia-200 hover:drop-shadow-[0_0_16px_rgba(217,70,239,0.9)] hover:drop-shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-pointer py-1"
          >
            Catálogo
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all duration-300 ease-out group-hover/navpy:w-full shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          </button>
          <button
            onClick={() => scrollTo('loja')}
            className="relative group/navpy text-white hover:text-fuchsia-200 hover:drop-shadow-[0_0_16px_rgba(217,70,239,0.9)] hover:drop-shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-pointer py-1"
          >
            Espaço Físico
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all duration-300 ease-out group-hover/navpy:w-full shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Search */}
          <button
            onClick={onSearchFocus}
            className="p-2 sm:p-2.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Buscar no catálogo"
            aria-label="Buscar no catálogo"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Pill */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:p-2.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Ver sacola / carrinho de compras"
            aria-label="Ver sacola / carrinho de compras"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.8)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* WhatsApp Direct CTA with Premium Icon */}
          <a
            href={COMPANY.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] hover:shadow-[0_0_24px_rgba(16,185,129,0.6)] hover:scale-105 flex items-center space-x-1.5 border border-emerald-400/40"
            title="Conversar no WhatsApp"
          >
            <PremiumWhatsAppIcon size={16} className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-stone-950/95 backdrop-blur-2xl border border-stone-800 rounded-3xl p-5 shadow-2xl animate-fadeIn text-white">
          <nav className="flex flex-col space-y-3 text-sm font-medium tracking-wide">
            <button
              onClick={() => scrollTo('inicio')}
              className="text-left py-2 text-white hover:text-fuchsia-300 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('bento')}
              className="text-left py-2 text-white hover:text-fuchsia-300 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
            >
              Formas &amp; Caimento
            </button>
            <button
              onClick={() => scrollTo('curadoria')}
              className="text-left py-2 text-white hover:text-fuchsia-300 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
            >
              Curadoria de Estúdio
            </button>
            <button
              onClick={() => scrollTo('catalogo')}
              className="text-left py-2 text-white hover:text-fuchsia-300 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
            >
              Catálogo Geral
            </button>
            <button
              onClick={() => scrollTo('loja')}
              className="text-left py-2 text-white hover:text-fuchsia-300 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
            >
              Espaço Físico &amp; Localização
            </button>
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="flex items-center space-x-2 text-xs uppercase tracking-wider text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]"
              >
                <img
                  src="/images/icon-vaidosaAI-1.webp"
                  alt="Consultora IA"
                  className="w-5 h-5 rounded-full object-cover drop-shadow-[0_0_6px_rgba(217,70,239,0.7)]"
                />
                <span>Consultora Virtual IA</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

