/**
 * Global WebGL & Device Performance Optimization Utility
 * Enforces strict 60 FPS mobile ceilings, adaptive DPR scaling, and idle-canvas management.
 */

import { getHardwareSnapshot } from '../services/hardwareDetection';
// Device detection & capability heuristics
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    navigator.maxTouchPoints > 1 ||
    'ontouchstart' in window
  );
};

export const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  // Check available CPU threads or hardware concurrency
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
  return isMobileDevice();
};

// Clamped DPR to prevent 3x Retina mobile GPU burn
export const MAX_DESKTOP_DPR = 1.25;
export const MAX_MOBILE_DPR = 1.0;

export const getWebGLDpr = (): number => {
  if (typeof window === 'undefined') return 1;
  return getHardwareSnapshot().recommendedDpr;
};

// Target frame-rates & frame-budget helpers (Strict 60 FPS lock)
export const TARGET_FPS = 60;
export const ANIMATION_FPS = 60;
export const ANIMATION_FRAME_INTERVAL = 1000 / TARGET_FPS; // 16.666666666666668 ms

/**
 * Installs a high-precision, phase-synchronized 60 FPS requestAnimationFrame lock.
 * Ensures zero-jitter delivery on 60Hz, 120Hz, 144Hz, 240Hz, and ProMotion displays.
 */
export const setupGlobal60FpsLimit = (targetFps: number = 60) => {
  if (typeof window === 'undefined') return;
  if ((window as any).__fpsLimiterInstalled) return;
  (window as any).__fpsLimiterInstalled = true;

  const originalRAF = window.requestAnimationFrame.bind(window);
  const originalCAF = window.cancelAnimationFrame.bind(window);

  const frameInterval = 1000 / targetFps; // 16.6667ms
  // Allow a small phase tolerance (approx 2ms) to align cleanly with native 60Hz VSync
  const phaseTolerance = 2.5; 
  let lastDispatchedTime = 0;
  let idCounter = 1;
  const pendingCallbacks = new Map<number, FrameRequestCallback>();
  let nativeRafId: number | null = null;

  const processQueue = (now: DOMHighResTimeStamp) => {
    nativeRafId = null;
    const elapsed = now - lastDispatchedTime;

    // Dispatches if enough time elapsed or on initial frame
    if (lastDispatchedTime === 0 || elapsed >= frameInterval - phaseTolerance) {
      // Phase-locking: retain interval alignment to prevent clock drift and micro-stutter
      lastDispatchedTime = lastDispatchedTime === 0 ? now : now - (elapsed % frameInterval);

      const callbacksToRun = Array.from(pendingCallbacks.entries());
      pendingCallbacks.clear();

      for (let i = 0; i < callbacksToRun.length; i++) {
        const [, cb] = callbacksToRun[i];
        try {
          cb(now);
        } catch (err) {
          console.error('Error in requestAnimationFrame callback:', err);
        }
      }
    }

    if (pendingCallbacks.size > 0 && nativeRafId === null) {
      nativeRafId = originalRAF(processQueue);
    }
  };

  window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
    const id = idCounter++;
    pendingCallbacks.set(id, callback);
    if (nativeRafId === null) {
      nativeRafId = originalRAF(processQueue);
    }
    return id;
  };

  window.cancelAnimationFrame = (id: number) => {
    pendingCallbacks.delete(id);
    if (pendingCallbacks.size === 0 && nativeRafId !== null) {
      originalCAF(nativeRafId);
      nativeRafId = null;
    }
  };
};

// Automatically enforce 60 FPS on initialization
// Native RAF keeps input and animation scheduling aligned with browser frames.

// Active WebGL Context Registry (prevents exceeding mobile context limits)
class WebGLContextTracker {
  private activeContexts: Set<string>;
  private listeners: Set<(count: number) => void>;

  constructor() {
    this.activeContexts = new Set<string>();
    this.listeners = new Set<(count: number) => void>();
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getActiveCount = this.getActiveCount.bind(this);
  }

  register(id: string) {
    if (!this.activeContexts) this.activeContexts = new Set();
    this.activeContexts.add(id);
    this.notify();
  }

  unregister(id: string) {
    if (!this.activeContexts) this.activeContexts = new Set();
    this.activeContexts.delete(id);
    this.notify();
  }

  getActiveCount(): number {
    return this.activeContexts ? this.activeContexts.size : 0;
  }

  subscribe(listener: (count: number) => void) {
    if (!this.listeners) this.listeners = new Set();
    this.listeners.add(listener);
    try {
      listener(this.getActiveCount());
    } catch {
      // ignore
    }
    return () => {
      if (this.listeners) {
        this.listeners.delete(listener);
      }
    };
  }

  private notify() {
    const count = this.getActiveCount();
    if (this.listeners && typeof this.listeners.forEach === 'function') {
      this.listeners.forEach(l => {
        try {
          l(count);
        } catch (err) {
          console.warn('WebGLTracker listener error:', err);
        }
      });
    }
  }
}

export const webGLTracker = new WebGLContextTracker();
