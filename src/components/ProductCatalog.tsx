import { useState, useMemo, useEffect, useRef } from 'react';
import type { QuoteItem, StandardProduct, Category, SubCategory, ProductTag } from '../types';
import { SAMPLE_PRODUCTS, CATEGORIES, SUPPLIERS, COMBO_PRODUCTS, COMBO_PRODUCTS_CATALOG } from '../data/categories';
import type { ComboProduct, ComboQuoteItem } from '../types';

// 标签配置
const TAG_STYLES: Record<string, { bg: string; text: string; icon?: JSX.Element }> = {
  hot: { bg: 'bg-red-500', text: 'text-white' },
  recommend: { bg: 'bg-amber-500', text: 'text-white' },
  new: { bg: 'bg-emerald-500', text: 'text-white' },
  sale: { bg: 'bg-orange-500', text: 'text-white' },
  percent: { bg: 'bg-orange-600', text: 'text-white' },
  sample: { bg: 'bg-purple-600', text: 'text-white' },
  custom: { bg: 'bg-gray-500', text: 'text-white' },
};

function getTagLabel(tag: ProductTag): string {
  if (tag.type === 'custom' && tag.label) return tag.label;
  const labels: Record<string, string> = {
    hot: '热销', recommend: '推荐', new: '新品', sale: '特价',
    percent: '百分产品', sample: '展厅样板',
  };
  return labels[tag.type] || tag.type;
}

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  ceramic: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="8" height="8" rx="1" strokeWidth={1.5}/>
      <rect x="13" y="3" width="8" height="8" rx="1" strokeWidth={1.5}/>
      <rect x="3" y="13" width="8" height="8" rx="1" strokeWidth={1.5}/>
      <rect x="13" y="13" width="8" height="8" rx="1" strokeWidth={1.5}/>
    </svg>
  ),
  sanitary: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12h16M4 12c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v4H4v-4zM8 16v2M16 16v2" />
    </svg>
  ),
  furniture: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M5 10V6a1 1 0 011-1h12a1 1 0 011 1v4M5 14h14M5 14v4M19 14v4M7 18h10" />
    </svg>
  ),
  flooring: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v10M16 7v10" />
    </svg>
  ),
  lighting: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

const COLOR_DOTS: Record<string, string> = {
  '白色': '#f9fafb', '米色': '#fef3c7', '灰色': '#9ca3af', '深灰': '#4b5563',
  '黑色': '#111827', '棕色': '#92400e', '木色': '#d97706', '蓝色': '#3b82f6',
  '绿色': '#22c55e', '红色': '#ef4444', '黄色': '#eab308', '米白': '#fefce8',
  '灰白': '#f3f4f6', '米黄': '#fef9c3', '浅灰': '#e5e7eb', '深棕': '#78350f',
};

interface CartItem extends QuoteItem {}
interface Props {
  onAddToCart: (items: QuoteItem[]) => void;
}

