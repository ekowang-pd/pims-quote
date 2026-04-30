const xl = require('xlsx');
const fs = require('fs');

// 列索引（基于 Excel 表头）
const COL = {
  CAT: 0, SUP: 1, PUID: 2, NAME: 3, MODEL: 4,
  SURFACE: 5, CRAFT: 6,
  L: 7, W: 8, H: 9,
  NET_WEIGHT: 10, GROSS_WEIGHT: 11,
  SQM_CTN: 12, PCS_CTN: 13,
  COLOR: 14, WATER_ABSORB: 15, BREAK_STRENGTH: 16,
  PEI: 17, SLIP_R: 18, MOHS: 19,
  TAX: 20, PRICE: 21,
};

const wb = xl.readFile('C:/Users/Administrator/Desktop/陶瓷-产品线汇总（无彩图） - 副本.xlsx');
const raw = xl.utils.sheet_to_json(wb.Sheets['Sheet1'], { header: 1, defval: '' });
const rows = raw.slice(2).filter(r => r[COL.PUID]);
console.log('产品:', rows.length);

const catNames = [...new Set(rows.map(r => r[COL.CAT]).filter(Boolean))];
const supNames = [...new Set(rows.map(r => r[COL.SUP]).filter(Boolean))];

// subCategory id map
const subCatIdMap = {};
const subCategories = catNames.map((name, i) => {
  const id = 'ceramic-' + (i + 1).toString().padStart(2, '0');
  subCatIdMap[name] = id;
  const sr = rows.filter(r => r[COL.CAT] === name);
  const colors  = [...new Set(sr.map(r => r[COL.COLOR]).filter(Boolean))];
  const sizes   = [...new Set(sr.map(r => {
    const L = r[COL.L], W = r[COL.W];
    return (L && W) ? `${L}x${W}mm` : '';
  }).filter(Boolean))];
  const surfaces = [...new Set(sr.map(r => r[COL.SURFACE]).filter(v => v && v !== '无检查'))];
  const crafts   = [...new Set(sr.map(r => r[COL.CRAFT]).filter(v => v && v !== '无检查'))];
  return { id, name, colors: colors.slice(0,10), sizes: sizes.slice(0,15), surfaces, crafts };
});

// supplier id map
const supIdMap = {};
const suppliers = supNames.map((name, i) => {
  const id = 'cer-' + (i + 1).toString().padStart(3, '0');
  supIdMap[name] = id;
  return { id, name };
});

