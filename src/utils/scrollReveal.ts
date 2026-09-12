/**
 * Ultra-Reliable High-Performance ScrollReveal Engine
 * 
 * Powered by IntersectionObserver with zero-overhead layout measurement.
 * Fully compatible with Lenis smooth scroll, GSAP, CSS transforms, and Tailwind.
 * 
 * Guarantees that:
 * 1. Elements NEVER get stuck invisible (opacity: 0).
 * 2. In-viewport elements reveal smoothly with hardware-accelerated transitions.
 * 3. Inline styles are automatically cleaned up after reveal so hover states work cleanly.
 * 4. Zero collisions with CatalogSection (which uses Framer Motion).
 */

export interface ScrollRevealOptions {
  origin?: 'bottom' | 'top' | 'left' | 'right';
  distance?: string;
  duration?: number;
  delay?: number;
  interval?: number;
  easing?: string;
  opacity?: number;
  scale?: number;
  reset?: boolean;
  mobile?: boolean;
  desktop?: boolean;
  viewFactor?: number;
  beforeReveal?: (el: HTMLElement) => void;
  afterReveal?: (el: HTMLElement) => void;
}

interface RevealRecord {
  target: string | HTMLElement | HTMLElement[];
  options: ScrollRevealOptions;
}

class ModernScrollRevealInstance {
  private records: RevealRecord[] = [];
  private observer: IntersectionObserver | null = null;
  private observedElements = new Set<HTMLElement>();
  private defaultOptions: ScrollRevealOptions;
  private isDestroyed = false;

  constructor(defaults: ScrollRevealOptions = {}) {
    this.defaultOptions = {
      duration: 800,
      distance: '30px',
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: 0,
      scale: 1,
      reset: false,
      mobile: true,
      desktop: true,
      viewFactor: 0.12,
      ...defaults,
    };

    if (typeof window !== 'undefined') {
      // Clean up any legacy artifacts on document.body or html
      if (document.body && document.body.style.height === '100%') {
        document.body.style.height = '';
      }
      document.documentElement.classList.remove('sr');

      this.initObserver();
    }
  }

  private initObserver() {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            this.revealElement(el);
          } else if (el.dataset.srReset === 'true') {
            this.resetElement(el);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );
  }

  public reveal(target: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>, options: ScrollRevealOptions = {}): this {
    if (this.isDestroyed || typeof window === 'undefined') return this;

    const mergedOptions: ScrollRevealOptions = {
      ...this.defaultOptions,
      ...options,
    };

    let elements: HTMLElement[] = [];
    if (typeof target === 'string') {
      elements = Array.from(document.querySelectorAll<HTMLElement>(target));
      this.records.push({ target, options: mergedOptions });
    } else if (target instanceof HTMLElement) {
      elements = [target];
      this.records.push({ target, options: mergedOptions });
    } else if (Array.isArray(target)) {
      elements = target.filter((el): el is HTMLElement => el instanceof HTMLElement);
      this.records.push({ target: elements, options: mergedOptions });
    } else if (target && typeof (target as NodeListOf<HTMLElement>).forEach === 'function') {
      elements = Array.from(target);
      this.records.push({ target: elements, options: mergedOptions });
    }

    if (!elements.length) return this;

    // Check user accessibility preference
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    elements.forEach((el, index) => {
      if (!el || !(el instanceof HTMLElement)) return;

      // If user prefers reduced motion, reveal instantly with no opacity/transform delay
      if (prefersReducedMotion) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
        return;
      }

      // If already revealed and not resetable, skip
      if (el.dataset.srStatus === 'revealed' && !mergedOptions.reset) {
        return;
      }

      // Configure element metadata
      const distance = mergedOptions.distance || '28px';
      const origin = mergedOptions.origin || 'bottom';
      const duration = mergedOptions.duration ?? 800;
      const baseDelay = mergedOptions.delay ?? 0;
      const interval = mergedOptions.interval ?? 0;
      const easing = mergedOptions.easing || 'cubic-bezier(0.16, 1, 0.3, 1)';
      const initialOpacity = mergedOptions.opacity ?? 0;
      const initialScale = mergedOptions.scale ?? 1;

      // Stagger delay based on index in batch
      const staggerDelay = baseDelay + (interval > 0 ? index * interval : 0);

      // Compute initial transform
      let tx = '0';
      let ty = '0';
      if (origin === 'bottom') ty = distance;
      else if (origin === 'top') ty = `-${distance}`;
      else if (origin === 'left') tx = `-${distance}`;
      else if (origin === 'right') tx = distance;

      const scaleStr = initialScale !== 1 ? ` scale(${initialScale})` : '';
      const initialTransform = `translate3d(${tx}, ${ty}, 0)${scaleStr}`;

      // Store animation configuration on element dataset
      el.dataset.srDuration = String(duration);
      el.dataset.srDelay = String(staggerDelay);
      el.dataset.srEasing = easing;
      el.dataset.srReset = String(Boolean(mergedOptions.reset));
      el.dataset.srStatus = 'pending';

      // Set initial styles
      el.style.visibility = 'visible';
      el.style.opacity = String(initialOpacity);
      el.style.transform = initialTransform;
      el.style.willChange = 'opacity, transform';
      el.style.transition = `opacity ${duration}ms ${easing} ${staggerDelay}ms, transform ${duration}ms ${easing} ${staggerDelay}ms`;

      // Check if already in viewport
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isInViewport = rect.top < windowHeight - 40 && rect.bottom > 40;

      if (isInViewport) {
        // Element is currently visible: trigger reveal smoothly right away
        requestAnimationFrame(() => {
          this.revealElement(el);
        });
      } else {
        // Observe for scroll entry
        if (this.observer) {
          this.observer.observe(el);
          this.observedElements.add(el);
        } else {
          // Fallback if no IntersectionObserver
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      }
    });

    return this;
  }

  private revealElement(el: HTMLElement) {
    if (!el || el.dataset.srStatus === 'revealed') return;

    el.dataset.srStatus = 'revealed';

    const duration = parseInt(el.dataset.srDuration || '800', 10);
    const delay = parseInt(el.dataset.srDelay || '0', 10);

    // Apply reveal styles
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });

    const isReset = el.dataset.srReset === 'true';

    if (!isReset) {
      // Unobserve to free resources
      if (this.observer) {
        this.observer.unobserve(el);
        this.observedElements.delete(el);
      }

      // Clean up inline styles once transition completes to keep hover states and responsiveness pure
      const totalTime = duration + delay + 80;
      setTimeout(() => {
        if (el.dataset.srStatus === 'revealed') {
          el.style.removeProperty('will-change');
          el.style.removeProperty('transition');
          el.style.removeProperty('transform');
          el.style.removeProperty('opacity');
        }
      }, totalTime);
    }
  }

  private resetElement(el: HTMLElement) {
    if (!el || el.dataset.srReset !== 'true') return;
    el.dataset.srStatus = 'pending';
    const duration = parseInt(el.dataset.srDuration || '800', 10);
    const easing = el.dataset.srEasing || 'cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transition = `opacity ${duration * 0.6}ms ${easing}, transform ${duration * 0.6}ms ${easing}`;
    el.style.opacity = '0';
  }

  public sync(): this {
    if (this.isDestroyed) return this;
    // Re-evaluate registered targets for new dynamic DOM nodes
    this.records.forEach((record) => {
      if (typeof record.target === 'string') {
        const matching = Array.from(document.querySelectorAll<HTMLElement>(record.target));
        const unhandled = matching.filter((el) => !el.dataset.srStatus);
        if (unhandled.length > 0) {
          this.reveal(unhandled, record.options);
        }
      }
    });
    return this;
  }

  public clean(): this {
    this.observedElements.forEach((el) => {
      el.style.removeProperty('will-change');
      el.style.removeProperty('transition');
      el.style.removeProperty('transform');
      el.style.removeProperty('opacity');
      el.removeAttribute('data-sr-status');
      el.removeAttribute('data-sr-duration');
      el.removeAttribute('data-sr-delay');
      el.removeAttribute('data-sr-easing');
      el.removeAttribute('data-sr-reset');
    });
    this.observedElements.clear();
    return this;
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.clean();
    this.records = [];
  }
}

