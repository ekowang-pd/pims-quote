// 报价单模版定义
// 每种部门/品类对应一套报价列模版

export type ColumnType = 'text' | 'number' | 'image' | 'calculated' | 'editable';

export interface QuoteColumn {
  key: string;         // 对应 QuoteItem 的字段名（特殊值：'no', 'image', 'action', 'total', 'subtotal'）
  label: string;       // 表头显示文字
  width?: string;      // 宽度，如 'w-16', 'min-w-[100px]'
  minWidth?: string;   // 最小宽度
  type?: ColumnType;
  editable?: boolean;  // 是否可编辑
  align?: 'left' | 'center' | 'right';
  // 计算型列
  calc?: (item: Record<string, unknown>) => number | string;
}

export interface QuoteTemplate {
  id: string;
  name: string;         // 模版名称，如 "陶瓷报价单"
  categoryIds: string[]; // 对应的品类 ID，用于自动检测
  columns: QuoteColumn[];
}

// ===== 陶瓷报价模版 =====
// No. | Area Picture | Area Name | Product Type | Item Number | Design |
// Length(mm) | Width(mm) | Total QTY | Unit |
// 产品库价格 | 折扣(%) | Unit Price (RMB) | Amount (RMB) |
// Description | PCS/CTN | SQM/CTN | Total CTN | Total PCS |
// Total Weight (KG) | CBM(m³) | Remarks
export const CERAMIC_TEMPLATE: QuoteTemplate = {
  id: 'ceramic',
  name: '陶瓷报价单',
  categoryIds: ['ceramic'],
  columns: [
    { key: 'no',              label: 'No.',              width: 'w-10',  align: 'center', type: 'text' },
    { key: 'image',           label: 'Area Picture',     width: 'w-16',  type: 'image' },
    { key: 'areaName',        label: 'Area Name',        minWidth: 'min-w-[120px]', editable: true, type: 'text' },
    { key: 'categoryName',    label: 'Product Type',     width: 'w-28',  type: 'text' },
    { key: 'libraryId',       label: 'Item Number',      width: 'w-28',  type: 'text' },
    { key: 'spec',            label: 'Design',           width: 'w-28',  editable: true, type: 'text' },
    { key: 'length',          label: 'Length(mm)',       width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'width',           label: 'Width(mm)',        width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'quantity',        label: 'Total QTY',        width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'unit',            label: 'Unit',             width: 'w-16',  editable: true, type: 'text' },
    { key: 'basePrice',       label: '产品库价格',        width: 'w-24',  type: 'number', align: 'right' },
    { key: 'discountPct',     label: '折扣(%)',           width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'unitPrice',       label: 'Unit Price (RMB)', width: 'w-28',  editable: true, type: 'number', align: 'right' },
    { key: 'amount',          label: 'Amount (RMB)',     width: 'w-28',  type: 'calculated', align: 'right',
      calc: (item) => {
        const q = Number(item.quantity) || 0;
        const p = Number(item.unitPrice) || 0;
        return q * p;
      }
    },
    { key: 'description',     label: 'Description',      minWidth: 'min-w-[120px]', editable: true, type: 'text' },
    { key: 'pcsPerCtn',       label: 'PCS/CTN',          width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'sqmPerCtn',       label: 'SQM/CTN',          width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'totalCtn',        label: 'Total CTN',        width: 'w-20',  type: 'calculated', align: 'right',
      calc: (item) => {
        const qty = Number(item.quantity) || 0;
        const pcs = Number(item.pcsPerCtn) || 0;
        if (!pcs) return '-';
        return Math.ceil(qty / pcs);
      }
    },
    { key: 'totalPcs',        label: 'Total PCS',        width: 'w-20',  type: 'calculated', align: 'right',
      calc: (item) => Number(item.quantity) || 0
    },
    { key: 'weight',          label: 'Total Weight (KG)',width: 'w-28',  editable: true, type: 'number', align: 'right' },
    { key: 'volume',          label: 'CBM(m³)',          width: 'w-20',  type: 'calculated', align: 'right',
      calc: (item) => {
        const l = Number(item.length) || 0;
        const w = Number(item.width) || 0;
        if (!l || !w) return item.volume ?? '-';
        // 陶瓷：长*宽*数量 / 1000000 (假设高度10mm = 0.01m)
        const h = Number(item.height) || 10;
        return ((l * w * h * (Number(item.quantity) || 1)) / 1e9).toFixed(3);
      }
    },
    { key: 'remark',          label: 'Remarks',          minWidth: 'min-w-[100px]', editable: true, type: 'text' },
    { key: 'action',          label: '',                 width: 'w-10',  type: 'text' },
  ],
};

