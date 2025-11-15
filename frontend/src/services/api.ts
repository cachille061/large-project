// API service layer for backend communication
const API_BASE_URL = '/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for Better Auth cookies
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Product API
export const productApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    condition?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    const query = queryParams.toString();
    return apiCall<{
      products: any[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/products${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiCall<{ product: any }>(`/products/${id}`);
  },

  getBySeller: async (sellerId: string) => {
    return apiCall<{ products: any[]; count: number }>(`/products/seller/${sellerId}`);
  },

  create: async (productData: any) => {
    return apiCall<{ message: string; product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, updates: any) => {
    return apiCall<{ message: string; product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiCall<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  markAsSold: async (id: string) => {
    return apiCall<{ message: string; product: any }>(`/products/${id}/sold`, {
      method: 'PATCH',
    });
  },
};

// Search API
export const searchApi = {
  search: async (params: {
    q?: string;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    return apiCall<{
      products: any[];
      pagination: { page: number; limit: number; total: number; pages: number };
      filters?: any;
    }>(`/search?${queryParams.toString()}`);
  },

  getSuggestions: async (q: string) => {
    return apiCall<{ suggestions: string[] }>(`/search/suggestions?q=${encodeURIComponent(q)}`);
  },

  getPopular: async () => {
    return apiCall<{ popular: string[] }>('/search/popular');
  },
};

// Order API
export const orderApi = {
  getCurrentOrders: async () => {
    return apiCall<{ orders: any[] }>('/orders/current');
  },

  searchCurrentOrders: async (q: string) => {
    return apiCall<{ orders: any[] }>(`/orders/current/search?q=${encodeURIComponent(q)}`);
  },

  buyProduct: async (productId: string) => {
    return apiCall<{ message: string; order: any }>('/orders/current', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  cancelOrder: async (orderId: string) => {
    return apiCall<{ message: string }>(`/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  },

  checkoutOrder: async (orderId: string) => {
    return apiCall<{ message: string }>(`/orders/${orderId}/checkout`, {
      method: 'POST',
    });
  },

  getPreviousOrders: async () => {
    return apiCall<{ orders: any[] }>('/orders/previous');
  },

  searchPreviousOrders: async (q: string) => {
    return apiCall<{ orders: any[] }>(`/orders/previous/search?q=${encodeURIComponent(q)}`);
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return apiCall<{ ok: boolean; database: string; timestamp: string }>('/health');
  },
};
