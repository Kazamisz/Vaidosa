import fs from 'fs';
import path from 'path';

const productsPath = path.resolve('src/data/products.json');
if (!fs.existsSync(productsPath)) {
  console.error('ERRO: products.json não encontrado');
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// 1. Confirm 140 products
if (products.length !== 140) {
  console.error(`ERRO: Esperava 140 produtos, mas encontrou ${products.length}`);
  process.exit(1);
}

const ids = new Set();
const seenPaths = new Set();
let totalReferences = 0;
let missingFiles = 0;

for (const p of products) {
  // Check unique ID
  if (ids.has(p.id)) {
    console.error(`ERRO: ID duplicado encontrado: ${p.id}`);
    process.exit(1);
  }
  ids.add(p.id);

  // Check essential fields
  if (!p.id || !p.titulo || !p.categoria || !Array.isArray(p.imagens) || p.imagens.length === 0) {
    console.error(`ERRO: Produto ${p.id} com campos essenciais ausentes ou inválidos`);
    process.exit(1);
  }

  for (const imgPath of p.imagens) {
    totalReferences++;
    if (seenPaths.has(imgPath)) {
      console.error(`ERRO: Imagem ${imgPath} duplicada entre produtos`);
      process.exit(1);
    }
    seenPaths.add(imgPath);

    const fullPath = path.resolve('public', imgPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`ERRO: Arquivo físico ausente em public/: ${imgPath}`);
      missingFiles++;
    }
  }
}

console.log('--- AUDITORIA DE CATÁLOGO ---');
console.log(`✓ Total de produtos: ${products.length}`);
console.log(`✓ Total de referências de imagens: ${totalReferences}`);
console.log(`✓ Caminhos únicos: ${seenPaths.size}`);
console.log(`✓ IDs únicos validados: ${ids.size}`);
console.log(`✓ Arquivos físicos ausentes: ${missingFiles}`);

if (missingFiles > 0) {
  process.exit(1);
}

console.log('✓ AUDITORIA CONCLUÍDA COM SUCESSO! Catálogo 100% íntegro.');
