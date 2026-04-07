import { useState, useMemo } from 'react';
import type {
  QuoteItem, Category, SubCategory, StandardProduct, Region,
  ComboProduct, ComboComponent, ComboSelectedProduct, ComboQuoteItem,
} from '../types';
import {
  CATEGORIES, SAMPLE_PRODUCTS, SUPPLIERS, REGIONS,
  COMBO_PRODUCTS, COMBO_CATEGORY_LIST, COMBO_PRODUCTS_CATALOG,
} from '../data/categories';

interface Props {
  onSelect: (items: QuoteItem[], combos?: ComboQuoteItem[]) => void;
  onCancel: () => void;
}

// 交互步骤：选大类 → 选子类 → 产品列表+筛选 → 产品详情
// 新增：combo-type（选组合品类型）→ combo-config（配置组合品组件）
type Step = 'category' | 'subcategory' | 'combo-type' | 'combo-config' | 'list' | 'detail';

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  ceramic: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="8" height="8" rx="1" strokeWidth={1.5}/>
      <rect x="13" y="3" width="8" height="8" rx="1" strokeWidth={1.5}/>
      <rect x="3" y="13" width="8" height="8" rx="1" strokeWidth={1.5}/>
      <rect x="13" y="13" width="8" height="8" rx="1" strokeWidth={1.5}/>
    </svg>
  ),
  sanitary: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12h16M4 12c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v4H4v-4zM8 16v2M16 16v2" />
    </svg>
  ),
  furniture: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M5 10V6a1 1 0 011-1h12a1 1 0 011 1v4M5 14h14M5 14v4M19 14v4M7 18h10" />
    </svg>
  ),
  flooring: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v10M16 7v10" />
    </svg>
  ),
  lighting: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  stone: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

const COLOR_DOTS: Record<string, string> = {
  '白色': '#f9fafb', '米色': '#fef3c7', '灰色': '#9ca3af', '深灰': '#4b5563',
  '黑色': '#111827', '棕色': '#92400e', '木色': '#d97706', '蓝色': '#3b82f6',
  '绿色': '#059669', '米黄': '#fbbf24', '原木色': '#c47d3c', '浅灰': '#d1d5db',
  '哑白': '#f3f4f6', '红色': '#ef4444', '黄色': '#eab308', '金色': '#f59e0b',
  '银色': '#94a3b8', '铜色': '#b45309', '米白': '#fef9ee', '透明': '#e5e7eb',
  '木纹色': '#b5865a', '石纹色': '#a0a0a0', '素色': '#e8e8e8', '灰色调': '#9ca3af',
  '白色调': '#f3f4f6', '深色调': '#374151', '浅色': '#e5e7eb', '中色': '#c0a882', '深色': '#4a3728',
};

