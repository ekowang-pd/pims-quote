import { useState, useMemo } from 'react';
import type {
  QuoteItem, Category, SubCategory, StandardProduct, ProductTag,
  ComboProduct, ComboComponent, ComboSelectedProduct, ComboQuoteItem,
} from '../types';
import {
  CATEGORIES, SAMPLE_PRODUCTS, SUPPLIERS,
  COMBO_PRODUCTS, COMBO_PRODUCTS_CATALOG,
} from '../data/categories';

interface Props {
  onSelect: (items: QuoteItem[], combos?: ComboQuoteItem[]) => void;
  onCancel: () => void;
}

// 标签配置
const TAG_STYLES: Record<string, { bg: string; text: string; icon?: JSX.Element }> = {
  hot: {
    bg: 'bg-red-500',
    text: 'text-white',
    icon: (
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
  },
  recommend: {
    bg: 'bg-amber-500',
    text: 'text-white',
    icon: (
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  new: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    icon: (
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  sale: {
    bg: 'bg-orange-500',
    text: 'text-white',
    icon: (
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
      </svg>
    ),
  },
  percent: {
    bg: 'bg-orange-600',
    text: 'text-white',
    icon: (
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 10-4 4 2 2 0 004 4zM4 12a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 10-4 4 2 2 0 004-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  sample: {
    bg: 'bg-purple-600',
    text: 'text-white',
    icon: (
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  custom: {
    bg: 'bg-gray-500',
    text: 'text-white',
  },
};

function getTagLabel(tag: ProductTag): string {
  if (tag.type === 'custom' && tag.label) return tag.label;
  const labels: Record<string, string> = {
    hot: '热销',
    recommend: '推荐',
    new: '新品',
    sale: '特价',
    percent: '百分产品',
    sample: '展厅样板',
  };
  return labels[tag.type] || tag.type;
}

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
}: {
  category: Category;
  subCategory: SubCategory;
  selectedItems: QuoteItem[];
  onViewDetail: (p: StandardProduct) => void;
  onQuickAdd: (p: StandardProduct) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
}) {
  // 动态筛选状态：key → 选中值
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  // 供应商筛选
  const [supplierSearch, setSupplierSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name'>('default');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
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
    setSortBy('default');
    setPriceMin('');
    setPriceMax('');
  };

  const hasFilter = selectedSupplier || supplierSearch || showSupplierDropdown || Object.values(activeFilters).some(Boolean);

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

      {/* ===== JD风格筛选条 ===== */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 space-y-2">
        {/* 第一行：供应商 + 筛选开关 + 清除 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 供应商下拉 */}
          <div className="relative">
            <button
              onClick={() => setShowSupplierDropdown(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                selectedSupplier ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{selectedSupplier ? (SUPPLIERS.find(s => s.id === selectedSupplier)?.name ?? '供应商') : '供应商'}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showSupplierDropdown && (
              <div className="absolute z-30 top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      autoFocus
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                      placeholder="搜索供应商..."
                      value={supplierSearch}
                      onChange={e => { setSupplierSearch(e.target.value); }}
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedSupplier(''); setSupplierSearch(''); setShowSupplierDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 border-b border-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-gray-700">全部供应商</span>
                    <span className="text-gray-400 ml-1">({allProducts.length}款)</span>
                  </button>
                  {filteredSuppliers.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSupplier(s.id); setSupplierSearch(''); setShowSupplierDropdown(false); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-800">{s.name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-2 h-2 ${i < s.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-gray-400">{s.country}</span>
                        {s.tags?.map(t => <span key={t} className="text-[10px] text-gray-400">{t}</span>)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 筛选按钮 */}
          <button
            onClick={() => setFilterExpanded(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              filterExpanded ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {filterExpanded ? '收起' : '筛选'}
            {hasFilter && !filterExpanded && (
              <span className="bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {Object.values(activeFilters).filter(Boolean).length + (selectedSupplier ? 1 : 0)}
              </span>
            )}
          </button>

          {/* 已选标签 */}
          {hasFilter && (
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedSupplier && (
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg">
                  {SUPPLIERS.find(s => s.id === selectedSupplier)?.name}
                  <button onClick={() => setSelectedSupplier('')} className="cursor-pointer ml-0.5 hover:text-blue-900">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {Object.entries(activeFilters).filter(([, v]) => v).map(([key, val]) => (
                <span key={key} className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg">
                  {val}
                  <button onClick={() => setActiveFilters(prev => ({ ...prev, [key]: '' }))} className="cursor-pointer ml-0.5 hover:text-blue-900">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer ml-1">
                清除筛选
              </button>
            </div>
          )}
        </div>

        {/* 展开：筛选组 + 排序 + 价格区间 */}
        {filterExpanded && (
          <div className="border-t border-gray-100 pt-2.5 space-y-2.5">
            {/* 筛选组 */}
            {filterGroups.map(group => (
              <div key={group.key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-12 flex-shrink-0">{group.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {group.type === 'color' ? (
                    group.options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => toggleFilter(group.key, opt.value)}
                        title={opt.label}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
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

            {/* 排序 + 价格区间 */}
            <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
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
                        sortBy === o.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">价格：</span>
                <input
                  type="number"
                  placeholder="最低"
                  className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-400"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="最高"
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
                          onClick={() => { if (!alreadyAdded) onQuickAdd(product); }}
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
        /* ===== 卡片视图 ===== */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(product => renderProductCard(product))}
        </div>
      )}
    </div>
  );

  // 渲染产品卡片（抽取为内部函数避免重复）
  function renderProductCard(product: StandardProduct) {
    const alreadyAdded = selectedItems.some(i => i.productId === product.id);
    const hasImgError = imgErrors[product.id];
    const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;

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

          {/* 标签区域 */}
          {product.tags && product.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.tags.map((tag, idx) => {
                const style = TAG_STYLES[tag.type] || TAG_STYLES.custom;
                return (
                  <div
                    key={idx}
                    className={`${style.bg} ${style.text} text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm`}
                  >
                    {style.icon}
                    <span className="font-medium">{getTagLabel(tag)}</span>
                    {tag.quoteCount !== undefined && (
                      <span className="text-white/80">×{tag.quoteCount}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 已添加标记 */}
          {alreadyAdded && (
            <div className="absolute top-2 right-2">
              <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                已添加
              </div>
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

          {/* 供应商信息 */}
          <div className="flex items-center gap-2 mb-2">
            {supplier && (
              <>
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs text-gray-500 truncate flex-1">{supplier.name}</span>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: supplier.rating }).map((_, i) => (
                    <svg key={i} className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </>
            )}
            {/* 报价引用次数 */}
            {product.tags?.some(t => t.quoteCount !== undefined) && (
              <div className="flex items-center gap-0.5 text-xs text-orange-500 flex-shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>
                  {product.tags?.find(t => t.quoteCount !== undefined)?.quoteCount}次引用
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-base font-bold text-blue-700">${product.basePrice}</span>
              <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                if (!alreadyAdded) onQuickAdd(product);
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

// ===== 全局搜索结果视图 =====
function SearchResultView({
  keyword,
  selectedItems,
  onViewDetail,
  onQuickAdd,
  viewMode,
  onViewModeChange,
}: {
  keyword: string;
  selectedItems: QuoteItem[];
  onViewDetail: (p: StandardProduct, cat: Category, sub: SubCategory) => void;
  onQuickAdd: (p: StandardProduct, cat: Category, sub: SubCategory) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
}) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // 跨所有类别搜索
  const results = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];
    return SAMPLE_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.spec || '').toLowerCase().includes(q) ||
      (p.color || '').toLowerCase().includes(q) ||
      (p.libraryId || '').toLowerCase().includes(q) ||
      (p.supplierProductId || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    ).map(p => {
      const cat = CATEGORIES.find(c => c.id === p.categoryId);
      const sub = cat?.subCategories.find(s => s.id === p.subCategoryId);
      return { product: p, cat, sub };
    }).filter(r => r.cat && r.sub) as { product: StandardProduct; cat: Category; sub: SubCategory }[];
  }, [keyword]);

  if (!keyword.trim()) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
        <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-sm">输入关键词搜索产品</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
        <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">未找到与 <span className="text-gray-700 font-medium">"{keyword}"</span> 相关的产品</p>
        <p className="text-xs text-gray-400">试试产品名称、规格、颜色或产品编号</p>
      </div>
    );
  }

  // 按大类分组
  const grouped = results.reduce<Record<string, { cat: Category; items: typeof results }>>((acc, r) => {
    if (!acc[r.cat.id]) acc[r.cat.id] = { cat: r.cat, items: [] };
    acc[r.cat.id].items.push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* 结果统计 + 视图切换 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            找到 <span className="font-bold text-blue-600">{results.length}</span> 款产品
            <span className="text-gray-400 ml-1">匹配 "{keyword}"</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            涉及 {Object.keys(grouped).length} 个品类
          </p>
        </div>
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

      {/* 按大类分组展示 */}
      {Object.values(grouped).map(({ cat, items }) => (
        <div key={cat.id}>
          {/* 分类分隔线 */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              {CATEGORY_ICONS[cat.id]}
            </div>
            <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">{items.length} 款</span>
          </div>

          {viewMode === 'excel' ? (
            /* 表格视图 */
            <div className="card overflow-hidden mb-2">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">#</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">产品库ID</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">产品名称</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">子类</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">规格</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">颜色</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">尺寸</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">参考价(USD)</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-gray-600 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product, cat: c, sub }, idx) => {
                      const alreadyAdded = selectedItems.some(i => i.productId === product.id);
                      const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;
                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer ${alreadyAdded ? 'bg-green-50/40' : ''}`}
                          onClick={() => onViewDetail(product, c, sub)}
                        >
                          <td className="px-3 py-2.5 text-gray-400">{idx + 1}</td>
                          <td className="px-3 py-2.5">
                            <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                              {product.libraryId || '-'}
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
                          <td className="px-3 py-2.5">
                            <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">{sub.name}</span>
                          </td>
                          <td className="px-3 py-2.5 text-gray-600">{product.spec}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }} />
                              <span className="text-gray-600">{product.color}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{product.size}</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-blue-700">${product.basePrice.toFixed(2)}</td>
                          <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => { if (!alreadyAdded) onQuickAdd(product, c, sub); }}
                              disabled={alreadyAdded}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                                alreadyAdded ? 'bg-green-100 text-green-600 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
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
            /* 卡片视图 */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-2">
              {items.map(({ product, cat: c, sub }) => {
                const alreadyAdded = selectedItems.some(i => i.productId === product.id);
                const hasImgError = imgErrors[product.id];
                const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;
                return (
                  <div
                    key={product.id}
                    className="card overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => onViewDetail(product, c, sub)}
                  >
                    {/* 图片区域 */}
                    <div className="relative bg-gray-100">
                      {product.imageUrl && !hasImgError ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full object-contain"
                          style={{ maxHeight: '180px' }}
                          onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                        />
                      ) : (
                        <div className="w-full aspect-square flex flex-col items-center justify-center gap-1"
                          style={{ backgroundColor: COLOR_DOTS[product.color] || '#f3f4f6' }}>
                          <div className="text-gray-400 opacity-40">{CATEGORY_ICONS[c.id]}</div>
                          <span className="text-[10px] text-gray-400">暂无图片</span>
                        </div>
                      )}
                      {alreadyAdded && (
                        <div className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          已添加
                        </div>
                      )}
                      {/* 子类标签 */}
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className="text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                          {sub.name}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-gray-800 text-[10px] font-medium px-2 py-1 rounded-full shadow-md">查看详情</span>
                      </div>
                    </div>
                    {/* 产品信息 */}
                    <div className="p-2">
                      <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                        {product.libraryId && (
                          <span className="font-mono text-[9px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-100">{product.libraryId}</span>
                        )}
                        {/* JD风格标签：百分产品、展厅样板 */}
                        {product.tags?.slice(0, 2).map((tag, idx) => {
                          const style = TAG_STYLES[tag.type] || TAG_STYLES.custom;
                          return (
                            <span key={idx} className={`${style.bg} ${style.text} text-[9px] px-1 py-0.5 rounded-sm font-medium`}>
                              {getTagLabel(tag)}
                            </span>
                          );
                        })}
                      </div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-0.5 truncate">{product.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                        <span className="px-1 py-0.5 bg-gray-100 rounded">{product.spec}</span>
                        <span className="flex items-center gap-0.5">
                          <span className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }} />
                          {product.color}
                        </span>
                      </div>
                      {supplier && (
                        <p className="text-[10px] text-gray-400 mb-1 truncate">{supplier.name}</p>
                      )}
                      <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                        <div>
                          <span className="text-xs font-bold text-blue-700">${product.basePrice}</span>
                          <span className="text-[10px] text-gray-400 ml-0.5">/ {product.unit}</span>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); if (!alreadyAdded) onQuickAdd(product, c, sub); }}
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded-md transition-colors cursor-pointer ${
                            alreadyAdded ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-700 text-white hover:bg-blue-800'
                          }`}
                        >
                          {alreadyAdded ? '已添加' : '+ 添加'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
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
  // 左侧导航状态
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    // 默认展开第一个分类
    return CATEGORIES.length > 0 ? { [CATEGORIES[0].id]: true } : {};
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    CATEGORIES.length > 0 ? CATEGORIES[0] : null
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(
    CATEGORIES.length > 0 && CATEGORIES[0].subCategories.length > 0
      ? CATEGORIES[0].subCategories[0]
      : null
  );

  // 右侧内容模式
  type ContentMode = 'list' | 'detail' | 'combo-type' | 'combo-config' | 'search';
  const [contentMode, setContentMode] = useState<ContentMode>('list');

  const [detailProduct, setDetailProduct] = useState<StandardProduct | null>(null);
  const [detailCat, setDetailCat] = useState<Category | null>(null);
  const [detailSub, setDetailSub] = useState<SubCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<ComboQuoteItem[]>([]);
  const [activeComboProduct, setActiveComboProduct] = useState<ComboProduct | null>(null);
  const [showSelectedPanel, setShowSelectedPanel] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');

  // 切换大类展开/折叠
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // 选择大类（展开，不直接切换产品列表）
  const handleSelectCategory = (cat: Category) => {
    setExpandedCategories(prev => ({ ...prev, [cat.id]: true }));
    setSelectedCategory(cat);
    // 自动选中第一个非 combo 子类
    const firstSub = cat.subCategories.find(s => s.id !== 'custom-combo');
    if (firstSub) {
      setSelectedSubCategory(firstSub);
      setContentMode('list');
    }
  };

  // 选择子类
  const handleSelectSubCategory = (cat: Category, sub: SubCategory) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(sub);
    if (sub.id === 'custom-combo') {
      setContentMode('combo-type');
    } else {
      setContentMode('list');
    }
  };

  // 执行搜索
  const handleSearch = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    setSearchKeyword(trimmed);
    setContentMode('search');
  };

  const handleViewDetail = (product: StandardProduct, cat?: Category, sub?: SubCategory) => {
    setDetailProduct(product);
    setDetailCat(cat || selectedCategory);
    setDetailSub(sub || selectedSubCategory);
    setContentMode('detail');
  };

  const handleQuickAdd = (product: StandardProduct, cat?: Category, sub?: SubCategory) => {
    const useCat = cat || selectedCategory;
    const useSub = sub || selectedSubCategory;
    if (!useCat || !useSub) return;
    if (selectedItems.some(i => i.productId === product.id)) return;
    const item: QuoteItem = {
      id: `std_${Date.now()}_${Math.random()}`,
      type: 'standard',
      productId: product.id,
      libraryId: product.libraryId,
      supplierProductId: product.supplierProductId,
      productName: product.name,
      categoryName: useCat.name,
      subCategoryName: useSub.name,
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
      imageUrl: product.imageUrl,
    };
    setSelectedItems(prev => [...prev, item]);
  };

  const handleAddFromDetail = (item: QuoteItem) => {
    setSelectedItems(prev => {
      if (prev.some(i => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
    if (contentMode === 'detail') {
      setContentMode(detailCat ? 'list' : 'list');
    }
    setDetailProduct(null);
    setDetailCat(null);
    setDetailSub(null);
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

  const removeCombo = (id: string) => {
    setSelectedCombos(prev => prev.filter(i => i.id !== id));
  };

  const handleComboConfirm = (item: ComboQuoteItem) => {
    setSelectedCombos(prev => [...prev, item]);
    setContentMode('list');
  };

  const handleConfirm = () => {
    if (selectedItems.length > 0 || selectedCombos.length > 0) {
      onSelect(selectedItems, selectedCombos);
    } else {
      onCancel();
    }
  };

  // 产品计数
  const getSubCount = (subId: string) =>
    SAMPLE_PRODUCTS.filter(p => p.subCategoryId === subId).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ===== 顶部导航 ===== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-full px-6 py-3 flex items-center gap-4">
          {/* 返回按钮 */}
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-shrink-0">
            <h1 className="text-base font-bold text-gray-900">选择产品</h1>
          </div>

          {/* 全局搜索框 */}
          <div className="flex-1 max-w-md">
            <form
              onSubmit={e => { e.preventDefault(); handleSearch(searchInputValue); }}
              className="relative"
            >
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInputValue}
                onChange={e => setSearchInputValue(e.target.value)}
                placeholder="搜索产品名称、规格、颜色、产品编号..."
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition-all"
              />
              {searchInputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInputValue('');
                    if (contentMode === 'search') {
                      setSearchKeyword('');
                      setContentMode('list');
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
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
      </header>

      {/* ===== 主体：左侧导航 + 右侧内容 ===== */}
      <div className="flex flex-1 overflow-hidden min-h-0" style={{ height: 'calc(100vh - 57px)' }}>
        {/* 左侧分类树导航 */}
        <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="py-2">
            {CATEGORIES.map(cat => {
              const isExpanded = expandedCategories[cat.id];
              const catCount = SAMPLE_PRODUCTS.filter(p => p.categoryId === cat.id).length;
              return (
                <div key={cat.id}>
                  {/* 大类行 */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors cursor-pointer hover:bg-gray-50 ${
                      selectedCategory?.id === cat.id ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedCategory?.id === cat.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {CATEGORY_ICONS[cat.id] || (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 text-sm font-semibold truncate">{cat.name}</span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{catCount}</span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* 子类列表 */}
                  {isExpanded && (
                    <div className="bg-gray-50">
                      {cat.subCategories.map(sub => {
                        const isActive = selectedSubCategory?.id === sub.id && selectedCategory?.id === cat.id;
                        const subCount = getSubCount(sub.id);
                        const isCombo = sub.id === 'custom-combo';
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelectSubCategory(cat, sub)}
                            className={`w-full flex items-center gap-2 pl-10 pr-4 py-2 text-left transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                          >
                            <span className="flex-1 text-xs truncate">
                              {sub.name}
                              {isCombo && <span className="ml-1 text-[10px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded">定制</span>}
                            </span>
                            <span className={`text-[10px] flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{subCount || ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* 右侧内容区 */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">
            {/* 已选产品面板 */}
            {(selectedItems.length > 0 || selectedCombos.length > 0) && showSelectedPanel && (
              <div className="card overflow-hidden border-green-200">
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
                          <p className="text-xs text-gray-500 mt-0.5">{combo.components.length} 个组件</p>
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
                  {selectedItems.map(item => (
                    <div key={item.id} className="px-5 py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.color} · {item.size} · {item.quantity} {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-900">${(item.quantity * item.unitPrice).toFixed(2)}</span>
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

            {/* 产品列表视图 */}
            {contentMode === 'list' && selectedCategory && selectedSubCategory && (
              <ProductListView
                category={selectedCategory}
                subCategory={selectedSubCategory}
                selectedItems={selectedItems}
                onViewDetail={(p) => handleViewDetail(p)}
                onQuickAdd={(p) => handleQuickAdd(p)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}

            {/* 搜索结果 */}
            {contentMode === 'search' && (
              <SearchResultView
                keyword={searchKeyword}
                selectedItems={selectedItems}
                onViewDetail={(p, cat, sub) => handleViewDetail(p, cat, sub)}
                onQuickAdd={(p, cat, sub) => handleQuickAdd(p, cat, sub)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}

            {/* 产品详情 */}
            {contentMode === 'detail' && detailProduct && detailCat && detailSub && (
              <ProductDetailModal
                product={detailProduct}
                category={detailCat}
                subCategory={detailSub}
                selectedItems={selectedItems}
                onAddToList={handleAddFromDetail}
                onClose={() => setContentMode('list')}
              />
            )}

            {/* 组合品类型选择 */}
            {contentMode === 'combo-type' && selectedCategory && (
              <ComboTypeView
                category={selectedCategory}
                onSelectCombo={(combo) => {
                  setActiveComboProduct(combo);
                  setContentMode('combo-config');
                }}
                onBack={() => setContentMode('list')}
              />
            )}

            {/* 组合品配置 */}
            {contentMode === 'combo-config' && activeComboProduct && (
              <ComboConfigView
                comboProduct={activeComboProduct}
                onConfirm={handleComboConfirm}
                onBack={() => setContentMode('combo-type')}
              />
            )}

            {/* 空状态提示（没选子类时） */}
            {contentMode === 'list' && (!selectedCategory || !selectedSubCategory) && (
              <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
                <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm">请从左侧选择品类</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
