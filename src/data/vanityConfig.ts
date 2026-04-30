// ===== 浴室柜配置器 - 配置数据 =====
// 从 bundle-temp.js 提取重建
// 包含：柜体类型、台盆配置、镜面配置、增配选项、计价公式

// ===== 图片路径（来自 images/vanity/）=====
export const VANITY_IMAGES = {
  // 柜体
  hangingCabinet: '/pims-quote/images/vanity/hanging-cabinet-1.png',
  floorCabinet: '/pims-quote/images/vanity/floor-cabinet-1.png',
  mianqiCabinet: '/pims-quote/images/vanity/mianqi-cabinet.png',
  flatLacquerHanging: '/pims-quote/images/vanity/flat-lacquer-hanging.png',
  flatLacquerFloor: '/pims-quote/images/vanity/flat-lacquer-floor.png',
  arcLacquerHanging: '/pims-quote/images/vanity/arc-lacquer-hanging.png',
  arcLacquerFloor: '/pims-quote/images/vanity/arc-lacquer-floor.png',
  lineCabinet: '/pims-quote/images/vanity/line-cabinet.png',
  carvedCabinet: '/pims-quote/images/vanity/carved-cabinet.png',
  luowenSideEdge: '/pims-quote/images/vanity/luowen-side-edge.png',
  luowenFrontDetail: '/pims-quote/images/vanity/luowen-front-detail.png',
  luowenThreeEdge: '/pims-quote/images/vanity/luowen-three-edge.png',
  // 台盆（统一大小写）
  aboveYanban: '/pims-quote/images/vanity/above-yanban.png',
  aboveShiying: '/pims-quote/images/vanity/above-shiying.png',
  aboveDali: '/pims-quote/images/vanity/above-dali.png',
  underYanban: '/pims-quote/images/vanity/under-yanban.png',
  underShiying: '/pims-quote/images/vanity/under-shiying.png',
  underKelinai: '/pims-quote/images/vanity/under-kelinai.png',
  underDali: '/pims-quote/images/vanity/under-dali.png',
  // 镜面
  mirrorSingle: '/pims-quote/images/vanity/mirror-single.png',
  mirrorCabinet: '/pims-quote/images/vanity/mirror-cabinet.png',
};

// ===== 柜体安装类型 =====
export const VANITY_INSTALL_TYPES = [
  { id: 'hanging', label: '吊柜', image: VANITY_IMAGES.hangingCabinet },
  { id: 'floor', label: '落地柜', image: VANITY_IMAGES.floorCabinet },
];

// ===== 吊柜类型列表 =====
export const VANITY_HANGING_CABINET_TYPES = [
  {
    id: 'hanging-mianqi',
    label: '现代免漆板柜',
    installType: 'hanging',
    icon: '🪵',
    image: VANITY_IMAGES.mianqiCabinet,
    materials: [
      { id: 'mianqi', label: '免漆板', priceUnit: 600, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 600 },
    ],
  },
  {
    id: 'hanging-pingmian',
    label: '平面烤漆柜',
    installType: 'hanging',
    icon: '✨',
    image: VANITY_IMAGES.flatLacquerHanging,
    materials: [
      { id: 'rubber', label: '橡胶木', priceUnit: 1000, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1000 },
      { id: 'ash', label: '白蜡木/红橡木', priceUnit: 1300, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1300 },
      { id: 'wujin', label: '乌金木', priceUnit: 1399, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1399 },
      { id: 'blackWalnut', label: '黑胡桃木', priceUnit: 1500, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1500 },
      { id: 'whiteOak', label: '白橡直纹', priceUnit: 1600, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1600 },
    ],
  },
  {
    id: 'hanging-arc',
    label: '圆弧烤漆柜',
    installType: 'hanging',
    icon: '🌊',
    image: VANITY_IMAGES.arcLacquerHanging,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1399, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1399 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1900, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1900 },
      { id: 'wujin', label: '乌金木', priceUnit: 2000, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2000 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2100, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2100 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2200, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2200 },
    ],
  },
  {
    id: 'hanging-xiantiao',
    label: '线条柜',
    installType: 'hanging',
    icon: '📐',
    image: VANITY_IMAGES.lineCabinet,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1399, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1399 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1700, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1700 },
      { id: 'wujin', label: '乌金木', priceUnit: 1800, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1800 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 1900, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1900 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2000, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2000 },
    ],
  },
  {
    id: 'hanging-diaohua',
    label: '雕花柜',
    installType: 'hanging',
    icon: '🏛️',
    image: VANITY_IMAGES.carvedCabinet,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1500, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1500 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1700, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1700 },
      { id: 'wujin', label: '乌金木', priceUnit: 1900, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1900 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2100, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2100 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2200, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2200 },
    ],
  },
];

