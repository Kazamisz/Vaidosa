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
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';
import { PremiumWhatsAppIcon } from './components/PremiumWhatsAppIcon';
import { PremiumCursor } from './components/PremiumCursor';
import { ReadingProgress } from './components/ReadingProgress';
import { DeferredRender } from './components/DeferredRender';
import { InitialEntrance } from './components/InitialEntrance';
import { initScrollReveal } from './utils/scrollReveal';
import { triggerHapticFeedback } from './utils/haptics';
import Lenis from 'lenis';
import { Produto, CartItem } from './types';
import { COMPANY } from './data/company';
import { ANIMATION_FRAME_INTERVAL } from './utils/animation';
import productsData from './data/products.json';
import GhostFibers from './components/GhostFibers';

const ProductModal = lazy(() => import('./components/ProductModal').then(module => ({ default: module.ProductModal })));
const ChatbotDrawer = lazy(() => import('./components/ChatbotDrawer').then(module => ({ default: module.ChatbotDrawer })));
const FavoritesDrawer = lazy(() => import('./components/FavoritesDrawer').then(module => ({ default: module.FavoritesDrawer })));

export default function App() {
  const [products, setProducts] = useState<Produto[]>(productsData as Produto[]);
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
  const [toast, setToast] = useState<{ id: string; product: Produto } | null>(null);
  const [isInitialEntranceComplete, setIsInitialEntranceComplete] = useState(false);

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
    triggerHapticFeedback(15);
    setHasOpenedChat(true);
    setIsChatOpen(true);
  };
  const openCart = () => {
    triggerHapticFeedback(15);
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
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Lock page scroll and pause Lenis engine when chat, cart or product modal is open or during initial entrance
  useEffect(() => {
    if (!isInitialEntranceComplete || isChatOpen || isCartOpen || selectedProduct) {
      lenisRef.current?.stop();
      if (isChatOpen || isCartOpen || selectedProduct) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isInitialEntranceComplete, isChatOpen, isCartOpen, selectedProduct]);

  // ScrollReveal Dynamic Reveal Engine for Off-Screen Elements (Zero collision with Catalog)
  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollReveal();
    }, 120);

    return () => clearTimeout(timer);
  }, [products, isInitialEntranceComplete]);

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
    triggerHapticFeedback([12, 40, 18]);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setToast({ id: String(Date.now()), product: prod });
    }
    setCart(prev => {
      const exists = prev.find(item => item.id === id);
      if (exists) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    triggerHapticFeedback(12);
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
    triggerHapticFeedback(15);
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
      {/* Smooth Boutique Brand Initial Entrance Sequence */}
      <InitialEntrance onComplete={() => setIsInitialEntranceComplete(true)} />

      {/* Minimalist Top Reading Progress Bar */}
      <ReadingProgress />

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
          <div className="absolute inset-0 canvas-seamless-mask">
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
          </div>

          {/* Seamless top and bottom feathering overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 md:h-64 bg-gradient-to-b from-[#080307] via-[#080307]/85 to-transparent z-[1]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 md:h-64 bg-gradient-to-t from-[#080307] via-[#080307]/85 to-transparent z-[1]" aria-hidden="true" />

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

        {/* NEWSLETTER: Exclusive Early Access & Product Drops */}
        <NewsletterSection />
      </main>

      {/* ACTION: High-Contrast CTA Chapter and Clean Architectural Footer */}
      <Footer
        onOpenChat={openChat}
        onSelectCategory={handleCategorySelect}
      />

      {/* Global Shopping Cart Toast Notification */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
        onOpenCart={openCart}
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
        {/* WhatsApp Direct Floating Trigger (Left) with Luminescent Aura */}
        <a
          href={COMPANY.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHapticFeedback(20)}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_22px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-[0_0_34px_rgba(37,211,102,0.9)] active:scale-95 sm:h-14 sm:w-14"
          title="Falar no WhatsApp da Loja"
          aria-label="Falar no WhatsApp da Loja"
        >
          {/* Luminescent Aura */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/35 blur-md group-hover:bg-emerald-400/55 group-hover:blur-lg transition-all duration-300 pointer-events-none" />
          <PremiumWhatsAppIcon size={28} className="relative z-10 h-6 w-6 text-white sm:h-7 sm:w-7 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" glow />
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
    </div>
  );
}

