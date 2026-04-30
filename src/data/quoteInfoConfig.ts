// 报价单详情信息展示配置

export interface QuoteInfoField {
  key: string;
  label: string;
  section: string;
}

export interface QuoteInfoSection {
  key: string;
  label: string;
}

// 报价单信息字段分组
export const QUOTE_INFO_SECTIONS: QuoteInfoSection[] = [
  { key: 'basic', label: '基本信息' },
  { key: 'customer', label: '客户信息' },
  { key: 'pricing', label: '定价信息' },
];

// 报价单信息字段定义
export const QUOTE_INFO_FIELDS: QuoteInfoField[] = [
  // 基本信息
  { key: 'quoteName', label: '报价单名称', section: 'basic' },
  { key: 'validUntil', label: '有效期至', section: 'basic' },
  { key: 'currency', label: '币种', section: 'basic' },
  { key: 'paymentTerms', label: '付款方式', section: 'basic' },
  { key: 'deliveryTerms', label: '交货条款', section: 'basic' },
  { key: 'status', label: '状态', section: 'basic' },
  // 客户信息
  { key: 'customerName', label: '客户名称', section: 'customer' },
  { key: 'customerCountry', label: '国家', section: 'customer' },
  { key: 'customerEmail', label: '邮箱', section: 'customer' },
  { key: 'customerPhone', label: '电话', section: 'customer' },
  { key: 'customerCompany', label: '公司', section: 'customer' },
  { key: 'customerAddress', label: '地址', section: 'customer' },
  // 定价信息
  { key: 'preCommissionAmount', label: '折前含佣金额', section: 'pricing' },
  { key: 'commission', label: '佣金', section: 'pricing' },
  { key: 'postCommissionAmount', label: '折后含佣金额', section: 'pricing' },
  { key: 'userInvoice', label: '用户开票', section: 'pricing' },
  { key: 'salesType', label: '销售类型', section: 'pricing' },
  { key: 'businessDept', label: '业务部门', section: 'pricing' },
];
