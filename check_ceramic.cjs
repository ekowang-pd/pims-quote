const fs = require('fs');
const content = fs.readFileSync('src/data/ceramic_products.ts', 'utf8');
const lines = content.split('\n');
console.log('total lines:', lines.length);

// 找空对象或有问题的行
let blankObjects = 0;
let undefinedCategoryId = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].trim();
  if (l === '{},' || l === '{}') blankObjects++;
  if (l.includes("categoryId: ''") || l.includes('categoryId: undefined')) undefinedCategoryId++;
}
console.log('blank objects:', blankObjects);
console.log('undefined categoryId:', undefinedCategoryId);

// 检查导出的数组有没有问题
// 找到数组开始和结束
const startIdx = content.indexOf('export const CERAMIC_PRODUCTS');
const endMatch = content.lastIndexOf('];');
console.log('array start found:', startIdx > -1);
console.log('array end found:', endMatch > -1);

// 统计产品数量（每个产品开头是 { id: 'cer-）
const productMatches = content.match(/\{ id: 'cer-/g);
console.log('product count:', productMatches ? productMatches.length : 0);
