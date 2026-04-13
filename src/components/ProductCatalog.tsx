import { useState, useMemo, useEffect, useRef } from 'react';
import type { QuoteItem, StandardProduct, Category, SubCategory } from '../types';
import { SAMPLE_PRODUCTS, CATEGORIES, SUPPLIERS } from '../data/categories';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {CATEGORIES.find(c => c.id === product.categoryId)?.name} · {CATEGORIES.find(c => c.id === product.categoryId)?.subCategories.find(s => s.id === product.subCategoryId)?.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 产品图片 */}
          <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            {product.imageUrl && !imgError ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <div className="flex flex-col items-center gap-3"
                style={{ backgroundColor: COLOR_DOTS[product.color] || '#f3f4f6', width: '100%', height: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                <div className="text-gray-400 opacity-50">{CATEGORY_ICONS[product.categoryId]}</div>
                <span className="text-xs text-gray-400">暂无图片</span>
              </div>
            )}
          </div>

          {/* 属性标签 */}
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
          </div>

          {/* 多供应商选择 */}
          {availableSuppliers.length > 1 && (
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
          )}

          {availableSuppliers.length === 1 && currentSupplier && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">供应商：</span>
                  <span className="text-sm font-medium text-gray-900">{SUPPLIERS.find(s => s.id === currentSupplier.supplierId)?.name || '默认'}</span>
                </div>
                {currentSupplier.supplierProductId && <div className="text-xs text-gray-500">货号: {currentSupplier.supplierProductId}</div>}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100" />

          {/* 报价配置 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">配置报价参数</h3>
            <div className="grid grid-cols-2 gap-4">
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
                <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700">${unitPrice.toFixed(2)} / {product.unit}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">售价（USD）</label>
                <div className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-blue-50 text-blue-700 font-bold text-base">${(unitPrice * (1 + margin / 100)).toFixed(2)} / {product.unit}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">小计（USD）</label>
                <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-blue-700 font-bold text-base">${subtotal.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">MOQ</label>
                <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700">{currentSupplier?.moq || product.moq} {product.unit}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">备注（可选）</label>
                <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="特殊要求、包装、认证等"
                  value={remark} onChange={e => setRemark(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between rounded-b-2xl">
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

// ===== 报价车弹窗 =====
function CartModal({
  items,
  onUpdateQuantity,
  onRemove,
  onClose,
  onGenerateQuote,
}: {
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClose: () => void;
  onGenerateQuote: () => void;
}) {
  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">报价车</h2>
            <p className="text-sm text-gray-500 mt-1">{items.length} 款产品</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">报价车是空的，快去添加产品吧</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.libraryId && <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{item.libraryId}</span>}
                      <span className="text-xs text-gray-400">{item.categoryName} / {item.subCategoryName}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.productName}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{item.spec}</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: COLOR_DOTS[item.color] || '#e5e7eb' }} />
                        {item.color}
                      </span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-700">${item.unitPrice.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">/{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onUpdateQuantity(item.productId!, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center justify-center">−</button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.productId!, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center justify-center">+</button>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-sm font-bold text-gray-900">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                  </div>
                  <button onClick={() => onRemove(item.productId!)} className="text-gray-400 hover:text-red-500 cursor-pointer p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div>
              <span className="text-sm text-gray-600">合计：</span>
              <span className="text-xl font-bold text-blue-700 ml-2">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">继续选品</button>
              <button onClick={onGenerateQuote} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                生成报价单
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== 合并筛选区（供应商 + 属性筛选）=====
function FilterPanel({
  subCategory,
  allProducts,
  selectedSupplier,
  activeFilters,
  onSupplierChange,
  onFilterChange,
  onClear,
}: {
  subCategory: SubCategory;
  allProducts: StandardProduct[];
  selectedSupplier: string;
  activeFilters: Record<string, string>;
  onSupplierChange: (id: string) => void;
  onFilterChange: (key: string, val: string) => void;
  onClear: () => void;
}) {
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSupplierDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const availableSupplierIds = useMemo(() =>
    [...new Set(allProducts.map(p => p.supplierId).filter(Boolean))] as string[], [allProducts]);
  const availableSuppliers = SUPPLIERS.filter(s => availableSupplierIds.includes(s.id));
  const filteredSuppliers = useMemo(() => {
    const q = supplierSearch.trim().toLowerCase();
    return q ? availableSuppliers.filter(s => s.name.toLowerCase().includes(q)) : availableSuppliers;
  }, [supplierSearch, availableSuppliers]);

  const filterGroups = subCategory.filterGroups ?? [];
  const hasFilter = selectedSupplier || Object.values(activeFilters).some(Boolean);
  const selectedSupplierInfo = selectedSupplier ? SUPPLIERS.find(s => s.id === selectedSupplier) : null;

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3">
      <div className="flex items-start gap-4 flex-wrap">
        {/* 供应商选择 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">供应商</span>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                selectedSupplier ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {selectedSupplierInfo ? selectedSupplierInfo.name : '全部'}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showSupplierDropdown && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={supplierSearch}
                      onChange={e => setSupplierSearch(e.target.value)}
                      placeholder="搜索供应商..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  <button
                    onClick={() => { onSupplierChange(''); setShowSupplierDropdown(false); setSupplierSearch(''); }}
                    className={`w-full px-3 py-2 text-left text-xs transition-colors cursor-pointer ${!selectedSupplier ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    全部供应商
                  </button>
                  {filteredSuppliers.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { onSupplierChange(s.id); setShowSupplierDropdown(false); setSupplierSearch(''); }}
                      className={`w-full px-3 py-2 text-left text-xs transition-colors cursor-pointer ${selectedSupplier === s.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 分割线 */}
        {filterGroups.length > 0 && <div className="w-px bg-gray-200 self-stretch my-0.5 flex-shrink-0" />}

        {/* 属性筛选 */}
        {filterGroups.map(group => (
          <div key={group.key} className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{group.label}</span>
            <div className="flex flex-wrap gap-1">
              {group.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange(group.key, opt.value)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    activeFilters[group.key] === opt.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                  style={group.type === 'color' && opt.colorHex && activeFilters[group.key] !== opt.value
                    ? {} : {}}
                >
                  {group.type === 'color' && (
                    <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: opt.colorHex || COLOR_DOTS[opt.label] || '#e5e7eb' }} />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 清除筛选 */}
        {hasFilter && (
          <button onClick={onClear} className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap self-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            清除筛选
          </button>
        )}
      </div>
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StandardProduct | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'excel'>('grid');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([defaultCategory?.id]));
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

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
  };

  const allProducts = useMemo(() => {
    if (!activeSubCategory) return [];
    return SAMPLE_PRODUCTS.filter(
      p => p.categoryId === activeCategory.id && p.subCategoryId === activeSubCategory.id
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

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
      {/* 搜索 + 购物车工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <div className="flex-1 max-w-lg relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="搜索产品名称、规格、颜色、编号..."
            className="w-full pl-10 pr-9 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {searchKeyword && (
            <button onClick={() => setSearchKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
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
          <button onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium">
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

      {/* 筛选栏（非搜索模式下展示） */}
      {!isSearching && activeSubCategory && (
        <FilterPanel
          subCategory={activeSubCategory}
          allProducts={allProducts}
          selectedSupplier={selectedSupplier}
          activeFilters={activeFilters}
          onSupplierChange={setSelectedSupplier}
          onFilterChange={(key, val) => setActiveFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }))}
          onClear={() => { setSelectedSupplier(''); setActiveFilters({}); }}
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
                        const count = SAMPLE_PRODUCTS.filter(p => p.categoryId === cat.id && p.subCategoryId === sub.id).length;
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
                            <span className="text-xs font-medium truncate">{sub.name}</span>
                            <span className={`text-[10px] flex-shrink-0 ml-1 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{count}</span>
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
                            <div className="flex items-center gap-1.5">
                              {inCart && <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                              <span className="font-medium text-gray-900">{product.name}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const inCart = cartItems.some(i => i.productId === product.id);
                const hasImgError = imgErrors[product.id];
                const supplier = product.supplierId ? SUPPLIERS.find(s => s.id === product.supplierId) : null;
                const cat = CATEGORIES.find(c => c.id === product.categoryId);
                return (
                  <div key={product.id}
                    className="card overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
                    onClick={() => setSelectedProduct(product)}>
                    <div className="relative h-36 overflow-hidden bg-gray-100">
                      {product.imageUrl && !hasImgError ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))} />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ backgroundColor: COLOR_DOTS[product.color] || '#f3f4f6' }}>
                          <div className="text-gray-400 opacity-40">{cat ? CATEGORY_ICONS[cat.id] : null}</div>
                          <span className="text-xs text-gray-400">暂无图片</span>
                        </div>
                      )}
                      {inCart && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          已添加
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">查看详情</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-1">
                        {product.libraryId && <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{product.libraryId}</span>}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">{product.spec}</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: COLOR_DOTS[product.color] || '#e5e7eb' }} />
                          {product.color}
                        </span>
                      </div>
                      {supplier && <p className="text-xs text-gray-400 mb-2 truncate">{supplier.name}</p>}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-sm font-bold text-blue-700">${product.basePrice}</span>
                          <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
                        </div>
                        <button onClick={e => { e.stopPropagation(); if (!inCart) handleQuickAddToCart(product); }}
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${inCart ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-700 text-white hover:bg-blue-800'}`}>
                          {inCart ? '已添加' : '快速添加'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* 底部报价车浮动栏 */}
      {cartItems.length > 0 && (
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

      {showCart && (
        <CartModal items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveFromCart}
          onClose={() => setShowCart(false)} onGenerateQuote={() => onAddToCart(cartItems)} />
      )}

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} selectedItems={cartItems}
          onAddToCart={handleAddSingleToCart} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
