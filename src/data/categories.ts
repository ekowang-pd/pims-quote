import type { Category, StandardProduct, Supplier, Region } from '../types';
import { CERAMIC_PRODUCTS } from './ceramic_products';

// ===== 供应商列表 =====
export const SUPPLIERS: Supplier[] = [
  { id: 's001', name: '佛山宏达陶瓷', country: '中国', rating: 5, tags: ['工厂直营', 'OEM', 'ISO认证'] },
  { id: 's002', name: '东鹏瓷砖 OEM', country: '中国', rating: 4, tags: ['OEM', '大厂'] },
  { id: 's003', name: '广州美威卫浴', country: '中国', rating: 5, tags: ['工厂直营', 'CE认证'] },
  { id: 's004', name: '恒洁卫浴供应链', country: '中国', rating: 4, tags: ['OEM', '认证'] },
  { id: 's005', name: '圣象地板出口部', country: '中国', rating: 5, tags: ['工厂直营', 'FSC认证'] },
  { id: 's006', name: '大自然地板外贸', country: '中国', rating: 4, tags: ['OEM'] },
  { id: 's007', name: '雷士灯饰外贸', country: '中国', rating: 4, tags: ['工厂直营', 'CE认证'] },
  { id: 's008', name: '欧普照明出口', country: '中国', rating: 5, tags: ['工厂直营', 'CE/UL认证'] },
  { id: 's009', name: '云浮石材出口', country: '中国', rating: 4, tags: ['矿山直供', 'OEM'] },
  { id: 's010', name: '水头石材集团', country: '中国', rating: 5, tags: ['工厂直营', '大板定制'] },
  { id: 's011', name: '鸿运陶瓷外贸', country: '中国', rating: 4, tags: ['工厂直营', '性价比'] },
  { id: 's012', name: '新中源陶瓷', country: '中国', rating: 5, tags: ['大厂', 'OEM', '出口'] },
  // ===== 陶瓷产品线供应商（Excel 导入） =====
  { id: 'cer-001', name: '贝奈利', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-002', name: '新岩素', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-003', name: '地平线', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-004', name: '意丽斯', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-005', name: '众岩联', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-006', name: '贝佳斯', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-007', name: '丹豪', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-008', name: '天欣', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-009', name: '宏昌盛', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-010', name: '福万家', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-011', name: '画马石', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-012', name: '华纳', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-013', name: '欧蒂娜', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-014', name: '双鸥', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-015', name: '伊诗隆', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-016', name: '麦迪奇', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-017', name: '金航', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-018', name: '粤庭', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-019', name: '珍妮罗曼', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-020', name: '百艾特', country: '中国', rating: 4, tags: ['工厂直营'] },
  { id: 'cer-021', name: '家炜鑫', country: '中国', rating: 4, tags: ['工厂直营'] },
];

export const CATEGORIES: Category[] = [
  {
    id: 'ceramic',
    name: '陶瓷',
    icon: 'ceramic',
    // ── 二级分类（按品类）──
    // 原"系列名"（素色系列/玉石系列等）下沉为三级，通过 seriesName 字段挂在产品卡上
    subCategories: [
      {
        id: 'ceramic-tile',
        name: '瓷砖',
        specs: [],
        colors: ['灰', '白', '米白', '米黄', '浅灰', '中灰', '深灰', '黑', '棕', '绿色', '黑金', '粉', '金色'],
        sizes: ['2400x1200mm', '2600x900mm', '2700x1200mm', '1800x900mm', '3200x1200mm', '3200x1600mm', '2800x1200mm', '3000x1200mm', '1200x600mm', '1200x1200mm', '600x600mm', '800x800mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'series', label: '系列', type: 'tag', options: [
            { value: '素色系列', label: '素色系列' }, { value: '玉石系列', label: '玉石系列' },
            { value: '洞石系列', label: '洞石系列' }, { value: '砂岩系列', label: '砂岩系列' },
            { value: '水泥系列', label: '水泥系列' }, { value: '莱姆石系列', label: '莱姆石系列' },
            { value: '白色大理石系列', label: '白色大理石' }, { value: '奢石系列', label: '奢石系列' },
            { value: '方正大板系列', label: '大板' }, { value: '大理石系列', label: '大理石系列' },
          ] },
          { key: 'surface', label: '表面', type: 'tag', options: [{ value: '亮光', label: '亮光' }, { value: '哑光', label: '哑光' }, { value: '柔光', label: '柔光' }] },
          { key: 'craft', label: '工艺', type: 'tag', options: [
            { value: '超细哑干粒', label: '超细哑干粒' }, { value: '干粒釉', label: '干粒釉' },
            { value: '钻石结晶釉', label: '钻石结晶釉' }, { value: '质感微光', label: '质感微光' },
            { value: '通体模具干粒', label: '通体模具干粒' }, { value: '平面刷抛', label: '平面刷抛' },
          ] },
          { key: 'color', label: '颜色', type: 'color', options: [
            { value: '灰', label: '灰' }, { value: '白', label: '白' }, { value: '米白', label: '米白' },
            { value: '米黄', label: '米黄' }, { value: '浅灰', label: '浅灰' }, { value: '深灰', label: '深灰' },
            { value: '黑', label: '黑' }, { value: '棕', label: '棕' }, { value: '绿色', label: '绿色' },
          ] },
          { key: 'size', label: '尺寸', type: 'tag', options: [
            { value: '3200x1600mm', label: '3200×1600' }, { value: '3200x1200mm', label: '3200×1200' },
            { value: '2700x1200mm', label: '2700×1200' }, { value: '2400x1200mm', label: '2400×1200' },
            { value: '1200x600mm', label: '1200×600' }, { value: '1200x1200mm', label: '1200×1200' },
            { value: '600x600mm', label: '600×600' },
          ] },
        ],
      },
      {
        id: 'ceramic-rockboard',
        name: '岩板',
        specs: [],
        colors: ['黑', '白', '黄', '深灰', '中灰', '浅灰', '米黄', '灰', '蓝', '米黄'],
        sizes: ['2400x1200mm', '2600x900mm', '2700x1200mm', '3200x1200mm', '3200x1600mm', '1800x900mm', '1200x600mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'series', label: '系列', type: 'tag', options: [
            { value: '素色系列', label: '素色系列' }, { value: '玉石系列', label: '玉石系列' },
            { value: '洞石系列', label: '洞石系列' }, { value: '砂岩系列', label: '砂岩系列' },
            { value: '水泥系列', label: '水泥系列' }, { value: '莱姆石系列', label: '莱姆石系列' },
            { value: '白色大理石系列', label: '白色大理石' }, { value: '奢石系列', label: '奢石系列' },
            { value: '大理石系列', label: '大理石系列' }, { value: '黑色大理石系列', label: '黑色大理石' },
            { value: '木纹系列', label: '木纹系列' }, { value: '水磨石系列', label: '水磨石系列' },
            { value: '花砖系列', label: '花砖系列' }, { value: '对纹系列', label: '对纹系列' },
          ] },
          { key: 'surface', label: '表面', type: 'tag', options: [{ value: '哑光', label: '哑光' }, { value: '亮光', label: '亮光' }, { value: '柔光', label: '柔光' }] },
          { key: 'craft', label: '工艺', type: 'tag', options: [
            { value: '超细哑干粒', label: '超细哑干粒' }, { value: '干粒釉', label: '干粒釉' },
            { value: '干粒抛', label: '干粒抛' }, { value: '质感微光', label: '质感微光' },
            { value: '透光石', label: '透光石' }, { value: '亮光', label: '亮光' },
          ] },
          { key: 'color', label: '颜色', type: 'color', options: [
            { value: '黑', label: '黑' }, { value: '白', label: '白' }, { value: '灰', label: '灰' },
            { value: '深灰', label: '深灰' }, { value: '米黄', label: '米黄' }, { value: '黄', label: '黄' },
          ] },
          { key: 'size', label: '尺寸', type: 'tag', options: [
            { value: '3200x1600mm', label: '3200×1600' }, { value: '3200x1200mm', label: '3200×1200' },
            { value: '2700x1200mm', label: '2700×1200' }, { value: '2400x1200mm', label: '2400×1200' },
            { value: '1800x900mm', label: '1800×900' }, { value: '1200x600mm', label: '1200×600' },
          ] },
        ],
      },
      {
        id: 'ceramic-wood',
        name: '木纹砖',
        specs: [],
        colors: ['黄', '灰', '米黄', '咖', '深咖'],
        sizes: ['2700x900mm', '2700x1200mm', '2600x800mm', '1200x600mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'series', label: '系列', type: 'tag', options: [
            { value: '中长规格系列', label: '中长规格' }, { value: '超窄条系列', label: '超窄条' },
            { value: '木纹拼花系列', label: '木纹拼花' },
          ] },
          { key: 'surface', label: '表面', type: 'tag', options: [{ value: '哑光', label: '哑光' }] },
          { key: 'craft', label: '工艺', type: 'tag', options: [
            { value: '数码模具', label: '数码模具' }, { value: '精雕', label: '精雕' }, { value: '数码釉', label: '数码釉' },
            { value: '模具直边瓷木', label: '瓷木模具' },
          ] },
          { key: 'color', label: '颜色', type: 'color', options: [
            { value: '黄', label: '黄' }, { value: '灰', label: '灰' }, { value: '咖', label: '咖' }, { value: '深咖', label: '深咖' },
            { value: '红色', label: '红色' }, { value: '米黄', label: '米黄' },
          ] },
          { key: 'size', label: '尺寸', type: 'tag', options: [
            { value: '2700x900mm', label: '2700×900' }, { value: '2700x1200mm', label: '2700×1200' },
            { value: '900x150mm', label: '900×150' }, { value: '1200x600mm', label: '1200×600' },
          ] },
        ],
      },
      {
        id: 'ceramic-mosaic',
        name: '马赛克',
        specs: [],
        colors: ['绿色', '白色', '蓝色', '红色'],
        sizes: ['310x310mm', '48x40mm', '150x150mm', '600x300mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'series', label: '系列', type: 'tag', options: [
            { value: '异形系列', label: '异形系列' }, { value: '正方形系列', label: '正方形' },
            { value: '长方形系列', label: '长方形' }, { value: '大规格系列', label: '大规格' },
          ] },
          { key: 'surface', label: '表面', type: 'tag', options: [{ value: '哑光', label: '哑光' }, { value: '亮光', label: '亮光' }] },
          { key: 'craft', label: '工艺', type: 'tag', options: [
            { value: '模具面', label: '模具面' }, { value: '亮光', label: '亮光' }, { value: '哑光', label: '哑光' },
          ] },
          { key: 'color', label: '颜色', type: 'color', options: [
            { value: '绿色', label: '绿色' }, { value: '白色', label: '白色' }, { value: '蓝色', label: '蓝色' }, { value: '红色', label: '红色' },
          ] },
          { key: 'size', label: '尺寸', type: 'tag', options: [
            { value: '310x310mm', label: '310×310' }, { value: '48x40mm', label: '48×40' },
            { value: '150x150mm', label: '150×150' }, { value: '600x300mm', label: '600×300' },
          ] },
        ],
      },
      {
        id: 'ceramic-art',
        name: '艺术砖',
        specs: [],
        colors: ['白色', '米色', '灰色', '蓝色', '黑色', '红色', '黄色', '橙色', '咖色', '绿色'],
        sizes: ['230x75mm', '300x75mm', '300x300mm', '306x306mm', '294x282mm', '301x301mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'series', label: '系列', type: 'tag', options: [
            { value: '简约系列', label: '简约系列' }, { value: '仿古系列', label: '仿古系列' },
            { value: '几何系列', label: '几何系列' },
          ] },
          { key: 'surface', label: '表面', type: 'tag', options: [{ value: '哑光', label: '哑光' }, { value: '亮光', label: '亮光' }] },
          { key: 'craft', label: '工艺', type: 'tag', options: [
            { value: '喷墨哑光微模', label: '喷墨哑光' }, { value: '喷墨亮光微模', label: '喷墨亮光' },
            { value: '喷墨哑光', label: '喷墨哑光' }, { value: '冰晶釉', label: '冰晶釉' },
          ] },
          { key: 'color', label: '颜色', type: 'color', options: [
            { value: '白色', label: '白色' }, { value: '米色', label: '米色' }, { value: '灰色', label: '灰色' },
            { value: '蓝色', label: '蓝色' }, { value: '黑色', label: '黑色' }, { value: '红色', label: '红色' },
            { value: '黄色', label: '黄色' }, { value: '橙色', label: '橙色' }, { value: '绿色', label: '绿色' },
          ] },
          { key: 'size', label: '尺寸', type: 'tag', options: [
            { value: '230x75mm', label: '230×75' }, { value: '300x75mm', label: '300×75' },
            { value: '300x300mm', label: '300×300' }, { value: '294x282mm', label: '294×282' },
          ] },
        ],
      },
      {
        id: 'ceramic-antique',
        name: '仿古砖',
        specs: [],
        colors: ['白色', '米色', '灰色', '蓝色', '黑色', '红色', '黄色', '浅灰', '橙色', '咖色'],
        sizes: ['300x300mm', '306x306mm', '294x282mm', '301x301mm', '600x600mm', '1200x600mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'series', label: '系列', type: 'tag', options: [
            { value: '大理石系列', label: '大理石系列' }, { value: '水泥系列', label: '水泥系列' },
            { value: '砂岩系列', label: '砂岩系列' }, { value: '莱姆石系列', label: '莱姆石系列' },
            { value: '洞石系列', label: '洞石系列' }, { value: '板岩系列', label: '板岩系列' },
            { value: '水磨石系列', label: '水磨石系列' }, { value: '古堡砖系列', label: '古堡砖系列' },
            { value: '花砖系列', label: '花砖系列' },
          ] },
          { key: 'surface', label: '表面', type: 'tag', options: [{ value: '哑光', label: '哑光' }, { value: '亮光', label: '亮光' }] },
          { key: 'craft', label: '工艺', type: 'tag', options: [
            { value: '菠萝面', label: '菠萝面' }, { value: '冰裂', label: '冰裂' }, { value: '喷墨哑光', label: '喷墨哑光' },
            { value: '模具面', label: '模具面' }, { value: '亮光', label: '亮光' },
          ] },
          { key: 'color', label: '颜色', type: 'color', options: [
            { value: '白色', label: '白色' }, { value: '米色', label: '米色' }, { value: '灰色', label: '灰色' },
            { value: '蓝色', label: '蓝色' }, { value: '黑色', label: '黑色' }, { value: '红色', label: '红色' },
          ] },
          { key: 'size', label: '尺寸', type: 'tag', options: [
            { value: '300x300mm', label: '300×300' }, { value: '294x282mm', label: '294×282' },
            { value: '600x600mm', label: '600×600' }, { value: '1200x600mm', label: '1200×600' },
          ] },
        ],
      },
      {
        id: 'ceramic-floor',
        name: '地铺石',
        specs: [],
        colors: ['灰', '黑', '米黄', '棕', '蓝', '绿', '白'],
        sizes: ['600x300mm', '600x600mm', '798x798mm', '1200x600mm', '150x150mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'series', label: '系列', type: 'tag', options: [
            { value: '花岗岩系列', label: '花岗岩' }, { value: '马蹄石系列', label: '马蹄石' },
            { value: '地铺石系列', label: '地铺石' }, { value: '幕墙景观砖系列', label: '幕墙景观' },
          ] },
          { key: 'surface', label: '表面', type: 'tag', options: [
            { value: '哑光', label: '哑光' }, { value: '亮光', label: '亮光' },
            { value: '荔枝面', label: '荔枝面' }, { value: '火烧面', label: '火烧面' },
          ] },
          { key: 'craft', label: '工艺', type: 'tag', options: [
            { value: '精雕', label: '精雕' }, { value: '天鹅绒', label: '天鹅绒' },
            { value: '模具面', label: '模具面' }, { value: '荔枝面全通体', label: '荔枝面' },
          ] },
          { key: 'color', label: '颜色', type: 'color', options: [
            { value: '灰', label: '灰' }, { value: '黑', label: '黑' }, { value: '米黄', label: '米黄' },
            { value: '棕', label: '棕' }, { value: '蓝', label: '蓝' }, { value: '绿', label: '绿' },
          ] },
          { key: 'size', label: '尺寸', type: 'tag', options: [
            { value: '600x300mm', label: '600×300' }, { value: '600x600mm', label: '600×600' },
            { value: '1200x600mm', label: '1200×600' }, { value: '150x150mm', label: '150×150' },
          ] },
        ],
      },
    ],
  },
  {
    id: 'sanitary',
    name: '卫浴',
    icon: 'sanitary',
    subCategories: [
      // ===== 定制品入口（组合品） =====
      {
        id: 'custom-combo',
        name: '定制品',
        specs: [],
        colors: [],
        sizes: [],
        unit: '套',
        filterGroups: [],
      },
      {
        id: 'toilet',
        name: '马桶',
        specs: [{ value: 'one-piece', label: '连体' }, { value: 'two-piece', label: '分体' }, { value: 'smart', label: '智能' }],
        colors: ['白色', '哑白', '米色'],
        sizes: ['305mm坑距', '400mm坑距'],
        unit: '件',
        filterGroups: [
          { key: 'installType', label: '安装方式', type: 'tag', options: [{ value: '落地式', label: '落地式' }, { value: '壁挂式', label: '壁挂式' }] },
          { key: 'spec', label: '马桶类型', type: 'tag', options: [{ value: '连体', label: '连体' }, { value: '分体', label: '分体' }, { value: '智能', label: '智能一体' }] },
          { key: 'flushType', label: '冲水方式', type: 'tag', options: [{ value: '旋涡冲', label: '旋涡冲' }, { value: '直冲', label: '直冲' }, { value: '虹吸', label: '虹吸' }] },
          { key: 'size', label: '坑距', type: 'tag', options: [{ value: '305mm坑距', label: '305mm' }, { value: '400mm坑距', label: '400mm' }] },
        ],
      },
      {
        id: 'basin',
        name: '面盆',
        specs: [{ value: 'above-counter', label: '台上盆' }, { value: 'under-counter', label: '台下盆' }, { value: 'wall-hung', label: '挂墙盆' }],
        colors: ['白色', '黑色', '米色'],
        sizes: ['500x400mm', '600x460mm', '700x480mm'],
        unit: '件',
        filterGroups: [
          { key: 'installType', label: '安装方式', type: 'tag', options: [{ value: '台上盆', label: '台上' }, { value: '台下盆', label: '台下' }, { value: '挂墙盆', label: '挂墙' }, { value: '立柱盆', label: '立柱' }] },
          { key: 'material', label: '材质', type: 'tag', options: [{ value: '陶瓷', label: '陶瓷' }, { value: '玻璃', label: '钢化玻璃' }, { value: '人造石', label: '人造石' }] },
          { key: 'color', label: '颜色', type: 'color', options: [{ value: '白色', label: '白色', colorHex: '#f9fafb' }, { value: '黑色', label: '黑色', colorHex: '#111827' }, { value: '米色', label: '米色', colorHex: '#fef3c7' }] },
        ],
      },
      {
        id: 'bathtub',
        name: '浴缸',
        specs: [{ value: 'freestanding', label: '独立式' }, { value: 'built-in', label: '嵌入式' }, { value: 'corner', label: '角落式' }],
        colors: ['白色', '哑白', '黑色'],
        sizes: ['1400x700mm', '1500x750mm', '1600x800mm', '1700x800mm'],
        unit: '件',
        filterGroups: [
          { key: 'spec', label: '安装方式', type: 'tag', options: [{ value: '独立式', label: '独立式' }, { value: '嵌入式', label: '嵌入式' }, { value: '角落式', label: '角落式' }] },
          { key: 'material', label: '材质', type: 'tag', options: [{ value: '亚克力', label: '亚克力' }, { value: '铸铁', label: '铸铁' }, { value: '人造石', label: '人造石' }] },
          { key: 'jetType', label: '按摩功能', type: 'tag', options: [{ value: '普通', label: '普通' }, { value: '冲浪按摩', label: '冲浪按摩' }, { value: '气泡按摩', label: '气泡按摩' }] },
          { key: 'size', label: '长度', type: 'tag', options: [{ value: '1400x700mm', label: '1400mm' }, { value: '1500x750mm', label: '1500mm' }, { value: '1600x800mm', label: '1600mm' }, { value: '1700x800mm', label: '1700mm' }] },
        ],
      },
      {
        id: 'shower',
        name: '淋浴房',
        specs: [{ value: 'tempered-glass', label: '钢化玻璃' }, { value: 'frosted', label: '磨砂玻璃' }],
        colors: ['透明', '磨砂', '雾面'],
        sizes: ['900x900mm', '1000x1000mm', '900x1200mm'],
        unit: '套',
        filterGroups: [
          { key: 'shapeType', label: '形状', type: 'tag', options: [{ value: '方形', label: '方形' }, { value: '弧形', label: '弧形扇形' }, { value: '直线型', label: '直线型' }] },
          { key: 'doorType', label: '门型', type: 'tag', options: [{ value: '推拉门', label: '推拉门' }, { value: '平开门', label: '平开门' }, { value: '折叠门', label: '折叠门' }] },
          { key: 'spec', label: '玻璃类型', type: 'tag', options: [{ value: '钢化玻璃', label: '钢化玻璃' }, { value: '磨砂玻璃', label: '磨砂' }] },
          { key: 'size', label: '尺寸', type: 'tag', options: [{ value: '900x900mm', label: '900×900' }, { value: '1000x1000mm', label: '1000×1000' }, { value: '900x1200mm', label: '900×1200' }] },
        ],
      },
    ],
  },
  {
    id: 'furniture',
    name: '家具',
    icon: 'furniture',
    subCategories: [
      {
        id: 'sofa',
        name: '沙发',
        specs: [{ value: 'leather', label: '皮质' }, { value: 'fabric', label: '布艺' }, { value: 'velvet', label: '绒面' }],
        colors: ['米色', '灰色', '深蓝', '棕色', '黑色', '白色'],
        sizes: ['2座', '3座', '4座', 'L形'],
        unit: '套',
        filterGroups: [
          { key: 'spec', label: '面料', type: 'tag', options: [{ value: '皮质', label: '皮质' }, { value: '布艺', label: '布艺' }, { value: '绒面', label: '绒面' }] },
          { key: 'color', label: '颜色', type: 'color', options: [{ value: '米色', label: '米色', colorHex: '#fef3c7' }, { value: '灰色', label: '灰色', colorHex: '#9ca3af' }, { value: '棕色', label: '棕色', colorHex: '#92400e' }, { value: '黑色', label: '黑色', colorHex: '#111827' }] },
          { key: 'size', label: '座位', type: 'tag', options: [{ value: '2座', label: '2座' }, { value: '3座', label: '3座' }, { value: 'L形', label: 'L形' }] },
        ],
      },
      {
        id: 'dining-table',
        name: '餐桌椅',
        specs: [{ value: 'marble-top', label: '大理石面' }, { value: 'wood-top', label: '实木面' }, { value: 'glass-top', label: '玻璃面' }],
        colors: ['原木色', '白色', '黑色', '胡桃色'],
        sizes: ['4人位', '6人位', '8人位'],
        unit: '套',
        filterGroups: [
          { key: 'spec', label: '桌面材质', type: 'tag', options: [{ value: '大理石面', label: '大理石' }, { value: '实木面', label: '实木' }, { value: '玻璃面', label: '玻璃' }] },
          { key: 'color', label: '颜色', type: 'color', options: [{ value: '原木色', label: '原木色', colorHex: '#c47d3c' }, { value: '白色', label: '白色', colorHex: '#f9fafb' }, { value: '黑色', label: '黑色', colorHex: '#111827' }] },
          { key: 'size', label: '座位数', type: 'tag', options: [{ value: '4人位', label: '4人' }, { value: '6人位', label: '6人' }, { value: '8人位', label: '8人' }] },
        ],
      },
      {
        id: 'wardrobe',
        name: '衣柜',
        specs: [{ value: 'sliding-door', label: '推拉门' }, { value: 'swing-door', label: '平开门' }, { value: 'open', label: '开放式' }],
        colors: ['白色', '原木色', '灰色', '深色'],
        sizes: ['1.2m', '1.5m', '1.8m', '2.0m', '2.4m'],
        unit: '套',
        filterGroups: [
          { key: 'spec', label: '门型', type: 'tag', options: [{ value: '推拉门', label: '推拉门' }, { value: '平开门', label: '平开门' }, { value: '开放式', label: '开放式' }] },
          { key: 'color', label: '颜色', type: 'color', options: [{ value: '白色', label: '白色', colorHex: '#f9fafb' }, { value: '原木色', label: '原木', colorHex: '#c47d3c' }, { value: '灰色', label: '灰色', colorHex: '#9ca3af' }] },
          { key: 'size', label: '宽度', type: 'tag', options: [{ value: '1.2m', label: '1.2m' }, { value: '1.5m', label: '1.5m' }, { value: '1.8m', label: '1.8m' }, { value: '2.4m', label: '2.4m' }] },
        ],
      },
    ],
  },
  {
    id: 'flooring',
    name: '地板',
    icon: 'flooring',
    subCategories: [
      {
        id: 'solid-wood',
        name: '实木地板',
        specs: [{ value: 'oak', label: '橡木' }, { value: 'walnut', label: '胡桃木' }, { value: 'teak', label: '柚木' }],
        colors: ['原木色', '浅色', '中色', '深色'],
        sizes: ['910x125x18mm', '910x150x18mm', '1820x150x18mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'spec', label: '木种', type: 'tag', options: [{ value: '橡木', label: '橡木' }, { value: '胡桃木', label: '胡桃木' }, { value: '柚木', label: '柚木' }] },
          { key: 'surface', label: '表面处理', type: 'tag', options: [{ value: '亮光漆', label: '亮光漆' }, { value: '哑光漆', label: '哑光漆' }, { value: '拉丝', label: '拉丝' }, { value: '原木色', label: '自然色' }] },
          { key: 'color', label: '色调', type: 'color', options: [{ value: '原木色', label: '原木', colorHex: '#c47d3c' }, { value: '浅色', label: '浅色', colorHex: '#e5d5b5' }, { value: '中色', label: '中色', colorHex: '#c0a882' }, { value: '深色', label: '深色', colorHex: '#4a3728' }] },
          { key: 'size', label: '规格', type: 'tag', options: [{ value: '910x125x18mm', label: '910×125×18' }, { value: '910x150x18mm', label: '910×150×18' }, { value: '1820x150x18mm', label: '1820×150×18' }] },
        ],
      },
      {
        id: 'engineered-wood',
        name: '复合地板',
        specs: [{ value: 'laminate', label: '强化复合' }, { value: 'multi-layer', label: '多层实木' }, { value: 'spc', label: 'SPC锁扣' }],
        colors: ['原木色', '灰色调', '白色调', '深色调'],
        sizes: ['1215x145x8mm', '1215x145x12mm', '1215x193x12mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'spec', label: '类型', type: 'tag', options: [{ value: '强化复合', label: '强化复合' }, { value: '多层实木', label: '多层实木' }, { value: 'SPC锁扣', label: 'SPC' }] },
          { key: 'thickness', label: '厚度', type: 'tag', options: [{ value: '8mm', label: '8mm' }, { value: '12mm', label: '12mm' }, { value: '15mm', label: '15mm' }] },
          { key: 'color', label: '色调', type: 'color', options: [{ value: '原木色', label: '原木', colorHex: '#c47d3c' }, { value: '灰色调', label: '灰色', colorHex: '#9ca3af' }, { value: '白色调', label: '白色', colorHex: '#f3f4f6' }, { value: '深色调', label: '深色', colorHex: '#374151' }] },
        ],
      },
      {
        id: 'vinyl',
        name: '石塑地板(LVT)',
        specs: [{ value: 'click', label: '锁扣型' }, { value: 'glue-down', label: '胶粘型' }, { value: 'loose-lay', label: '自由铺' }],
        colors: ['木纹色', '石纹色', '素色'],
        sizes: ['1220x180x4mm', '1220x182x5mm', '1220x228x6mm'],
        unit: '平方米',
        filterGroups: [
          { key: 'spec', label: '铺设方式', type: 'tag', options: [{ value: '锁扣型', label: '锁扣' }, { value: '胶粘型', label: '胶粘' }, { value: '自由铺', label: '自由铺' }] },
          { key: 'wearLayer', label: '耐磨层', type: 'tag', options: [{ value: '0.3mm', label: '0.3mm' }, { value: '0.5mm', label: '0.5mm' }, { value: '0.7mm', label: '0.7mm' }] },
          { key: 'color', label: '花色', type: 'color', options: [{ value: '木纹色', label: '木纹', colorHex: '#b5865a' }, { value: '石纹色', label: '石纹', colorHex: '#a0a0a0' }, { value: '素色', label: '素色', colorHex: '#e8e8e8' }] },
          { key: 'size', label: '规格', type: 'tag', options: [{ value: '1220x182x5mm', label: '1220×182×5' }, { value: '1220x228x6mm', label: '1220×228×6' }] },
        ],
      },
    ],
  },
  {
    id: 'lighting',
    name: '灯饰',
    icon: 'lighting',
    subCategories: [
      {
        id: 'chandelier',
        name: '吊灯',
        specs: [{ value: 'modern', label: '现代简约' }, { value: 'crystal', label: '水晶' }, { value: 'industrial', label: '工业风' }, { value: 'nordic', label: '北欧' }],
        colors: ['金色', '银色', '黑色', '白色', '铜色'],
        sizes: ['φ30cm', 'φ40cm', 'φ50cm', 'φ60cm', '定制'],
        unit: '件',
        filterGroups: [
          { key: 'spec', label: '风格', type: 'tag', options: [{ value: '现代简约', label: '现代简约' }, { value: '水晶', label: '水晶' }, { value: '工业风', label: '工业风' }, { value: '北欧', label: '北欧' }] },
          { key: 'lightSource', label: '光源', type: 'tag', options: [{ value: 'LED', label: 'LED' }, { value: 'E27', label: 'E27灯泡' }, { value: 'G9', label: 'G9' }] },
          { key: 'color', label: '外观色', type: 'color', options: [{ value: '金色', label: '金色', colorHex: '#f59e0b' }, { value: '黑色', label: '黑色', colorHex: '#111827' }, { value: '白色', label: '白色', colorHex: '#f9fafb' }, { value: '铜色', label: '铜色', colorHex: '#b45309' }] },
          { key: 'size', label: '直径', type: 'tag', options: [{ value: 'φ30cm', label: 'φ30' }, { value: 'φ40cm', label: 'φ40' }, { value: 'φ50cm', label: 'φ50' }, { value: 'φ60cm', label: 'φ60' }] },
        ],
      },
      {
        id: 'floor-lamp',
        name: '落地灯',
        specs: [{ value: 'arc', label: '弧形' }, { value: 'tripod', label: '三脚架' }, { value: 'torchiere', label: '火炬形' }],
        colors: ['黑色', '白色', '金色', '铜色'],
        sizes: ['H140cm', 'H150cm', 'H160cm', 'H170cm'],
        unit: '件',
        filterGroups: [
          { key: 'spec', label: '造型', type: 'tag', options: [{ value: '弧形', label: '弧形' }, { value: '三脚架', label: '三脚架' }, { value: '火炬形', label: '火炬形' }] },
          { key: 'color', label: '外观色', type: 'color', options: [{ value: '黑色', label: '黑色', colorHex: '#111827' }, { value: '白色', label: '白色', colorHex: '#f9fafb' }, { value: '金色', label: '金色', colorHex: '#f59e0b' }] },
          { key: 'size', label: '高度', type: 'tag', options: [{ value: 'H140cm', label: 'H140' }, { value: 'H150cm', label: 'H150' }, { value: 'H160cm', label: 'H160' }] },
        ],
      },
      {
        id: 'wall-light',
        name: '壁灯',
        specs: [{ value: 'indoor', label: '室内' }, { value: 'outdoor', label: '室外' }, { value: 'bathroom', label: '浴室' }],
        colors: ['黑色', '白色', '金色', '铜色', '银色'],
        sizes: ['小号', '中号', '大号'],
        unit: '件',
        filterGroups: [
          { key: 'spec', label: '使用场景', type: 'tag', options: [{ value: '室内', label: '室内' }, { value: '室外', label: '室外防水' }, { value: '浴室', label: '浴室镜前' }] },
          { key: 'color', label: '外观色', type: 'color', options: [{ value: '金色', label: '金色', colorHex: '#f59e0b' }, { value: '黑色', label: '黑色', colorHex: '#111827' }, { value: '白色', label: '白色', colorHex: '#f9fafb' }, { value: '铜色', label: '铜色', colorHex: '#b45309' }] },
          { key: 'size', label: '尺寸', type: 'tag', options: [{ value: '小号', label: '小号' }, { value: '中号', label: '中号' }, { value: '大号', label: '大号' }] },
        ],
      },
    ],
  },
  {
    id: 'stone',
    name: '石材',
    icon: 'stone',
    subCategories: [
      {
        id: 'marble',
        name: '大理石',
        specs: [{ value: 'polished', label: '亮光面' }, { value: 'honed', label: '亚光面' }, { value: 'brushed', label: '拉丝面' }],
        colors: ['白色', '米色', '灰色', '黑色', '米黄', '绿色'],
        sizes: ['600x600mm', '600x1200mm', '800x800mm', '定制'],
        unit: '平方米',
        filterGroups: [
          { key: 'origin', label: '产地', type: 'tag', options: [{ value: '意大利', label: '意大利' }, { value: '西班牙', label: '西班牙' }, { value: '中国', label: '国产' }, { value: '土耳其', label: '土耳其' }] },
          { key: 'spec', label: '表面处理', type: 'tag', options: [{ value: '亮光面', label: '亮光' }, { value: '亚光面', label: '亚光' }, { value: '拉丝面', label: '拉丝' }] },
          { key: 'color', label: '色系', type: 'color', options: [{ value: '白色', label: '白色', colorHex: '#f9fafb' }, { value: '米黄', label: '米黄', colorHex: '#fbbf24' }, { value: '灰色', label: '灰色', colorHex: '#9ca3af' }, { value: '黑色', label: '黑色', colorHex: '#111827' }] },
          { key: 'size', label: '规格', type: 'tag', options: [{ value: '600x600mm', label: '600×600' }, { value: '600x1200mm', label: '600×1200' }, { value: '800x800mm', label: '800×800' }] },
        ],
      },
      {
        id: 'granite',
        name: '花岗岩',
        specs: [{ value: 'flamed', label: '火烧面' }, { value: 'polished', label: '抛光面' }, { value: 'bush-hammered', label: '荔枝面' }],
        colors: ['灰色', '黑色', '红色', '黄色', '白色'],
        sizes: ['600x300mm', '600x600mm', '定制'],
        unit: '平方米',
        filterGroups: [
          { key: 'spec', label: '表面处理', type: 'tag', options: [{ value: '火烧面', label: '火烧面' }, { value: '抛光面', label: '抛光面' }, { value: '荔枝面', label: '荔枝面' }] },
          { key: 'useScene', label: '用途', type: 'tag', options: [{ value: '室内', label: '室内' }, { value: '室外', label: '室外' }, { value: '台面', label: '台面' }] },
          { key: 'color', label: '颜色', type: 'color', options: [{ value: '灰色', label: '灰色', colorHex: '#9ca3af' }, { value: '黑色', label: '黑色', colorHex: '#111827' }, { value: '红色', label: '红色', colorHex: '#ef4444' }, { value: '白色', label: '白色', colorHex: '#f9fafb' }] },
          { key: 'size', label: '规格', type: 'tag', options: [{ value: '600x300mm', label: '600×300' }, { value: '600x600mm', label: '600×600' }] },
        ],
      },
    ],
  },
];

