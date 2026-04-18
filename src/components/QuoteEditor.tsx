import { useState, useMemo } from 'react';
import type { Quote, QuoteItem, ComboQuoteItem, AnyQuoteItem } from '../types';
import { CURRENCIES, PAYMENT_TERMS, DELIVERY_TERMS } from '../data/categories';
import { formatCurrency } from '../utils/format';
import { ALL_TEMPLATES, DEFAULT_TEMPLATE } from '../data/quoteTemplates';
import type { QuoteTemplate, QuoteColumn } from '../data/quoteTemplates';

// ===== 模版单元格组件 =====
type ExtendedQuoteItem = QuoteItem & {
  pcsPerCtn?: number;
  sqmPerCtn?: number;
  discountPct?: number;
};

function TemplateCell({
  col,
  item,
  idx,
  currency,
  onUpdate,
  onRemove,
  isSubmitted,
}: {
  col: QuoteColumn;
  item: ExtendedQuoteItem;
  idx: number;
  currency: string;
  onUpdate: (field: string, val: unknown) => void;
  onRemove: () => void;
  isSubmitted?: boolean;
}) {
  const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
  const cellBase = `px-3 py-2.5 ${alignClass}`;

  // 序号列
  if (col.key === 'no') {
    return <td className={`${cellBase} text-xs text-gray-500 select-none`}>{idx + 1}</td>;
  }

  // 删除按钮列
  if (col.key === 'action') {
    return (
      <td className="px-3 py-2.5 text-center">
        <button
          onClick={onRemove}
          disabled={isSubmitted}
          className={`transition-colors cursor-pointer ${isSubmitted ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    );
  }

  // 图片列（image / image2 都显示同一张图）
  if (col.key === 'image' || col.key === 'image2') {
    return (
      <td className={cellBase}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="w-12 h-10 object-cover rounded-lg" />
        ) : (
          <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </td>
    );
  }

  // 计算型列
  if (col.type === 'calculated' && col.calc) {
    const val = col.calc(item as unknown as Record<string, unknown>);
    const isNum = typeof val === 'number';
    return (
      <td className={`${cellBase} text-xs font-semibold ${col.key === 'amount' ? 'text-gray-900 whitespace-nowrap' : 'text-gray-700'}`}>
        {col.key === 'amount'
          ? formatCurrency(isNum ? val : Number(val) || 0, currency)
          : (val === '-' || val === undefined ? '-' : String(val))}
      </td>
    );
  }

  // 只读型：categoryName / libraryId / basePrice 等
  if (!col.editable) {
    const rawVal = (item as Record<string, unknown>)[col.key];
    if (col.key === 'libraryId') {
      return (
        <td className={cellBase}>
          <span className="font-mono text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {(rawVal as string) || '-'}
          </span>
        </td>
      );
    }
    if (col.key === 'basePrice') {
      return (
        <td className={`${cellBase} text-xs text-gray-500 whitespace-nowrap`}>
          {item.basePrice ? formatCurrency(item.basePrice, currency) : '-'}
        </td>
      );
    }
    if (col.key === 'categoryName') {
      return (
        <td className={cellBase}>
          <span className={`badge text-xs ${item.type === 'standard' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
            {(rawVal as string) || (item.type === 'standard' ? '标品' : '非标')}
          </span>
        </td>
      );
    }
    return (
      <td className={`${cellBase} text-xs text-gray-600`}>
        {rawVal !== undefined && rawVal !== null ? String(rawVal) : '-'}
      </td>
    );
  }

  // 可编辑型
  const rawVal = (item as Record<string, unknown>)[col.key];
  const isNumericField = col.type === 'number' ||
    ['length','width','height','quantity','unitPrice','margin','weight','pcsPerCtn','sqmPerCtn','discountPct'].includes(col.key);

  return (
    <td className={cellBase}>
      <input
        type={isNumericField ? 'number' : 'text'}
        min={isNumericField ? 0 : undefined}
        step={col.key === 'margin' || col.key === 'discountPct' || col.key === 'unitPrice' ? 0.01 : undefined}
        disabled={isSubmitted}
        className={`input-field text-xs py-1 ${
          isNumericField ? 'text-right w-20' : 'w-full'
        } ${col.key === 'productName' || col.key === 'areaName' || col.key === 'description' || col.key === 'remark' ? 'min-w-[80px]' : ''} ${isSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        placeholder={col.label}
        value={rawVal !== undefined && rawVal !== null ? String(rawVal) : ''}
        onChange={e => !isSubmitted && onUpdate(col.key, isNumericField ? Number(e.target.value) || 0 : e.target.value)}
      />
    </td>
  );
}

// ===== 组合品组件行（每个组件作为独立行，类似标品） =====
function ComboComponentRow({
  item,
  comp,
  compIdx,
  comboIdx,
  currency,
  onRemove,
  isSubmitted,
  columns,
}: {
  item: ComboQuoteItem;
  comp: ComboSelectedProduct;
  compIdx: number;
  comboIdx: number;
  currency: string;
  onRemove: () => void;
  isSubmitted?: boolean;
  columns: Array<{key: string; label: string; width?: string; minWidth?: string}>;
}) {
  const finalPrice = comp.unitPrice * (1 + (comp as any).margin || item.margin) * comp.quantity;
  const cellBase = 'px-3 py-2.5 align-middle';

  const getVal = (key: string) => {
    switch (key) {
      case 'imageUrl': return null;
      case 'productName': return (
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono bg-purple-100 text-purple-600 px-1 py-0.5 rounded border border-purple-200">组合#{comboIdx + 1}</span>
          <span className="text-xs font-semibold text-gray-800">{comp.productName}</span>
        </div>
      );
      case 'categoryName': return <span className="badge text-xs bg-purple-100 text-purple-700">定制品</span>;
      case 'spec': return <span className="text-xs text-gray-500">{item.comboName}</span>;
      case 'quantity': return <span className="text-xs text-gray-600">{comp.quantity}</span>;
      case 'unit': return <span className="text-xs text-gray-500">{comp.unit}</span>;
      case 'unitPrice': return <span className="text-xs text-gray-600">${comp.unitPrice.toFixed(2)}</span>;
      case 'totalPrice': return <span className="text-xs font-medium text-gray-800">${finalPrice.toFixed(2)}</span>;
      case 'remark': return <span className="text-xs text-gray-400">含 {item.components.length} 件 · {comp.componentId.replace('c-vanity-', '').replace('c-balcony-', '')}</span>;
      default: return null;
    }
  };

  return (
    <tr className="border-b border-purple-100 bg-purple-50/20 hover:bg-purple-50/40 transition-colors">
      {columns.map(col => (
        <td key={col.key} className={`${cellBase} ${col.width ?? ''} ${col.minWidth ?? ''}`}>
          {col.key === 'imageUrl' ? (
            comp.length && comp.width ? (
              <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded">{comp.width}×{comp.length}mm</span>
            ) : (
              <span className="text-[9px] text-gray-400">-</span>
            )
          ) : getVal(col.key)}
        </td>
      ))}
    </tr>
  );
}

// ===== 组合品主行（展开按钮 + 汇总行） =====
function ComboItemRow({
  item,
  idx,
  currency,
  onRemove,
  isSubmitted,
}: {
  item: ComboQuoteItem;
  idx: number;
  currency: string;
  onRemove: () => void;
  isSubmitted?: boolean;
}) {
  const finalPrice = item.totalPrice * (1 + item.margin);

  return (
    <>
      {/* 组合品展开控制行（不影响表格布局） */}
      <tr className="bg-orange-50/30">
        <td colSpan={100} className="px-4 py-1.5">
          <div className="flex items-center gap-2">
            <span className="badge text-[10px] bg-orange-100 text-orange-700">组合品 #{idx + 1}</span>
            <span className="text-xs font-medium text-gray-700">{item.comboName}</span>
            <span className="text-xs text-gray-400">({item.components.length} 件)</span>
            <span className="ml-2 text-xs font-semibold text-orange-600">${finalPrice.toFixed(2)}</span>
            {!isSubmitted && (
              <button onClick={onRemove} className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </td>
      </tr>
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
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // 是否已提交（不可编辑）
  const isSubmitted = quote.status === 'sent' || quote.status === 'confirmed' || quote.status === 'cancelled';

  // 提交报价单
  const handleSubmit = () => {
    const submittedQuote = { ...quote, status: 'sent' as const };
    onSave(submittedQuote);
    setShowSubmitConfirm(false);
  };

  // 模版选择：优先用 quote.templateId，否则从产品品类自动检测
  const autoTemplateId = useMemo(() => {
    if (quote.templateId) return quote.templateId;
    const catIds = [...new Set(
      quote.items
        .filter(i => i.type !== 'combo')
        .map(i => (i as QuoteItem).categoryName?.toLowerCase() || '')
        .filter(Boolean)
    )];
    // 简单映射：如果有陶瓷关键字 → ceramic；有卫浴/淋浴/浴室 → sanitary
    const hasCeramic = catIds.some(c => c.includes('陶瓷') || c.includes('瓷砖') || c.includes('ceramic'));
    const hasSanitary = catIds.some(c => c.includes('卫浴') || c.includes('淋浴') || c.includes('浴室') || c.includes('sanitary'));
    if (hasCeramic) return 'ceramic';
    if (hasSanitary) return 'sanitary';
    return 'default';
  }, [quote.templateId, quote.items]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(autoTemplateId);

  const activeTemplate: QuoteTemplate = useMemo(
    () => ALL_TEMPLATES.find(t => t.id === selectedTemplateId) ?? DEFAULT_TEMPLATE,
    [selectedTemplateId]
  );

  // 切换模版时同步到 quote.templateId
  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplateId(tplId);
    onChange({ ...quote, templateId: tplId });
  };

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
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
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
            {/* 已提交状态 */}
            {isSubmitted ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-700">
                  {quote.status === 'sent' ? '已提交' : quote.status === 'confirmed' ? '已确认' : '已取消'}
                </span>
              </div>
            ) : (
              <>
                <button onClick={() => onSave(quote)} className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  保存草稿
                </button>
                <button onClick={() => setShowSubmitConfirm(true)} className="btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  提交报价单
                </button>
              </>
            )}
          </div>
        </div>

        {/* 提交确认弹窗 */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">确认提交报价单</h3>
                  <p className="text-sm text-gray-500">提交后将无法再编辑，确定要提交吗？</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  确认提交
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab导航 */}
        <div className="max-w-full mx-auto px-6 flex gap-1 pb-0">
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

      <main className="max-w-full mx-auto px-6 py-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">基本信息</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">报价单名称</label>
                  <input type="text" className="input-field text-sm"
                    placeholder="输入报价单名称"
                    value={quote.quoteName || ''}
                    onChange={e => updateField('quoteName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">是否自定义单号</label>
                  <div className="flex items-center gap-3 h-[38px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="customQuoteNo" value="false"
                        checked={quote.customQuoteNo !== true}
                        onChange={() => updateField('customQuoteNo', false)}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">否</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="customQuoteNo" value="true"
                        checked={quote.customQuoteNo === true}
                        onChange={() => updateField('customQuoteNo', true)}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">是</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">折前含佣金额(RMB)</label>
                  <div className="input-field text-sm bg-gray-50 text-gray-600 h-[38px] flex items-center">
                    {quote.preCommissionAmount?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">折后含佣金额(RMB)</label>
                  <div className="input-field text-sm bg-gray-50 text-gray-600 h-[38px] flex items-center">
                    {quote.postCommissionAmount?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">佣金</label>
                  <input type="number" className="input-field text-sm"
                    placeholder="输入佣金"
                    value={quote.commission || ''}
                    onChange={e => updateField('commission', Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">是否用户开票</label>
                  <div className="flex items-center gap-3 h-[38px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="userInvoice" value="false"
                        checked={quote.userInvoice !== true}
                        onChange={() => updateField('userInvoice', false)}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">否</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="userInvoice" value="true"
                        checked={quote.userInvoice === true}
                        onChange={() => updateField('userInvoice', true)}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">是</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">销售类型</label>
                  <select className="input-field text-sm"
                    value={quote.salesType || ''}
                    onChange={e => updateField('salesType', e.target.value)}>
                    <option value="">请选择</option>
                    <option value="内销">内销</option>
                    <option value="外销">外销</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">业务部门</label>
                  <select className="input-field text-sm"
                    value={quote.businessDept || ''}
                    onChange={e => updateField('businessDept', e.target.value)}>
                    <option value="">请选择</option>
                    <option value="销售一部">销售一部</option>
                    <option value="销售二部">销售二部</option>
                    <option value="电商部">电商部</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 其他人员 */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">其他人员</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">协作人员</label>
                  <select className="input-field text-sm"
                    value={quote.collaborators?.[0] || ''}
                    onChange={e => updateField('collaborators', e.target.value ? [e.target.value] : [])}>
                    <option value="">请选择</option>
                    <option value="张三">张三</option>
                    <option value="李四">李四</option>
                    <option value="王五">王五</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">协作比例</label>
                  <select className="input-field text-sm"
                    value={quote.collabRatio?.toString() || ''}
                    onChange={e => updateField('collabRatio', Number(e.target.value) / 100)}>
                    <option value="">请选择</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">是否需要设计师</label>
                  <div className="flex items-center gap-3 h-[38px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="needDesigner" value="false"
                        checked={quote.needDesigner !== true}
                        onChange={() => updateField('needDesigner', false)}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">否</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="needDesigner" value="true"
                        checked={quote.needDesigner === true}
                        onChange={() => updateField('needDesigner', true)}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">是</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">跟单助理</label>
                  <select className="input-field text-sm"
                    value={quote.orderAssistant || ''}
                    onChange={e => updateField('orderAssistant', e.target.value)}>
                    <option value="">请选择</option>
                    <option value="助理A">助理A</option>
                    <option value="助理B">助理B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">翻译人员</label>
                  <select className="input-field text-sm"
                    value={quote.translator || ''}
                    onChange={e => updateField('translator', e.target.value)}>
                    <option value="">请选择</option>
                    <option value="翻译A">翻译A</option>
                    <option value="翻译B">翻译B</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 客户信息 */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">客户信息</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">客户名称</label>
                  <input type="text" className="input-field text-sm" placeholder="输入客户公司名称"
                    value={quote.customerName} onChange={e => updateField('customerName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">目标国家</label>
                  <input type="text" className="input-field text-sm" placeholder="如：United States, UK"
                    value={quote.customerCountry} onChange={e => updateField('customerCountry', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">报价日期</label>
                  <input type="date" className="input-field text-sm"
                    value={quote.createdAt} onChange={e => updateField('createdAt', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">有效期至</label>
                  <input type="date" className="input-field text-sm"
                    value={quote.validUntil} onChange={e => updateField('validUntil', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Note</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">交货方式</label>
                    <select className="input-field text-sm"
                      value={quote.deliveryMethod || ''}
                      onChange={e => updateField('deliveryMethod', e.target.value)}>
                      <option value="">请选择</option>
                      <option value="EXW">EXW</option>
                      <option value="FOB">FOB</option>
                      <option value="CIF">CIF</option>
                      <option value="DDP">DDP</option>
                      <option value="DAP">DAP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">定金比例</label>
                    <div className="relative">
                      <input type="number" className="input-field text-sm pr-8"
                        placeholder="输入定金比例"
                        min="0" max="100"
                        value={quote.depositRatio !== undefined ? (quote.depositRatio * 100).toFixed(0) : ''}
                        onChange={e => updateField('depositRatio', Number(e.target.value) / 100)} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">交货地点</label>
                    <input type="text" className="input-field text-sm"
                      placeholder="如：Foshan"
                      value={quote.deliveryPlace || ''}
                      onChange={e => updateField('deliveryPlace', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">报价币种</label>
                    <select className="input-field text-sm"
                      value={quote.currency}
                      onChange={e => updateField('currency', e.target.value)}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">打包方式</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'wooden_box', label: 'Wooden Box' },
                      { key: 'carton', label: 'Carton' },
                      { key: 'pallet', label: 'Pallet' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          const current = quote.packingMethods || [];
                          const updated = current.includes(opt.key)
                            ? current.filter(m => m !== opt.key)
                            : [...current, opt.key];
                          updateField('packingMethods', updated);
                        }}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                          (quote.packingMethods || []).includes(opt.key)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">条款</label>
                  <textarea
                    className="input-field text-sm resize-none"
                    rows={3}
                    placeholder="输入条款备注..."
                    value={quote.terms || ''}
                    onChange={e => updateField('terms', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-5">
            {/* 操作工具栏 */}
            <div className="card overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onAddProducts}
                  disabled={isSubmitted}
                  className={`btn-primary ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  选择标品
                </button>
                <button
                  onClick={onBatchAdd}
                  disabled={isSubmitted}
                  className={`btn-secondary border-purple-300 text-purple-700 hover:bg-purple-50 ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
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

                {/* 报价模版选择器 */}
                {viewMode === 'system' && (
                  <div className="flex items-center gap-2 ml-1 pl-3 border-l border-gray-200">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs text-gray-500 whitespace-nowrap">报价模版</span>
                    <select
                      value={selectedTemplateId}
                      onChange={e => handleTemplateChange(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 cursor-pointer"
                    >
                      {ALL_TEMPLATES.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">报价总额</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(total, quote.currency)}</p>
              </div>
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
              // 系统列表模式（模版驱动）
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
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          {activeTemplate.columns.map(col => (
                            <th
                              key={col.key}
                              className={`text-left text-xs font-medium text-gray-500 px-3 py-3 uppercase whitespace-nowrap ${col.width ?? ''} ${col.minWidth ?? ''}`}
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quote.items.map((item, idx) => {
                          if (item.type === 'combo') {
                            const combo = item as ComboQuoteItem;
                            // 每个组件作为独立行，组合品汇总行在上方
                            return (
                              <tbody key={item.id} className="combo-group">
                                <ComboItemRow
                                  item={combo}
                                  idx={idx}
                                  currency={quote.currency}
                                  onRemove={() => removeItem(item.id)}
                                  isSubmitted={isSubmitted}
                                />
                                {combo.components.map((comp, ci) => (
                                  <ComboComponentRow
                                    key={`${item.id}-${comp.componentId}`}
                                    item={combo}
                                    comp={comp}
                                    compIdx={ci}
                                    comboIdx={idx}
                                    currency={quote.currency}
                                    onRemove={() => removeItem(item.id)}
                                    isSubmitted={isSubmitted}
                                    columns={activeTemplate.columns}
                                  />
                                ))}
                              </tbody>
                            );
                          }
                          const stdItem = item as QuoteItem;
                          // 扩展字段（陶瓷特有）
                          const extItem = stdItem as QuoteItem & {
                            pcsPerCtn?: number;
                            sqmPerCtn?: number;
                            discountPct?: number;
                          };
                          return (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors">
                              {activeTemplate.columns.map(col => (
                                <TemplateCell
                                  key={col.key}
                                  col={col}
                                  item={extItem}
                                  idx={idx}
                                  currency={quote.currency}
                                  onUpdate={(field, val) => updateItem(item.id, field as keyof QuoteItem, val)}
                                  onRemove={() => removeItem(item.id)}
                                  isSubmitted={isSubmitted}
                                />
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50/60 border-t-2 border-blue-200">
                          <td
                            colSpan={activeTemplate.columns.findIndex(c => c.key === 'amount')}
                            className="px-3 py-3 text-sm font-semibold text-gray-700 text-right"
                          >
                            合计 Total
                          </td>
                          <td className="px-3 py-3 text-base font-bold text-blue-700 whitespace-nowrap">
                            {formatCurrency(total, quote.currency)}
                          </td>
                          <td colSpan={activeTemplate.columns.length - activeTemplate.columns.findIndex(c => c.key === 'amount') - 1}></td>
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