// ===== 落地柜类型列表 =====
export const VANITY_FLOOR_CABINET_TYPES = [
  {
    id: 'floor-mianqi',
    label: '现代免漆板柜',
    installType: 'floor',
    icon: '🪵',
    image: VANITY_IMAGES.mianqiCabinet,
    materials: [
      { id: 'mianqi', label: '免漆板', priceUnit: 850, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 850 },
    ],
  },
  {
    id: 'floor-pingmian',
    label: '平面烤漆柜',
    installType: 'floor',
    icon: '✨',
    image: VANITY_IMAGES.flatLacquerFloor,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1300, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1300 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 1700, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1700 },
      { id: 'wujin', label: '乌金木', priceUnit: 1800, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1800 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 1900, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1900 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2000, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2000 },
    ],
  },
  {
    id: 'floor-yuanhu',
    label: '圆弧烤漆柜',
    installType: 'floor',
    icon: '🌊',
    image: VANITY_IMAGES.arcLacquerFloor,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1800, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1800 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 2300, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2300 },
      { id: 'wujin', label: '乌金木', priceUnit: 2399, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2399 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2600, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2600 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2700, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2700 },
    ],
  },
  {
    id: 'floor-xiantiao',
    label: '线条柜',
    installType: 'floor',
    icon: '📐',
    image: VANITY_IMAGES.lineCabinet,
    materials: [
      { id: 'xiangjiao', label: '橡胶木', priceUnit: 1800, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 1800 },
      { id: 'baixian', label: '白蜡木/红橡木', priceUnit: 2100, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2100 },
      { id: 'wujin', label: '乌金木', priceUnit: 2300, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2300 },
      { id: 'heihut', label: '黑胡桃木', priceUnit: 2500, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2500 },
      { id: 'baixiang', label: '白橡直纹', priceUnit: 2500, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 2500 },
    ],
  },
];

// ===== 柜体增配选项 =====
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
    image: VANITY_IMAGES.luowenThreeEdge,
    options: [
      { id: 'front', label: '正面门板/抽屉板锣线条', price: 200, image: VANITY_IMAGES.luowenThreeEdge },
      { id: 'side', label: '两边侧板锣线条', price: 200, image: VANITY_IMAGES.luowenSideEdge },
      { id: 'three', label: '三边锣线条', price: 399, image: VANITY_IMAGES.luowenThreeEdge },
    ],
  },
  {
    id: 'round-post',
    label: '平板柜体加圆弧柱头单加',
    unit: '个',
    icon: '🔘',
    image: VANITY_IMAGES.luowenSideEdge,
    options: [{ id: 'default', label: '圆弧柱头', price: 30 }],
  },
  {
    id: 'frame',
    label: '门板拼框结构单加',
    unit: '个',
    icon: '🟧',
    image: VANITY_IMAGES.luowenFrontDetail,
    options: [{ id: 'default', label: '门板拼框', price: 50 }],
  },
  {
    id: 'led',
    label: '柜体加灯带单加',
    unit: '套',
    icon: '💡',
    options: [{ id: 'default', label: '柜体灯带', price: 100 }],
  },
  {
    id: 'alu-cladding',
    label: '门板/抽屉板包铝合金单加',
    unit: '套',
    icon: '🔩',
    options: [{ id: 'default', label: '铝合金包边', price: 200 }],
  },
];

