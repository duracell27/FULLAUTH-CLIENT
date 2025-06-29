export const formatBalance = (value: string | number): number => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return parseFloat(numValue.toFixed(2));
};

export const formatNumberWithSpaces = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0.00';
  
  const formatted = numValue.toFixed(2);
  const [integerPart, decimalPart] = formatted.split('.');
  const integerWithSpaces = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${integerWithSpaces}.${decimalPart}`;
};

