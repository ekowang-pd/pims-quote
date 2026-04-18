import { useState, useRef, useMemo } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import type { StandardProduct, ComboProduct, ComboQuoteItem, ComboSelectedProduct } from '../types';
import { SAMPLE_PRODUCTS, CATEGORIES, SUPPLIERS, COMBO_PRODUCTS, COMBO_PRODUCTS_CATALOG } from '../data/categories';

interface CartItem {
  product: StandardProduct;
  quantity: number;
}

// 陶瓷全局筛选项（汇总各子类）
const GLOBAL_FILTERS = [
  { key: 'surface', label: '表面', options: [{ value: '亮光', label: '亮光' }, { value: '哑光', label: '哑光' }, { value: '柔光', label: '柔光' }] },
  { key: 'color', label: '颜色', options: [{ value: '白', label: '白' }, { value: '灰', label: '灰' }, { value: '米白', label: '米白' }, { value: '米黄', label: '米黄' }, { value: '黄', label: '黄' }, { value: '咖色', label: '咖色' }, { value: '黑', label: '黑' }] },
  { key: 'size', label: '尺寸', options: [{ value: '2400x1200mm', label: '2400x1200' }, { value: '2600x900mm', label: '2600x900' }, { value: '2700x1200mm', label: '2700x1200' }, { value: '1800x900mm', label: '1800x900' }, { value: '1200x600mm', label: '1200x600' }, { value: '600x600mm', label: '600x600' }] },
];