// ===== 增配选项（吊柜/主柜增配）=====
export const VANITY_EXTRA_ADDONS = [
  {
    id: 'shelf',
    label: '主柜下层板单加',
    unit: '块',
    icon: '🔲',
    options: [
      { id: 'mianqi', label: '免漆材质', price: 0, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 300 },
      { id: 'zaoqi', label: '烤漆材质', price: 0, priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 400 },
    ],
  },
  {
    id: 'bracket',
    label: '吊柜支架单加',
    unit: '套',
    icon: '🪝',
    options: [{ id: 'default', label: '吊柜支架', price: 100 }],
  },
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
  {
    id: 'rail-hettich',
    label: '升级海蒂诗三托底节导轨',
    unit: '副',
    icon: '🛞',
    options: [{ id: 'default', label: '海蒂诗导轨', price: 60 }],
  },
  {
    id: 'blum-upgrade',
    label: '升级百隆',
    unit: '套',
    icon: '🛞',
    options: [{ id: 'default', label: '百隆升级', price: 200 }],
  },
  {
    id: 'horse-drawer',
    label: '升级骑马抽',
    unit: '套',
    icon: '🗃️',
    options: [{ id: 'default', label: '骑马抽', price: 120 }],
  },
  {
    id: 'magic-drawer',
    label: '升级魔力发光抽',
    unit: '套',
    icon: '💡',
    options: [{ id: 'default', label: '魔力发光抽', price: 180 }],
  },
  {
    id: 'onepiece-pedestal',
    label: '一体柱盆',
    unit: '个',
    icon: '🚿',
    options: [
      { id: 'yanban', label: '岩板一体柱盆', price: 1600 },
      { id: 'renzao', label: '人造石一体柱盆', price: 1390 },
      { id: 'dali', label: '大理石一体柱盆', price: 5500 },
    ],
  },
  {
    id: 'tissue-hole',
    label: '抽纸孔',
    unit: '个',
    icon: '🧻',
    options: [{ id: 'default', label: '抽纸孔', price: 50 }],
  },
  {
    id: 'beauty-shelf',
    label: '内置美妆架',
    unit: '个',
    icon: '💄',
    options: [{ id: 'default', label: '美妆架', price: 100 }],
  },
  {
    id: 'hairdryer-holder',
    label: '吹风筒架',
    unit: '个',
    icon: '💨',
    options: [{ id: 'default', label: '吹风筒架', price: 50 }],
  },
  {
    id: 'power-outlet',
    label: '电源插座',
    unit: '个',
    icon: '🔌',
    options: [{ id: 'default', label: '电源插座', price: 50 }],
  },
  {
    id: 'shelf-multi',
    label: '多功能置物架',
    unit: '套',
    icon: '🗂️',
    options: [{ id: 'default', label: '多功能置物架', price: 200 }],
  },
];

// ===== 包装选项 =====
export const VANITY_PACKING_ITEMS = [
  {
    id: 'packing-cabinet',
    label: '主柜夹板打包',
    unit: '项',
    icon: '📦',
    options: [
      { id: 'hanging', label: '吊柜', priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 80 },
      { id: 'floor', label: '主柜', priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 100 },
    ],
  },
  {
    id: 'packing-mirror',
    label: '浴室镜夹板打包',
    unit: '项',
    icon: '🪞',
    options: [
      { id: 'single', label: '单镜', priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 70 },
      { id: 'cabinet', label: '镜柜', priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 80 },
    ],
  },
  {
    id: 'packing-counter',
    label: '台面夹板打包',
    unit: '项',
    icon: '🧱',
    options: [
      { id: 'normal', label: '夹板打包', priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 90 },
      { id: 'wood', label: '夹板木箱打包', priceFormula: (e: number) => Math.max(Math.ceil(e / 100) * 100, 800) / 1000 * 180 },
    ],
  },
];

// ===== 台面安装类型 =====
export const VANITY_INSTALL_TYPES_BASIN = [
  { id: 'above', label: '台上盆' },
  { id: 'under', label: '台下盆' },
];

// ===== 台盆材料配置 =====
export interface CountertopOption {
  id: string;
  label: string;
  priceType: 'length' | 'unit';
  priceFormula: (len: number) => number;
  unit?: string;
  priceFormulaStr?: string;
}

export interface ExtraOption {
  id: string;
  label: string;
  priceType: 'length' | 'unit';
  priceFormula: (len: number) => number;
  unit?: string;
  priceFormulaStr?: string;
  /** 自定义单价标签（如大理石吊边按类别显示） */
  priceLabel?: string;
}

export interface BasinMaterialOption {
  id: string;
  label: string;
  /** 子选项下拉列表（如"陶瓷台上盆"需选材质），若无则直接是计数器 */
  dropdown?: { id: string; label: string; unitPrice: number; unit?: string }[];
  /** 无下拉时为简单计数器 */
  unitPrice?: number;
  unit?: string;
}

