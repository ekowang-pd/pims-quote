import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import type { StandardProduct, QuoteItem, ComboQuoteItem } from '../types';
import { SAMPLE_PRODUCTS, COMBO_PRODUCTS } from '../data/categories';

interface Props {
  onAddToCart: (items: QuoteItem[], combos?: ComboQuoteItem[]) => void;
  onClose: () => void;
}

interface ScannedItem {
  product: StandardProduct;
  quantity: number;
}

export function H5ScanSelector({ onAddToCart, onClose }: Props) {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [foundProduct, setFoundProduct] = useState<StandardProduct | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  // 查找产品（支持 barcode / qrcode / id / libraryId / supplierProductId）
  const findProduct = (code: string): StandardProduct | null => {
    return SAMPLE_PRODUCTS.find(p =>
      p.id === code ||
      p.libraryId === code ||
      p.supplierProductId === code ||
      p.barcode === code ||
      p.qrcode === code
    ) || null;
  };

  // 启动扫码
  const startScanner = async () => {
    if (!scannerDivRef.current) return;
    try {
      const html5QrCode = new Html5Qrcode('h5-reader');
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          handleScannedCode(decodedText);
        },
        () => {} // ignore errors
      );
      setScanning(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('无法访问摄像头，请检查权限设置');
    }
  };

  // 停止扫码
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
        setScanning(false);
      }).catch(() => {});
    }
  };

  // 处理扫描结果
  const handleScannedCode = (code: string) => {
    if (code === lastScan) return;
    setLastScan(code);

    const product = findProduct(code);
    if (product) {
      setFoundProduct(product);
      setNotFoundCode(null);
      // 震动反馈（如果支持）
      if (navigator.vibrate) navigator.vibrate(100);
    } else {
      setNotFoundCode(code);
      setFoundProduct(null);
    }
  };

  // 手动添加
  const handleManualAdd = () => {
    const code = manualInput.trim();
    if (!code) return;
    handleScannedCode(code);
    setManualInput('');
  };

  // 加入扫描列表
  const handleConfirmProduct = (product: StandardProduct) => {
    setScannedItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setFoundProduct(null);
  };

  // 从扫描列表移除
  const handleRemoveItem = (productId: string) => {
    setScannedItems(prev => prev.filter(i => i.product.id !== productId));
  };

  // 更新扫描列表中的数量
  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setScannedItems(prev => prev.map(i =>
      i.product.id === productId ? { ...i, quantity: qty } : i
    ));
  };

  // 提交
  const handleSubmit = () => {
    const items: QuoteItem[] = scannedItems.map(({ product, quantity }) => {
      const category = product.categoryId;
      const subCategory = product.subCategoryId;
      return {
        id: `std_${Date.now()}_${Math.random()}`,
        type: 'standard' as const,
        productId: product.id,
        libraryId: product.libraryId,
        supplierProductId: product.supplierProductId,
        productName: product.name,
        categoryName: category,
        subCategoryName: subCategory,
        spec: product.spec,
        color: product.color,
        size: product.size,
        length: product.length,
        width: product.width,
        height: product.height,
        unit: product.unit,
        quantity,
        basePrice: product.basePrice,
        unitPrice: product.basePrice,
        margin: 0,
        imageUrl: product.imageUrl,
      };
    });
    onAddToCart(items);
    onClose();
  };

  // 清理扫码资源
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-black/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-white font-semibold text-base">扫码选品</div>
        <div className="w-10" />
      </div>

      {/* 扫描区域 */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {!scanning ? (
          <div className="text-center p-8">
            {/* 相机图标 */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-white/60 text-sm mb-8">扫描产品条形码或二维码<br />快速加入报价单</p>
            <button
              onClick={startScanner}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
              开启相机扫描
            </button>

            {/* 手动输入区 */}
            <div className="mt-10 max-w-xs mx-auto">
              <p className="text-white/40 text-xs mb-3 text-center">或手动输入产品编号</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualAdd()}
                  placeholder="输入 ID / 条码 / 货号"
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm"
                />
                <button
                  onClick={handleManualAdd}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium"
                >
                  搜索
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            {/* 扫码画面 */}
            <div className="relative flex-1 bg-gray-900">
              <div id="h5-reader" ref={scannerDivRef} className="w-full h-full" />

              {/* 扫描框遮罩 */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 relative">
                  {/* 四角框 */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br" />
                  {/* 扫描线动画 */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-bounce opacity-70"
                    style={{ animationDuration: '1.5s', top: '50%' }} />
                </div>
              </div>

              {/* 关闭按钮 */}
              <button
                onClick={stopScanner}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm"
              >
                关闭扫描
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 已扫描产品列表 */}
      {scannedItems.length > 0 && (
        <div className="bg-gray-900 border-t border-white/10 max-h-52 overflow-y-auto shrink-0">
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
            <span className="text-white/60 text-xs">已扫描 {scannedItems.length} 个产品</span>
            <button onClick={handleSubmit} className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-medium">
              加入报价单
            </button>
          </div>
          {scannedItems.map(({ product, quantity }) => (
            <div key={product.id} className="px-4 py-2.5 flex items-center gap-3 border-b border-white/5">
              <img src={product.imageUrl || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-800" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{product.name}</p>
                <p className="text-white/40 text-xs mt-0.5">¥{product.basePrice}</p>
              </div>
              {/* 数量控制 */}
              <div className="flex items-center gap-2">
                <button onClick={() => handleUpdateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center text-lg">−</button>
                <span className="text-white text-sm w-6 text-center">{quantity}</span>
                <button onClick={() => handleUpdateQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center text-lg">+</button>
              </div>
              {/* 删除 */}
              <button onClick={() => handleRemoveItem(product.id)}
                className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 产品找到弹窗 */}
      {foundProduct && (
        <div className="absolute inset-0 bg-black/60 flex items-end z-10">
          <div className="w-full bg-white rounded-t-3xl p-5 animate-slide-up">
            <div className="flex gap-4">
              <img src={foundProduct.imageUrl || ''} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{foundProduct.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{foundProduct.spec} · {foundProduct.color}</p>
                <p className="text-blue-600 font-bold mt-2">¥{foundProduct.basePrice}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => { setFoundProduct(null); setLastScan(''); }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                继续扫描
              </button>
              <button onClick={() => handleConfirmProduct(foundProduct)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium">
                加入报价单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 未找到弹窗 */}
      {notFoundCode && (
        <div className="absolute inset-0 bg-black/60 flex items-end z-10">
          <div className="w-full bg-white rounded-t-3xl p-5">
            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">未找到产品</h3>
              <p className="text-gray-500 text-sm mt-1">编码：<span className="font-mono text-xs">{notFoundCode}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setNotFoundCode(null); setLastScan(''); }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                重新扫描
              </button>
              <button onClick={() => {
                setManualInput(notFoundCode);
                setNotFoundCode(null);
                setLastScan('');
              }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium">
                手动搜索
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}