// products
const products = rows.map((r, idx) => {
  const catName = r[COL.CAT], supName = r[COL.SUP], puid = r[COL.PUID];
  if (!catName || !supName || !puid) return null;
  const subCatId = subCatIdMap[catName], supId = supIdMap[supName];
  if (!subCatId || !supId) return null;

  const L = Number(r[COL.L]) || 0, W = Number(r[COL.W]) || 0, H = Number(r[COL.H]) || 0;
  const sizeStr = (L && W) ? `${L}x${W}mm` : '';
  const price   = Math.round(Number(r[COL.PRICE]) * 1000) / 1000;
  const netKg   = Number(r[COL.NET_WEIGHT]) || 0;

  const descParts = [];
  const add = (v, k) => { if (v && v !== '无检查') descParts.push(k + ':' + v); };
  add(r[COL.SURFACE], '表面');
  add(r[COL.CRAFT], '工艺');
  add(r[COL.WATER_ABSORB], '吸水率');
  add(r[COL.BREAK_STRENGTH], '破坏强度');
  add(r[COL.SLIP_R], '防滑系数');
  add(r[COL.PEI], '耐磨PEI');

  const attrs = {};
  const setA = (v, k) => { if (v && v !== '无检查') attrs[k] = String(v); };
  setA(r[COL.SURFACE], 'surface');
  setA(r[COL.CRAFT], 'craft');
  setA(r[COL.WATER_ABSORB], 'waterAbsorb');
  setA(r[COL.BREAK_STRENGTH], 'breakStrength');
  setA(r[COL.PEI], 'peiRating');
  setA(r[COL.SLIP_R], 'slipR');
  setA(r[COL.MOHS], 'mohs');
  setA(r[COL.SQM_CTN], 'sqmPerCtn');
  setA(r[COL.PCS_CTN], 'pcsPerCtn');

  const escape = s => String(s || '').replace(/'/g, "\\'");
  const libId = 'LIB-CER-' + puid.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase();

  return {
    index: idx,
    libraryId: libId,
    supplierProductId: puid,
    categoryId: 'ceramic',
    subCategoryId: subCatId,
    supplierId: supId,
    name: escape(r[COL.NAME] || r[COL.MODEL] || puid),
    spec: escape(r[COL.SURFACE] || '常规'),
    color: escape(r[COL.COLOR] || '常规'),
    size: sizeStr || '标准',
    unit: '平方米',
    moq: 1,
    basePrice: price,
    length: L || undefined,
    width:  W || undefined,
    height: H || undefined,
    weight: netKg || undefined,
    description: escape(descParts.join('；') || r[COL.NAME]),
    attrs: Object.keys(attrs).length ? attrs : undefined,
    supplierPrices: [{
      supplierId: supId,
      supplierProductId: puid,
      price,
      moq: 1,
      leadTime: '15-20天',
      remark: escape(r[COL.MODEL]),
    }],
  };
}).filter(Boolean);

console.log('有效产品:', products.length);

// ===== 输出 TS 代码 =====

// subCategories TS
const subCatTS = subCategories.map(sc => {
  const fgs = [];
  if (sc.surfaces.length) fgs.push(`          { key: 'surface', label: '表面', type: 'tag', options: [${sc.surfaces.slice(0,10).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
  if (sc.crafts.length)  fgs.push(`          { key: 'craft',   label: '工艺', type: 'tag', options: [${sc.crafts.slice(0,10).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
  if (sc.colors.length)    fgs.push(`          { key: 'color',   label: '颜色', type: 'color', options: [${sc.colors.slice(0,12).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
  if (sc.sizes.length)    fgs.push(`          { key: 'size',    label: '尺寸', type: 'tag', options: [${sc.sizes.slice(0,15).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
  return `      { id: '${sc.id}', name: '${sc.name}', specs: [], colors: [${sc.colors.slice(0,8).map(c => `'${c}'`).join(', ')}], sizes: [${sc.sizes.slice(0,8).map(s => `'${s}'`).join(', ')}], unit: '平方米', filterGroups: [${fgs.join(',\n')}], }`;
}).join(',\n');

// suppliers TS
const supTS = suppliers.map(s => `  { id: '${s.id}', name: '${s.name}', country: '中国', rating: 4, tags: ['工厂直营'] }`).join(',\n');

// products TS (all 401)
const prodTS = products.map((p, i) => {
  const L = p.length, W = p.width, H = p.height, WT = p.weight;
  const attrsStr = p.attrs ? `,\n    attrs: ${JSON.stringify(p.attrs)}` : '';
  const spStr    = `,\n    supplierPrices: ${JSON.stringify(p.supplierPrices)}`;
  return `  { id: 'cer-${(i+1).toString().padStart(5,'0')}', libraryId: '${p.libraryId}', supplierProductId: '${p.supplierProductId}', categoryId: 'ceramic', subCategoryId: '${p.subCategoryId}', supplierId: '${p.supplierId}', name: '${p.name}', spec: '${p.spec}', color: '${p.color}', size: '${p.size}', unit: '平方米', moq: 1, basePrice: ${p.basePrice}, length: ${L||'undefined'}, width: ${W||'undefined'}, height: ${H||'undefined'}, weight: ${WT||'undefined'}, description: '${p.description}'${attrsStr}${spStr} }`;
}).join(',\n');

console.log('\n=== SUB CATEGORIES ===\n' + subCatTS);
console.log('\n=== SUPPLIERS ===\n' + supTS);
console.log('\n=== PRODUCTS (first 3) ===\n' + prodTS.split(',\n  { id').slice(0,3).join(',\n  { id'));

// 保存
fs.writeFileSync('e:/pims设计/app/ceramic_data.json', JSON.stringify({ suppliers, subCategories, products }, null, 2));
fs.writeFileSync('e:/pims设计/app/ceramic_subcategories.ts', '// Auto-generated\nexport const CERAMIC_SUBCATEGORIES = [\n' + subCatTS + '\n];\n');
fs.writeFileSync('e:/pims设计/app/ceramic_suppliers.ts', '// Auto-generated\nexport const CERAMIC_SUPPLIERS = [\n' + supTS + '\n];\n');
fs.writeFileSync('e:/pims设计/app/ceramic_products.ts', '// Auto-generated, ' + products.length + ' products\nexport const CERAMIC_PRODUCTS = [\n' + prodTS + '\n];\n');
console.log('\n已写入: ceramic_data.json, ceramic_subcategories.ts, ceramic_suppliers.ts, ceramic_products.ts');
