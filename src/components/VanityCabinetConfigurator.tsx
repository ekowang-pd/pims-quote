import React, { useState, useMemo, useEffect } from 'react';
import {
  VANITY_INSTALL_TYPES,
  VANITY_HANGING_CABINET_TYPES,
  VANITY_FLOOR_CABINET_TYPES,
  VANITY_CABINET_ADDONS,
  VANITY_EXTRA_ADDONS,
  VANITY_PACKING_ITEMS,
  VANITY_BASIN_INSTALL_TYPES,
  VANITY_BASIN_TYPES,
  getCabinetType,
  calcVanityCabinetPrice,
  calcVanityAddonPrice,
  calcVanityExtraPrice,
  calcVanityPackingPrice,
  calcVanityTotalPrice,
  createDefaultConfig,
  createDefaultBasinConfig,
  createDefaultMirrorConfig,
  calcBasinPrice,
  calcMirrorPrice,
  getCurrentBasinMaterial,
  type MirrorConfig,
  type BasinConfig,
} from '../data/vanityConfig';
import luowenFrontDetail from '../assets/vanity/luowen-front-detail.png';
import luowenSideEdge from '../assets/vanity/luowen-side-edge.png';
import luowenThreeEdge from '../assets/vanity/luowen-three-edge.png';
import type { VanityCabinetConfig } from '../types';

type ComponentTab = 'cabinet' | 'basin' | 'mirror' | 'packing';

interface Props {
  onAddToCart?: (items: VanityCartItem[], totalPrice: number) => void;
}

// 浴室柜购物车项
interface VanityCartItem {
  productName: string;      // 固定名称：主柜/台盆/浴室镜
  description: string;      // 具体配置描述
  price: number;           // 单项价格
  quantity: number;        // 数量（固定为1）
}

const VANITY_CABINET_ADDONS_LIST = VANITY_CABINET_ADDONS;
const VANITY_EXTRA_ADDONS_LIST = VANITY_EXTRA_ADDONS;

// 镜子木材选项
const WOOD_MATERIALS = [
  { id: 'mianqi', label: '免漆板' },
  { id: 'xiangjiao', label: '橡胶木' },
  { id: 'baixian', label: '白蜡木/红橡木' },
  { id: 'wujin', label: '乌金木' },
  { id: 'heihut', label: '黑胡桃木' },
  { id: 'baixiang', label: '白橡直纹' },
];

// 普通镜单镜类型选项
const PLAIN_SINGLE_TYPES = [
  { id: 'plain-single', label: '不包边', unit: '面积', priceNote: '650元/m²' },
  { id: 'alu', label: '铝型材包边', unit: '面积', priceNote: '700元/m²' },
  { id: 'wood', label: '木框包边', unit: '长度', priceNote: '按材质' },
  { id: 'stainless', label: '304#不锈钢包边', unit: '面积', priceNote: '950元/m²' },
];

// 普通镜镜柜类型选项
const PLAIN_CABINET_TYPES = [
  { id: 'plain-cabinet', label: '木材普通镜柜', unit: '长度', priceNote: '按材质', hideRCorner: true },
];

// 智能镜单镜类型选项
const SMART_SINGLE_TYPES = [
  { id: 'no-border-backlight', label: '不包边背光', unit: '面积', priceNote: '500元/m²' },
  { id: 'no-border-sand', label: '不包边正面打砂发光', unit: '面积', priceNote: '650元/m²' },
  { id: 'wood-backlight', label: '木材包边背光', unit: '长度', priceNote: '按材质' },
  { id: 'wood-sand', label: '木材包边正面打砂发光', unit: '长度', priceNote: '按材质' },
  { id: 'alu-backlight', label: '铝型材包边背光', unit: '面积', priceNote: '650元/m²' },
  { id: 'alu-sand', label: '铝型材包边正面打砂发光', unit: '面积', priceNote: '700元/m²' },
  { id: 'steel-backlight', label: '304#不锈钢包边背光', unit: '面积', priceNote: '900元/m²' },
  { id: 'steel-sand', label: '304#不锈钢包边正面打砂发光', unit: '面积', priceNote: '950元/m²' },
];

// 智能镜镜柜类型选项
const SMART_CABINET_TYPES = [
  { id: 'smart-cabinet-updown', label: '木材镜柜上下发光', unit: '长度', priceNote: '按材质', hideRCorner: true },
  { id: 'smart-cabinet-sand', label: '木材镜柜正面打砂发光', unit: '长度', priceNote: '按材质', hideRCorner: true },
];

