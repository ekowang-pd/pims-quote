const { CERAMIC_PRODUCTS } = require('./temp_check.cjs');
const fs = require('fs');

// 过滤掉 undefined，获取干净的数组
const clean = [];
for (let i = 0; i < CERAMIC_PRODUCTS.length; i++) {
  if (CERAMIC_PRODUCTS[i] !== undefined && CERAMIC_PRODUCTS[i] !== null) {
    clean.push(CERAMIC_PRODUCTS[i]);
  }
}

console.log('Clean array length:', clean.length);
console.log('Sample:', JSON.stringify(clean[0]).substring(0, 100));

// 生成 ts 文件
let lines = [];
lines.push("import type { StandardProduct } from '../types';");
lines.push('');
lines.push('export const CERAMIC_PRODUCTS: StandardProduct[] = [');

clean.forEach((p) => {
  // 将 attrs 对象展开
  const attrsStr = p.attrs 
    ? `{ ${Object.entries(p.attrs).map(([k,v]) => `${k}: '${String(v).replace(/'/g, "\\'")}'`).join(', ')} }` 
    : '{}';
  
  // 转义字符串值中的单引号
  const escape = (s) => s ? String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") : '';
  
  const line = `  { id: '${escape(p.id)}', libraryId: '${escape(p.libraryId)}', supplierProductId: '${escape(p.supplierProductId)}', categoryId: '${escape(p.categoryId)}', subCategoryId: '${escape(p.subCategoryId)}', supplierId: '${escape(p.supplierId)}', name: '${escape(p.name)}', spec: '${escape(p.spec)}', color: '${escape(p.color)}', size: '${escape(p.size)}', unit: '${escape(p.unit)}', moq: ${p.moq || 1}, basePrice: ${p.basePrice || 0}, imageUrl: '${escape(p.imageUrl)}', length: ${p.length || 0}, width: ${p.width || 0}, height: ${p.height || 0}, weight: ${p.weight || 0}, description: '${escape(p.description)}', attrs: ${attrsStr} },`;
  lines.push(line);
});

lines.push('];');

const output = lines.join('\n');
fs.writeFileSync('src/data/ceramic_products.ts', output, 'utf8');
console.log('✅ Written to src/data/ceramic_products.ts');
console.log('File size:', Math.round(output.length / 1024), 'KB');