// 产品详情弹窗
function ProductDetailModal({
  product,
  category,
  subCategory,
  selectedItems,
  onAddToList,
  onClose,
}: {
  product: StandardProduct;
  category: Category;
  subCategory: SubCategory;
  selectedItems: QuoteItem[];
  onAddToList: (item: QuoteItem) => void;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(product.basePrice);
  const [margin, setMargin] = useState(30); // 利润率 %，默认30%
  const [remark, setRemark] = useState('');
  const [imgError, setImgError] = useState(false);
  const alreadyAdded = selectedItems.some(i => i.productId === product.id);
  // 售价 = 成本 / (1 - margin/100)，小计基于 unitPrice 和 quantity
  const subtotal = quantity * unitPrice;

  const handleAdd = () => {
    const item: QuoteItem = {
      id: `std_${Date.now()}_${Math.random()}`,
      type: 'standard',
      productId: product.id,
      libraryId: product.libraryId,
      supplierProductId: product.supplierProductId,
      productName: product.name,
      categoryName: category.name,
      subCategoryName: subCategory.name,
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
      basePrice: product.basePrice,
      unitPrice,
      margin: margin / 100,
      remark,
      imageUrl: product.imageUrl,
    };
    onAddToList(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{category.name} · {subCategory.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 产品图片 */}
          <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            {product.imageUrl && !imgError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-3"
                style={{ backgroundColor: COLOR_DOTS[product.color] || '#f3f4f6', width: '100%', height: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                <div className="text-gray-400 opacity-50">
                  {CATEGORY_ICONS[category.id]}
                </div>
                <span className="text-xs text-gray-400">暂无图片</span>
              </div>
            )}
          </div>

          {/* 产品属性标签 */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              <span>规格：{product.spec}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
              <span
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }}
              />
              <span>{product.color}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
              尺寸：{product.size}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
              MOQ：{product.moq} {product.unit}
            </span>
          </div>

          {/* 分割线 */}
          <div className="border-t border-gray-100" />

          {/* 报价配置 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">配置报价参数</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">数量（{product.unit}）</label>
                <input
                  type="number" min="1" className="input-field"
                  value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">单价（USD）</label>
                <input
                  type="number" min="0" step="0.01" className="input-field"
                  value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">利润率（%）</label>
                <input
                  type="number" min="0" max="100" className="input-field"
                  value={margin} onChange={e => setMargin(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">小计（USD）</label>
                <div className="input-field bg-gray-50 text-blue-700 font-bold text-base">
                  ${subtotal.toFixed(2)}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">备注（可选）</label>
                <input
                  type="text" className="input-field" placeholder="特殊要求、包装、认证等"
                  value={remark} onChange={e => setRemark(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between rounded-b-2xl">
          <div className="text-sm text-gray-500">
            参考价：<span className="font-semibold text-gray-800">${product.basePrice}</span>
            <span className="text-gray-400 ml-1">/ {product.unit}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary">取消</button>
            <button
              onClick={handleAdd}
              disabled={alreadyAdded}
              className={`btn-primary ${alreadyAdded ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {alreadyAdded ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已添加
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  加入选择列表
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 视图模式
type ViewMode = 'grid' | 'excel';

// 产品列表+筛选视图
function ProductListView({
  category,
  subCategory,
  selectedItems,
  onViewDetail,
  onQuickAdd,
  viewMode,
  onViewModeChange,
  activeRegionId,
  onRegionChange,
}: {
  category: Category;
  subCategory: SubCategory;
  selectedItems: QuoteItem[];
  onViewDetail: (p: StandardProduct) => void;
  onQuickAdd: (p: StandardProduct, regionId?: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  activeRegionId: string;
  onRegionChange: (id: string) => void;
}) {
  // 动态筛选状态：key → 选中值
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  // 供应商筛选
  const [supplierSearch, setSupplierSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // 该子类下的所有产品
  const allProducts = SAMPLE_PRODUCTS.filter(
    p => p.categoryId === category.id && p.subCategoryId === subCategory.id
  );

  // 过滤后的供应商列表（搜索）
  const filteredSuppliers = useMemo(() => {
    const q = supplierSearch.trim().toLowerCase();
    if (!q) return SUPPLIERS;
    return SUPPLIERS.filter(s => s.name.toLowerCase().includes(q) || s.tags?.some(t => t.includes(q)));
  }, [supplierSearch]);

  // 该子类出现过的供应商（只展示有产品的）
  const availableSupplierIds = useMemo(() => {
    return [...new Set(allProducts.map(p => p.supplierId).filter(Boolean))] as string[];
  }, [allProducts]);

  const availableSuppliers = SUPPLIERS.filter(s => availableSupplierIds.includes(s.id));

  // filterGroups 筛选 + 供应商筛选
  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      // 供应商过滤
      if (selectedSupplier && p.supplierId !== selectedSupplier) return false;
      // 动态属性过滤
      for (const [key, val] of Object.entries(activeFilters)) {
        if (!val) continue;
        if (key === 'spec' && p.spec !== val) return false;
        if (key === 'color' && p.color !== val) return false;
        if (key === 'size' && p.size !== val) return false;
        // 扩展属性
        if (p.attrs && key in p.attrs && p.attrs[key] !== val) return false;
        // 如果产品没有该 attrs key，视为不匹配（跳过有 attrs key 的组）
        if (!p.attrs && !['spec','color','size'].includes(key)) return false;
      }
      return true;
    });
  }, [allProducts, selectedSupplier, activeFilters]);

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSelectedSupplier('');
  };

  const hasFilter = selectedSupplier || Object.values(activeFilters).some(Boolean);

  const filterGroups = subCategory.filterGroups ?? [];

  const selectedSupplierInfo = selectedSupplier ? SUPPLIERS.find(s => s.id === selectedSupplier) : null;

  return (
    <div className="flex-1 space-y-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            {category.name} · {subCategory.name}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            共 {allProducts.length} 款产品
            {hasFilter && <span className="ml-1 text-blue-600">· 筛选后 {filtered.length} 款</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilter && (
            <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              清除筛选
            </button>
          )}
          {/* 视图切换 */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              title="卡片视图"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2}/>
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('excel')}
              title="表格视图"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'excel' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 4v16M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== 区域选择（按区域分隔） ===== */}
      <div className="card p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mr-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            添加到区域：
          </span>
          {REGIONS.map(r => (
            <button
              key={r.id}
              onClick={() => onRegionChange(activeRegionId === r.id ? '' : r.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                activeRegionId === r.id
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
              style={activeRegionId === r.id ? { backgroundColor: r.color, borderColor: r.color } : {}}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeRegionId === r.id ? 'rgba(255,255,255,0.7)' : (r.color || '#9ca3af') }}
              />
              {r.name}
            </button>
          ))}
          {activeRegionId && (
            <button onClick={() => onRegionChange('')} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {activeRegionId && (
          <p className="text-xs text-gray-400 mt-1.5 ml-1">
            当前"快速添加"将归入：
            <span className="font-semibold ml-1" style={{ color: REGIONS.find(r => r.id === activeRegionId)?.color }}>
              {REGIONS.find(r => r.id === activeRegionId)?.name}
            </span>
          </p>
        )}
      </div>

      {/* ===== 供应商搜索选择区 ===== */}
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
                onChange={e => { setSupplierSearch(e.target.value); setShowSupplierDropdown(true); }}
                onFocus={() => setShowSupplierDropdown(true)}
                onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 150)}
              />
            </div>
            {showSupplierDropdown && filteredSuppliers.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
                {filteredSuppliers.map(s => (
                  <button
                    key={s.id}
                    onMouseDown={() => {
                      setSelectedSupplier(s.id);
                      setSupplierSearch('');
                      setShowSupplierDropdown(false);
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
              onClick={() => setSelectedSupplier('')}
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
                onClick={() => setSelectedSupplier(selectedSupplier === s.id ? '' : s.id)}
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
                      <svg key={i} className="w-2 h-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 已选供应商信息栏 */}
        {selectedSupplierInfo && (
          <div className="mt-3 flex items-center gap-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-blue-800">{selectedSupplierInfo.name}</span>
              <span className="text-xs text-blue-500 ml-2">{selectedSupplierInfo.country}</span>
              {selectedSupplierInfo.tags && (
                <span className="ml-2 text-xs text-blue-400">{selectedSupplierInfo.tags.join(' · ')}</span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < selectedSupplierInfo.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <button onClick={() => setSelectedSupplier('')} className="text-blue-400 hover:text-blue-600 cursor-pointer ml-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ===== 专属筛选条件 ===== */}
      {filterGroups.length > 0 && (
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
      )}

      {/* 产品列表 */}
      {filtered.length === 0 ? (
        <div className="card p-10 flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">没有符合条件的产品</p>
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline cursor-pointer">清除筛选条件</button>
        </div>
      ) : viewMode === 'excel' ? (
        /* ===== Excel 表格视图 ===== */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">#</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">产品库ID</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">供应商产品ID</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">产品名称</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">规格</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">颜色</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">尺寸</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">单位</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">MOQ</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">参考价(USD)</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">供应商</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => {
                  const alreadyAdded = selectedItems.some(i => i.productId === product.id);
                  const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;
                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer ${alreadyAdded ? 'bg-green-50/40' : ''}`}
                      onClick={() => onViewDetail(product)}
                    >
                      <td className="px-3 py-2.5 text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                          {product.libraryId || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                          {product.supplierProductId || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {alreadyAdded && (
                            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{product.spec}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }} />
                          <span className="text-gray-600">{product.color}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{product.size}</td>
                      <td className="px-3 py-2.5 text-gray-500">{product.unit}</td>
                      <td className="px-3 py-2.5 text-gray-600">{product.moq}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-blue-700">${product.basePrice.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                        {supplier ? (
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[80px]">{supplier.name}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: Math.min(supplier.rating, 3) }).map((_, i) => (
                                <svg key={i} className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => { if (!alreadyAdded) onQuickAdd(product, activeRegionId || undefined); }}
                          disabled={alreadyAdded}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                            alreadyAdded
                              ? 'bg-green-100 text-green-600 cursor-default'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {alreadyAdded ? '已添加' : '+ 添加'}
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
        /* ===== 卡片视图（含区域分隔） ===== */
        (() => {
          // 按区域分组
          const regionGroups = REGIONS.map(r => ({
            region: r,
            products: filtered.filter(p => {
              const item = selectedItems.find(i => i.productId === p.id);
              return item?.regionId === r.id;
            }),
          })).filter(g => g.products.length > 0);

          const unregionedProducts = filtered.filter(p => {
            const item = selectedItems.find(i => i.productId === p.id);
            return !item || !item.regionId;
          });

          // 所有未归区域的产品放在一起，已归区域的按区域分隔展示
          return (
            <div className="space-y-6">
              {/* 未归区域的产品 */}
              {unregionedProducts.length > 0 && (
                <div>
                  {regionGroups.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                        未分区域
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs text-gray-400">{unregionedProducts.length} 款</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unregionedProducts.map(product => renderProductCard(product))}
                  </div>
                </div>
              )}

              {/* 按区域分组展示 */}
              {regionGroups.map(({ region, products }) => (
                <div key={region.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: region.color || '#9ca3af' }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {region.name}
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: region.color ? region.color + '30' : '#f3f4f6' }} />
                    <span className="text-xs text-gray-400">{products.length} 款</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => renderProductCard(product))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );

  // 渲染产品卡片（抽取为内部函数避免重复）
  function renderProductCard(product: StandardProduct) {
    const alreadyAdded = selectedItems.some(i => i.productId === product.id);
    const hasImgError = imgErrors[product.id];
    const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;
    const addedItem = selectedItems.find(i => i.productId === product.id);
    const addedRegion = addedItem?.regionId ? REGIONS.find(r => r.id === addedItem.regionId) : null;

    return (
      <div
        key={product.id}
        className="card overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onClick={() => onViewDetail(product)}
      >
        {/* 图片区域 */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          {product.imageUrl && !hasImgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: COLOR_DOTS[product.color] || '#f3f4f6' }}
            >
              <div className="text-gray-400 opacity-50">{CATEGORY_ICONS[category.id]}</div>
              <span className="text-xs text-gray-400">暂无图片</span>
            </div>
          )}

          {/* 已添加标记 + 区域标签 */}
          {alreadyAdded && (
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
              <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                已添加
              </div>
              {addedRegion && (
                <div
                  className="text-white text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: addedRegion.color }}
                >
                  {addedRegion.name}
                </div>
              )}
            </div>
          )}

          {/* 悬浮查看详情 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
              查看详情
            </span>
          </div>
        </div>

        {/* 产品信息 */}
        <div className="p-4">
          {/* 产品库ID / 供应商产品ID */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {product.libraryId && (
              <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                {product.libraryId}
              </span>
            )}
            {product.supplierProductId && (
              <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {product.supplierProductId}
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{product.name}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{product.spec}</span>
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-gray-300"
                style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }}
              />
              {product.color}
            </span>
            <span className="text-gray-400">{product.size}</span>
          </div>

          {/* 供应商标签 */}
          {supplier && (
            <div className="flex items-center gap-1 mb-2">
              <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs text-gray-500 truncate">{supplier.name}</span>
              <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
                {Array.from({ length: supplier.rating }).map((_, i) => (
                  <svg key={i} className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-base font-bold text-blue-700">${product.basePrice}</span>
              <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                if (!alreadyAdded) onQuickAdd(product, activeRegionId || undefined);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                alreadyAdded
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-blue-700 text-white hover:bg-blue-800'
              }`}
            >
              {alreadyAdded ? '已添加' : '快速添加'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ===== 组合品配置视图 =====
function ComboConfigView({
  comboProduct,
  onConfirm,
  onBack,
}: {
  comboProduct: ComboProduct;
  onConfirm: (item: ComboQuoteItem) => void;
  onBack: () => void;
}) {
  // 每个组件的选中产品和尺寸状态
  const [componentSelections, setComponentSelections] = useState<
    Record<string, { product: StandardProduct | null; dimensionValue: number; quantity: number; remark: string }>
  >(() => {
    const init: Record<string, { product: StandardProduct | null; dimensionValue: number; quantity: number; remark: string }> = {};
    for (const comp of comboProduct.components) {
      // 默认选中该组件子品类下第一款产品，尺寸为组件基础尺寸
      const defaultProduct = COMBO_PRODUCTS_CATALOG.find(p => p.subCategoryId === comp.subCategoryId) || null;
      init[comp.id] = {
        product: defaultProduct,
        dimensionValue: comp.baseWidth || comp.baseLength || 1,
        quantity: 1,
        remark: '',
      };
    }
    return init;
  });

  const [showComponentDetail, setShowComponentDetail] = useState<string | null>(null);

  // 计算当前组合品总价
  const totalPrice = useMemo(() => {
    let sum = 0;
    for (const comp of comboProduct.components) {
      const sel = componentSelections[comp.id];
      if (!sel?.product) continue;
      const { basePrice } = comp;
      const { dimensionValue } = sel;
      // 找到组件的基础尺寸
      const baseDim = comp.priceDimension === 'width'
        ? (comp.baseWidth || 1)
        : comp.priceDimension === 'length'
        ? (comp.baseLength || 1)
        : (comp.baseArea || 1);
      const ratio = dimensionValue / baseDim;
      sum += basePrice * ratio * sel.quantity;
    }
    return sum;
  }, [comboProduct.components, componentSelections]);

  const handleDimensionChange = (compId: string, value: number) => {
    setComponentSelections(prev => ({
      ...prev,
      [compId]: { ...prev[compId], dimensionValue: Math.max(1, value) },
    }));
  };

  const handleProductChange = (compId: string, product: StandardProduct) => {
    setComponentSelections(prev => ({
      ...prev,
      [compId]: {
        ...prev[compId],
        product,
        dimensionValue: product.width || product.length || prev[compId].dimensionValue,
      },
    }));
  };

  const handleQuantityChange = (compId: string, qty: number) => {
    setComponentSelections(prev => ({
      ...prev,
      [compId]: { ...prev[compId], quantity: Math.max(1, qty) },
    }));
  };

  // 构建 ComboQuoteItem
  const handleConfirm = () => {
    const components: ComboSelectedProduct[] = [];
    let allValid = true;
    for (const comp of comboProduct.components) {
      const sel = componentSelections[comp.id];
      if (!sel?.product) {
        allValid = false;
        break;
      }
      const baseDim = comp.priceDimension === 'width'
        ? (comp.baseWidth || 1)
        : comp.priceDimension === 'length'
        ? (comp.baseLength || 1)
        : (comp.baseArea || 1);
      const ratio = sel.dimensionValue / baseDim;
      const unitPrice = Math.round(comp.basePrice * ratio * 100) / 100;
      components.push({
        componentId: comp.id,
        productId: sel.product.id,
        libraryId: sel.product.libraryId,
        supplierProductId: sel.product.supplierProductId,
        productName: sel.product.name,
        length: sel.product.length,
        width: sel.product.width,
        dimensionValue: sel.dimensionValue,
        basePrice: sel.product.basePrice,
        unitPrice,
        quantity: sel.quantity,
        unit: sel.product.unit,
        remark: sel.remark,
      });
    }
    if (!allValid) return;
    const item: ComboQuoteItem = {
      id: `combo_${Date.now()}_${Math.random()}`,
      type: 'combo',
      comboProductId: comboProduct.id,
      comboName: comboProduct.name,
      imageUrl: comboProduct.imageUrl,
      components,
      totalPrice: Math.round(totalPrice * 100) / 100,
      margin: 0.3,
      remark: '',
    };
    onConfirm(item);
  };

  const dimensionLabel = (comp: ComboComponent) => {
    if (comp.priceDimension === 'width') return '宽度 (mm)';
    if (comp.priceDimension === 'length') return '长度 (mm)';
    return '计价尺寸';
  };

  const getDimensionValue = (comp: ComboComponent) => {
    if (comp.priceDimension === 'width') return comp.baseWidth || 1;
    if (comp.priceDimension === 'length') return comp.baseLength || 1;
    return comp.baseArea || 1;
  };

  const calcComponentPrice = (comp: ComboComponent) => {
    const sel = componentSelections[comp.id];
    if (!sel?.product) return 0;
    const baseDim = getDimensionValue(comp);
    const ratio = sel.dimensionValue / baseDim;
    return Math.round(comp.basePrice * ratio * sel.quantity * 100) / 100;
  };

  const [margin, setMargin] = useState(30);
  const finalPrice = totalPrice * (1 + margin / 100);

  return (
    <div className="space-y-5">
      {/* 组合品标题 */}
      <div className="flex items-center gap-4">
        {comboProduct.imageUrl && (
          <img
            src={comboProduct.imageUrl}
            alt={comboProduct.name}
            className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0"
          />
        )}
        <div>
          <h2 className="text-lg font-bold text-gray-900">{comboProduct.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{comboProduct.description}</p>
        </div>
      </div>

      {/* 组件配置列表 */}
      <div className="space-y-4">
        {comboProduct.components.map(comp => {
          const sel = componentSelections[comp.id];
          const compPrice = calcComponentPrice(comp);
          // 该子品类下的可选产品
          const availableProducts = COMBO_PRODUCTS_CATALOG.filter(p => p.subCategoryId === comp.subCategoryId);
          const showDetail = showComponentDetail === comp.id;

          return (
            <div key={comp.id} className="card border border-gray-100 overflow-hidden">
              {/* 组件头部 */}
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  sel?.product ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'
                }`}>
                  {sel?.product ? '✓' : '!'}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{comp.name}</span>
                  {comp.required && <span className="text-xs text-red-500 ml-2">* 必选</span>}
                  {!comp.required && <span className="text-xs text-gray-400 ml-2">可选</span>}
                </div>
                {sel?.product && (
                  <span className="text-sm font-bold text-blue-700">
                    ${compPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* 组件配置内容 */}
              <div className="p-5 space-y-4">
                {/* 产品选择 */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    选择产品
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {availableProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleProductChange(comp.id, product)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          sel?.product?.id === product.id
                            ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover bg-gray-100 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {product.spec} · {product.color}
                          </p>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">
                            ${product.basePrice}
                            {product.size && <span className="text-gray-400 font-normal">/{product.unit}</span>}
                          </p>
                        </div>
                        {sel?.product?.id === product.id && (
                          <div className="ml-auto flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 尺寸调整（按计价维度） */}
                {sel?.product && comp.baseWidth !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                        {dimensionLabel(comp)}（基础: {getDimensionValue(comp)}mm）
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="input-field"
                        value={sel.dimensionValue}
                        onChange={e => handleDimensionChange(comp.id, Number(e.target.value))}
                      />
                      {comp.baseWidth && sel.dimensionValue !== comp.baseWidth && (
                        <p className="text-[11px] text-blue-600 mt-1">
                          价格：${comp.basePrice}/m → ${Math.round(comp.basePrice * sel.dimensionValue / comp.baseWidth * 100) / 100}/ {sel.dimensionValue}mm
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1.5 block">数量</label>
                      <input
                        type="number"
                        min="1"
                        className="input-field"
                        value={sel.quantity}
                        onChange={e => handleQuantityChange(comp.id, Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                {/* 组件备注 */}
                {sel?.product && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">组件备注（可选）</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="如特殊颜色、开门方向等"
                      value={sel.remark}
                      onChange={e => setComponentSelections(prev => ({
                        ...prev,
                        [comp.id]: { ...prev[comp.id], remark: e.target.value },
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 汇总区域 */}
      <div className="card bg-blue-50 border border-blue-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">组合品总价</span>
          <span className="text-2xl font-bold text-blue-700">${totalPrice.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">利润率（%）</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="100"
              className="input-field max-w-24"
              value={margin}
              onChange={e => setMargin(Math.max(0, Math.min(100, Number(e.target.value))))}
            />
            <span className="text-sm text-gray-500">最终报价</span>
            <span className="text-xl font-bold text-gray-900">${finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <button onClick={handleConfirm} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          加入报价单
        </button>
      </div>
    </div>
  );
}

// ===== 组合品类型选择视图 =====
function ComboTypeView({
  category,
  onSelectCombo,
  onBack,
}: {
  category: Category;
  onSelectCombo: (comboProduct: ComboProduct) => void;
  onBack: () => void;
}) {
  const availableCombos = COMBO_PRODUCTS;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          {CATEGORY_ICONS[category.id]}
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">{category.name} · 定制品</h2>
          <p className="text-xs text-gray-500 mt-0.5">选择组合方案，定制专属产品</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableCombos.map(combo => (
          <button
            key={combo.id}
            onClick={() => onSelectCombo(combo)}
            className="card overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer text-left group border border-transparent"
          >
            {combo.imageUrl && (
              <div className="w-full h-36 overflow-hidden bg-gray-100">
                <img
                  src={combo.imageUrl}
                  alt={combo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-1">{combo.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{combo.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {combo.components.map(c => (
                  <span key={c.id} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    c.required ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.name}{c.required ? '' : '(选)'}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">包含 {combo.components.length} 个组件</span>
                <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
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
  );
}

export function ProductSelector({ onSelect, onCancel }: Props) {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [detailProduct, setDetailProduct] = useState<StandardProduct | null>(null);
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  // 组合品已选项
  const [selectedCombos, setSelectedCombos] = useState<ComboQuoteItem[]>([]);
  const [activeComboProduct, setActiveComboProduct] = useState<ComboProduct | null>(null);
  const [showSelectedPanel, setShowSelectedPanel] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeRegionId, setActiveRegionId] = useState<string>('');

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(null);
    setStep('subcategory');
  };

  const handleSelectSubCategory = (sub: SubCategory) => {
    setSelectedSubCategory(sub);
    // 如果选的是"定制品"，进入组合品类型选择
    if (sub.id === 'custom-combo') {
      setStep('combo-type');
    } else {
      setStep('list');
    }
  };

  const handleViewDetail = (product: StandardProduct) => {
    setDetailProduct(product);
    setStep('detail');
  };

  const handleQuickAdd = (product: StandardProduct, regionId?: string) => {
    if (!selectedCategory || !selectedSubCategory) return;
    if (selectedItems.some(i => i.productId === product.id)) return;
    const item: QuoteItem = {
      id: `std_${Date.now()}_${Math.random()}`,
      type: 'standard',
      productId: product.id,
      libraryId: product.libraryId,
      supplierProductId: product.supplierProductId,
      productName: product.name,
      categoryName: selectedCategory.name,
      subCategoryName: selectedSubCategory.name,
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
      margin: 0,
      regionId,
      imageUrl: product.imageUrl,
    };
    setSelectedItems(prev => [...prev, item]);
  };

  const handleAddFromDetail = (item: QuoteItem) => {
    setSelectedItems(prev => {
      if (prev.some(i => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
    setStep('list');
    setDetailProduct(null);
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

  const removeCombo = (id: string) => {
    setSelectedCombos(prev => prev.filter(i => i.id !== id));
  };

  const handleComboConfirm = (item: ComboQuoteItem) => {
    setSelectedCombos(prev => [...prev, item]);
    setStep('subcategory');
  };

  const handleConfirm = () => {
    if (selectedItems.length > 0 || selectedCombos.length > 0) {
      onSelect(selectedItems, selectedCombos);
    } else {
      onCancel();
    }
  };

  // 面包屑
  const breadcrumbs = [
    { label: '产品大类', active: step === 'category', onClick: () => setStep('category') },
    ...(selectedCategory ? [{
      label: selectedCategory.name,
      active: step === 'subcategory' || step === 'combo-type',
      onClick: () => { setStep('subcategory'); setSelectedSubCategory(null); }
    }] : []),
    ...(selectedSubCategory ? [{
      label: selectedSubCategory.name,
      active: step === 'list' || step === 'combo-type',
      onClick: () => {
        if (selectedSubCategory.id === 'custom-combo') setStep('combo-type');
        else setStep('list');
      }
    }] : []),
    ...(step === 'detail' && detailProduct ? [{ label: detailProduct.name, active: true, onClick: () => {} }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== 'category' ? (
              <button
                onClick={() => {
                  if (step === 'detail') { setStep('list'); setDetailProduct(null); }
                  else if (step === 'list') {
                    if (selectedSubCategory?.id === 'custom-combo') { setStep('combo-type'); }
                    else { setStep('subcategory'); setSelectedSubCategory(null); }
                  }
                  else if (step === 'combo-config') { setStep('combo-type'); }
                  else if (step === 'combo-type') { setStep('subcategory'); setSelectedSubCategory(null); }
                  else if (step === 'subcategory') { setStep('category'); setSelectedCategory(null); }
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">选择产品</h1>
              {/* 面包屑 */}
              <div className="flex items-center gap-1 mt-0.5">
                {breadcrumbs.map((bc, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                    <button
                      onClick={bc.onClick}
                      className={`text-xs transition-colors cursor-pointer ${bc.active ? 'text-blue-600 font-medium' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {bc.label}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 已选列表按钮 */}
            {(selectedItems.length > 0 || selectedCombos.length > 0) && (
              <button
                onClick={() => setShowSelectedPanel(!showSelectedPanel)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                已选 {selectedItems.length} 件
                {selectedCombos.length > 0 && <span className="text-orange-600"> + {selectedCombos.length} 组合</span>}
              </button>
            )}
            <button onClick={onCancel} className="btn-secondary">取消</button>
            <button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0 && selectedCombos.length === 0}
              className={`btn-primary ${selectedItems.length === 0 && selectedCombos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              加入报价单 ({selectedItems.length}{selectedCombos.length > 0 ? `+${selectedCombos.length}` : ''})
            </button>
          </div>
        </div>

        {/* 步骤进度条 */}
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <div className="flex items-center gap-2">
            {[
              { key: 'category', label: '① 选大类' },
              { key: 'subcategory', label: '② 选子类' },
              { key: 'combo-type', label: '③ 组合方案' },
              { key: 'combo-config', label: '④ 配置组件' },
              { key: 'list', label: '⑤ 产品列表' },
              { key: 'detail', label: '⑥ 产品详情' },
            ].map((s, i) => {
              const stepOrder = ['category', 'subcategory', 'combo-type', 'combo-config', 'list', 'detail'];
              const currentIdx = stepOrder.indexOf(step);
              const thisIdx = stepOrder.indexOf(s.key);
              const isDone = thisIdx < currentIdx;
              const isActive = s.key === step;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className={`h-px w-8 ${isDone || isActive ? 'bg-blue-400' : 'bg-gray-200'}`} />
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isDone
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* 已选产品面板（可折叠） */}
        {(selectedItems.length > 0 || selectedCombos.length > 0) && showSelectedPanel && (
          <div className="mb-5 card overflow-hidden border-green-200">
            <div className="px-5 py-3 bg-green-50 border-b border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-green-800">
                  已选产品 ({selectedItems.length})
                  {selectedCombos.length > 0 && <span className="text-orange-600"> + 组合品 {selectedCombos.length}</span>}
                </h3>
              </div>
              <button onClick={() => setShowSelectedPanel(false)} className="text-green-600 hover:text-green-800 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
              {/* 组合品 */}
              {selectedCombos.map(combo => (
                <div key={combo.id} className="px-5 py-3 flex items-center justify-between bg-orange-50/50">
                  <div className="flex items-center gap-3">
                    {combo.imageUrl && (
                      <img src={combo.imageUrl} alt={combo.comboName} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{combo.comboName}</p>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">组合</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {combo.components.length} 个组件
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-blue-700">${combo.totalPrice.toFixed(2)}</span>
                    <button onClick={() => removeCombo(combo.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {/* 标品 */}
              {selectedItems.map(item => (
                <div key={item.id} className="px-5 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.color} · {item.size} · {item.quantity} {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 步骤一：选择大类 */}
        {step === 'category' && (
          <div>
            <p className="text-sm text-gray-500 mb-5">选择产品大类，然后进入子品类浏览</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map(cat => {
                const count = SAMPLE_PRODUCTS.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className="card p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer group border border-transparent"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      {CATEGORY_ICONS[cat.id] || (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{count} 款产品</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 步骤二：选择子类 */}
        {step === 'subcategory' && selectedCategory && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                {CATEGORY_ICONS[selectedCategory.id]}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{selectedCategory.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">选择具体子品类查看产品列表</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedCategory.subCategories.map(sub => {
                const count = SAMPLE_PRODUCTS.filter(p => p.subCategoryId === sub.id).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubCategory(sub)}
                    className="card p-5 flex flex-col gap-2 text-left hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer border border-transparent group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">{sub.name}</span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">计量：{sub.unit}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {sub.colors.slice(0, 5).map(c => (
                        <span
                          key={c}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: COLOR_DOTS[c] || '#e5e7eb' }}
                          title={c}
                        />
                      ))}
                      {sub.colors.length > 5 && <span className="text-xs text-gray-400">+{sub.colors.length - 5}</span>}
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                      {count > 0 ? `${count} 款可选` : '暂无产品'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 步骤三：产品列表+筛选 */}
        {step === 'list' && selectedCategory && selectedSubCategory && (
          <ProductListView
            category={selectedCategory}
            subCategory={selectedSubCategory}
            selectedItems={selectedItems}
            onViewDetail={handleViewDetail}
            onQuickAdd={handleQuickAdd}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            activeRegionId={activeRegionId}
            onRegionChange={setActiveRegionId}
          />
        )}

        {/* 组合品类型选择 */}
        {step === 'combo-type' && selectedCategory && (
          <ComboTypeView
            category={selectedCategory}
            onSelectCombo={(combo) => {
              setActiveComboProduct(combo);
              setStep('combo-config');
            }}
            onBack={() => setStep('subcategory')}
          />
        )}

        {/* 组合品组件配置 */}
        {step === 'combo-config' && activeComboProduct && (
          <ComboConfigView
            comboProduct={activeComboProduct}
            onConfirm={handleComboConfirm}
            onBack={() => setStep('combo-type')}
          />
        )}
      </main>

      {/* 步骤四：产品详情弹窗 */}
      {step === 'detail' && detailProduct && selectedCategory && selectedSubCategory && (
        <ProductDetailModal
          product={detailProduct}
          category={selectedCategory}
          subCategory={selectedSubCategory}
          selectedItems={selectedItems}
          onAddToList={handleAddFromDetail}
          onClose={() => { setStep('list'); setDetailProduct(null); }}
        />
      )}
    </div>
  );
}
