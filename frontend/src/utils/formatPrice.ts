/**
 * Format a number as a price with dollar sign and commas
 * @param price - Price as number or string
 * @returns Formatted price string (e.g., "$1,234.56")
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[$,]/g, '')) 
    : price;
  
  if (isNaN(numPrice)) return '$0';
  
  return `$${numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
