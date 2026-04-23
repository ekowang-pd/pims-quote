// 浴室柜计价公式配置
// 计价规则：单价 = MAX(CEILING(长度mm/1000, 100), 800) / 1000 × 单位系数
//           即：实际长度(向上取整到100mm,最小800mm) / 1000 × 系数

// ===== 主柜柜体计价配置 =====
// 格式：[柜型Id, { [材质Id]: 单位系数 }]
export const VANITY_CABINET_PRICE: Record<string, Record<string, number>> = {
  // 吊柜
  'hanging-modern': { 'mianqi': 600 },
  'hanging-flat': {
    'xiangjiao': 1000,
    'baixing_hongxiang': 1300,
    'wujinmu': 1399,
    'heihutao': 1500,
    'baixiang': 1600,
  },
  'hanging-arc': {
    'xiangjiao': 1399,
    'baixing_hongxiang': 1900,
    'wujinmu': 2000,
    'heihutao': 2100,
    'baixiang': 2200,
  },
  'hanging-line': {
    'xiangjiao': 1500,
    'baixing_hongxiang': 1700,
    'wujinmu': 1900,
    'heihutao': 2100,
    'baixiang': 2200,
  },
  'hanging-carved': {
    'xiangjiao': 1500,
    'baixing_hongxiang': 1700,
    'wujinmu': 1900,
    'heihutao': 2100,
    'baixiang': 2200,
  },
  // 落地柜
  'floor-modern': { 'mianqi': 850 },
  'floor-flat': {
    'xiangjiao': 1300,
    'baixing_hongxiang': 1700,
    'wujinmu': 1800,
    'heihutao': 1900,
    'baixiang': 2000,
  },
  'floor-arc': {
    'xiangjiao': 1800,
    'baixing_hongxiang': 2300,
    'wujinmu': 2399,
    'heihutao': 2600,
    'baixiang': 2700,
  },
  'floor-line': {
    'xiangjiao': 1800,
    'baixing_hongxiang': 2100,
    'wujinmu': 2300,
    'heihutao': 2500,
    'baixiang': 2500,
  },
};

// ===== 主柜增配计价配置 =====
// quantity: 固定单价 × 数量
// fixed: 固定总价
export const VANITY_CABINET_ADDONS: Record<string, { type: 'quantity' | 'fixed'; unitPrice: number }> = {
  // 抽屉
  'drawer-mianqi': { type: 'quantity', unitPrice: 80 },  // 免漆板抽屉
  'drawer-paint': { type: 'quantity', unitPrice: 100 }, // 烤漆板抽屉
  // 门板锣纹线条
  'groove-front': { type: 'fixed', unitPrice: 200 },   // 正面门板/抽屉板
  'groove-side': { type: 'fixed', unitPrice: 200 },    // 两边侧板
  'groove-three': { type: 'fixed', unitPrice: 399 },   // 三边
  // 其他增配（数量型）
  'arc-column': { type: 'quantity', unitPrice: 30 },   // 圆弧柱头
  'frame-structure': { type: 'quantity', unitPrice: 50 }, // 门板拼框
  'led-strip': { type: 'quantity', unitPrice: 100 },  // 灯带
  'aluminum-wrap': { type: 'quantity', unitPrice: 200 }, // 包铝合金
  // 增配选项
  'extra-shelf-mianqi': { type: 'quantity', unitPrice: 300 }, // 下层板免漆
  'extra-shelf-paint': { type: 'quantity', unitPrice: 400 }, // 下层板烤漆
  'hanging-bracket': { type: 'quantity', unitPrice: 100 },   // 吊柜支架
  'hettich-hinge': { type: 'quantity', unitPrice: 20 },      // 升级海蒂诗铰链
  'blum-hinge': { type: 'quantity', unitPrice: 25 },         // 升级百隆铰链
  'hettich-rail': { type: 'quantity', unitPrice: 60 },       // 海蒂诗三托底节导轨
  'blum-system': { type: 'quantity', unitPrice: 200 },      // 升级百隆
  'horse-drawer': { type: 'quantity', unitPrice: 120 },      // 升级骑马抽
  'magic-drawer': { type: 'quantity', unitPrice: 180 },     // 升级魔力发光抽
  'tissue-hole': { type: 'quantity', unitPrice: 50 },       // 抽纸孔
  'beauty-shelf': { type: 'quantity', unitPrice: 100 },      // 内置美妆架
  'hairdryer-holder': { type: 'quantity', unitPrice: 50 },   // 吹风筒架
  'power-outlet': { type: 'quantity', unitPrice: 50 },      // 电源插座
  'multi-shelf': { type: 'quantity', unitPrice: 200 },       // 多功能置物架
};

// ===== 包装计价配置 =====
// 格式：[柜型Id]: 单位系数
export const VANITY_PACKING_PRICE: Record<string, number> = {
  'hanging-cabinet': 80,  // 吊柜
  'floor-cabinet': 100,   // 主柜
  'single-mirror': 70,   // 单镜
  'mirror-cabinet': 80,   // 镜柜
  'countertop-plywood': 90,  // 夹板打包
  'countertop-box': 180,     // 夹板木箱打包
};

// ===== 计价公式核心函数 =====
/**
 * 计算主柜柜体价格
 * @param lengthMm 长度(mm)
 * @param cabinetType 柜型Id
 * @param material 材质Id
 * @returns 价格(元)
 */
export function calcCabinetPrice(lengthMm: number, cabinetType: string, material: string): number {
  const rates = VANITY_CABINET_PRICE[cabinetType];
  if (!rates) return 0;
  const rate = rates[material];
  if (!rate) return 0;
  // Excel: MAX(CEILING(长度mm/1000, 100), 800) / 1000 × 系数
  // CEILING(value, 100) 在 JS 中用 Math.ceil(value / 100) * 100 实现
  const baseLength = Math.max(Math.ceil(lengthMm / 100) * 100, 800);
  return (baseLength / 1000) * rate;
}

/**
 * 计算增配项价格
 * @param addonId 增配项Id
 * @param quantity 数量
 * @returns 价格(元)
 */
export function calcAddonPrice(addonId: string, quantity: number): number {
  const config = VANITY_CABINET_ADDONS[addonId];
  if (!config) return 0;
  if (config.type === 'fixed') return config.unitPrice;
  return config.unitPrice * quantity;
}

/**
 * 计算包装费用
 * @param packingType 包装类型Id
 * @param lengthMm 长度(mm)
 * @returns 价格(元)
 */
export function calcPackingPrice(packingType: string, lengthMm: number): number {
  const rate = VANITY_PACKING_PRICE[packingType];
  if (rate === undefined) return 0;
  const baseLength = Math.max(Math.ceil(lengthMm / 100) * 100, 800);
  return (baseLength / 1000) * rate;
}
