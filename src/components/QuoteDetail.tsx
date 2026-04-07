import { useState } from 'react';
import type { Quote, QuoteItem, ComboQuoteItem, AnyQuoteItem } from '../types';
import { formatCurrency, getStatusLabel, getStatusColor } from '../utils/format';

type ViewMode = 'excel' | 'list';

interface Props {
  quote: Quote;
  onBack: () => void;
  onEdit: () => void;
}

export function QuoteDetail({ quote, onBack, onEdit }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('excel');

  // 计算总价（支持组合品）
  const total = quote.items.reduce((s, item) => {
    if (item.type === 'combo') {
      const combo = item as ComboQuoteItem;
      return s + combo.totalPrice * (1 + combo.margin);
    }
    return s + (item as QuoteItem).quantity * (item as QuoteItem).unitPrice;
  }, 0);

  // 标品总体积
  const totalVolume = quote.items.reduce((s, item) => {
    if (item.type === 'combo') return s;
    const qi = item as QuoteItem;
    if (qi.length && qi.width && qi.height) {
      return s + (qi.quantity * qi.length * qi.width * qi.height) / 1000000000;
    }
    return s;
  }, 0);

  // 标品总重量
  const totalWeight = quote.items.reduce((s, item) => {
    if (item.type === 'combo') return s;
    const qi = item as QuoteItem;
    return s + (qi.weight ? qi.quantity * qi.weight : 0);
  }, 0);

  const handlePrint = () => window.print();

  // Excel 表格列定义
  const excelColumns = [
    { key: 'index', label: '#', width: 'w-10' },
    { key: 'image', label: '图片', width: 'w-16' },
    { key: 'libraryId', label: '产品编号', width: 'w-28' },
    { key: 'categoryName', label: '产品类型', width: 'w-20' },
    { key: 'productName', label: '产品名称', width: 'w-40' },
    { key: 'supplierProductId', label: '型号', width: 'w-24' },
    { key: 'length', label: '长(mm)', width: 'w-16' },
    { key: 'width', label: '宽(mm)', width: 'w-16' },
    { key: 'height', label: '高(mm)', width: 'w-16' },
    { key: 'description', label: '描述', width: 'w-40' },
    { key: 'quantity', label: '数量', width: 'w-14' },
    { key: 'unit', label: '单位', width: 'w-14' },
    { key: 'basePrice', label: '产品库价格', width: 'w-20' },
    { key: 'unitPrice', label: '单价', width: 'w-20' },
    { key: 'totalPrice', label: '总价', width: 'w-20' },
    { key: 'volume', label: '体积(m³)', width: 'w-20' },
    { key: 'weight', label: '重量(kg)', width: 'w-16' },
  ];

  const getCellValue = (item: QuoteItem, key: string) => {
    const volume = item.length && item.width && item.height
      ? (item.quantity * item.length * item.width * item.height) / 1000000000
      : null;
    switch (key) {
      case 'index':
        return '';
      case 'image':
        return null;
      case 'libraryId':
        return item.libraryId || '-';
      case 'categoryName':
        return item.categoryName || (item.type === 'standard' ? '标品' : '非标');
      case 'productName':
        return item.productName;
      case 'supplierProductId':
        return item.supplierProductId || '-';
      case 'length':
        return item.length || '-';
      case 'width':
        return item.width || '-';
      case 'height':
        return item.height || '-';
      case 'description':
        return item.description || '-';
      case 'quantity':
        return item.quantity;
      case 'unit':
        return item.unit;
      case 'basePrice':
        return item.basePrice ? formatCurrency(item.basePrice, quote.currency) : '-';
      case 'unitPrice':
        return formatCurrency(item.unitPrice, quote.currency);
      case 'totalPrice':
        return formatCurrency(item.quantity * item.unitPrice, quote.currency);
      case 'volume':
        return volume !== null ? volume.toFixed(6) : '-';
      case 'weight':
        return item.weight ? `${item.quantity * item.weight}` : '-';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{quote.quoteNo}</h1>
              <p className="text-xs text-gray-500">产品明细</p>
            </div>
            <span className={`badge ml-2 ${getStatusColor(quote.status)}`}>
              {getStatusLabel(quote.status)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 视图切换 */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('excel')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'excel' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Excel 表格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                列表视图
              </button>
            </div>
            
            <button onClick={handlePrint} className="btn-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              打印
            </button>
            <button onClick={onEdit} className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              编辑
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-6 py-6">
        {/* 产品明细区域 */}
        <div className="card overflow-hidden">
          {/* 表头 */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-6">
              <h3 className="text-base font-semibold text-gray-900">产品明细</h3>
              <span className="text-sm text-gray-500">共 {quote.items.length} 项</span>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-600">
                总体积：<span className="font-medium">{totalVolume.toFixed(4)} m³</span>
              </span>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-600">
                总重量：<span className="font-medium">{totalWeight.toFixed(2)} kg</span>
              </span>
            </div>
            <div className="text-sm text-gray-600">
              报价总额：<span className="font-bold text-blue-700 text-lg">{formatCurrency(total, quote.currency)}</span>
            </div>
          </div>

          {quote.items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500">暂无产品</p>
              <p className="text-gray-400 text-sm mt-1">点击编辑添加产品</p>
            </div>
          ) : viewMode === 'excel' ? (
            /* Excel 表格视图 */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1800px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-blue-50">
                    {excelColumns.map(col => (
                      <th 
                        key={col.key} 
                        className={`${col.width} text-left text-xs font-semibold text-blue-800 px-3 py-3 uppercase tracking-wide`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, idx) => {
                    // 组合品行
                    if (item.type === 'combo') {
                      const combo = item as ComboQuoteItem;
                      const finalPrice = combo.totalPrice * (1 + combo.margin);
                      return (
                        <>
                          {/* 组合品主行 */}
                          <tr key={item.id} className="border-b border-orange-200 bg-orange-50/30">
                            <td className="px-3 py-3 text-sm text-gray-500">{idx + 1}</td>
                            <td className="px-3 py-3">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                              ) : (
                                <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-3"><span className="font-mono text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">{combo.comboProductId}</span></td>
                            <td className="px-3 py-3"><span className="badge text-xs bg-orange-100 text-orange-700">组合</span></td>
                            <td className="px-3 py-3 col-span-2">
                              <div className="text-sm font-semibold text-orange-800">{combo.comboName}</div>
                              <div className="text-xs text-orange-500">含 {combo.components.length} 个组件</div>
                            </td>
                            <td colSpan={12} className="px-3 py-3 text-right">
                              <span className="text-sm font-bold text-orange-700">{formatCurrency(finalPrice, quote.currency)}</span>
                            </td>
                          </tr>
                          {/* 组件明细子行 */}
                          {combo.components.map((comp, cIdx) => (
                            <tr key={`${combo.id}-${comp.componentId}`} className="border-b border-orange-100 bg-white">
                              <td className="px-3 py-2"></td>
                              <td className="px-3 py-2" colSpan={2}>
                                <span className="text-[10px] text-gray-400 pl-2">组件{cIdx + 1}</span>
                              </td>
                              <td className="px-3 py-2">
                                <div className="text-xs font-medium text-gray-700">{comp.productName}</div>
                                <div className="text-[10px] text-gray-400">{comp.supplierProductId || '-'}</div>
                              </td>
                              <td className="px-3 py-2 col-span-2"></td>
                              <td className="px-3 py-2">
                                <span className="text-xs text-gray-600">{comp.length || '-'}</span>
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-xs text-gray-600">{comp.width || '-'}</span>
                              </td>
                              <td className="px-3 py-2 col-span={8}">
                                <span className="text-xs text-gray-500">{comp.dimensionValue}mm</span>
                                {comp.remark && <span className="text-[10px] text-orange-500 ml-1">({comp.remark})</span>}
                              </td>
                              <td className="px-3 py-2 text-xs text-gray-700">{comp.quantity}</td>
                              <td className="px-3 py-2 text-xs text-gray-600">{comp.unit}</td>
                              <td className="px-3 py-2" colSpan={3}></td>
                              <td className="px-3 py-2 text-xs font-semibold text-orange-600">
                                {formatCurrency(comp.unitPrice * comp.quantity, quote.currency)}
                              </td>
                              <td className="px-3 py-2" colSpan={2}></td>
                            </tr>
                          ))}
                        </>
                      );
                    }
                    // 标品行
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                      >
                        {excelColumns.map(col => (
                          <td
                            key={col.key}
                            className={`${col.width} px-3 py-2.5 text-sm ${col.key === 'index' ? 'text-gray-400' : 'text-gray-900'}`}
                          >
                            {col.key === 'index' ? idx + 1 :
                             col.key === 'image' ? (
                               item.imageUrl ? (
                                 <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                               ) : (
                                 <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                   <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                   </svg>
                                 </div>
                               )
                             ) : getCellValue(item, col.key)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-100 border-t-2 border-blue-200">
                    <td colSpan={13} className="px-3 py-3 text-sm font-bold text-blue-900 text-right uppercase tracking-wide">
                      合计 Total
                    </td>
                    <td className="px-3 py-3 text-base font-bold text-blue-700 whitespace-nowrap">
                      {formatCurrency(total, quote.currency)}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-blue-700">
                      {totalVolume.toFixed(6)}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-blue-700">
                      {totalWeight.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            /* 列表卡片视图 */
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {quote.items.map((item, idx) => {
                  // 组合品卡片
                  if (item.type === 'combo') {
                    const combo = item as ComboQuoteItem;
                    const finalPrice = combo.totalPrice * (1 + combo.margin);
                    return (
                      <div key={item.id} className="border border-orange-200 rounded-xl overflow-hidden bg-orange-50/30">
                        <div className="h-32 bg-orange-100 relative">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={combo.comboName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span className="text-xs text-orange-400">组合品</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded font-medium">#{idx + 1}</span>
                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-medium">组合</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-orange-900 mb-2">{combo.comboName}</h4>
                          <div className="space-y-1.5 mb-3">
                            {combo.components.map((comp, cIdx) => (
                              <div key={comp.componentId} className="flex items-center justify-between text-xs bg-white/60 rounded px-2 py-1.5">
                                <div>
                                  <span className="text-gray-400 mr-1">{cIdx + 1}.</span>
                                  <span className="text-gray-700">{comp.productName}</span>
                                </div>
                                <span className="text-orange-700 font-medium">{formatCurrency(comp.unitPrice * comp.quantity, quote.currency)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-orange-200 pt-3 mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>成本合计</span>
                              <span>{formatCurrency(combo.totalPrice, quote.currency)}</span>
                            </div>
                            {combo.margin > 0 && (
                              <div className="text-xs text-green-600 mb-1">
                                利润率 +{(combo.margin * 100).toFixed(0)}%
                              </div>
                            )}
                            <div className="flex items-center justify-between font-bold mt-1">
                              <span className="text-sm">最终报价</span>
                              <span className="text-orange-700">{formatCurrency(finalPrice, quote.currency)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // 标品卡片
                  const stdItem = item as QuoteItem;
                  const volume = stdItem.length && stdItem.width && stdItem.height
                    ? (stdItem.quantity * stdItem.length * stdItem.width * stdItem.height) / 1000000000
                    : null;
                  const itemWeight = stdItem.weight ? stdItem.quantity * stdItem.weight : null;
                  return (
                    <div
                      key={item.id}
                      className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {/* 产品图片 */}
                      <div className="h-32 bg-gray-100 relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                            #{idx + 1}
                          </span>
                        </div>
                      </div>

                      {/* 产品信息 */}
                      <div className="p-4">
                        {/* 产品编号和类型 */}
                        <div className="flex items-center gap-2 mb-2">
                          {item.libraryId && (
                            <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {item.libraryId}
                            </span>
                          )}
                          <span className={`badge text-[10px] ${item.type === 'standard' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {item.categoryName || (item.type === 'standard' ? '标品' : '非标')}
                          </span>
                        </div>

                        {/* 产品名称 */}
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.productName}</h4>

                        {/* 型号 */}
                        {item.supplierProductId && (
                          <div className="text-xs text-gray-500 mb-2">
                            型号: <span className="font-mono text-gray-600">{item.supplierProductId}</span>
                          </div>
                        )}

                        {/* 规格信息 */}
                        <div className="text-xs text-gray-600 mb-3 space-y-0.5">
                          {item.length && item.width && item.height && (
                            <div>尺寸: {item.length} × {item.width} × {item.height} mm</div>
                          )}
                          {item.color && <div>颜色: {item.color}</div>}
                          {item.spec && <div>规格: {item.spec}</div>}
                        </div>

                        {/* 描述 */}
                        {item.description && (
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2 bg-gray-50 p-2 rounded">
                            {item.description}
                          </p>
                        )}

                        {/* 价格信息 */}
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>数量</span>
                            <span className="font-medium text-gray-700">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                          {item.basePrice && (
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                              <span>产品库价格</span>
                              <span className="text-gray-600">
                                {formatCurrency(item.basePrice, quote.currency)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>单价</span>
                            <span className="font-medium text-gray-700">
                              {formatCurrency(item.unitPrice, quote.currency)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-100">
                            <span>总价</span>
                            <span className="text-blue-700">
                              {formatCurrency(item.quantity * item.unitPrice, quote.currency)}
                            </span>
                          </div>
                        </div>

                        {/* 体积和重量 */}
                        {(volume !== null || itemWeight !== null) && (
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                            {volume !== null && (
                              <span>体积: {volume.toFixed(6)} m³</span>
                            )}
                            {itemWeight !== null && (
                              <span>重量: {itemWeight.toFixed(2)} kg</span>
                            )}
                          </div>
                        )}

                        {/* 利润率 */}
                        {item.margin > 0 && (
                          <div className="mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded text-center">
                            利润率 +{(item.margin * 100).toFixed(0)}%
                          </div>
                        )}

                        {/* 备注 */}
                        {item.remark && (
                          <div className="mt-3 text-xs text-gray-500 italic border-t border-gray-100 pt-2">
                            备注: {item.remark}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 列表视图合计 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">产品数量</p>
                    <p className="text-lg font-bold text-gray-900">{quote.items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">总体积</p>
                    <p className="text-lg font-bold text-blue-700">{totalVolume.toFixed(4)} m³</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">总重量</p>
                    <p className="text-lg font-bold text-blue-700">{totalWeight.toFixed(2)} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">报价总额</p>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(total, quote.currency)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部条款 */}
        <div className="card p-6 bg-gray-50/80 mt-6">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            This quotation is valid until {quote.validUntil}. Prices are in {quote.currency} based on {quote.deliveryTerms} terms. 
            Payment: {quote.paymentTerms}. All prices subject to change without prior notice after expiry date.
          </p>
        </div>
      </main>
    </div>
  );
}
