// backend/src/services/user.service.ts
import { db } from '../middlewares/auth';

/**
 * Fetch a single user by their ID from Better Auth's user collection
 * @param userId - The user's ID
 * @returns User object or null if not found
 */
export const getUserById = async (userId: string) => {
    try {
        const usersCollection = db.collection('user');
        const { ObjectId } = await import('mongodb');

        const user = await usersCollection.findOne(
            { _id: new ObjectId(userId) },
            {
                projection: {
                    name: 1,
                    email: 1,
                    image: 1,
                    createdAt: 1,
                    _id: 1
                }
            }
        );

        return user ? { ...user, id: user._id.toString() } : null;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null;
    }
};

/**
 * Fetch a single user by their email from Better Auth's user collection
 * @param email - The user's email address
 * @returns User object or null if not found
 */
export const getUserByEmail = async (email: string) => {
    try {
        const usersCollection = db.collection('user');

        const user = await usersCollection.findOne(
            { email },
            {
                projection: {
                    name: 1,
                    email: 1,
                    image: 1,
                    createdAt: 1,
                    _id: 1
                }
            }
        );

        return user ? { ...user, id: user._id.toString() } : null;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
};

/**
 * Fetch multiple users by their IDs (useful for batch operations)
 * @param userIds - Array of user IDs
 * @returns Array of user objects
 */
export const getUsersByIds = async (userIds: string[]) => {
    try {
        const usersCollection = db.collection('user');
        const { ObjectId } = await import('mongodb');

        // Convert string IDs to ObjectIds
        const objectIds = userIds.map(id => {
            try {
                return new ObjectId(id);
            } catch (e) {
                console.error('Invalid ObjectId:', id);
                return null;
            }
        }).filter(Boolean);

        const users = await usersCollection.find(
            { _id: { $in: objectIds } },
            {
                projection: {
                    name: 1,
                    email: 1,
                    image: 1,
                    _id: 1
                }
            }
        ).toArray();

        // Add id field from _id for consistency
        return users.map(user => ({ ...user, id: user._id.toString() }));
    } catch (error) {
        console.error('Error fetching users by IDs:', error);
        return [];
    }
};

/**
 * Enrich products array with seller information
 * @param products - Array of products
 * @returns Products with sellerName and sellerEmail added
 */
export const enrichProductsWithSellerInfo = async (products: any[]) => {
    if (!products || products.length === 0) return products;
    
    // Get unique seller IDs
    const sellerIds = [...new Set(products.map((p: any) => p.sellerId).filter(Boolean))];
    
    if (sellerIds.length === 0) return products;
    
    // Fetch all sellers at once
    const sellers = await getUsersByIds(sellerIds);
    
    // Create a map for quick lookup
    const sellerMap = new Map();
    sellers.forEach((seller: any) => {
        sellerMap.set(seller.id, seller);
    });
    
    // Add seller info to each product
    return products.map((product: any) => {
        const seller = sellerMap.get(product.sellerId);
        const productObj = product.toObject ? product.toObject() : product;
        
        return {
            ...productObj,
            sellerName: seller?.name || seller?.email || 'Unknown Seller',
            sellerEmail: seller?.email || '',
        };
    });
};

/**
 * Enrich single product with seller information
 * @param product - Single product
 * @returns Product with sellerName and sellerEmail added
 */
export const enrichProductWithSellerInfo = async (product: any) => {
    if (!product) return product;
    
    const seller = await getUserById(product.sellerId);
    const productObj = product.toObject ? product.toObject() : product;
    
    return {
        ...productObj,
        sellerName: seller?.name || seller?.email || 'Unknown Seller',
        sellerEmail: seller?.email || '',
    };
};