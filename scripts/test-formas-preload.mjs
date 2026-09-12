import fs from 'fs';
import path from 'path';

console.log('=== TEST SUITE: FORMAS (BENTO) PRELOAD & INITIALIZATION VERIFICATION ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// Test 1: Check Hero.tsx has NO gold color on "Elegância"
const heroContent = fs.readFileSync(path.resolve('src/components/Hero.tsx'), 'utf-8');
assert(!heroContent.includes('#E5C378'), 'Hero.tsx does not contain the #E5C378 gold color');
assert(!heroContent.includes('Warm Premium Gold'), 'Hero.tsx comment "Warm Premium Gold" has been removed');
assert(heroContent.includes('text-white') && heroContent.includes('Elegância'), 'Hero.tsx renders Elegância in crisp white editorial text');

// Test 2: Check products are loaded synchronously in App.tsx
const appContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
assert(appContent.includes("import productsData from './data/products.json';"), 'App.tsx imports products.json synchronously at root');
assert(appContent.includes('useState<Produto[]>(productsData as Produto[])'), 'App.tsx initializes products state synchronously with productsData');

// Test 3: Check GaplessBento.tsx mounts Ferrofluid directly without DeferredRender
const bentoContent = fs.readFileSync(path.resolve('src/components/GaplessBento.tsx'), 'utf-8');
assert(!bentoContent.includes('DeferredRender'), 'GaplessBento.tsx does not wrap Ferrofluid in DeferredRender');
assert(bentoContent.includes('<Ferrofluid'), 'GaplessBento.tsx mounts Ferrofluid directly');
assert(!bentoContent.includes('sr-bento-item'), 'GaplessBento.tsx removed sr-bento-item to avoid opacity: 0 scroll hiding');

// Test 4: Check InitialEntrance.tsx contains verification tool and expanded duration
const entranceContent = fs.readFileSync(path.resolve('src/components/InitialEntrance.tsx'), 'utf-8');
assert(entranceContent.includes('__VERIFY_FORMAS_SECTION_LOADED__'), 'InitialEntrance.tsx exposes __VERIFY_FORMAS_SECTION_LOADED__ test function');
assert(entranceContent.includes('minDuration = 2200'), 'InitialEntrance.tsx uses increased duration (~2200ms) for deep GPU and shader warm-up');
assert(entranceContent.includes('formasImagePaths'), 'InitialEntrance.tsx tracks all 21 Formas images and srcset variants');
assert(entranceContent.includes('sectionReadyPromise'), 'InitialEntrance.tsx actively waits for section preparation promise');

// Test 5: Check that all 7 Bento products exist in products.json
const products = JSON.parse(fs.readFileSync(path.resolve('src/data/products.json'), 'utf-8'));
const bentoTargetIds = [
  'projeto_drbtklvdnxo',
  'projeto_dcwy2surwqd',
  'projeto_drbtoi9dmno',
  'projeto_db8jnvwpvou',
  'projeto_duqcagtgkwi',
  'projeto_dygalcjjeim',
  'projeto_dsnkzh7ah7z',
];

for (const id of bentoTargetIds) {
  const prod = products.find((p) => p.id === id);
  assert(Boolean(prod), `Product ID "${id}" exists in products.json (${prod ? prod.titulo : 'not found'})`);
}

// Test 6: Check that all 21 image assets (original, 480w, 960w) exist on filesystem and are non-empty
const formasImageFiles = [
  'images/instagram/DRBTkLVDNXO/01.webp',
  'images/instagram/DRBTkLVDNXO/01-480.webp',
  'images/instagram/DRBTkLVDNXO/01-960.webp',
  'images/instagram/DcWY2suRWQD/01.webp',
  'images/instagram/DcWY2suRWQD/01-480.webp',
  'images/instagram/DcWY2suRWQD/01-960.webp',
  'images/instagram/DRBToI9DMno/01.webp',
  'images/instagram/DRBToI9DMno/01-480.webp',
  'images/instagram/DRBToI9DMno/01-960.webp',
  'images/instagram/Db8jnVWPvoU/01.webp',
  'images/instagram/Db8jnVWPvoU/01-480.webp',
  'images/instagram/Db8jnVWPvoU/01-960.webp',
  'images/instagram/DUqCaGTgKWI/01.webp',
  'images/instagram/DUqCaGTgKWI/01-480.webp',
  'images/instagram/DUqCaGTgKWI/01-960.webp',
  'images/instagram/DYGalCJjEim/01.webp',
  'images/instagram/DYGalCJjEim/01-480.webp',
  'images/instagram/DYGalCJjEim/01-960.webp',
  'images/instagram/DSnKZh7AH7Z/01.webp',
  'images/instagram/DSnKZh7AH7Z/01-480.webp',
  'images/instagram/DSnKZh7AH7Z/01-960.webp',
];

for (const relPath of formasImageFiles) {
  const fullPath = path.resolve('public', relPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  assert(exists && size > 500, `Asset ${relPath} exists and has valid payload (${(size / 1024).toFixed(1)} KB)`);
}

// Test 7: Preload link in index.html
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
assert(indexHtml.includes('DRBTkLVDNXO/01.webp') && indexHtml.includes('rel="preload"'), 'index.html has <link rel="preload"> for main Formas bento image');

// Test 8: Check HorizontalAccordion.tsx configuration
const accordionContent = fs.readFileSync(path.resolve('src/components/HorizontalAccordion.tsx'), 'utf-8');
assert(accordionContent.includes('id="exploracao-tatil"'), 'HorizontalAccordion has id="exploracao-tatil" for section tracking');
assert(accordionContent.includes('loading="eager"'), 'HorizontalAccordion images set loading="eager"');
assert(accordionContent.includes('decoding="sync"'), 'HorizontalAccordion images set decoding="sync"');
assert(accordionContent.includes('getImageSrcSet'), 'HorizontalAccordion uses getImageSrcSet for responsive image loading');
assert(!accordionContent.includes('sr-accordion-header'), 'HorizontalAccordion removed sr-accordion-header to prevent scroll lag/hidden state');

// Test 9: Check GhostFibers is imported synchronously and rendered without DeferredRender in App.tsx
assert(appContent.includes("import GhostFibers from './components/GhostFibers';"), 'App.tsx imports GhostFibers synchronously');
assert(!appContent.includes('<DeferredRender order={1}'), 'App.tsx removed DeferredRender wrapper around GhostFibers');

// Test 10: Check scrollReveal.ts removed accordion reveals
const scrollRevealContent = fs.readFileSync(path.resolve('src/utils/scrollReveal.ts'), 'utf-8');
assert(!scrollRevealContent.includes('.sr-accordion-header'), 'scrollReveal.ts removed .sr-accordion-header trigger');
assert(!scrollRevealContent.includes('.sr-accordion-container'), 'scrollReveal.ts removed .sr-accordion-container trigger');

// Test 11: Check InitialEntrance.tsx exposes unified verification
assert(entranceContent.includes('__VERIFY_ALL_PRELOADED_SECTIONS__'), 'InitialEntrance.tsx exposes __VERIFY_ALL_PRELOADED_SECTIONS__ for multi-section diagnostics');

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
