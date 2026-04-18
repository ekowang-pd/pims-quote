// 报价单基本信息字段配置（编辑/详情共用）
// label: 字段显示名  key: 对应 Quote 字段  type: display/readonly/edit
// options: 下拉选项（edit 模式下显示）
// format: 格式化函数

export type InfoFieldType = 'text' | 'select' | 'radio' | 'percent' | 'multiselect' | 'textarea';

export interface InfoFieldConfig {
  key: string;
  label: string;
  type: InfoFieldType;
  section: 'basic' | 'staff' | 'customer' | 'terms';
  options?: { value: string; label: string }[];
  format?: (value: unknown, quote: Record<string, unknown>) => string;
}

const fmtPercent = (v: unknown) => {
  const n = Number(v);
  return isNaN(n) ? '-' : `${(n * 100).toFixed(0)}%`;
};

const fmtBool = (v: unknown) => v ? '是' : '否';

export const QUOTE_INFO_FIELDS: InfoFieldConfig[] = [
  // === 基本信息 ===
  { key: 'quoteName',     label: '报价单名称', type: 'text',     section: 'basic' },
  { key: 'customQuoteNo', label: '自定义单号', type: 'radio',    section: 'basic', options: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }] },
  { key: 'preCommissionAmount', label: '折前含佣金额', type: 'readonly', section: 'basic', format: (v) => v ? String(v) : '-' },
  { key: 'postCommissionAmount', label: '折后含佣金额', type: 'readonly', section: 'basic', format: (v) => v ? String(v) : '-' },
  { key: 'commission',   label: '佣金',        type: 'text',     section: 'basic' },
  { key: 'userInvoice',  label: '用户开票',    type: 'radio',    section: 'basic', options: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }] },
  { key: 'salesType',    label: '销售类型',    type: 'select',    section: 'basic', options: [{ value: '内销', label: '内销' }, { value: '外销', label: '外销' }] },
  { key: 'businessDept', label: '业务部门',    type: 'select',    section: 'basic', options: [{ value: '陶瓷部', label: '陶瓷部' }, { value: '卫浴部', label: '卫浴部' }, { value: '灯具部', label: '灯具部' }] },

  // === 其他人员 ===
  { key: 'collaborators', label: '协作人员',   type: 'text',     section: 'staff' },
  { key: 'collabRatio',   label: '协作比例',   type: 'select',   section: 'staff', options: [{ value: '0.1', label: '10%' }, { value: '0.2', label: '20%' }, { value: '0.3', label: '30%' }, { value: '0.4', label: '40%' }, { value: '0.5', label: '50%' }] },
  { key: 'needDesigner',  label: '需设计师',   type: 'radio',   section: 'staff', options: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }] },
  { key: 'orderAssistant', label: '跟单助理',   type: 'text',    section: 'staff' },
  { key: 'translator',    label: '翻译人员',    type: 'text',    section: 'staff' },

  // === 客户信息 ===
  { key: 'customerName',  label: '客户名称',   type: 'text',    section: 'customer' },
  { key: 'customerCountry', label: '目标国家', type: 'text',    section: 'customer' },
  { key: 'createdAt',     label: '报价日期',    type: 'text',    section: 'customer' },
  { key: 'validUntil',    label: '有效期至',    type: 'text',    section: 'customer' },

  // === 条款 ===
  { key: 'currency',      label: '报价币种',   type: 'select',   section: 'terms', options: [{ value: 'USD', label: 'USD' }, { value: 'RMB', label: 'RMB' }, { value: 'EUR', label: 'EUR' }] },
  { key: 'paymentTerms',  label: '付款方式',   type: 'text',    section: 'terms' },
  { key: 'deliveryTerms', label: '贸易术语',   type: 'select',   section: 'terms', options: [{ value: 'EXW', label: 'EXW' }, { value: 'FOB', label: 'FOB' }, { value: 'CIF', label: 'CIF' }, { value: 'DDP', label: 'DDP' }, { value: 'DAP', label: 'DAP' }] },
  { key: 'depositRatio',  label: '定金比例',   type: 'percent',  section: 'terms', format: fmtPercent },
  { key: 'deliveryPlace', label: '交货地点',   type: 'text',    section: 'terms' },
  { key: 'packingMethods', label: '打包方式',  type: 'multiselect', section: 'terms',
    options: [{ value: 'Wooden Box', label: 'Wooden Box' }, { value: 'Carton', label: 'Carton' }, { value: 'Pallet', label: 'Pallet' }] },
  { key: 'remark',        label: '条款',       type: 'textarea', section: 'terms' },
];

export const QUOTE_INFO_SECTIONS = [
  { key: 'basic',    label: '基本信息' },
  { key: 'staff',    label: '其他人员' },
  { key: 'customer', label: '客户信息' },
  { key: 'terms',    label: '条款' },
];
