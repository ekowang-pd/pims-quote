export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$',
  };
  const sym = symbols[currency] || currency + ' ';
  return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: '草稿',
    sent: '已发送',
    confirmed: '已确认',
    cancelled: '已取消',
  };
  return map[status] || status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}
