import { useState, useCallback, useMemo, useEffect } from 'react';
import mirrorSingleImg from '../../public/mirror-single.png';
import mirrorCabinetImg from '../../public/mirror-cabinet.png';
import type { QuoteItem } from '../types';
import type { BasinType, MirrorAreaOption, MirrorLengthOption } from '../data/vanityConfig';
import {
  VANITY_IMAGES,
  VANITY_INSTALL_TYPES,
  VANITY_HANGING_CABINET_TYPES,
  VANITY_FLOOR_CABINET_TYPES,
  VANITY_CABINET_ADDONS,
  VANITY_EXTRA_ADDONS,
  VANITY_PACKING_ITEMS,
  VANITY_INSTALL_TYPES_BASIN,
  VANITY_BASIN_TYPES,
  VANITY_PLAIN_MIRROR_TYPES,
  VANITY_PLAIN_CABINET_TYPES,
  VANITY_SMART_MIRROR_TYPES,
  VANITY_SMART_CABINET_TYPES,
  VANITY_PLAIN_SINGLE_MIRROR_OPTIONS,
  VANITY_PLAIN_WOOD_LENGTH_OPT,
  VANITY_PLAIN_CABINET_MIRROR_OPT,
  VANITY_CABINET_MIRROR_MATERIALS,
  VANITY_SMART_SINGLE_MIRROR_OPTIONS,
  VANITY_SMART_WOOD_LENGTH_OPT_BACKLIGHT,
  VANITY_SMART_WOOD_LENGTH_OPT_SAND,
  VANITY_SMART_CABINET_MIRROR_OPT_BACKLIGHT,
  VANITY_SMART_CABINET_MIRROR_OPT_SAND,
  VANITY_R_CORNER_PRICE,
  VANITY_PLAIN_WOOD_PRICE,
  VANITY_PLAIN_CABINET_PRICE,
  VANITY_SMART_WOOD_BACKLIGHT,
  VANITY_SMART_WOOD_SAND,
  VANITY_SMART_CABINET_BACKLIGHT,
  VANITY_SMART_CABINET_SAND,
  VANITY_SIDE_CABINET_PRICE_PER_M,
  VANITY_OPEN_SHELF_PRICE_PER_M,
  VANITY_AMERICAN_STYLE_PRICE,
  VANITY_GLASS_SHELF_PRICE,
  VANITY_SHELF_LIGHT_PRICE,
  VANITY_GLASS_DOOR_PRICE,
  VANITY_ALU_GLASS_DOOR_PRICE,
  VANITY_WOOD_MATERIALS,
} from '../data/vanityConfig';

type Tab = 'cabinet' | 'basin' | 'mirror' | 'packing';

// ===== 柜体配置状态 =====
interface CabinetConfig {
  installType: string;
  cabinetType: string;
  material: string;
  cabinetLength: number;
  cabinetAddons: Record<string, { optionId: string; qty: number }>;
  extraAddons: Record<string, { optionId: string; qty: number; length?: number }>;
  colorChange: boolean;
  /** 主柜夹板打包是否启用 */
  cabinetPackingEnabled: boolean;
}

// ===== 台盆配置状态 =====
interface BasinConfig {
  installType: string;
  materialId: string;
  countertopId: string;
  countertopLength: number;
  basinItems: Record<string, number>;
  extraItems: Record<string, number>;
  /** 配置项的长度输入值 */
  extraLengthInputs: Record<string, number>;
  rewanEdgeSelectedOption?: string;
  rewanEdgeLength?: number;
  /** 下拉型台盆选项（如"陶瓷台上盆"）选中的子材质 id */
  basinDropdownSelections: Record<string, string>;
  /** 台面打包：用户选择类型 'board'=夹板打包, 'wood'=夹板木箱打包 */
  countertopPackingType: 'board' | 'wood';
  /** 台面打包：用户输入的长度(mm) */
  countertopPackingLength: number;
  /** 热弯一体盆：选中的子选项 'white' | 'other' */
  rewanSelectedOption: string;
  /** 热弯一体盆：用户输入的长度(mm) */
  rewanLength: number;
}

// ===== 镜面配置状态 =====
interface MirrorConfig {
  // 一级：plain / smart
  mirrorCategory: 'plain' | 'smart';
  // 二级：false=单镜, true=镜柜
  isCabinet: boolean;
  // 镜子长度(mm)
  mirrorLength: number;
  // 面积输入(m²)，用于面积型镜面
  mirrorArea: number;
  // 镜面选中的 optionId（动态类型）
  mirrorSurfaceId: string;
  // 镜面R角选中状态（用于长度型）
  mirrorRC: boolean;
  // 镜柜木材型镜面：选中的木材材质 + 镜面长度（用于 hasLengthInput 类型）
  cabinetMirrorWoodType: string;
  cabinetMirrorLength: number;
  // 面积模式：'area'=面积(m²), 'rCorner'=倒R角面积(m²)
  mirrorAreaMode: 'area' | 'rCorner';
  // 木材类型（用于木框/木柜类）
  woodType: string;
  // 侧柜/开放格数量
  sideCabinetQty: number;
  openShelfQty: number;
  // 侧柜/开放格木材类型
  addonWoodType: string;
  americanStyle: boolean;
  glassShelf: boolean;
  shelfLight: boolean;
  glassDoor: boolean;
  aluGlassDoor: boolean;
  /** 浴室镜夹板打包是否启用 */
  mirrorPackingEnabled: boolean;
}

// ===== 镜柜额外配置 =====
interface MirrorCabinetExtra {
  hinge: string;
  railHettich: string;
  blumUpgrade: string;
  horseDrawer: string;
  magicDrawer: string;
  tissueHole: string;
  beautyShelf: string;
  hairdryerHolder: string;
  powerOutlet: string;
  shelfMulti: string;
}

// ===== 工具函数：格式化价格 =====
const fmt = (n: number) => `¥${n.toFixed(0)}`;

// ===== 数量控制组件 =====
function QtyControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm font-medium"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm font-medium"
      >
        +
      </button>
    </div>
  );
}

// ===== 小计行组件 =====
function SubtotalRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg mt-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-red-500">{fmt(amount)}</span>
    </div>
  );
}

// ===== 图片卡片（选择类） =====
function ImageCard({
  label,
  image,
  selected,
  onClick,
  fallbackEmoji = '🪵',
}: {
  label: string;
  image?: string;
  selected: boolean;
  onClick: () => void;
  fallbackEmoji?: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        selected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
      }`}
      style={{ minHeight: 56 }}
    >
      {image && !imgError ? (
        <img
          src={image}
          alt={label}
          className="w-24 aspect-square object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-24 aspect-square bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">{fallbackEmoji}</span>
        </div>
      )}
      <div
        className={`px-2 py-1.5 text-center ${selected ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
      >
        <span className="text-sm font-medium">{label}</span>
      </div>
    </button>
  );
}

// ===== 数量型网格卡片（台盆/柜体增配）=====
function QtyGridCard({
  icon, name, priceLabel, price,
  value, onChange,
}: {
  icon: string;
  name: string;
  priceLabel: string;
  price: number;
  value: number;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-base flex-shrink-0">{icon}</span>
        <span className="text-sm font-medium text-gray-700 leading-tight">{name}</span>
      </div>
      <div className="text-xs text-gray-400">{priceLabel}</div>
      <div className="flex items-center justify-between">
        <QtyControl value={value} onChange={onChange} />
        <span className="text-sm font-semibold text-red-500">
          {price > 0 ? fmt(price * value) : '¥0'}
        </span>
      </div>
    </div>
  );
}

// ===== 开关型网格卡片（浴室镜配件）=====
function ToggleGridCard({
  icon, name, price, priceLabel,
  value, onChange,
}: {
  icon: string;
  name: string;
  price: number;
  priceLabel?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-base flex-shrink-0">{icon}</span>
        <span className="text-sm font-medium text-gray-700 leading-tight">{name}</span>
      </div>
      <div className="text-xs text-gray-400">
        {priceLabel || (price > 0 ? `¥${price}` : '免费')}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onChange(!value)}
          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
            value ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${
            value ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
        {value && (
          <span className="text-sm font-semibold text-red-500">
            {price > 0 ? `¥${price}` : '✓'}
          </span>
        )}
      </div>
    </div>
  );
}

