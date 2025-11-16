import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { ProductCategory, ProductCondition, ProductStatus } from "../constants";
import { productApi, orderApi } from "../services/api";
import { useAuth } from "./AuthContext";
import { formatPrice } from "../utils/formatPrice";
import { transformProducts } from "../utils/productTransform";

export interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  location: string;
  image: string;
  condition: ProductCondition;
  description: string;
  category: ProductCategory;
  sellerId: string;
  sellerName: string;
  sellerProfilePicture?: string;
  status: ProductStatus;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  title: string;
  price: number;
  qty: number;
  imageUrl?: string;
  sellerId?: string;
}

export interface Order {
  id: string;
  user: string;
  status: "CURRENT" | "FULFILLED" | "CANCELED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  items: OrderItem[];
  subtotal: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "status">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductsBySeller: (sellerId: string) => Product[];
  getOrdersBySeller: (sellerId: string) => Order[];
  getOrdersByBuyer: (buyerId: string) => Order[];
  createOrder: (productId: string, buyerId: string, buyerName: string, buyerEmail: string) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<void>;
  completeOrder: (orderId: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isMountedRef = useRef(true);
  const isAuthenticatedRef = useRef(false);

  // Update auth ref whenever user changes
  useEffect(() => {
    isAuthenticatedRef.current = !!user;
  }, [user]);

  // Fetch products on mount
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Reduce initial load - fetch only 20 products for faster initial render
      const response = await productApi.getAll({ limit: 20 });
      
      // Transform backend data to frontend format using shared utility
      const transformedProducts = transformProducts(response.products);
      
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch orders on mount if user is logged in
  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]); // Clear orders when user logs out
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const [currentOrders, previousOrders] = await Promise.all([
        orderApi.getCurrentOrders(),
        orderApi.getPreviousOrders(),
      ]);
      
      // Check if still authenticated and mounted before updating state
      if (!isAuthenticatedRef.current || !isMountedRef.current) {
        return;
      }
      
      // Transform backend data to frontend format
      const allOrders: Order[] = [
        ...currentOrders.orders.map((o: any) => transformOrder(o)),
        ...previousOrders.orders.map((o: any) => transformOrder(o)),
      ];
      
      setOrders(allOrders);
    } catch (err: any) {
      // Only process errors if still authenticated and mounted
      if (!isAuthenticatedRef.current || !isMountedRef.current) {
        return;
      }
      
      // Don't log 401 errors (expected during auth transitions)
      if (err.message !== 'Unauthorized') {
        console.error("Error fetching orders:", err);
        setError(err.message);
      }
      setOrders([]); // Clear orders on error
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (user) {
      // Small delay to ensure session is established
      const timer = setTimeout(() => {
        if (isAuthenticatedRef.current) {
          refreshOrders();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Clear orders immediately when user becomes null
      setOrders([]);
      setError(null);
    }
  }, [user, refreshOrders]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addProduct = async (productData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Handle price as either string or number
      const priceValue = typeof productData.price === 'string' 
        ? parseFloat(productData.price.replace(/[$,]/g, ""))
        : productData.price;
      
      const backendData = {
        title: productData.title,
        description: productData.description,
        price: priceValue,
        condition: mapConditionToBackend(productData.condition),
        category: productData.category,
        images: productData.images || (productData.image ? [productData.image] : []),
        location: productData.location,
      };
      
      await productApi.create(backendData);
      await refreshProducts();
    } catch (err: any) {
      console.error("Error adding product:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const backendUpdates: any = {};
      if (updates.title) backendUpdates.title = updates.title;
      if (updates.description) backendUpdates.description = updates.description;
      if (updates.price !== undefined) {
        backendUpdates.price = typeof updates.price === 'string'
          ? parseFloat(updates.price.replace(/[$,]/g, ""))
          : updates.price;
      }
      if (updates.condition) backendUpdates.condition = mapConditionToBackend(updates.condition);
      if (updates.category) backendUpdates.category = updates.category;
      if (updates.images) {
        backendUpdates.images = updates.images;
      } else if (updates.image) {
        backendUpdates.images = [updates.image];
      }
      if (updates.location !== undefined) backendUpdates.location = updates.location;
      if (updates.status === "sold") backendUpdates.status = "sold";
      if (updates.status === "active") backendUpdates.status = "available";
      if (updates.status === "delisted") backendUpdates.status = "delisted";
      
      await productApi.update(id, backendUpdates);
      await refreshProducts();
    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await productApi.delete(id);
      await refreshProducts();
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsBySeller = (sellerId: string) => {
    return products.filter((p) => p.sellerId === sellerId);
  };

  const getOrdersBySeller = (sellerId: string) => {
    return orders.filter((o) => o.items.some(item => item.sellerId === sellerId));
  };

  const getOrdersByBuyer = (buyerId: string) => {
    return orders.filter((o) => o.user === buyerId);
  };

  const createOrder = async (
    productId: string,
    _buyerId: string,
    _buyerName: string,
    _buyerEmail: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await orderApi.buyProduct(productId);
      await Promise.all([refreshProducts(), refreshOrders()]);
      return true;
    } catch (err: any) {
      console.error("Error creating order:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderApi.cancelOrder(orderId);
      await Promise.all([refreshProducts(), refreshOrders()]);
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderApi.checkoutOrder(orderId);
      await refreshOrders();
    } catch (err: any) {
      console.error("Error completing order:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsBySeller,
        getOrdersBySeller,
        getOrdersByBuyer,
        createOrder,
        cancelOrder,
        completeOrder,
        refreshProducts,
        refreshOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// Helper functions to map between frontend and backend formats
function mapCondition(backendCondition: string): ProductCondition {
  const conditionMap: Record<string, ProductCondition> = {
    "new": "New",
    "like-new": "Used - Like New",
    "good": "Used - Good",
    "fair": "Used - Fair",
    "poor": "Used - Fair",
  };
  return conditionMap[backendCondition] || "Used - Good";
}

function mapConditionToBackend(frontendCondition: ProductCondition): string {
  const conditionMap: Record<ProductCondition, string> = {
    "New": "new",
    "Used - Like New": "like-new",
    "Used - Excellent": "like-new",
    "Used - Good": "good",
    "Used - Fair": "fair",
  };
  return conditionMap[frontendCondition] || "good";
}

function transformOrder(backendOrder: any): Order {
  return {
    id: backendOrder._id,
    user: backendOrder.user,
    status: backendOrder.status,
    paymentStatus: backendOrder.paymentStatus,
    items: backendOrder.items.map((item: any) => {
      // Ensure product ID is a clean string
      let productId = item.product;
      if (typeof productId === 'object' && productId !== null) {
        productId = productId._id || productId.toString();
      }
      const cleanId = String(productId);
      return {
        product: cleanId,
        title: item.title,
        price: item.price,
        qty: item.qty,
        imageUrl: item.imageUrl,
        sellerId: item.sellerId,
      };
    }),
    subtotal: backendOrder.subtotal,
    note: backendOrder.note,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
  };
}
