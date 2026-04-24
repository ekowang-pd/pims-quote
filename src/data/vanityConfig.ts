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

// 台盆材质图片（公共路径，需放在 public/images/vanity/ 目录）
const BASIN_IMAGES = {
  above: {
    yanban: '/pims-quote/images/vanity/above-yanban.png',
    shiying: '/pims-quote/images/vanity/above-shiying.png',
    dali: '/pims-quote/images/vanity/above-dali.png',
  },
  under: {
    yanban: '/pims-quote/images/vanity/under-yanban.png',
    shiying: '/pims-quote/images/vanity/under-shiying.png',
    kelinai: '/pims-quote/images/vanity/under-kelinai.png',
    dali: '/pims-quote/images/vanity/under-dali.png',
  },
};

// 台盆材质图片变量
const aboveYanbanImg = BASIN_IMAGES.above.yanban;
const aboveShiyingImg = BASIN_IMAGES.above.shiying;
const aboveDaliImg = BASIN_IMAGES.above.dali;
const underYanbanImg = BASIN_IMAGES.under.yanban;
const underShiyingImg = BASIN_IMAGES.under.shiying;
const underKelinaiImg = BASIN_IMAGES.under.kelinai;
const underDaliImg = BASIN_IMAGES.under.dali;

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
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1399, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1399 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1900, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1900 },
      { id: 'wujin', label: '乌金木', priceUnit: 2000, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2000 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2100, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2100 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2200, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2200 },
    ],
  },
  {
    id: 'hanging-xiantiao', label: '线条柜', installType: 'hanging', icon: '📐',
    image: lineCabinet,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1399, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1399 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1700, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1700 },
      { id: 'wujin', label: '乌金木', priceUnit: 1800, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1800 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 1900, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 1900 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2000, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 2000 },
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
// cabinetAddons 数据结构: { [addonId]: { optionId: string, qty: number } }
// optionId = options[0].id 表示默认/唯一选项; qty = 数量
export const VANITY_CABINET_ADDONS = [
  {
    id: 'drawer',
    label: '抽屉单加',
    unit: '个',
    icon: '🗄️',
    options: [
      { id: 'mianqi', label: '免漆板', price: 80, image: null },
      { id: 'zaoqi', label: '烤漆板', price: 100, image: null },
    ],
  },
  {
    id: 'luowen',
    label: '门板锣纹线条单加',
    unit: '处',
    icon: '〰️',
    image: luowenFrontDetail,
    options: [
      { id: 'front', label: '正面门板/抽屉板锣线条', price: 200, image: luowenFrontDetail },
      { id: 'side', label: '两边侧板锣线条', price: 200, image: luowenSideEdge },
      { id: 'three', label: '三边锣线条', price: 399, image: luowenThreeEdge },
    ],
  },
  {
    id: 'round-post',
    label: '平板柜体加圆弧柱头单加',
    unit: '个',
    icon: '🔘',
    image: flatCabinetArcPost,
    options: [
      { id: 'default', label: '圆弧柱头', price: 30 },
    ],
  },
  {
    id: 'frame',
    label: '门板拼框结构单加',
    unit: '个',
    icon: '🟧',
    image: doorFrameDetail,
    options: [
      { id: 'default', label: '门板拼框', price: 50 },
    ],
  },
  {
    id: 'led',
    label: '柜体加灯带单加',
    unit: '套',
    icon: '💡',
    options: [
      { id: 'default', label: '柜体灯带', price: 100 },
    ],
  },
  {
    id: 'alu-cladding',
    label: '门板/抽屉板包铝合金单加',
    unit: '套',
    icon: '🔩',
    options: [
      { id: 'default', label: '铝合金包边', price: 200 },
    ],
  },
];

