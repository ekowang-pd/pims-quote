import { useState } from 'react';
import type { Quote, QuoteItem, ComboQuoteItem, AnyQuoteItem } from '../types';
import { CURRENCIES, PAYMENT_TERMS, DELIVERY_TERMS } from '../data/categories';
import { formatCurrency } from '../utils/format';

// ===== 组合品行组件（可展开） =====
function ComboItemRow({
  item,
  idx,
  currency,
  onRemove,
}: {
  item: ComboQuoteItem;
  idx: number;
  currency: string;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true); // 默认展开
  const finalPrice = item.totalPrice * (1 + item.margin);

  return (
    <>
      {/* 组合品主行 */}
      <tr className="border-b border-orange-200 bg-orange-50/40">
        <td className="px-3 py-3 text-sm text-gray-500">{idx + 1}</td>
        <td className="px-3 py-3">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.comboName} className="w-12 h-12 object-cover rounded-lg" />
          ) : (
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
        </td>
        <td className="px-3 py-3">
          <span className="font-mono text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
            {item.comboProductId}
          </span>
        </td>
        <td className="px-3 py-3">
          <span className="badge text-xs bg-orange-100 text-orange-700">组合</span>
        </td>
        <td className="px-3 py-3" colSpan={2}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <svg
              className={`w-4 h-4 text-orange-500 transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div>
              <span className="text-sm font-semibold text-orange-800 group-hover:text-orange-900">
                {item.comboName}
              </span>
              <span className="text-xs text-orange-500 ml-2">含 {item.components.length} 个组件</span>
            </div>
          </button>
        </td>
        <td className="px-3 py-3" colSpan={10}></td>
        <td className="px-3 py-3 text-sm font-bold text-orange-700 whitespace-nowrap">
          {formatCurrency(finalPrice, currency)}
        </td>
        <td className="px-3 py-3" colSpan={2}></td>
        <td className="px-3 py-3">
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </td>
      </tr>

      {/* 展开：组件明细 */}
      {expanded && item.components.map((comp, cIdx) => (
        <tr key={comp.componentId} className="border-b border-orange-100 bg-white">
          <td className="px-3 py-2"></td>
          <td className="px-3 py-2" colSpan={2}>
            <div className="text-[11px] text-gray-400 pl-4">组件 {cIdx + 1}</div>
          </td>
          <td className="px-3 py-2">
            <span className="text-xs font-medium text-gray-700">{comp.productName}</span>
          </td>
          <td className="px-3 py-2">
            <span className="font-mono text-[11px] text-gray-500">{comp.supplierProductId || '-'}</span>
          </td>
          <td className="px-3 py-2">
            <span className="text-xs text-gray-600">{comp.length || '-'}</span>
          </td>
          <td className="px-3 py-2">
            <span className="text-xs text-gray-600">{comp.width || '-'}</span>
          </td>
          <td className="px-3 py-2" colSpan={10}>
            <span className="text-xs text-gray-500">{comp.dimensionValue}mm</span>
            {comp.remark && <span className="text-[10px] text-orange-500 ml-2">{comp.remark}</span>}
          </td>
          <td className="px-3 py-2">
            <span className="text-xs font-medium text-gray-700">{comp.quantity}</span>
          </td>
          <td className="px-3 py-2">
            <span className="text-xs text-gray-600">{comp.unit}</span>
          </td>
          <td className="px-3 py-2" colSpan={2}>
            <span className="text-xs font-bold text-orange-600">
              {formatCurrency(comp.unitPrice * comp.quantity, currency)}
            </span>
          </td>
          <td className="px-3 py-2" colSpan={2}></td>
        </tr>
      ))}
    </>
  );
}

interface Props {
  quote: Quote;
  onSave: (quote: Quote) => void;
  onCancel: () => void;
  onAddProducts: () => void;
  onBatchAdd: () => void;
  onChange: (quote: Quote) => void;
}

// ===== Excel 视图模式组件（紧凑格子表格） =====
interface ExcelRow {
  id: string;
  productName: string;
  spec: string;
  color: string;
  size: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  remark: string;
}

function ExcelView({
  initialItems,
  currency,
  onSave,
}: {
  initialItems: QuoteItem[];
  currency: string;
  onSave: (items: QuoteItem[]) => void;
}) {
  // 转换为 Excel 行格式
  const toExcelRow = (item: QuoteItem): ExcelRow => ({
    id: item.id,
    productName: item.productName || '',
    spec: item.spec || '',
    color: item.color || '',
    size: item.size || (item.length && item.width && item.height ? `${item.length}×${item.width}×${item.height}` : ''),
    quantity: item.quantity || 1,
    unit: item.unit || '件',
    unitPrice: item.unitPrice || 0,
    remark: item.remark || '',
  });

  const [rows, setRows] = useState<ExcelRow[]>(
    initialItems.length > 0 ? initialItems.map(toExcelRow) : [createEmptyRow()]
  );

  function createEmptyRow(): ExcelRow {
    return {
      id: `new_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      productName: '',
      spec: '',
      color: '',
      size: '',
      quantity: 1,
      unit: '件',
      unitPrice: 0,
      remark: '',
    };
  }

  const updateRow = (id: string, field: keyof ExcelRow, value: string | number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    setRows(prev => [...prev, createEmptyRow()]);
  };

  const deleteRow = (id: string) => {
    setRows(prev => {
      const filtered = prev.filter(r => r.id !== id);
      return filtered.length === 0 ? [createEmptyRow()] : filtered;
    });
  };

  // 处理粘贴 Excel 数据
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (!text.trim()) return;

    const lines = text.trim().split('\n').filter(l => l.trim());
    
    // 检测是否是带表头的数据
    const firstLine = lines[0];
    const hasHeader = /产品|名称|name|spec|color|数量|quantity|单价|price/i.test(firstLine);
    
    const startIdx = hasHeader ? 1 : 0;
    const dataLines = lines.slice(startIdx);

    if (dataLines.length === 0) return;

    // 尝试解析粘贴的数据
    const newRows: ExcelRow[] = dataLines.map(line => {
      const cells = line.split('\t').map(c => c.trim());
      return {
        id: `paste_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        productName: cells[0] || '',
        spec: cells[1] || '',
        color: cells[2] || '',
        size: cells[3] || '',
        quantity: Number(cells[4]) || 1,
        unit: cells[5] || '件',
        unitPrice: Number(cells[6]) || 0,
        remark: cells[7] || '',
      };
    });

    setRows(prev => {
      // 如果最后一行是空的，替换它；否则追加
      const lastRow = prev[prev.length - 1];
      const isLastEmpty = !lastRow.productName && !lastRow.spec;
      
      if (isLastEmpty && prev.length > 0) {
        return [...prev.slice(0, -1), ...newRows];
      }
      return [...prev, ...newRows];
    });
  };

  // 转换为 QuoteItem 保存
  const handleSave = () => {
    const quoteItems: QuoteItem[] = rows
      .filter(r => r.productName.trim()) // 只保存有产品名称的行
      .map(r => {
        // 解析尺寸字符串
        const sizeMatch = r.size.match(/(\d+)[×xX](\d+)[×xX](\d+)/);
        let length: number | undefined, width: number | undefined, height: number | undefined;
        if (sizeMatch) {
          length = Number(sizeMatch[1]);
          width = Number(sizeMatch[2]);
          height = Number(sizeMatch[3]);
        }

        return {
          id: r.id.startsWith('new_') || r.id.startsWith('paste_') ? `ci_${Date.now()}_${Math.random().toString(36).slice(2)}` : r.id,
          type: 'custom' as const,
          productName: r.productName,
          spec: r.spec,
          color: r.color,
          size: r.size,
          length,
          width,
          height,
          quantity: r.quantity,
          unit: r.unit,
          unitPrice: r.unitPrice,
          remark: r.remark,
        };
      });
    
    onSave(quoteItems);
  };

  // 计算总价
  const total = rows.reduce((sum, r) => sum + r.quantity * r.unitPrice, 0);

  // 列定义
  const columns = [
    { key: 'productName', label: '产品名称*', width: 'w-48' },
    { key: 'spec', label: '规格', width: 'w-28' },
    { key: 'color', label: '颜色', width: 'w-20' },
    { key: 'size', label: '尺寸(mm)', width: 'w-32' },
    { key: 'quantity', label: '数量', width: 'w-16', type: 'number' },
    { key: 'unit', label: '单位', width: 'w-16' },
    { key: 'unitPrice', label: '单价', width: 'w-24', type: 'number' },
    { 
      key: 'total', 
      label: '总价', 
      width: 'w-24', 
      type: 'calculated' as const,
      calc: (r: ExcelRow) => r.quantity * r.unitPrice,
    },
    { key: 'remark', label: '备注', width: 'w-32' },
  ];

  return (
    <div className="space-y-3">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+V</kbd>
            {' '}粘贴 Excel 数据到这里
          </span>
          <button
            onClick={addRow}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加行
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            共 <strong className="text-gray-900">{rows.filter(r => r.productName).length}</strong> 项
          </span>
          <span className="text-lg font-bold text-green-600">
            合计: {formatCurrency(total, currency)}
          </span>
          <button onClick={handleSave} className="btn-primary text-sm">
            保存到报价单
          </button>
        </div>
      </div>

      {/* Excel 风格表格 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table 
            className="w-full border-collapse"
            onPaste={handlePaste}
          >
            {/* 表头 */}
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="w-10 px-2 py-2 text-xs font-semibold text-gray-600 text-center border-r border-gray-200">#</th>
                {columns.map(col => (
                  <th 
                    key={col.key} 
                    className={`px-2 py-2 text-xs font-semibold text-gray-600 text-left border-r border-gray-200 ${col.width}`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-10 px-2 py-2 text-center"></th>
              </tr>
            </thead>
            {/* 数据行 */}
            <tbody>
              {rows.map((row, idx) => (
                <tr 
                  key={row.id} 
                  className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-2 py-1.5 text-xs text-gray-400 text-center border-r border-gray-200 bg-gray-50">
                    {idx + 1}
                  </td>
                  {columns.map(col => (
                    <td 
                      key={col.key} 
                      className={`px-1 py-1 border-r border-gray-100 ${col.width}`}
                    >
                      {col.type === 'calculated' ? (
                        <div className="px-2 py-1 text-sm font-medium text-gray-700">
                          {formatCurrency(col.calc(row), currency)}
                        </div>
                      ) : (
                        <input
                          type={col.type === 'number' ? 'number' : 'text'}
                          className="w-full px-2 py-1 text-sm border border-transparent rounded hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-colors"
                          value={(row as Record<string, string | number>)[col.key] as string | number}
                          onChange={e => updateRow(
                            row.id, 
                            col.key as keyof ExcelRow, 
                            col.type === 'number' ? Number(e.target.value) || 0 : e.target.value
                          )}
                          min={col.type === 'number' ? 0 : undefined}
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 text-center">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function QuoteEditor({ quote, onSave, onCancel, onAddProducts, onBatchAdd, onChange }: Props) {
  const [customItem, setCustomItem] = useState<Partial<QuoteItem>>({
    type: 'custom',
    productName: '',
    spec: '',
    color: '',
    size: '',
    unit: '件',
    quantity: 1,
    unitPrice: 0,
    margin: 0,
    remark: '',
  });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'items'>('items');
  const [viewMode, setViewMode] = useState<'system' | 'excel'>('system'); // 系统列表 / Excel模式

  const updateField = (field: keyof Quote, value: unknown) => {
    onChange({ ...quote, [field]: value });
  };

  const updateItem = (itemId: string, field: keyof QuoteItem, value: unknown) => {
    onChange({
      ...quote,
      items: quote.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeItem = (itemId: string) => {
    onChange({ ...quote, items: quote.items.filter(i => i.id !== itemId) as AnyQuoteItem[] });
  };

  const addCustomItem = () => {
    if (!customItem.productName) return;
    const newItem: QuoteItem = {
      id: `ci_${Date.now()}`,
      type: 'custom',
      productName: customItem.productName || '',
      spec: customItem.spec || '',
      color: customItem.color || '',
      size: customItem.size || '',
      unit: customItem.unit || '件',
      quantity: Number(customItem.quantity) || 1,
      unitPrice: Number(customItem.unitPrice) || 0,
      margin: Number(customItem.margin) || 0,
      remark: customItem.remark || '',
    };
    onChange({ ...quote, items: [...quote.items, newItem] });
    setCustomItem({
      type: 'custom', productName: '', spec: '', color: '', size: '',
      unit: '件', quantity: 1, unitPrice: 0, margin: 0, remark: '',
    });
    setShowCustomForm(false);
  };

  // Excel 视图保存处理
  const handleExcelSave = (items: QuoteItem[]) => {
    onChange({ ...quote, items });
    setViewMode('system'); // 保存后切回系统列表
  };

  const total = quote.items.reduce((s, item) => {
    if (item.type === 'combo') {
      return s + item.totalPrice * (1 + item.margin);
    }
    return s + item.quantity * item.unitPrice;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {quote.quoteNo}
              </h1>
              <p className="text-xs text-gray-500">
                {quote.customerName || '未设置客户'} {quote.customerCountry && `/ ${quote.customerCountry}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={quote.status}
              onChange={e => updateField('status', e.target.value)}
              className="input-field w-auto text-sm py-1.5"
            >
              <option value="draft">草稿</option>
              <option value="sent">已发送</option>
              <option value="confirmed">已确认</option>
              <option value="cancelled">已取消</option>
            </select>
            <button 
              onClick={() => setActiveTab('info')} 
              className="btn-secondary text-sm"
              title="编辑基本信息"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              基本信息
            </button>
            <button onClick={onCancel} className="btn-secondary">取消</button>
            <button onClick={() => onSave(quote)} className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              保存报价单
            </button>
          </div>
        </div>

        {/* Tab导航 */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
          {[
            { key: 'info', label: '基本信息' },
            { key: 'items', label: `产品明细 (${quote.items.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'info' | 'items')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 客户信息 */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">客户信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">客户名称</label>
                  <input type="text" className="input-field" placeholder="输入客户公司名称"
                    value={quote.customerName} onChange={e => updateField('customerName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">目标国家</label>
                  <input type="text" className="input-field" placeholder="如：United States, UK"
                    value={quote.customerCountry} onChange={e => updateField('customerCountry', e.target.value)} />
                </div>
              </div>
            </div>

            {/* 报价条款 */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">报价条款</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">报价币种</label>
                  <select className="input-field" value={quote.currency} onChange={e => updateField('currency', e.target.value)}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">付款方式</label>
                  <select className="input-field" value={quote.paymentTerms} onChange={e => updateField('paymentTerms', e.target.value)}>
                    {PAYMENT_TERMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">贸易术语</label>
                  <select className="input-field" value={quote.deliveryTerms} onChange={e => updateField('deliveryTerms', e.target.value)}>
                    {DELIVERY_TERMS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 日期 */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">日期设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">报价日期</label>
                  <input type="date" className="input-field" value={quote.createdAt} onChange={e => updateField('createdAt', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">有效期至</label>
                  <input type="date" className="input-field" value={quote.validUntil} onChange={e => updateField('validUntil', e.target.value)} />
                </div>
              </div>
            </div>

            {/* 备注 */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">备注</h3>
              <textarea
                className="input-field resize-none"
                rows={5}
                placeholder="输入报价备注，如特殊包装要求、认证需求等..."
                value={quote.remark || ''}
                onChange={e => updateField('remark', e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-5">
            {/* 操作按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={onAddProducts} className="btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  选择标品
                </button>
                <button onClick={onBatchAdd} className="btn-secondary border-purple-300 text-purple-700 hover:bg-purple-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  批量添加
                </button>
                <button onClick={() => setShowCustomForm(!showCustomForm)} className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加非标品
                </button>

                {/* 视图模式切换 */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden ml-2">
                  <button
                    onClick={() => setViewMode('system')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      viewMode === 'system'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      列表
                    </span>
                  </button>
                  <button
                    onClick={() => setViewMode('excel')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-200 cursor-pointer ${
                      viewMode === 'excel'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">报价总额</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(total, quote.currency)}</p>
              </div>
            </div>

            {/* 非标品表单 */}
            {showCustomForm && (
              <div className="card p-5 border-dashed border-2 border-blue-200 bg-blue-50/40">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加非标品 / 定制品
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">产品名称 *</label>
                    <input type="text" className="input-field text-sm" placeholder="输入产品名称"
                      value={customItem.productName} onChange={e => setCustomItem({...customItem, productName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">规格</label>
                    <input type="text" className="input-field text-sm" placeholder="如：哑光/亮光"
                      value={customItem.spec} onChange={e => setCustomItem({...customItem, spec: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">颜色</label>
                    <input type="text" className="input-field text-sm" placeholder="如：白色"
                      value={customItem.color} onChange={e => setCustomItem({...customItem, color: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">尺寸</label>
                    <input type="text" className="input-field text-sm" placeholder="如：600x600mm"
                      value={customItem.size} onChange={e => setCustomItem({...customItem, size: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">单位</label>
                    <input type="text" className="input-field text-sm" placeholder="件/平方米/套"
                      value={customItem.unit} onChange={e => setCustomItem({...customItem, unit: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">数量</label>
                    <input type="number" className="input-field text-sm" min="1"
                      value={customItem.quantity} onChange={e => setCustomItem({...customItem, quantity: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">单价 ({quote.currency})</label>
                    <input type="number" className="input-field text-sm" min="0" step="0.01"
                      value={customItem.unitPrice} onChange={e => setCustomItem({...customItem, unitPrice: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">利润率 (%)</label>
                    <input type="number" className="input-field text-sm" min="0" max="100"
                      value={(Number(customItem.margin) * 100).toFixed(0)}
                      onChange={e => setCustomItem({...customItem, margin: Number(e.target.value) / 100})} />
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">备注</label>
                    <input type="text" className="input-field text-sm" placeholder="特殊要求、认证等"
                      value={customItem.remark} onChange={e => setCustomItem({...customItem, remark: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={addCustomItem} className="btn-primary text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    添加到报价单
                  </button>
                  <button onClick={() => setShowCustomForm(false)} className="btn-secondary text-sm">取消</button>
                </div>
              </div>
            )}

            {/* 产品明细表 */}
            {viewMode === 'excel' ? (
              // Excel 视图模式 - 紧凑格子表格
              <div className="card p-4">
                <ExcelView
                  initialItems={quote.items as QuoteItem[]}
                  currency={quote.currency}
                  onSave={handleExcelSave}
                />
              </div>
            ) : (
              // 系统列表模式
              quote.items.length === 0 ? (
                <div className="card py-16 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-gray-500">尚未添加产品</p>
                  <p className="text-gray-400 text-sm">点击「选择标品」或「添加非标品」</p>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1600px]">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">#</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">图片</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">产品编号</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">产品类型</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">产品名称</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">型号</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">长(mm)</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">宽(mm)</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">高(mm)</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">描述</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">数量</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">单位</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">产品库价格</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">单价</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">总价</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">体积(m³)</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">重量(kg)</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase">备注</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {quote.items.map((item, idx) => {
                          // 组合品行
                          if (item.type === 'combo') {
                            const combo = item as ComboQuoteItem;
                            return (
                              <ComboItemRow
                                key={item.id}
                                item={combo}
                                idx={idx}
                                currency={quote.currency}
                                onRemove={() => removeItem(item.id)}
                              />
                            );
                          }
                          // 标品行
                          const stdItem = item as QuoteItem;
                          const subtotal = stdItem.quantity * stdItem.unitPrice;
                          const volume = stdItem.length && stdItem.width && stdItem.height
                            ? (stdItem.length * stdItem.width * stdItem.height) / 1000000000
                            : null;
                          return (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors">
                              <td className="px-3 py-3 text-sm text-gray-500">{idx + 1}</td>
                              <td className="px-3 py-3">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt="" className="w-12 h-12 object-cover rounded-lg" />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-3">
                                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                  {item.libraryId || '-'}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span className={`badge text-xs ${item.type === 'standard' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                  {item.type === 'standard' ? '标品' : '非标'}
                                </span>
                                {item.categoryName && <div className="text-xs text-gray-500 mt-0.5">{item.categoryName}</div>}
                              </td>
                              <td className="px-3 py-3">
                                <div className="text-sm font-medium text-gray-900 max-w-32 truncate" title={item.productName}>{item.productName}</div>
                                {item.color && <div className="text-xs text-gray-400">{item.color} / {item.spec}</div>}
                              </td>
                              <td className="px-3 py-3">
                                <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {item.supplierProductId || '-'}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <input type="number" className="input-field w-16 text-xs py-1 text-center" min="0"
                                  value={item.length || ''} onChange={e => updateItem(item.id, 'length', Number(e.target.value))} />
                              </td>
                              <td className="px-3 py-3">
                                <input type="number" className="input-field w-16 text-xs py-1 text-center" min="0"
                                  value={item.width || ''} onChange={e => updateItem(item.id, 'width', Number(e.target.value))} />
                              </td>
                              <td className="px-3 py-3">
                                <input type="number" className="input-field w-16 text-xs py-1 text-center" min="0"
                                  value={item.height || ''} onChange={e => updateItem(item.id, 'height', Number(e.target.value))} />
                              </td>
                              <td className="px-3 py-3">
                                <input type="text" className="input-field w-24 text-xs py-1" placeholder="描述"
                                  value={item.description || ''} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                              </td>
                              <td className="px-3 py-3">
                                <input type="number" className="input-field w-16 text-xs py-1 text-center" min="1"
                                  value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} />
                              </td>
                              <td className="px-3 py-3 text-xs text-gray-600">{item.unit}</td>
                              <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">
                                {item.basePrice ? formatCurrency(item.basePrice, quote.currency) : '-'}
                              </td>
                              <td className="px-3 py-3">
                                <input type="number" className="input-field w-20 text-xs py-1 text-right" min="0" step="0.01"
                                  value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))} />
                              </td>
                              <td className="px-3 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {formatCurrency(subtotal, quote.currency)}
                              </td>
                              <td className="px-3 py-3 text-xs text-gray-600">
                                {volume !== null ? volume.toFixed(6) : '-'}
                              </td>
                              <td className="px-3 py-3">
                                <input type="number" className="input-field w-16 text-xs py-1 text-center" min="0"
                                  value={item.weight || ''} onChange={e => updateItem(item.id, 'weight', Number(e.target.value))} />
                              </td>
                              <td className="px-3 py-3">
                                <input type="text" className="input-field w-20 text-xs py-1" placeholder="备注"
                                  value={item.remark || ''} onChange={e => updateItem(item.id, 'remark', e.target.value)} />
                              </td>
                              <td className="px-3 py-3">
                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50/60 border-t-2 border-blue-200">
                          <td colSpan={14} className="px-3 py-3 text-sm font-semibold text-gray-700 text-right">合计 Total</td>
                          <td className="px-3 py-3 text-base font-bold text-blue-700 whitespace-nowrap">{formatCurrency(total, quote.currency)}</td>
                          <td colSpan={4}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
