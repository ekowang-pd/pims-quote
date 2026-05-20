import { useMemo, useState } from 'react';
import { exportVanityQuoteToExcel } from '../utils/exportVanityQuote';

// ============================================================
// 报价行类型定义
// ============================================================
export interface VanityQuoteRow {
  no: number;
  componentImage: string;       // 组件图片（留空）
  componentName: string;        // 组件名称（留空）
  itemNumber: string;           // Item Number（自动编号）
  productType: string;          // Product Type
  picture: string;              // 产品图片URL
  lengthMm: number | '';        // Length(mm)
  widthMm: number | '';         // Width(mm)
  heightMm: number | '';        // Height(mm)
  description: string;          // Description
  unit: string;                 // Unit
  quantity: number | string;    // Quantity
  basePrice: number | '';       // 产品库价格（单价）
  margin: string;               // 利润（留空）
  unitPriceCny: number | '';    // Unit Price (CNY)
  amountCny: number | '';       // Amount(CNY)
  cbm: number | '';             // CBM(m³)
  weightKg: number | '';        // Weight(KG)
  remarks: string;              // Remarks
}

// ============================================================
// Props
// ============================================================
interface VanityQuoteModalProps {
  rows: VanityQuoteRow[];
  totalPrice: number;
  onClose: () => void;
}

// ============================================================
// 表头配置
// ============================================================
const HEADERS = [
  { key: 'no', label: 'No.', width: 40 },
  { key: 'componentImage', label: '组件图片', width: 70 },
  { key: 'componentName', label: '组件名称', width: 80 },
  { key: 'itemNumber', label: 'Item Number', width: 120 },
  { key: 'productType', label: 'Product Type', width: 130 },
  { key: 'picture', label: 'Picture', width: 70 },
  { key: 'lengthMm', label: 'Length(mm)', width: 80 },
  { key: 'widthMm', label: 'Width(mm)', width: 80 },
  { key: 'heightMm', label: 'Height(mm)', width: 80 },
  { key: 'description', label: 'Description', width: 150 },
  { key: 'unit', label: 'Unit', width: 50 },
  { key: 'quantity', label: 'Quantity', width: 70 },
  { key: 'basePrice', label: '产品库价格', width: 90 },
  { key: 'margin', label: '利润', width: 60 },
  { key: 'unitPriceCny', label: 'Unit Price\n(CNY)', width: 90 },
  { key: 'amountCny', label: 'Amount\n(CNY)', width: 90 },
  { key: 'cbm', label: 'CBM(m³)', width: 70 },
  { key: 'weightKg', label: 'Weight\n(KG)', width: 70 },
  { key: 'remarks', label: 'Remarks', width: 120 },
];

// ============================================================
// 主组件
// ============================================================
export default function VanityQuoteModal({ rows, totalPrice, onClose }: VanityQuoteModalProps) {
  const [exporting, setExporting] = useState(false);

  const quoteNo = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `VQ-${y}${m}${d}-${h}${min}`;
  }, []);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await exportVanityQuoteToExcel(rows, totalPrice, quoteNo);
    } catch (err) {
      alert('导出失败：' + (err as Error).message);
    } finally {
      setExporting(false);
    }
  };

  const renderCell = (row: VanityQuoteRow, key: string) => {
    const val = (row as any)[key];
    if (key === 'picture') {
      return val ? (
        <img src={val} alt="" className="w-10 h-10 object-cover rounded mx-auto" />
      ) : '';
    }
    if (key === 'componentImage') return '';
    if ((key === 'basePrice' || key === 'unitPriceCny' || key === 'amountCny') && val !== '') {
      return `¥${Number(val).toFixed(0)}`;
    }
    if (val === '' || val === null || val === undefined) return '';
    return String(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ width: '98vw', maxWidth: 1400, maxHeight: '96vh' }}
      >
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚿</span>
            <div>
              <h2 className="text-base font-semibold text-gray-800">浴室柜报价单</h2>
              <p className="text-xs text-gray-400">{quoteNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              {exporting ? '导出中...' : '📊 导出Excel'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🖨 打印
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* 表格区域 */}
        <div className="flex-1 overflow-auto p-4">
          <div className="overflow-x-auto">
            <table
              className="border-collapse text-xs"
              style={{ minWidth: 1200 }}
            >
              {/* 表头 */}
              <thead>
                <tr className="bg-blue-600 text-white">
                  {HEADERS.map(h => (
                    <th
                      key={h.key}
                      className="border border-blue-500 px-2 py-2 text-center font-semibold whitespace-pre-line"
                      style={{ minWidth: h.width, width: h.width }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              {/* 数据行 */}
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {HEADERS.map(h => {
                      const val = renderCell(row, h.key);
                      const isPrice = ['basePrice', 'unitPriceCny', 'amountCny'].includes(h.key);
                      return (
                        <td
                          key={h.key}
                          className={`border border-gray-200 px-2 py-2 text-center align-middle ${
                            isPrice && val ? 'text-red-500 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* 合计行 */}
                <tr className="bg-blue-50 font-semibold">
                  {HEADERS.map(h => (
                    <td
                      key={h.key}
                      className="border border-gray-300 px-2 py-2 text-center"
                    >
                      {h.key === 'productType' ? '合计' :
                       h.key === 'amountCny' ? (
                        <span className="text-red-600 font-bold">¥{totalPrice.toFixed(0)}</span>
                       ) : ''}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 底部总价栏 */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <div className="text-sm text-gray-500">
            共 <span className="font-semibold text-gray-700">{rows.length}</span> 项配置
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              组合总价：<span className="text-xl font-bold text-red-500">¥{totalPrice.toFixed(0)}</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
