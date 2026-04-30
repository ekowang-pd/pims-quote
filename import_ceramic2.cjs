const xl = require('xlsx');
const fs = require('fs');

// ===== 读取 Excel =====
const wb = xl.readFile('C:/Users/Administrator/Desktop/陶瓷-产品线汇总（无彩图） - 副本.xlsx');
const ws = wb.Sheets['Sheet1'];
const raw = xl.utils.sheet_to_json(ws, { header: 1, defval: '' });
const rows = raw.slice(2).filter(r => r[2]);
console.log('产品条数:', rows.length);

// ===== 提取子品类和供应商 =====
const catNames = [...new Set(rows.map(r => r[0]).filter(v => v))];
const supNames = [...new Set(rows.map(r => r[1]).filter(v => v))];

// ===== 生成子品类配置 =====
const subCatIdMap = {};
const subCategories = catNames.map((name, i) => {
  const id = 'ceramic-' + (i + 1).toString().padStart(2, '0');
  subCatIdMap[name] = id;
  const subRows = rows.filter(r => r[0] === name);
  const colors = [...new Set(subRows.map(r => r[14]).filter(v => v))];
  const sizes  = [...new Set(subRows.map(r => {
    const L = r[7], W = r[8];
    return (L && W) ? `${L}x${W}mm` : '';
  }).filter(v => v))];
  const surfaces = [...new Set(subRows.map(r => r[5]).filter(v => v && v !== '无检查'))];
  const crafts   = [...new Set(subRows.map(r => r[6]).filter(v => v && v !== '无检查'))];

  return { id, name, colors: colors.slice(0,10), sizes: sizes.slice(0,15), surfaces, crafts };
});

// ===== 生成供应商配置 =====
const supIdMap = {};
const suppliers = supNames.map((name, i) => {
  const id = 'cer-' + (i + 1).toString().padStart(3, '0');
  supIdMap[name] = id;
  return { id, name };
});