export const SAMPLE_PRODUCTS: StandardProduct[] = [
  // 陶瓷 - 来自 Excel 导入（401个产品，24个设计风格子品类，21个供应商）
  ...CERAMIC_PRODUCTS,
  // 卫浴 - 马桶
  { id: 'p003',  libraryId: 'LIB-2024-0010', supplierProductId: 'MW-TOI-S1000', categoryId: 'sanitary', subCategoryId: 'toilet', supplierId: 's003', name: '智能马桶一体机',   spec: '智能', color: '白色', size: '305mm坑距', unit: '件', moq: 10, basePrice: 180.0, imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop', length: 720, width: 430, height: 580, weight: 45, description: '智能一体马桶，即热式，臀洗妇洗，暖风烘干，LED显示', attrs: { installType: '落地式', flushType: '旋涡冲' } },
  { id: 'p003b', libraryId: 'LIB-2024-0011', supplierProductId: 'HC-TOI-G200',  categoryId: 'sanitary', subCategoryId: 'toilet', supplierId: 's004', name: '连体落地马桶',     spec: '连体', color: '白色', size: '400mm坑距', unit: '件', moq: 20, basePrice: 95.0,  imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317702519?w=400&h=300&fit=crop', length: 700, width: 380, height: 780, weight: 35, description: '经典连体马桶，冲水静音，虹吸式排污', attrs: { installType: '落地式', flushType: '虹吸' } },
  { id: 'p003e', libraryId: 'LIB-2024-0012', supplierProductId: 'MW-TOI-W300',  categoryId: 'sanitary', subCategoryId: 'toilet', supplierId: 's003', name: '壁挂悬浮马桶',     spec: '连体', color: '白色', size: '400mm坑距', unit: '件', moq: 15, basePrice: 135.0, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop', length: 520, width: 360, height: 400, weight: 28, description: '壁挂式马桶，悬浮设计，节省空间，易清洁', attrs: { installType: '壁挂式', flushType: '直冲' } },
  { id: 'p003f', libraryId: 'LIB-2024-0013', supplierProductId: 'HC-TOI-W500',  categoryId: 'sanitary', subCategoryId: 'toilet', supplierId: 's004', name: '分体壁挂智能马桶', spec: '智能', color: '哑白', size: '305mm坑距', unit: '件', moq: 10, basePrice: 210.0, imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop', length: 720, width: 430, height: 600, weight: 50, description: '分体智能马桶，壁挂安装，智能控制面板', attrs: { installType: '壁挂式', flushType: '旋涡冲' } },
  // 卫浴 - 面盆
  { id: 'p003c', libraryId: 'LIB-2024-0014', supplierProductId: 'MW-BAS-600A',  categoryId: 'sanitary', subCategoryId: 'basin', supplierId: 's003', name: '台上陶瓷面盆',   spec: '台上盆', color: '白色', size: '600x460mm', unit: '件', moq: 10, basePrice: 45.0, imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop', length: 600, width: 460, height: 150, weight: 18, description: '台上艺术陶瓷面盆，简约大方，安装方便', attrs: { installType: '台上盆', material: '陶瓷' } },
  // 卫浴 - 浴缸
  { id: 'p003d', libraryId: 'LIB-2024-0015', supplierProductId: 'MW-BTH-1600',  categoryId: 'sanitary', subCategoryId: 'bathtub', supplierId: 's003', name: '独立式亚克力浴缸', spec: '独立式', color: '白色', size: '1600x800mm', unit: '件', moq: 5, basePrice: 320.0, imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop', length: 1600, width: 800, height: 650, weight: 65, description: '独立式亚克力浴缸，1.6米，双人使用，带排水系统', attrs: { material: '亚克力', jetType: '普通' } },
  // 地板
  { id: 'p004',  libraryId: 'LIB-2024-0016', supplierProductId: 'SX-SPC-5001',  categoryId: 'flooring', subCategoryId: 'vinyl',          supplierId: 's005', name: 'SPC防水石塑地板', spec: '锁扣型',   color: '木纹色', size: '1220x182x5mm',  unit: '平方米', moq: 300, basePrice: 12.8, imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop', length: 1220, width: 182, height: 5, weight: 8, description: 'SPC石塑锁扣地板，防水防潮，适合卫生间厨房', attrs: { wearLayer: '0.5mm' } },
  { id: 'p004b', libraryId: 'LIB-2024-0017', supplierProductId: 'SX-SOL-9102',  categoryId: 'flooring', subCategoryId: 'solid-wood',     supplierId: 's005', name: '橡木实木地板',   spec: '橡木',     color: '原木色', size: '910x150x18mm',   unit: '平方米', moq: 100, basePrice: 58.0, imageUrl: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=400&h=300&fit=crop', length: 910, width: 150, height: 18, weight: 12, description: '进口橡木实木地板，18mm厚，脚感舒适', attrs: { surface: '哑光漆' } },
  { id: 'p004c', libraryId: 'LIB-2024-0018', supplierProductId: 'DZ-ENG-1215',  categoryId: 'flooring', subCategoryId: 'engineered-wood', supplierId: 's006', name: 'SPC强化复合地板', spec: '强化复合', color: '灰色调', size: '1215x145x12mm', unit: '平方米', moq: 200, basePrice: 18.5, imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop', length: 1215, width: 145, height: 12, weight: 10, description: '强化复合地板，灰色调现代简约，耐磨层0.5mm', attrs: { thickness: '12mm' } },
  // 灯饰
  { id: 'p005',  libraryId: 'LIB-2024-0019', supplierProductId: 'LS-CDL-5001',  categoryId: 'lighting', subCategoryId: 'chandelier',  supplierId: 's007', name: '北欧现代吊灯', spec: '北欧', color: '黑色', size: 'φ50cm', unit: '件', moq: 5,  basePrice: 85.0,  imageUrl: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop', length: 500, width: 500, height: 400, weight: 4, description: '北欧简约风金属吊灯，E27灯泡，适合客厅餐厅', attrs: { lightSource: 'E27' } },
  { id: 'p005b', libraryId: 'LIB-2024-0020', supplierProductId: 'OP-CDL-6002',  categoryId: 'lighting', subCategoryId: 'chandelier',  supplierId: 's008', name: '水晶吊灯',   spec: '水晶', color: '金色', size: 'φ60cm', unit: '件', moq: 2,  basePrice: 220.0, imageUrl: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=300&fit=crop', length: 600, width: 600, height: 500, weight: 8, description: '豪华水晶吊灯，G9光源，金色主体，适合别墅会所', attrs: { lightSource: 'G9' } },
  { id: 'p005c', libraryId: 'LIB-2024-0021', supplierProductId: 'LS-WL-3001',   categoryId: 'lighting', subCategoryId: 'wall-light', supplierId: 's007', name: '室内壁灯',   spec: '室内', color: '金色', size: '中号',   unit: '件', moq: 10, basePrice: 38.0,  imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a35b66a37?w=400&h=300&fit=crop', length: 300, width: 150, height: 200, weight: 2, description: '室内床头壁灯，金色金属，暖白光，营造氛围' },
  // 石材
  { id: 'p006',  libraryId: 'LIB-2024-0022', supplierProductId: 'SC-MAR-6001',  categoryId: 'stone', subCategoryId: 'marble',  supplierId: 's010', name: '卡拉拉白大理石', spec: '亮光面', color: '白色', size: '600x1200mm', unit: '平方米', moq: 50,  basePrice: 85.0,  imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', length: 600, width: 1200, height: 18, weight: 45, description: '意大利卡拉拉白大理石，亮光面处理，纹理自然', attrs: { origin: '意大利' } },
  { id: 'p006b', libraryId: 'LIB-2024-0023', supplierProductId: 'YF-MAR-8002',  categoryId: 'stone', subCategoryId: 'marble',  supplierId: 's009', name: '帝皇金大理石',   spec: '亮光面', color: '米黄', size: '800x800mm',  unit: '平方米', moq: 50,  basePrice: 120.0, imageUrl: 'https://images.unsplash.com/photo-1596395147635-c90bcd2c2a4f?w=400&h=300&fit=crop', length: 800, width: 800, height: 18, weight: 50, description: '西班牙帝皇金大理石，金色纹理，高贵典雅', attrs: { origin: '西班牙' } },
  { id: 'p006c', libraryId: 'LIB-2024-0024', supplierProductId: 'YF-GRA-6003',  categoryId: 'stone', subCategoryId: 'granite', supplierId: 's009', name: '芝麻黑花岗岩',   spec: '火烧面', color: '黑色', size: '600x600mm',  unit: '平方米', moq: 100, basePrice: 48.0,  imageUrl: 'https://images.unsplash.com/photo-1604082787521-6d13ab63dadb?w=400&h=300&fit=crop', length: 600, width: 600, height: 20, weight: 55, description: '芝麻黑花岗岩，火烧面处理，防滑耐用，适合室外', attrs: { useScene: '室外' } },
  // H5扫码测试产品
  { id: 'gy001', libraryId: 'LIB-GY-1249', supplierProductId: 'GY-BIGCC1249SU004Y-BNL', categoryId: 'ceramic', subCategoryId: 'modern', supplierId: 's001', name: 'BIG CUBE 系列陶瓷大板 1200×900mm', spec: 'BIG CUBE', color: '米白', size: '1200×900×9mm', unit: '平方米', moq: 50, basePrice: 88.0, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', length: 1200, width: 900, height: 9, weight: 24, description: 'BIG CUBE 系列陶瓷大板，米白色调，现代简约风格，大规格铺贴效果大气', attrs: { surface: '亮光面', antiSlip: 'R10' } },
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];
export const PAYMENT_TERMS = ['T/T 30% deposit, 70% before shipment', 'T/T 100% in advance', 'L/C at sight', 'D/P'];
export const DELIVERY_TERMS = ['FOB', 'CIF', 'EXW', 'CFR', 'DDP'];

// ===== 组合品数据 =====
import type { ComboProduct } from '../types';

export const COMBO_PRODUCTS: ComboProduct[] = [
  {
    id: 'combo-vanity',
    name: '浴室柜组合',
    description: '主柜 + 洗手盆 + 镜柜，完整浴室解决方案',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    components: [
      {
        id: 'c-vanity-cabinet',
        name: '主柜',
        subCategoryId: 'vanity-cabinet',
        required: true,
        baseWidth: 1000,           // 基础宽度 1米
        baseLength: 480,
        baseArea: 0.48,            // 1m × 0.48m = 0.48m²
        priceDimension: 'width',    // 按宽度调价
        basePrice: 280,            // 基础宽1米时单价 $280/m
      },
      {
        id: 'c-vanity-basin',
        name: '洗手盆',
        subCategoryId: 'basin',
        required: true,
        baseWidth: 600,            // 基础宽度 600mm
        baseLength: 460,
        baseArea: 0.276,           // 0.6m × 0.46m
        priceDimension: 'width',    // 按宽度调价
        basePrice: 85,             // 基础宽600mm时 $85
      },
      {
        id: 'c-vanity-mirror',
        name: '镜柜',
        subCategoryId: 'mirror-cabinet',
        required: false,
        baseWidth: 800,            // 基础宽度 800mm
        baseLength: 120,
        baseArea: 0.096,           // 0.8m × 0.12m
        priceDimension: 'width',    // 按宽度调价
        basePrice: 120,            // 基础宽800mm时 $120
      },
    ],
  },
  {
    id: 'combo-balcony',
    name: '阳台柜组合',
    description: '阳台储物柜 + 台面 + 龙头全套',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    components: [
      {
        id: 'c-balcony-cabinet',
        name: '柜体',
        subCategoryId: 'balcony-cabinet',
        required: true,
        baseWidth: 1200,           // 基础宽度 1.2米
        baseLength: 400,
        baseArea: 0.48,
        priceDimension: 'width',
        basePrice: 180,
      },
      {
        id: 'c-balcony-counter',
        name: '台面',
        subCategoryId: 'countertop',
        required: true,
        baseWidth: 1200,
        baseLength: 500,
        baseArea: 0.6,
        priceDimension: 'width',
        basePrice: 65,
      },
      {
        id: 'c-balcony-faucet',
        name: '龙头',
        subCategoryId: 'faucet',
        required: false,
        baseWidth: undefined,
        baseLength: undefined,
        baseArea: undefined,
        priceDimension: 'width',
        basePrice: 45,
      },
    ],
  },
];

// ===== 组合品专属子品类（用于组件选品） =====
export const COMBO_SUB_CATEGORIES: Record<string, SubCategory[]> = {
  'vanity-cabinet': [
    {
      id: 'vanity-cabinet',
      name: '浴室柜主柜',
      specs: [{ value: 'solid-wood', label: '实木' }, { value: 'mdf', label: 'MDF' }, { value: 'plywood', label: '多层板' }],
      colors: ['白色', '灰色', '原木色', '深色'],
      sizes: ['0.8m', '1.0m', '1.2m', '1.5m', '定制'],
      unit: '件',
      filterGroups: [],
    },
  ],
  'mirror-cabinet': [
    {
      id: 'mirror-cabinet',
      name: '镜柜',
      specs: [{ value: 'led', label: 'LED镜' }, { value: 'simple', label: '普通镜' }],
      colors: ['银色', '黑色', '金色', '白色'],
      sizes: ['0.6m', '0.8m', '1.0m', '1.2m', '定制'],
      unit: '件',
      filterGroups: [],
    },
  ],
  'balcony-cabinet': [
    {
      id: 'balcony-cabinet',
      name: '阳台柜柜体',
      specs: [{ value: 'solid-wood', label: '实木' }, { value: 'aluminum', label: '铝合金' }, { value: 'pvc', label: 'PVC' }],
      colors: ['白色', '灰色', '木色'],
      sizes: ['0.8m', '1.0m', '1.2m', '1.5m', '定制'],
      unit: '件',
      filterGroups: [],
    },
  ],
  'countertop': [
    {
      id: 'countertop',
      name: '台面',
      specs: [{ value: 'quartz', label: '石英石' }, { value: 'marble', label: '大理石' }, { value: 'stainless', label: '不锈钢' }],
      colors: ['白色', '灰色', '黑色', '米色'],
      sizes: ['0.6m', '0.8m', '1.0m', '1.2m', '1.5m', '定制'],
      unit: '米',
      filterGroups: [],
    },
  ],
  'faucet': [
    {
      id: 'faucet',
      name: '龙头',
      specs: [{ value: 'single', label: '单冷' }, { value: 'mixer', label: '冷热混水' }],
      colors: ['银色', '黑色', '金色', '铜色'],
      sizes: ['标准'],
      unit: '件',
      filterGroups: [],
    },
  ],
};

// 组合品专属产品数据（用于组件选品）
export const COMBO_PRODUCTS_CATALOG: StandardProduct[] = [
  // 浴室柜主柜
  {
    id: 'vc001', libraryId: 'LIB-CMP-0001', supplierProductId: 'MW-VC-1000', categoryId: 'sanitary', subCategoryId: 'vanity-cabinet',
    name: '北欧简约浴室柜主柜', spec: '实木', color: '白色', size: '1.0m', unit: '件', moq: 5, basePrice: 280,
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    length: 1000, width: 480, height: 500, weight: 28, description: '北欧简约实木浴室柜，白色烤漆，悬挂式，含缓冲门铰',
  },
  {
    id: 'vc002', libraryId: 'LIB-CMP-0002', supplierProductId: 'MW-VC-1200', categoryId: 'sanitary', subCategoryId: 'vanity-cabinet',
    name: '现代简约浴室柜主柜', spec: 'MDF', color: '灰色', size: '1.2m', unit: '件', moq: 5, basePrice: 320,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    length: 1200, width: 500, height: 520, weight: 35, description: '现代简约MDF浴室柜，灰色哑光，悬挂式，多层储物',
  },
  {
    id: 'vc003', libraryId: 'LIB-CMP-0003', supplierProductId: 'MW-VC-1500', categoryId: 'sanitary', subCategoryId: 'vanity-cabinet',
    name: '轻奢实木浴室柜主柜', spec: '实木', color: '原木色', size: '1.5m', unit: '件', moq: 3, basePrice: 450,
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    length: 1500, width: 520, height: 550, weight: 45, description: '高档实木浴室柜，原木色开放漆，双开门+抽屉组合',
  },
  // 镜柜
  {
    id: 'mc001', libraryId: 'LIB-CMP-0011', supplierProductId: 'MW-MC-800-LED', categoryId: 'sanitary', subCategoryId: 'mirror-cabinet',
    name: 'LED智能镜柜', spec: 'LED镜', color: '银色', size: '0.8m', unit: '件', moq: 5, basePrice: 120,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a35b66a37?w=400&h=300&fit=crop',
    length: 800, width: 120, height: 600, weight: 15, description: 'LED背光智能镜柜，银色铝合金边框，除雾功能，三色可调',
  },
  {
    id: 'mc002', libraryId: 'LIB-CMP-0012', supplierProductId: 'MW-MC-1000-LED', categoryId: 'sanitary', subCategoryId: 'mirror-cabinet',
    name: 'LED智能镜柜宽版', spec: 'LED镜', color: '银色', size: '1.0m', unit: '件', moq: 5, basePrice: 145,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a35b66a37?w=400&h=300&fit=crop',
    length: 1000, width: 120, height: 600, weight: 18, description: 'LED背光智能镜柜宽版，银色边框，触屏控制',
  },
  {
    id: 'mc003', libraryId: 'LIB-CMP-0013', supplierProductId: 'MW-MC-800-S', categoryId: 'sanitary', subCategoryId: 'mirror-cabinet',
    name: '普通镜柜', spec: '普通镜', color: '白色', size: '0.8m', unit: '件', moq: 10, basePrice: 68,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a35b66a37?w=400&h=300&fit=crop',
    length: 800, width: 120, height: 600, weight: 12, description: '普通镜柜，白色边框，经济实用款',
  },
  // 阳台柜
  {
    id: 'bc001', libraryId: 'LIB-CMP-0021', supplierProductId: 'SX-BC-1200-ALU', categoryId: 'sanitary', subCategoryId: 'balcony-cabinet',
    name: '铝合金阳台柜', spec: '铝合金', color: '白色', size: '1.2m', unit: '件', moq: 3, basePrice: 180,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    length: 1200, width: 400, height: 800, weight: 30, description: '全铝合金阳台储物柜，防水防晒，白色喷涂，双开门',
  },
  {
    id: 'bc002', libraryId: 'LIB-CMP-0022', supplierProductId: 'SX-BC-1500-ALU', categoryId: 'sanitary', subCategoryId: 'balcony-cabinet',
    name: '铝合金阳台柜宽版', spec: '铝合金', color: '灰色', size: '1.5m', unit: '件', moq: 2, basePrice: 220,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    length: 1500, width: 400, height: 800, weight: 38, description: '宽版铝合金阳台柜，灰色，三开门设计',
  },
  // 台面
  {
    id: 'ct001', libraryId: 'LIB-CMP-0031', supplierProductId: 'MW-CT-1200-QZ', categoryId: 'sanitary', subCategoryId: 'countertop',
    name: '石英石台面', spec: '石英石', color: '白色', size: '1.2m', unit: '米', moq: 1, basePrice: 65,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    length: 1200, width: 500, height: 30, weight: 25, description: '石英石台面，白色，厚度30mm，含安装',
  },
  {
    id: 'ct002', libraryId: 'LIB-CMP-0032', supplierProductId: 'MW-CT-1500-QZ', categoryId: 'sanitary', subCategoryId: 'countertop',
    name: '石英石台面宽版', spec: '石英石', color: '灰色', size: '1.5m', unit: '米', moq: 1, basePrice: 78,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    length: 1500, width: 500, height: 30, weight: 32, description: '石英石台面宽版，灰色，厚度30mm',
  },
  // 龙头
  {
    id: 'fa001', libraryId: 'LIB-CMP-0041', supplierProductId: 'MW-FA-001', categoryId: 'sanitary', subCategoryId: 'faucet',
    name: '冷热混水龙头', spec: '冷热混水', color: '银色', size: '标准', unit: '件', moq: 10, basePrice: 45,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    length: 200, width: 50, height: 180, weight: 2.5, description: '全铜冷热混水龙头，陶瓷阀芯，镀铬处理',
  },
  {
    id: 'fa002', libraryId: 'LIB-CMP-0042', supplierProductId: 'MW-FA-002', categoryId: 'sanitary', subCategoryId: 'faucet',
    name: '黑色哑光龙头', spec: '冷热混水', color: '黑色', size: '标准', unit: '件', moq: 10, basePrice: 68,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    length: 200, width: 50, height: 180, weight: 2.8, description: '黑色哑光冷热混水龙头，现代简约风格，全铜材质',
  },
];

// 组合品专属子品类（组合品类型列表 - 在子品类选择页展示）
export const COMBO_CATEGORY_LIST: Array<{ id: string; name: string; icon: string; comboProductId: string; description: string; imageUrl?: string }> = [
  {
    id: 'combo-vanity',
    name: '浴室柜组合',
    icon: 'combo',
    comboProductId: 'combo-vanity',
    description: '主柜 + 洗手盆 + 镜柜',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
  },
  {
    id: 'combo-balcony',
    name: '阳台柜组合',
    icon: 'combo',
    comboProductId: 'combo-balcony',
    description: '柜体 + 台面 + 龙头',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
  },
];

// ===== 区域预设 =====
export const REGIONS: Region[] = [
  { id: 'r001', name: '客厅',       order: 1, color: '#3b82f6' },
  { id: 'r002', name: '主卧室',     order: 2, color: '#8b5cf6' },
  { id: 'r003', name: '次卧室',     order: 3, color: '#a78bfa' },
  { id: 'r004', name: '主卫浴',     order: 4, color: '#06b6d4' },
  { id: 'r005', name: '客卫浴',     order: 5, color: '#22d3ee' },
  { id: 'r006', name: '厨房',       order: 6, color: '#f59e0b' },
  { id: 'r007', name: '餐厅',       order: 7, color: '#10b981' },
  { id: 'r008', name: '玄关/走廊',  order: 8, color: '#6b7280' },
  { id: 'r009', name: '阳台',       order: 9, color: '#84cc16' },
  { id: 'r010', name: '其他',       order: 10, color: '#9ca3af' },
];