// 增配选项
export const VANITY_EXTRA_ADDONS = [
  {
    id: 'shelf',
    label: '主柜下层板单加',
    unit: '块',
    icon: '🔲',
    options: [
      { id: 'mianqi', label: '免漆材质', price: 0, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 300 },
      { id: 'zaoqi', label: '烤漆材质', price: 0, priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 400 },
    ],
  },
  { id: 'bracket', label: '吊柜支架单加', unit: '套', icon: '🪝', options: [{ id: 'default', label: '吊柜支架', price: 100 }] },
  {
    id: 'hinge',
    label: '升级铰链单加',
    unit: '个',
    icon: '🔧',
    options: [
      { id: 'hettich', label: '升级海蒂诗', price: 20 },
      { id: 'blum', label: '升级百隆', price: 25 },
    ],
  },
  { id: 'rail-hettich', label: '升级海蒂诗三托底节导轨', unit: '副', icon: '🛞', options: [{ id: 'default', label: '海蒂诗导轨', price: 60 }] },
  { id: 'blum-upgrade', label: '升级百隆', unit: '套', icon: '🛞', options: [{ id: 'default', label: '百隆升级', price: 200 }] },
  { id: 'horse-drawer', label: '升级骑马抽', unit: '套', icon: '🗃️', options: [{ id: 'default', label: '骑马抽', price: 120 }] },
  { id: 'magic-drawer', label: '升级魔力发光抽', unit: '套', icon: '💡', options: [{ id: 'default', label: '魔力发光抽', price: 180 }] },
  { id: 'tissue-hole', label: '抽纸孔', unit: '个', icon: '🧻', options: [{ id: 'default', label: '抽纸孔', price: 50 }] },
  { id: 'beauty-shelf', label: '内置美妆架', unit: '个', icon: '💄', options: [{ id: 'default', label: '美妆架', price: 100 }] },
  { id: 'hairdryer-holder', label: '吹风筒架', unit: '个', icon: '💨', options: [{ id: 'default', label: '吹风筒架', price: 50 }] },
  { id: 'power-outlet', label: '电源插座', unit: '个', icon: '🔌', options: [{ id: 'default', label: '电源插座', price: 50 }] },
  { id: 'shelf-multi', label: '多功能置物架', unit: '套', icon: '🗂️', options: [{ id: 'default', label: '多功能置物架', price: 200 }] },
];

// 包装
export const VANITY_PACKING_ITEMS = [
  {
    id: 'packing-cabinet',
    label: '主柜夹板打包',
    unit: '项',
    icon: '📦',
    options: [
      { id: 'hanging', label: '吊柜', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 80 },
      { id: 'floor', label: '主柜', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 100 },
    ],
  },
  {
    id: 'packing-mirror',
    label: '浴室镜夹板打包',
    unit: '项',
    icon: '🪞',
    options: [
      { id: 'single', label: '单镜', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 70 },
      { id: 'cabinet', label: '镜柜', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 80 },
    ],
  },
  {
    id: 'packing-counter',
    label: '台面夹板打包',
    unit: '项',
    icon: '🧱',
    options: [
      { id: 'normal', label: '夹板打包', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 90 },
      { id: 'wood', label: '夹板木箱打包', priceFormula: (length: number) => Math.max(Math.ceil(length / 100) * 100, 800) / 1000 * 180 },
    ],
  },
];

// ===== 台盆配置数据 =====
// 重构后：按 台盆 / 台面 / 配置项 三个模块组织

// 台盆安装类型
export const VANITY_BASIN_INSTALL_TYPES = [
  { id: 'above', label: '台上盆' },
  { id: 'under', label: '台下盆' },
];

// 台盆配置模块类型
export type BasinModuleType = 'basin' | 'countertop' | 'options';

// 台盆选项（台上盆单加/台中盆单加；台下盆各种盆型）
interface BasinOptionItem {
  id: string;
  label: string;
  priceType: 'unit' | 'length';  // 按个数还是按长度
  unitPrice?: number;             // unitPrice 类型时用这个
  priceFormula?: (length: number) => number; // length 类型时用这个
  unit: string;                   // 个 / 长度mm
}

// 台面选项
interface CountertopOptionItem {
  id: string;
  label: string;
  priceType: 'unit' | 'length';
  unitPrice?: number;
  priceFormula?: (length: number) => number;
  unit: string;
}

// 配置项选项
interface BasinExtraOptionItem {
  id: string;
  label: string;
  priceType: 'unit' | 'length';
  unitPrice?: number;
  priceFormula?: (length: number) => number;
  unit: string;
}

// 台盆材质配置（台上盆/台下盆通用）
export interface BasinMaterialConfig {
  id: string;
  label: string;
  image?: string;
  // 台面选项（按长度计价：单层岩板/石英石/大理石等级/吊边）
  countertopOptions: CountertopOptionItem[];
  // 配置项（按长度计价：挡水边/长度超2米）
  extraOptions?: BasinExtraOptionItem[];
  // 台上盆选项（台下盆不需要）
  basinMaterialOptions?: { id: string; label: string; unitPrice: number }[];
  basinQtyUnitPrice?: number; // 台中盆单价
  // 台下盆选项（台上盆不需要）
  basinOptions?: BasinOptionItem[];
}

