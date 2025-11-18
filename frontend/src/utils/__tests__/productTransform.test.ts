/**
 * Unit tests for product transformation utilities.
 * Tests condition/status mapping and product data transformation with 17 test cases.
 */

import { mapCondition, mapStatus, transformProduct, transformProducts } from '../productTransform';

describe('mapCondition utility function', () => {
  it('should map "new" to "New"', () => {
    expect(mapCondition('new')).toBe('New');
  });

  it('should map "like-new" to "Used - Like New"', () => {
    expect(mapCondition('like-new')).toBe('Used - Like New');
  });

  it('should map "good" to "Used - Good"', () => {
    expect(mapCondition('good')).toBe('Used - Good');
  });

  it('should map "fair" to "Used - Fair"', () => {
    expect(mapCondition('fair')).toBe('Used - Fair');
  });

  it('should map "poor" to "Used - Fair"', () => {
    expect(mapCondition('poor')).toBe('Used - Fair');
  });

  it('should default to "Used - Good" for unknown conditions', () => {
    expect(mapCondition('unknown')).toBe('Used - Good');
    expect(mapCondition('')).toBe('Used - Good');
  });
});

describe('mapStatus utility function', () => {
  it('should map "available" to "active"', () => {
    expect(mapStatus('available')).toBe('active');
  });

  it('should map "sold" to "sold"', () => {
    expect(mapStatus('sold')).toBe('sold');
  });

  it('should map "delisted" to "delisted"', () => {
    expect(mapStatus('delisted')).toBe('delisted');
  });

  it('should map "pending" to "active"', () => {
    expect(mapStatus('pending')).toBe('active');
  });

  it('should default to "active" for unknown statuses', () => {
    expect(mapStatus('unknown')).toBe('active');
    expect(mapStatus('')).toBe('active');
  });
});

describe('transformProduct utility function', () => {
  it('should transform a complete backend product to frontend format', () => {
    const backendProduct = {
      _id: '123',
      title: 'Test Product',
      price: 99.99,
      originalPrice: 149.99,
      location: 'New York',
      images: ['image1.jpg', 'image2.jpg'],
      condition: 'new',
      description: 'Test description',
      category: 'Electronics',
      sellerId: 'seller123',
      sellerName: 'John Doe',
      sellerProfilePicture: 'profile.jpg',
      status: 'available',
      createdAt: '2025-01-01',
    };

    const result = transformProduct(backendProduct);

    expect(result.id).toBe('123');
    expect(result.title).toBe('Test Product');
    expect(result.price).toBe('$99.99');
    expect(result.originalPrice).toBe('$149.99');
    expect(result.location).toBe('New York');
    expect(result.image).toBe('image1.jpg');
    expect(result.condition).toBe('New');
    expect(result.description).toBe('Test description');
    expect(result.category).toBe('Electronics');
    expect(result.sellerId).toBe('seller123');
    expect(result.sellerName).toBe('John Doe');
    expect(result.sellerProfilePicture).toBe('profile.jpg');
    expect(result.status).toBe('active');
    expect(result.createdAt).toBe('2025-01-01');
  });

  it('should handle missing originalPrice', () => {
    const backendProduct = {
      _id: '123',
      title: 'Test Product',
      price: 50,
      condition: 'good',
      status: 'available',
      sellerId: 'seller123',
      createdAt: '2025-01-01',
    };

    const result = transformProduct(backendProduct);
    expect(result.originalPrice).toBeUndefined();
  });

  it('should use default location when not provided', () => {
    const backendProduct = {
      _id: '123',
      title: 'Test Product',
      price: 50,
      condition: 'good',
      status: 'available',
      sellerId: 'seller123',
      createdAt: '2025-01-01',
    };

    const result = transformProduct(backendProduct);
    expect(result.location).toBe('Location not specified');
  });

  it('should use empty string for image when images array is empty or missing', () => {
    const backendProduct = {
      _id: '123',
      title: 'Test Product',
      price: 50,
      images: [],
      condition: 'good',
      status: 'available',
      sellerId: 'seller123',
      createdAt: '2025-01-01',
    };

    const result = transformProduct(backendProduct);
    expect(result.image).toBe('');
  });

  it('should use default seller name when not provided', () => {
    const backendProduct = {
      _id: '123',
      title: 'Test Product',
      price: 50,
      condition: 'good',
      status: 'available',
      sellerId: 'seller123',
      createdAt: '2025-01-01',
    };

    const result = transformProduct(backendProduct);
    expect(result.sellerName).toBe('Unknown Seller');
  });
});

describe('transformProducts utility function', () => {
  it('should transform an array of backend products', () => {
    const backendProducts = [
      {
        _id: '1',
        title: 'Product 1',
        price: 10,
        condition: 'new',
        status: 'available',
        sellerId: 'seller1',
        createdAt: '2025-01-01',
      },
      {
        _id: '2',
        title: 'Product 2',
        price: 20,
        condition: 'good',
        status: 'sold',
        sellerId: 'seller2',
        createdAt: '2025-01-02',
      },
    ];

    const results = transformProducts(backendProducts);

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('1');
    expect(results[0].price).toBe('$10');
    expect(results[1].id).toBe('2');
    expect(results[1].price).toBe('$20');
  });

  it('should return empty array for empty input', () => {
    const results = transformProducts([]);
    expect(results).toEqual([]);
  });
});
