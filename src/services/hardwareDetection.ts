import * as GPUDetector from 'detect-gpu';

// Support both the browser bundle and Node's CommonJS interop during SSR.
const getGPUTier = GPUDetector.getGPUTier
  ?? (GPUDetector as unknown as { default: typeof GPUDetector }).default.getGPUTier;

export interface HardwareProfile {
  tier: 0 | 1 | 2 | 3;
  isMobile: boolean;
  gpu: string;
  recommendedDpr: number;
  allowComplexWebGL: boolean;
  fps: 30 | 60;
  isLowEnd: boolean;
}
type DeviceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};
export const DEFAULT_HARDWARE: HardwareProfile = {
  tier: 2, isMobile: false, gpu: 'unknown', recommendedDpr: 1,
  allowComplexWebGL: false, fps: 30, isLowEnd: false,
};
const CACHE_KEY = 'vaidosa.hardware.v1';
let pending: Promise<HardwareProfile> | undefined;
let current = DEFAULT_HARDWARE;
export const getHardwareSnapshot = (): HardwareProfile => current;

function nativeProfile(): HardwareProfile {
  const nav = navigator as DeviceNavigator;
  const mobile = /Android|iPhone|iPad|iPod/i.test(nav.userAgent) || (nav.maxTouchPoints > 1 && /Macintosh/i.test(nav.userAgent));
  let tier: HardwareProfile['tier'] = 2;
  let gpu = 'unknown';
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: false, antialias: false });
    if (!gl) tier = 0;
    else {
      const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      gpu = String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      if (maxTexture < 4096 || /swiftshader|llvmpipe|software|softpipe/i.test(gpu)) tier = 0;
      else if (maxTexture < 8192 || (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4) || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)) tier = 1;
      else if (!mobile && maxTexture >= 16384 && nav.hardwareConcurrency >= 8 && (nav.deviceMemory ?? 0) >= 8) tier = 3;
    }
  } catch { tier = 0; }
  finally { gl?.getExtension('WEBGL_lose_context')?.loseContext(); }
  return makeProfile(tier, mobile, gpu);
}

function makeProfile(tier: HardwareProfile['tier'], isMobile: boolean, gpu: string): HardwareProfile {
  const nav = navigator as DeviceNavigator;
  const restricted = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || nav.connection?.saveData;
  if (restricted) tier = Math.min(tier, 1) as HardwareProfile['tier'];
  const isLowEnd = tier <= 1;
  return { tier, isMobile, gpu, isLowEnd,
    recommendedDpr: Math.min(window.devicePixelRatio || 1, isLowEnd ? 0.75 : tier === 3 && !isMobile ? 1.25 : 1),
    allowComplexWebGL: !isLowEnd && !restricted,
    fps: tier === 3 && !restricted ? 60 : 30,
  };
}

function readCache(): HardwareProfile | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (!value || typeof value !== 'object') return null;
    const p = value as Partial<HardwareProfile>;
    if (![0, 1, 2, 3].includes(p.tier!) || typeof p.isMobile !== 'boolean' || typeof p.gpu !== 'string') return null;
    return makeProfile(p.tier!, p.isMobile, p.gpu);
  } catch { return null; }
}

export function detectHardware(): Promise<HardwareProfile> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return Promise.resolve(DEFAULT_HARDWARE);
  if (pending) return pending;
  pending = (async () => {
    const cached = readCache();
    if (cached) return (current = cached);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let profile: HardwareProfile;
    try {
      const result = await Promise.race([
        getGPUTier({ failIfMajorPerformanceCaveat: false }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('GPU detection timeout')), 2200); }),
      ]);
      // FALLBACK means benchmark information was unavailable (e.g. offline).
      if (result.type === 'FALLBACK') profile = nativeProfile();
      else profile = makeProfile(Math.max(0, Math.min(3, result.tier)) as HardwareProfile['tier'], result.isMobile ?? false, result.gpu || 'unknown');
    } catch { profile = nativeProfile(); }
    finally { clearTimeout(timer); }
    current = profile;
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(profile)); } catch { /* Storage may be disabled. */ }
    return profile;
  })();
  return pending;
}