// 台盆类型定义（统一结构）
export const VANITY_BASIN_TYPES = {
  above: {
    id: 'above',
    label: '台上盆',
    materials: [
      // 岩板
      {
        id: 'yanban', label: '岩板', image: aboveYanbanImg,
        // 台面（按长度计价）
        countertopOptions: [
          { id: 'single-layer', label: '单层岩板（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 200, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×200' },
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 260, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×260' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 300, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×300' },
        ],
        // 配置项（按长度计价）
        extraOptions: [
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (len) => Math.max(len, 1000) / 1000 * 30, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×30' },
          { id: 'over-2m', label: '长度超2米单加', priceType: 'length', priceFormula: (len) => len > 2000 ? (len - 2000) / 1000 * 100 : 0, unit: 'mm', priceFormulaStr: 'IF(长度>2000,(长度-2000)/1000×100,0)' },
        ],
        // 台上盆选项
        basinMaterialOptions: [
          { id: 'taoc', label: '陶瓷台上盆', unitPrice: 200 },
          { id: 'shuij', label: '水晶台上盆', unitPrice: 550 },
          { id: 'buxiu', label: '不锈钢台上盆', unitPrice: 650 },
          { id: 'dali', label: '大理石台上盆', unitPrice: 1000 },
        ],
        basinQtyUnitPrice: 280, // 台中盆单价
      },
      // 石英石
      {
        id: 'shiying', label: '石英石', image: aboveShiyingImg,
        countertopOptions: [
          { id: 'single-layer', label: '石英石单层（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 500, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×500' },
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 650, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×650' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 720, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×720' },
        ],
        basinMaterialOptions: [
          { id: 'taoc', label: '陶瓷台上盆', unitPrice: 200 },
          { id: 'shuij', label: '水晶台上盆', unitPrice: 550 },
          { id: 'buxiu', label: '不锈钢台上盆', unitPrice: 650 },
          { id: 'dali', label: '大理石台上盆', unitPrice: 1000 },
        ],
        basinQtyUnitPrice: 280,
      },
      // 大理石
      {
        id: 'dali', label: '大理石', image: aboveDaliImg,
        countertopOptions: [
          { id: 'grade-a', label: 'A类高端大理石（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 1100, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×1100' },
          { id: 'grade-b', label: 'B类中端大理石（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 800, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×800' },
          { id: 'grade-c', label: 'C类低端大理石（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 600, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×600' },
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 200, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×200' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 260, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×260' },
        ],
        extraOptions: [
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (len) => Math.max(len, 1000) / 1000 * 100, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×100' },
        ],
        basinMaterialOptions: [
          { id: 'taoc', label: '陶瓷台上盆', unitPrice: 200 },
          { id: 'shuij', label: '水晶台上盆', unitPrice: 550 },
          { id: 'buxiu', label: '不锈钢台上盆', unitPrice: 650 },
          { id: 'dali', label: '大理石台上盆', unitPrice: 1000 },
        ],
        basinQtyUnitPrice: 280,
      },
    ],
  } as { id: string; label: string; materials: BasinMaterialConfig[] },
  under: {
    id: 'under',
    label: '台下盆',
    materials: [
      // 岩板
      {
        id: 'yanban', label: '岩板', image: underYanbanImg,
        countertopOptions: [
          { id: 'single-layer', label: '单层岩板（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 200, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×200' },
        ],
        extraOptions: [
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 260, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×260' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 300, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×300' },
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (len) => Math.max(len, 1000) / 1000 * 30, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×30' },
          { id: 'over-2m', label: '长度超2米单加', priceType: 'length', priceFormula: (len) => len > 2000 ? (len - 2000) / 1000 * 100 : 0, unit: 'mm', priceFormulaStr: 'IF(长度>2000,(长度-2000)/1000×100,0)' },
        ],
        basinOptions: [
          { id: 'youdeng', label: '优等台下盆（普通工艺）', priceType: 'unit', unitPrice: 90, unit: '个' },
          { id: 'wufeng', label: '岩板无缝拼接陶瓷盆', priceType: 'unit', unitPrice: 300, unit: '个' },
          { id: 'jiedati', label: '岩板拼接一体盆', priceType: 'unit', unitPrice: 350, unit: '个' },
          { id: 'rewan-white', label: '热弯一体盆（白色/鱼肚白）', priceType: 'length', priceFormula: (len) => len / 1000 * 900, unit: 'mm' },
          { id: 'rewan-other', label: '热弯一体盆（其他颜色）', priceType: 'length', priceFormula: (len) => len / 1000 * 1000, unit: 'mm' },
          { id: 'rewan-edge', label: '热弯一体盆吊边H<200mm', priceType: 'length', priceFormula: (len) => len / 1000 * 200, unit: 'mm' },
          { id: 'extra-rewan', label: '单加岩板热弯一体盆', priceType: 'unit', unitPrice: 300, unit: '个' },
        ],
      },
      // 石英石
      {
        id: 'shiying', label: '石英石', image: underShiyingImg,
        countertopOptions: [
          { id: 'single-layer', label: '石英石单层（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 500, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×500' },
        ],
        extraOptions: [
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 650, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×650' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 720, unit: 'mm' },
        ],
        basinOptions: [
          { id: 'wufeng-gen1', label: '一代无缝拼接盆', priceType: 'unit', unitPrice: 399, unit: '个' },
          { id: 'wufeng-gen2', label: '二代无缝拼接盆', priceType: 'unit', unitPrice: 500, unit: '个' },
          { id: 'jiedati', label: '拼接一体盆', priceType: 'unit', unitPrice: 450, unit: '个' },
          { id: 'youdeng', label: '优等台下盆（普通工艺）', priceType: 'unit', unitPrice: 90, unit: '个' },
        ],
      },
      // 可丽耐
      {
        id: 'kelinai', label: '可丽耐', image: underKelinaiImg,
        countertopOptions: [
          { id: 'white-single', label: '白色单层', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 950, unit: 'mm' },
        ],
        extraOptions: [
          { id: 'white-edge', label: '白色吊边H<250mm周长单加', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 260, unit: 'mm' },
          { id: 'white-splash', label: '白色可丽耐挡水单加', priceType: 'length', priceFormula: (len) => Math.max(len, 1000) / 1000 * 100, unit: 'mm' },
        ],
        basinOptions: [
          { id: 'kelinai-basin', label: '白色可丽耐盆单加', priceType: 'unit', unitPrice: 300, unit: '个' },
        ],
      },
      // 大理石
      {
        id: 'dali', label: '大理石', image: underDaliImg,
        countertopOptions: [
          { id: 'grade-a', label: 'A类高端大理石（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 1100, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×1100' },
          { id: 'grade-b', label: 'B类中端大理石（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 800, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×800' },
          { id: 'grade-c', label: 'C类低端大理石（不含盆）', priceType: 'length', priceFormula: (len) => Math.max(len, 800) / 1000 * 600, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×600' },
        ],
        extraOptions: [
          { id: 'edge-100', label: '吊边H<100mm', priceType: 'length', priceFormula: (len) => len / 1000 * 200, unit: 'mm' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (len) => len / 1000 * 260, unit: 'mm' },
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (len) => Math.max(len, 1000) / 1000 * 100, unit: 'mm' },
        ],
        basinOptions: [
          { id: 'wufeng-gen1', label: '一代无缝拼接盆', priceType: 'unit', unitPrice: 399, unit: '个' },
          { id: 'wufeng-gen2', label: '二代无缝拼接盆', priceType: 'unit', unitPrice: 500, unit: '个' },
          { id: 'jiedati', label: '拼接一体盆', priceType: 'unit', unitPrice: 450, unit: '个' },
          { id: 'youdeng', label: '优等台下盆（普通工艺）', priceType: 'unit', unitPrice: 90, unit: '个' },
        ],
      },
    ],
  } as { id: string; label: string; materials: BasinMaterialConfig[] },
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
  for (const addon of VANITY_CABINET_ADDONS) {
    const selected = addons[addon.id];
    if (selected && selected.qty > 0) {
      const option = addon.options.find(o => o.id === selected.optionId);
      if (option) {
        total += option.price * selected.qty;
      }
    }
  }
  return total;
}

