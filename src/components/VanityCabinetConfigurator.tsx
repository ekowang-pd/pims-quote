import React, { useState, useMemo } from 'react';
import {
  VANITY_INSTALL_TYPES,
  VANITY_HANGING_CABINET_TYPES,
  VANITY_FLOOR_CABINET_TYPES,
  VANITY_CABINET_ADDONS,
  VANITY_EXTRA_ADDONS,
  VANITY_PACKING_ITEMS,
  VANITY_BASIN_TYPES,
  VANITY_BASIN_MATERIALS,
  VANITY_MIRROR_TYPES,
  VANITY_MIRROR_STYLES,
  getCabinetType,
  calcVanityCabinetPrice,
  calcVanityAddonPrice,
  calcVanityPackingPrice,
  calcVanityTotalPrice,
  createDefaultConfig,
} from '../data/vanityConfig';
import type { VanityCabinetConfig } from '../types';

type ComponentTab = 'cabinet' | 'basin' | 'mirror';

interface Props {
  onAddToCart?: (config: VanityCabinetConfig, totalPrice: number) => void;
}

const VANITY_CABINET_ADDONS_LIST = VANITY_CABINET_ADDONS;
const VANITY_EXTRA_ADDONS_LIST = VANITY_EXTRA_ADDONS;

