import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
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
import { PremiumWhatsAppIcon } from './components/PremiumWhatsAppIcon';
import { PremiumCursor } from './components/PremiumCursor';
import { DeferredRender } from './components/DeferredRender';
import { FpsMonitor } from './components/FpsMonitor';
import Lenis from 'lenis';
import { Produto, CartItem } from './types';
import { COMPANY } from './data/company';
import { ANIMATION_FRAME_INTERVAL } from './utils/animation';

const GhostFibers = lazy(() => import('./components/GhostFibers'));
const ProductModal = lazy(() => import('./components/ProductModal').then(module => ({ default: module.ProductModal })));
const ChatbotDrawer = lazy(() => import('./components/ChatbotDrawer').then(module => ({ default: module.ChatbotDrawer })));
const FavoritesDrawer = lazy(() => import('./components/FavoritesDrawer').then(module => ({ default: module.FavoritesDrawer })));

export default function App() {
  const [products, setProducts] = useState<Produto[]>([]);
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
  const [hasOpenedChat, setHasOpenedChat] = useState(false);
  const [hasOpenedCart, setHasOpenedCart] = useState(false);

  useEffect(() => {
    let active = true;
    import('./data/products.json').then(module => {
      if (active) setProducts(module.default as Produto[]);
    });
    return () => {
      active = false;
    };
  }, []);

  const openChat = () => {
    setHasOpenedChat(true);
    setIsChatOpen(true);
  };
  const openCart = () => {
    setHasOpenedCart(true);
    setIsCartOpen(true);
  };
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

  const handleAddToCart = (id: string) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === id);
      if (exists) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
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
        onOpenChat={openChat}
        onSearchFocus={handleSearchFocus}
        cartCount={totalCartCount}
        onOpenCart={openCart}
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

        <div className="section-fusion relative isolate overflow-hidden bg-[#080307]">
          <DeferredRender className="absolute inset-0" rootMargin="0px">
            <Suspense fallback={null}>
              <GhostFibers
                lineColor="#790931"
                glowColor="#a21548"
                speed={0.15}
                scale={2.2}
                brightness={1.8}
                blueBoost={1.1}
                layers={3}
                dpr={1}
                fps={30}
              />
            </Suspense>
          </DeferredRender>

          {/* COMPONENT ARSENAL: Horizontal Accordions */}
          <HorizontalAccordion
            products={products}
            onSelectProductById={handleSelectProductById}
            onExploreCatalog={handleExploreCatalog}
          />

          {/* DESIRE: Scrubbing Text Reveal with Inline Typography Images */}
          <TextScrubSection />
        </div>

        {/* DESIRE: Curated Looks with GSAP Scroll Image Scale & Fade */}
        <CuratedLooks
          products={products}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
        />

        {/* FULL CATALOG SECTION: Dense Vitrine with Search & Filters */}
        <CatalogSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          searchInputRef={searchInputRef}
        />

        {/* PHYSICAL STORE: Architectural Location Chapter */}
        <StoreSection />
      </main>

      {/* ACTION: High-Contrast CTA Chapter and Clean Architectural Footer */}
      <Footer
        onOpenChat={openChat}
        onSelectCategory={handleCategorySelect}
      />

      {/* Product Details Modal with Gallery */}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductModal product={selectedProduct} onClose={handleCloseModal} onAddToCart={handleAddToCart} />
        </Suspense>
      )}

      {/* AI Fashion Consultant Drawer */}
      {hasOpenedChat && (
        <Suspense fallback={null}>
          <ChatbotDrawer
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        </Suspense>
      )}

      {/* Shopping Cart Drawer */}
      {hasOpenedCart && (
        <Suspense fallback={null}>
          <FavoritesDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            products={products}
            onSelectProduct={handleSelectProduct}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
          />
        </Suspense>
      )}

      {/* Floating Action Buttons Bottom Right */}
      <div className="fixed bottom-3 right-3 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6 sm:gap-3.5">
        {/* WhatsApp Direct Floating Trigger (Left) - Very subtle, discreet pulse */}
        <a
          href={COMPANY.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_18px_rgba(37,211,102,0.3)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-[0_6px_24px_rgba(37,211,102,0.45)] active:scale-95 sm:h-14 sm:w-14"
          title="Falar no WhatsApp da Loja"
          aria-label="Falar no WhatsApp da Loja"
        >
          {/* Considerably reduced, soft ambient pulse */}
          <span className="absolute inset-0 rounded-full bg-emerald-400/10 animate-pulse [animation-duration:5s] pointer-events-none" />
          <PremiumWhatsAppIcon size={28} className="relative z-10 h-6 w-6 text-white sm:h-7 sm:w-7" glow={false} />
        </a>

        {/* AI Consultant Floating Trigger (Right) - Sized to visually match WhatsApp circle */}
        <button
          onClick={openChat}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none sm:h-16 sm:w-16"
          title="Abrir Consultora Virtual IA"
          aria-label="Abrir Consultora Virtual IA"
        >
          {/* Ambient Luminescence Glow Aura */}
          <div className="absolute inset-0 rounded-full bg-fuchsia-600/35 blur-md group-hover:bg-fuchsia-500/55 group-hover:blur-lg transition-all duration-300 pointer-events-none" />
          <img
            src="/images/icon-vaidosaAI-1-96.webp"
            alt="Consultora IA"
            className="w-full h-full scale-110 rounded-full object-contain relative z-10 drop-shadow-[0_0_12px_rgba(217,70,239,0.7)] group-hover:drop-shadow-[0_0_20px_rgba(217,70,239,0.95)] transition-all duration-300"
          />
        </button>
      </div>

      {/* Real-Time WebGL & Frametime Performance Benchmark HUD */}
      <FpsMonitor />
    </div>
  );
}