// 计算增配选项价格
export function calcVanityExtraPrice(config: VanityCabinetConfig): number {
  const extra = config.extraAddons || {};
  const length = Math.max(Math.ceil(config.cabinetLength / 100) * 100, 800);
  let total = 0;
  for (const addon of VANITY_EXTRA_ADDONS) {
    const sel = extra[addon.id] as { optionId: string; qty: number } | undefined;
    if (!sel) continue;
    const option = addon.options.find(o => o.id === sel.optionId);
    if (!option) continue;
    const qty = sel.qty || 0;
    if (qty <= 0) continue;
    if (option.priceFormula) {
      // 长度计价（如下层板）：数量固定为1，按长度算
      total += option.priceFormula(length);
    } else {
      // 数量×单价
      total += (option.price || 0) * qty;
    }
  }
  return total;
}

// 计算包装价格
export function calcVanityPackingPrice(config: VanityCabinetConfig, mirrorConfig?: MirrorConfig): number {
  const packing = config.packingItems || {};
  const packingLengths = (config as any).packingLengths || {};
  const cabinetLength = Math.max(Math.ceil(config.cabinetLength / 100) * 100, 800);
  let total = 0;
  for (const item of VANITY_PACKING_ITEMS) {
    const sel = packing[item.id] as { optionId: string } | undefined;
    if (!sel) continue;
    const option = item.options.find(o => o.id === sel.optionId);
    if (!option?.priceFormula) continue;
    
    // 根据包装类型使用不同的长度参数
    let priceLength = cabinetLength;
    if (item.id === 'packing-mirror' && mirrorConfig) {
      // 镜子包装：根据镜子类型取对应长度
      if (mirrorConfig.mirrorStyle === 'single') {
        priceLength = mirrorConfig.mirrorType === 'plain' 
          ? mirrorConfig.plainSingleLength 
          : mirrorConfig.smartSingleLength;
      } else {
        priceLength = mirrorConfig.mirrorType === 'plain' 
          ? mirrorConfig.plainCabinetLength 
          : mirrorConfig.smartCabinetLength;
      }
      priceLength = Math.max(Math.ceil(priceLength / 100) * 100, 800);
    } else if (item.id === 'packing-counter') {
      // 台面包装：使用手动输入的长度
      const customLength = packingLengths['packing-counter'];
      if (customLength && customLength > 0) {
        priceLength = Math.max(Math.ceil(customLength / 100) * 100, 800);
      } else {
        // 默认使用台面长度
        const basinLength = (config as any).basinConfig?.countertopLength || 800;
        priceLength = Math.max(Math.ceil(basinLength / 100) * 100, 800);
      }
    }
    
    total += option.priceFormula(priceLength);
  }
  return total;
}

