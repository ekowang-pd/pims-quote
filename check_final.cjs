const { CERAMIC_PRODUCTS } = require('./temp_check2.cjs');
console.log('length:', CERAMIC_PRODUCTS.length);
let undefCount = 0;
for (let i = 0; i < CERAMIC_PRODUCTS.length; i++) {
  if (CERAMIC_PRODUCTS[i] === undefined) undefCount++;
}
console.log('undefined entries:', undefCount);
console.log('✅ Array is clean:', undefCount === 0);