// ===== 生成产品列表 =====
const productLines = rows.map(row => {
  const [catName, supName, puid, nameCn, supModel, surface, craft, length, width, thickness, netWeight, , color, waterAbsorb, breakStrength, peiRating, slipR, mohs, , salesPrice] = row;
  if (!catName || !supName || !puid) return null;

  const subCatId = subCatIdMap[catName];
  const supId    = supIdMap[supName];
  if (!subCatId || !supId) return null;

  const L = Number(length)  || 0;
  const W = Number(width)    || 0;
  const H = Number(thickness)|| 0;
  const sizeStr = (L && W) ? `${L}x${W}mm` : '';
  const basePrice = Number(salesPrice) || 0;
  const netKg     = Number(netWeight) || 0;

  const descParts = [];
  if (surface     && surface !== '无检查') descParts.push('表面:' + surface);
  if (craft       && craft !== '无检查')   descParts.push('工艺:' + craft);
  if (waterAbsorb && waterAbsorb !== '无检查') descParts.push('吸水率:' + waterAbsorb);
  if (breakStrength && breakStrength !== '无检查') descParts.push('破坏强度:' + breakStrength);
  if (slipR       && slipR !== '无检查')  descParts.push('防滑系数:' + slipR);

  const attrs = {};
  if (surface     && surface !== '无检查') attrs['surface']     = surface;
  if (craft       && craft !== '无检查')   attrs['craft']       = craft;
  if (waterAbsorb && waterAbsorb !== '无检查') attrs['waterAbsorb'] = waterAbsorb;
  if (breakStrength && breakStrength !== '无检查') attrs['breakStrength'] = breakStrength;
  if (peiRating  && peiRating !== '无检查')  attrs['peiRating']  = peiRating;
  if (slipR      && slipR !== '无检查')      attrs['slipR']      = slipR;
  if (mohs       && mohs !== '无检查')        attrs['mohs']       = mohs;

  const libId = 'LIB-CER-' + puid.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase();

  return {
    id: null, // 稍后填充
    libraryId: libId,
    supplierProductId: puid,
    categoryId: 'ceramic',
    subCategoryId: subCatId,
    supplierId: supId,
    name: String(nameCn || supModel || puid || '').replace(/'/g, "\\'"),
    spec: (surface && surface !== '无检查') ? surface : '常规',
    color: color || '常规',
    size: sizeStr || '标准',
    unit: '平方米',
    moq: 1,
    basePrice: Math.round(basePrice * 1000) / 1000,
    length: L || undefined,
    width:  W || undefined,
    height: H || undefined,
    weight: netKg || undefined,
    description: String(descParts.join('；') || nameCn || '').replace(/'/g, "\\'"),
    attrs: Object.keys(attrs).length ? attrs : undefined,
    supplierPrices: [{
      supplierId: supId,
      supplierProductId: puid,
      price: Math.round(basePrice * 1000) / 1000,
      moq: 1,
      leadTime: '15-20天',
      remark: String(supModel || '').replace(/'/g, "\\'"),
    }],
  };
}).filter(Boolean);

console.log('有效产品:', productLines.length);

// ===== 生成 TypeScript subCategories 代码 =====
function tsSubCategories(subs) {
  return subs.map(sc => {
    const fgParts = [];
    if (sc.surfaces.length) {
      fgParts.push(`          { key: 'surface', label: '表面', type: 'tag', options: [${sc.surfaces.slice(0,10).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
    }
    if (sc.crafts.length) {
      fgParts.push(`          { key: 'craft', label: '工艺', type: 'tag', options: [${sc.crafts.slice(0,10).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
    }
    if (sc.colors.length) {
      fgParts.push(`          { key: 'color', label: '颜色', type: 'color', options: [${sc.colors.slice(0,12).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
    }
    if (sc.sizes.length) {
      fgParts.push(`          { key: 'size', label: '尺寸', type: 'tag', options: [${sc.sizes.slice(0,15).map(v => `{ value: '${v}', label: '${v}' }`).join(', ')}] }`);
    }
    const fgBlock = fgParts.length ? `\n${fgParts.join(',\n')}\n        ` : '';
    return `      {
        id: '${sc.id}',
        name: '${sc.name}',
        specs: [],
        colors: [${sc.colors.slice(0,8).map(c => `'${c}'`).join(', ')}],
        sizes: [${sc.sizes.slice(0,8).map(s => `'${s}'`).join(', ')}],
        unit: '平方米',
        filterGroups: [${fgBlock}],
      }`;
  }).join(',\n');
}

// ===== 生成 TypeScript suppliers 代码 =====
function tsSuppliers(sups) {
  return sups.map(s => `  { id: '${s.id}', name: '${s.name}', country: '中国', rating: 4, tags: ['工厂直营'] }`).join(',\n');
}

// ===== 生成 TypeScript products 代码 =====
function tsProducts(products) {
  return products.map((p, i) => {
    const attrsStr = p.attrs ? `,\n    attrs: ${JSON.stringify(p.attrs).replace(/"/g, "'")}` : '';
    const supPricesStr = `,\n    supplierPrices: ${JSON.stringify(p.supplierPrices).replace(/"/g, "'")}`;
    const L = p.length ? p.length : 'undefined';
    const W = p.width  ? p.width  : 'undefined';
    const H = p.height ? p.height : 'undefined';
    const WT = p.weight ? p.weight : 'undefined';
    return `  {
    id: 'cer-${(i+1).toString().padStart(5,'0')}', libraryId: '${p.libraryId}', supplierProductId: '${p.supplierProductId}',
    categoryId: 'ceramic', subCategoryId: '${p.subCategoryId}', supplierId: '${p.supplierId}',
    name: '${p.name}', spec: '${p.spec}', color: '${p.color}', size: '${p.size}',
    unit: '${p.unit}', moq: ${p.moq}, basePrice: ${p.basePrice},
    length: ${L}, width: ${W}, height: ${H}, weight: ${WT},
    description: '${p.description}'${attrsStr}${supPricesStr}
  }`;
  }).join(',\n');
}

// ===== 输出结果 =====
console.log('\n=== CATEGORIES subCategories (陶瓷24个) ===\n' + tsSubCategories(subCategories));
console.log('\n=== SUPPLIERS (新增陶瓷供应商) ===\n' + tsSuppliers(suppliers));
console.log('\n=== PRODUCTS (共' + productLines.length + '条) ===\n' + tsProducts(productLines.slice(0, 5)) + '\n  ... 共' + productLines.length + '条产品');

// 保存完整数据到 JSON
fs.writeFileSync('e:/pims设计/app/ceramic_full_data.json', JSON.stringify({
  suppliers,
  subCategories,
  products: productLines
}, null, 2), 'utf8');
console.log('\n完整数据已写入 ceramic_full_data.json');
