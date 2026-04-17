const { CERAMIC_PRODUCTS } = require('./temp_check.cjs');
console.log('total length:', CERAMIC_PRODUCTS.length);

// 分析每个条目
const stats = {};
CERAMIC_PRODUCTS.forEach((p, i) => {
  if (!p) { console.log('NULL at', i); return; }
  const type = typeof p;
  if (type !== 'object') { console.log('non-object at', i, ':', type); return; }
  const keys = Object.keys(p).sort().join(',');
  stats[keys] = (stats[keys] || 0) + 1;
});

console.log('\nObject shapes:');
Object.entries(stats).forEach(([keys, count]) => {
  console.log(`  [${count}x] keys: ${keys.substring(0, 100)}`);
});

// 找不含 categoryId 的
const noCat = CERAMIC_PRODUCTS.filter(p => p && !p.categoryId);
console.log('\nno-categoryId entries:', noCat.length);
if (noCat.length > 0) console.log('example:', JSON.stringify(noCat[0]).substring(0, 200));
