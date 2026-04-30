const xl = require('xlsx');
const fs = require('fs');

// ===== 1. 读取 Excel =====
const wb = xl.readFile('C:/Users/Administrator/Desktop/陶瓷-产品线汇总（无彩图） - 副本.xlsx');
const ws = wb.Sheets['Sheet1'];
const raw = xl.utils.sheet_to_json(ws, { header: 1, defval: '' });
// Row 0 = 标题, Row 1 = 表头, Rows 2+ = 数据
const rows = raw.slice(2).filter(r => r[2]); // 跳过空行

console.log('读取到', rows.length, '条产品数据');

// ===== 2. Excel 列索引（基于表头） =====
// 0:产品小类, 1:供应商, 2:Puid, 3:名称(中), 4:供应商型号, 5:表面, 6:工艺,
// 7:长度mm, 8:宽度mm, 9:厚度mm, 10:净重KG, 11:毛重KG,
// 12:SQM/CTN, 13:PCS/CTN, 14:颜色, 15:吸水率, 16:破坏强度,
// 17:耐磨度PEI, 18:防滑系数R值, 19:莫氏硬度, 20:税点, 21:销售价(不含佣金)

// ===== 3. 提取子品类和供应商 =====
const catNames = [...new Set(rows.map(r => r[0]).filter(v => v))];
const supNames = [...new Set(rows.map(r => r[1]).filter(v => v))];
console.log('子品类:', catNames.length, catNames);
console.log('供应商:', supNames.length, supNames);

// ===== 4. 生成子品类数据（24个）=====
const subCatIdMap = {};
const subCategories = catNames.map((name, i) => {
  const id = 'ceramic-' + (i + 1).toString().padStart(2, '0');
  subCatIdMap[name] = id;

  // 从产品数据中提取各类选项
  const subRows = rows.filter(r => r[0] === name);
  const surfaces = [...new Set(subRows.map(r => r[5]).filter(v => v && v !== '无检查'))];
  const crafts  = [...new Set(subRows.map(r => r[6]).filter(v => v && v !== '无检查'))];
  const colors  = [...new Set(subRows.map(r => r[14]).filter(v => v))];
  // 尺寸从长宽计算
  const sizes   = [...new Set(subRows.map(r => r[7] && r[8] ? `${r[7]}x${r[8]}mm` : '').filter(v => v))];

  const surfaceOpts = surfaces.map(v => ({ value: v, label: v }));
  const colorOpts   = colors.slice(0, 12).map(v => ({ value: v, label: v }));
  const sizeOpts    = sizes.slice(0, 20).map(v => ({ value: v, label: v }));

  const filterGroups = [];
  if (surfaceOpts.length > 0) filterGroups.push({ key: 'surface', label: '表面', type: 'tag', options: surfaceOpts });
  if (crafts.length > 0)      filterGroups.push({ key: 'craft',   label: '工艺', type: 'tag', options: crafts.map(v => ({ value: v, label: v })) });
  if (colorOpts.length > 0)   filterGroups.push({ key: 'color',   label: '颜色', type: 'color', options: colorOpts.map(c => ({ value: c, label: c })) });
  if (sizeOpts.length > 0)    filterGroups.push({ key: 'size',    label: '尺寸', type: 'tag', options: sizeOpts.map(v => ({ value: v, label: v })) });

  return {
    id, name,
    specs: [],
    colors,
    sizes: sizeOpts.map(o => o.value),
    unit: '平方米',
    filterGroups,
  };
});

// ===== 5. 生成供应商数据（21个）=====
const supIdMap = {};
const suppliers = supNames.map((name, i) => {
  const id = 'cer-' + (i + 1).toString().padStart(3, '0');
  supIdMap[name] = id;
  return { id, name, country: '中国', rating: 4, tags: ['工厂直营'] };
});

// ===== 6. 生成产品数据 =====
let productId = 1;
const productLines = [];

