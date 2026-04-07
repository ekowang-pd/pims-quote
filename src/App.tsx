import { useState } from 'react';
import type { Quote, QuoteItem, ComboQuoteItem, AnyQuoteItem } from './types';
import { QuoteDashboard } from './components/QuoteDashboard';
import { QuoteEditor } from './components/QuoteEditor';
import { QuoteDetail } from './components/QuoteDetail';
import { ProductSelector } from './components/ProductSelector';
import { SAMPLE_PRODUCTS, CATEGORIES } from './data/categories';

export type AppView = 'dashboard' | 'editor' | 'detail' | 'product-select';

// ===== 批量添加弹窗组件 =====
function BatchAddModal({
  onAdd,
  onClose,
}: {
  onAdd: (items: QuoteItem[]) => void;
  onClose: () => void;
}) {
  const [idsInput, setIdsInput] = useState('');
  const [error, setError] = useState('');
  const [foundProducts, setFoundProducts] = useState<typeof SAMPLE_PRODUCTS>([]);

  // 根据输入的ID解析并查找产品
  const parseAndFindProducts = (input: string) => {
    const ids = input
      .split(/[,，\s\n]+/)
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (ids.length === 0) {
      setFoundProducts([]);
      setError('');
      return;
    }

    const found = ids
      .map(id => SAMPLE_PRODUCTS.find(p =>
        p.id === id || p.supplierProductId === id || p.libraryId === id
      ))
      .filter((p): p is typeof SAMPLE_PRODUCTS[number] => p !== undefined);

    setFoundProducts(found);
    setError(found.length === 0 ? '未找到任何产品' : '');
  };

  const handleInputChange = (value: string) => {
    setIdsInput(value);
    parseAndFindProducts(value);
  };

  const handleConfirm = () => {
    if (foundProducts.length === 0) return;

    const items: QuoteItem[] = foundProducts.map(product => {
      const category = CATEGORIES.find(c => c.id === product.categoryId);
      const subCategory = category?.subCategories.find(s => s.id === product.subCategoryId);

      return {
        id: `std_${Date.now()}_${Math.random()}`,
        type: 'standard' as const,
        productId: product.id,
        libraryId: product.libraryId,
        supplierProductId: product.supplierProductId,
        productName: product.name,
        categoryName: category?.name || product.categoryId,
        subCategoryName: subCategory?.name || product.subCategoryId,
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
    });

    onAdd(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">批量添加产品</h2>
            <p className="text-sm text-gray-500 mt-1">输入产品ID（支持逗号/空格/换行分隔）</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 输入区域 */}
          <div className="mb-4">
            <textarea
              value={idsInput}
              onChange={e => handleInputChange(e.target.value)}
              placeholder={`输入产品ID，例如：
p001, p002, p003
或 HD-WGT-200A, MW-TOI-S1000
或 LIB-2024-0001`}
              className="w-full h-28 px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              autoFocus
            />
            {error && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* 找到的产品预览 */}
          {foundProducts.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-purple-50 px-3 py-2 border-b border-purple-100">
                <p className="text-sm font-medium text-purple-700">
                  找到 {foundProducts.length} 个产品
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">产品ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">名称</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">供应商货号</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">单价</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {foundProducts.map(p => (
                      <tr key={p.id} className="hover:bg-purple-50/50">
                        <td className="px-3 py-2 font-mono text-xs text-purple-600">{p.id}</td>
                        <td className="px-3 py-2 text-gray-900">{p.name}</td>
                        <td className="px-3 py-2 text-gray-500 text-xs">{p.supplierProductId}</td>
                        <td className="px-3 py-2 text-right font-medium text-gray-900">${p.basePrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 示例 */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-2">💡 支持以下格式的ID：</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white px-2 py-1.5 rounded border">
                <span className="text-gray-500">产品ID：</span>
                <code className="text-purple-600 ml-1">p001, p002</code>
              </div>
              <div className="bg-white px-2 py-1.5 rounded border">
                <span className="text-gray-500">供应商货号：</span>
                <code className="text-purple-600 ml-1">HD-WGT-200A</code>
              </div>
              <div className="bg-white px-2 py-1.5 rounded border">
                <span className="text-gray-500">库ID：</span>
                <code className="text-purple-600 ml-1">LIB-2024-0001</code>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer">
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={foundProducts.length === 0}
            className={`px-5 py-2 text-sm font-medium rounded-lg flex items-center gap-2 cursor-pointer ${
              foundProducts.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            确认添加 {foundProducts.length > 0 && `(${foundProducts.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
  const [selectingForQuote, setSelectingForQuote] = useState<string | null>(null);
  const [showBatchAddModal, setShowBatchAddModal] = useState(false);

  const handleNewQuote = () => {
    const newQuote: Quote = {
      id: `q_${Date.now()}`,
      quoteNo: `QT-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(4, '0')}`,
      customerName: '',
      customerCountry: '',
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: [],
      currency: 'USD',
      paymentTerms: 'T/T 30% deposit, 70% before shipment',
      deliveryTerms: 'FOB',
    };
    setCurrentQuote(newQuote);
    setView('editor');
  };

  const handleEditQuote = (quote: Quote) => {
    setCurrentQuote({ ...quote });
    setView('editor');
  };

  const handleViewQuote = (quote: Quote) => {
    setViewingQuote(quote);
    setView('detail');
  };

  const handleSaveQuote = (quote: Quote) => {
    setQuotes(prev => {
      const idx = prev.findIndex(q => q.id === quote.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = quote;
        return updated;
      }
      return [...prev, quote];
    });
    setView('dashboard');
    setCurrentQuote(null);
  };

  const handleDeleteQuote = (quoteId: string) => {
    setQuotes(prev => prev.filter(q => q.id !== quoteId));
  };

  const handleOpenProductSelector = (quoteId: string) => {
    setSelectingForQuote(quoteId);
    setView('product-select');
  };

  const handleProductSelected = (items: QuoteItem[], combos?: ComboQuoteItem[]) => {
    if (currentQuote && selectingForQuote === currentQuote.id) {
      setCurrentQuote(prev => prev ? {
        ...prev,
        items: [
          ...prev.items,
          ...items,
          ...(combos || []).map(c => c as unknown as AnyQuoteItem),
        ],
      } : prev);
    }
    setSelectingForQuote(null);
    setView('editor');
  };

  // 批量添加产品
  const handleBatchAddItems = (items: QuoteItem[]) => {
    if (!currentQuote) return;
    // 过滤掉已存在的
    const newItems = items.filter(item =>
      !currentQuote.items.some((i: AnyQuoteItem) => 'productId' in i && i.productId === item.productId)
    );
    setCurrentQuote(prev => prev ? {
      ...prev,
      items: [...prev.items, ...newItems],
    } : prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'dashboard' && (
        <QuoteDashboard
          quotes={quotes}
          onNewQuote={handleNewQuote}
          onEditQuote={handleEditQuote}
          onViewQuote={handleViewQuote}
          onDeleteQuote={handleDeleteQuote}
        />
      )}
      {view === 'editor' && currentQuote && (
        <QuoteEditor
          quote={currentQuote}
          onSave={handleSaveQuote}
          onCancel={() => { setView('dashboard'); setCurrentQuote(null); }}
          onAddProducts={() => handleOpenProductSelector(currentQuote.id)}
          onBatchAdd={() => setShowBatchAddModal(true)}
          onChange={setCurrentQuote}
        />
      )}
      {view === 'detail' && viewingQuote && (
        <QuoteDetail
          quote={viewingQuote}
          onBack={() => { setView('dashboard'); setViewingQuote(null); }}
          onEdit={() => { handleEditQuote(viewingQuote); setViewingQuote(null); }}
        />
      )}
      {view === 'product-select' && (
        <ProductSelector
          onSelect={handleProductSelected}
          onCancel={() => { setSelectingForQuote(null); setView('editor'); }}
        />
      )}

      {/* 批量添加弹窗 */}
      {showBatchAddModal && (
        <BatchAddModal
          onAdd={handleBatchAddItems}
          onClose={() => setShowBatchAddModal(false)}
        />
      )}
    </div>
  );
}

export default App;
