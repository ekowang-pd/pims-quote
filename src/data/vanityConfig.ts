// ===== 浴室柜配置数据 =====

import type { VanityCabinetConfig } from '../types';

// 导入图片
import hangingCabinet1 from '../assets/vanity/hanging-cabinet-1.png';
import floorCabinet1 from '../assets/vanity/floor-cabinet-1.png';
import mianqiCabinet from '../assets/vanity/mianqi-cabinet.png';
import flatLacquerHanging from '../assets/vanity/flat-lacquer-hanging.png';
import flatLacquerFloor from '../assets/vanity/flat-lacquer-floor.png';
import arcLacquerHanging from '../assets/vanity/arc-lacquer-hanging.png';
import arcLacquerFloor from '../assets/vanity/arc-lacquer-floor.png';
import lineCabinet from '../assets/vanity/line-cabinet.png';
import carvedCabinet from '../assets/vanity/carved-cabinet.png';
import luowenFrontDetail from '../assets/vanity/luowen-front-detail.png';
import luowenSideEdge from '../assets/vanity/luowen-side-edge.png';
import luowenThreeEdge from '../assets/vanity/luowen-three-edge.png';
import flatCabinetArcPost from '../assets/vanity/flat-cabinet-arc-post.png';
import doorFrameDetail from '../assets/vanity/door-frame-detail.png';

// 安装类型
export const VANITY_INSTALL_TYPES = [
  { id: 'hanging', label: '吊柜', image: hangingCabinet1 },
  { id: 'floor', label: '落地柜', image: floorCabinet1 },
];

// 吊柜柜型
export const VANITY_HANGING_CABINET_TYPES = [
  {
    id: 'hanging-mianqi', label: '现代免漆板柜', installType: 'hanging', icon: '🪵',
    image: mianqiCabinet,
    materials: [
      { id: 'mianqi', label: '免漆板', priceUnit: 600, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 600 },
    ],
  },
  {
    id: 'hanging-pingmian', label: '平面烤漆柜', installType: 'hanging', icon: '✨',
    image: flatLacquerHanging,
    materials: [
      { id: 'rubber', label: '橡胶木', priceUnit: 1000, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1000 },
      { id: 'ash', label: '白蜡木/红橡木', priceUnit: 1300, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1300 },
      { id: 'wujin', label: '乌金木', priceUnit: 1399, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1399 },
      { id: 'blackWalnut', label: '黑胡桃木', priceUnit: 1500, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1500 },
      { id: 'whiteOak', label: '白橡直纹', priceUnit: 1600, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1600 },
    ],
  },
  {
    id: 'hanging-arc', label: '圆弧烤漆柜', installType: 'hanging', icon: '🌊',
    image: arcLacquerHanging,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1000, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1000 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1300, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1300 },
      { id: 'wujin', label: '乌金木', priceUnit: 1399, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1399 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 1500, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1500 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 1600, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1600 },
    ],
  },
  {
    id: 'hanging-xiantiao', label: '线条柜', installType: 'hanging', icon: '📐',
    image: lineCabinet,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1500, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1500 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1700, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1700 },
      { id: 'wujin', label: '乌金木', priceUnit: 1900, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1900 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2100, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2100 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2200, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2200 },
    ],
  },
  {
    id: 'hanging-diaohua', label: '雕花柜', installType: 'hanging', icon: '🏛️',
    image: carvedCabinet,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1500, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1500 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1700, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1700 },
      { id: 'wujin', label: '乌金木', priceUnit: 1900, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1900 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2100, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2100 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2200, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2200 },
    ],
  },
];

// 落地柜柜型
export const VANITY_FLOOR_CABINET_TYPES = [
  {
    id: 'floor-mianqi', label: '现代免漆板柜', installType: 'floor', icon: '🪵',
    image: mianqiCabinet,
    materials: [
      { id: 'mianqi', label: '免漆板', priceUnit: 850, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 850 },
    ],
  },
  {
    id: 'floor-pingmian', label: '平面烤漆柜', installType: 'floor', icon: '✨',
    image: flatLacquerFloor,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1300, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1300 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1700, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1700 },
      { id: 'wujin', label: '乌金木', priceUnit: 1800, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1800 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 1900, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1900 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2000, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2000 },
    ],
  },
  {
    id: 'floor-yuanhu', label: '圆弧烤漆柜', installType: 'floor', icon: '🌊',
    image: arcLacquerFloor,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1800, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1800 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 2300, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2300 },
      { id: 'wujin', label: '乌金木', priceUnit: 2399, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2399 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2600, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2600 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2700, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2700 },
    ],
  },
  {
    id: 'floor-xiantiao', label: '线条柜', installType: 'floor', icon: '📐',
    image: lineCabinet,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1800, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1800 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 2100, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2100 },
      { id: 'wujin', label: '乌金木', priceUnit: 2300, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2300 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2500, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2500 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2500, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2500 },
    ],
  },
];

