// Shared utility for transforming backend product data to frontend format
import { Product } from "../contexts/DataContext";
import { ProductCondition, ProductStatus } from "../constants";
import { formatPrice } from "./formatPrice";

// Map backend condition to frontend ProductCondition enum
// Must match the mapping in DataContext for consistency
const conditionMap: Record<string, ProductCondition> = {
  "new": "New",
  "like-new": "Used - Like New",
  "good": "Used - Good",
  "fair": "Used - Fair",
  "poor": "Used - Fair", // Map 'poor' to 'fair' as per DataContext
};

export const mapCondition = (condition: string): ProductCondition => {
  return conditionMap[condition] || "Used - Good";
};

// Map backend status to frontend status
const statusMap: Record<string, ProductStatus> = {
  "available": "active",
  "sold": "sold",
  "delisted": "delisted",
  "pending": "active", // Pending items are still active
};

export const mapStatus = (status: string): ProductStatus => {
  return statusMap[status] || "active";
};

/**
 * Transform a single backend product to frontend Product interface
 */
export const transformProduct = (p: any): Product => {
  return {
    id: p._id,
    title: p.title,
    price: formatPrice(p.price),
    originalPrice: p.originalPrice ? formatPrice(p.originalPrice) : undefined,
    location: p.location || "Location not specified",
    image: p.images?.[0] || "",
    condition: mapCondition(p.condition),
    description: p.description,
    category: p.category,
    sellerId: p.sellerId,
    sellerName: p.sellerName || "Unknown Seller",
    sellerProfilePicture: p.sellerProfilePicture,
    status: mapStatus(p.status),
    createdAt: p.createdAt,
  };
};

/**
 * Transform an array of backend products to frontend Product array
 */
export const transformProducts = (products: any[]): Product[] => {
  return products.map(transformProduct);
};
