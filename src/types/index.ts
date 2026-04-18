// 产品类型
export type ProductMode = 'standard' | 'custom';

// 一级品类
export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

// 二级品类
export interface SubCategory {
  id: string;
  name: string;
  specs: SpecOption[];
  colors: string[];
  sizes: string[];
  unit: string;
  filterGroups?: FilterGroup[];  // 专属筛选组（覆盖通用规格/颜色/尺寸）
}

// 规格选项
export interface SpecOption {
  value: string;
  label: string;
}

// 筛选组（每个子类别专属）
export interface FilterGroup {
  key: string;       // 对应产品属性 key，如 'installType' / 'flushType' / 'spec' / 'color'
  label: string;     // 展示名，如 "安装方式" / "规格" / "颜色"
  type: 'tag' | 'color';  // tag = 普通标签 color = 色块
  options: { value: string; label: string; colorHex?: string }[];
}

// 供应商
export interface Supplier {
  id: string;
  name: string;
  country: string;
  rating: number;   // 1-5
  tags?: string[];  // 如 ['OEM', '认证', '工厂直营']
}

// 供应商价格（支持多供应商）
export interface SupplierPrice {
  supplierId: string;
  supplierProductId?: string; // 供应商产品编号/货号
  price: number;               // 供货价格
  moq?: number;                // 最小起订量
  leadTime?: string;           // 交期
  remark?: string;             // 备注
}

// 标品产品项
export interface StandardProduct {
  id: string;
  libraryId?: string;         // 产品库ID（内部编号，如 LIB-2024-0001）
  supplierProductId?: string; // 供应商产品ID（供应商提供的型号/货号）
  categoryId: string;
  subCategoryId: string;
  name: string;
  spec: string;
  color: string;
  size: string;
  unit: string;
  moq: number;
  basePrice: number;
  imageUrl?: string;
  // 新增字段
  length?: number;   // 长 (mm)
  width?: number;    // 宽 (mm)
  height?: number;   // 高 (mm)
  weight?: number;   // 重量 (kg)
  description?: string; // 产品描述
  // 扩展属性（供 filterGroups 使用）
  attrs?: Record<string, string>;
  // 多供应商支持
  supplierId?: string;        // 默认供应商ID（兼容旧数据）
  supplierPrices?: SupplierPrice[]; // 多供应商价格列表
  // 产品标签
  tags?: ProductTag[];         // 标签列表（如热销、推荐、新品等）
  // 三级系列名（如"素色系列"/"玉石系列"，展示在产品卡上）
  seriesName?: string;
  // 条码支持（H5扫码）
  barcode?: string;           // 条形码（线下展厅产品）
  qrcode?: string;            // 二维码（线上/线下产品）
  source?: 'online' | 'showroom'; // 产品来源：线上/展厅
}

// 产品标签类型
export interface ProductTag {
  type: 'hot' | 'recommend' | 'new' | 'sale' | 'percent' | 'sample' | 'custom'; // 热销/推荐/新品/特价/百分产品/展厅样板/自定义
  label?: string;              // 自定义标签的文字（type为custom时必填）
  quoteCount?: number;         // 报价引用次数
}

// 报价行
export interface QuoteItem {
  id: string;
  type: 'standard' | 'custom';
  productId?: string;
  libraryId?: string;         // 产品库ID / 产品编号
  supplierProductId?: string; // 供应商产品ID / 型号
  productName: string;
  areaName?: string;          // 区域名称（如浴室、卧室、客厅），陶瓷模版专用
  categoryName?: string;      // 产品类型
  subCategoryName?: string;
  spec: string;
  color: string;
  size: string;
  length?: number;   // 长 (mm)
  width?: number;    // 宽 (mm)
  height?: number;   // 高 (mm)
  unit: string;
  quantity: number;
  basePrice?: number; // 产品库价格 / 参考价
  unitPrice: number;  // 单价
  totalPrice?: number; // 总价（自动计算）
  volume?: number;    // 体积 (m³)
  weight?: number;    // 重量 (kg)
  margin: number;    // 利润率 0~1（如 0.3 = 30%）
  remark?: string;
  description?: string; // 描述
  imageUrl?: string;
  regionId?: string; // 所属区域ID
}