export function MobileApp() {
  // 搜索 & 分类
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');

  // 筛选状态
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  // 扫码状态
  const [showScan, setShowScan] = useState(false);
  const [scanStep, setScanStep] = useState<'home' | 'camera'>('home');
  const [manualInput, setManualInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [foundProduct, setFoundProduct] = useState<StandardProduct | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 已扫产品
  const [scannedItems, setScannedItems] = useState<CartItem[]>([]);

  // 组合品状态
  const [comboMode, setComboMode] = useState<'type' | 'config' | null>(null);
  const [activeComboProduct, setActiveComboProduct] = useState<ComboProduct | null>(null);
  const [componentSelections, setComponentSelections] = useState<
    Record<string, { product: StandardProduct | null; dimensionValue: number; quantity: number; remark: string }>
  >({});
  const [comboCartItems, setComboCartItems] = useState<ComboQuoteItem[]>([]);

  // 选中产品
  const [selectedProduct, setSelectedProduct] = useState<StandardProduct | null>(null);
  const [selectQty, setSelectQty] = useState(1);
  const [selectMargin, setSelectMargin] = useState(0);

  // ===== 产品筛选 =====
  const filteredProducts = SAMPLE_PRODUCTS.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierProductId.toLowerCase().includes(search.toLowerCase()) ||
      p.libraryId.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchSubCat = activeSubCategory === 'all' || p.subCategoryId === activeSubCategory;
    const matchSupplier = !selectedSupplier || p.supplierId === selectedSupplier;
    const matchFilters = Object.entries(activeFilters).every(([key, vals]) => {
      if (vals.length === 0) return true;
      const attr = (p.attrs as Record<string, unknown>)?.[key] || (p as Record<string, unknown>)[key] || '';
      return vals.some(v => String(attr).includes(v));
    });
    return matchSearch && matchCat && matchSubCat && matchSupplier && matchFilters;
  });

  // 辅助数据
  const categories = [{ id: 'all', name: '全部' }, ...CATEGORIES.map(c => ({ id: c.id, name: c.name }))];
  const activeCatObj = CATEGORIES.find(c => c.id === activeCategory);
  const subCategories = activeCategory === 'all' ? [] : [
    { id: 'all', name: '全部' },
    ...(activeCatObj?.subCategories.map(sc => ({ id: sc.id, name: sc.name })) || []),
  ];

  // 当前子类筛选项
  const activeSubCatObj = activeCatObj?.subCategories.find(sc => sc.id === activeSubCategory);
  const currentFilterGroups = (activeSubCatObj?.filterGroups || []).length > 0
    ? activeSubCatObj!.filterGroups
    : GLOBAL_FILTERS;

  const totalFilterCount = Object.values(activeFilters).reduce((s, v) => s + v.length, 0) + (selectedSupplier ? 1 : 0);

  // 查找产品
  const findProduct = (code: string): StandardProduct | null => {
    return SAMPLE_PRODUCTS.find(p =>
      p.id === code || p.libraryId === code || p.supplierProductId === code || p.barcode === code || p.qrcode === code
    ) || null;
  };

  // 筛选操作
  const toggleFilterValue = (key: string, val: string) => {
    setActiveFilters(prev => {
      const cur = prev[key] || [];
      return { ...prev, [key]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSelectedSupplier('');
  };

  // 扫码相关
  const handleScannedCode = (code: string) => {
    if (code === lastScan) return;
    setLastScan(code);
    const product = findProduct(code);
    if (product) { setFoundProduct(product); setNotFoundCode(null); }
    else { setFoundProduct(null); setNotFoundCode(code); }
    setScanning(false);
    setScanStep('home');
  };

  const startCameraScan = async () => {
    try {
      const html5QrCode = new Html5Qrcode('mobile-reader');
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
        (decodedText) => handleScannedCode(decodedText),
        () => {}
      );
      setScanStep('camera');
      setScanning(true);
    } catch {
      alert('无法访问摄像头，请检查权限设置');
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
        setScanning(false);
        setScanStep('home');
      }).catch(() => {});
    }
  };

  const handleFileScan = async (file: File) => {
    setUploading(true);
    try {
      const result = await new Html5Qrcode('mobile-reader').detectFileFromSrc(file);
      handleScannedCode(result);
    } catch {
      const fileName = file.name.replace(/\.[^.]+$/, '');
      const found = findProduct(fileName);
      if (found) handleScannedCode(fileName);
      else setNotFoundCode(fileName);
    } finally {
      setUploading(false);
      setScanStep('home');
    }
  };

  // 购物车
  const [showCart, setShowCart] = useState(false); // 是否展开报价车
  const addToCart = (product: StandardProduct, qty: number, _margin: number) => {
    setScannedItems(prev => {
      const exist = prev.find(i => i.product.id === product.id);
      if (exist) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
    setSelectedProduct(null);
    setSelectQty(1);
    setSelectMargin(0);
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) { setScannedItems(prev => prev.filter(i => i.product.id !== productId)); return; }
    setScannedItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const totalItems = scannedItems.reduce((sum, i) => sum + i.quantity, 0) + comboCartItems.length;
  const cartTotal = scannedItems.reduce((sum, i) => sum + i.product.basePrice * i.quantity, 0)
    + comboCartItems.reduce((sum, c) => sum + c.totalPrice * (1 + c.margin), 0);

  // 组合品计算总价
  const comboItemTotal = useMemo(() => {
    if (!activeComboProduct) return 0;
    let sum = 0;
    for (const comp of activeComboProduct.components) {
      const sel = componentSelections[comp.id];
      if (!sel?.product) continue;
      const baseDim = comp.priceDimension === 'width'
        ? (comp.baseWidth || 1)
        : comp.priceDimension === 'length'
        ? (comp.baseLength || 1)
        : (comp.baseArea || 1);
      const ratio = sel.dimensionValue / baseDim;
      sum += comp.basePrice * ratio * sel.quantity;
    }
    return sum;
  }, [activeComboProduct, componentSelections]);

  const openProductDetail = (product: StandardProduct) => {
    setSelectedProduct(product);
    setSelectQty(1);
    setSelectMargin(0);
  };

  // 组合品：进入类型选择
  const handleSelectComboType = (combo: ComboProduct) => {
    setActiveComboProduct(combo);
    const init: typeof componentSelections = {};
    for (const comp of combo.components) {
      const defaultProduct = COMBO_PRODUCTS_CATALOG.find(p => p.subCategoryId === comp.subCategoryId) || null;
      init[comp.id] = {
        product: defaultProduct,
        dimensionValue: comp.baseWidth || comp.baseLength || 1,
        quantity: 1,
        remark: '',
      };
    }
    setComponentSelections(init);
    setComboMode('config');
  };

  // 组合品：确认添加
  const handleComboConfirm = () => {
    if (!activeComboProduct) return;
    const components: ComboSelectedProduct[] = [];
    for (const comp of activeComboProduct.components) {
      const sel = componentSelections[comp.id];
      if (!sel?.product) { alert('请为所有必选组件选择产品'); return; }
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
    const item: ComboQuoteItem = {
      id: `combo_${Date.now()}`,
      type: 'combo',
      comboProductId: activeComboProduct.id,
      comboName: activeComboProduct.name,
      imageUrl: activeComboProduct.imageUrl,
      components,
      totalPrice: Math.round(comboItemTotal * 100) / 100,
      margin: 0.3,
      remark: '',
    };
    setComboCartItems(prev => [...prev, item]);
    setComboMode(null);
    setActiveComboProduct(null);
  };

  // ===== 筛选面板 =====
  if (showFilters) {
    return (
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)}>
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b flex items-center justify-between">
            <span className="font-bold text-gray-900 text-base">筛选</span>
            <div className="flex items-center gap-3">
              {totalFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-sm text-blue-600 font-medium">清除全部</button>
              )}
              <button onClick={() => setShowFilters(false)} className="text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-5 space-y-5">
            {/* 供应商 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">供应商</h3>
              <div className="flex flex-wrap gap-2">
                {SUPPLIERS.slice(0, 12).map(s => (
                  <button key={s.id}
                    onClick={() => setSelectedSupplier(selectedSupplier === s.id ? '' : s.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedSupplier === s.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            {/* 动态筛选项 */}
            {currentFilterGroups.map(fg => (
              <div key={fg.key}>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{fg.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {fg.options.map(opt => {
                    const isActive = (activeFilters[fg.key] || []).includes(opt.value);
                    return (
                      <button key={opt.value}
                        onClick={() => toggleFilterValue(fg.key, opt.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 bg-white px-5 py-4 border-t">
            <button onClick={() => setShowFilters(false)}
              className="w-full py-3.5 bg-blue-600 text-white rounded-2xl text-base font-bold">
              确定{totalFilterCount > 0 ? ` (${totalFilterCount}项)` : ''}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== 扫码界面 =====
  if (showScan) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col z-50">
        <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur">
          <button onClick={() => { stopScanner(); setShowScan(false); setFoundProduct(null); setNotFoundCode(null); setLastScan(''); }}
            className="text-white flex items-center gap-1 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <span className="text-white font-semibold">扫码</span>
          <div className="w-12" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {scanStep === 'camera' && scanning ? (
            <>
              <div id="mobile-reader" className="w-full max-w-xs" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 border-2 border-white/60 rounded-2xl" />
              </div>
              <p className="text-white/60 text-sm mt-4">将二维码/条形码对准框内</p>
              <button onClick={stopScanner} className="mt-4 px-6 py-2 border border-white/40 text-white rounded-full text-sm">取消</button>
            </>
          ) : (
            <div className="text-center w-full max-w-sm mx-auto px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-white/60 text-sm mb-6">扫描产品条形码或二维码<br />快速加入报价单</p>

              <div className="flex gap-3">
                <button onClick={startCameraScan}
                  className="flex-1 flex flex-col items-center gap-2 py-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white text-sm font-medium">相机扫描</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center gap-2 py-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer">
                  {uploading ? (
                    <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className="text-white text-sm font-medium">上传图片</span>
                </button>
              </div>

              {/* 手动输入 */}
              <div className="mt-6 flex gap-2">
                <input value={manualInput} onChange={e => setManualInput(e.target.value)}
                  placeholder="或输入产品ID手动搜索"
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/50" />
                <button onClick={() => { if (manualInput.trim()) handleScannedCode(manualInput.trim()); }}
                  className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer">
                  搜索
                </button>
              </div>

              {/* 扫码结果 */}
              {foundProduct && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/40 rounded-2xl text-left">
                  <p className="text-green-400 text-xs font-medium mb-2">✅ 找到产品</p>
                  <p className="text-white font-semibold">{foundProduct.name}</p>
                  <p className="text-white/60 text-xs mt-1">{foundProduct.supplierProductId}</p>
                  <p className="text-green-400 font-bold mt-2">${foundProduct.basePrice}/件</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => addToCart(foundProduct, 1, 0)}
                      className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-medium cursor-pointer">
                      加入报价单
                    </button>
                    <button onClick={() => openProductDetail(foundProduct)}
                      className="py-2 px-4 border border-white/30 text-white rounded-xl text-sm cursor-pointer">
                      详情
                    </button>
                  </div>
                </div>
              )}

              {notFoundCode && (
                <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-left">
                  <p className="text-amber-400 text-xs font-medium mb-1">❌ 未找到产品</p>
                  <p className="text-white/80 text-sm">编码：<span className="font-mono text-white">{notFoundCode}</span></p>
                </div>
              )}
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFileScan(f); if (e.target) e.target.value = ''; }} />
      </div>
    );
  }

  // ===== 产品详情弹窗 =====
  if (selectedProduct) {
    const unitPrice = selectedProduct.basePrice * (1 + selectMargin / 100);
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
        <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b">
            <button onClick={() => setSelectedProduct(null)} className="text-gray-500 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="font-bold text-gray-900">产品详情</h2>
            <div className="w-6" />
          </div>
          <div className="p-5">
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name}
              className="w-full h-56 object-cover rounded-2xl bg-gray-100 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedProduct.name}</h3>
            <p className="text-gray-500 text-sm mb-3">{selectedProduct.supplierProductId}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {selectedProduct.spec && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">规格</p>
                  <p className="text-sm font-medium text-gray-900">{selectedProduct.spec}</p>
                </div>
              )}
              {selectedProduct.color && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">颜色</p>
                  <p className="text-sm font-medium text-gray-900">{selectedProduct.color}</p>
                </div>
              )}
              {selectedProduct.size && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">尺寸</p>
                  <p className="text-sm font-medium text-gray-900">{selectedProduct.size}</p>
                </div>
              )}
              {selectedProduct.unit && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">单位</p>
                  <p className="text-sm font-medium text-gray-900">{selectedProduct.unit}</p>
                </div>
              )}
            </div>
            {selectedProduct.description && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-4">{selectedProduct.description}</p>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">数量</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-gray-100 text-gray-700 rounded-xl text-lg flex items-center justify-center cursor-pointer">−</button>
                  <input type="number" min="1" value={selectQty}
                    onChange={e => setSelectQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border border-gray-200 rounded-xl py-2 text-sm font-medium focus:outline-none focus:border-blue-500" />
                  <button onClick={() => setSelectQty(q => q + 1)}
                    className="w-9 h-9 bg-gray-100 text-gray-700 rounded-xl text-lg flex items-center justify-center cursor-pointer">+</button>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">利润率 %</label>
                <input type="number" value={selectMargin}
                  onChange={e => setSelectMargin(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">单价</span>
                <span className="font-bold text-blue-700">${unitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">小计</span>
                <span className="font-bold text-blue-700">${(unitPrice * selectQty).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => addToCart(selectedProduct, selectQty, selectMargin)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl text-base font-bold cursor-pointer hover:bg-blue-700 transition-colors">
              加入报价单
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== 主页面 =====
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ paddingBottom: totalItems > 0 ? '80px' : '0' }}>
      {/* 顶部 */}
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-base font-bold text-gray-900 leading-tight">PIMS 选品</h1>
              <p className="text-xs text-gray-400">建材产品快速报价</p>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索产品名称 / 货号 / ID"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button onClick={() => setShowScan(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          </div>

          {/* 分类横向滚动 */}
          <div className="overflow-x-auto px-4 pb-3 scrollbar-hide">
            <div className="flex gap-2 w-max">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setActiveSubCategory('all'); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 子类横向滚动 */}
          {subCategories.length > 0 && (
            <div className="overflow-x-auto px-4 pb-3 scrollbar-hide">
              <div className="flex gap-2 w-max">
                {subCategories.map(sc => (
                  <button key={sc.id} onClick={() => {
                    setActiveSubCategory(sc.id);
                    if (sc.id === 'custom-combo') {
                      setComboMode('type');
                    } else {
                      setComboMode(null);
                    }
                  }}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${activeSubCategory === sc.id ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'}`}>
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 筛选按钮 */}
          <div className="px-4 pb-3">
            <button onClick={() => setShowFilters(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer border ${
                totalFilterCount > 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              筛选{totalFilterCount > 0 ? ` (${totalFilterCount})` : ''}
            </button>
          </div>
        </div>
      </header>

      {/* 组合品类型选择 */}
      {comboMode === 'type' && (
        <main className="flex-1 px-4 py-3">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => { setComboMode(null); setActiveSubCategory('all'); }}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-gray-900">定制品组合</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">选择组合方案，定制专属产品</p>
          <div className="space-y-3">
            {COMBO_PRODUCTS.map(combo => (
              <button key={combo.id}
                onClick={() => handleSelectComboType(combo)}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left cursor-pointer hover:shadow-md transition-shadow">
                {combo.imageUrl && (
                  <img src={combo.imageUrl} alt={combo.name} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{combo.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{combo.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {combo.components.map(c => (
                      <span key={c.id} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.required ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        {c.name}{c.required ? '' : '(选)'}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-end">
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
        </main>
      )}

      {/* 组合品配置 */}
      {comboMode === 'config' && activeComboProduct && (
        <main className="flex-1 px-4 py-3">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setComboMode('type')}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-gray-900">{activeComboProduct.name}</h2>
          </div>

          <div className="space-y-3 mb-4">
            {activeComboProduct.components.map(comp => {
              const sel = componentSelections[comp.id] || { product: null, dimensionValue: 1, quantity: 1, remark: '' };
              const products = COMBO_PRODUCTS_CATALOG.filter(p => p.subCategoryId === comp.subCategoryId);
              return (
                <div key={comp.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{comp.name}</span>
                    {comp.required && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">必选</span>}
                  </div>

                  {/* 产品选择 */}
                  <div className="space-y-2 mb-3">
                    {products.map(p => (
                      <button key={p.id}
                        onClick={() => setComponentSelections(prev => ({
                          ...prev,
                          [comp.id]: {
                            ...prev[comp.id],
                            product: p,
                            dimensionValue: p.width || p.length || prev[comp.id]?.dimensionValue || 1,
                          },
                        }))}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-colors ${sel.product?.id === p.id ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
                        <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">${p.basePrice}/{p.unit}</p>
                        </div>
                        {sel.product?.id === p.id && (
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* 尺寸/数量调整 */}
                  {comp.priceDimension === 'width' && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-500 w-12">宽度(mm)</span>
                      <input type="number" value={sel.dimensionValue}
                        onChange={e => setComponentSelections(prev => ({ ...prev, [comp.id]: { ...prev[comp.id], dimensionValue: Math.max(1, parseInt(e.target.value) || 1) } }))}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-center" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-12">数量</span>
                    <button onClick={() => setComponentSelections(prev => ({ ...prev, [comp.id]: { ...prev[comp.id], quantity: Math.max(1, (prev[comp.id]?.quantity || 1) - 1) } }))}
                      className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 flex items-center justify-center cursor-pointer text-sm">−</button>
                    <span className="text-sm font-medium w-6 text-center">{sel.quantity}</span>
                    <button onClick={() => setComponentSelections(prev => ({ ...prev, [comp.id]: { ...prev[comp.id], quantity: (prev[comp.id]?.quantity || 1) + 1 } }))}
                      className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 flex items-center justify-center cursor-pointer text-sm">+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 组合品总价预览 */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">组合总价</span>
              <span className="text-lg font-bold text-blue-700">${comboItemTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">建议零售价 ${(comboItemTotal * 1.3).toFixed(2)}</p>
          </div>

          <button onClick={handleComboConfirm}
            className="w-full py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-bold cursor-pointer hover:bg-blue-700 transition-colors">
            加入报价车
          </button>
        </main>
      )}

      {/* 标准产品列表 */}
      {!comboMode && (
      <main className="flex-1 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">
            {search ? `找到 ${filteredProducts.length} 个产品` : `${filteredProducts.length} 个产品`}
          </p>
          {scannedItems.length > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              已选 {scannedItems.length} 个
            </span>
          )}
        </div>

        <div className="space-y-3">
          {filteredProducts.map(product => {
            const inCart = scannedItems.find(i => i.product.id === product.id);
            return (
              <div key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex cursor-pointer"
                onClick={() => openProductDetail(product)}>
                <img src={product.imageUrl} alt={product.name}
                  className="w-24 h-24 object-cover flex-shrink-0 bg-gray-100" />
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 flex-1">{product.name}</h3>
                    {inCart && (
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                        {inCart.quantity}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{product.supplierProductId}</p>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-sm font-bold text-blue-600">${product.basePrice}</p>
                      <p className="text-xs text-gray-400">{product.unit}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product, 1, 0); }}
                      className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">未找到产品</p>
              <p className="text-gray-300 text-xs mt-1">尝试其他关键词或筛选条件</p>
            </div>
          )}
        </div>
      </main>
      )}

      {/* 底部购物车气泡 */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4">
          <button onClick={() => setShowCart(true)}
            className="w-full flex items-center gap-3 px-5 py-4 bg-blue-600 text-white rounded-2xl shadow-2xl hover:bg-blue-700 transition-all cursor-pointer">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
              {totalItems}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-base leading-tight">报价车</p>
              <p className="text-white/70 text-xs">{scannedItems.length + comboCartItems.length} 件 · 共 ${cartTotal.toFixed(2)}</p>
            </div>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* ===== 报价车弹窗 ===== */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b">
              <button onClick={() => setShowCart(false)} className="text-gray-500 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="font-bold text-gray-900">报价车</h2>
              <button onClick={() => { setScannedItems([]); setComboCartItems([]); }} className="text-red-500 text-sm font-medium cursor-pointer">清空</button>
            </div>
            <div className="p-5">
              {scannedItems.length === 0 && comboCartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">报价车是空的</p>
                </div>
              ) : (
                <>
                  {/* 标准产品 */}
                  {scannedItems.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 mb-3">
                      <img src={item.product.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">${item.product.basePrice}/件</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white border border-gray-200 text-gray-700 rounded-xl text-base flex items-center justify-center cursor-pointer hover:bg-gray-100">−</button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-white border border-gray-200 text-gray-700 rounded-xl text-base flex items-center justify-center cursor-pointer hover:bg-gray-100">+</button>
                      </div>
                    </div>
                  ))}
                  {/* 组合品 */}
                  {comboCartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-purple-50 rounded-2xl p-3 mb-3">
                      <img src={item.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover bg-purple-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.comboName}</p>
                        <p className="text-xs text-gray-400">含 {item.components.length} 个组件</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-600">${item.totalPrice.toFixed(2)}</p>
                        <button onClick={() => setComboCartItems(prev => prev.filter(c => c.id !== item.id))}
                          className="text-xs text-red-500 cursor-pointer">删除</button>
                      </div>
                    </div>
                  ))}
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">共 {totalItems} 件商品</span>
                      <span className="text-lg font-bold text-blue-700">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => {
                    // TODO: 生成报价单
                    alert('生成报价单功能开发中...');
                  }}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl text-base font-bold cursor-pointer hover:bg-blue-700 transition-colors">
                    生成报价单
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