// ===== 镜面选项卡片（面积型/长度型/R角型）=====
function MirrorSurfaceOptionCard({
  icon,
  name,
  selected,
  onClick,
  priceLabel,
  children,
}: {
  icon: string;
  name: string;
  selected: boolean;
  onClick: () => void;
  priceLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{icon}</span>
          <span className={`text-sm font-medium ${selected ? 'text-blue-700' : 'text-gray-700'}`}>{name}</span>
          {priceLabel && (
            <span className="ml-auto text-xs text-gray-400">{priceLabel}</span>
          )}
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-auto ${
            selected ? 'border-blue-500' : 'border-gray-300'
          }`}>
            {selected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
          </div>
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

// ===== 紧凑网格增配卡片（四列布局）=====
type AddonOption = {
  id: string;
  label: string;
  price: number;
  priceType?: 'length' | 'unit';
  priceFormula?: (e: number) => number;
  priceFormulaStr?: string;
};

function AddonGridCard({
  icon,
  name,
  options,
  value,
  onChange,
  hasLengthInput = false,
}: {
  icon: string;
  name: string;
  options: AddonOption[];
  value: { optionId: string; qty: number; length?: number } | undefined;
  onChange: (v: { optionId: string; qty: number; length?: number }) => void;
  hasLengthInput?: boolean; // 长度输入型选项卡（选项+输入框）
}) {
  const effectiveOptionId = value?.optionId || options[0]?.id || '';
  const effectiveQty = value?.qty ?? 0;
  const effectiveLength = value?.length ?? 0;

  // 长度型增配：挂载时若 value 未初始化，自动写入默认值（qty=0，长度0），确保 extraAddonPrice 能正确处理
  useEffect(() => {
    if (hasLengthInput && !value) {
      onChange({ optionId: options[0]?.id || '', qty: 0, length: 0 });
    }
  // 仅在挂载时执行一次
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const selectedOpt = options.find(o => o.id === effectiveOptionId);
  const isLengthBased = selectedOpt?.priceType === 'length';
  const pricePerUnit = (isLengthBased && effectiveLength === 0)
    ? 0
    : (selectedOpt?.priceFormula
      ? Math.round(selectedOpt.priceFormula(effectiveLength))
      : (selectedOpt?.price || 0));
  const subtotal = isLengthBased ? pricePerUnit : pricePerUnit * effectiveQty;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 min-w-0">
      {/* 顶部：图标 + 名称 */}
      <div className="flex items-center gap-1.5">
        <span className="text-base flex-shrink-0">{icon}</span>
        <span className="text-sm font-medium text-gray-700 leading-tight">{name}</span>
      </div>

      {/* 下拉选择 */}
      <select
        value={effectiveOptionId}
        onChange={e => onChange({ optionId: e.target.value, qty: 1, length: effectiveLength })}
        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-gray-50"
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.label} {opt.price > 0 ? `+¥${opt.price}` : ''}
          </option>
        ))}
      </select>

      {/* 数量或长度输入 */}
      {hasLengthInput ? (
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          <input
            type="number"
            value={effectiveLength}
            step={100}
            min={0}
            onChange={e => onChange({ optionId: effectiveOptionId, qty: effectiveQty, length: parseInt(e.target.value) || 0 })}
            className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <span className="text-xs text-gray-400">mm</span>
          <span className="text-sm font-semibold text-red-500 ml-auto">
            {subtotal > 0 ? fmt(subtotal) : '¥0'}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {!isLengthBased && (
            <QtyControl
              value={effectiveQty}
              onChange={qty => {
                if (qty === 0) {
                  onChange({ optionId: '', qty: 0 } as any);
                } else {
                  onChange({ optionId: effectiveOptionId, qty });
                }
              }}
            />
          )}
          <span className={`text-sm font-semibold text-red-500 ${isLengthBased ? 'ml-auto' : ''}`}>
            {subtotal > 0 ? fmt(subtotal) : '¥0'}
          </span>
        </div>
      )}
    </div>
  );
}

// ===== 行式增配卡片 =====
function AddonRowCard({
  icon,
  name,
  options,
  value,
  onChange,
}: {
  icon: string;
  name: string;
  options: Array<{ id: string; label: string; price: number }>;
  value: { optionId: string; qty: number } | undefined;
  onChange: (v: { optionId: string; qty: number }) => void;
}) {
  const selectedOpt = options.find(o => o.id === value?.optionId);
  const pricePerUnit = selectedOpt?.price || 0;
  const subtotal = pricePerUnit * (value?.qty || 0);

  return (
    <div className={`flex items-center gap-3 px-3 py-3 bg-white rounded-xl border ${selectedOpt ? 'border-blue-200' : 'border-gray-100'} transition-colors`}>
      <div className="text-xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 mb-1">{name}</div>
        <select
          value={value?.optionId || ''}
          onChange={e => onChange({ optionId: e.target.value, qty: value?.qty || 1 })}
          className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-gray-50"
        >
          <option value="">选择规格...</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.label} {opt.price > 0 ? `+¥${opt.price}/个` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {selectedOpt && (
          <>
            <QtyControl
              value={value?.qty || 0}
              onChange={qty => onChange({ optionId: value!.optionId, qty })}
            />
            <div className="w-16 text-right text-xs font-semibold text-red-500">
              {subtotal > 0 ? fmt(subtotal) : '¥0'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===== 台盆下拉型卡片（行式布局）=====
function BasinDropdownRow({
  icon,
  name,
  dropdownOptions,
  selectedId,
  qty,
  onSelectChange,
  onQtyChange,
}: {
  icon: string;
  name: string;
  dropdownOptions: Array<{ id: string; label: string; unitPrice: number }>;
  selectedId: string;
  qty: number;
  onSelectChange: (id: string) => void;
  onQtyChange: (qty: number) => void;
}) {
  const selectedOpt = dropdownOptions.find(d => d.id === selectedId);
  const subtotal = (selectedOpt?.unitPrice || 0) * qty;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-gray-200 transition-colors">
      <div className="text-base flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{name}</div>
        <select
          value={selectedId}
          onChange={e => onSelectChange(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-gray-50 mt-1"
        >
          <option value="">选材质...</option>
          {dropdownOptions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.label} {opt.unitPrice > 0 ? `¥${opt.unitPrice}/个` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <QtyControl value={qty} onChange={onQtyChange} />
        <div className="w-16 text-right text-sm font-semibold text-red-500">
          {subtotal > 0 ? fmt(subtotal) : '¥0'}
        </div>
      </div>
    </div>
  );
}

// ===== 布尔型增配行 =====
function BoolAddonRow({
  icon,
  name,
  price,
  note,
  value,
  onChange,
}: {
  icon: string;
  name: string;
  price: number;
  note?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 bg-white rounded-xl border border-gray-100 transition-colors">
      <div className="text-xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{name}</div>
        {note && <div className="text-xs text-gray-400">{note}</div>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-xs text-gray-500 mr-1">{fmt(price)}/套</div>
        <QtyControl value={value} onChange={onChange} />
        {value > 0 && (
          <div className="w-16 text-right text-xs font-semibold text-blue-600">{fmt(price * value)}</div>
        )}
      </div>
    </div>
  );
}

// ===== 单选项组 =====
function RadioGroup({
  options,
  value,
  onChange,
  priceLabel,
}: {
  options: Array<{ id: string; label: string; price?: number; note?: string }>;
  value: string;
  onChange: (id: string) => void;
  priceLabel?: (price: number) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            value === opt.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            value === opt.id ? 'border-blue-500' : 'border-gray-300'
          }`}>
            {value === opt.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
          </div>
          <div>
            <div className="text-sm font-medium">{opt.label}</div>
            {opt.price !== undefined && (
              <div className="text-xs text-gray-400">
                {priceLabel ? priceLabel(opt.price) : `${fmt(opt.price)}/m²`}
              </div>
            )}
            {opt.note && <div className="text-xs text-gray-400">{opt.note}</div>}
          </div>
        </button>
      ))}
    </div>
  );
}

// ===== Section 标题 =====
function SectionTitle({ icon, title, note }: { icon: string; title: string; note?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base">{icon}</span>
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {note && <span className="text-xs text-gray-400">{note}</span>}
    </div>
  );
}

export interface VanityCabinetConfiguratorProps {
  onAdd: (items: QuoteItem[]) => void;
  onClose: () => void;
}

