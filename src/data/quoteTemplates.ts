import type { QuoteItem } from '../types';

// 报价单列配置
export interface QuoteColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: ExtendedQuoteItem, idx: number) => React.ReactNode;
}

// 报价单模版
export interface QuoteTemplate {
  id: string;
  name: string;
  columns: QuoteColumn[];
}

// 扩展的 QuoteItem（含组件显示需要的额外字段）
type ExtendedQuoteItem = QuoteItem & {
  pcsPerCtn?: number;
  sqmPerCtn?: number;
  discountPct?: number;
};

// 陶瓷/瓷砖模版列
const CERAMIC_COLUMNS: QuoteColumn[] = [
  { key: 'no', label: '#', width: '3rem', align: 'center' },
  { key: 'productName', label: '产品名称', width: '12rem' },
  { key: 'spec', label: '规格', width: '8rem' },
  { key: 'color', label: '颜色/釉面', width: '5rem' },
  { key: 'size', label: '尺寸(mm)', width: '7rem' },
  { key: 'quantity', label: '数量', width: '4rem', align: 'right' },
  { key: 'unit', label: '单位', width: '3.5rem', align: 'center' },
  { key: 'unitPrice', label: '单价', width: '5rem', align: 'right' },
  { key: 'totalPrice', label: '总价', width: '5rem', align: 'right' },
  { key: 'remark', label: '备注', width: '8rem' },
  { key: 'action', label: '', width: '2.5rem', align: 'center' },
];

// 卫浴模版列
const SANITARY_COLUMNS: QuoteColumn[] = [
  { key: 'no', label: '#', width: '3rem', align: 'center' },
  { key: 'productName', label: '产品名称', width: '12rem' },
  { key: 'spec', label: '型号/规格', width: '9rem' },
  { key: 'color', label: '颜色', width: '5rem' },
  { key: 'quantity', label: '数量', width: '4rem', align: 'right' },
  { key: 'unit', label: '单位', width: '3.5rem', align: 'center' },
  { key: 'unitPrice', label: '单价', width: '5rem', align: 'right' },
  { key: 'totalPrice', label: '总价', width: '5rem', align: 'right' },
  { key: 'remark', label: '备注', width: '9rem' },
  { key: 'action', label: '', width: '2.5rem', align: 'center' },
];

// 通用模版列
const DEFAULT_COLUMNS: QuoteColumn[] = [
  { key: 'no', label: '#', width: '3rem', align: 'center' },
  { key: 'productName', label: '产品名称', width: '14rem' },
  { key: 'spec', label: '规格/型号', width: '9rem' },
  { key: 'quantity', label: '数量', width: '4rem', align: 'right' },
  { key: 'unit', label: '单位', width: '3.5rem', align: 'center' },
  { key: 'unitPrice', label: '单价', width: '5rem', align: 'right' },
  { key: 'totalPrice', label: '总价', width: '5rem', align: 'right' },
  { key: 'remark', label: '备注', width: '9rem' },
  { key: 'action', label: '', width: '2.5rem', align: 'center' },
];

// 导出所有模版
export const ALL_TEMPLATES: QuoteTemplate[] = [
  { id: 'default', name: '通用报价', columns: DEFAULT_COLUMNS },
  { id: 'ceramic', name: '陶瓷/瓷砖', columns: CERAMIC_COLUMNS },
  { id: 'sanitary', name: '卫浴', columns: SANITARY_COLUMNS },
];

// 默认模版
export const DEFAULT_TEMPLATE = ALL_TEMPLATES[0];