// 计算总价
export function calcVanityTotalPrice(config: VanityCabinetConfig): number {
  return calcVanityCabinetPrice(config)
    + calcVanityAddonPrice(config)
    + calcVanityExtraPrice(config)
    + calcVanityPackingPrice(config);
}

// 浴室镜配置状态
export interface MirrorConfig {
  enabled: boolean;                   // 是否选配浴室镜
  mirrorType: 'plain' | 'smart';      // 普通镜 / 智能镜
  mirrorStyle: 'single' | 'cabinet'; // 单镜 / 镜柜
  // 普通镜 - 单镜
  plainSingleType: string;            // plain-single/alu/wood/stainless
  plainSingleArea: number;           // 面积 m²
  plainSingleWoodMaterial: string;    // 木框木材材质: mianqi/xiangjiao/baixian/wujin/heihut/baixiang
  plainSingleLength: number;          // 长度 mm（木框包边用）
  plainSingleRCorner: boolean;        // 是否倒R角
  // 普通镜 - 镜柜
  plainCabinetMaterial: string;       // mianqi/xiangjiao/baixian/wujin/heihut/baixiang
  plainCabinetLength: number;        // 长度 mm
  // 普通镜配件
  plainSideCabinet: number;          // 单加侧柜数量
  plainOpenShelf: number;            // 单加开放格数量
  plainAmericanStyle: number;         // 美式造型单加数量（仅镜柜）
  // 智能镜 - 单镜
  smartSingleType: string;           // no-border-backlight/no-border-sand/wood-backlight/wood-sand/alu-backlight/alu-sand/steel-backlight/steel-sand
  smartSingleArea: number;           // 面积 m²
  smartSingleWoodMaterial: string;    // 木材材质: mianqi/xiangjiao/baixian/wujin/heihut/baixiang
  smartSingleLength: number;         // 长度 mm（木材包边用）
  smartSingleRCorner: boolean;        // 是否倒R角
  // 智能镜 - 镜柜
  smartCabinetMaterial: string;       // mianqi/xiangjiao/baixian/wujin/heihut/baixiang
  smartCabinetLength: number;        // 长度 mm
  // 智能镜配件
  smartSideCabinet: number;          // 单加侧柜数量
  smartOpenShelf: number;            // 单加开放格数量
  smartAmericanStyle: number;         // 美式造型单加数量
  smartGlassShelf: number;          // 玻璃层板单加数量
  smartShelfLight: number;          // 层格/侧柜发光单加数量
  smartGlassDoor: number;           // 玻璃门单加数量
  smartAluGlassDoor: number;        // 铝合金门包边玻璃门单加数量
}

