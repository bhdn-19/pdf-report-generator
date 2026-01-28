export const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

export const parseCurrency = (value) => {
  return Number(value.replace(/[^0-9]/g, ''))
}