/**
 * ScrollReveal Factory matching the standard ScrollReveal API signature.
 */
export default function ScrollReveal(defaults?: ScrollRevealOptions): ModernScrollRevealInstance {
  return new ModernScrollRevealInstance(defaults);
}

/**
 * Initializes and configures ScrollReveal for the Vaidosa boutique storefront.
 */
let globalScrollRevealInstance: ModernScrollRevealInstance | null = null;

export function initScrollReveal(): ModernScrollRevealInstance | null {
  if (typeof window === 'undefined') return null;

  try {
    if (globalScrollRevealInstance) {
      // Re-sync any new nodes if already initialized
      globalScrollRevealInstance.sync();
      return globalScrollRevealInstance;
    }

    const sr = ScrollReveal({
      duration: 800,
      distance: '30px',
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: 0,
      scale: 1,
      reset: false,
      mobile: true,
      viewFactor: 0.1,
    });

    globalScrollRevealInstance = sr;

    // Physical Store Section
    sr.reveal('.sr-store-header', {
      origin: 'bottom',
      distance: '24px',
      duration: 700,
    });

    sr.reveal('.sr-store-card', {
      origin: 'bottom',
      distance: '32px',
      interval: 120,
      duration: 750,
    });

    // Newsletter Section
    sr.reveal('.sr-newsletter-card', {
      origin: 'bottom',
      distance: '28px',
      duration: 800,
      scale: 0.98,
    });

    // Generic reveal utility classes
    sr.reveal('.sr-fade-up', {
      origin: 'bottom',
      distance: '28px',
      duration: 750,
      interval: 80,
    });

    sr.reveal('.sr-fade-left', {
      origin: 'left',
      distance: '35px',
      duration: 800,
    });

    sr.reveal('.sr-fade-right', {
      origin: 'right',
      distance: '35px',
      duration: 800,
    });

    // CRITICAL SAFETY NOTE:
    // We intentionally NEVER target "#catalogo .catalog-product-card" or any element
    // inside the catalog products grid to prevent any conflict with Framer Motion (whileInView).

    return sr;
  } catch (error) {
    console.warn('ScrollReveal initialization notice:', error);
    return null;
  }
}