// 默认镜子配置
export function createDefaultMirrorConfig(): MirrorConfig {
  return {
    mirrorType: undefined, // 默认未选择类型
    mirrorStyle: undefined,
    // 普通镜 - 单镜
    plainSingleType: 'plain-single',
    plainSingleArea: 0.6,
    plainSingleWoodMaterial: 'mianqi',
    plainSingleLength: 800,
    plainSingleRCorner: false,
    // 普通镜 - 镜柜
    plainCabinetMaterial: 'mianqi',
    plainCabinetLength: 800,
    // 普通镜配件
    plainSideCabinet: 0,
    plainOpenShelf: 0,
    plainAmericanStyle: 0,
    // 智能镜 - 单镜
    smartSingleType: 'no-border-backlight',
    smartSingleArea: 0.6,
    smartSingleWoodMaterial: 'mianqi',
    smartSingleLength: 800,
    smartSingleRCorner: false,
    // 智能镜 - 镜柜
    smartCabinetMaterial: 'mianqi',
    smartCabinetLength: 800,
    // 智能镜配件
    smartSideCabinet: 0,
    smartOpenShelf: 0,
    smartAmericanStyle: 0,
    smartGlassShelf: 0,
    smartShelfLight: 0,
    smartGlassDoor: 0,
    smartAluGlassDoor: 0,
  };
}

// 木材价格表（用于镜子木框/木材包边）
const WOOD_PRICES_PLAIN: Record<string, number> = {
  mianqi: 700, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1399, baixiang: 1500,
};

const WOOD_PRICES_PLAIN_CABINET: Record<string, number> = {
  mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1399,
};

const WOOD_PRICES_SMART_BACKLIGHT: Record<string, number> = {
  mianqi: 600, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1300, baixiang: 1399,
};

const WOOD_PRICES_SMART_SAND: Record<string, number> = {
  mianqi: 700, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1399, baixiang: 1500,
};

const WOOD_PRICES_SMART_CABINET_UPDOWN: Record<string, number> = {
  mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1300,
};

const WOOD_PRICES_SMART_CABINET_SAND: Record<string, number> = {
  mianqi: 750, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1300, baixiang: 1399,
};

// 侧柜/开放格价格（按个数）
const SIDE_CABINET_PRICES: Record<string, number> = {
  mianqi: 260, xiangjiao: 360, baixian: 430, wujin: 460, heihut: 480, baixiang: 539,
};

const OPEN_SHELF_PRICES: Record<string, number> = {
  mianqi: 200, xiangjiao: 300, baixian: 360, wujin: 380, heihut: 399, baixiang: 450,
};

