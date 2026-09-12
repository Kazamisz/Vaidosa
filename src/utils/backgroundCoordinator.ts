/**
 * Background Coordinator
 * Manages progressive loading of backgrounds in pairs (2 initially, then 2 by 2 descending).
 * 
 * Order of Backgrounds in the page:
 * 0: Ferrofluid (GaplessBento)
 * 1: GhostFibers (Accordion & TextScrub in App.tsx)
 * 2: Topography (CuratedLooks)
 * 3: Silk (CatalogSection)
 * 4: DarkVeil (StoreSection)
 * 5: DarkVeil (Footer)
 * 
 * Batch / Tier 0 (Initial): Orders 0 & 1 are unlocked immediately on page mount.
 * Batch / Tier 1 (Scroll Down): Orders 2 & 3 are unlocked.
 * Batch / Tier 2 (Scroll Down): Orders 4 & 5 are unlocked.
 */

type Listener = () => void;

class BackgroundCoordinator {
  private currentTier = 0; // Starts at Tier 0 -> unlocks order 0 and 1
  private listeners = new Set<Listener>();
  private preloadedTiers = new Set<number>();

  constructor() {
    if (typeof window !== 'undefined') {
      // Schedule background prefetch of Tier 1 modules after initial page load settles
      const scheduleInitialPrefetch = () => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => this.prefetchTier(1));
        } else {
          setTimeout(() => this.prefetchTier(1), 1200);
        }
      };

      if (document.readyState === 'complete') {
        scheduleInitialPrefetch();
      } else {
        window.addEventListener('load', scheduleInitialPrefetch, { once: true });
      }

      // Scroll listener fallback: ensures timely progressive unlock on fast or slow scroll
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = docHeight > 0 ? scrollY / docHeight : 0;

            // When scrolling down past hero (~350px or 10% of page), unlock Tier 1 (orders 2 & 3)
            if (ratio > 0.08 || scrollY > 350) {
              this.unlockTier(1);
            }
            // When scrolling past Curated/Catalog (~1600px or 35% of page), unlock Tier 2 (orders 4 & 5)
            if (ratio > 0.35 || scrollY > 1600) {
              this.unlockTier(2);
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('Error notifying background listener', e);
      }
    });
  }

  public getUnlockedMaxOrder(): number {
    return this.currentTier * 2 + 1;
  }

  public isOrderUnlocked(order: number): boolean {
    return order <= this.getUnlockedMaxOrder();
  }

  public unlockTier(tier: number) {
    if (tier > this.currentTier) {
      this.currentTier = Math.min(2, tier);
      this.prefetchTier(this.currentTier + 1);
      this.notify();
    }
  }

  public unlockForOrder(order: number) {
    const requiredTier = Math.floor(order / 2);
    if (requiredTier > this.currentTier) {
      this.unlockTier(requiredTier);
    }
  }

  public advanceFromOrder(order: number) {
    const nextTier = Math.floor(order / 2) + 1;
    if (nextTier <= 2) {
      this.unlockTier(nextTier);
    }
  }

  private prefetchTier(tier: number) {
    if (this.preloadedTiers.has(tier) || tier > 2) return;
    this.preloadedTiers.add(tier);

    if (tier === 1) {
      // Preload CuratedLooks and CatalogSection background chunks
      import('../components/backgrounds/Topography').catch(() => {});
      import('../components/backgrounds/Silk').catch(() => {});
    } else if (tier === 2) {
      // Preload Store and Footer background chunks
      import('../components/backgrounds/DarkVeil').catch(() => {});
    }
  }
}

export const backgroundCoordinator = new BackgroundCoordinator();