export function VanityCabinetConfigurator({ onAdd, onClose }: VanityCabinetConfiguratorProps) {
  const [tab, setTab] = useState<Tab>('cabinet');

  // ===== 柜体状态 =====
  const [cabinet, setCabinet] = useState<CabinetConfig>({
    installType: 'hanging',
    cabinetType: 'hanging-mianqi',
    material: 'mianqi',
    cabinetLength: 800,
    cabinetAddons: {},
    extraAddons: {},
    colorChange: false,
    cabinetPackingEnabled: false,
  });

  // ===== 台盆状态 =====
  const [basin, setBasin] = useState<BasinConfig>({
    installType: 'above',
    materialId: 'shiying',
    countertopId: 'single-layer',
    countertopLength: 800,
    basinItems: {},
    basinDropdownSelections: {},
    extraLengthInputs: {},
    rewanEdgeSelectedOption: undefined,
    rewanEdgeLength: 0,
    extraItems: {},
    countertopPackingType: 'board',
    countertopPackingLength: 0,
    rewanSelectedOption: '',
    rewanLength: 0,
  });

  // ===== 镜面状态 =====
  const [mirror, setMirror] = useState<MirrorConfig>({
    mirrorCategory: 'plain',
    isCabinet: false,
    mirrorLength: 800,
    mirrorArea: 0.6,
    mirrorSurfaceId: 'no-border',
    mirrorRC: false,
    mirrorAreaMode: 'area',
    cabinetMirrorWoodType: 'mianqi',
    cabinetMirrorLength: 800,
    woodType: 'mianqi',
    sideCabinetQty: 0,
    openShelfQty: 0,
    addonWoodType: 'mianqi',
    americanStyle: false,
    glassShelf: false,
    shelfLight: false,
    glassDoor: false,
    aluGlassDoor: false,
    mirrorPackingEnabled: false,
  });

  // ===== 柜体计价 =====
  const cabinetPrice = useMemo(() => {
    const types = cabinet.installType === 'hanging' ? VANITY_HANGING_CABINET_TYPES : VANITY_FLOOR_CABINET_TYPES;
    const typeData = types.find(t => t.id === cabinet.cabinetType);
    if (!typeData) return 0;
    const mat = typeData.materials.find(m => m.id === cabinet.material);
    if (!mat) return 0;
    return Math.round(mat.priceFormula(cabinet.cabinetLength) * 100) / 100;
  }, [cabinet]);

  const cabinetAddonPrice = useMemo(() => {
    let total = 0;
    Object.entries(cabinet.cabinetAddons).forEach(([addonId, val]) => {
      if (!val.optionId) return;
      // 用 addonId 直接查找 addon，避免多个 addon 有相同 optionId 时匹配错误
      const addon = VANITY_CABINET_ADDONS.find(a => a.id === addonId);
      if (!addon) return;
      const opt = addon.options.find(o => o.id === val.optionId);
      if (!opt) return;
      total += opt.price * val.qty;
    });
    return Math.round(total);
  }, [cabinet]);

  const extraAddonPrice = useMemo(() => {
    let total = 0;
    Object.entries(cabinet.extraAddons).forEach(([addonId, val]) => {
      if (!val.optionId) return;
      const addon = VANITY_EXTRA_ADDONS.find(a => a.id === addonId) as any;
      if (!addon) return;
      const opt = addon.options.find((o: any) => o.id === val.optionId);
      if (!opt) return;
      const len = (val.length ?? cabinet.cabinetLength);
      const unitPrice = opt.priceFormula
        ? Math.round(opt.priceFormula(len))
        : opt.price;
      const isLengthBased = opt.priceType === 'length';
      total += isLengthBased ? unitPrice : unitPrice * val.qty;
    });
    return Math.round(total);
  }, [cabinet]);

  const packingPrice = useMemo(() => {
    let total = 0;
    // 主柜打包（可选）：吊柜=MAX(len,800)/1000*80，主柜=MAX(len,800)/1000*100
    if (cabinet.cabinetPackingEnabled && cabinet.cabinetLength > 0) {
      const baseLen = Math.max(Math.ceil(cabinet.cabinetLength / 100) * 100, 800);
      const rate = cabinet.cabinetType.startsWith('hanging') ? 80 : 100;
      total += (baseLen / 1000) * rate;
    }
    // 台面打包：夹板打包=MAX(len,800)/1000*90，夹板木箱=MAX(len,800)/1000*180
    if (basin.countertopPackingLength > 0) {
      const baseLen = Math.max(Math.ceil(basin.countertopPackingLength / 100) * 100, 800);
      const rate = basin.countertopPackingType === 'wood' ? 180 : 90;
      total += (baseLen / 1000) * rate;
    }
    // 浴室镜打包（可选）：单镜=MAX(len,800)/1000*70，镜柜=MAX(len,800)/1000*80
    if (mirror.mirrorPackingEnabled && mirror.mirrorLength > 0) {
      const baseLen = Math.max(Math.ceil(mirror.mirrorLength / 100) * 100, 800);
      const rate = mirror.isCabinet ? 80 : 70;
      total += (baseLen / 1000) * rate;
    }
    return Math.round(total);
  }, [cabinet, basin, mirror]);

  // ===== 台盆计价 =====
  const basinPrice = useMemo(() => {
    const installType = VANITY_BASIN_TYPES[basin.installType as keyof typeof VANITY_BASIN_TYPES] as BasinType;
    const material = installType?.materials.find(m => m.id === basin.materialId);
    if (!material) return 0;

    let total = 0;

    // 1. 台面计价
    const countertop = material.countertopOptions.find(c => c.id === basin.countertopId);
    if (countertop && countertop.priceFormula) {
      total += Math.round(countertop.priceFormula(basin.countertopLength) * 100) / 100;
    }

    // 2. 台盆选项计价（basinMaterialOptions: dropdown类型）
    material.basinMaterialOptions?.forEach(opt => {
      const qty = basin.basinItems[opt.id] || 0;
      if (qty <= 0) return;
      if (opt.dropdown) {
        // dropdown类型：取选中项的unitPrice
        const selId = basin.basinDropdownSelections[opt.id] || opt.dropdown[0].id;
        const selItem = opt.dropdown.find(d => d.id === selId);
        total += (selItem?.unitPrice || 0) * qty;
      } else {
        // 普通计数器类型
        total += (opt.unitPrice || 0) * qty;
      }
    });

    // 3. 台盆选项计价（basinOptions）
    Object.entries(basin.basinItems).forEach(([optId, qty]) => {
      if (!optId || qty <= 0) return;
      // 跳过basinMaterialOptions已处理的（台下盆没有dropdown）
      const opt = material.basinOptions?.find(b => b.id === optId);
      if (opt) {
        if (opt.priceType === 'unit') total += (opt.unitPrice || 0) * qty;
        else if (opt.priceFormula) total += Math.round(opt.priceFormula(basin.countertopLength) * 100) / 100;
      }
    });

    // 3b. 热弯一体盆按长度计价（hasLengthInput类型）
    const rewanOpt = material.basinOptions?.find(b => b.id === 'rewan');
    if (rewanOpt?.hasLengthInput && basin.rewanSelectedOption && basin.rewanLength > 0) {
      const sub = rewanOpt.options?.find(s => s.id === basin.rewanSelectedOption);
      if (sub?.priceFormula) total += Math.round(sub.priceFormula(basin.rewanLength) * 100) / 100;
    }

    // 3c. 热弯一体盆吊边按长度计价（hasLengthInput类型）
    const rewanEdgeOpt = material.extraOptions?.find(e => e.id === 'rewan-edge' && e.hasLengthInput);
    if (rewanEdgeOpt && basin.rewanEdgeSelectedOption && basin.rewanEdgeLength > 0) {
      const sub = rewanEdgeOpt.options?.find(s => s.id === basin.rewanEdgeSelectedOption);
      if (sub?.priceFormula) total += Math.round(sub.priceFormula(basin.rewanEdgeLength) * 100) / 100;
    }

    // 4. 台中盆单加（按数量×basinQtyUnitPrice）
    const taizhongQty = basin.extraItems['taizhong'] || 0;
    if (taizhongQty > 0 && material.basinQtyUnitPrice) {
      total += material.basinQtyUnitPrice * taizhongQty;
    }

    // 5. 配置项按长度计价（挡水边/吊边/超2米等）
    Object.entries(basin.extraLengthInputs).forEach(([optId, len]) => {
      if (!optId || len <= 0) return;
      const opt = material.extraOptions?.find(e => e.id === optId);
      if (opt && opt.priceFormula) total += Math.round(opt.priceFormula(len) * 100) / 100;
    });

    return Math.round(total * 100) / 100;
  }, [basin]);

  // ===== 镜面计价 =====
  const mirrorPrice = useMemo(() => {
    const { mirrorCategory, isCabinet, mirrorLength, mirrorArea, mirrorSurfaceId, mirrorRC, mirrorAreaMode, woodType, cabinetMirrorWoodType, cabinetMirrorLength } = mirror;
    const L = mirrorLength;
    const A = mirrorArea;

    // 查找当前选中的镜面选项
    let opt: { pricePerSqm?: number; pricePerMeter?: Record<string, number>; rCornerExtra?: number; hasLengthInput?: boolean; woodSubtract100?: boolean } | null = null;

    if (mirrorCategory === 'plain' && !isCabinet) {
      // 普通镜-单镜
      opt = VANITY_PLAIN_SINGLE_MIRROR_OPTIONS.find(o => o.id === mirrorSurfaceId) || null;
    } else if (mirrorCategory === 'plain' && isCabinet) {
      // 普通镜-镜柜
      opt = VANITY_PLAIN_CABINET_MIRROR_OPT.id === mirrorSurfaceId ? VANITY_PLAIN_CABINET_MIRROR_OPT : null;
    } else if (mirrorCategory === 'smart' && !isCabinet) {
      // 智能镜-单镜
      opt = VANITY_SMART_SINGLE_MIRROR_OPTIONS.find(o => o.id === mirrorSurfaceId) || null;
    } else if (mirrorCategory === 'smart' && isCabinet) {
      // 智能镜-镜柜
      if (mirrorSurfaceId === 'smart-cabinet-backlight') opt = VANITY_SMART_CABINET_MIRROR_OPT_BACKLIGHT;
      else if (mirrorSurfaceId === 'smart-cabinet-sand') opt = VANITY_SMART_CABINET_MIRROR_OPT_SAND;
    }

    if (!opt) return 0;

    // 面积型：MAX(面积, 0.6) * pricePerSqm (+R角型再+60)
    if (opt.pricePerSqm !== undefined) {
      const rExtra = mirrorAreaMode === 'rCorner' ? (opt.rCornerExtra || 0) : 0;
      return Math.round(Math.max(A, 0.6) * opt.pricePerSqm + rExtra);
    }

    // hasLengthInput 型（镜柜三合一）：选项+材质下拉+长度输入
    if (opt.hasLengthInput && opt.pricePerMeter) {
      const coef = opt.pricePerMeter[cabinetMirrorWoodType] || 0;
      const baseLen = Math.max(Math.ceil(cabinetMirrorLength / 100) * 100, 800);
      const total = (baseLen / 1000) * coef;
      // 需要减100的情况：
      // 1. 普通镜-单镜 的木框包边（wood）
      // 2. 普通镜柜 的木材镜柜（plain-cabinet-wood，woodSubtract100=true）
      const subtract100 =
        (mirrorCategory === 'plain' && !isCabinet && mirrorSurfaceId === 'wood') ||
        (opt.woodSubtract100 && mirrorCategory === 'plain' && isCabinet);
      return Math.round(subtract100 ? total - 100 : total);
    }

    // 普通长度型：MAX(长度, 800) / 1000 * 系数 - 100 + R角
    if (opt.pricePerMeter) {
      const coef = opt.pricePerMeter[woodType] || 650;
      const rExtra = mirrorRC ? (opt.rCornerExtra || 0) : 0;
      return Math.round(Math.max(L, 800) / 1000 * coef - 100 + rExtra);
    }

    return 0;
  }, [mirror]);

  const mirrorAddonPrice = useMemo(() => {
    let total = 0;
    // 侧柜/开放格按数量×材质单价
    if (mirror.sideCabinetQty > 0) {
      total += mirror.sideCabinetQty * (VANITY_SIDE_CABINET_PRICE_PER_M[mirror.addonWoodType] || 260);
    }
    if (mirror.openShelfQty > 0) {
      total += mirror.openShelfQty * (VANITY_OPEN_SHELF_PRICE_PER_M[mirror.addonWoodType] || 200);
    }
    if (mirror.americanStyle) total += VANITY_AMERICAN_STYLE_PRICE;
    if (mirror.glassShelf) total += VANITY_GLASS_SHELF_PRICE;
    if (mirror.shelfLight) total += VANITY_SHELF_LIGHT_PRICE;
    if (mirror.glassDoor) total += VANITY_GLASS_DOOR_PRICE;
    if (mirror.aluGlassDoor) total += VANITY_ALU_GLASS_DOOR_PRICE;
    return Math.round(total);
  }, [mirror]);

  // ===== 总价 =====
  const totalPrice = useMemo(() => {
    return cabinetPrice + cabinetAddonPrice + extraAddonPrice
      + basinPrice
      + mirrorPrice + mirrorAddonPrice
      + packingPrice;
  }, [cabinetPrice, cabinetAddonPrice, extraAddonPrice, basinPrice, mirrorPrice, mirrorAddonPrice, packingPrice]);

  // ===== 生成报价项 =====
  const generateQuoteItems = useCallback((): QuoteItem[] => {
    const items: QuoteItem[] = [];

    if (cabinet.cabinetLength > 0) {
      const types = cabinet.installType === 'hanging' ? VANITY_HANGING_CABINET_TYPES : VANITY_FLOOR_CABINET_TYPES;
      const typeData = types.find(t => t.id === cabinet.cabinetType);
      const mat = typeData?.materials.find(m => m.id === cabinet.material);
      const cabinetTotal = Math.round((cabinetPrice + cabinetAddonPrice + extraAddonPrice) * 100) / 100;
      items.push({
        id: `vc_${Date.now()}_1`,
        type: 'custom',
        productName: `${typeData?.label || '浴室柜'} - ${mat?.label || cabinet.material}`,
        spec: `${cabinet.cabinetLength}mm`,
        color: mat?.label || cabinet.material,
        size: `${cabinet.cabinetLength}mm`,
        unit: '套',
        quantity: 1,
        unitPrice: cabinetTotal,
        totalPrice: cabinetTotal,
        margin: 0,
        remark: [
          cabinetAddonPrice > 0 ? `柜体增配:¥${cabinetAddonPrice}` : '',
          extraAddonPrice > 0 ? `增配:¥${extraAddonPrice}` : '',
        ].filter(Boolean).join(' | '),
      });
    }

    if (basin.countertopLength > 0) {
      const installType = VANITY_BASIN_TYPES[basin.installType as keyof typeof VANITY_BASIN_TYPES] as BasinType;
      const material = installType?.materials.find(m => m.id === basin.materialId);
      const countertop = material?.countertopOptions.find(c => c.id === basin.countertopId);
      items.push({
        id: `vc_${Date.now()}_2`,
        type: 'custom',
        productName: `台面(${installType?.label || ''})${material?.label || ''}`,
        spec: `${countertop?.label || basin.countertopId} - ${basin.countertopLength}mm`,
        color: material?.label || basin.materialId,
        size: `${basin.countertopLength}mm`,
        unit: '项',
        quantity: 1,
        unitPrice: basinPrice,
        totalPrice: basinPrice,
        margin: 0,
      });
    }

    if (mirror.mirrorLength > 0) {
      const catLabel = mirror.mirrorCategory === 'plain' ? '普通镜' : '智能镜';
      const cabLabel = mirror.isCabinet ? '镜柜' : '单镜';
      const mirrorTypeLabel = `${catLabel}-${cabLabel}`;
      const woodLabel = mirror.woodType !== 'mianqi'
        ? VANITY_WOOD_MATERIALS.find(m => m.id === mirror.woodType)?.label || ''
        : '';
      const total = Math.round((mirrorPrice + mirrorAddonPrice) * 100) / 100;
      items.push({
        id: `vc_${Date.now()}_3`,
        type: 'custom',
        productName: `${mirrorTypeLabel} - ${mirror.mirrorSurfaceId}`,
        spec: `${mirror.mirrorLength}mm`,
        color: woodLabel,
        size: `${mirror.mirrorLength}mm`,
        unit: '套',
        quantity: 1,
        unitPrice: total,
        totalPrice: total,
        margin: 0,
        remark: mirrorAddonPrice > 0 ? `增配:¥${mirrorAddonPrice}` : '',
      });
    }

    if (packingPrice > 0) {
      items.push({
        id: `vc_${Date.now()}_4`,
        type: 'custom',
        productName: '包装费',
        spec: '夹板打包',
        color: '',
        size: '',
        unit: '项',
        quantity: 1,
        unitPrice: packingPrice,
        totalPrice: packingPrice,
        margin: 0,
      });
    }

    return items;
  }, [cabinet, cabinetPrice, cabinetAddonPrice, extraAddonPrice, basin, basinPrice, mirror, mirrorPrice, mirrorAddonPrice, packingPrice]);

  const handleAddToQuote = () => {
    const items = generateQuoteItems();
    if (items.length > 0) {
      onAdd(items);
    }
  };

  // ===== Tab 内容 =====
  const renderCabinetTab = () => {
    const types = cabinet.installType === 'hanging' ? VANITY_HANGING_CABINET_TYPES : VANITY_FLOOR_CABINET_TYPES;
    const currentType = types.find(t => t.id === cabinet.cabinetType);
    const hasMultipleMaterials = currentType && currentType.materials.length > 1;

    return (
      <div className="space-y-3">
          {/* 主柜配置 — 独立卡片 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <SectionTitle icon="📦" title="主柜配置" />
          <div className="grid grid-cols-2 gap-3 mb-4 max-w-md">
            {VANITY_INSTALL_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  const newTypes = t.id === 'hanging' ? VANITY_HANGING_CABINET_TYPES : VANITY_FLOOR_CABINET_TYPES;
                  setCabinet(prev => ({
                    ...prev,
                    installType: t.id,
                    cabinetType: newTypes[0]?.id || '',
                    material: newTypes[0]?.materials[0]?.id || '',
                  }));
                }}
                className={`p-3 rounded-xl border-2 transition-all text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  cabinet.installType === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{t.id === 'hanging' ? '🪝' : '🗄️'}</div>
                <div className="text-sm font-medium">{t.label}</div>
              </button>
            ))}
          </div>

          {/* 柜体风格 — 5个一行显示 */}
          <div className="flex flex-wrap gap-3 mb-4">
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => setCabinet(prev => ({
                  ...prev,
                  cabinetType: t.id,
                  material: t.materials[0]?.id || '',
                }))}
                className={`w-[120px] rounded-xl overflow-hidden border-2 transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  cabinet.cabinetType === t.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${t.image ? 'hidden' : ''}`}>
                    <span className="text-3xl">{t.icon}</span>
                  </div>
                </div>
                <div className={`px-2 py-2 text-center ${cabinet.cabinetType === t.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 材质选择 */}
          {hasMultipleMaterials && (
            <div className="mb-4">
              <SectionTitle icon="🪵" title="材质" />
              <div className="flex flex-wrap gap-2">
                {currentType!.materials.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setCabinet(prev => ({ ...prev, material: m.id }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      cabinet.material === m.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 柜体长度 */}
          <div className="mb-0">
            <SectionTitle icon="📏" title="柜体长度" />
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={cabinet.cabinetLength}
                onChange={e => setCabinet(prev => ({
                  ...prev,
                  cabinetLength: parseInt(e.target.value) || 0,
                }))}
                className="w-36 px-4 py-2.5 border border-gray-200 rounded-xl text-center font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                step={1}
              />
              <div className="text-sm text-gray-500">
                计价: <span className="font-bold text-blue-600">¥{cabinetPrice.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <SubtotalRow label="主柜小计" amount={cabinetPrice} />
        </div>

        {/* 柜体增配 — 4列网格 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <SectionTitle icon="🧰" title="柜体增配" />
          <div className="grid grid-cols-4 gap-2">
            {VANITY_CABINET_ADDONS.map(addon => (
              <AddonGridCard
                key={addon.id}
                icon={addon.icon}
                name={addon.label}
                options={addon.options}
                value={cabinet.cabinetAddons[addon.id]}
                onChange={val => setCabinet(prev => ({
                  ...prev,
                  cabinetAddons: { ...prev.cabinetAddons, [addon.id]: val },
                }))}
              />
            ))}
            <ToggleGridCard
              icon="🎨"
              name="改色费"
              price={200}
              priceLabel="¥200"
              value={cabinet.colorChange}
              onChange={v => setCabinet(prev => ({ ...prev, colorChange: v }))}
            />
          </div>
          <SubtotalRow label="柜体增配小计" amount={cabinetAddonPrice + (cabinet.colorChange ? 200 : 0)} />
        </div>

        {/* 增配选项 — 4列网格 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <SectionTitle icon="✨" title="增配选项" />
          <div className="grid grid-cols-4 gap-2">
            {VANITY_EXTRA_ADDONS.map((addon: any) => {
              const hasLenInput = addon.priceType === 'length';
              return (
                <AddonGridCard
                  key={addon.id}
                  icon={addon.icon}
                  name={addon.label}
                  options={addon.options as any}
                  value={cabinet.extraAddons[addon.id]}
                  hasLengthInput={hasLenInput}
                  onChange={val => setCabinet(prev => ({
                    ...prev,
                    extraAddons: { ...prev.extraAddons, [addon.id]: val },
                  }))}
                />
              );
            })}
          </div>
          <SubtotalRow label="增配选项小计" amount={extraAddonPrice} />
        </div>
      </div>
    );
  };

  const renderBasinTab = () => {
    const installType = VANITY_BASIN_TYPES[basin.installType as keyof typeof VANITY_BASIN_TYPES] as BasinType | undefined;
    const material = installType?.materials.find(m => m.id === basin.materialId);

    return (
      <div className="space-y-3">

        {/* 台面配置组合 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <SectionTitle icon="🛁" title="台面配置组合" />
          {/* 台上/台下切换 */}
          <div className="grid grid-cols-2 gap-3 mb-4 max-w-md">
            {VANITY_INSTALL_TYPES_BASIN.map(t => (
              <button
                key={t.id}
                onClick={() => setBasin(prev => ({
                  ...prev,
                  installType: t.id,
                  materialId: '',
                  countertopId: '',
                }))}
                className={`p-3 rounded-xl border-2 transition-all text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  basin.installType === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{t.id === 'above' ? '⬆️' : '⬇️'}</div>
                <div className="text-sm font-medium">{t.label}</div>
              </button>
            ))}
          </div>

          {/* 材质网格 — 固定宽度，3个/4个大小一致 */}
          {installType && (
            <div className="flex gap-3">
              {installType.materials.map(m => (
                <button
                  key={m.id}
                  onClick={() => setBasin(prev => ({ ...prev, materialId: m.id, countertopId: m.countertopOptions[0]?.id || '' }))}
                  className={`w-[120px] rounded-xl overflow-hidden border-2 transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    basin.materialId === m.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${m.image ? 'hidden' : ''}`}>
                      <span className="text-3xl">🪨</span>
                    </div>
                  </div>
                  <div className={`px-2 py-2 text-center ${basin.materialId === m.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>
                    <span className="text-sm font-medium">{m.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 台盆选项 — 紧凑卡片网格 */}
          {(material?.basinMaterialOptions || material?.basinOptions) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <SectionTitle icon="🧼" title="台盆" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {/* 台上盆：basinMaterialOptions */}
                {material.basinMaterialOptions?.map(opt => {
                  if (opt.dropdown) {
                    const selId = basin.basinDropdownSelections[opt.id] || opt.dropdown[0].id;
                    const selItem = opt.dropdown.find(d => d.id === selId);
                    const subtotal = (selItem?.unitPrice || 0) * (basin.basinItems[opt.id] || 0);
                    return (
                      <div key={opt.id} className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🧼</span>
                          <span className="text-xs font-medium text-gray-700 truncate">{opt.label}</span>
                        </div>
                        <select
                          value={selId}
                          onChange={e => setBasin(prev => ({
                            ...prev,
                            basinDropdownSelections: { ...prev.basinDropdownSelections, [opt.id]: e.target.value },
                          }))}
                          className="w-full text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-gray-50"
                        >
                          {opt.dropdown.map(d => (
                            <option key={d.id} value={d.id}>{d.label} ¥{d.unitPrice}</option>
                          ))}
                        </select>
                        <div className="flex items-center justify-between">
                          <QtyControl value={basin.basinItems[opt.id] || 0} onChange={qty => setBasin(prev => ({
                            ...prev,
                            basinItems: { ...prev.basinItems, [opt.id]: qty },
                          }))} />
                          <span className="text-xs font-semibold text-red-500">{subtotal > 0 ? `¥${subtotal}` : '¥0'}</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={opt.id} className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🧼</span>
                        <span className="text-xs font-medium text-gray-700 truncate">{opt.label}</span>
                      </div>
                      <div className="text-xs text-gray-400">¥{opt.unitPrice}/个</div>
                      <div className="flex items-center justify-between">
                        <QtyControl value={basin.basinItems[opt.id] || 0} onChange={qty => setBasin(prev => ({
                          ...prev,
                          basinItems: { ...prev.basinItems, [opt.id]: qty },
                        }))} />
                        <span className="text-xs font-semibold text-red-500">¥{(opt.unitPrice || 0) * (basin.basinItems[opt.id] || 0)}</span>
                      </div>
                    </div>
                  );
                })}
                {/* 台下盆：basinOptions */}
                {material.basinOptions?.map(opt => (
                  opt.hasLengthInput ? (
                    <div key={opt.id} className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col gap-2">
                      {/* 标题行 */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🧼</span>
                        <span className="text-xs font-medium text-gray-700">{opt.label}</span>
                      </div>
                      {/* 子选项单选组 */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {opt.options?.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => setBasin(prev => ({ ...prev, rewanSelectedOption: sub.id }))}
                            className={`py-1.5 px-2 rounded-lg text-xs border-2 transition-all text-left ${
                              basin.rewanSelectedOption === sub.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium">{sub.label}</div>
                            <div className="text-xs opacity-70">{sub.priceLabel || `¥${Math.round(sub.priceFormula?.(600) || 0)}/m`}</div>
                          </button>
                        ))}
                      </div>
                      {/* 长度输入行 */}
                      <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">长度(mm)：</span>
                          <input
                            type="number"
                            value={basin.rewanLength || ''}
                            onChange={e => setBasin(prev => ({ ...prev, rewanLength: parseInt(e.target.value) || 0 }))}
                            className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-center text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            placeholder="800"
                          />
                        </div>
                        <span className="text-xs font-semibold text-red-500 ml-auto">
                          ¥{(() => {
                            const sub = opt.options?.find(s => s.id === basin.rewanSelectedOption);
                            if (!sub || !basin.rewanLength) return 0;
                            return Math.round((sub.priceFormula || (() => 0))(basin.rewanLength));
                          })()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div key={opt.id} className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🧼</span>
                        <span className="text-xs font-medium text-gray-700 truncate">{opt.label}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {opt.priceType === 'unit' ? `¥${opt.unitPrice}/个` : `¥${Math.round(opt.priceFormula?.(600) || 0)}/600mm`}
                      </div>
                      <div className="flex items-center justify-between">
                        <QtyControl value={basin.basinItems[opt.id] || 0} onChange={qty => setBasin(prev => ({
                          ...prev,
                          basinItems: { ...prev.basinItems, [opt.id]: qty },
                        }))} />
                        <span className="text-xs font-semibold text-red-500">
                          ¥{(opt.priceType === 'unit' ? (opt.unitPrice || 0) : Math.round(opt.priceFormula?.(600) || 0)) * (basin.basinItems[opt.id] || 0)}
                        </span>
                      </div>
                    </div>
                  )
                ))}
                {/* 台上盆专用：台中盆单加 */}
                {installType.id === 'above' && material?.basinQtyUnitPrice && (
                  <div className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🧼</span>
                      <span className="text-xs font-medium text-gray-700">台中盆单加</span>
                    </div>
                    <div className="text-xs text-gray-400">¥{material.basinQtyUnitPrice}/个</div>
                    <div className="flex items-center justify-between">
                      <QtyControl value={basin.extraItems['taizhong'] || 0} onChange={qty => setBasin(prev => ({
                        ...prev,
                        extraItems: { ...prev.extraItems, 'taizhong': qty },
                      }))} />
                      <span className="text-xs font-semibold text-red-500">¥{material.basinQtyUnitPrice * (basin.extraItems['taizhong'] || 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 台面 — 紧凑卡片网格 */}
          {material && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <SectionTitle icon="🪑" title="台面" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {material.countertopOptions.map(c => {
                  const isSelected = basin.countertopId === c.id;
                  const len = basin.countertopLength;
                  const price = len > 0 && c.priceFormula ? c.priceFormula(len) : 0;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setBasin(prev => ({ ...prev, countertopId: c.id }))}
                      className={`bg-white rounded-xl border-2 p-2.5 cursor-pointer transition-all flex flex-col gap-1.5 ${
                        isSelected ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🪑</span>
                        <span className="text-xs font-medium text-gray-700 truncate">{c.label}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        ¥{Math.round(c.priceFormula ? c.priceFormula(600) : 0)}/600mm
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <input
                          type="number"
                          value={basin.countertopLength}
                          onClick={e => e.stopPropagation()}
                          onChange={e => setBasin(prev => ({
                            ...prev,
                            countertopLength: parseInt(e.target.value) || 0,
                          }))}
                          className="w-16 px-1.5 py-1 border border-gray-200 rounded-lg text-center font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                          step={1}
                        />
                        <span className="text-xs font-semibold text-red-500">
                          ¥{Math.round(price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

              {/* 配置项 — 长度输入卡片（挡水边/吊边/超长等） */}
              {material?.extraOptions && material.extraOptions.filter(e => e.id !== 'taizhong').length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <SectionTitle icon="✨" title="配置项" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {/* 普通长度输入项 */}
                    {material.extraOptions.filter(e => e.id !== 'taizhong' && !e.hasLengthInput).map(opt => {
                      const len = basin.extraLengthInputs[opt.id] || 0;
                      const price = len > 0 ? Math.round(opt.priceFormula(len) * 100) / 100 : 0;
                      return (
                        <div key={opt.id} className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col gap-1.5 hover:border-gray-300">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">✨</span>
                            <span className="text-xs font-medium text-gray-700 truncate">{opt.label}</span>
                          </div>
                          <div className="text-xs text-gray-400">{opt.priceLabel}</div>
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                            <input
                              type="number"
                              value={len || ''}
                              onChange={e => setBasin(prev => ({
                                ...prev,
                                extraLengthInputs: { ...prev.extraLengthInputs, [opt.id]: parseInt(e.target.value) || 0 },
                              }))}
                              className="w-16 px-1.5 py-1 border border-gray-200 rounded-lg text-center font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                              placeholder="mm"
                              step={1}
                            />
                            <span className="text-xs font-semibold text-red-500">
                              {price > 0 ? `¥${Math.round(price)}` : '¥0'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {/* hasLengthInput 类型 — 热弯一体盆吊边 */}
                    {material.extraOptions.filter(e => e.id === 'rewan-edge' && e.hasLengthInput).map(opt => {
                      const selectedSub = opt.options?.find(s => s.id === basin.rewanEdgeSelectedOption);
                      const len = basin.rewanEdgeLength || 0;
                      const price = selectedSub && len > 0 ? Math.round(selectedSub.priceFormula(len) * 100) / 100 : 0;
                      return (
                        <div key={opt.id} className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-2 col-span-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">✨</span>
                            <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                          </div>
                          {/* 子选项 */}
                          <div className="flex gap-2 flex-wrap">
                            {opt.options?.map(sub => (
                              <button
                                key={sub.id}
                                onClick={() => setBasin(prev => ({ ...prev, rewanEdgeSelectedOption: sub.id }))}
                                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${basin.rewanEdgeSelectedOption === sub.id
                                  ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                          {/* 长度输入 */}
                          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                            <input
                              type="number"
                              value={len || ''}
                              onChange={e => setBasin(prev => ({ ...prev, rewanEdgeLength: parseInt(e.target.value) || 0 }))}
                              className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                              placeholder="输入长度(mm)"
                              step={1}
                            />
                            <span className="text-sm font-semibold text-red-500 min-w-[50px] text-right">
                              {price > 0 ? `¥${Math.round(price)}` : '¥0'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <SubtotalRow label="台盆小计" amount={basinPrice} />
            </div>

      </div>
    );
  };

  const renderMirrorTab = () => {
    const { mirrorCategory, isCabinet, mirrorLength, mirrorArea, mirrorSurfaceId, mirrorRC, mirrorAreaMode, woodType, sideCabinetQty, openShelfQty, addonWoodType, americanStyle, glassShelf, shelfLight, glassDoor, aluGlassDoor, cabinetMirrorWoodType, cabinetMirrorLength } = mirror;

    // ===== 根据一级+二级获取镜面选项列表 =====
    const getSurfaceOptions = () => {
      if (mirrorCategory === 'plain' && !isCabinet) return [
        ...VANITY_PLAIN_SINGLE_MIRROR_OPTIONS,
        VANITY_PLAIN_WOOD_LENGTH_OPT,
      ];
      if (mirrorCategory === 'plain' && isCabinet) return [VANITY_PLAIN_CABINET_MIRROR_OPT];
      if (mirrorCategory === 'smart' && !isCabinet) return [
        ...VANITY_SMART_SINGLE_MIRROR_OPTIONS,
        VANITY_SMART_WOOD_LENGTH_OPT_BACKLIGHT,
        VANITY_SMART_WOOD_LENGTH_OPT_SAND,
      ];
      if (mirrorCategory === 'smart' && isCabinet) return [VANITY_SMART_CABINET_MIRROR_OPT_BACKLIGHT, VANITY_SMART_CABINET_MIRROR_OPT_SAND];
      return [];
    };

    const surfaceOptions = getSurfaceOptions();
    const selectedOpt = surfaceOptions.find(o => o.id === mirrorSurfaceId) || null;

    // 判断当前镜面是否需要木材类型（长度型）
    const isLengthType = selectedOpt && 'pricePerMeter' in selectedOpt && selectedOpt.pricePerMeter;
    // 判断当前镜面是否需要R角
    const needsRC = selectedOpt && 'rCornerExtra' in selectedOpt && (selectedOpt.rCornerExtra || 0) > 0;

    // ===== 根据一级+二级获取配件列表 =====
    const addonCards: React.ReactNode[] = [];
    const showSideCabinet = true; // 所有类型都支持侧柜/开放格
    const showAmericanStyle = isCabinet; // 仅镜柜支持美式造型
    const showGlassShelf = isCabinet && mirrorCategory === 'smart'; // 仅智能镜柜支持玻璃层板
    const showShelfLight = isCabinet && mirrorCategory === 'smart'; // 仅智能镜柜支持层格发光
    const showGlassDoor = isCabinet && mirrorCategory === 'smart'; // 仅智能镜柜支持玻璃门
    const showAluGlassDoor = isCabinet && mirrorCategory === 'smart'; // 仅智能镜柜支持铝合金门

    // ===== 侧柜/开放格卡片（木材类型内嵌）=====
    if (showSideCabinet) {
      const woodPriceSC = VANITY_SIDE_CABINET_PRICE_PER_M[addonWoodType] || 260;
      const woodPriceOS = VANITY_OPEN_SHELF_PRICE_PER_M[addonWoodType] || 200;
      addonCards.push(
        <div key="side-cabinet" className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🗄️</span>
            <span className="text-sm font-medium text-gray-700">单加侧柜</span>
            <span className="ml-auto text-xs text-gray-400">¥{woodPriceSC}/个</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={addonWoodType}
              onChange={e => setMirror(prev => ({ ...prev, addonWoodType: e.target.value }))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-white flex-1"
            >
              {VANITY_WOOD_MATERIALS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <QtyControl
              value={sideCabinetQty}
              onChange={qty => setMirror(prev => ({ ...prev, sideCabinetQty: qty }))}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-xs font-semibold text-red-500">¥{woodPriceSC * sideCabinetQty}</span>
          </div>
        </div>
      );
      addonCards.push(
        <div key="open-shelf" className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">📚</span>
            <span className="text-sm font-medium text-gray-700">单加开放格</span>
            <span className="ml-auto text-xs text-gray-400">¥{woodPriceOS}/个</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={addonWoodType}
              onChange={e => setMirror(prev => ({ ...prev, addonWoodType: e.target.value }))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-white flex-1"
            >
              {VANITY_WOOD_MATERIALS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <QtyControl
              value={openShelfQty}
              onChange={qty => setMirror(prev => ({ ...prev, openShelfQty: qty }))}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-xs font-semibold text-red-500">¥{woodPriceOS * openShelfQty}</span>
          </div>
        </div>
      );
    }

    if (showAmericanStyle) {
      addonCards.push(
        <ToggleGridCard
          key="american"
          icon="🏛️"
          name="美式造型"
          priceLabel="¥300"
          price={americanStyle ? VANITY_AMERICAN_STYLE_PRICE : 0}
          value={americanStyle}
          onChange={v => setMirror(prev => ({ ...prev, americanStyle: v }))}
        />
      );
    }

    if (showGlassShelf) {
      addonCards.push(
        <ToggleGridCard
          key="glass-shelf"
          icon="🔲"
          name="玻璃层板"
          priceLabel="¥30"
          price={glassShelf ? VANITY_GLASS_SHELF_PRICE : 0}
          value={glassShelf}
          onChange={v => setMirror(prev => ({ ...prev, glassShelf: v }))}
        />
      );
    }

    if (showShelfLight) {
      addonCards.push(
        <ToggleGridCard
          key="shelf-light"
          icon="💡"
          name="层格/侧柜发光"
          priceLabel="¥100"
          price={shelfLight ? VANITY_SHELF_LIGHT_PRICE : 0}
          value={shelfLight}
          onChange={v => setMirror(prev => ({ ...prev, shelfLight: v }))}
        />
      );
    }

    if (showGlassDoor) {
      addonCards.push(
        <ToggleGridCard
          key="glass-door"
          icon="🚪"
          name="玻璃门"
          priceLabel="¥200"
          price={glassDoor ? VANITY_GLASS_DOOR_PRICE : 0}
          value={glassDoor}
          onChange={v => setMirror(prev => ({ ...prev, glassDoor: v }))}
        />
      );
    }

    if (showAluGlassDoor) {
      addonCards.push(
        <ToggleGridCard
          key="alu-glass-door"
          icon="🚪"
          name="铝合金玻璃门"
          priceLabel="¥200"
          price={aluGlassDoor ? VANITY_ALU_GLASS_DOOR_PRICE : 0}
          value={aluGlassDoor}
          onChange={v => setMirror(prev => ({ ...prev, aluGlassDoor: v }))}
        />
      );
    }

    return (
      <div className="space-y-3">

        {/* 浴室镜配置 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <SectionTitle icon="🪞" title="浴室镜配置" />

          {/* 一级：普通镜 / 智能镜 */}
          <div className="grid grid-cols-2 gap-3 mb-3 max-w-md">
            {([
              { cat: 'plain' as const, label: '普通镜', icon: '🔘' },
              { cat: 'smart' as const, label: '智能镜', icon: '✨' },
            ]).map(({ cat, label, icon }) => (
              <button
                key={cat}
                onClick={() => setMirror(prev => ({
                  ...prev,
                  mirrorCategory: cat,
                  mirrorSurfaceId: '',
                  mirrorRC: false,
                  mirrorAreaMode: 'area',
                  woodType: 'mianqi',
                }))}
                className={`p-3 rounded-xl border-2 transition-all text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  mirrorCategory === cat ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-sm font-medium">{label}</div>
              </button>
            ))}
          </div>

          {/* 二级：单镜 / 镜柜 */}
          <div className="flex gap-3 mb-4">
            {([
              { cabinet: false as const, label: '单镜', sub: mirrorCategory === 'plain' ? '无收纳' : '触控/除雾', image: mirrorSingleImg },
              { cabinet: true as const,  label: '镜柜', sub: mirrorCategory === 'plain' ? '有收纳' : '触控+收纳', image: mirrorCabinetImg },
            ]).map(opt => (
              <button
                key={String(opt.cabinet)}
                onClick={() => setMirror(prev => ({
                  ...prev,
                  isCabinet: opt.cabinet,
                  mirrorSurfaceId: '',
                  mirrorRC: false,
                  mirrorAreaMode: 'area',
                  woodType: 'mianqi',
                }))}
                className={`w-[120px] rounded-xl overflow-hidden border-2 transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isCabinet === opt.cabinet ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className="w-full h-full object-cover"
                    onError={e => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = 'none';
                      const parent = el.closest('.bg-gray-100') as HTMLElement;
                      if (parent) parent.querySelector('.emoji-fallback')?.classList.remove('hidden');
                    }}
                  />
                  <span className="emoji-fallback hidden text-3xl">🪞</span>
                </div>
                <div className={`px-2 py-2 text-center ${isCabinet === opt.cabinet ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>
                  <span className="text-sm font-medium block">{opt.label}</span>
                  <span className={`text-xs block mt-0.5 ${isCabinet === opt.cabinet ? 'text-blue-100' : 'text-gray-400'}`}>{opt.sub}</span>
                </div>
              </button>
            ))}
          </div>

          {/* ===== 镜面配置 ===== */}
          <div className="mb-4">
            <SectionTitle icon="🪞" title="镜面配置" />

            {/* 面积型选项（不包边/铝型材/不锈钢）——面积输入在卡片内 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
              {surfaceOptions
                .filter(opt => (!('pricePerMeter' in opt) || !opt.pricePerMeter) && !opt.hasLengthInput)
                .map(opt => {
                  const isSelected = mirrorSurfaceId === opt.id;
                  const pricePerSqm = 'pricePerSqm' in opt ? opt.pricePerSqm : 0;
                  // const rcExtra = 'rCornerExtra' in opt ? opt.rCornerExtra : 0; // 仅长度型使用

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setMirror(prev => ({
                        ...prev,
                        mirrorSurfaceId: prev.mirrorSurfaceId === opt.id ? '' : opt.id,
                        mirrorRC: false,
                        mirrorAreaMode: 'area',
                      }))}
                      className={`rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="p-3">
                        {/* 顶部：图标+名称+单价格式 */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-base">🪞</span>
                          <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{opt.label}</span>
                          <span className="text-xs text-gray-400">¥{pricePerSqm}/m²</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                        </div>

                        {/* 选中后显示：面积/倒R角切换 + 面积输入 */}
                        {isSelected && (
                          <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
                            {/* 面积/倒R角切换 */}
                            <div className="flex gap-1">
                              {['area', 'rCorner'].map(mode => (
                                <button
                                  key={mode}
                                  onClick={() => setMirror(prev => ({ ...prev, mirrorAreaMode: mode as 'area' | 'rCorner' }))}
                                  className={`flex-1 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors focus:outline-none ${
                                    mirrorAreaMode === mode
                                      ? 'bg-blue-500 text-white border-blue-500'
                                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {mode === 'area' ? '面积' : '倒R角'}
                                </button>
                              ))}
                            </div>
                            {/* 面积输入 */}
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={mirrorArea}
                                step={0.1}
                                onChange={e => setMirror(prev => ({ ...prev, mirrorArea: parseFloat(e.target.value) || 0 }))}
                                className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                              />
                              <span className="text-xs text-gray-400">m²</span>
                            </div>
                            {/* 实时计价 */}
                            <div className="text-center">
                              <span className="text-sm font-semibold text-red-500">¥{mirrorPrice.toFixed(0)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* ===== hasLengthInput 型（镜柜三合一：木材镜柜/上下发光/正面打砂）=====
                 每个卡片独立一行：选项卡 + 材质下拉 + 长度输入 */}
              {surfaceOptions
                .filter(opt => opt.hasLengthInput && opt.woodOptions)
                .map(opt => {
                  const isSelected = mirrorSurfaceId === opt.id;
                  const currentWood = opt.woodOptions?.find(w => w.id === mirror.cabinetMirrorWoodType);
                  // 显示当前选中材质的价格，未选材质时显示默认（第一个）的价格
                  const currentPrice = currentWood?.pricePerMeter || opt.woodOptions?.[0]?.pricePerMeter || 0;
                  const displayLen = mirror.cabinetMirrorLength || 0;
                  const baseLen = Math.max(Math.ceil(displayLen / 100) * 100, 800);
                  // 需要减100的情况：
                  // 1. 普通镜-单镜 的木框包边（wood）
                  // 2. 普通镜柜 的木材镜柜（plain-cabinet-wood，woodSubtract100=true）
                  const needSubtract100 =
                    (opt.id === 'wood' && mirrorCategory === 'plain' && !isCabinet) ||
                    (opt.woodSubtract100 && mirrorCategory === 'plain' && isCabinet);
                  const calcPrice = displayLen > 0
                    ? Math.round((baseLen / 1000) * currentPrice - (needSubtract100 ? 100 : 0))
                    : 0;

                  return (
                    <div
                      key={opt.id}
                      className={`rounded-xl border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      {/* 主卡头：图标+名称+单价，点击选中 */}
                      <div
                        className="p-3 cursor-pointer"
                        onClick={() => setMirror(prev => ({ ...prev, mirrorSurfaceId: opt.id, mirrorRC: false }))}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🪞</span>
                          <span className={`text-sm font-semibold flex-1 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{opt.label}</span>
                          <span className="text-xs text-gray-400">¥{currentPrice}/m</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="space-y-2" onClick={e => e.stopPropagation()}>
                            {/* 材质下拉 */}
                            <select
                              value={mirror.cabinetMirrorWoodType}
                              onChange={e => setMirror(prev => ({ ...prev, cabinetMirrorWoodType: e.target.value }))}
                              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
                            >
                              {opt.woodOptions?.map(m => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                              ))}
                            </select>

                            {/* 长度输入 + 实时计价 */}
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={displayLen}
                                onChange={e => setMirror(prev => ({ ...prev, cabinetMirrorLength: parseInt(e.target.value) || 0 }))}
                                className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                placeholder="输入长度(mm)"
                                step={1}
                              />
                              <span className="text-sm font-semibold text-red-500 min-w-[60px] text-right">
                                {calcPrice > 0 ? `¥${calcPrice}` : '¥0'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* 木框包边等长度型选项已被上方 hasLengthInput 逻辑统一渲染，此处不再重复 */}
            </div>
          </div>

          {/* ===== 镜子长度（仅普通长度型选项显示，hasLengthInput型在卡片内） ===== */}
          {isLengthType && !surfaceOptions.some(o => o.id === mirrorSurfaceId && 'hasLengthInput' in o && o.hasLengthInput) && (
            <div className="mb-0">
              <SectionTitle icon="📏" title="镜子长度" />
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={mirrorLength}
                  onChange={e => setMirror(prev => ({ ...prev, mirrorLength: parseInt(e.target.value) || 0 }))}
                  className="w-36 px-4 py-2.5 border border-gray-200 rounded-xl text-center font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  step={1}
                />
                <div className="text-sm text-gray-500">
                  计价: <span className="font-bold text-blue-600">¥{mirrorPrice.toFixed(0)}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {[600, 800, 1000, 1200].map(l => (
                  <button
                    key={l}
                    onClick={() => setMirror(prev => ({ ...prev, mirrorLength: l }))}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors focus:outline-none ${
                      mirrorLength === l ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {l}mm
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ===== 配件增配 ===== */}
        {addonCards.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <SectionTitle icon="🧰" title="配件增配" />
            <div className="grid grid-cols-4 gap-2">
              {addonCards}
            </div>
            <SubtotalRow label="浴室镜小计" amount={mirrorPrice + mirrorAddonPrice} />
          </div>
        )}

      </div>
    );
  };

  const renderPackingTab = () => {
    // 主柜打包价格（可选）
    const cabinetPackingPrice = cabinet.cabinetPackingEnabled && cabinet.cabinetLength > 0
      ? Math.round((Math.max(Math.ceil(cabinet.cabinetLength / 100) * 100, 800) / 1000) * (cabinet.cabinetType.startsWith('hanging') ? 80 : 100))
      : 0;

    // 浴室镜打包价格（可选）
    const mirrorPackingPrice = mirror.mirrorPackingEnabled && mirror.mirrorLength > 0
      ? Math.round((Math.max(Math.ceil(mirror.mirrorLength / 100) * 100, 800) / 1000) * (mirror.isCabinet ? 80 : 70))
      : 0;

    // 台面打包价格（用户手动输入，有输入即启用）
    const countertopPackingPrice = basin.countertopPackingLength > 0
      ? Math.round((Math.max(Math.ceil(basin.countertopPackingLength / 100) * 100, 800) / 1000) * (basin.countertopPackingType === 'wood' ? 180 : 90))
      : 0;

    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <SectionTitle icon="📦" title="包装配置" note="（自动读取数据，可选启用）" />
          <div className="space-y-2">

            {/* 主柜夹板打包（可选） */}
            <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
              cabinetPackingPrice > 0 ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-white'
            }`}>
              {/* 开关 */}
              <button
                onClick={() => setCabinet(prev => ({ ...prev, cabinetPackingEnabled: !prev.cabinetPackingEnabled }))}
                className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  cabinet.cabinetPackingEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  cabinet.cabinetPackingEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
              <div className="text-xl">📦</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">主柜夹板打包</div>
                <div className="text-xs text-gray-400">
                  {cabinet.cabinetLength > 0
                    ? `自动读取【${cabinet.cabinetType.startsWith('hanging') ? '吊柜' : '主柜'}】${cabinet.cabinetLength}mm`
                    : '主柜未配置'}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                cabinetPackingPrice > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {cabinetPackingPrice > 0 ? `¥${cabinetPackingPrice}` : '—'}
              </div>
            </div>

            {/* 浴室镜夹板打包（可选） */}
            <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
              mirrorPackingPrice > 0 ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-white'
            }`}>
              {/* 开关 */}
              <button
                onClick={() => setMirror(prev => ({ ...prev, mirrorPackingEnabled: !prev.mirrorPackingEnabled }))}
                className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  mirror.mirrorPackingEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  mirror.mirrorPackingEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
              <div className="text-xl">🪞</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">浴室镜夹板打包</div>
                <div className="text-xs text-gray-400">
                  {mirror.mirrorLength > 0
                    ? `自动读取【${mirror.isCabinet ? '镜柜' : '单镜'}】${mirror.mirrorLength}mm`
                    : '浴室镜未配置'}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                mirrorPackingPrice > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {mirrorPackingPrice > 0 ? `¥${mirrorPackingPrice}` : '—'}
              </div>
            </div>

            {/* 台面夹板打包（用户可选择类型+输入长度） */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-100 bg-white">
              <div className="text-xl">🪑</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">台面夹板打包</div>
              </div>
              <select
                value={basin.countertopPackingType}
                onChange={e => setBasin(prev => ({ ...prev, countertopPackingType: e.target.value as 'board' | 'wood' }))}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 bg-white flex-shrink-0"
              >
                <option value="board">夹板打包</option>
                <option value="wood">夹板木箱打包</option>
              </select>
              <input
                type="number"
                value={basin.countertopPackingLength || ''}
                onChange={e => setBasin(prev => ({ ...prev, countertopPackingLength: parseInt(e.target.value) || 0 }))}
                placeholder="输入mm"
                className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-blue-400 text-center"
                step={100}
              />
              <span className="text-xs text-gray-400 flex-shrink-0">mm</span>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${countertopPackingPrice > 0 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {countertopPackingPrice > 0 ? `¥${countertopPackingPrice}` : '—'}
              </div>
            </div>

          </div>
        </div>
        <SubtotalRow label="包装小计" amount={packingPrice} />
      </div>
    );
  };

  const cabinetTotal = cabinetPrice + cabinetAddonPrice + extraAddonPrice;
  const basinStatus = basin.countertopLength > 0
    ? `台盆 ¥${basinPrice.toFixed(0)}`
    : '台盆待配置';

  const mirrorStatus = mirror.mirrorLength > 0
    ? `浴室镜 ¥${(mirrorPrice + mirrorAddonPrice).toFixed(0)}`
    : '浴室镜未选配';

  const packingStatus = packingPrice > 0
    ? `包装 ¥${packingPrice.toFixed(0)}`
    : '包装未配置';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚿</span>
            <h1 className="text-base font-semibold text-gray-800">浴室柜配置器</h1>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="flex px-4 pb-0">
          {([
            { id: 'cabinet', icon: '📦', label: '主柜' },
            { id: 'basin', icon: '🛁', label: '台盆' },
            { id: 'mirror', icon: '🪞', label: '浴室镜' },
            { id: 'packing', icon: '📦', label: '包装' },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 py-2.5 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer focus:outline-none ${
                tab === t.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto py-4">
        {tab === 'cabinet' && renderCabinetTab()}
        {tab === 'basin' && renderBasinTab()}
        {tab === 'mirror' && renderMirrorTab()}
        {tab === 'packing' && renderPackingTab()}
      </div>

      {/* 底部汇总栏 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 pb-6">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
          <span className={cabinetTotal > 0 ? 'text-green-600' : ''}>
            {cabinetTotal > 0 ? `主柜 ¥${cabinetTotal.toFixed(0)}` : '主柜未配置'}
          </span>
          <span>|</span>
          <span className={basin.countertopLength > 0 ? 'text-green-600' : ''}>{basinStatus}</span>
          <span>|</span>
          <span className={mirror.mirrorLength > 0 ? 'text-green-600' : ''}>{mirrorStatus}</span>
          <span>|</span>
          <span className={packingPrice > 0 ? 'text-green-600' : ''}>{packingStatus}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">组合总价</div>
            <div className="text-2xl font-bold text-red-500">{fmt(totalPrice)}</div>
          </div>
          <button
            onClick={handleAddToQuote}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            ✓ 加入报价车
          </button>
        </div>
      </div>
    </div>
  );
}
