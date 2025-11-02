// Product categories
export const PRODUCT_CATEGORIES = [
  "Laptops & Computers",
  "Monitors & Displays",
  "Computer Parts",
  "Storage & Memory",
  "Keyboards",
  "Mice & Peripherals",
  "Audio & Headphones",
  "Phones & Tablets",
  "Cameras & Webcams",
  "Printers & Scanners",
  "Networking",
  "Cables & Accessories",
  "Gaming Consoles",
  "Streaming Equipment",
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Product condition options
export const PRODUCT_CONDITIONS = [
  "New",
  "Used - Like New",
  "Used - Excellent",
  "Used - Good",
  "Used - Fair",
] as const;

export type ProductCondition = typeof PRODUCT_CONDITIONS[number];

// Product status
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  SOLD: "sold",
  DELISTED: "delisted",
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

// Order status
export const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
