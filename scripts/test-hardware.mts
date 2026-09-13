import assert from 'node:assert/strict';
import { detectHardware, DEFAULT_HARDWARE } from '../src/services/hardwareDetection.ts';

// SSR must neither inspect browser APIs nor start benchmark requests.
assert.deepEqual(await detectHardware(), DEFAULT_HARDWARE);
let reads = 0;
Object.defineProperty(globalThis, 'window', { configurable: true, value: {
  devicePixelRatio: 3,
  matchMedia: () => ({ matches: true }),
} });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
  hardwareConcurrency: 8, deviceMemory: 8, connection: { saveData: false },
} });
Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
  getItem: () => { reads++; return JSON.stringify({ tier: 3, isMobile: true, gpu: 'cached GPU' }); },
} });
const first = detectHardware();
assert.equal(first, detectHardware(), 'Concurrent callers share one detection');
const profile = await first;
assert.equal(profile.tier, 1, 'Reduced motion overrides a cached high tier');
assert.equal(profile.allowComplexWebGL, false);
assert.equal(profile.isLowEnd, true);
assert.equal(profile.recommendedDpr, 0.75);
assert.equal(profile.fps, 30);
assert.equal(profile.gpu, 'cached GPU');
assert.equal(reads, 1, 'Cache read once per application instance');
console.log('Hardware checks passed: SSR, cache, shared promise, reduced motion, DPR and FPS');