export interface BasinOption {
  id: string;
  label: string;
  priceType: 'unit' | 'length';
  unitPrice?: number;
  priceFormula?: (len: number) => number;
  unit?: string;
}

export interface BasinMaterial {
  id: string;
  label: string;
  image: string;
  countertopOptions: CountertopOption[];
  extraOptions?: ExtraOption[];
  basinMaterialOptions?: BasinMaterialOption[];
  basinQtyUnitPrice?: number;
  basinOptions?: BasinOption[];
}

export interface BasinType {
  id: string;
  label: string;
  materials: BasinMaterial[];
}

export const VANITY_BASIN_TYPES = {
  above: {
    id: 'above',
    label: '台上盆',
    materials: [
      {
        id: 'yanban',
        label: '岩板',
        image: VANITY_IMAGES.aboveYanban,
        countertopOptions: [
          { id: 'single-layer', label: '单层岩板（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 200, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×200' },
        ],
        // 台盆 = basinMaterialOptions + 台中盆单加（合并到台盆区块展示）
        extraOptions: [
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 260, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×260', priceLabel: '¥260/800mm' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 300, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×300', priceLabel: '¥300/800mm' },
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (e) => Math.max(e, 1000) / 1000 * 30, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×30', priceLabel: '¥30/1000mm' },
          { id: 'over-2m', label: '长度超2米单加', priceType: 'length', priceFormula: (e) => e / 1000 * 100, unit: 'mm', priceFormulaStr: '长度/1000×100', priceLabel: '¥100/m' },
        ],
        basinMaterialOptions: [
          {
            id: 'taoci-dropdown',
            label: '陶瓷台上盆',
            dropdown: [
              { id: 'taoci', label: '陶瓷', unitPrice: 200, unit: '个' },
              { id: 'shuijing', label: '水晶', unitPrice: 550, unit: '个' },
              { id: 'buxiugang', label: '不锈钢', unitPrice: 650, unit: '个' },
              { id: 'dali', label: '大理石', unitPrice: 1000, unit: '个' },
            ],
          },
        ],
        // 台中盆单加（¥280/个）放在台盆区块展示，从 extraOptions 中移除
        basinQtyUnitPrice: 280,
      },
      {
        id: 'shiying',
        label: '石英石',
        image: VANITY_IMAGES.aboveShiying,
        countertopOptions: [
          { id: 'single-layer', label: '石英石单层（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 500, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×500' },
        ],
        extraOptions: [
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 650, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×650', priceLabel: '¥650/800mm' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 720, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×720', priceLabel: '¥720/800mm' },
        ],
        basinMaterialOptions: [
          {
            id: 'taoci-dropdown',
            label: '陶瓷台上盆',
            dropdown: [
              { id: 'taoci', label: '陶瓷', unitPrice: 200, unit: '个' },
              { id: 'shuijing', label: '水晶', unitPrice: 550, unit: '个' },
              { id: 'buxiugang', label: '不锈钢', unitPrice: 650, unit: '个' },
              { id: 'dali', label: '大理石', unitPrice: 1000, unit: '个' },
            ],
          },
        ],
        basinQtyUnitPrice: 280,
      },
      {
        id: 'dali',
        label: '大理石',
        image: VANITY_IMAGES.aboveDali,
        countertopOptions: [
          { id: 'grade-a', label: 'A类高端大理石（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 1100, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×1100' },
          { id: 'grade-b', label: 'B类中端大理石（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 800, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×800' },
          { id: 'grade-c', label: 'C类低端大理石（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 600, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×600' },
        ],
        extraOptions: [
          { id: 'edge-a-100', label: 'A类吊边H<100mm', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 200, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×200', priceLabel: '¥200/800mm' },
          { id: 'edge-b-100', label: 'B类吊边H<100mm', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 150, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×150', priceLabel: '¥150/800mm' },
          { id: 'edge-c-100', label: 'C类吊边H<100mm', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 100, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×100', priceLabel: '¥100/800mm' },
          { id: 'edge-a-200', label: 'A类吊边H<200mm', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 260, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×260', priceLabel: '¥260/800mm' },
          { id: 'edge-b-200', label: 'B类吊边H<200mm', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 200, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×200', priceLabel: '¥200/800mm' },
          { id: 'edge-c-200', label: 'C类吊边H<200mm', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 150, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×150', priceLabel: '¥150/800mm' },
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (e) => Math.max(e, 1000) / 1000 * 100, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×100', priceLabel: '¥100/1000mm' },
        ],
        basinMaterialOptions: [
          { id: 'taoc', label: '陶瓷台上盆', unitPrice: 200, unit: '个' },
          { id: 'shuij', label: '水晶台上盆', unitPrice: 550, unit: '个' },
          { id: 'buxiu', label: '不锈钢台上盆', unitPrice: 650, unit: '个' },
          { id: 'dali', label: '大理石台上盆', unitPrice: 1000, unit: '个' },
        ],
        basinQtyUnitPrice: 280,
      },
    ],
  } as BasinType,
  under: {
    id: 'under',
    label: '台下盆',
    materials: [
      {
        id: 'yanban',
        label: '岩板',
        image: VANITY_IMAGES.underYanban,
        countertopOptions: [
          { id: 'single-layer', label: '单层岩板（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 200, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×200' },
        ],
        extraOptions: [
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 260, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×260', priceLabel: '¥260/800mm' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 300, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×300', priceLabel: '¥300/800mm' },
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (e) => Math.max(e, 1000) / 1000 * 30, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×30', priceLabel: '¥30/1000mm' },
          { id: 'over-2m', label: '长度超2米单加', priceType: 'length', priceFormula: (e) => e / 1000 * 100, unit: 'mm', priceFormulaStr: '长度/1000×100', priceLabel: '¥100/m' },
        ],
        basinOptions: [
          { id: 'youdeng', label: '优等台下盆（普通工艺）', priceType: 'unit', unitPrice: 90, unit: '个' },
          { id: 'wufeng', label: '岩板无缝拼接陶瓷盆', priceType: 'unit', unitPrice: 300, unit: '个' },
          { id: 'jiedati', label: '岩板拼接一体盆', priceType: 'unit', unitPrice: 350, unit: '个' },
          { id: 'rewan-white', label: '热弯一体盆（白色/鱼肚白）', priceType: 'length', priceFormula: (e) => e / 1000 * 900, unit: 'mm' },
          { id: 'rewan-other', label: '热弯一体盆（其他颜色）', priceType: 'length', priceFormula: (e) => e / 1000 * 1000, unit: 'mm' },
          { id: 'rewan-edge', label: '热弯一体盆吊边H<200mm', priceType: 'length', priceFormula: (e) => e / 1000 * 200, unit: 'mm' },
          { id: 'extra-rewan', label: '单加岩板热弯一体盆', priceType: 'unit', unitPrice: 300, unit: '个' },
        ],
      },
      {
        id: 'shiying',
        label: '石英石',
        image: VANITY_IMAGES.underShiying,
        countertopOptions: [
          { id: 'single-layer', label: '石英石单层（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 500, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×500' },
        ],
        extraOptions: [
          { id: 'edge-100', label: '吊边H<100mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 650, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×650', priceLabel: '¥650/800mm' },
          { id: 'edge-200', label: '吊边H<200mm（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 720, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×720', priceLabel: '¥720/800mm' },
        ],
        basinOptions: [
          { id: 'wufeng-gen1', label: '一代无缝拼接盆', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 500, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×500' },
          { id: 'wufeng-gen2', label: '二代无缝拼接盆', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 600, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×600' },
          { id: 'jiedati', label: '拼接一体盆', priceType: 'unit', unitPrice: 450, unit: '个' },
          { id: 'youdeng', label: '优等台下盆（普通工艺）', priceType: 'unit', unitPrice: 90, unit: '个' },
        ],
      },
      {
        id: 'kelinai',
        label: '可丽耐',
        image: VANITY_IMAGES.underKelinai,
        countertopOptions: [
          { id: 'white-single', label: '白色单层', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 950, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×950' },
          { id: 'other-single', label: '其他颜色单层', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 1100, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×1100' },
        ],
        extraOptions: [
          { id: 'white-edge', label: '白色吊边H<250mm周长单加', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 260, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×260', priceLabel: '¥260/800mm' },
          { id: 'other-edge', label: '其他颜色吊边H<250mm周长单加', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 410, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×410', priceLabel: '¥410/800mm' },
          { id: 'white-splash', label: '白色可丽耐挡水单加', priceType: 'length', priceFormula: (e) => Math.max(e, 1000) / 1000 * 100, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×100', priceLabel: '¥100/1000mm' },
        ],
        basinOptions: [
          { id: 'kelinai-basin', label: '白色可丽耐盆单加', priceType: 'unit', unitPrice: 300, unit: '个' },
        ],
      },
      {
        id: 'dali',
        label: '大理石',
        image: VANITY_IMAGES.underDali,
        countertopOptions: [
          { id: 'grade-a', label: 'A类高端大理石（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 1100, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×1100' },
          { id: 'grade-b', label: 'B类中端大理石（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 800, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×800' },
          { id: 'grade-c', label: 'C类低端大理石（不含盆）', priceType: 'length', priceFormula: (e) => Math.max(e, 800) / 1000 * 600, unit: 'mm', priceFormulaStr: 'MAX(长度,800)/1000×600' },
        ],
        extraOptions: [
          { id: 'edge-a-100', label: 'A类吊边H<100mm', priceType: 'length', priceFormula: (e) => e / 1000 * 200, unit: 'mm', priceFormulaStr: '长度/1000×200', priceLabel: '¥200/m' },
          { id: 'edge-b-100', label: 'B类吊边H<100mm', priceType: 'length', priceFormula: (e) => e / 1000 * 150, unit: 'mm', priceFormulaStr: '长度/1000×150', priceLabel: '¥150/m' },
          { id: 'edge-c-100', label: 'C类吊边H<100mm', priceType: 'length', priceFormula: (e) => e / 1000 * 100, unit: 'mm', priceFormulaStr: '长度/1000×100', priceLabel: '¥100/m' },
          { id: 'edge-a-200', label: 'A类吊边H<200mm', priceType: 'length', priceFormula: (e) => e / 1000 * 260, unit: 'mm', priceFormulaStr: '长度/1000×260', priceLabel: '¥260/m' },
          { id: 'edge-b-200', label: 'B类吊边H<200mm', priceType: 'length', priceFormula: (e) => e / 1000 * 200, unit: 'mm', priceFormulaStr: '长度/1000×200', priceLabel: '¥200/m' },
          { id: 'edge-c-200', label: 'C类吊边H<200mm', priceType: 'length', priceFormula: (e) => e / 1000 * 150, unit: 'mm', priceFormulaStr: '长度/1000×150', priceLabel: '¥150/m' },
          { id: 'splash', label: '挡水边单加', priceType: 'length', priceFormula: (e) => Math.max(e, 1000) / 1000 * 100, unit: 'mm', priceFormulaStr: 'MAX(长度,1000)/1000×100', priceLabel: '¥100/1000mm' },
        ],
        basinOptions: [
          { id: 'wufeng-gen1', label: '一代无缝拼接盆', priceType: 'unit', unitPrice: 399, unit: '个' },
          { id: 'wufeng-gen2', label: '二代无缝拼接盆', priceType: 'unit', unitPrice: 500, unit: '个' },
          { id: 'jiedati', label: '拼接一体盆', priceType: 'unit', unitPrice: 450, unit: '个' },
          { id: 'youdeng', label: '优等台下盆（普通工艺）', priceType: 'unit', unitPrice: 90, unit: '个' },
        ],
      },
    ],
  } as BasinType,
};

// ===== 镜面类型 =====
export const VANITY_WOOD_MATERIALS = [
  { id: 'mianqi', label: '免漆板' },
  { id: 'xiangjiao', label: '橡胶木' },
  { id: 'baixian', label: '白蜡木/红橡木' },
  { id: 'wujin', label: '乌金木' },
  { id: 'heihut', label: '黑胡桃木' },
  { id: 'baixiang', label: '白橡直纹' },
];

// 倒R角固定加价
export const VANITY_R_CORNER_PRICE = 60;

// ===== 镜面配置（面积型，按 m² 计）=====
export interface MirrorAreaOption {
  id: string;
  label: string;
  // 输入面积 m²，计价公式：MAX(面积, 0.6) * pricePerSqm - 100
  pricePerSqm: number;
  // R角加价，0 表示不支持R角
  rCornerExtra: number;
}

// ===== 镜面配置（长度型，按 m 计）=====
export interface MirrorLengthOption {
  id: string;
  label: string;
  // 系数，按木材类型 key，计价公式：MAX(长度mm, 800) / 1000 * 系数 - 100
  pricePerMeter: { [key: string]: number };
  // R角额外加价
  rCornerExtra: number;
}

// ===== 普通镜 - 镜面配置（单镜无收纳）=====
export const VANITY_PLAIN_SINGLE_MIRROR_OPTIONS: MirrorAreaOption[] = [
  { id: 'no-border', label: '不包边', pricePerSqm: 650, rCornerExtra: 60 },
  { id: 'alu', label: '铝型材包边', pricePerSqm: 700, rCornerExtra: 60 },
  // 木框包边：见 VANITY_PLAIN_WOOD_LENGTH_OPT（长度型，单独渲染）
  { id: 'stainless', label: '304#不锈钢包边', pricePerSqm: 950, rCornerExtra: 60 },
];

// ===== 普通镜木框 - 长度型选项 =====
export const VANITY_PLAIN_WOOD_LENGTH_OPT: MirrorLengthOption = {
  id: 'wood',
  label: '木框包边',
  pricePerMeter: { mianqi: 700, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1399, baixiang: 1500 },
  rCornerExtra: 60,
};

// ===== 普通镜柜 - 镜面配置（镜柜有收纳）=====
export const VANITY_PLAIN_CABINET_MIRROR_OPT: MirrorLengthOption = {
  id: 'plain-cabinet-wood',
  label: '木材镜柜',
  pricePerMeter: { mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1399 },
  rCornerExtra: 0, // 镜柜无R角
};

// ===== 智能镜 - 镜面配置（单镜触控/除雾）=====
export const VANITY_SMART_SINGLE_MIRROR_OPTIONS: MirrorAreaOption[] = [
  { id: 'smart-no-border-backlight', label: '不包边背光', pricePerSqm: 500, rCornerExtra: 60 },
  { id: 'smart-no-border-sand', label: '不包边正面打砂发光', pricePerSqm: 650, rCornerExtra: 60 },
  // 木材包边：见 VANITY_SMART_WOOD_LENGTH_OPT_*（长度型，单独渲染）
  { id: 'smart-alu-backlight', label: '铝型材包边背光', pricePerSqm: 650, rCornerExtra: 60 },
  { id: 'smart-alu-sand', label: '铝型材包边正面打砂发光', pricePerSqm: 700, rCornerExtra: 60 },
  { id: 'smart-stainless-backlight', label: '304#不锈钢包边背光', pricePerSqm: 900, rCornerExtra: 60 },
  { id: 'smart-stainless-sand', label: '304#不锈钢包边正面打砂发光', pricePerSqm: 950, rCornerExtra: 60 },
];

// ===== 智能镜木材 - 长度型选项 =====
export const VANITY_SMART_WOOD_LENGTH_OPT_BACKLIGHT: MirrorLengthOption = {
  id: 'smart-wood-backlight',
  label: '木材包边背光',
  pricePerMeter: { mianqi: 600, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1300, baixiang: 1399 },
  rCornerExtra: 60,
};

export const VANITY_SMART_WOOD_LENGTH_OPT_SAND: MirrorLengthOption = {
  id: 'smart-wood-sand',
  label: '木材包边正面打砂发光',
  pricePerMeter: { mianqi: 700, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1399, baixiang: 1500 },
  rCornerExtra: 60,
};

// ===== 智能镜柜 - 镜面配置（镜柜触控+收纳）=====
export const VANITY_SMART_CABINET_MIRROR_OPT_BACKLIGHT: MirrorLengthOption = {
  id: 'smart-cabinet-backlight',
  label: '木材镜柜上下发光',
  pricePerMeter: { mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1300 },
  rCornerExtra: 0,
};

export const VANITY_SMART_CABINET_MIRROR_OPT_SAND: MirrorLengthOption = {
  id: 'smart-cabinet-sand',
  label: '木材镜柜正面打砂发光',
  pricePerMeter: { mianqi: 750, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1300, baixiang: 1399 },
  rCornerExtra: 0,
};

// ===== 普通镜类型 =====
export const VANITY_PLAIN_MIRROR_TYPES: MirrorAreaOption[] = [
  { id: 'plain-single', label: '不包边背光', pricePerSqm: 650, rCornerExtra: 60 },
  { id: 'alu', label: '铝型材包边', pricePerSqm: 700, rCornerExtra: 60 },
  { id: 'wood', label: '木框包边', pricePerSqm: 0, rCornerExtra: 60 },
  { id: 'stainless', label: '304#不锈钢包边', pricePerSqm: 950, rCornerExtra: 60 },
];

// ===== 普通镜柜类型 =====
export const VANITY_PLAIN_CABINET_TYPES: MirrorLengthOption[] = [
  { id: 'plain-cabinet-wood', label: '木材普通镜柜', pricePerMeter: { mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1399 }, rCornerExtra: 0 },
];

// ===== 智能镜类型 =====
export const VANITY_SMART_MIRROR_TYPES: MirrorAreaOption[] = [
  { id: 'smart-no-border-backlight', label: '不包边背光', pricePerSqm: 500, rCornerExtra: 60 },
  { id: 'smart-no-border-sand', label: '不包边正面打砂发光', pricePerSqm: 650, rCornerExtra: 60 },
  { id: 'smart-wood-backlight', label: '木材包边背光', pricePerSqm: 0, rCornerExtra: 60 },
  { id: 'smart-wood-sand', label: '木材包边正面打砂发光', pricePerSqm: 0, rCornerExtra: 60 },
  { id: 'smart-alu-backlight', label: '铝型材包边背光', pricePerSqm: 650, rCornerExtra: 60 },
  { id: 'smart-alu-sand', label: '铝型材包边正面打砂发光', pricePerSqm: 700, rCornerExtra: 60 },
  { id: 'smart-stainless-backlight', label: '304#不锈钢包边背光', pricePerSqm: 900, rCornerExtra: 60 },
  { id: 'smart-stainless-sand', label: '304#不锈钢包边正面打砂发光', pricePerSqm: 950, rCornerExtra: 60 },
];

// ===== 智能镜柜类型 =====
export const VANITY_SMART_CABINET_TYPES: MirrorLengthOption[] = [
  { id: 'smart-cabinet-backlight', label: '木材镜柜上下发光', pricePerMeter: { mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1300 }, rCornerExtra: 0 },
  { id: 'smart-cabinet-sand', label: '木材镜柜正面打砂发光', pricePerMeter: { mianqi: 750, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1300, baixiang: 1399 }, rCornerExtra: 0 },
];

// ===== 镜面计价系数（侧柜、开放格、美式造型用）=====
// 侧柜系数（按米）
export const VANITY_SIDE_CABINET_PRICE_PER_M = {
  mianqi: 260, xiangjiao: 360, baixian: 430, wujin: 460, heihut: 480, baixiang: 539,
};
// 开放格系数（按米）
export const VANITY_OPEN_SHELF_PRICE_PER_M = {
  mianqi: 200, xiangjiao: 300, baixian: 360, wujin: 380, heihut: 399, baixiang: 450,
};
// 美式造型固定费用
export const VANITY_AMERICAN_STYLE_PRICE = 300;
// 玻璃层板
export const VANITY_GLASS_SHELF_PRICE = 30;
// 层格/侧柜发光
export const VANITY_SHELF_LIGHT_PRICE = 100;
// 玻璃门
export const VANITY_GLASS_DOOR_PRICE = 200;
// 铝合金门玻璃门
export const VANITY_ALU_GLASS_DOOR_PRICE = 200;

// ===== 镜面计价系数（按长度）=====
// 普通镜木框系数
export const VANITY_PLAIN_WOOD_PRICE: Record<string, number> = {
  mianqi: 700, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1399, baixiang: 1500,
};
// 普通镜柜系数
export const VANITY_PLAIN_CABINET_PRICE: Record<string, number> = {
  mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1399,
};
// 智能镜木框背光系数
export const VANITY_SMART_WOOD_BACKLIGHT: Record<string, number> = {
  mianqi: 600, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1300, baixiang: 1399,
};
// 智能镜木框打砂系数
export const VANITY_SMART_WOOD_SAND: Record<string, number> = {
  mianqi: 700, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1399, baixiang: 1500,
};
// 智能镜柜背光系数
export const VANITY_SMART_CABINET_BACKLIGHT: Record<string, number> = {
  mianqi: 650, xiangjiao: 850, baixian: 1000, wujin: 1100, heihut: 1200, baixiang: 1300,
};
// 智能镜柜打砂系数
export const VANITY_SMART_CABINET_SAND: Record<string, number> = {
  mianqi: 750, xiangjiao: 950, baixian: 1100, wujin: 1200, heihut: 1300, baixiang: 1399,
};
