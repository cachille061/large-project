/**
 * Unit tests for string helper utilities.
 * Tests email validation and text truncation with 9 test cases.
 */

import { isValidEmail, truncateText } from '../stringHelpers';

describe('isValidEmail utility function', () => {
  it('should validate correct email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@company.co.uk')).toBe(true);
    expect(isValidEmail('name+tag@domain.org')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('no-at-sign.com')).toBe(false);
  });

  it('should handle empty or null inputs', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });

  it('should trim whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });
});

describe('truncateText utility function', () => {
  it('should truncate text longer than maxLength', () => {
    expect(truncateText('This is a very long text', 10)).toBe('This is a...');
  });

  it('should not truncate text shorter than maxLength', () => {
    expect(truncateText('Short', 10)).toBe('Short');
    expect(truncateText('Exactly10!', 10)).toBe('Exactly10!');
  });

  it('should handle empty strings', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should trim whitespace before adding ellipsis', () => {
    expect(truncateText('Test text     ', 9)).toBe('Test text...');
  });

  it('should handle edge case of maxLength 0', () => {
    expect(truncateText('Any text', 0)).toBe('...');
  });
});