// 区域（用于产品列表按区域分隔展示）
export interface Region {
  id: string;
  name: string;      // 如"主卧室"、"客厅"、"厨房"
  order: number;
  color?: string;    // 区域标签颜色（hex）
}

// 报价单
export interface Quote {
  id: string;
  quoteNo: string;
  customerName: string;
  customerCountry: string;
  createdAt: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'confirmed' | 'cancelled';
  items: AnyQuoteItem[];
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  templateId?: string;  // 报价单模版 ID（'default' | 'ceramic' | 'sanitary'）
  remark?: string;

  // ===== 业务系统扩展字段 =====

  // 基本信息
  quoteName?: string;           // 报价单名称
  customQuoteNo?: boolean;      // 是否自定义单号（默认false）
  preCommissionAmount?: number; // 折前含佣金额（只读，自动计算）
  postCommissionAmount?: number; // 折后含佣金额（只读，自动计算）
  commission?: number;           // 佣金（金额）
  userInvoice?: boolean;         // 是否用户开票（默认false）
  salesType?: string;           // 销售类型
  businessDept?: string;        // 业务部门

  // 其他人员
  collaborators?: string[];     // 协作人员列表
  collabRatio?: number;         // 协作比例（0~1）
  needDesigner?: boolean;       // 是否需要设计师（默认false）
  orderAssistant?: string;      // 跟单助理
  translator?: string;          // 翻译人员

  // Note
  depositRatio?: number;        // 定金比例（0~1，如 0.3 = 30%）
  packingMethods?: string[];    // 打包方式（多选：Wooden Box, Carton, Pallet）
  deliveryPlace?: string;      // 交货地点

  // 列表展示字段
  salesperson?: string;         // 报价人
  department?: string;          // 部门
  erpStatus?: string;           // ERP状态（如"已同步"、"待同步"、"同步失败"）

// ===== 非标品/组合品类型 =====

// 计价维度：按长度/宽度/面积 调整价格
export type PriceDimension = 'length' | 'width' | 'area';

// 组合品组件（单个配件）
export interface ComboComponent {
  id: string;
  name: string;                   // 组件名称，如"主柜"、"洗手盆"
  subCategoryId: string;           // 关联的子品类ID（用于选择具体产品）
  required: boolean;               // 是否必选
  // 基础规格（用于按尺寸算价）
  baseWidth?: number;              // 基础宽度 (mm)
  baseLength?: number;             // 基础长度 (mm)
  baseArea?: number;               // 基础面积 (m²)，如 baseWidth * baseLength / 1000000
  priceDimension: PriceDimension; // 按哪个维度调价
  basePrice: number;               // 基础单价（对应基础尺寸）
}

// 组合品（如浴室柜整体）
export interface ComboProduct {
  id: string;
  name: string;              // 组合品名称，如"浴室柜组合"
  description?: string;
  imageUrl?: string;
  components: ComboComponent[];
}

// 组合品子组件选中的具体产品
export interface ComboSelectedProduct {
  componentId: string;         // 组件ID（关联 ComboComponent）
  productId: string;            // 选中的产品ID
  libraryId?: string;
  supplierProductId?: string;
  productName: string;
  // 可调尺寸（计价维度）
  length?: number;
  width?: number;
  // 计价维度对应的尺寸值（用于算价）
  dimensionValue: number;      // 当前计价维度数值
  // 价格
  basePrice: number;           // 选中的产品基准价
  unitPrice: number;           // 当前单价（按尺寸调整后）
  quantity: number;
  unit: string;
  remark?: string;
}

// 报价单中的组合品行项
export interface ComboQuoteItem {
  id: string;
  type: 'combo';
  comboProductId: string;       // 组合品ID
  comboName: string;            // 组合品名称，如"浴室柜组合"
  imageUrl?: string;
  components: ComboSelectedProduct[];
  totalPrice: number;          // 各组件总价之和
  margin: number;
  remark?: string;
  regionId?: string;
}

// 联合类型：标品行项 + 组合品行项
export type AnyQuoteItem = QuoteItem | ComboQuoteItem;