// 柜体增配
export const VANITY_CABINET_ADDONS = [
  { id: 'drawer-mianqi', label: '抽屉（免漆板）', unitPrice: 80, unit: '个', icon: '🗄️' },
  { id: 'drawer-zaoqi', label: '抽屉（烤漆板）', unitPrice: 100, unit: '个', icon: '🗄️' },
  { id: 'luowen-front', label: '门板锣线条', unitPrice: 200, unit: '处', image: luowenFrontDetail, icon: '〰️' },
  { id: 'luowen-side', label: '侧板锣线条', unitPrice: 200, unit: '处', image: luowenSideEdge, icon: '〰️' },
  { id: 'luowen-three', label: '三边锣线条', unitPrice: 399, unit: '处', image: luowenThreeEdge, icon: '〰️' },
  { id: 'round-post', label: '圆弧柱头', unitPrice: 30, unit: '个', image: flatCabinetArcPost, icon: '🔘' },
  { id: 'frame', label: '门板拼框', unitPrice: 50, unit: '个', image: doorFrameDetail, icon: '🟧' },
  { id: 'led', label: '柜体灯带', unitPrice: 100, unit: '套', icon: '💡' },
  { id: 'alu-cladding', label: '铝合金包边', unitPrice: 200, unit: '套', icon: '🔩' },
];

// 增配选项
export const VANITY_EXTRA_ADDONS = [
  { id: 'shelf-mianqi', label: '主柜下层板（免漆板）', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 300, unit: '块' },
  { id: 'shelf-zaoqi', label: '主柜下层板（烤漆板）', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 400, unit: '块' },
  { id: 'bracket', label: '吊柜支架', unitPrice: 100, unit: '套' },
  { id: 'hinge-hettich', label: '升级海蒂诗铰链', unitPrice: 20, unit: '个' },
  { id: 'hinge-blum', label: '升级百隆铰链', unitPrice: 25, unit: '个' },
  { id: 'rail-hettich', label: '升级海蒂诗三托底节导轨', unitPrice: 60, unit: '副' },
  { id: 'blum-upgrade', label: '升级百隆', unitPrice: 200, unit: '套' },
  { id: 'horse-drawer', label: '升级骑马抽', unitPrice: 120, unit: '套' },
  { id: 'magic-drawer', label: '升级魔力发光抽', unitPrice: 180, unit: '套' },
  { id: 'tissue-hole', label: '抽纸孔', unitPrice: 50, unit: '个' },
  { id: 'beauty-shelf', label: '内置美妆架', unitPrice: 100, unit: '个' },
  { id: 'hairdryer-holder', label: '吹风筒架', unitPrice: 50, unit: '个' },
  { id: 'power-outlet', label: '电源插座', unitPrice: 50, unit: '个' },
  { id: 'shelf-multi', label: '多功能置物架', unitPrice: 200, unit: '套' },
];

// 包装
export const VANITY_PACKING_ITEMS = [
  { id: 'packing-cabinet-hanging', label: '主柜夹板打包（吊柜）', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 80, unit: '项' },
  { id: 'packing-cabinet-floor', label: '主柜夹板打包（主柜）', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 100, unit: '项' },
  { id: 'packing-mirror-single', label: '浴室镜夹板打包（单镜）', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 70, unit: '项' },
  { id: 'packing-mirror-cabinet', label: '浴室镜夹板打包（镜柜）', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 80, unit: '项' },
  { id: 'packing-counter', label: '台面夹板打包', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 90, unit: '项' },
  { id: 'packing-counter-wood', label: '台面夹板木箱打包', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 180, unit: '项' },
];

// 台盆类型
export const VANITY_BASIN_TYPES = [
  { id: 'above', label: '台上盆' },
  { id: 'under', label: '台下盆' },
];

// 台盆材质
export const VANITY_BASIN_MATERIALS: Record<string, { id: string; label: string; priceUnit: number }[]> = {
  above: [
    { id: 'yanban', label: '岩板', priceUnit: 800 },
    { id: 'shiying', label: '石英石', priceUnit: 600 },
    { id: 'dali', label: '大理石', priceUnit: 900 },
  ],
  under: [
    { id: 'yanban', label: '岩板', priceUnit: 700 },
    { id: 'shiying', label: '石英石', priceUnit: 500 },
    { id: 'kelinai', label: '可丽耐', priceUnit: 850 },
    { id: 'dali', label: '大理石', priceUnit: 800 },
  ],
};

// 浴室镜类型
export const VANITY_MIRROR_TYPES = [
  { id: 'normal', label: '普通镜' },
  { id: 'smart', label: '智能镜' },
];

