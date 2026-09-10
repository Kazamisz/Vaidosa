import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InfiniteMarquee } from './components/InfiniteMarquee';
import { GaplessBento } from './components/GaplessBento';
import { HorizontalAccordion } from './components/HorizontalAccordion';
import { TextScrubSection } from './components/TextScrubSection';
import { CuratedLooks } from './components/CuratedLooks';
import { CatalogSection } from './components/CatalogSection';
import { StoreSection } from './components/StoreSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { PremiumWhatsAppIcon } from './components/PremiumWhatsAppIcon';
import { PremiumCursor } from './components/PremiumCursor';
import Lenis from 'lenis';
import { Produto, CartItem } from './types';
import productsData from './data/products.json';
import { COMPANY } from './data/company';

export default function App() {
  const products: Produto[] = productsData as Produto[];
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  // Shopping Cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vaidosa_cart');
      if (saved) {
        return JSON.parse(saved);
      }
      // Migration check from older favorites
      const oldFavs = localStorage.getItem('vaidosa_favorites');
      if (oldFavs) {
        const parsed = JSON.parse(oldFavs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((id: string) => ({ id, quantity: 1 }));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vaidosa_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Falha ao salvar carrinho no localStorage', e);
    }
  }, [cart]);

  // Deep linking via window.location.hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('produto_')) {
        const id = hash.replace('produto_', '');
        const match = products.find(p => p.id === id);
        if (match) {
          setSelectedProduct(match);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  // Lenis Smooth Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleSelectProduct = (product: Produto) => {
    setSelectedProduct(product);
    window.history.replaceState(null, '', `#produto_${product.id}`);
  };

  const handleSelectProductById = (id: string) => {
    const target = products.find(p => p.id === id) || products[0];
    if (target) {
      handleSelectProduct(target);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#produto_')) {
      window.history.replaceState(null, '', ' ');
    }
  };

  const handleToggleCart = (id: string) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === id);
      if (exists) {
        return prev.filter(item => item.id !== id);
      } else {
        return [...prev, { id, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => Boolean(item));
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSearchFocus = () => {
    const catalogElem = document.getElementById('catalogo');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 500);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const catalogElem = document.getElementById('catalogo');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenFeatured = (productId?: string) => {
    const targetId = productId || 'projeto_drbtklvdnxo';
    const featured = products.find(p => p.id === targetId) || products[0];
    if (featured) {
      handleSelectProduct(featured);
    }
  };

  const handleExploreCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-fuchsia-600 selection:text-white flex flex-col relative">
      {/* Editorial Boutique Custom Cursor */}
      <PremiumCursor />

      {/* Floating Glass Pill Navigation Bar */}
      <Header
        onOpenChat={() => setIsChatOpen(true)}
        onSearchFocus={handleSearchFocus}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Container with overflow-x-hidden to prevent horizontal scroll bugs */}
      <main className="overflow-x-hidden w-full max-w-full flex-grow">
        {/* ATTENTION: Cinematic Center Hero */}
        <Hero
          onExploreCatalog={handleExploreCatalog}
          onOpenFeatured={handleOpenFeatured}
        />

        {/* Continuous Infinite Editorial Marquee */}
        <InfiniteMarquee />

        {/* INTEREST: Gapless Bento Grid */}
        <GaplessBento
          products={products}
          onSelectProduct={handleSelectProduct}
          onExploreCatalog={handleExploreCatalog}
        />

        {/* COMPONENT ARSENAL: Horizontal Accordions */}
        <HorizontalAccordion
          onSelectProductById={handleSelectProductById}
          onExploreCatalog={handleExploreCatalog}
        />

        {/* DESIRE: Scrubbing Text Reveal with Inline Typography Images */}
        <TextScrubSection />

        {/* DESIRE: Curated Looks with GSAP Scroll Image Scale & Fade */}
        <CuratedLooks
          products={products}
          onSelectProduct={handleSelectProduct}
          cart={cart}
          onToggleCart={handleToggleCart}
        />

        {/* FULL CATALOG SECTION: Dense Vitrine with Search & Filters */}
        <CatalogSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          onSelectProduct={handleSelectProduct}
          cart={cart}
          onToggleCart={handleToggleCart}
          searchInputRef={searchInputRef}
        />

        {/* PHYSICAL STORE: Architectural Location Chapter */}
        <StoreSection />
      </main>

      {/* ACTION: High-Contrast CTA Chapter and Clean Architectural Footer */}
      <Footer
        onOpenChat={() => setIsChatOpen(true)}
        onSelectCategory={handleCategorySelect}
      />

      {/* Product Details Modal with Gallery */}
      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        isInCart={selectedProduct ? cart.some(item => item.id === selectedProduct.id) : false}
        onToggleCart={handleToggleCart}
      />

      {/* AI Fashion Consultant Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Shopping Cart Drawer */}
      <FavoritesDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        onSelectProduct={handleSelectProduct}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Floating Action Buttons Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3.5">
        {/* WhatsApp Direct Floating Trigger (Left) - Very subtle, discreet pulse */}
        <a
          href={COMPANY.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_4px_18px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Falar no WhatsApp da Loja"
          aria-label="Falar no WhatsApp da Loja"
        >
          {/* Considerably reduced, soft ambient pulse */}
          <span className="absolute inset-0 rounded-full bg-emerald-400/10 animate-pulse [animation-duration:5s] pointer-events-none" />
          <PremiumWhatsAppIcon size={28} className="w-7 h-7 relative z-10 text-white" glow={false} />
        </a>

        {/* AI Consultant Floating Trigger (Right) - Sized to visually match WhatsApp circle */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
          title="Abrir Consultora Virtual IA"
          aria-label="Abrir Consultora Virtual IA"
        >
          {/* Ambient Luminescence Glow Aura */}
          <div className="absolute inset-0 rounded-full bg-fuchsia-600/35 blur-md group-hover:bg-fuchsia-500/55 group-hover:blur-lg transition-all duration-300 pointer-events-none" />
          <img
            src="/images/icon-vaidosaAI-1.webp"
            alt="Consultora IA"
            className="w-full h-full scale-110 rounded-full object-contain relative z-10 drop-shadow-[0_0_12px_rgba(217,70,239,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(217,70,239,0.95)] transition-all duration-300"
          />
        </button>
      </div>
    </div>
  );
}

