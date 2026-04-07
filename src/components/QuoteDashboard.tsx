import { useState } from 'react';
import type { Quote } from '../types';
import { formatCurrency, getStatusLabel, getStatusColor } from '../utils/format';

type StatusFilter = 'all' | 'draft' | 'submitted';

interface Props {
  quotes: Quote[];
  onNewQuote: () => void;
  onEditQuote: (quote: Quote) => void;
  onViewQuote: (quote: Quote) => void;
  onDeleteQuote: (quoteId: string) => void;
}

export function QuoteDashboard({ quotes, onNewQuote, onEditQuote, onViewQuote, onDeleteQuote }: Props) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredQuotes = statusFilter === 'all' 
    ? quotes 
    : quotes.filter(q => statusFilter === 'draft' ? q.status === 'draft' : q.status !== 'draft');

  const totalAmount = filteredQuotes.reduce((sum, q) => {
    const qTotal = q.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
    return sum + qTotal;
  }, 0);

  const draftCount = quotes.filter(q => q.status === 'draft').length;
  const submittedCount = quotes.filter(q => q.status !== 'draft').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">我的报价单</h1>
              <p className="text-xs text-gray-500">My Quotes</p>
            </div>
          </div>
          <button onClick={onNewQuote} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建报价单
          </button>
        </div>
        {/* 状态筛选标签 */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center gap-1">
          {[
            { key: 'all' as StatusFilter, label: '全部', count: quotes.length, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
            { key: 'draft' as StatusFilter, label: '草稿', count: draftCount, color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
            { key: 'submitted' as StatusFilter, label: '已提交', count: submittedCount, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === tab.key 
                  ? 'bg-blue-700 text-white' 
                  : tab.color
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: '草稿', value: draftCount, suffix: '张',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
              color: 'text-yellow-600 bg-yellow-50',
            },
            {
              label: '已提交/已确认', value: submittedCount, suffix: '张',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              color: 'text-green-600 bg-green-50',
            },
            {
              label: '报价总额', value: formatCurrency(totalAmount, 'USD'), suffix: '',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              color: 'text-blue-600 bg-blue-50',
            },
          ].map((stat, i) => (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {stat.value}{stat.suffix && <span className="text-base font-medium text-gray-500 ml-1">{stat.suffix}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 报价单列表 */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              {statusFilter === 'all' ? '全部报价单' : statusFilter === 'draft' ? '草稿' : '已提交'}
            </h2>
            <span className="text-sm text-gray-500">共 {filteredQuotes.length} 条</span>
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-base">暂无报价单</p>
                <p className="text-gray-400 text-sm mt-1">点击「新建报价单」开始创建</p>
              </div>
              <button onClick={onNewQuote} className="btn-primary mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建报价单
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['报价单号', '客户名称', '国家', '产品数', '报价金额', '状态', '有效期', '操作'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote, i) => {
                    const total = quote.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
                    return (
                      <tr key={quote.id} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-5 py-3.5">
                          <button onClick={() => onViewQuote(quote)} className="font-medium text-blue-700 hover:text-blue-800 hover:underline text-sm cursor-pointer">
                            {quote.quoteNo}
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-900">{quote.customerName || '-'}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{quote.customerCountry || '-'}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{quote.items.length}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{formatCurrency(total, quote.currency)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`badge ${getStatusColor(quote.status)}`}>
                            {getStatusLabel(quote.status)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{quote.validUntil}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => onViewQuote(quote)} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer p-1 rounded" title="查看">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button onClick={() => onEditQuote(quote)} className="text-gray-500 hover:text-green-600 transition-colors cursor-pointer p-1 rounded" title="编辑">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button onClick={() => onDeleteQuote(quote.id)} className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer p-1 rounded" title="删除">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