// 计算镜子价格
export function calcMirrorPrice(config: MirrorConfig): number {
  // 只有选择了镜子类型和形式才算已配置，否则返回0
  if (!config.mirrorType || !config.mirrorStyle) {
    return 0;
  }

  let total = 0;
  const rCorner = 60; // 倒R角加价
  const getSideCabinetPrice = (mat: string) => SIDE_CABINET_PRICES[mat] || 260;
  const getOpenShelfPrice = (mat: string) => OPEN_SHELF_PRICES[mat] || 200;

  if (config.mirrorType === 'plain') {
    if (config.mirrorStyle === 'single') {
      // 普通镜 - 单镜
      const area = Math.max(config.plainSingleArea, 0.6);
      const ceilLen = Math.max(Math.ceil(config.plainSingleLength / 100) * 100, 800);

      switch (config.plainSingleType) {
        case 'plain-single': // 不包边
          total = area * 650 - 100 + (config.plainSingleRCorner ? rCorner : 0);
          break;
        case 'alu': // 铝型材包边
          total = area * 700 - 100 + (config.plainSingleRCorner ? rCorner : 0);
          break;
        case 'wood': { // 木框包边（按长度计价）
          const pricePerM = WOOD_PRICES_PLAIN[config.plainSingleWoodMaterial] || 700;
          total = (ceilLen / 1000) * pricePerM - 100 + (config.plainSingleRCorner ? rCorner : 0);
          break;
        }
        case 'stainless': // 304#不锈钢包边
          total = area * 950 - 100 + (config.plainSingleRCorner ? rCorner : 0);
          break;
      }
      // 注意：配件价格（侧柜、开放格等）不在这里计算，由 accessoryPrice 单独计算
    } else {
      // 普通镜 - 镜柜（按长度计价，只计算镜面主配置，不含配件）
      const ceilLen = Math.max(Math.ceil(config.plainCabinetLength / 100) * 100, 800);
      const pricePerM = WOOD_PRICES_PLAIN_CABINET[config.plainCabinetMaterial] || 650;
      total = (ceilLen / 1000) * pricePerM - 100;
      // 注意：配件价格（侧柜、开放格、美式造型等）不在这里计算，由 accessoryPrice 单独计算
    }
  } else {
    // 智能镜
    if (config.mirrorStyle === 'single') {
      // 智能镜 - 单镜
      const area = Math.max(config.smartSingleArea, 0.6);
      const ceilLen = Math.max(Math.ceil(config.smartSingleLength / 100) * 100, 800);

      switch (config.smartSingleType) {
        case 'no-border-backlight': // 不包边背光
          total = area * 500 + (config.smartSingleRCorner ? rCorner : 0);
          break;
        case 'no-border-sand': // 不包边正面打砂发光
          total = area * 650 + (config.smartSingleRCorner ? rCorner : 0);
          break;
        case 'wood-backlight': { // 木材包边背光
          const pricePerM = WOOD_PRICES_SMART_BACKLIGHT[config.smartSingleWoodMaterial] || 600;
          total = (ceilLen / 1000) * pricePerM + (config.smartSingleRCorner ? rCorner : 0);
          break;
        }
        case 'wood-sand': { // 木材包边正面打砂发光
          const pricePerM = WOOD_PRICES_SMART_SAND[config.smartSingleWoodMaterial] || 700;
          total = (ceilLen / 1000) * pricePerM + (config.smartSingleRCorner ? rCorner : 0);
          break;
        }
        case 'alu-backlight': // 铝型材包边背光
          total = area * 650 + (config.smartSingleRCorner ? rCorner : 0);
          break;
        case 'alu-sand': // 铝型材包边正面打砂发光
          total = area * 700 + (config.smartSingleRCorner ? rCorner : 0);
          break;
        case 'steel-backlight': // 304#不锈钢包边背光
          total = area * 900 + (config.smartSingleRCorner ? rCorner : 0);
          break;
        case 'steel-sand': // 304#不锈钢包边正面打砂发光
          total = area * 950 + (config.smartSingleRCorner ? rCorner : 0);
          break;
      }
      // 注意：配件价格不在这里计算，由 accessoryPrice 单独计算
    } else {
      // 智能镜 - 镜柜（只计算镜面主配置，不含配件）
      const ceilLen = Math.max(Math.ceil(config.smartCabinetLength / 100) * 100, 800);
      const mat = config.smartCabinetMaterial;
      // 镜柜发光类型通过 smartSingleType 判断（上下发光/正面打砂）
      // 注意：smartSingleType 也用于单镜模式，需要区分
      const cabinetType = config.smartSingleType;
      const isUpdown = cabinetType === 'wood-backlight' || cabinetType === 'smart-cabinet-updown';
      const isSand = cabinetType === 'wood-sand' || cabinetType === 'smart-cabinet-sand';

      if (isUpdown) {
        // 木材镜柜上下发光
        const pricePerM = WOOD_PRICES_SMART_CABINET_UPDOWN[mat] || 650;
        total = (ceilLen / 1000) * pricePerM;
      } else if (isSand) {
        // 木材镜柜正面打砂发光
        const pricePerM = WOOD_PRICES_SMART_CABINET_SAND[mat] || 750;
        total = (ceilLen / 1000) * pricePerM;
      } else {
        // 默认为上下发光（如果 smartSingleType 不匹配任何镜柜类型）
        const pricePerM = WOOD_PRICES_SMART_CABINET_UPDOWN[mat] || 650;
        total = (ceilLen / 1000) * pricePerM;
      }
      // 注意：配件价格（侧柜、开放格、玻璃层板等）不在这里计算，由 accessoryPrice 单独计算
    }
  }

  return Math.max(0, total);
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
    packingLengths: {},
  };
}