// 浴室镜形式
export const VANITY_MIRROR_STYLES = [
  { id: 'single', label: '单镜' },
  { id: 'cabinet', label: '镜柜' },
];

// 获取柜型配置
export function getCabinetType(typeId: string) {
  return [...VANITY_HANGING_CABINET_TYPES, ...VANITY_FLOOR_CABINET_TYPES].find(t => t.id === typeId);
}

// 计算柜体价格
export function calcVanityCabinetPrice(config: VanityCabinetConfig): number {
  if (!config.cabinetType || !config.material) return 0;
  const cabinetType = getCabinetType(config.cabinetType);
  if (!cabinetType) return 0;
  const material = cabinetType.materials.find(m => m.id === config.material);
  if (!material) return 0;
  return material.priceFormula(config.cabinetLength);
}

// 计算柜体增配价格
export function calcVanityAddonPrice(config: VanityCabinetConfig): number {
  const addons = config.cabinetAddons || {};
  let total = 0;
  // 抽屉
  if ((addons['drawer-mianqi'] || 0) > 0) total += (addons['drawer-mianqi'] || 0) * 80;
  if ((addons['drawer-zaoqi'] || 0) > 0) total += (addons['drawer-zaoqi'] || 0) * 100;
  // 锣纹线条
  if (addons['luowen-front']) total += 200;
  if (addons['luowen-side']) total += 200;
  if (addons['luowen-three']) total += 399;
  // 其他增配
  if ((addons['round-post'] || 0) > 0) total += (addons['round-post'] || 0) * 30;
  if ((addons['frame'] || 0) > 0) total += (addons['frame'] || 0) * 50;
  if ((addons['led'] || 0) > 0) total += (addons['led'] || 0) * 100;
  if ((addons['alu-cladding'] || 0) > 0) total += (addons['alu-cladding'] || 0) * 200;
  return total;
}

// 计算增配选项价格
export function calcVanityExtraPrice(config: VanityCabinetConfig): number {
  const extra = config.extraAddons || {};
  const length = Math.max(Math.ceil(config.cabinetLength / 100) * 100, 800);
  let total = 0;
  if (extra['shelf-mianqi']) total += length / 1000 * 300;
  if (extra['shelf-zaoqi']) total += length / 1000 * 400;
  if (extra['bracket']) total += (extra['bracket'] || 0) * 100;
  if (extra['hinge-hettich']) total += (extra['hinge-hettich'] || 0) * 20;
  if (extra['hinge-blum']) total += (extra['hinge-blum'] || 0) * 25;
  if (extra['rail-hettich']) total += (extra['rail-hettich'] || 0) * 60;
  if (extra['blum-upgrade']) total += (extra['blum-upgrade'] || 0) * 200;
  if (extra['horse-drawer']) total += (extra['horse-drawer'] || 0) * 120;
  if (extra['magic-drawer']) total += (extra['magic-drawer'] || 0) * 180;
  if (extra['tissue-hole']) total += (extra['tissue-hole'] || 0) * 50;
  if (extra['beauty-shelf']) total += (extra['beauty-shelf'] || 0) * 100;
  if (extra['hairdryer-holder']) total += (extra['hairdryer-holder'] || 0) * 50;
  if (extra['power-outlet']) total += (extra['power-outlet'] || 0) * 50;
  if (extra['shelf-multi']) total += (extra['shelf-multi'] || 0) * 200;
  return total;
}

// 计算包装价格
export function calcVanityPackingPrice(config: VanityCabinetConfig): number {
  const packing = config.packingItems || {};
  const length = Math.max(Math.ceil(config.cabinetLength / 100) * 100, 800);
  let total = 0;
  if (packing['packing-cabinet-hanging']) total += length / 1000 * 80;
  if (packing['packing-cabinet-floor']) total += length / 1000 * 100;
  if (packing['packing-mirror-single']) total += length / 1000 * 70;
  if (packing['packing-mirror-cabinet']) total += length / 1000 * 80;
  if (packing['packing-counter']) total += length / 1000 * 90;
  if (packing['packing-counter-wood']) total += length / 1000 * 180;
  return total;
}

// 计算总价
export function calcVanityTotalPrice(config: VanityCabinetConfig): number {
  return calcVanityCabinetPrice(config)
    + calcVanityAddonPrice(config)
    + calcVanityExtraPrice(config)
    + calcVanityPackingPrice(config);
}

// 默认配置
export function createDefaultConfig(): VanityCabinetConfig {
  return {
    installType: 'hanging',
    cabinetType: '',
    material: '',
    cabinetLength: 800,
    cabinetAddons: {},
    extraAddons: {},
    packingItems: {},
  };
}
