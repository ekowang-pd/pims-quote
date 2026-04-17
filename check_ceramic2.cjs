// 用 esbuild 预编译 ts 再分析
const { execSync } = require('child_process');
const fs = require('fs');

// 编译 ceramic_products.ts
try {
  execSync('npx esbuild src/data/ceramic_products.ts --bundle=false --format=cjs --outfile=./temp_check.cjs', { stdio: 'inherit' });
  const { CERAMIC_PRODUCTS } = require('./temp_check.cjs');
  console.log('CERAMIC_PRODUCTS type:', typeof CERAMIC_PRODUCTS);
  console.log('CERAMIC_PRODUCTS length:', Array.isArray(CERAMIC_PRODUCTS) ? CERAMIC_PRODUCTS.length : 'not array');
  
  if (Array.isArray(CERAMIC_PRODUCTS)) {
    const undefs = CERAMIC_PRODUCTS.filter(p => p === undefined || p === null);
    console.log('undefined/null entries:', undefs.length);
    const noCategory = CERAMIC_PRODUCTS.filter(p => p && !p.categoryId);
    console.log('entries without categoryId:', noCategory.length);
    if (noCategory.length > 0) {
      console.log('first bad entry:', JSON.stringify(noCategory[0]).substring(0, 200));
    }
    const undefinedEntries = CERAMIC_PRODUCTS.map((p, i) => ({ i, p })).filter(({ p }) => p === undefined);
    if (undefinedEntries.length > 0) {
      console.log('undefined at indices:', undefinedEntries.map(e => e.i).slice(0, 10));
    }
  }
} catch(e) {
  console.error('Error:', e.message);
} finally {
  try { fs.unlinkSync('./temp_check.cjs'); } catch(e) {}
}
