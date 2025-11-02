import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ProductCategory, ProductCondition, ProductStatus, OrderStatus } from "../constants";

export interface Product {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  condition: ProductCondition;
  description: string;
  category: ProductCategory;
  sellerId: string;
  sellerName: string;
  status: ProductStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  status: OrderStatus;
  createdAt: string;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, "id" | "createdAt" | "status">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsBySeller: (sellerId: string) => Product[];
  getOrdersBySeller: (sellerId: string) => Order[];
  getOrdersByBuyer: (buyerId: string) => Order[];
  createOrder: (productId: string, buyerId: string, buyerName: string, buyerEmail: string) => boolean;
  cancelOrder: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialProducts: Product[] = [
  {
    id: "1",
    title: "RGB Gaming Keyboard - Mechanical Switches",
    price: "$85",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjE4NTczOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Used - Like New",
    description: "High-quality mechanical gaming keyboard with RGB backlighting. Cherry MX Red switches, excellent for both gaming and typing.",
    category: "Keyboards",
    sellerId: "seller_1",
    sellerName: "Alex Chen",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "2",
    title: "27-inch 4K Monitor - Dell UltraSharp",
    price: "$380",
    location: "Winter Park, FL",
    image: "https://images.unsplash.com/photo-1611648694931-1aeda329f9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3J8ZW58MXx8fHwxNzYxODg0NDU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Used - Good",
    description: "Dell UltraSharp 27-inch 4K monitor with IPS panel. Perfect for professional work and gaming.",
    category: "Monitors & Displays",
    sellerId: "seller_2",
    sellerName: "Sarah Kim",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "3",
    title: "NVIDIA RTX 3070 Graphics Card",
    price: "$420",
    location: "Lake Nona, FL",
    image: "https://images.unsplash.com/photo-1658673847785-08f1738116f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljcyUyMGNhcmQlMjBncHV8ZW58MXx8fHwxNzYxOTAzODE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Used - Excellent",
    description: "NVIDIA GeForce RTX 3070 8GB graphics card. Never used for mining, only gaming.",
    category: "Computer Parts",
    sellerId: "seller_1",
    sellerName: "Alex Chen",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "4",
    title: "Apple MacBook Pro 16-inch M2 Pro",
    price: "$1,899",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Like New",
    description: "MacBook Pro 16-inch with M2 Pro chip, 16GB RAM, 512GB SSD. Includes original box and charger.",
    category: "Laptops & Computers",
    sellerId: "seller_3",
    sellerName: "Mike Johnson",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "5",
    title: "Logitech MX Master 3 Wireless Mouse",
    price: "$65",
    location: "Winter Garden, FL",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Good",
    description: "Ergonomic wireless mouse with programmable buttons. Great for productivity and design work.",
    category: "Mice & Peripherals",
    sellerId: "seller_2",
    sellerName: "Sarah Kim",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "6",
    title: "Samsung 34-inch Ultrawide Curved Monitor",
    price: "$450",
    location: "Kissimmee, FL",
    image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Excellent",
    description: "34-inch ultrawide curved monitor with 1440p resolution. Perfect for multitasking and immersive gaming.",
    category: "Monitors & Displays",
    sellerId: "seller_1",
    sellerName: "Alex Chen",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "7",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    price: "$320",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "New",
    description: "Brand new Sony WH-1000XM5 with industry-leading noise cancellation. Still in sealed box.",
    category: "Audio & Headphones",
    sellerId: "seller_4",
    sellerName: "Emma Davis",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "8",
    title: "iPad Pro 12.9-inch (5th Gen) 256GB",
    price: "$799",
    location: "Lake Mary, FL",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Like New",
    description: "iPad Pro with M1 chip, 256GB storage. Includes Apple Pencil 2nd Gen. Perfect for creative work.",
    category: "Phones & Tablets",
    sellerId: "seller_3",
    sellerName: "Mike Johnson",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "9",
    title: "Custom Gaming PC - Ryzen 7 5800X + RTX 3080",
    price: "$1,450",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Excellent",
    description: "High-end gaming PC with AMD Ryzen 7 5800X, RTX 3080, 32GB RAM, 1TB NVMe SSD. RGB lighting included.",
    category: "Laptops & Computers",
    sellerId: "seller_1",
    sellerName: "Alex Chen",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: "10",
    title: "Canon EOS R6 Mirrorless Camera Body",
    price: "$1,899",
    location: "Windermere, FL",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Good",
    description: "Canon EOS R6 full-frame mirrorless camera. Low shutter count, excellent condition.",
    category: "Cameras & Webcams",
    sellerId: "seller_5",
    sellerName: "David Lee",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "11",
    title: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    price: "$110",
    location: "Apopka, FL",
    image: "https://images.unsplash.com/photo-1563297007-0686b7003af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "New",
    description: "Brand new Razer DeathAdder V3 Pro with HyperSpeed wireless technology. Lightweight design.",
    category: "Mice & Peripherals",
    sellerId: "seller_2",
    sellerName: "Sarah Kim",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
  },
  {
    id: "12",
    title: "Nintendo Switch OLED - White Edition",
    price: "$299",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Like New",
    description: "Nintendo Switch OLED model in white. Barely used, comes with dock and all accessories.",
    category: "Gaming Consoles",
    sellerId: "seller_4",
    sellerName: "Emma Davis",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "13",
    title: "Blue Yeti USB Microphone - Silver",
    price: "$85",
    location: "Sanford, FL",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Good",
    description: "Blue Yeti professional USB microphone. Great for streaming, podcasting, and recording.",
    category: "Audio & Headphones",
    sellerId: "seller_3",
    sellerName: "Mike Johnson",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 13).toISOString(),
  },
  {
    id: "14",
    title: "Elgato Stream Deck MK.2",
    price: "$120",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Excellent",
    description: "Elgato Stream Deck with 15 customizable LCD keys. Perfect for streamers and content creators.",
    category: "Streaming Equipment",
    sellerId: "seller_1",
    sellerName: "Alex Chen",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "15",
    title: "LG C2 42-inch OLED Gaming TV",
    price: "$899",
    location: "Celebration, FL",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    condition: "Used - Like New",
    description: "LG C2 OLED 42-inch with 120Hz refresh rate. Perfect for PS5 and Xbox Series X gaming.",
    category: "Monitors & Displays",
    sellerId: "seller_5",
    sellerName: "David Lee",
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Initialize state directly from localStorage to avoid double-render
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      return JSON.parse(storedProducts);
    } else {
      localStorage.setItem("products", JSON.stringify(initialProducts));
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  // Auto-complete orders after 7 seconds
  useEffect(() => {
    const checkPendingOrders = () => {
      const now = Date.now();
      setOrders((prev) => {
        const updatedOrders = prev.map((order) => {
          if (order.status === "pending") {
            const orderTime = new Date(order.createdAt).getTime();
            const timeDiff = now - orderTime;
            // Auto-complete after 7 seconds (7000ms)
            if (timeDiff >= 7000) {
              return { ...order, status: "completed" as const };
            }
          }
          return order;
        });
        
        // Only update if something changed
        if (JSON.stringify(updatedOrders) !== JSON.stringify(prev)) {
          localStorage.setItem("orders", JSON.stringify(updatedOrders));
          return updatedOrders;
        }
        return prev;
      });
    };

    // Check every second
    const interval = setInterval(checkPendingOrders, 1000);
    
    // Run immediately on mount
    checkPendingOrders();

    return () => clearInterval(interval);
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id" | "createdAt" | "status">) => {
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => {
      const updatedProducts = [...prev, newProduct];
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updatedProducts = prev.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updatedProducts = prev.filter((p) => p.id !== id);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }, []);

  const getProductsBySeller = (sellerId: string) => {
    return products.filter((p) => p.sellerId === sellerId);
  };

  const getOrdersBySeller = (sellerId: string) => {
    return orders.filter((o) => o.sellerId === sellerId);
  };

  const getOrdersByBuyer = (buyerId: string) => {
    return orders.filter((o) => o.buyerId === buyerId);
  };

  const createOrder = (
    productId: string,
    buyerId: string,
    buyerName: string,
    buyerEmail: string
  ): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.status !== "active") {
      return false;
    }

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      productPrice: product.price,
      buyerId,
      buyerName,
      buyerEmail,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updatedOrders = [...prev, newOrder];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    // Mark product as sold
    updateProduct(productId, { status: "sold" });

    return true;
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status === "pending") {
      // Update order status
      setOrders((prev) => {
        const updatedOrders = prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" as const } : o
        );
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        return updatedOrders;
      });

      // Mark product as active again
      updateProduct(order.productId, { status: "active" });
    }
  };

  const completeOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const updatedOrders = prev.map((o) =>
        o.id === orderId ? { ...o, status: "completed" as const } : o
      );
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsBySeller,
        getOrdersBySeller,
        getOrdersByBuyer,
        createOrder,
        cancelOrder,
        completeOrder,
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