export default function VanityCabinetConfigurator({ onAddToCart }: Props) {
  const [activeTab, setActiveTab] = useState<ComponentTab>('cabinet');

  // ===== 主柜状态 =====
  const [config, setConfig] = useState<VanityCabinetConfig>(createDefaultConfig());
  const [showTips, setShowTips] = useState(false);

  // ===== 台盆状态 =====
  const [basinConfig, setBasinConfig] = useState<BasinConfig>(createDefaultBasinConfig());
  const [basinShowTips, setBasinShowTips] = useState(false);

  // ===== 浴室镜状态 =====
  const [mirrorConfig, setMirrorConfig] = useState<MirrorConfig>(createDefaultMirrorConfig());

  // 当前柜型
  const currentCabinetType = useMemo(() => getCabinetType(config.cabinetType), [config.cabinetType]);

  // 当前台盆材质配置
  const currentBasinMaterial = VANITY_BASIN_TYPES[basinConfig.installType];
  const materialConfig = useMemo(() => getCurrentBasinMaterial(basinConfig), [basinConfig]);

  // ===== 价格计算 =====
  const cabinetPrice = useMemo(() => calcVanityCabinetPrice(config), [config]);
  const addonPrice = useMemo(
    () => calcVanityAddonPrice(config),
    [config]
  );
  const extraPrice = useMemo(
    () => calcVanityExtraPrice(config),
    [config]
  );
  const basinPrice = useMemo(() => calcBasinPrice(basinConfig), [basinConfig]);
  const mirrorPrice = useMemo(() => calcMirrorPrice(mirrorConfig), [mirrorConfig]);
  
  // 镜子配件小计（不含镜面主配置）
  const accessoryPrice = useMemo(() => {
    // 没有选择镜子类型时，配件价格为0
    if (!mirrorConfig.mirrorType || !mirrorConfig.mirrorStyle) return 0;
    const getSideCabinetPrice = (mat: string) => ({ mianqi: 260, xiangjiao: 360, baixian: 430, wujin: 460, heihut: 480, baixiang: 539 }[mat] || 260);
    const getOpenShelfPrice = (mat: string) => ({ mianqi: 200, xiangjiao: 300, baixian: 360, wujin: 380, heihut: 399, baixiang: 450 }[mat] || 200);
    
    let total = 0;
    if (mirrorConfig.mirrorType === 'plain') {
      // 侧柜和开放格共用镜子木材材质
      const mat = mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.plainSingleWoodMaterial : mirrorConfig.plainCabinetMaterial;
      total = mirrorConfig.plainSideCabinet * getSideCabinetPrice(mat)
            + mirrorConfig.plainOpenShelf * getOpenShelfPrice(mat)
            + mirrorConfig.plainAmericanStyle * 300;
    } else {
      const mat = mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.smartSingleWoodMaterial : mirrorConfig.smartCabinetMaterial;
      total = mirrorConfig.smartSideCabinet * getSideCabinetPrice(mat)
            + mirrorConfig.smartOpenShelf * getOpenShelfPrice(mat)
            + mirrorConfig.smartAmericanStyle * 300
            + mirrorConfig.smartGlassShelf * 30
            + mirrorConfig.smartShelfLight * 100
            + mirrorConfig.smartGlassDoor * 200
            + mirrorConfig.smartAluGlassDoor * 200;
    }
    return Math.max(0, total);
  }, [mirrorConfig]);
  
  const totalPrice = useMemo(() => calcVanityTotalPrice(config) + basinPrice + mirrorPrice + accessoryPrice, [config, basinConfig, mirrorConfig]);

  // ===== 配置更新 =====
  const updateConfig = (partial: Partial<VanityCabinetConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  const setCabinetType = (typeId: string) => {
    const cabinetType = getCabinetType(typeId);
    const defaultMaterial = cabinetType?.materials[0]?.id || '';
    setConfig(prev => ({
      ...prev,
      cabinetType: typeId,
      material: defaultMaterial,
    }));
  };

  // 台盆配置项数量
  const setBasinItem = (key: string, value: number) => {
    setBasinConfig(prev => ({
      ...prev,
      basinItems: { ...prev.basinItems, [key]: value },
    }));
  };

  // 设置柜体增配的选项
  const setAddonOption = (addonId: string, optionId: string) => {
    setConfig(prev => {
      const existing = prev.cabinetAddons?.[addonId] as { optionId: string; qty: number } | undefined;
      return {
        ...prev,
        cabinetAddons: {
          ...prev.cabinetAddons,
          [addonId]: { optionId, qty: existing?.qty || 1 },
        },
      };
    });
  };

  // 设置柜体增配的数量
  const setAddonQty = (addonId: string, qty: number) => {
    setConfig(prev => {
      const existing = prev.cabinetAddons?.[addonId] as { optionId: string; qty: number } | undefined;
      // 没有已选数据时，自动初始化默认选项
      if (!existing) {
        // 从 VANITY_CABINET_ADDONS 获取正确的默认选项ID
        const addonDef = VANITY_CABINET_ADDONS.find(a => a.id === addonId);
        const defaultOptionId = addonDef?.options[0]?.id || 'default';
        return {
          ...prev,
          cabinetAddons: {
            ...prev.cabinetAddons,
            [addonId]: { optionId: defaultOptionId, qty: Math.max(0, qty) },
          },
        };
      }
      return {
        ...prev,
        cabinetAddons: {
          ...prev.cabinetAddons,
          [addonId]: { ...existing, qty: Math.max(0, qty) },
        },
      };
    });
  };

  // 设置增配选项的选项
  const setExtraAddonOption = (addonId: string, optionId: string) => {
    setConfig(prev => {
      const existing = prev.extraAddons?.[addonId] as { optionId: string; qty: number } | undefined;
      return {
        ...prev,
        extraAddons: {
          ...prev.extraAddons,
          [addonId]: { optionId, qty: existing?.qty || 0 },
        },
      };
    });
  };

  // 增配选项数量
  const setExtraAddonQty = (addonId: string, qty: number) => {
    setConfig(prev => {
      const current = prev.extraAddons || {};
      const next = { ...current };
      const existing = next[addonId] as { optionId: string; qty: number } | undefined;
      const addonDef = VANITY_EXTRA_ADDONS_LIST.find(a => a.id === addonId);
      if (qty <= 0) {
        delete next[addonId];
      } else {
        next[addonId] = {
          optionId: existing?.optionId || addonDef?.options[0]?.id || 'default',
          qty,
        };
      }
      return { ...prev, extraAddons: next };
    });
  };

  // 包装：切换选中/取消
  const togglePacking = (packingId: string) => {
    setConfig(prev => {
      const current = prev.packingItems || {};
      const next = { ...current };
      if (next[packingId]) {
        delete next[packingId];
      } else {
        const item = VANITY_PACKING_ITEMS.find(i => i.id === packingId);
        next[packingId] = { optionId: item?.options[0]?.id || 'default' };
      }
      return { ...prev, packingItems: next };
    });
  };

  // 包装：设置选项
  const setPackingOption = (packingId: string, optionId: string) => {
    setConfig(prev => ({
      ...prev,
      packingItems: {
        ...prev.packingItems,
        [packingId]: { optionId },
      },
    }));
  };

  // 包装：自动根据主柜、台盆、镜子配置选择包装项
  useEffect(() => {
    const currentPacking = config.packingItems || {};
    const newPacking = { ...currentPacking };
    let hasChange = false;

    // 主柜包装：根据安装类型选择
    if (cabinetPrice > 0 && !currentPacking['packing-cabinet']) {
      const optionId = config.installType === 'hanging' ? 'hanging' : 'floor';
      newPacking['packing-cabinet'] = { optionId };
      hasChange = true;
    }

    // 镜子包装：根据镜子样式选择
    if (mirrorPrice > 0 && mirrorConfig.mirrorStyle && !currentPacking['packing-mirror']) {
      const optionId = mirrorConfig.mirrorStyle === 'single' ? 'single' : 'cabinet';
      newPacking['packing-mirror'] = { optionId };
      hasChange = true;
    }

    // 台面包装：如果配置了台盆则默认选择
    if (basinPrice > 0 && !currentPacking['packing-counter']) {
      newPacking['packing-counter'] = { optionId: 'normal' };
      hasChange = true;
    }

    if (hasChange) {
      setConfig(prev => ({ ...prev, packingItems: newPacking }));
    }
  }, [cabinetPrice, basinPrice, mirrorPrice, config.installType, mirrorConfig.mirrorStyle]);

  // 更新 packingPrice 计算，传入 mirrorConfig
  const packingPrice = useMemo(() => calcVanityPackingPrice(config, mirrorConfig), [config, mirrorConfig]);

  const handleAddToCart = () => {
    const cartItems: VanityCartItem[] = [];

    // 主柜 SKU
    if (cabinetPrice > 0) {
      const installTypeLabel = config.installType === 'hanging' ? '吊柜' : '落地柜';
      const cabinetTypeLabel = currentCabinetType?.label || '';
      const lengthLabel = config.cabinetLength ? `${config.cabinetLength}mm` : '';
      const woodLabel = config.cabinetWoodMaterial 
        ? VANITY_WOOD_MATERIALS.find(m => m.id === config.cabinetWoodMaterial)?.label || ''
        : '';
      
      // 增配描述
      const addonLabels: string[] = [];
      if ((config.cabinetAddons?.length || 0) > 0) {
        config.cabinetAddons?.forEach(a => {
          const addon = VANITY_CABINET_ADDONS_LIST.find(x => x.id === a);
          if (addon) addonLabels.push(addon.label);
        });
      }
      
      let desc = [installTypeLabel, cabinetTypeLabel, woodLabel, lengthLabel].filter(Boolean).join(' · ');
      if (addonLabels.length > 0) {
        desc += ` | 增配：${addonLabels.join('、')}`;
      }
      
      cartItems.push({
        productName: '主柜',
        description: desc,
        price: cabinetPrice,
        quantity: 1,
      });
    }

    // 台盆 SKU
    if (basinPrice > 0) {
      const basinTypeLabel = basinConfig.installType === 'above' ? '台上盆' : '台下盆';
      const materialLabel = materialConfig?.label || '';
      const lengthLabel = basinConfig.countertopLength ? `${basinConfig.countertopLength}mm` : '';
      
      // 台面描述
      const selectedCountertop = materialConfig?.countertopOptions?.find(o => o.id === basinConfig.countertopId);
      const countertopLabel = selectedCountertop?.label || '';
      
      // 台盆选项描述
      const basinLabels: string[] = [];
      Object.entries(basinConfig.basinItems).forEach(([key, qty]) => {
        if (qty > 0) {
          const opt = materialConfig?.basinOptions?.find(o => o.id === key);
          if (opt) basinLabels.push(`${opt.label}×${qty}`);
        }
      });
      
      let desc = [basinTypeLabel, materialLabel, countertopLabel, lengthLabel].filter(Boolean).join(' · ');
      if (basinLabels.length > 0) {
        desc += ` | 盆：${basinLabels.join('、')}`;
      }
      
      cartItems.push({
        productName: '台盆',
        description: desc,
        price: basinPrice,
        quantity: 1,
      });
    }

    // 浴室镜 SKU
    if (mirrorPrice > 0) {
      const mirrorTypeLabel = mirrorConfig.mirrorType === 'plain' ? '普通镜' : '智能镜';
      const mirrorStyleLabel = mirrorConfig.mirrorStyle === 'single' ? '单镜' : '镜柜';
      
      // 获取镜面类型名称
      let mirrorStyleDetail = '';
      if (mirrorConfig.mirrorType === 'plain') {
        if (mirrorConfig.mirrorStyle === 'single') {
          const type = PLAIN_SINGLE_TYPES.find(t => t.id === mirrorConfig.plainSingleType);
          mirrorStyleDetail = type?.label || '';
        } else {
          const type = VANITY_PLAIN_CABINET_TYPES.find(t => t.id === mirrorConfig.plainCabinetType);
          mirrorStyleDetail = type?.label || '';
        }
      } else {
        if (mirrorConfig.mirrorStyle === 'single') {
          const type = SMART_SINGLE_TYPES.find(t => t.id === mirrorConfig.smartSingleType);
          mirrorStyleDetail = type?.label || '';
        } else {
          const type = SMART_CABINET_TYPES.find(t => t.id === mirrorConfig.smartCabinetType);
          mirrorStyleDetail = type?.label || '';
        }
      }
      
      const lengthLabel = getCurrentLength() ? `${getCurrentLength()}mm` : '';
      
      // 配件描述
      const accessoryLabels: string[] = [];
      if (mirrorConfig.mirrorType === 'smart' && mirrorConfig.smartSideCabinet > 0) {
        accessoryLabels.push(`侧柜×${mirrorConfig.smartSideCabinet}`);
      }
      if (mirrorConfig.americanStyle > 0) {
        accessoryLabels.push(`美式造型×${mirrorConfig.americanStyle}`);
      }
      if (mirrorConfig.smartGlassShelf > 0) {
        accessoryLabels.push(`玻璃层板×${mirrorConfig.smartGlassShelf}`);
      }
      
      let desc = [mirrorTypeLabel, mirrorStyleLabel, mirrorStyleDetail, lengthLabel].filter(Boolean).join(' · ');
      if (accessoryLabels.length > 0) {
        desc += ` | 增配：${accessoryLabels.join('、')}`;
      }
      
      cartItems.push({
        productName: '浴室镜',
        description: desc,
        price: mirrorPrice,
        quantity: 1,
      });
    }

    onAddToCart?.(cartItems, totalPrice);
  };

  // ===== 渲染：主柜配置 =====
  const renderCabinet = () => (
    <div className="space-y-4">
      {/* ===== 区块1: 主柜配置（安装类型+柜型+材质+长度） ===== */}
      <section className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span>🗄️</span> 主柜配置
        </h3>

        {/* 安装类型 */}
        <div className="mb-4">
          <div className="flex gap-2">
            {VANITY_INSTALL_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => {
                  updateConfig({ installType: type.id as 'hanging' | 'floor' });
                  const types = type.id === 'hanging' ? VANITY_HANGING_CABINET_TYPES : VANITY_FLOOR_CABINET_TYPES;
                  if (types.length > 0) setCabinetType(types[0].id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer text-sm"
                style={{
                  borderColor: config.installType === type.id ? '#3b82f6' : '#e5e7eb',
                  background: config.installType === type.id ? '#eff6ff' : 'white',
                  color: config.installType === type.id ? '#2563eb' : '#4b5563',
                }}
              >
                <span>{type.id === 'hanging' ? '📌' : '📦'}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 柜型选择 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {(config.installType === 'hanging'
              ? VANITY_HANGING_CABINET_TYPES
              : VANITY_FLOOR_CABINET_TYPES
            ).map(type => (
              <button
                key={type.id}
                onClick={() => setCabinetType(type.id)}
                className={`flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                  config.cabinetType === type.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ width: '100px' }}
              >
                <div className="w-[100px] h-[100px] bg-gray-50 overflow-hidden">
                  {type.image ? (
                    <img src={type.image} alt={type.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{type.icon}</div>
                  )}
                </div>
                <div className={`w-full py-1.5 text-xs font-medium truncate px-1 text-center ${
                  config.cabinetType === type.id ? 'text-blue-700 bg-blue-50' : 'text-gray-600 bg-white'
                }`}>
                  {type.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 材质 */}
        {currentCabinetType && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {currentCabinetType.materials.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => setConfig(prev => ({ ...prev, material: mat.id }))}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all cursor-pointer ${
                    config.material === mat.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {mat.label}
                  <span className="ml-1 text-xs text-gray-400">¥{mat.priceUnit}/m</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 长度 */}
        {currentCabinetType && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">长度:</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={config.cabinetLength || ''}
              onChange={e => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) setConfig(prev => ({ ...prev, cabinetLength: val }));
                else setConfig(prev => ({ ...prev, cabinetLength: 0 }));
              }}
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
              className="flex-1 max-w-32 px-4 py-2 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入长度"
            />
            <span className="text-sm text-gray-400">mm</span>
          </div>
        )}
        {/* 主柜小计 */}
        <div className="flex justify-end pt-3 border-t mt-3 items-center gap-2">
          <button
            onClick={() => setShowTips(true)}
            className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
            title="计价规则说明"
          >?</button>
          <span className="text-sm text-gray-500">小计：</span>
          <span className="ml-2 text-lg font-bold text-orange-500">¥{cabinetPrice.toFixed(0)}</span>
        </div>
      </section>

      {/* ===== 区块2: 柜体增配 ===== */}
      <section className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>⚙️</span> 柜体增配
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {VANITY_CABINET_ADDONS_LIST.map(addon => {
            const selected = config.cabinetAddons?.[addon.id] as { optionId: string; qty: number } | undefined;
            const currentOption = addon.options.find(o => o.id === selected?.optionId) || addon.options[0];
            const qty = selected?.qty || 0;
            const hasActive = qty > 0;
            const isSingleOption = addon.options.length === 1;

            return (
              <div
                key={addon.id}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${hasActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                {/* 左侧：图标 + 名称/下拉 */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {addon.image && !isSingleOption ? (
                    <img
                      src={currentOption?.image || addon.image}
                      alt={currentOption?.label || addon.label}
                      className="w-6 h-6 object-contain rounded bg-gray-50 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded flex-shrink-0 text-xs">{addon.icon || '🔧'}</div>
                  )}
                  {isSingleOption ? (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 truncate leading-tight">{addon.label}</div>
                      <div className="text-xs text-gray-400">¥{currentOption?.price}/{addon.unit}</div>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 truncate leading-tight">{addon.label}</div>
                      <select
                        value={selected?.optionId || addon.options[0].id}
                        onChange={e => setAddonOption(addon.id, e.target.value)}
                        className="text-xs px-1 py-0.5 rounded border border-gray-200 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400 w-auto max-w-full"
                      >
                        {addon.options.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label} ¥{opt.price}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* 右侧：数量选择 */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setAddonQty(addon.id, qty - 1)}
                    disabled={qty <= 0}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                  >−</button>
                  <span className="w-7 text-center text-sm font-medium text-blue-600">{qty > 0 ? qty : '-'}</span>
                  <button
                    onClick={() => setAddonQty(addon.id, qty + 1)}
                    disabled={addon.id === 'luowen' && qty >= 1}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  >+</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 小计 */}
        <div className="flex justify-end pt-3 border-t mt-3">
          <span className="text-sm text-gray-500">小计：</span>
          <span className="ml-2 text-base font-bold text-orange-500">¥{addonPrice.toFixed(0)}</span>
        </div>
      </section>

      {/* ===== 区块3: 增配选项 ===== */}
      <section className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>✨</span> 增配选项
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {VANITY_EXTRA_ADDONS_LIST.map(addon => {
            const selected = config.extraAddons?.[addon.id] as { optionId: string; qty: number } | undefined;
            const currentOption = addon.options.find(o => o.id === selected?.optionId) || addon.options[0];
            const qty = selected?.qty || 0;
            const hasActive = qty > 0;
            const isLengthBased = !!currentOption?.priceFormula;
            const isSingleOption = addon.options.length === 1;

            return (
              <div
                key={addon.id}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${hasActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                {/* 左侧：图标 + 名称/下拉 */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded flex-shrink-0 text-xs">{addon.icon || '🔧'}</div>
                  {isSingleOption ? (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 truncate leading-tight">{addon.label}</div>
                      <div className="text-xs text-gray-400">
                        {isLengthBased ? '¥~/m' : `¥${currentOption?.price}/${addon.unit}`}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 truncate leading-tight">{addon.label}</div>
                      <select
                        value={selected?.optionId || addon.options[0].id}
                        onChange={e => setExtraAddonOption(addon.id, e.target.value)}
                        className="text-xs px-1 py-0.5 rounded border border-gray-200 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400 w-auto max-w-full"
                      >
                        {addon.options.map(opt => {
                          // 根据计价方式显示价格
                          let priceLabel = '';
                          if (opt.priceFormula) {
                            // 按长度计价：显示单位价格（如 ¥300/m）
                            const unitPrice = addon.id === 'shelf' ? (opt.id === 'mianqi' ? 300 : 400) : 0;
                            priceLabel = `¥${unitPrice}/m`;
                          } else {
                            priceLabel = `¥${opt.price}/${addon.unit}`;
                          }
                          return <option key={opt.id} value={opt.id}>{opt.label} {priceLabel}</option>;
                        })}
                      </select>
                    </div>
                  )}
                </div>

                {/* 右侧：数量选择 */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setExtraAddonQty(addon.id, qty - 1)}
                    className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 cursor-pointer text-sm font-bold"
                  >−</button>
                  <span className="w-7 text-center text-sm font-medium text-blue-600">{qty || '-'}</span>
                  <button
                    onClick={() => setExtraAddonQty(addon.id, qty + 1)}
                    className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-sm font-bold"
                  >+</button>
                </div>
              </div>
            );
          })}
        </div>
        {/* 小计 */}
        <div className="flex justify-end pt-3 border-t mt-3">
          <span className="text-sm text-gray-500">小计：</span>
          <span className="ml-2 text-base font-bold text-orange-500">¥{extraPrice.toFixed(0)}</span>
        </div>
      </section>

    </div>
  );

  // ===== 渲染：包装配置 =====
  const renderPacking = () => {
    // 获取主柜配置信息
    const cabinetInstallType = config.installType || 'floor';
    const cabinetLength = config.cabinetLength || 800;
    const hasCabinet = cabinetPrice > 0;
    const calcCabinetLength = Math.max(Math.ceil(cabinetLength / 100) * 100, 800);

    // 获取浴室镜配置信息
    const mirrorStyle = mirrorConfig.mirrorStyle || 'single';
    const mirrorLength = mirrorConfig.mirrorStyle === 'cabinet' 
      ? (mirrorConfig.plainCabinetLength || mirrorConfig.smartCabinetLength || 800)
      : (mirrorConfig.plainSingleLength || mirrorConfig.smartSingleLength || 800);
    const hasMirror = mirrorPrice > 0;
    const calcMirrorLength = Math.max(Math.ceil(mirrorLength / 100) * 100, 800);

    // 获取台盆配置信息
    const hasBasin = basinPrice > 0;
    const basinLength = basinConfig.countertopLength || 800;
    const calcCounterLength = config.packingLengths?.['packing-counter'] 
      ? Math.max(Math.ceil(config.packingLengths['packing-counter'] / 100) * 100, 800)
      : Math.max(Math.ceil(basinLength / 100) * 100, 800);

    // 计算每项包装价格
    const cabinetPackingPrice = hasCabinet
      ? (cabinetInstallType === 'hanging' 
          ? calcCabinetLength / 1000 * 80  // 吊柜：80元/米
          : calcCabinetLength / 1000 * 100) // 主柜：100元/米
      : 0;
    
    const mirrorPackingPrice = hasMirror
      ? (mirrorStyle === 'single'
          ? calcMirrorLength / 1000 * 70   // 单镜：70元/米
          : calcMirrorLength / 1000 * 80)  // 镜柜：80元/米
      : 0;
    
    const counterPackingOptionId = config.packingItems?.['packing-counter']?.optionId || 'normal';
    const counterPackingPrice = hasBasin && config.packingItems?.['packing-counter']
      ? (counterPackingOptionId === 'crate'
          ? calcCounterLength / 1000 * 180  // 夹板木箱：180元/米
          : calcCounterLength / 1000 * 90)  // 夹板打包：90元/米
      : 0;

    // 主柜包装配置
    const cabinetPackingOptionId = cabinetInstallType === 'hanging' ? 'hanging' : 'floor';
    const cabinetPackingItem = VANITY_PACKING_ITEMS.find(i => i.id === 'packing-cabinet');
    const cabinetPackingOption = cabinetPackingItem?.options.find(o => o.id === cabinetPackingOptionId);

    // 浴室镜包装配置
    const mirrorPackingOptionId = mirrorStyle === 'single' ? 'single' : 'cabinet';
    const mirrorPackingItem = VANITY_PACKING_ITEMS.find(i => i.id === 'packing-mirror');
    const mirrorPackingOption = mirrorPackingItem?.options.find(o => o.id === mirrorPackingOptionId);

    // 台面包装配置
    const counterPackingItem = VANITY_PACKING_ITEMS.find(i => i.id === 'packing-counter');
    const counterPackingOption = counterPackingItem?.options[0];

    return (
      <div className="space-y-4">
        <section className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📦</span> 包装配置（根据主柜/台盆/浴室镜自动带入，不可更改）
          </h3>

          <div className="space-y-3">
            {/* 主柜包装 */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${hasCabinet ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">🗄️</span>
                <div>
                  <div className="text-sm font-medium text-gray-700">主柜夹板打包</div>
                  <div className="text-xs text-gray-500">
                    {hasCabinet ? (
                      <span>{cabinetPackingOption?.label || cabinetInstallType} · {calcCabinetLength}mm</span>
                    ) : '主柜未配置'}
                  </div>
                </div>
              </div>
              {hasCabinet ? (
                <>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">✓ 已含</span>
                  <span className="text-sm font-semibold text-orange-500">¥{cabinetPackingPrice.toFixed(0)}</span>
                </>
              ) : (
                <span className="px-3 py-1 bg-gray-200 text-gray-400 text-xs rounded-full">—</span>
              )}
            </div>

            {/* 浴室镜包装 */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${hasMirror ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">🪞</span>
                <div>
                  <div className="text-sm font-medium text-gray-700">浴室镜夹板打包</div>
                  <div className="text-xs text-gray-500">
                    {hasMirror ? (
                      <span>{mirrorPackingOption?.label || mirrorStyle} · {calcMirrorLength}mm</span>
                    ) : '浴室镜未配置'}
                  </div>
                </div>
              </div>
              {hasMirror ? (
                <>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">✓ 已含</span>
                  <span className="text-sm font-semibold text-orange-500">¥{mirrorPackingPrice.toFixed(0)}</span>
                </>
              ) : (
                <span className="px-3 py-1 bg-gray-200 text-gray-400 text-xs rounded-full">—</span>
              )}
            </div>

            {/* 台面包装 - 手动选择选项+输入长度 */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${hasBasin ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">🪨</span>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">台面夹板打包</div>
                  </div>
                  {hasBasin && (
                    <>
                      <select
                        value={config.packingItems?.['packing-counter']?.optionId || 'normal'}
                        onChange={e => setPackingOption('packing-counter', e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-green-400"
                      >
                        <option value="normal">夹板打包</option>
                        <option value="crate">夹板木箱打包</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={config.packingLengths?.['packing-counter'] || ''}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            setConfig(prev => ({
                              ...prev,
                              packingLengths: { ...(prev.packingLengths || {}), ['packing-counter']: val }
                            }));
                          }}
                          className="w-16 text-xs px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-green-400"
                          placeholder="长度"
                        />
                        <span className="text-xs text-gray-400">mm</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {hasBasin ? (
                <>
                  <button
                    onClick={() => togglePacking('packing-counter')}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                      config.packingItems?.['packing-counter']
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {config.packingItems?.['packing-counter'] ? '✓ 已选' : '+ 选用'}
                  </button>
                  {config.packingItems?.['packing-counter'] && (
                    <span className="text-sm font-semibold text-orange-500">¥{counterPackingPrice.toFixed(0)}</span>
                  )}
                </>
              ) : (
                <span className="px-3 py-1 bg-gray-200 text-gray-400 text-xs rounded-full">—</span>
              )}
            </div>
          </div>

          {/* 小计 */}
          <div className="flex justify-end pt-3 border-t mt-3">
            <span className="text-sm text-gray-500">小计：</span>
            <span className="ml-2 text-base font-bold text-orange-500">¥{packingPrice.toFixed(0)}</span>
          </div>
        </section>
      </div>
    );
  };

  // ===== 渲染：台盆配置（与主柜一致的布局）=====
  const renderBasin = () => {
    const currentBasinType = VANITY_BASIN_TYPES[basinConfig.installType];
    const materialConfig = getCurrentBasinMaterial(basinConfig);


    // 获取当前材质列表
    const materials = currentBasinType?.materials || [];

    // 设置台面单选
    const setCountertopId = (id: string) => {
      setBasinConfig(prev => ({
        ...prev,
        countertopId: prev.countertopId === id ? '' : id,
        // 切换台面时保留 countertopLength，不清空
      }));
    };

    // 设置台面长度
    const setCountertopLength = (len: number) => {
      if (isNaN(len)) return;
      setBasinConfig(prev => ({ ...prev, countertopLength: Math.max(0, len) }));
    };

    // 设置配置项模块选项值（1=勾选，0=取消）
    const setExtraItem = (optionId: string, checked: number) => {
      setBasinConfig(prev => ({
        ...prev,
        extraItems: { ...prev.extraItems, [optionId]: checked },
      }));
    };

    // 设置配置项独立长度
    const setExtraLength = (optionId: string, len: number) => {
      setBasinConfig(prev => ({
        ...prev,
        extraLengths: { ...(prev.extraLengths || {}), [optionId]: Math.max(0, len) },
      }));
    };

    // 渲染台盆材质卡片（简洁卡片样式，和主柜一致）
    const renderMaterialCard = (material: any) => {
      const isSelected = basinConfig.materialId === material.id;
      return (
        <button
          key={material.id}
          onClick={() => setBasinConfig(prev => ({
            ...prev,
            materialId: isSelected ? '' : material.id,
            basinItems: {},
            countertopId: '',
            extraItems: {},
            extraLengths: {},
          }))}
          className={`flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
            isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
          style={{ width: '100px' }}
        >
          <div className="w-[100px] h-[100px] bg-gray-50 overflow-hidden">
            {material.image ? (
              <img src={material.image} alt={material.label} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">🪨</div>
            )}
          </div>
          <div className={`w-full py-1.5 text-xs font-medium truncate px-1 text-center ${
            isSelected ? 'text-blue-700 bg-blue-50' : 'text-gray-600 bg-white'
          }`}>
            {material.label}
          </div>
        </button>
      );
    };

    // 渲染台面选项（单选，点击选中后展开台面长度输入框）
    const renderCountertopOption = (opt: any) => {
      const isSelected = basinConfig.countertopId === opt.id;
      const len = basinConfig.countertopLength || '';
      const stdLen = 800;
      const stdPrice = opt.priceFormula ? opt.priceFormula(stdLen) : 0;

      return (
        <div
          key={opt.id}
          className={`rounded-lg border transition-all overflow-hidden ${
            isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'
          }`}
        >
          {/* 选项头部：图标 + 名称 + 价格 */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
            onClick={() => setCountertopId(opt.id)}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
            }`}>
              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 leading-tight">{opt.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                ¥{stdPrice.toFixed(0)}（标{stdLen}mm）
              </div>
            </div>
          </div>
          {/* 选中后展开台面长度输入框 */}
          {isSelected && (
            <div className="px-3 pb-2.5 flex items-center gap-2 border-t border-blue-100 pt-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">台面长度</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={len}
                onChange={e => setCountertopLength(parseInt(e.target.value) || 0)}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                className="w-24 text-xs px-2 py-1 rounded border border-blue-300 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-gray-400">mm</span>
            </div>
          )}
        </div>
      );
    };

    // 渲染配置项选项（多选，勾选后卡片内展开独立长度输入框）
    const renderExtraOption = (opt: any) => {
      const checked = (basinConfig.extraItems[opt.id] || 0) > 0;
      const rawExtraLen = (basinConfig.extraLengths || {})[opt.id] || basinConfig.countertopLength || '';
      const extraLen = rawExtraLen === '' ? '' : (parseInt(String(rawExtraLen)) || '');
      const stdLen = 800;
      const stdPrice = opt.priceFormula ? opt.priceFormula(stdLen) : 0;
      const actualPrice = opt.priceFormula ? opt.priceFormula(extraLen) : 0;

      return (
        <div
          key={opt.id}
          className={`rounded-lg border transition-all overflow-hidden ${
            checked ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
          }`}
        >
          {/* 选项头部 */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
            onClick={() => setExtraItem(opt.id, checked ? 0 : 1)}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
              checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white hover:border-blue-300'
            }`}>
              {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 leading-tight">{opt.label}</div>
              <div className="text-xs mt-0.5">
                {checked && extraLen !== stdLen ? (
                  <span className="text-blue-600 font-medium">¥{actualPrice.toFixed(0)}（标¥{stdPrice.toFixed(0)}）</span>
                ) : (
                  opt.id === 'over-2m' ? (
                    <span className="text-gray-500">¥{stdPrice.toFixed(0)}（超2000mm才收费）</span>
                  ) : (
                    <span className="text-gray-500">¥{stdPrice.toFixed(0)}（标{stdLen}mm）</span>
                  )
                )}
              </div>
            </div>
          </div>
          {/* 勾选后展开独立长度输入框 */}
          {checked && (
            <div className="px-3 pb-2.5 flex items-center gap-2 border-t border-blue-100 pt-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">长度</span>
              <input
                type="text"
                inputMode="numeric"
                value={extraLen}
                onChange={e => setExtraLength(opt.id, parseInt(e.target.value) || 0)}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                className="w-24 text-xs px-2 py-1 rounded border border-blue-300 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-gray-400">mm</span>
            </div>
          )}
        </div>
      );
    };

    // 渲染台上盆洗手盆配置选项卡（带下拉+数量选择，保留原有逻辑）
    const renderAboveConfigOption = (opt: any, optionType: 'countertop' | 'basin' | 'extra') => {
      // 此函数保留以兼容台上盆-basin调用，但台面/配置项已改用专用函数
      const items = optionType === 'basin' ? basinConfig.basinItems : basinConfig.basinItems;
      const setFn = optionType === 'basin' ? setBasinItem : setBasinItem;

      const qty = items[opt.id] || 0;
      const hasActive = qty > 0;
      const length = Math.max(basinConfig.countertopLength || 800, 800);
      let price = 0;
      if (opt.priceType === 'unit' && opt.unitPrice) {
        price = opt.unitPrice;
      } else if (opt.priceType === 'length' && opt.priceFormula) {
        price = opt.priceFormula(length);
      }

      return (
        <div
          key={opt.id}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${hasActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded flex-shrink-0 text-xs">🪨</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 truncate leading-tight">{opt.label}</div>
              <div className="text-xs text-gray-400">¥{price.toFixed(0)}/{opt.unit}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setFn(opt.id, qty - 1)}
              disabled={qty <= 0}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
            >−</button>
            <span className="w-7 text-center text-sm font-medium text-blue-600">{qty > 0 ? qty : '-'}</span>
            <button
              onClick={() => setFn(opt.id, qty + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            >+</button>
          </div>
        </div>
      );
    };

    // 渲染台上盆洗手盆配置选项卡（带下拉+数量选择）
    const renderAboveBasinMaterialOption = (matOpt: any) => {
      const qty = basinConfig.basinItems['basin-qty'] || 0;
      // basin-material 存的是 unitPrice(number)，所以找一个 id 对应的 unitPrice 来比对
      const selectedUnitPrice = basinConfig.basinItems['basin-material'] || 0;
      const isSelected = selectedUnitPrice === matOpt.unitPrice;
      const hasActive = qty > 0 && isSelected;

      return (
        <div
          key={matOpt.id}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${hasActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded flex-shrink-0 text-xs">🛁</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 truncate leading-tight">台上盆材质</div>
              <select
                value={selectedUnitPrice === matOpt.unitPrice ? matOpt.id : 'none'}
                onChange={e => {
                  const newId = e.target.value;
                  // 如果选的是同一个材质，清除选择；否则设置为新的材质
                  if (newId === 'none') {
                    setBasinItem('basin-material', 0);
                  } else {
                    const opt = materialConfig?.basinMaterialOptions?.find((m: any) => m.id === newId);
                    if (opt) {
                      setBasinItem('basin-material', opt.unitPrice);
                      // 如果数量是0，自动设为1
                      if ((basinConfig.basinItems['basin-qty'] || 0) === 0) {
                        setBasinItem('basin-qty', 1);
                      }
                    }
                  }
                }}
                className="text-sm px-1 py-0.5 rounded border border-gray-200 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400 w-auto max-w-full"
              >
                <option value="none">不选择</option>
                {(materialConfig?.basinMaterialOptions || []).map((m: any) => (
                  <option key={m.id} value={m.id}>{m.label} ¥{m.unitPrice}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => { setBasinItem('basin-qty', Math.max(0, qty - 1)); }}

              disabled={!isSelected || qty <= 0}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
            >−</button>
            <span className="w-7 text-center text-sm font-medium text-blue-600">{qty > 0 ? qty : '-'}</span>
            <button
              onClick={() => {
                if (!isSelected) {
                  // 自动选中第一个材质
                  const firstOpt = materialConfig?.basinMaterialOptions?.[0];
                  if (firstOpt) {
                    setBasinItem('basin-material', firstOpt.unitPrice);
                  }
                }
                setBasinItem('basin-qty', qty + 1);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            >+</button>
          </div>
        </div>
      );
    };

    // 渲染台下盆配置选项卡
    const renderUnderConfigOption = (opt: any) => {
      const qty = basinConfig.basinItems[opt.id] || 0;
      const hasActive = qty > 0;
      const length = Math.max(basinConfig.countertopLength || 800, 800);
      let price = 0;
      let priceLabel = '';
      
      if (opt.priceType === 'unit' && opt.unitPrice) {
        price = opt.unitPrice;
        priceLabel = `¥${price}/${opt.unit}`;
      } else if (opt.priceType === 'length' && opt.priceFormula) {
        price = opt.priceFormula(length);
        // 按长度计价：单位显示为 m（米），价格是每米单价
        const unitPrice = opt.priceFormula(1000); // 统一换算成每米价格
        priceLabel = `¥${unitPrice.toFixed(0)}/m`;
      }

      return (
        <div
          key={opt.id}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${hasActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded flex-shrink-0 text-xs">🛁</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 truncate leading-tight">{opt.label}</div>
              <div className="text-xs text-gray-400">{priceLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setBasinItem(opt.id, qty - 1)}
              disabled={qty <= 0}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
            >−</button>
            <span className="w-7 text-center text-sm font-medium text-blue-600">{qty > 0 ? qty : '-'}</span>
            <button
              onClick={() => setBasinItem(opt.id, qty + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            >+</button>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* ===== 区域1: 台盆配置 - 材质选择（与主柜一致的卡片式）===== */}
        <section className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>🧽</span> 台面配置组合
          </h3>

          {/* 安装类型：台上盆 / 台下盆（与主柜一致的高度和图标） */}
          <div className="flex gap-2 mb-4">
            {VANITY_BASIN_INSTALL_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setBasinConfig(prev => ({
                  ...prev,
                  installType: type.id as 'above' | 'under',
                  materialId: '',
                  basinItems: {},
                  countertopId: '',
                  countertopLength: 800,
                  extraItems: {},
                  extraLengths: {},
                }))}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer text-sm"
                style={{
                  borderColor: basinConfig.installType === type.id ? '#3b82f6' : '#e5e7eb',
                  background: basinConfig.installType === type.id ? '#eff6ff' : 'white',
                  color: basinConfig.installType === type.id ? '#2563eb' : '#4b5563',
                }}
              >
                <span>{type.id === 'above' ? '🧽' : '🛁'}</span>
                {type.label}
              </button>
            ))}
          </div>

          {/* 材质卡片列表（根据类型显示对应材质，和主柜一致的卡片式） */}
          <div className="flex flex-wrap gap-2">
            {materials.map(mat => renderMaterialCard(mat))}
          </div>
        </section>

        {/* ===== 区域2: 台盆具体配置 ===== */}
        {basinConfig.materialId && materialConfig && (
          <section className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🪨</span> {materialConfig.label} 配置明细
            </h3>

            {/* 台上盆配置 */}
            {basinConfig.installType === 'above' && (
              <>
                {/* 台盆区域（台上盆+台中盆）*/}
                {materialConfig.basinMaterialOptions && materialConfig.basinMaterialOptions.length > 0 && (() => {
                  const basinMatTotal = ((() => {
                    const matId = basinConfig.basinItems['basin-material'];
                    if (!matId || matId === 'none') return 0;
                    const matOpt = materialConfig.basinMaterialOptions?.find((m: any) => m.id === matId);
                    return (matOpt?.unitPrice || 0) * (basinConfig.basinItems['basin-qty'] || 0);
                  })()) + ((materialConfig.basinQtyUnitPrice || 0) * (basinConfig.basinItems['basin-mid-qty'] || 0));
                  const hasItems = (basinConfig.basinItems['basin-material'] && basinConfig.basinItems['basin-material'] !== 'none') || (basinConfig.basinItems['basin-mid-qty'] || 0) > 0;
                  return (
                    <section className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <span>🧽</span> 台盆
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBasinShowTips(true)}
                            className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
                            title="计价规则说明"
                          >?</button>
                          <span className="text-sm font-bold text-orange-500">
                            {hasItems ? `¥${basinMatTotal.toFixed(0)}` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {/* 台上盆：下拉选择材质+数量 */}
                        <div
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                            (basinConfig.basinItems['basin-qty'] || 0) > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded flex-shrink-0 text-xs">🧽</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-500 truncate leading-tight">台上盆</div>
                              <select
                                value={basinConfig.basinItems['basin-material'] || 'none'}
                                onChange={e => {
                                  const val = e.target.value;
                                  if (val === 'none') {
                                    setBasinItem('basin-material', 'none');
                                  } else {
                                    setBasinItem('basin-material', val);
                                    if ((basinConfig.basinItems['basin-qty'] || 0) === 0) {
                                      setBasinItem('basin-qty', 1);
                                    }
                                  }
                                }}
                                className="text-sm px-1 py-0.5 rounded border border-gray-200 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400 w-auto max-w-full"
                              >
                                <option value="none">不选择</option>
                                {materialConfig.basinMaterialOptions?.map((m: any) => (
                                  <option key={m.id} value={m.id}>{m.label} ¥{m.unitPrice}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => setBasinItem('basin-qty', Math.max(0, (basinConfig.basinItems['basin-qty'] || 0) - 1))}
                              disabled={(basinConfig.basinItems['basin-qty'] || 0) <= 0}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                            >−</button>
                            <span className="w-7 text-center text-sm font-medium text-blue-600">
                              {(basinConfig.basinItems['basin-qty'] || 0) > 0 ? basinConfig.basinItems['basin-qty'] : '-'}
                            </span>
                            <button
                              onClick={() => {
                                if (!basinConfig.basinItems['basin-material'] || basinConfig.basinItems['basin-material'] === 'none') {
                                  const firstOpt = materialConfig.basinMaterialOptions?.[0];
                                  if (firstOpt) setBasinItem('basin-material', firstOpt.id);
                                }
                                setBasinItem('basin-qty', (basinConfig.basinItems['basin-qty'] || 0) + 1);
                              }}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >+</button>
                          </div>
                        </div>

                        {/* 台中盆 */}
                        {materialConfig.basinQtyUnitPrice && (
                          <div
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                              (basinConfig.basinItems['basin-mid-qty'] || 0) > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded flex-shrink-0 text-xs">🛁</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500 truncate leading-tight">台中盆</div>
                                <div className="text-xs text-gray-400">¥{materialConfig.basinQtyUnitPrice}/个</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => setBasinItem('basin-mid-qty', Math.max(0, (basinConfig.basinItems['basin-mid-qty'] || 0) - 1))}
                                disabled={(basinConfig.basinItems['basin-mid-qty'] || 0) <= 0}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                              >−</button>
                              <span className="w-7 text-center text-sm font-medium text-blue-600">
                                {(basinConfig.basinItems['basin-mid-qty'] || 0) > 0 ? basinConfig.basinItems['basin-mid-qty'] : '-'}
                              </span>
                              <button
                                onClick={() => setBasinItem('basin-mid-qty', (basinConfig.basinItems['basin-mid-qty'] || 0) + 1)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                              >+</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })()}

                {/* 台面区域 */}
                {(materialConfig.countertopOptions || []).length > 0 && (() => {
                  const selectedOpt = (materialConfig.countertopOptions || []).find((o: any) => o.id === basinConfig.countertopId);
                  const areaTotal = selectedOpt?.priceFormula ? selectedOpt.priceFormula(basinConfig.countertopLength || 800) : 0;
                  return (
                    <section className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <span>🪨</span> 台面
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBasinShowTips(true)}
                            className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
                            title="计价规则说明"
                          >?</button>
                          <span className="text-sm font-bold text-orange-500">
                            {basinConfig.countertopId ? `¥${areaTotal.toFixed(0)}` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(materialConfig.countertopOptions || []).map((opt: any) => renderCountertopOption(opt))}
                      </div>
                    </section>
                  );
                })()}

                {/* 配置项区域 */}
                {(materialConfig.extraOptions || []).length > 0 && (() => {
                  const areaTotal = (materialConfig.extraOptions || []).reduce((sum: any, opt: any) => {
                    const checked = basinConfig.extraItems[opt.id] || 0;
                    if (checked <= 0) return sum;
                    const extraLen = (basinConfig.extraLengths || {})[opt.id] || basinConfig.countertopLength || 800;
                    return sum + (opt.priceFormula ? opt.priceFormula(extraLen) : 0);
                  }, 0);
                  const hasChecked = (materialConfig.extraOptions || []).some((o: any) => (basinConfig.extraItems[o.id] || 0) > 0);
                  return (
                    <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <span>⚙️</span> 配置项
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBasinShowTips(true)}
                            className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
                            title="计价规则说明"
                          >?</button>
                          <span className="text-sm font-bold text-orange-500">
                            {hasChecked ? `¥${areaTotal.toFixed(0)}` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(materialConfig.extraOptions || []).map((opt: any) => renderExtraOption(opt))}
                      </div>
                    </section>
                  );
                })()}
              </>
            )}

            {/* 台下盆配置 */}
            {basinConfig.installType === 'under' && (
              <>
                {/* 台盆区域 */}
                {(materialConfig.basinOptions || []).length > 0 && (() => {
                  const areaTotal = (materialConfig.basinOptions || []).reduce((sum: number, opt: any) => {
                    const qty = basinConfig.basinItems[opt.id] || 0;
                    if (qty <= 0) return sum;
                    if (opt.priceType === 'unit' && opt.unitPrice) return sum + opt.unitPrice * qty;
                    if (opt.priceType === 'length' && opt.priceFormula) return sum + opt.priceFormula(basinConfig.countertopLength || 800) * qty;
                    return sum;
                  }, 0);
                  const hasItems = (materialConfig.basinOptions || []).some((o: any) => (basinConfig.basinItems[o.id] || 0) > 0);
                  return (
                    <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <span>🛁</span> 台盆
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBasinShowTips(true)}
                            className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
                            title="计价规则说明"
                          >?</button>
                          <span className="text-sm font-bold text-orange-500">
                            {hasItems ? `¥${areaTotal.toFixed(0)}` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(materialConfig.basinOptions || []).map((opt: any) => renderUnderConfigOption(opt))}
                      </div>
                    </section>
                  );
                })()}

                {/* 台面区域 */}
                {(materialConfig.countertopOptions || []).length > 0 && (() => {
                  const selectedOpt = (materialConfig.countertopOptions || []).find((o: any) => o.id === basinConfig.countertopId);
                  const areaTotal = selectedOpt?.priceFormula ? selectedOpt.priceFormula(basinConfig.countertopLength || 800) : 0;
                  const safeAreaTotal = isNaN(areaTotal) ? 0 : areaTotal;
                  return (
                    <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <span>🪨</span> 台面
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBasinShowTips(true)}
                            className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
                            title="计价规则说明"
                          >?</button>
                          <span className="text-sm font-bold text-orange-500">
                            {basinConfig.countertopId ? `¥${safeAreaTotal.toFixed(0)}` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(materialConfig.countertopOptions || []).map((opt: any) => renderCountertopOption(opt))}
                      </div>
                    </section>
                  );
                })()}

                {/* 配置项区域 */}
                {(materialConfig.extraOptions || []).length > 0 && (() => {
                  const areaTotal = (materialConfig.extraOptions || []).reduce((sum: any, opt: any) => {
                    const checked = basinConfig.extraItems[opt.id] || 0;
                    if (checked <= 0) return sum;
                    const extraLen = (basinConfig.extraLengths || {})[opt.id] || basinConfig.countertopLength || 800;
                    return sum + (opt.priceFormula ? opt.priceFormula(extraLen) : 0);
                  }, 0);
                  const hasChecked = (materialConfig.extraOptions || []).some((o: any) => (basinConfig.extraItems[o.id] || 0) > 0);
                  const safeAreaTotal = isNaN(areaTotal) ? 0 : areaTotal;
                  return (
                    <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <span>⚙️</span> 配置项
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBasinShowTips(true)}
                            className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
                            title="计价规则说明"
                          >?</button>
                          <span className="text-sm font-bold text-orange-500">
                            {hasChecked ? `¥${safeAreaTotal.toFixed(0)}` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(materialConfig.extraOptions || []).map((opt: any) => renderExtraOption(opt))}
                      </div>
                    </section>
                  );
                })()}
              </>
            )}

            {/* 小计 */}
            <div className="flex justify-end pt-3 border-t mt-3">
              <span className="text-sm text-gray-500">台盆小计：</span>
              <span className="ml-2 text-base font-bold text-orange-500">¥{isNaN(basinPrice) ? 0 : basinPrice.toFixed(0)}</span>
            </div>
          </section>
        )}

        {/* ===== 台盆计价规则 Tips 弹窗 ===== */}
        {basinShowTips && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] px-4"
            onClick={() => setBasinShowTips(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-lg">📋</span> 台盆计价规则说明
                </h3>
                <button
                  onClick={() => setBasinShowTips(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
                >✕</button>
              </div>
              <div className="p-5 space-y-4">
                {/* 台盆区域规则 */}
                {(materialConfig.basinMaterialOptions?.length > 0 || materialConfig.basinOptions?.length > 0 || materialConfig.basinQtyUnitPrice) && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <span>🧽</span> 台盆计价规则
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      {materialConfig.basinMaterialOptions?.map((m: any) => (
                        <div key={m.id} className="flex justify-between items-center border-b border-blue-100 pb-1.5 last:border-0">
                          <span className="text-gray-700">{m.label}</span>
                          <span className="text-orange-600 font-bold">¥{m.unitPrice} / 个</span>
                        </div>
                      ))}
                      {materialConfig.basinQtyUnitPrice && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-1.5 last:border-0">
                          <span className="text-gray-700">台中盆</span>
                          <span className="text-orange-600 font-bold">¥{materialConfig.basinQtyUnitPrice} / 个</span>
                        </div>
                      )}
                      {materialConfig.basinOptions?.filter((o: any) => o.priceType === 'unit').map((o: any) => (
                        <div key={o.id} className="flex justify-between items-center border-b border-blue-100 pb-1.5 last:border-0">
                          <span className="text-gray-700">{o.label}</span>
                          <span className="text-orange-600 font-bold">¥{o.unitPrice} / {o.unit || '个'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-blue-600 bg-blue-100 rounded p-2">
                      <strong>计价公式：</strong>数量 × 单价
                    </div>
                  </div>
                )}

                {/* 台面区域规则 */}
                {(materialConfig.countertopOptions?.length > 0) && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                      <span>🪨</span> 台面计价规则
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {materialConfig.countertopOptions?.map((opt: any) => (
                        <div key={opt.id} className="border-b border-purple-100 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-700 font-medium">{opt.label}</span>
                            <span className="text-purple-600 font-bold">
                              ¥{opt.priceFormula ? opt.priceFormula(800).toFixed(0) : opt.unitPrice} / 米
                            </span>
                          </div>
                          <div className="text-xs text-purple-500">
                            <strong>公式：</strong>{opt.priceFormulaStr || '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-purple-600 bg-purple-100 rounded p-2">
                      <strong>标准计价：</strong>按标准 800mm 长度计算，标准价仅作参考
                    </div>
                  </div>
                )}

                {/* 配置项区域规则 */}
                {(materialConfig.extraOptions?.length > 0) && (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <span>⚙️</span> 配置项计价规则
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {materialConfig.extraOptions?.map((opt: any) => (
                        <div key={opt.id} className="border-b border-orange-100 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-700 font-medium">{opt.label}</span>
                            <span className="text-orange-600 font-bold">
                              ¥{opt.priceFormula ? opt.priceFormula(800).toFixed(0) : opt.unitPrice} / 米
                            </span>
                          </div>
                          <div className="text-xs text-orange-500">
                            <strong>公式：</strong>{opt.priceFormulaStr || '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-orange-600 bg-orange-100 rounded p-2">
                      <strong>标准计价：</strong>按标准 800mm 长度计算，标准价仅作参考
                    </div>
                  </div>
                )}

                {/* 通用规则 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📌</span> 通用规则
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                    <li>台盆、台面、配置项均为独立计价，可同时选择</li>
                    <li>台面/配置项标准价按 800mm 长度计算，实际价格以最终配置为准</li>
                    <li>台盆小计 = 台上盆（材质单价 × 数量）+ 台中盆（¥280 × 数量）</li>
                    <li>台盆合计 = 台盆小计 + 台面小计 + 配置项小计</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== 渲染：浴室镜配置 =====
  const renderMirror = () => {
    // 是否使用面积计价（用于显示输入框类型）
    const useAreaPricing = (type: string) => {
      if (mirrorConfig.mirrorType === 'plain') {
        return type === 'plain-single' || type === 'alu' || type === 'stainless';
      } else {
        return type.startsWith('no-border') || type.startsWith('alu-') || type.startsWith('steel-');
      }
    };

    // 当前材质（用于配件计价）
    const getCurrentWoodMaterial = () => {
      if (mirrorConfig.mirrorType === 'plain') {
        return mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.plainSingleWoodMaterial : mirrorConfig.plainCabinetMaterial;
      } else {
        return mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.smartSingleWoodMaterial : mirrorConfig.smartCabinetMaterial;
      }
    };

    // 当前长度
    const getCurrentLength = () => {
      if (mirrorConfig.mirrorType === 'plain') {
        return mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.plainSingleLength : mirrorConfig.plainCabinetLength;
      } else {
        return mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.smartSingleLength : mirrorConfig.smartCabinetLength;
      }
    };

    // 配件数量（侧柜）
    const getSideCabinet = () => mirrorConfig.mirrorType === 'plain' ? mirrorConfig.plainSideCabinet : mirrorConfig.smartSideCabinet;
    const setSideCabinet = (val: number) => {
      if (mirrorConfig.mirrorType === 'plain') {
        setMirrorConfig(prev => ({ ...prev, plainSideCabinet: Math.max(0, val) }));
      } else {
        setMirrorConfig(prev => ({ ...prev, smartSideCabinet: Math.max(0, val) }));
      }
    };
    // 侧柜材质 = 镜子木材材质
    const getSideCabinetMat = () => mirrorConfig.mirrorType === 'plain'
      ? (mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.plainSingleWoodMaterial : mirrorConfig.plainCabinetMaterial)
      : (mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.smartSingleWoodMaterial : mirrorConfig.smartCabinetMaterial);
    const setSideCabinetMat = (mat: string) => {
      if (mirrorConfig.mirrorType === 'plain') {
        if (mirrorConfig.mirrorStyle === 'single') setMirrorConfig(prev => ({ ...prev, plainSingleWoodMaterial: mat }));
        else setMirrorConfig(prev => ({ ...prev, plainCabinetMaterial: mat }));
      } else {
        if (mirrorConfig.mirrorStyle === 'single') setMirrorConfig(prev => ({ ...prev, smartSingleWoodMaterial: mat }));
        else setMirrorConfig(prev => ({ ...prev, smartCabinetMaterial: mat }));
      }
    };

    // 配件数量（开放格）
    const getOpenShelf = () => mirrorConfig.mirrorType === 'plain' ? mirrorConfig.plainOpenShelf : mirrorConfig.smartOpenShelf;
    const setOpenShelf = (val: number) => {
      if (mirrorConfig.mirrorType === 'plain') {
        setMirrorConfig(prev => ({ ...prev, plainOpenShelf: Math.max(0, val) }));
      } else {
        setMirrorConfig(prev => ({ ...prev, smartOpenShelf: Math.max(0, val) }));
      }
    };
    // 开放格材质 = 镜子木材材质
    const getOpenShelfMat = getSideCabinetMat;
    const setOpenShelfMat = setSideCabinetMat;

    // 配件数量（美式造型）
    const getAmericanStyle = () => mirrorConfig.mirrorType === 'plain' ? mirrorConfig.plainAmericanStyle : mirrorConfig.smartAmericanStyle;
    const setAmericanStyle = (val: number) => {
      if (mirrorConfig.mirrorType === 'plain') {
        setMirrorConfig(prev => ({ ...prev, plainAmericanStyle: Math.max(0, val) }));
      } else {
        setMirrorConfig(prev => ({ ...prev, smartAmericanStyle: Math.max(0, val) }));
      }
    };

    // 镜面类型选项（根据镜子形式选择单镜或镜柜选项）
    const mirrorTypeOptions = (() => {
      if (mirrorConfig.mirrorStyle === 'cabinet') {
        return mirrorConfig.mirrorType === 'plain' ? PLAIN_CABINET_TYPES : SMART_CABINET_TYPES;
      }
      return mirrorConfig.mirrorType === 'plain' ? PLAIN_SINGLE_TYPES : SMART_SINGLE_TYPES;
    })();
    const currentType = mirrorConfig.mirrorStyle === 'cabinet'
      ? (mirrorConfig.mirrorType === 'plain' ? 'plain-cabinet' : (mirrorConfig.smartSingleType === 'wood-backlight' ? 'smart-cabinet-updown' : 'smart-cabinet-sand'))
      : (mirrorConfig.mirrorType === 'plain' ? mirrorConfig.plainSingleType : mirrorConfig.smartSingleType);
    const setMirrorTypeOption = (val: string) => {
      // val 包含镜子形式前缀，如 'plain-cabinet', 'smart-cabinet-updown', 'wood-backlight' 等
      // 注意：镜子类型（普通/智能）由顶部"普通镜/智能镜"按钮控制，这里只更新镜子形式和具体选项
      const isCabinet = val.includes('cabinet');
      
      setMirrorConfig(prev => ({
        ...prev,
        mirrorStyle: isCabinet ? 'cabinet' : 'single',
        // 镜子类型保持不变，由"普通镜/智能镜"按钮控制
        // 只更新对应的类型字段
        ...(prev.mirrorType === 'smart' ? { smartSingleType: val } : { plainSingleType: val }),
      }));
    };

    // 面积值
    const getArea = () => mirrorConfig.mirrorType === 'plain' ? mirrorConfig.plainSingleArea : mirrorConfig.smartSingleArea;
    const setArea = (val: number) => {
      if (mirrorConfig.mirrorType === 'plain') {
        setMirrorConfig(prev => ({ ...prev, plainSingleArea: Math.max(0.1, val) }));
      } else {
        setMirrorConfig(prev => ({ ...prev, smartSingleArea: Math.max(0.1, val) }));
      }
    };

    // 倒R角
    const getRCorner = () => mirrorConfig.mirrorType === 'plain' ? mirrorConfig.plainSingleRCorner : mirrorConfig.smartSingleRCorner;
    const setRCorner = (val: boolean) => {
      if (mirrorConfig.mirrorType === 'plain') {
        setMirrorConfig(prev => ({ ...prev, plainSingleRCorner: val }));
      } else {
        setMirrorConfig(prev => ({ ...prev, smartSingleRCorner: val }));
      }
    };

    // 木材材质
    const getWoodMaterial = () => {
      if (mirrorConfig.mirrorType === 'plain') {
        return mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.plainSingleWoodMaterial : mirrorConfig.plainCabinetMaterial;
      } else {
        return mirrorConfig.mirrorStyle === 'single' ? mirrorConfig.smartSingleWoodMaterial : mirrorConfig.smartCabinetMaterial;
      }
    };
    const setWoodMaterial = (val: string) => {
      if (mirrorConfig.mirrorType === 'plain') {
        if (mirrorConfig.mirrorStyle === 'single') {
          setMirrorConfig(prev => ({ ...prev, plainSingleWoodMaterial: val }));
        } else {
          setMirrorConfig(prev => ({ ...prev, plainCabinetMaterial: val }));
        }
      } else {
        if (mirrorConfig.mirrorStyle === 'single') {
          setMirrorConfig(prev => ({ ...prev, smartSingleWoodMaterial: val }));
        } else {
          setMirrorConfig(prev => ({ ...prev, smartCabinetMaterial: val }));
        }
      }
    };

    // 镜柜长度
    const getCabinetLength = () => {
      if (mirrorConfig.mirrorType === 'plain') {
        return mirrorConfig.plainCabinetLength;
      } else {
        return mirrorConfig.smartCabinetLength;
      }
    };
    const setCabinetLength = (val: number) => {
      if (mirrorConfig.mirrorType === 'plain') {
        setMirrorConfig(prev => ({ ...prev, plainCabinetLength: val }));
      } else {
        setMirrorConfig(prev => ({ ...prev, smartCabinetLength: val }));
      }
    };

    // 当前类型配置
    const currentTypeOption = mirrorTypeOptions.find(t => t.id === currentType);
    const isLengthBased = currentTypeOption?.unit === '长度';
    const currentWoodMat = getWoodMaterial();

    return (
      <div className="space-y-4">
        {/* ===== 区块1: 镜子类型 + 形式选择 ===== */}
        <section className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span>🪞</span> 浴室镜配置
            </h3>
          </div>

          {/* 镜子类型：普通镜 / 智能镜（小标签按钮样式，与台上盆一致） */}
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMirrorConfig(prev => ({ ...prev, mirrorType: 'plain', plainSingleType: 'plain-single' }))}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer text-sm"
                style={{
                  borderColor: mirrorConfig.mirrorType === 'plain' ? '#3b82f6' : '#e5e7eb',
                  background: mirrorConfig.mirrorType === 'plain' ? '#eff6ff' : 'white',
                  color: mirrorConfig.mirrorType === 'plain' ? '#2563eb' : '#4b5563',
                }}
              >
                <span>🔘</span> 普通镜
              </button>
              <button
                onClick={() => setMirrorConfig(prev => ({ ...prev, mirrorType: 'smart', smartSingleType: 'no-border-backlight' }))}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer text-sm"
                style={{
                  borderColor: mirrorConfig.mirrorType === 'smart' ? '#3b82f6' : '#e5e7eb',
                  background: mirrorConfig.mirrorType === 'smart' ? '#eff6ff' : 'white',
                  color: mirrorConfig.mirrorType === 'smart' ? '#2563eb' : '#4b5563',
                }}
              >
                <span>✨</span> 智能镜
              </button>
            </div>
          </div>

          {/* 镜子形式：单镜 / 镜柜（图片卡片样式，选中后展开面积/长度输入框，与台面选项卡一致） */}
          <div className="flex flex-wrap gap-3">
            {/* 单镜卡片 */}
            <div
              className={`rounded-xl border-2 transition-all overflow-hidden ${
                mirrorConfig.mirrorStyle === 'single' ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
              style={{ width: '120px' }}
            >
              <div
                className="flex flex-col items-center cursor-pointer select-none px-2 pt-2"
                onClick={() => setMirrorConfig(prev => ({ ...prev, mirrorStyle: 'single' }))}
              >
                <div className="w-[120px] h-[90px] bg-gray-50 overflow-hidden flex items-center justify-center">
                  <img src="/pims-quote/images/vanity/mirror-single.png" alt="单镜" className="w-full h-full object-cover" />
                </div>
                <div className={`w-full py-1.5 text-sm font-medium text-center ${
                  mirrorConfig.mirrorStyle === 'single' ? 'text-blue-700 bg-blue-50' : 'text-gray-600 bg-white'
                }`}>
                  单镜
                </div>
              </div>
            </div>

            {/* 镜柜卡片 */}
            <div
              className={`rounded-xl border-2 transition-all overflow-hidden ${
                mirrorConfig.mirrorStyle === 'cabinet' ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
              style={{ width: '120px' }}
            >
              <div
                className="flex flex-col items-center cursor-pointer select-none px-2 pt-2"
                onClick={() => setMirrorConfig(prev => ({ ...prev, mirrorStyle: 'cabinet' }))}
              >
                <div className="w-[120px] h-[90px] bg-gray-50 overflow-hidden flex items-center justify-center">
                  <img src="/pims-quote/images/vanity/mirror-cabinet.png" alt="镜柜" className="w-full h-full object-cover" />
                </div>
                <div className={`w-full py-1.5 text-sm font-medium text-center ${
                  mirrorConfig.mirrorStyle === 'cabinet' ? 'text-blue-700 bg-blue-50' : 'text-gray-600 bg-white'
                }`}>
                  镜柜
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 区块2: 镜面配置 ===== */}
        <section className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>✨</span> 镜面配置
          </h3>

          {/* 镜面类型选择（横向选项卡样式，与台面选项卡一致） */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mirrorTypeOptions.map(type => {
              // 直接根据 mirrorConfig 状态判断是否选中
              const isCabinet = type.id.includes('cabinet');
              const isSelected = mirrorConfig.mirrorStyle === (isCabinet ? 'cabinet' : 'single') 
                && (
                  isCabinet 
                    ? (mirrorConfig.mirrorType === 'plain' 
                        ? type.id === 'plain-cabinet' 
                        : type.id === mirrorConfig.smartSingleType) // 智能镜镜柜：检查 smartSingleType
                    : (type.id === mirrorConfig[mirrorConfig.mirrorType === 'plain' ? 'plainSingleType' : 'smartSingleType'])
                );
              const isLengthType = type.unit === '长度';
              return (
                <div
                  key={type.id}
                  className={`rounded-xl border-2 transition-all overflow-hidden ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  {/* 选项头部：单选按钮 + 名称 + 价格 */}
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
                    onClick={() => setMirrorTypeOption(type.id)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 leading-tight">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{type.priceNote}</div>
                    </div>
                  </div>
                  {/* 选中后展开输入 */}
                  {isSelected && (
                    <div className="px-3 pb-2.5 border-t border-blue-100 pt-2 space-y-2">
                      {/* 面积/长度类型选择（根据选项类型显示不同按钮） */}
                      {isLengthType ? (
                        type.hideRCorner ? (
                          // 镜柜类型：只有长度输入，无倒R角按钮
                          null
                        ) : (
                          // 长度类型（木框包边/木材包边）：显示普通长度/倒R角长度
                          <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setRCorner(false); }}
                                className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                                  !getRCorner() 
                                    ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' 
                                    : 'border-gray-200 bg-white text-gray-500'
                                }`}
                              >
                                普通长度
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setRCorner(true); }}
                                className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                                  getRCorner() 
                                    ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' 
                                    : 'border-gray-200 bg-white text-gray-500'
                                }`}
                              >
                                倒R角长度
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        // 面积类型：显示普通面积/倒R角面积
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setRCorner(false); }}
                              className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                                !getRCorner() 
                                  ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' 
                                  : 'border-gray-200 bg-white text-gray-500'
                              }`}
                            >
                              普通面积
                            </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setRCorner(true); }}
                                className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                                  getRCorner() 
                                    ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' 
                                    : 'border-gray-200 bg-white text-gray-500'
                                }`}
                              >
                                倒R角面积
                              </button>
                          </div>
                        </div>
                      )}
                      {/* 长度输入（木框/木材包边） */}
                      {isLengthType ? (
                        <>
                          <div className="flex items-center gap-2">
                            <select
                              value={currentWoodMat}
                              onChange={e => setWoodMaterial(e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="text-xs px-2 py-1 rounded border border-blue-300 bg-white text-gray-700 focus:outline-none cursor-pointer"
                            >
                              {WOOD_MATERIALS.map(mat => (
                                <option key={mat.id} value={mat.id}>{mat.label}</option>
                              ))}
                            </select>
                            {mirrorConfig.mirrorStyle === 'cabinet' ? (
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={getCabinetLength() || ''}
                                onChange={e => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) setCabinetLength(val);
                                  else setCabinetLength(0);
                                }}
                                onClick={e => e.stopPropagation()}
                                onMouseDown={e => e.stopPropagation()}
                                className="w-20 text-xs px-2 py-1 rounded border border-blue-300 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                              />
                            ) : (
                              <input
                                type="number"
                                inputMode="numeric"
                                value={getCurrentLength()}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 0;
                                  setMirrorConfig(prev => ({ 
                                    ...prev, 
                                    plainSingleLength: val,
                                    smartSingleLength: val
                                  }));
                                }}
                                onBlur={e => {
                                  const val = parseInt(e.target.value) || 0;
                                  // 清空后设为0，不设最小值
                                  if (val < 0) {
                                    setMirrorConfig(prev => ({ 
                                      ...prev, 
                                      plainSingleLength: 0,
                                      smartSingleLength: 0
                                    }));
                                  }
                                }}
                                onClick={e => e.stopPropagation()}
                                className="w-20 text-xs px-2 py-1 rounded border border-blue-300 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                                step={100}
                              />
                            )}
                            <span className="text-xs text-gray-400">mm</span>
                            {getRCorner() && (
                              <span className="text-xs text-orange-500 font-medium ml-1">倒R角 +¥60</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 whitespace-nowrap">面积</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={getArea()}
                            onChange={e => setArea(parseFloat(e.target.value) || 0)}
                            onBlur={e => {
                              const val = parseFloat(e.target.value) || 0;
                              // 清空后保持0，不设最小值限制
                              if (val < 0) setArea(0);
                            }}
                            onClick={e => e.stopPropagation()}
                            className="w-20 text-xs px-2 py-1 rounded border border-blue-300 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                            step={0.1}
                          />
                          <span className="text-xs text-gray-400">m²</span>
                          {getRCorner() && (
                            <span className="text-xs text-orange-500 font-medium ml-1">倒R角 +¥60</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* 镜面配置小计 */}
          <div className="flex justify-end pt-3 border-t mt-3">
            <span className="text-sm text-gray-500">小计：</span>
            <span className="ml-2 text-lg font-bold text-orange-500">¥{mirrorPrice.toFixed(0)}</span>
          </div>
        </section>

        {/* ===== 区块3: 配件增配 ===== */}
            <section className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>⚙️</span> 配件增配
              </h3>

              <div className="grid grid-cols-4 gap-2">
                {/* 单加侧柜：下拉选材质 + 数量 */}
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${getSideCabinet() > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 truncate mb-1">单加侧柜</div>
                    <select
                      value={getSideCabinetMat()}
                      onChange={e => setSideCabinetMat(e.target.value)}
                      className="w-full text-xs px-1.5 py-1 rounded border border-gray-200 bg-white text-gray-600 focus:outline-none cursor-pointer"
                    >
                      <option value="mianqi">免漆板 ¥260</option>
                      <option value="xiangjiao">橡胶木 ¥360</option>
                      <option value="baixian">白蜡木/红橡木 ¥430</option>
                      <option value="wujin">乌金木 ¥460</option>
                      <option value="heihut">黑胡桃木 ¥480</option>
                      <option value="baixiang">白橡直纹 ¥539</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSideCabinet(getSideCabinet() - 1)}
                      disabled={getSideCabinet() <= 0}
                      className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer text-xs font-bold"
                    >−</button>
                    <span className="w-5 text-center text-xs font-medium text-blue-600">{getSideCabinet() > 0 ? getSideCabinet() : '-'}</span>
                    <button
                      onClick={() => setSideCabinet(getSideCabinet() + 1)}
                      className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-xs font-bold"
                    >+</button>
                  </div>
                </div>

                {/* 单加开放格：下拉选材质 + 数量 */}
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${getOpenShelf() > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 truncate mb-1">单加开放格</div>
                    <select
                      value={getOpenShelfMat()}
                      onChange={e => setOpenShelfMat(e.target.value)}
                      className="w-full text-xs px-1.5 py-1 rounded border border-gray-200 bg-white text-gray-600 focus:outline-none cursor-pointer"
                    >
                      <option value="mianqi">免漆板 ¥200</option>
                      <option value="xiangjiao">橡胶木 ¥300</option>
                      <option value="baixian">白蜡木/红橡木 ¥360</option>
                      <option value="wujin">乌金木 ¥380</option>
                      <option value="heihut">黑胡桃木 ¥399</option>
                      <option value="baixiang">白橡直纹 ¥450</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setOpenShelf(getOpenShelf() - 1)}
                      disabled={getOpenShelf() <= 0}
                      className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer text-xs font-bold"
                    >−</button>
                    <span className="w-5 text-center text-xs font-medium text-blue-600">{getOpenShelf() > 0 ? getOpenShelf() : '-'}</span>
                    <button
                      onClick={() => setOpenShelf(getOpenShelf() + 1)}
                      className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-xs font-bold"
                    >+</button>
                  </div>
                </div>

                {/* 美式造型单加（仅镜柜显示） */}
                {mirrorConfig.mirrorStyle === 'cabinet' && (
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${getAmericanStyle() > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 truncate">美式造型单加</div>
                      <div className="text-xs text-gray-400">¥300/个</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAmericanStyle(getAmericanStyle() - 1)}
                        disabled={getAmericanStyle() <= 0}
                        className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer text-xs font-bold"
                      >−</button>
                      <span className="w-5 text-center text-xs font-medium text-blue-600">{getAmericanStyle() > 0 ? getAmericanStyle() : '-'}</span>
                      <button
                        onClick={() => setAmericanStyle(getAmericanStyle() + 1)}
                        className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-xs font-bold"
                      >+</button>
                    </div>
                  </div>
                )}

                {/* 智能镜柜专属配件 */}
                {mirrorConfig.mirrorType === 'smart' && mirrorConfig.mirrorStyle === 'cabinet' && (
                  <>
                    {/* 玻璃层板单加 */}
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${mirrorConfig.smartGlassShelf > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 truncate">玻璃层板单加</div>
                        <div className="text-xs text-gray-400">¥30/块</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartGlassShelf: Math.max(0, prev.smartGlassShelf - 1) }))}
                          disabled={mirrorConfig.smartGlassShelf <= 0}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer text-xs font-bold"
                        >−</button>
                        <span className="w-5 text-center text-xs font-medium text-blue-600">{mirrorConfig.smartGlassShelf > 0 ? mirrorConfig.smartGlassShelf : '-'}</span>
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartGlassShelf: prev.smartGlassShelf + 1 }))}
                          className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-xs font-bold"
                        >+</button>
                      </div>
                    </div>

                    {/* 层格/侧柜发光单加 */}
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${mirrorConfig.smartShelfLight > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 truncate">层格/侧柜发光</div>
                        <div className="text-xs text-gray-400">¥100/个</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartShelfLight: Math.max(0, prev.smartShelfLight - 1) }))}
                          disabled={mirrorConfig.smartShelfLight <= 0}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer text-xs font-bold"
                        >−</button>
                        <span className="w-5 text-center text-xs font-medium text-blue-600">{mirrorConfig.smartShelfLight > 0 ? mirrorConfig.smartShelfLight : '-'}</span>
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartShelfLight: prev.smartShelfLight + 1 }))}
                          className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-xs font-bold"
                        >+</button>
                      </div>
                    </div>

                    {/* 玻璃门单加 */}
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${mirrorConfig.smartGlassDoor > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 truncate">玻璃门单加</div>
                        <div className="text-xs text-gray-400">¥200/扇</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartGlassDoor: Math.max(0, prev.smartGlassDoor - 1) }))}
                          disabled={mirrorConfig.smartGlassDoor <= 0}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer text-xs font-bold"
                        >−</button>
                        <span className="w-5 text-center text-xs font-medium text-blue-600">{mirrorConfig.smartGlassDoor > 0 ? mirrorConfig.smartGlassDoor : '-'}</span>
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartGlassDoor: prev.smartGlassDoor + 1 }))}
                          className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-xs font-bold"
                        >+</button>
                      </div>
                    </div>

                    {/* 铝合金门包边玻璃门单加 */}
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${mirrorConfig.smartAluGlassDoor > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 truncate">铝合金玻璃门</div>
                        <div className="text-xs text-gray-400">¥200/扇</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartAluGlassDoor: Math.max(0, prev.smartAluGlassDoor - 1) }))}
                          disabled={mirrorConfig.smartAluGlassDoor <= 0}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer text-xs font-bold"
                        >−</button>
                        <span className="w-5 text-center text-xs font-medium text-blue-600">{mirrorConfig.smartAluGlassDoor > 0 ? mirrorConfig.smartAluGlassDoor : '-'}</span>
                        <button
                          onClick={() => setMirrorConfig(prev => ({ ...prev, smartAluGlassDoor: prev.smartAluGlassDoor + 1 }))}
                          className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-xs font-bold"
                        >+</button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 配件小计 */}
              <div className="flex justify-end pt-3 border-t mt-3">
                <span className="text-sm text-gray-500">配件小计：</span>
                <span className="ml-2 text-lg font-bold text-orange-500">¥{accessoryPrice.toFixed(0)}</span>
              </div>
            </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部标题 + Tab 合并区域 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        {/* 标题 */}
        <div className="px-6 pt-4 pb-0">
          <h1 className="text-base font-bold text-gray-800">浴室柜配置器</h1>
          <p className="text-xs text-gray-400 mt-0.5">按需选配，实时算价</p>
        </div>
        
        {/* Tab */}
        <div className="flex px-6 mt-2">
          {([
            { id: 'cabinet', label: '主柜', emoji: '🗄️', done: cabinetPrice > 0 },
            { id: 'basin', label: '台盆', emoji: '🧽', done: basinPrice > 0 },
            { id: 'mirror', label: '浴室镜', emoji: '🪞', done: mirrorPrice > 0 },
            { id: 'packing', label: '包装', emoji: '📦', done: cabinetPrice > 0 || basinPrice > 0 || mirrorPrice > 0 },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : tab.done
                    ? 'border-transparent text-green-600'
                    : 'border-gray-200 text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {tab.done && (
                <span className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 配置内容 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'cabinet' && renderCabinet()}
        {activeTab === 'basin' && renderBasin()}
        {activeTab === 'mirror' && renderMirror()}
        {activeTab === 'packing' && renderPacking()}
      </div>

      {/* 底部价格栏 */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>主柜 ¥{cabinetPrice.toFixed(0)}</span>
              {addonPrice > 0 && <span>柜体增配 ¥{addonPrice.toFixed(0)}</span>}
              {extraPrice > 0 && <span>增配选项 ¥{extraPrice.toFixed(0)}</span>}
              {basinPrice > 0 && <span>台盆 ¥{basinPrice.toFixed(0)}</span>}
              {mirrorPrice > 0 && <span>镜面配置 ¥{mirrorPrice.toFixed(0)}</span>}
              {accessoryPrice > 0 && <span>配件增配 ¥{accessoryPrice.toFixed(0)}</span>}
              {packingPrice > 0 && <span>包装 ¥{packingPrice.toFixed(0)}</span>}
            </div>
            <div className="text-xs text-gray-400">
              {basinPrice === 0 && <><span className="text-gray-300">|</span><span className="ml-2">台盆待配置</span></>}
              {mirrorPrice === 0 && !mirrorConfig.mirrorType && <><span className="text-gray-300">|</span><span className="ml-2">浴室镜未选配</span></>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">组合总价</div>
            <div className="text-2xl font-bold text-orange-500">¥{totalPrice.toFixed(0)}</div>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer"
        >
          ✓ 加入报价车
        </button>
      </div>

      {/* ===== 计价规则 Tips 弹窗 ===== */}
      {showTips && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] px-4"
          onClick={() => setShowTips(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="text-lg">📋</span> 计价规则说明
              </h3>
              <button
                onClick={() => setShowTips(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >✕</button>
            </div>
            <div className="p-5 space-y-4">
              {/* 免漆板规则 */}
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <span>🪵</span> 免漆板
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between"><span>单价：</span><span className="font-medium">¥600 / 米</span></div>
                  <div className="flex justify-between"><span>最小计费长度：</span><span className="font-medium">800 mm</span></div>
                  <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                    <strong>计价公式：</strong>MAX(CEILING(输入长度, 100), 800) ÷ 1000 × 600
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    例：输入 850mm → 取整 900mm → 900÷1000×600 = <strong className="text-amber-600">¥540</strong>
                  </div>
                </div>
              </div>
              {/* 烤漆/实木类规则 */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <span>🪵</span> 烤漆板 / 实木类
                </div>
                <div className="text-sm text-gray-600">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-blue-100 rounded">
                          <th className="px-2 py-1.5 text-left rounded-l text-blue-700">木材类型</th>
                          <th className="px-2 py-1.5 text-center text-blue-700">单价(元/米)</th>
                          <th className="px-2 py-1.5 text-center text-blue-700">最小长度</th>
                          <th className="px-2 py-1.5 text-right rounded-r text-blue-700">计价公式</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-100">
                        {[
                          { name: '橡胶木', price: 1000 },
                          { name: '白蜡木/红橡木', price: 1300 },
                          { name: '乌金木', price: 1399 },
                          { name: '黑胡桃木', price: 1500 },
                          { name: '白橡直纹', price: 1600 },
                        ].map(item => (
                          <tr key={item.name} className="hover:bg-blue-100/50">
                            <td className="px-2 py-1.5 font-medium text-gray-700">{item.name}</td>
                            <td className="px-2 py-1.5 text-center text-orange-600 font-bold">{item.price}</td>
                            <td className="px-2 py-1.5 text-center">800mm</td>
                            <td className="px-2 py-1.5 text-right text-gray-500">
                              MAX(CEIL(长度,100),800)÷1000×{item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 border-t pt-2 space-y-1">
                    <div><strong>通用规则：</strong></div>
                    <div>1. 实际长度向上取整至 100 的倍数</div>
                    <div>2. 若不足 800mm 则按 800mm 计算</div>
                    <div>3. 最终价格 = <span className="font-mono bg-gray-100 px-1 rounded">取整后长度(mm) ÷ 1000 × 单价</span></div>
                  </div>
                  <div className="mt-2 text-xs text-blue-600 bg-blue-100 rounded p-2">
                    <strong>例：</strong>输入 950mm → 取整 1000mm → 1000÷1000×1000(橡胶木) = <strong>¥1000</strong>
                  </div>
                </div>
              </div>
              {/* 落地柜加价 */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <span>📦</span> 落地柜额外加价
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>落地柜在吊柜单价基础上加价：</div>
                  <ul className="list-disc list-inside text-xs space-y-0.5 ml-2">
                    <li>免漆板落地柜：¥850/米（吊柜 ¥600/米）</li>
                    <li>烤漆/实木落地柜：按各材质单价 × 1.1~1.3 倍（见上表落地柜栏目）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