// ===== 新版台盆配置状态 =====
export interface BasinConfig {
  installType: 'above' | 'under';   // 台上盆/台下盆
  materialId: string;                // 材质Id
  // 台面（单选）
  countertopId: string;              // 选中的台面选项Id（单选，空=未选）
  countertopLength: number;          // 台面长度(mm)
  // 各模块选项：{ optionId: value } value=0表示未选
  basinItems: Record<string, number>;   // 台盆模块（台上盆qty/台下盆qty）
  extraItems: Record<string, number>;    // 配置项模块：1=已勾选，0=未选
  extraLengths: Record<string, number>;  // 配置项各自的独立长度(mm)，用于单独计价
}

// 默认台盆配置
export function createDefaultBasinConfig(): BasinConfig {
  return {
    installType: 'above',
    materialId: '',
    countertopId: '',
    countertopLength: 800,
    basinItems: {},
    extraItems: {},
    extraLengths: {},
  };
}

// 计算台盆价格
export function calcBasinPrice(config: BasinConfig): number {
  const basinType = VANITY_BASIN_TYPES[config.installType];
  if (!basinType) return 0;

  let total = 0;
  const countertopLen = config.countertopLength || 800;

  // 获取当前材质的配置（统一使用 materials）
  const materialConfig = basinType.materials?.find(m => m.id === config.materialId);
  if (!materialConfig) return 0;

  // ===== 台面价格（单选，用 countertopLength 计价）=====
  if (config.countertopId) {
    const countertopOpt = (materialConfig.countertopOptions || []).find((o: any) => o.id === config.countertopId);
    if (countertopOpt?.priceFormula) {
      total += countertopOpt.priceFormula(countertopLen);
    }
  }

  // ===== 配置项价格（多选，各自独立长度或台面长度计价）=====
  for (const opt of materialConfig.extraOptions || []) {
    const checked = config.extraItems[opt.id] || 0;
    if (checked > 0 && opt.priceFormula) {
      const extraLen = config.extraLengths?.[opt.id] || countertopLen;
      total += opt.priceFormula(extraLen);
    }
  }

  // ===== 台上盆价格计算 =====
  if (config.installType === 'above') {
    // basin-material 存储的是 option id，需要查找对应的 unitPrice
    const basinMaterialId = config.basinItems['basin-material'];
    const basinQty = config.basinItems['basin-qty'] || 0;
    if (basinMaterialId && basinMaterialId !== 'none' && basinQty > 0) {
      const matOpt = materialConfig.basinMaterialOptions?.find((m: any) => m.id === basinMaterialId);
      if (matOpt?.unitPrice) {
        total += matOpt.unitPrice * basinQty;
      }
    }

    const basinMidQty = config.basinItems['basin-mid-qty'] || 0;
    if (materialConfig.basinQtyUnitPrice && basinMidQty > 0) {
      total += materialConfig.basinQtyUnitPrice * basinMidQty;
    }
  }

  // ===== 台下盆价格计算 =====
  if (config.installType === 'under') {
    for (const opt of materialConfig.basinOptions || []) {
      const qty = config.basinItems[opt.id] || 0;
      if (qty > 0) {
        if (opt.priceType === 'unit' && opt.unitPrice) {
          total += opt.unitPrice * qty;
        } else if (opt.priceType === 'length' && opt.priceFormula) {
          total += opt.priceFormula(countertopLen) * qty;
        }
      }
    }
  }

  return Math.max(0, total);
}

// 获取当前材质配置
export function getCurrentBasinMaterial(config: BasinConfig) {
  const basinType = VANITY_BASIN_TYPES[config.installType];
  if (!basinType) return undefined;
  return basinType.materials?.find(m => m.id === config.materialId);
}

