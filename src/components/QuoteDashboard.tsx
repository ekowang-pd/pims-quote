import { useState } from 'react';
import type { Quote } from '../types';
import { formatCurrency } from '../utils/format';

type StatusFilter = 'all' | 'draft' | 'submitted';

// 订单来源标签样式
const SOURCE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PIMS:     { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'PIMS' },
  TikTok:   { bg: 'bg-pink-50',   text: 'text-pink-700',   label: 'TikTok' },
  Facebook: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Facebook' },
  WhatsApp: { bg: 'bg-green-50',  text: 'text-green-700',  label: 'WhatsApp' },
  Email:    { bg: 'bg-amber-50',  text: 'text-amber-700',  label: 'Email' },
  OTHER:    { bg: 'bg-gray-100',  text: 'text-gray-500',   label: '其他' },
};

// 从报价人名称提取头像文字（支持 "冯焙荣 / Jackie" 格式）
function getAvatarText(name: string): string {
  const chinesePart = name.split('/')[0].trim();
  return chinesePart.length > 0 ? chinesePart.slice(0, 1) : name.slice(0, 1);
}

// 头像渐变色（按首字母哈希）
const AVATAR_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
];
function getAvatarColor(name: string): string {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

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
      {/* 状态筛选标签 */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-1">
          {[
            { key: 'all' as StatusFilter, label: '全部', count: quotes.length, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
            { key: 'draft' as StatusFilter, label: '草稿', count: draftCount, color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
            { key: 'submitted' as StatusFilter, label: '已提交', count: submittedCount, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-blue-700 text-white'
                  : tab.color
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

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
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">单号</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">报价人</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">金额</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">部门</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">来源</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">产品数</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">状态</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote, i) => {
                    const total = quote.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
                    const productCount = quote.items.length;

                    // 报价人（支持双语格式 "冯焙荣 / Jackie"）
                    const salesperson = quote.salesperson || '负责人';
                    const chineseName = salesperson.split('/')[0].trim();
                    const englishName = salesperson.includes('/') ? salesperson.split('/')[1].trim() : '';

                    // 部门
                    const department = quote.department || '—';

                    // 订单来源
                    const source = (quote as Quote & { source?: string }).source || 'PIMS';
                    const srcStyle = SOURCE_STYLES[source] || SOURCE_STYLES.OTHER;

                    return (
                      <tr key={quote.id} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        {/* 单号 */}
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => onViewQuote(quote)}
                            className="font-mono font-medium text-blue-700 hover:text-blue-800 hover:underline text-sm cursor-pointer tracking-wide"
                          >
                            {quote.quoteNo}
                          </button>
                          <p className="text-[11px] text-gray-400 mt-0.5">{quote.createdAt?.slice(0, 10)}</p>
                          {/* 关联报价单标签 */}
                          {quote.batchId && (() => {
                            const batchQuotes = quotes.filter(q => q.batchId === quote.batchId);
                            if (batchQuotes.length <= 1) return null;
                            const otherQuotes = batchQuotes.filter(q => q.id !== quote.id);
                            return (
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded">
                                  批量 {batchQuotes.length}
                                </span>
                                {otherQuotes.slice(0, 2).map(q => (
                                  <button
                                    key={q.id}
                                    onClick={(e) => { e.stopPropagation(); onViewQuote(q); }}
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded hover:bg-gray-200 cursor-pointer"
                                  >
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    {q.quoteNo}
                                  </button>
                                ))}
                                {otherQuotes.length > 2 && (
                                  <span className="text-[10px] text-gray-400">+{otherQuotes.length - 2}</span>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* 报价人：头像+中文名+英文名 */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(salesperson)} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                              {getAvatarText(salesperson)}
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 font-medium leading-tight">{chineseName}</p>
                              {englishName && (
                                <p className="text-[11px] text-gray-400 leading-tight">{englishName}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 金额 */}
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(total, quote.currency)}</span>
                        </td>

                        {/* 部门 */}
                        <td className="px-5 py-3.5 text-sm text-gray-600">{department}</td>

                        {/* 订单来源 */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${srcStyle.bg} ${srcStyle.text}`}>
                            {srcStyle.label}
                          </span>
                        </td>

                        {/* 产品数量 */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span className="font-medium">{productCount}</span>
                            <span className="text-gray-400 text-xs">款</span>
                          </div>
                        </td>

                        {/* 状态 */}
                        <td className="px-5 py-3.5">
                          <span className={`badge ${quote.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                            {quote.status === 'draft' ? '草稿' : '已提交'}
                          </span>
                        </td>

                        {/* 操作 */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => onViewQuote(quote)} className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-blue-50" title="查看">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button onClick={() => onEditQuote(quote)} className="text-gray-400 hover:text-green-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-green-50" title="编辑">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button onClick={() => onDeleteQuote(quote.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50" title="删除">
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