rows.forEach(row => {
  const [catName, supName, puid, nameCn, supModel, surface, craft, length, width, thickness, netWeight, grossWeight, sqmPerCtn, pcsPerCtn, color, waterAbsorb, breakStrength, peiRating, slipR, mohs, taxPoint, salesPrice] = row;

  if (!catName || !supName || !puid) return;

  const subCatId = subCatIdMap[catName];
  const supId    = supIdMap[supName];
  if (!subCatId || !supId) return;

  // 产品库ID
  const libraryId = 'LIB-CER-' + puid.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase();

  // size 格式
  const L = Number(length) || 0;
  const W = Number(width)  || 0;
  const H = Number(thickness) || 0;
  const sizeStr = L && W ? `${L}x${W}mm` : '';
  const sizeDetail = L && W && H ? `${L}x${W}x${H}mm` : (sizeStr || '');

  const basePrice = Number(salesPrice) || 0;
  const netKg     = Number(netWeight)  || 0;
  const grossKg   = Number(grossWeight) || 0;

  // 描述字段
  const descParts = [];
  if (surface && surface !== '无检查') descParts.push('表面:' + surface);
  if (craft    && craft !== '无检查')  descParts.push('工艺:' + craft);
  if (waterAbsorb && waterAbsorb !== '无检查') descParts.push('吸水率:' + waterAbsorb);
  if (breakStrength && breakStrength !== '无检查') descParts.push('破坏强度:' + breakStrength);
  if (slipR && slipR !== '无检查') descParts.push('防滑系数:' + slipR);

  const attrs = {};
  if (surface    && surface !== '无检查') attrs['surface']    = surface;
  if (craft      && craft !== '无检查')   attrs['craft']      = craft;
  if (waterAbsorb && waterAbsorb !== '无检查') attrs['waterAbsorb'] = waterAbsorb;
  if (breakStrength && breakStrength !== '无检查') attrs['breakStrength'] = breakStrength;
  if (peiRating  && peiRating !== '无检查')  attrs['peiRating']   = peiRating;
  if (slipR      && slipR !== '无检查')      attrs['slipR']       = slipR;
  if (mohs       && mohs !== '无检查')        attrs['mohs']       = mohs;

  const prod = {
    id: 'cer-' + productId.toString().padStart(5, '0'),
    libraryId,
    supplierProductId: puid,
    categoryId: 'ceramic',
    subCategoryId: subCatId,
    supplierId: supId,
    name: nameCn || supModel || puid,
    spec: surface && surface !== '无检查' ? surface : '常规',
    color: color || '常规',
    size: sizeStr || '标准',
    unit: '平方米',
    moq: 1,
    basePrice,
    length: L || undefined,
    width: W || undefined,
    height: H || undefined,
    weight: netKg || undefined,
    description: descParts.join('；') || nameCn,
    attrs: Object.keys(attrs).length > 0 ? attrs : undefined,
    supplierPrices: [{
      supplierId: supId,
      supplierProductId: puid,
      price: basePrice,
      moq: 1,
      leadTime: '15-20天',
      remark: supModel || '',
    }],
  };

  productId++;
  productLines.push(prod);
});

console.log('生成', productLines.length, '个产品');

// ===== 7. 生成 TypeScript 代码 =====

// 生成 subCategories
const subCatTS = subCategories.map(sc => `      {
        id: '${sc.id}',
        name: '${sc.name}',
        specs: [],
        colors: [${sc.colors.slice(0,8).map(c => `'${c}'`).join(', ')}],
        sizes: [${sc.sizes.slice(0,8).map(s => `'${s}'`).join(', ')}],
        unit: '平方米',
        filterGroups: [
${sc.filterGroups.map(fg => `          { key: '${fg.key}', label: '${fg.label}', type: '${fg.type}', options: [${fg.options.slice(0,10).map(o => `{ value: '${o.value}', label: '${o.label}'${o.colorHex ? `, colorHex: '${o.colorHex}'` : ''}`).join(', ')}] }`).join(',\n')}
        ],
      }`).join(',\n');

// 生成 suppliers
const supTS = suppliers.map(s => `  { id: '${s.id}', name: '${s.name}', country: '中国', rating: 4, tags: ['工厂直营'] }`).join(',\n');

// 生成 products
const prodLinesTS = productLines.slice(0, 500).map(p => {
  const attrs = p.attrs ? `,\n    attrs: ${JSON.stringify(p.attrs)}` : '';
  const supPrices = p.supplierPrices ? `,\n    supplierPrices: ${JSON.stringify(p.supplierPrices)}` : '';
  return `  {
    id: '${p.id}', libraryId: '${p.libraryId}', supplierProductId: '${p.supplierProductId}',
    categoryId: '${p.categoryId}', subCategoryId: '${p.subCategoryId}', supplierId: '${p.supplierId}',
    name: '${p.name}', spec: '${p.spec}', color: '${p.color}', size: '${p.size}',
    unit: '${p.unit}', moq: ${p.moq}, basePrice: ${p.basePrice},
    length: ${p.length || 'undefined'}, width: ${p.width || 'undefined'}, height: ${p.height || 'undefined'},
    weight: ${p.weight || 'undefined'},
    description: '${(p.description || '').replace(/'/g, "\\'")}'${attrs}${supPrices}
  }`;
}).join(',\n');

// 输出结果
console.log('\n===== CATEGORIES (陶瓷部分) =====');
console.log(subCatTS);
console.log('\n===== SUPPLIERS =====');
console.log(supTS);
console.log('\n===== PRODUCTS (前500条) =====');
console.log(prodLinesTS);
console.log('\n总计产品数:', productLines.length);

// 同时输出完整产品数据到 JSON 文件供后续使用
fs.writeFileSync('e:/pims设计/app/ceramic_products_full.json', JSON.stringify(productLines, null, 2), 'utf8');
console.log('\n完整产品数据已写入 ceramic_products_full.json');