// ===== 卫浴报价模版 =====
// No. | 组件图片 | 组件名称 | Item Number | Product Type |
// Picture | Length(mm) | Width(mm) | Height(mm) |
// Description | Unit | Quantity |
// 产品库价格 | 利润 | Unit Price (CNY) | Amount(CNY) |
// CBM(m³) | Weight(KG) | Remarks
export const SANITARY_TEMPLATE: QuoteTemplate = {
  id: 'sanitary',
  name: '卫浴报价单',
  categoryIds: ['sanitary'],
  columns: [
    { key: 'no',              label: 'No.',              width: 'w-10',  align: 'center', type: 'text' },
    { key: 'image',           label: '组件图片',          width: 'w-16',  type: 'image' },
    { key: 'productName',     label: '组件名称',          minWidth: 'min-w-[120px]', editable: true, type: 'text' },
    { key: 'libraryId',       label: 'Item Number',      width: 'w-28',  type: 'text' },
    { key: 'categoryName',    label: 'Product Type',     width: 'w-28',  type: 'text' },
    { key: 'image2',          label: 'Picture',          width: 'w-16',  type: 'image' },
    { key: 'length',          label: 'Length(mm)',       width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'width',           label: 'Width(mm)',        width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'height',          label: 'Height(mm)',       width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'description',     label: 'Description',      minWidth: 'min-w-[120px]', editable: true, type: 'text' },
    { key: 'unit',            label: 'Unit',             width: 'w-16',  editable: true, type: 'text' },
    { key: 'quantity',        label: 'Quantity',         width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'basePrice',       label: '产品库价格',        width: 'w-24',  type: 'number', align: 'right' },
    { key: 'margin',          label: '利润',             width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'unitPrice',       label: 'Unit Price (CNY)', width: 'w-28',  editable: true, type: 'number', align: 'right' },
    { key: 'amount',          label: 'Amount(CNY)',      width: 'w-28',  type: 'calculated', align: 'right',
      calc: (item) => {
        const q = Number(item.quantity) || 0;
        const p = Number(item.unitPrice) || 0;
        return q * p;
      }
    },
    { key: 'volume',          label: 'CBM(m³)',          width: 'w-20',  type: 'calculated', align: 'right',
      calc: (item) => {
        const l = Number(item.length) || 0;
        const w = Number(item.width) || 0;
        const h = Number(item.height) || 0;
        if (!l || !w || !h) return item.volume ?? '-';
        const qty = Number(item.quantity) || 1;
        return ((l * w * h * qty) / 1e9).toFixed(4);
      }
    },
    { key: 'weight',          label: 'Weight(KG)',       width: 'w-24',  editable: true, type: 'number', align: 'right' },
    { key: 'remark',          label: 'Remarks',          minWidth: 'min-w-[100px]', editable: true, type: 'text' },
    { key: 'action',          label: '',                 width: 'w-10',  type: 'text' },
  ],
};

// 通用模版（默认）
export const DEFAULT_TEMPLATE: QuoteTemplate = {
  id: 'default',
  name: '通用报价单',
  categoryIds: [],
  columns: [
    { key: 'no',           label: '#',           width: 'w-10',  align: 'center', type: 'text' },
    { key: 'image',        label: '图片',         width: 'w-16',  type: 'image' },
    { key: 'libraryId',    label: '产品编号',      width: 'w-28',  type: 'text' },
    { key: 'categoryName', label: '产品类型',      width: 'w-28',  type: 'text' },
    { key: 'productName',  label: '产品名称',      minWidth: 'min-w-[120px]', editable: true, type: 'text' },
    { key: 'spec',         label: '型号',          width: 'w-24',  editable: true, type: 'text' },
    { key: 'length',       label: '长(mm)',        width: 'w-18',  editable: true, type: 'number', align: 'right' },
    { key: 'width',        label: '宽(mm)',        width: 'w-18',  editable: true, type: 'number', align: 'right' },
    { key: 'height',       label: '高(mm)',        width: 'w-18',  editable: true, type: 'number', align: 'right' },
    { key: 'description',  label: '描述',          minWidth: 'min-w-[120px]', editable: true, type: 'text' },
    { key: 'quantity',     label: '数量',          width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'unit',         label: '单位',          width: 'w-14',  editable: true, type: 'text' },
    { key: 'basePrice',    label: '产品库价格',     width: 'w-24',  type: 'number', align: 'right' },
    { key: 'unitPrice',    label: '单价',          width: 'w-24',  editable: true, type: 'number', align: 'right' },
    { key: 'amount',       label: '总价',          width: 'w-24',  type: 'calculated', align: 'right',
      calc: (item) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
    },
    { key: 'volume',       label: '体积(m³)',       width: 'w-20',  type: 'calculated', align: 'right',
      calc: (item) => {
        const l = Number(item.length) || 0;
        const w = Number(item.width) || 0;
        const h = Number(item.height) || 0;
        if (!l || !w || !h) return item.volume ?? '-';
        return ((l * w * h) / 1e9).toFixed(4);
      }
    },
    { key: 'weight',       label: '重量(kg)',       width: 'w-20',  editable: true, type: 'number', align: 'right' },
    { key: 'remark',       label: '备注',          minWidth: 'min-w-[100px]', editable: true, type: 'text' },
    { key: 'action',       label: '',              width: 'w-10',  type: 'text' },
  ],
};

export const ALL_TEMPLATES: QuoteTemplate[] = [
  DEFAULT_TEMPLATE,
  CERAMIC_TEMPLATE,
  SANITARY_TEMPLATE,
];

// 根据报价单中的产品品类 ID 自动推断最合适的模版
export function detectTemplate(categoryIds: string[]): QuoteTemplate {
  if (!categoryIds.length) return DEFAULT_TEMPLATE;
  for (const tpl of ALL_TEMPLATES) {
    if (tpl.id === 'default') continue;
    if (tpl.categoryIds.some(cid => categoryIds.includes(cid))) {
      return tpl;
    }
  }
  return DEFAULT_TEMPLATE;
}
