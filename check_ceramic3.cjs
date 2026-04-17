const { CERAMIC_PRODUCTS } = require('./temp_check.cjs');
console.log('length:', CERAMIC_PRODUCTS.length);
const bad = CERAMIC_PRODUCTS.map((p, i) => ({i, p})).filter(({p}) => !p || !p.categoryId);
console.log('bad entries:', bad.length);
if (bad.length > 0) {
  console.log('first bad idx:', bad[0].i);
  console.log('first bad val:', JSON.stringify(bad[0].p).substring(0, 200));
}
