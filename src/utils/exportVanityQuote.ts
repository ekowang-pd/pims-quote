import * as XLSX from 'xlsx';
import type { VanityQuoteRow } from '../components/VanityQuoteModal';

function buildSizeString(row: VanityQuoteRow): string {
  const parts: string[] = [];
  if (row.lengthMm !== '' && row.lengthMm !== 0) parts.push(String(row.lengthMm));
  if (row.widthMm !== '' && row.widthMm !== 0) parts.push(String(row.widthMm));
  if (row.heightMm !== '' && row.heightMm !== 0) parts.push(String(row.heightMm));
  return parts.join('×');
}

export async function exportVanityQuoteToExcel(
  rows: VanityQuoteRow[],
  totalPrice: number,
  quoteNo: string,
) {
  // 1. 获取模板文件
  const response = await fetch(`${import.meta.env.BASE_URL}quote_template.xlsx`);
  if (!response.ok) {
    throw new Error('模板文件加载失败');
  }
  const arrayBuffer = await response.arrayBuffer();

  // 2. 读取模板
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
  const ws = workbook.Sheets['草稿'] || workbook.Sheets[workbook.SheetNames[0]];

  // 3. 填充表头信息
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const dateStr = `${y}/${m}/${d}`;

  // 计算有效期（15天后）
  const validDate = new Date(today);
  validDate.setDate(validDate.getDate() + 15);
  const vy = validDate.getFullYear();
  const vm = String(validDate.getMonth() + 1).padStart(2, '0');
  const vd = String(validDate.getDate()).padStart(2, '0');
  const validStr = `${vy}/${vm}/${vd}`;

  ws['C4'] = { t: 's', v: dateStr };
  ws['K4'] = { t: 's', v: validStr };
  ws['K5'] = { t: 's', v: 'Eko' };

  // 4. 填充数据行（从第10行开始）
  const startRow = 10;
  rows.forEach((row, idx) => {
    const r = startRow + idx;
    const sizeStr = buildSizeString(row);
    const qty = typeof row.quantity === 'string' ? parseFloat(row.quantity) || 1 : row.quantity;
    const unitPrice = row.unitPriceCny !== '' ? Number(row.unitPriceCny) : 0;

    ws[`A${r}`] = { t: 'n', v: row.no };
    ws[`B${r}`] = { t: 's', v: row.itemNumber };
    ws[`C${r}`] = { t: 's', v: row.productType };
    // D,E,F 保持空白（Picture合并单元格）
    ws[`G${r}`] = { t: 's', v: sizeStr };
    ws[`H${r}`] = { t: 's', v: row.description };
    ws[`I${r}`] = { t: 's', v: row.unit };
    ws[`J${r}`] = { t: 'n', v: qty };
    ws[`K${r}`] = { t: 'n', v: unitPrice };
    ws[`L${r}`] = { t: 'n', f: `=J${r}*K${r}` };
    ws[`M${r}`] = { t: 'n', v: row.cbm !== '' ? Number(row.cbm) : 0 };
    ws[`N${r}`] = { t: 'n', v: row.weightKg !== '' ? Number(row.weightKg) : 0 };
    ws[`O${r}`] = { t: 's', v: row.remarks };
  });

  const lastDataRow = startRow + rows.length - 1;
  const totalRow = lastDataRow + 1;       // Total:
  const amountRow = totalRow + 1;          // Total amount:
  const depositRow = amountRow + 1;        // 50% Deposit:
  const balanceRow = depositRow + 1;       // Balance:

  // 5. 重写合计行（覆盖模板中的固定公式）
  ws[`A${totalRow}`] = { t: 's', v: 'Total: ' };
  ws[`L${totalRow}`] = { t: 'n', f: `=SUM(L${startRow}:L${lastDataRow})` };

  ws[`A${amountRow}`] = { t: 's', v: 'Total amount: ' };
  ws[`L${amountRow}`] = { t: 'n', f: `=L${totalRow}` };

  ws[`A${depositRow}`] = { t: 's', v: '50 % Deposit: ' };
  ws[`L${depositRow}`] = { t: 'n', f: `=L${amountRow}*0.5` };

  ws[`A${balanceRow}`] = { t: 's', v: 'Balance: ' };
  ws[`L${balanceRow}`] = { t: 'n', f: `=L${amountRow}-L${depositRow}` };

  // 6. 更新合并单元格范围（合计行相关）
  // 删除旧的合计相关合并，重新添加
  if (!ws['!merges']) ws['!merges'] = [];
  const merges = ws['!merges'] as XLSX.Range[];

  // 保留表头区域和数据区域的合并，删除旧的总计合并
  const keepRanges = ['A1:O1', 'A2:B2', 'C2:H2', 'I2:J2', 'K2:O2',
    'A3:B3', 'C3:H3', 'I3:J3', 'K3:O3',
    'A4:B4', 'C4:H4', 'I4:J4', 'K4:O4',
    'A5:B5', 'C5:H5', 'I5:J5', 'K5:O5',
    'A6:B6', 'C6:H6', 'I6:J6', 'K6:O6',
    'A7:O7', 'D8:F8', 'D10:F10', 'A9:O9'];

  ws['!merges'] = merges.filter(m => {
    const key = `${XLSX.utils.encode_col(m.s.c)}${m.s.r + 1}:${XLSX.utils.encode_col(m.e.c)}${m.e.r + 1}`;
    return keepRanges.includes(key);
  });

  // 添加新的合计行合并
  const newMerges: XLSX.Range[] = [
    { s: { r: totalRow - 1, c: 0 }, e: { r: totalRow - 1, c: 10 } },   // A:K
    { s: { r: amountRow - 1, c: 0 }, e: { r: amountRow - 1, c: 10 } },  // A:K
    { s: { r: depositRow - 1, c: 0 }, e: { r: depositRow - 1, c: 10 } }, // A:K
    { s: { r: balanceRow - 1, c: 0 }, e: { r: balanceRow - 1, c: 10 } }, // A:K
  ];

  // 如果数据行超过1行，需要为每行添加 Picture 合并 D:F
  for (let i = 0; i < rows.length; i++) {
    const r = startRow + i;
    newMerges.push({ s: { r: r - 1, c: 3 }, e: { r: r - 1, c: 5 } });
  }

  ws['!merges'].push(...newMerges);

  // 7. 写入并下载
  const out = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${quoteNo}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