// ===== 产品详情弹窗 =====
function ProductDetailModal({
  product,
  selectedItems,
  onAddToCart,
  onClose,
}: {
  product: StandardProduct;
  selectedItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [margin, setMargin] = useState(30);
  const [remark, setRemark] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supplierPrices = product.supplierPrices || [];
  const availableSuppliers = supplierPrices.length > 0
    ? supplierPrices
    : (product.supplierId ? [{ supplierId: product.supplierId, supplierProductId: product.supplierProductId, price: product.basePrice }] : []);

  const [selectedSupplierIdx, setSelectedSupplierIdx] = useState(0);
  const currentSupplier = availableSuppliers[selectedSupplierIdx];
  const unitPrice = currentSupplier?.price || product.basePrice;
  const subtotal = quantity * unitPrice;
  const alreadyAdded = selectedItems.some(i => i.productId === product.id);

  const handleAdd = () => {
    const cat = CATEGORIES.find(c => c.id === product.categoryId);
    const sub = cat?.subCategories.find(s => s.id === product.subCategoryId);

    const item: CartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      type: 'standard',
      productId: product.id,
      libraryId: product.libraryId,
      supplierProductId: currentSupplier?.supplierProductId || product.supplierProductId,
      productName: product.name,
      categoryName: cat?.name,
      subCategoryName: sub?.name,
      spec: product.spec,
      color: product.color,
      size: product.size,
      length: product.length,
      width: product.width,
      height: product.height,
      weight: product.weight,
      description: product.description,
      unit: product.unit,
      quantity,
      basePrice: currentSupplier?.price || product.basePrice,
      unitPrice: unitPrice * (1 + margin / 100),
      totalPrice: quantity * unitPrice * (1 + margin / 100),
      volume: product.length && product.width && product.height
        ? (product.length * product.width * product.height / 1000000000)
        : undefined,
      margin: margin / 100,
      remark,
      imageUrl: product.imageUrl,
    };

    onAddToCart(item);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isFullscreen ? '' : ''}`} style={{ backgroundColor: isFullscreen ? '#fff' : 'rgba(0,0,0,0.5)' }}>
      <div className={`bg-white shadow-2xl overflow-hidden flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl max-h-[90vh] rounded-2xl'}`}>
        {/* 标题栏 */}
        <div className="flex items-center justify-end px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* 展开全屏按钮 */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
              title={isFullscreen ? '退出全屏' : '展开全屏'}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 左图 + 右信息 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧：产品图片 */}
          <div className={`bg-gray-50 flex items-center justify-center p-6 border-r border-gray-100 ${isFullscreen ? 'w-1/2' : 'w-80 flex-shrink-0'}`}>
            {product.imageUrl && !imgError ? (
              <img src={product.imageUrl} alt={product.name} className="max-w-full object-contain" style={{ maxHeight: isFullscreen ? 'calc(100vh - 160px)' : '360px' }} onError={() => setImgError(true)} />
            ) : (
              <div className="w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-xl"
                style={{ backgroundColor: COLOR_DOTS[product.color] || '#f3f4f6' }}>
                <div className="text-gray-400 opacity-40">{CATEGORY_ICONS[product.categoryId]}</div>
                <span className="text-xs text-gray-400">暂无图片</span>
              </div>
            )}
          </div>

          {/* 右侧：产品信息 */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isFullscreen ? 'p-8' : 'p-6'}`}>
            {/* 1. 产品标题 + 型号 */}
            <div>
              <h2 className={`font-bold text-gray-900 leading-tight ${isFullscreen ? 'text-2xl' : 'text-xl'}`}>{product.name}</h2>
              {product.supplierProductId && (
                <p className="text-sm text-gray-500 mt-1">型号：{product.supplierProductId}</p>
              )}
            </div>

            {/* 2. 产品描述 */}
            {product.description && (
              <p className={`text-gray-600 leading-relaxed ${isFullscreen ? 'text-base' : 'text-sm'}`}>{product.description}</p>
            )}

            {/* 3. 产品标签 */}
            <div className="flex flex-wrap gap-2">
              {product.libraryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full font-mono">{product.libraryId}</span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">规格：{product.spec}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }} />
                {product.color}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">尺寸：{product.size}</span>
              {product.length && product.width && product.height && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{product.length}×{product.width}×{product.height}mm</span>
              )}
              {product.weight && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">重量：{product.weight}kg</span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">单位：{product.unit}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">MOQ：{currentSupplier?.moq || product.moq}</span>
            </div>

            {/* 4. 供应商信息 */}
            <div className="pt-2 border-t border-gray-100">
              {availableSuppliers.length > 1 ? (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">选择供应商</h3>
                  <div className="space-y-2">
                    {availableSuppliers.map((sp, idx) => {
                      const supplier = SUPPLIERS.find(s => s.id === sp.supplierId);
                      return (
                        <button key={sp.supplierId} onClick={() => setSelectedSupplierIdx(idx)}
                          className={`w-full p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${selectedSupplierIdx === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{supplier?.name || '未知供应商'}</div>
                              {sp.supplierProductId && <div className="text-xs text-gray-500 mt-0.5">货号: {sp.supplierProductId}</div>}
                              {sp.leadTime && <div className="text-xs text-gray-400 mt-0.5">交期: {sp.leadTime}</div>}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-700">${sp.price.toFixed(2)}</div>
                              <div className="text-xs text-gray-400">/ {product.unit}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : currentSupplier ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">供应商：</span>
                    <span className="text-sm font-semibold text-gray-900">{SUPPLIERS.find(s => s.id === currentSupplier.supplierId)?.name || '默认供应商'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-700">${unitPrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">/{product.unit}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 下方：配置报价参数 */}
        <div className="border-t border-gray-100 p-6 flex-shrink-0 bg-gray-50/30">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">配置报价参数</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">数量（{product.unit}）</label>
              <input type="number" min="1" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">利润率（%）</label>
              <input type="number" min="0" max="200" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={margin} onChange={e => setMargin(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">供货单价（USD）</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-700">${unitPrice.toFixed(2)} / {product.unit}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">售价（USD）</label>
              <div className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-blue-50 text-blue-700 font-bold">${(unitPrice * (1 + margin / 100)).toFixed(2)} / {product.unit}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">小计（USD）</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-blue-700 font-bold">${subtotal.toFixed(2)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">MOQ</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-700">{currentSupplier?.moq || product.moq} {product.unit}</div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">备注（可选）</label>
              <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="特殊要求、包装、认证等"
                value={remark} onChange={e => setRemark(e.target.value)} />
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-500">参考价：<span className="font-semibold text-gray-800">${product.basePrice}</span><span className="text-gray-400 ml-1">/ {product.unit}</span></div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">取消</button>
            <button onClick={handleAdd} disabled={alreadyAdded}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${alreadyAdded ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              {alreadyAdded ? (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>已添加</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>加入报价车</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 紧凑筛选条（JD风格）=====
function FilterBar({
  availableSuppliers,
  selectedSupplier,
  supplierSearch,
  onSupplierChange,
  onSearchChange,
  filterGroups,
  activeFilters,
  onFilterChange,
  hasFilter,
}: {
  availableSuppliers: typeof SUPPLIERS;
  selectedSupplier: string;
  supplierSearch: string;
  onSupplierChange: (id: string) => void;
  onSearchChange: (q: string) => void;
  filterGroups: SubCategory['filterGroups'];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, val: string) => void;
  hasFilter: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name'>('default');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const selectedSupplierInfo = selectedSupplier ? SUPPLIERS.find(s => s.id === selectedSupplier) : null;

  const toggleFilter = (key: string, val: string) => {
    onFilterChange(key, activeFilters[key] === val ? '' : val);
  };

  // 常见筛选项：每个筛选项组最多显示前3个选项
  const COMMON_MAX = 3;
  const commonGroups = filterGroups.slice(0, 2); // 前2个组常见
  const moreGroups = filterGroups.slice(2); // 第3个组起算"更多"
  const hasMoreFilters = moreGroups.length > 0 || filterGroups.some(g => g.options.length > COMMON_MAX);

  // 收集当前已选中的筛选项
  const activeFilterTags: { key: string; label: string; val: string }[] = [];
  filterGroups.forEach(g => {
    if (activeFilters[g.key]) {
      const opt = g.options.find(o => o.value === activeFilters[g.key]);
      activeFilterTags.push({ key: g.key, label: g.label, val: opt?.label ?? activeFilters[g.key] });
    }
  });

  const renderFilterGroupRow = (group: typeof filterGroups[0], showAll: boolean) => (
    <div key={group.key} className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-14 flex-shrink-0">{group.label}</span>
      <div className="flex flex-wrap gap-1.5">
        {(showAll ? group.options : group.options.slice(0, COMMON_MAX)).map(opt => {
          const isActive = activeFilters[group.key] === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => toggleFilter(group.key, opt.value)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : group.type === 'color'
                    ? 'border-gray-200 hover:border-gray-400 text-gray-700'
                    : 'border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600'
              }`}
              style={!isActive && group.type === 'color' && opt.colorHex ? { borderColor: opt.colorHex, backgroundColor: opt.colorHex + '15' } : {}}
            >
              {group.type === 'color' && opt.colorHex && (
                <span className="inline-block w-2.5 h-2.5 rounded-full mr-1 ring-1 ring-gray-200" style={{ backgroundColor: opt.colorHex }} />
              )}
              {opt.label}
            </button>
          );
        })}
        {!showAll && group.options.length > COMMON_MAX && (
          <button
            onClick={() => setExpanded(true)}
            className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 cursor-pointer"
          >
            更多
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* 第一行：供应商 + 常见筛选项平铺 + 更多按钮 + 已选标签 + 清除 */}
      <div className="px-6 py-2.5 flex items-center gap-2 flex-wrap">
        {/* 供应商下拉 */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              selectedSupplier ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {selectedSupplierInfo ? selectedSupplierInfo.name : '全部供应商'}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute z-30 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg w-64">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                    placeholder="搜索供应商..."
                    value={supplierSearch}
                    onChange={e => { onSearchChange(e.target.value); }}
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto py-1">
                <button
                  onMouseDown={() => { onSupplierChange(''); setShowDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 text-xs transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className={`font-medium ${!selectedSupplier ? 'text-blue-600' : 'text-gray-700'}`}>全部供应商</span>
                </button>
                {availableSuppliers
                  .filter(s => !supplierSearch || s.name.toLowerCase().includes(supplierSearch.toLowerCase()))
                  .map(s => (
                    <button
                      key={s.id}
                      onMouseDown={() => { onSupplierChange(s.id); setShowDropdown(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-xs transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${selectedSupplier === s.id ? 'text-blue-600' : 'text-gray-700'}`}>{s.name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-2 h-2 ${i < s.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {s.tags && s.tags.length > 0 && (
                        <div className="flex gap-1 mt-0.5">
                          {s.tags.map(t => (
                            <span key={t} className="px-1 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded">{t}</span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 常见筛选项（第一行平铺） */}
        {commonGroups.map(g => (
          <div key={g.key} className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">{g.label}：</span>
            {g.options.slice(0, COMMON_MAX).map(opt => {
              const isActive = activeFilters[g.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleFilter(g.key, opt.value)}
                  className={`px-2 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
            {g.options.length > COMMON_MAX && (
              <button
                onClick={() => setExpanded(true)}
                className="px-1.5 py-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                更多↓
              </button>
            )}
          </div>
        ))}

        {/* 更多筛选按钮 */}
        {hasMoreFilters && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              expanded ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {expanded ? '收起' : '更多筛选'}
            <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* 已选标签 */}
        {activeFilterTags.map(tag => (
          <span key={tag.key} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
            {tag.label}：{tag.val}
            <button
              onClick={() => toggleFilter(tag.key, activeFilters[tag.key])}
              className="hover:text-blue-900 cursor-pointer ml-0.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}

        {/* 清除筛选 */}
        {hasFilter && (
          <button
            onClick={() => { onSupplierChange(''); onFilterChange('', ''); onSearchChange(''); setSortBy('default'); setPriceMin(''); setPriceMax(''); }}
            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 cursor-pointer ml-auto"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            清除筛选
          </button>
        )}
      </div>

      {/* 展开的筛选面板：更多筛选项 + 排序 + 价格区间 */}
      {expanded && (
        <div className="px-6 pb-3 border-t border-gray-100 pt-3 space-y-2.5">
          {/* 更多筛选项（从第3组起） */}
          {moreGroups.map(g => renderFilterGroupRow(g, true))}

          {/* 第1-2组显示全部 */}
          {filterGroups.slice(0, 2).map(g => (
            g.options.length > COMMON_MAX ? renderFilterGroupRow(g, true) : null
          ))}

          {/* 排序 + 价格区间 */}
          <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
            {/* 排序 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">排序：</span>
              <div className="flex gap-1">
                {[
                  { key: 'default', label: '默认' },
                  { key: 'price_asc', label: '价格↑' },
                  { key: 'price_desc', label: '价格↓' },
                  { key: 'name', label: '名称' },
                ].map(o => (
                  <button
                    key={o.key}
                    onClick={() => setSortBy(o.key as typeof sortBy)}
                    className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer transition-colors ${
                      sortBy === o.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 价格区间 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">价格区间：</span>
              <input
                type="number"
                placeholder="最低价"
                className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="最高价"
                className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
              />
              <button
                onClick={() => { setPriceMin(''); setPriceMax(''); }}
                className="text-xs text-gray-400 hover:text-red-500 cursor-pointer"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== 供应商搜索选择区 =====  (与 ProductSelector 统一)
function SupplierFilterPanel({
  availableSuppliers,
  filteredSuppliers,
  selectedSupplier,
  supplierSearch,
  onSupplierChange,
  onSearchChange,
}: {
  availableSuppliers: typeof SUPPLIERS;
  filteredSuppliers: typeof SUPPLIERS;
  selectedSupplier: string;
  supplierSearch: string;
  onSupplierChange: (id: string) => void;
  onSearchChange: (q: string) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedSupplierInfo = selectedSupplier ? SUPPLIERS.find(s => s.id === selectedSupplier) : null;

  return (
    <div className="card p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-3">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        供应商
      </h3>

      <div className="flex items-start gap-3">
        {/* 搜索框 + 下拉 */}
        <div className="relative flex-1 max-w-xs">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="搜索供应商名称..."
              value={supplierSearch}
              onChange={e => { onSearchChange(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
          </div>
          {showDropdown && filteredSuppliers.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
              {filteredSuppliers.map(s => (
                <button
                  key={s.id}
                  onMouseDown={() => {
                    onSupplierChange(s.id);
                    onSearchChange('');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-800">{s.name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-2.5 h-2.5 ${i < s.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {s.tags && s.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {s.tags.map(t => (
                        <span key={t} className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 快捷选择：该品类有产品的供应商 */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          <button
            onClick={() => onSupplierChange('')}
            className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              !selectedSupplier
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
            }`}
          >
            全部供应商
          </button>
          {availableSuppliers.map(s => (
            <button
              key={s.id}
              onClick={() => onSupplierChange(selectedSupplier === s.id ? '' : s.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                selectedSupplier === s.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
              }`}
            >
              {s.name}
              {selectedSupplier !== s.id && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: s.rating }).map((_, i) => (
                    <svg key={i} className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 属性筛选卡片 =====  (与 ProductSelector 统一)
function FilterGroupsCard({
  filterGroups,
  activeFilters,
  onFilterChange,
}: {
  filterGroups: SubCategory['filterGroups'];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, val: string) => void;
}) {
  const toggleFilter = (key: string, val: string) => {
    onFilterChange(key, activeFilters[key] === val ? '' : val);
  };

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        筛选条件
      </h3>

      {filterGroups.map(group => (
        <div key={group.key} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-16 flex-shrink-0">{group.label}</span>
          <div className="flex flex-wrap gap-1.5">
            {group.type === 'color' ? (
              group.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleFilter(group.key, opt.value)}
                  title={opt.label}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    activeFilters[group.key] === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-400 text-gray-600'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: opt.colorHex || COLOR_DOTS[opt.value] || '#e5e7eb' }}
                  />
                  {opt.label}
                </button>
              ))
            ) : (
              group.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleFilter(group.key, opt.value)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    activeFilters[group.key] === opt.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== 产品库主视图 =====
export function ProductCatalog({ onAddToCart }: Props) {
  // 默认展开第一个大类的第一个子类
  const defaultCategory = CATEGORIES[0];
  const defaultSubCategory = defaultCategory?.subCategories[0] ?? null;

  const [activeCategory, setActiveCategory] = useState<Category>(defaultCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory | null>(defaultSubCategory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [imageSearchFile, setImageSearchFile] = useState<File | null>(null);
  const [imageSearchPreview, setImageSearchPreview] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StandardProduct | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'excel'>('grid');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([defaultCategory?.id]));
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // 定制品（组合品）相关状态
  type CatalogMode = 'list' | 'detail' | 'combo-type' | 'combo-config';
  const [catalogMode, setCatalogMode] = useState<CatalogMode>('list');
  const [activeComboProduct, setActiveComboProduct] = useState<ComboProduct | null>(null);
  // 组件选择状态：componentId -> ComboSelectedProduct
  const [selectedComponents, setSelectedComponents] = useState<Record<string, import('../types').ComboSelectedProduct>>({});

  // 选产品
  const handleSelectComponentProduct = (comp: import('../types').ComboComponent, product: StandardProduct) => {
    const dimensionValue = comp.priceDimension === 'width' ? product.width :
                          comp.priceDimension === 'length' ? product.length :
                          (product.length && product.width ? (product.length * product.width / 1_000_000) : 1);
    setSelectedComponents(prev => ({
      ...prev,
      [comp.id]: {
        componentId: comp.id,
        productId: product.id,
        libraryId: product.libraryId,
        supplierProductId: product.supplierProductId,
        productName: product.name,
        length: product.length,
        width: product.width,
        dimensionValue: dimensionValue,
        basePrice: product.basePrice,
        unitPrice: product.basePrice,
        quantity: 1,
        unit: product.unit,
      }
    }));
  };

  // 填尺寸（计价维度）
  const handleDimensionChange = (componentId: string, value: number) => {
    setSelectedComponents(prev => {
      const sel = prev[componentId];
      if (!sel) return prev;
      const ratio = value / (sel.dimensionValue || 1);
      return { ...prev, [componentId]: { ...sel, dimensionValue: value, unitPrice: Math.round(sel.basePrice * ratio * 100) / 100 } };
    });
  };

  // 取消选择
  const handleDeselectComponent = (componentId: string) => {
    setSelectedComponents(prev => {
      const next = { ...prev };
      delete next[componentId];
      return next;
    });
  };

  // 计算总价
  const comboTotalPrice = useMemo(() => {
    return Object.values(selectedComponents).reduce((sum, c) => sum + c.unitPrice * c.quantity, 0);
  }, [selectedComponents]);

  // 能否加入报价车：所有必选组件都已选
  const canAddToCart = useMemo(() => {
    if (!activeComboProduct) return false;
    return activeComboProduct.components.every(c => !c.required || selectedComponents[c.id]);
  }, [activeComboProduct, selectedComponents]);

  // 加入报价车
  const handleAddComboToCart = () => {
    if (!activeComboProduct || !canAddToCart) return;
    const comboItem: import('../types').ComboQuoteItem = {
      id: `combo-${Date.now()}`,
      type: 'combo',
      comboProductId: activeComboProduct.id,
      comboName: activeComboProduct.name,
      imageUrl: activeComboProduct.imageUrl,
      components: Object.values(selectedComponents),
      totalPrice: comboTotalPrice,
      margin: 0,
    };
    onAddToCart([comboItem]);
    setSelectedComponents({});
    setCatalogMode('combo-type');
    setActiveComboProduct(null);
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleSelectSubCategory = (cat: Category, sub: SubCategory) => {
    setActiveCategory(cat);
    setActiveSubCategory(sub);
    setSelectedSupplier('');
    setActiveFilters({});
    if (sub.id === 'custom-combo') {
      setCatalogMode('combo-type');
    } else {
      setCatalogMode('list');
    }
  };

  const allProducts = useMemo(() => {
    if (!activeSubCategory) return [];
    return SAMPLE_PRODUCTS.filter(
      p => p && p.categoryId === activeCategory.id && p.subCategoryId === activeSubCategory.id
    );
  }, [activeCategory, activeSubCategory]);

  const filteredProducts = useMemo(() => {
    if (searchKeyword.trim()) {
      const q = searchKeyword.trim().toLowerCase();
      return SAMPLE_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.spec || '').toLowerCase().includes(q) ||
        (p.color || '').toLowerCase().includes(q) ||
        (p.libraryId || '').toLowerCase().includes(q) ||
        (p.supplierProductId || '').toLowerCase().includes(q)
      );
    }
    return allProducts.filter(p => {
      if (selectedSupplier && p.supplierId !== selectedSupplier) return false;
      for (const [key, val] of Object.entries(activeFilters)) {
        if (!val) continue;
        if (key === 'spec' && p.spec !== val) return false;
        if (key === 'color' && p.color !== val) return false;
        if (key === 'size' && p.size !== val) return false;
        if (p.attrs && key in p.attrs && p.attrs[key] !== val) return false;
        if (!p.attrs && !['spec', 'color', 'size'].includes(key)) return false;
      }
      return true;
    });
  }, [allProducts, selectedSupplier, activeFilters, searchKeyword]);

  // 以图搜图
  const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSearchFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageSearchPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
      // TODO: 这里可以调用以图搜图的 API
      console.log('图片搜索文件:', file.name);
    }
  };

  const clearImageSearch = () => {
    setImageSearchFile(null);
    setImageSearchPreview('');
  };

  const handleAddSingleToCart = (item: CartItem) => {
    if (cartItems.some(i => i.productId === item.productId)) return;
    setCartItems(prev => [...prev, item]);
  };

  const handleQuickAddToCart = (product: StandardProduct) => {
    if (cartItems.some(i => i.productId === product.id)) return;
    const cat = CATEGORIES.find(c => c.id === product.categoryId);
    const sub = cat?.subCategories.find(s => s.id === product.subCategoryId);
    const item: CartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      type: 'standard',
      productId: product.id,
      libraryId: product.libraryId,
      supplierProductId: product.supplierProductId,
      productName: product.name,
      categoryName: cat?.name,
      subCategoryName: sub?.name,
      spec: product.spec,
      color: product.color,
      size: product.size,
      length: product.length,
      width: product.width,
      height: product.height,
      weight: product.weight,
      description: product.description,
      unit: product.unit,
      quantity: 1,
      basePrice: product.basePrice,
      unitPrice: product.basePrice,
      totalPrice: product.basePrice,
      margin: 0,
      imageUrl: product.imageUrl,
    };
    setCartItems(prev => [...prev, item]);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty, totalPrice: qty * i.unitPrice } : i));
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const hasFilter = selectedSupplier || Object.values(activeFilters).some(Boolean);
  const isSearching = searchKeyword.trim().length > 0;

  // 供应商相关计算
  const [supplierSearch, setSupplierSearch] = useState('');
  const availableSupplierIds = useMemo(() =>
    [...new Set(allProducts.map(p => p.supplierId).filter(Boolean))] as string[], [allProducts]);
  const availableSuppliers = useMemo(() =>
    SUPPLIERS.filter(s => availableSupplierIds.includes(s.id)), [availableSupplierIds]);
  const filteredSuppliers = useMemo(() => {
    const q = supplierSearch.trim().toLowerCase();
    return q ? availableSuppliers.filter(s => s.name.toLowerCase().includes(q) || s.tags?.some(t => t.includes(q))) : availableSuppliers;
  }, [supplierSearch, availableSuppliers]);

  const filterGroups = activeSubCategory?.filterGroups ?? [];

  // 点击外部关闭弹窗
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!showCart) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (cartButtonRef.current && !cartButtonRef.current.contains(e.target as Node)) {
        // 检查是否点击的是弹窗内部
        const popover = document.getElementById('cart-popover');
        if (popover && !popover.contains(e.target as Node)) {
          setShowCart(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCart]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
      {/* 搜索 + 购物车工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        {/* 搜索框区域（整合以图搜图） */}
        <div className="flex-1 max-w-xl relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="搜索产品名称、规格、颜色、编号..."
            className="w-full pl-10 pr-24 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {/* 搜索框内右侧按钮：清除/以图搜图 */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchKeyword ? (
              <button onClick={() => setSearchKeyword('')} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}
            {imageSearchFile ? (
              <>
                <img src={imageSearchPreview} alt="搜索图片" className="w-6 h-6 object-cover rounded" title="图片搜索中" />
                <button onClick={clearImageSearch} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer" title="清除图片搜索">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <label className="p-1.5 text-gray-400 hover:text-blue-600 cursor-pointer" title="以图搜图">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="file" accept="image/*" onChange={handleImageSearch} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* 清除筛选按钮 */}
          {hasFilter && (
            <button
              onClick={() => { setSelectedSupplier(''); setActiveFilters({}); setSupplierSearch(''); }}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              清除筛选
            </button>
          )}

          {/* 视图切换 */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2}/>
              </svg>
            </button>
            <button onClick={() => setViewMode('excel')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'excel' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 4v16M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/>
              </svg>
            </button>
          </div>

          {/* 购物车按钮 */}
          <button ref={cartButtonRef} onClick={() => setShowCart(!showCart)}
            className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            报价车
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 筛选区（非搜索模式下展示，JD风格紧凑筛选条） */}
      {!isSearching && activeSubCategory && (
        <FilterBar
          availableSuppliers={availableSuppliers}
          selectedSupplier={selectedSupplier}
          supplierSearch={supplierSearch}
          onSupplierChange={setSelectedSupplier}
          onSearchChange={setSupplierSearch}
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={(key, val) => setActiveFilters(prev => ({ ...prev, [key]: val }))}
          hasFilter={hasFilter}
        />
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 左侧分类导航（非搜索模式下展示） */}
        {!isSearching && (
          <aside className="w-52 bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
            <div className="py-2">
              {CATEGORIES.map(cat => (
                <div key={cat.id}>
                  {/* 大类标题（可折叠） */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-gray-500 group-hover:text-blue-600 transition-colors ${activeCategory.id === cat.id ? 'text-blue-600' : ''}`}>
                        {CATEGORY_ICONS[cat.id]}
                      </span>
                      <span className={`text-sm font-semibold ${activeCategory.id === cat.id ? 'text-blue-700' : 'text-gray-800'}`}>{cat.name}</span>
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedCategories.has(cat.id) ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* 子类列表 */}
                  {expandedCategories.has(cat.id) && (
                    <div className="pb-1">
                      {cat.subCategories.map(sub => {
                        const isActive = activeCategory.id === cat.id && activeSubCategory?.id === sub.id;
                        const isCombo = sub.id === 'custom-combo';
                        const count = isCombo ? COMBO_PRODUCTS.length : SAMPLE_PRODUCTS.filter(p => p.categoryId === cat.id && p.subCategoryId === sub.id).length;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelectSubCategory(cat, sub)}
                            className={`w-full flex items-center justify-between pl-10 pr-4 py-2 text-left transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                          >
                            <span className="text-xs font-medium truncate flex items-center gap-1">
                              {sub.name}
                              {isCombo && (
                                <span className="text-[9px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded font-medium">定制</span>
                              )}
                            </span>
                            <span className={`text-[10px] flex-shrink-0 ml-1 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{count || ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* 右侧产品内容 */}
        <main className="flex-1 overflow-y-auto p-5">

          {/* ===== 定制品：组合品类型选择 ===== */}
          {catalogMode === 'combo-type' && activeCategory && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  {CATEGORY_ICONS[activeCategory.id]}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">{activeCategory.name} · 定制品</h2>
                  <p className="text-xs text-gray-500 mt-0.5">选择组合方案，定制专属产品</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMBO_PRODUCTS.map(combo => (
                  <button
                    key={combo.id}
                    onClick={() => { setActiveComboProduct(combo); setCatalogMode('combo-config'); }}
                    className="card overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer text-left group border border-transparent"
                  >
                    {combo.imageUrl && (
                      <div className="w-full h-36 overflow-hidden bg-gray-100">
                        <img src={combo.imageUrl} alt={combo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{combo.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">{combo.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {combo.components.map(c => (
                          <span key={c.id} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.required ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                            {c.name}{c.required ? '' : '(选)'}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">包含 {combo.components.length} 个组件</span>
                        <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
                          配置方案
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== 定制品：组合品配置（只读展示，产品库不直接配价） ===== */}
          {catalogMode === 'combo-config' && activeComboProduct && (
            <div>
              {/* 面包屑 */}
              <div className="flex items-center gap-2 mb-5">
                <button onClick={() => setCatalogMode('combo-type')} className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  定制品
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-semibold text-gray-800">{activeComboProduct.name}</span>
              </div>

              {/* 组合品标题 */}
              <div className="flex items-start gap-4 mb-6">
                {activeComboProduct.imageUrl && (
                  <img src={activeComboProduct.imageUrl} alt={activeComboProduct.name} className="w-32 h-32 object-cover rounded-xl flex-shrink-0" />
                )}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{activeComboProduct.name}</h2>
                  <p className="text-sm text-gray-500 mb-3">{activeComboProduct.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeComboProduct.components.map(c => (
                      <span key={c.id} className={`text-xs px-2 py-1 rounded-full font-medium ${c.required ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-500'}`}>
                        {c.name}{c.required ? '' : ' (可选)'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 组件明细列表 */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3">组件明细</h3>
              <div className="space-y-3">
                {activeComboProduct.components.map(comp => {
                  const sel = selectedComponents[comp.id];
                  const compProducts = COMBO_PRODUCTS_CATALOG.filter(p => p.subCategoryId === comp.subCategoryId);
                  const dimLabel = comp.priceDimension === 'width' ? '宽度(mm)' : comp.priceDimension === 'length' ? '长度(mm)' : '面积(m²)';
                  return (
                  <div key={comp.id} className={`card p-4 ${sel ? 'border-2 border-blue-200 bg-blue-50/30' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${comp.required ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                          {comp.required ? '必选' : '可选'}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{comp.name}</span>
                      </div>
                      {sel && (
                        <button onClick={() => handleDeselectComponent(comp.id)}
                          className="text-xs text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          取消选择
                        </button>
                      )}
                    </div>

                    {/* 已选择的产品 */}
                    {sel && (
                      <div className="mb-3 p-3 bg-white rounded-lg border border-blue-100">
                        <div className="flex items-start gap-3">
                          {compProducts.find(p => p.id === sel.productId)?.imageUrl && (
                            <img src={compProducts.find(p => p.id === sel.productId)!.imageUrl} alt={sel.productName}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{sel.productName}</p>
                            <p className="text-xs text-gray-500">单价 $ {sel.basePrice} / {sel.unit}</p>
                            {/* 尺寸调节 */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">{dimLabel}：</span>
                              <input type="number" value={sel.dimensionValue}
                                onChange={e => handleDimensionChange(comp.id, Number(e.target.value))}
                                className="w-24 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-400" />
                              <span className="text-xs text-gray-400">基准 {comp.priceDimension === 'width' ? comp.baseWidth : comp.priceDimension === 'length' ? comp.baseLength : comp.baseArea}</span>
                            </div>
                            <p className="text-sm font-bold text-blue-700 mt-1">小计：${(sel.unitPrice * sel.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 该组件下的可选产品 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {compProducts.map(p => {
                        const isSelected = sel?.productId === p.id;
                        const supplier = SUPPLIERS.find(s => s.id === p.supplierId);
                        return (
                          <div key={p.id}
                            onClick={() => handleSelectComponentProduct(comp, p)}
                            className={`relative border rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-300' : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm'}`}>
                            {/* 产品图片 - 固定16:10比例 */}
                            <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-xs text-gray-400">暂无图片</span>
                                </div>
                              )}
                              {/* 选中角标 */}
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {/* 产品信息 */}
                            <div className="p-2">
                              {/* 规格/颜色/尺寸标签 */}
                              <div className="flex flex-wrap gap-0.5 mb-1">
                                {p.spec && <span className="px-1 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">{p.spec}</span>}
                                {p.color && (
                                  <span className="flex items-center gap-0.5 px-1 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                                    <span className="w-2 h-2 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: COLOR_DOTS[p.color] || '#e5e7eb' }} />
                                    {p.color}
                                  </span>
                                )}
                                {p.size && <span className="px-1 py-0.5 bg-blue-50 rounded text-[10px] text-blue-600 font-medium">{p.size}</span>}
                              </div>
                              <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">{p.name}</p>
                              {supplier && <p className="text-[10px] text-gray-400 truncate mb-1.5">{supplier.name}</p>}
                              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                                <div>
                                  <span className="text-xs font-bold text-blue-700">${p.basePrice.toFixed(2)}</span>
                                  <span className="text-[10px] text-gray-400 ml-0.5">/{p.unit}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* 报价汇总 */}
              {Object.keys(selectedComponents).length > 0 && (
                <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">已选组件</span>
                    <span className="text-sm font-semibold text-gray-700">{Object.keys(selectedComponents).length} / {activeComboProduct.components.length}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-bold text-gray-900">组合总价</span>
                    <span className="text-xl font-bold text-blue-700">${comboTotalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleAddComboToCart}
                    disabled={!canAddToCart}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                      canAddToCart
                        ? 'bg-blue-700 text-white hover:bg-blue-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}>
                    {canAddToCart ? '✓ 加入报价车' : '请先完成必选组件'}
                  </button>
                </div>
              )}

              {/* 提示 */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500">
                <p>💡 组件价格按{activeComboProduct.components[0]?.priceDimension === 'width' ? '宽度比例' : activeComboProduct.components[0]?.priceDimension === 'length' ? '长度比例' : '面积比例'}自动调整。调整尺寸后单价会按比例变化。</p>
              </div>
            </div>
          )}

          {/* ===== 普通产品列表模式 ===== */}
          {catalogMode === 'list' && (
          <>
          {/* 标题行 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {isSearching ? (
                <>
                  <h2 className="text-base font-bold text-gray-900">搜索结果</h2>
                  <p className="text-xs text-gray-500 mt-0.5">找到 {filteredProducts.length} 款产品</p>
                </>
              ) : activeSubCategory ? (
                <>
                  <h2 className="text-base font-bold text-gray-900">{activeCategory.name} · {activeSubCategory.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    共 {allProducts.length} 款产品
                    {hasFilter && <span className="ml-1 text-blue-600">· 筛选后 {filteredProducts.length} 款</span>}
                  </p>
                </>
              ) : (
                <h2 className="text-base font-bold text-gray-900">请选择子类</h2>
              )}
            </div>
          </div>

          {/* 产品列表 */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
              <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-base font-medium text-gray-500">未找到匹配的产品</p>
              <p className="text-sm text-gray-400">试试调整筛选条件或换个子类</p>
            </div>
          ) : viewMode === 'excel' ? (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">#</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">产品库ID</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">产品名称</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">规格</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">颜色</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">尺寸</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">供应商</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">参考价(USD)</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, idx) => {
                      const inCart = cartItems.some(i => i.productId === product.id);
                      const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;
                      return (
                        <tr key={product.id}
                          className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer ${inCart ? 'bg-green-50/40' : ''}`}
                          onClick={() => setSelectedProduct(product)}>
                          <td className="px-3 py-2.5 text-gray-400">{idx + 1}</td>
                          <td className="px-3 py-2.5">
                            <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">{product.libraryId || '-'}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {inCart && <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                              <span className="font-medium text-gray-900">{product.name}</span>
                              {product.seriesName && (
                                <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-100">{product.seriesName}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-gray-600">{product.spec}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }} />
                              <span className="text-gray-600">{product.color}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{product.size}</td>
                          <td className="px-3 py-2.5 text-gray-500">{supplier?.name || '-'}</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-blue-700">${product.basePrice.toFixed(2)}</td>
                          <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                            <button onClick={() => !inCart && handleQuickAddToCart(product)} disabled={inCart}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${inCart ? 'bg-green-100 text-green-600 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                              {inCart ? '已添加' : '+ 添加'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map(product => {
                const inCart = cartItems.some(i => i.productId === product.id);
                const hasImgError = imgErrors[product.id];
                const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;
                const cat = CATEGORIES.find(c => c.id === product.categoryId);
                return (
                  <div key={product.id}
                    className="card overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
                    onClick={() => setSelectedProduct(product)}>
                    <div className="relative bg-gray-100">
                      {product.imageUrl && !hasImgError ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full object-contain"
                          style={{ maxHeight: '180px' }}
                          onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))} />
                      ) : (
                        <div className="w-full aspect-square flex flex-col items-center justify-center gap-1" style={{ backgroundColor: COLOR_DOTS[product.color] || '#f3f4f6' }}>
                          <div className="text-gray-400 opacity-40">{cat ? CATEGORY_ICONS[cat.id] : null}</div>
                          <span className="text-[10px] text-gray-400">暂无图片</span>
                        </div>
                      )}
                      {inCart && (
                        <div className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          已添加
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-gray-800 text-[10px] font-medium px-2 py-1 rounded-full shadow-md">查看详情</span>
                      </div>
                    </div>
                    <div className="p-2">
                      {/* 三级系列名 + 供应商产品ID */}
                      <div className="flex items-center gap-1 mb-1 flex-wrap">
                        {product.seriesName && (
                          <span className="text-[9px] font-medium text-teal-700 bg-teal-50 px-1 py-0.5 rounded border border-teal-100">
                            {product.seriesName}
                          </span>
                        )}
                        {product.supplierProductId && (
                          <span className="font-mono text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded truncate max-w-[90px]">
                            {product.supplierProductId}
                          </span>
                        )}
                        {/* JD风格标签：百分产品、展厅样板 */}
                        {product.tags?.slice(0, 1).map((tag, idx) => {
                          const style = TAG_STYLES[tag.type] || TAG_STYLES.custom;
                          return (
                            <span key={idx} className={`${style.bg} ${style.text} text-[9px] px-1 py-0.5 rounded-sm font-medium`}>
                              {getTagLabel(tag)}
                            </span>
                          );
                        })}
                      </div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1 leading-snug line-clamp-2">{product.name}</h4>
                      {/* 规格/颜色/尺寸标签 */}
                      <div className="flex flex-wrap gap-0.5 mb-1">
                        {product.spec && <span className="px-1 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">{product.spec}</span>}
                        {product.color && (
                          <span className="flex items-center gap-0.5 px-1 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                            <span className="w-2 h-2 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }} />
                            {product.color}
                          </span>
                        )}
                        {product.size && (
                          <span className="px-1 py-0.5 bg-blue-50 rounded text-[10px] text-blue-600 font-medium">{product.size}</span>
                        )}
                      </div>
                      {supplier && <p className="text-[10px] text-gray-400 mb-1 truncate">{supplier.name}</p>}
                      <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                        <div>
                          <span className="text-xs font-bold text-blue-700">${product.basePrice.toFixed(2)}</span>
                          <span className="text-[10px] text-gray-400 ml-0.5">/{product.unit}</span>
                        </div>
                        <button onClick={e => { e.stopPropagation(); if (!inCart) handleQuickAddToCart(product); }}
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded-md transition-colors cursor-pointer ${inCart ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-700 text-white hover:bg-blue-800'}`}>
                          {inCart ? '✓ 已加' : '+ 加入'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </>
          )}
        </main>
      </div>

      {/* 底部报价车浮动栏（弹窗打开时隐藏） */}
      {cartItems.length > 0 && !showCart && (
        <div className="bg-white border-t border-gray-200 shadow-lg z-20">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">已选 <span className="font-bold text-gray-900">{cartItems.length}</span> 款产品</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">合计 <span className="font-bold text-blue-700">${cartTotal.toFixed(2)}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCart(true)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">查看清单</button>
              <button onClick={() => onAddToCart(cartItems)} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                生成报价单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 报价车气泡弹窗 */}
      {showCart && (
        <div
          id="cart-popover"
          className="absolute right-6 top-full mt-2 w-[420px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col"
        >
          {/* 气泡尖角 */}
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45" />
          {/* 头部 */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
            <h3 className="text-sm font-semibold text-gray-800">已选产品 <span className="text-blue-600">({cartItems.length})</span></h3>
            <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* 产品列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cartItems.map(item => (
              <div key={item.productId} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.productName}</p>
                  <p className="text-[10px] text-gray-500">{item.spec} · {item.color}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-blue-600">${item.unitPrice.toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center cursor-pointer text-xs">−</button>
                      <span className="w-6 text-center text-xs">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center cursor-pointer text-xs">+</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleRemoveFromCart(item.productId)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {/* 底部操作栏 */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">合计</span>
              <span className="text-base font-bold text-blue-700">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCart(false)} className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                继续选品
              </button>
              <button onClick={() => { onAddToCart(cartItems); setShowCart(false); }}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                生成报价单
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} selectedItems={cartItems}
          onAddToCart={handleAddSingleToCart} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