export default function VanityCabinetConfigurator({ onAddToCart }: Props) {
  const [activeTab, setActiveTab] = useState<ComponentTab>('cabinet');

  // ===== 主柜状态 =====
  const [config, setConfig] = useState<VanityCabinetConfig>(createDefaultConfig());
  const [showTips, setShowTips] = useState(false);

  // ===== 台盆状态 =====
  const [basinType, setBasinType] = useState<string>('above');
  const [basinMaterial, setBasinMaterial] = useState<string>('yanban');
  const [basinLength, setBasinLength] = useState<number>(1000);

  // ===== 浴室镜状态 =====
  const [mirrorType, setMirrorType] = useState<string>('plain');
  const [mirrorStyle, setMirrorStyle] = useState<string>('single');
  const [mirrorLength, setMirrorLength] = useState<number>(800);

  // 当前柜型
  const currentCabinetType = useMemo(() => getCabinetType(config.cabinetType), [config.cabinetType]);

  // ===== 价格计算 =====
  const cabinetPrice = useMemo(() => calcVanityCabinetPrice(config), [config]);
  const addonPrice = useMemo(
    () => calcVanityAddonPrice({ ...config.cabinetAddons, ...config.extraAddons }),
    [config.cabinetAddons, config.extraAddons]
  );
  const packingPrice = useMemo(() => calcVanityPackingPrice(config.packingItems), [config.packingItems]);
  const totalPrice = useMemo(() => calcVanityTotalPrice(config), [config]);

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

  const toggleAddon = (
    addonId: string,
    group: 'cabinetAddons' | 'extraAddons'
  ) => {
    setConfig(prev => {
      const current = prev[group] || {};
      const next = { ...current };
      if (next[addonId]) {
        delete next[addonId];
      } else {
        next[addonId] = 1;
      }
      return { ...prev, [group]: next };
    });
  };

  const setAddonQty = (
    addonId: string,
    qty: number,
    group: 'cabinetAddons' | 'extraAddons'
  ) => {
    setConfig(prev => {
      const current = prev[group] || {};
      const next = { ...current };
      if (qty <= 0) {
        delete next[addonId];
      } else {
        next[addonId] = qty;
      }
      return { ...prev, [group]: next };
    });
  };

  const togglePacking = (packingId: string) => {
    setConfig(prev => {
      const current = prev.packingItems || {};
      const next = { ...current };
      if (next[packingId]) {
        delete next[packingId];
      } else {
        next[packingId] = 1;
      }
      return { ...prev, packingItems: next };
    });
  };

  const handleAddToCart = () => {
    onAddToCart?.(config, totalPrice);
  };

  // ===== 渲染：主柜配置 =====
  const renderCabinet = () => (
    <div className="space-y-4">
      {/* ===== 区块1: 主柜配置（安装类型+柜型+材质+长度） ===== */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
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
              type="number"
              value={config.cabinetLength}
              onChange={e => setConfig(prev => ({ ...prev, cabinetLength: Math.max(300, parseInt(e.target.value) || 300) }))}
              className="flex-1 max-w-32 px-4 py-2 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={300}
              max={3000}
              step={100}
            />
            <span className="text-sm text-gray-400">mm</span>
            <button
              onClick={() => setShowTips(true)}
              className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center hover:bg-amber-200 cursor-pointer"
              title="计价规则说明"
            >?</button>
          </div>
        )}
        {/* 主柜小计 */}
        <div className="flex justify-end pt-3 border-t mt-3">
          <span className="text-sm text-gray-500">小计：</span>
          <span className="ml-2 text-lg font-bold text-orange-500">¥{cabinetPrice.toFixed(0)}</span>
        </div>
      </section>

      {/* ===== 区块2: 柜体增配 ===== */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>⚙️</span> 柜体增配
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {VANITY_CABINET_ADDONS_LIST.map(addon => {
            const qty = config.cabinetAddons?.[addon.id] || 0;
            return (
              <div
                key={addon.id}
                className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                  qty > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                {/* 图片/图标 */}
                {'image' in addon && addon.image ? (
                  <img src={addon.image} alt={addon.label} className="w-8 h-8 object-contain rounded bg-gray-50 flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center text-sm bg-gray-50 rounded flex-shrink-0">{addon.icon || '🔧'}</div>
                )}
                {/* 名称+单价 */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-gray-700 truncate">{addon.label}</div>
                  <div className="text-[10px] text-gray-400">¥{addon.unitPrice}/{addon.unit}</div>
                </div>
                {/* 数量选择 */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => setAddonQty(addon.id, qty - 1, 'cabinetAddons')}
                    className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 cursor-pointer text-[10px]"
                  >−</button>
                  <span className="w-5 text-center text-[11px] font-medium text-blue-600">{qty || '-'}</span>
                  <button
                    onClick={() => setAddonQty(addon.id, qty + 1, 'cabinetAddons')}
                    className="w-5 h-5 rounded bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-[10px]"
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
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>✨</span> 增配选项
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {VANITY_EXTRA_ADDONS_LIST.map(addon => {
            const qty = config.extraAddons?.[addon.id] || 0;
            return (
              <div
                key={addon.id}
                className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                  qty > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                {/* 名称+单价 */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-gray-700 truncate">{addon.label}</div>
                  <div className="text-[10px] text-gray-400">
                    {addon.priceFormula ? `¥~` : `¥${addon.unitPrice}`}{addon.unit ? `/${addon.unit}` : ''}
                  </div>
                </div>
                {/* 数量选择 */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => setAddonQty(addon.id, qty - 1, 'extraAddons')}
                    className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 cursor-pointer text-[10px]"
                  >−</button>
                  <span className="w-5 text-center text-[11px] font-medium text-blue-600">{qty || '-'}</span>
                  <button
                    onClick={() => setAddonQty(addon.id, qty + 1, 'extraAddons')}
                    className="w-5 h-5 rounded bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer text-[10px]"
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

      {/* ===== 区块4: 包装 ===== */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>📦</span> 包装
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {VANITY_PACKING_ITEMS.map(item => {
            const selected = !!config.packingItems?.[item.id];
            return (
              <div
                key={item.id}
                onClick={() => togglePacking(item.id)}
                className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${
                  selected ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                  selected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {selected ? '✓' : '+'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-gray-700 truncate">{item.label}</div>
                  <div className="text-[10px] text-gray-400">¥{item.priceUnit}/m</div>
                </div>
              </div>
            );
          })}
        </div>
        {/* 小计 */}
        <div className="flex justify-end pt-3 border-t mt-3">
          <span className="text-sm text-gray-500">小计：</span>
          <span className="ml-2 text-base font-bold text-orange-500">¥{packingPrice.toFixed(0)}</span>
        </div>
      </section>
    </div>
  );

  // ===== 渲染：台盆配置 =====
  const renderBasin = () => (
    <div className="space-y-6 py-4">
      <div className="text-center text-gray-400 text-sm">
        <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        台盆配置（待开发）<br />
        <span className="text-xs">台上盆 / 台下盆 · 岩板 / 石英石 / 大理石 / 可丽耐</span>
      </div>
    </div>
  );

  // ===== 渲染：浴室镜配置 =====
  const renderMirror = () => (
    <div className="space-y-6 py-4">
      <div className="text-center text-gray-400 text-sm">
        <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        浴室镜配置（待开发）<br />
        <span className="text-xs">普通镜 / 智能镜 · 单镜 / 镜柜</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-800">浴室柜配置器</h1>
        <p className="text-xs text-gray-400 mt-0.5">按需选配，实时算价</p>
      </div>

      {/* 组件 Tab */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {([
            { id: 'cabinet', label: '主柜', emoji: '🗄️' },
            { id: 'basin', label: '台盆', emoji: '🧽' },
            { id: 'mirror', label: '浴室镜', emoji: '🪞' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 配置内容 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'cabinet' && renderCabinet()}
        {activeTab === 'basin' && renderBasin()}
        {activeTab === 'mirror' && renderMirror()}
      </div>

      {/* 底部价格栏 */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>主柜 ¥{cabinetPrice.toFixed(0)}</span>
              {addonPrice > 0 && <span>增配 ¥{addonPrice.toFixed(0)}</span>}
              {packingPrice > 0 && <span>包装 ¥{packingPrice.toFixed(0)}</span>}
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-gray-300">|</span>
              <span className="ml-2 text-gray-400">台盆待配置</span>
              <span className="text-gray-300">|</span>
              <span className="ml-2 text-gray-400">浴室镜待配置</span>
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
