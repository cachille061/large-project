/**
 * Unit tests for formatPrice utility function.
 * Tests currency formatting with 8 test cases covering decimals, whole numbers, strings, and edge cases.
 */

import { formatPrice } from '../formatPrice';

describe('formatPrice utility function', () => {
  it('should format regular prices with decimals correctly', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('should format whole numbers without unnecessary decimals', () => {
    expect(formatPrice(100)).toBe('$100');
  });

  it('should handle zero price', () => {
    expect(formatPrice(0)).toBe('$0');
  });

  it('should handle string input with dollar sign', () => {
    expect(formatPrice('$50.99')).toBe('$50.99');
  });

  it('should handle string input with commas', () => {
    expect(formatPrice('1,234.56')).toBe('$1,234.56');
  });

  it('should return $0 for invalid input', () => {
    expect(formatPrice('invalid')).toBe('$0');
  });

  it('should format large numbers with proper comma separation', () => {
    expect(formatPrice(1000000)).toBe('$1,000,000');
  });

  it('should handle small decimal values', () => {
    expect(formatPrice(0.99)).toBe('$0.99');
  });
});
