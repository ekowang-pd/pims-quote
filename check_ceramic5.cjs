const { CERAMIC_PRODUCTS } = require('./temp_check.cjs');
console.log('Array.isArray:', Array.isArray(CERAMIC_PRODUCTS));
console.log('length property:', CERAMIC_PRODUCTS.length);

// 检查稀疏数组
let definedCount = 0;
let undefinedCount = 0;
const undefinedIndices = [];
for (let i = 0; i < CERAMIC_PRODUCTS.length; i++) {
  if (CERAMIC_PRODUCTS[i] === undefined) {
    undefinedCount++;
    if (undefinedIndices.length < 5) undefinedIndices.push(i);
  } else {
    definedCount++;
  }
}
console.log('defined entries:', definedCount);
console.log('undefined entries:', undefinedCount);
console.log('first few undefined indices:', undefinedIndices);

// 检查是否是稀疏数组（hasOwnProperty）
let ownPropCount = 0;
for (let i = 0; i < CERAMIC_PRODUCTS.length; i++) {
  if (Object.prototype.hasOwnProperty.call(CERAMIC_PRODUCTS, i)) ownPropCount++;
}
console.log('own property count:', ownPropCount);
