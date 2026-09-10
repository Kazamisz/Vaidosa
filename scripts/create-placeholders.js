import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

// Palette mapping for categories & colors
const categoryColors = {
  'Vestidos': { bg: '#FDF2F4', accent: '#BE185D', text: '#831843' },
  'Roupas Femininas': { bg: '#F8F6F0', accent: '#A16207', text: '#713F12' },
  'Moda Feminina': { bg: '#F5F3FF', accent: '#7C3AED', text: '#5B21B6' },
  'Calças': { bg: '#F1F5F9', accent: '#475569', text: '#1E293B' },
  'Moda Praia': { bg: '#F0FDFA', accent: '#0D9488', text: '#115E59' },
  'Moda Fitness': { bg: '#FFF1F2', accent: '#E11D48', text: '#9F1239' },
  'Moda Íntima': { bg: '#FFF7ED', accent: '#EA580C', text: '#9A3412' },
  'Blusas': { bg: '#FEFCE8', accent: '#CA8A04', text: '#854D0E' },
  'Moda Masculina': { bg: '#EFF6FF', accent: '#2563EB', text: '#1E40AF' },
  'Bolsas': { bg: '#FAF5FF', accent: '#9333EA', text: '#6B21A8' },
  'Perfumaria': { bg: '#FFFBEB', accent: '#D97706', text: '#78350F' },
  'Promoções': { bg: '#FDF4FF', accent: '#C026D3', text: '#86198F' },
  'Ambiente Comercial': { bg: '#F0FDF4', accent: '#16A34A', text: '#14532D' }
};

// Simple SVG generator that saves as SVG or webp-named SVG file (browsers render SVG images in <img> tags cleanly)
function generateSvg(p, index, total) {
  const theme = categoryColors[p.categoria] || { bg: '#F8F6F0', accent: '#BE185D', text: '#1E1B18' };
  const shortTitle = p.titulo.length > 28 ? p.titulo.slice(0, 26) + '...' : p.titulo;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="g_${p.id}_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="#EFECE6" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.06"/>
    </filter>
  </defs>
  <rect width="600" height="800" fill="url(#g_${p.id}_${index})" />
  
  <!-- Subtle decorative geometry inspired by high-fashion magazine layout -->
  <circle cx="300" cy="360" r="220" fill="#FFFFFF" opacity="0.6" />
  <circle cx="300" cy="360" r="170" fill="${theme.bg}" opacity="0.8" />
  
  <!-- Fashion Silhouette / Icon -->
  <g transform="translate(300, 320)" text-anchor="middle">
    <circle cx="0" cy="-60" r="24" fill="${theme.accent}" opacity="0.15" />
    <path d="M-30,-20 C-20,-40 20,-40 30,-20 L50,110 L-50,110 Z" fill="${theme.accent}" opacity="0.22" />
    <path d="M-20,-10 C-10,-25 10,-25 20,-10 L35,90 L-35,90 Z" fill="${theme.accent}" opacity="0.45" />
    <circle cx="0" cy="-60" r="16" fill="${theme.accent}" opacity="0.6" />
  </g>
  
  <!-- Content overlay card -->
  <g transform="translate(40, 560)" filter="url(#shadow)">
    <rect width="520" height="190" rx="16" fill="#FFFFFF" opacity="0.95" />
    
    <!-- Category Badge -->
    <rect x="24" y="24" width="140" height="28" rx="14" fill="${theme.bg}" />
    <text x="94" y="43" fill="${theme.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="0.5">${p.categoria.toUpperCase()}</text>
    
    <!-- Gallery indicator if multiple images -->
    ${total > 1 ? `
    <rect x="420" y="24" width="76" height="28" rx="14" fill="#F1F5F9" />
    <text x="458" y="43" fill="#475569" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Foto ${index + 1}/${total}</text>
    ` : ''}

    <!-- Title -->
    <text x="24" y="88" fill="#1E1B18" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700">${shortTitle}</text>
    
    <!-- Subtitle / Colors -->
    <text x="24" y="118" fill="#78716C" font-family="system-ui, -apple-system, sans-serif" font-size="13">${p.descricao_curta.slice(0, 55)}...</text>
    
    <!-- Brand mark -->
    <text x="24" y="156" fill="${theme.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" letter-spacing="1">VAIDOSA PLUS SIZE • BIRIGUI SP</text>
  </g>
</svg>`;
}

let count = 0;
const allPaths = new Set();

for (const p of products) {
  p.imagens.forEach((imgRelPath, idx) => {
    allPaths.add(imgRelPath);
    const pubDest = path.resolve('public', imgRelPath);
    const imgDest = path.resolve('images', imgRelPath.replace(/^instagram\//, 'instagram/'));
    
    fs.mkdirSync(path.dirname(pubDest), { recursive: true });
    fs.mkdirSync(path.dirname(imgDest), { recursive: true });

    const svgContent = generateSvg(p, idx, p.imagens.length);
    fs.writeFileSync(pubDest, svgContent, 'utf8');
    fs.writeFileSync(imgDest, svgContent, 'utf8');
    count++;
  });
}

console.log(`Successfully generated placeholders for ${count} image paths (${allPaths.size} unique paths) in both public/ and images/`);
