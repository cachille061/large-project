// backend/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import Product from '../models/Products';
import mongoose from 'mongoose';
import { enrichProductsWithSellerInfo, enrichProductWithSellerInfo } from '../utils/userHelper';

export class ProductController {
    // Create a new product listing
    static async createProduct(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const productData = {
                ...req.body,
                sellerId: userId,
                originalPrice: req.body.price, // Set original price on creation
            };

            const product = await Product.create(productData);

            res.status(201).json({
                message: 'Product created successfully',
                product,
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    }

    // Get all products with filtering, sorting, and pagination
    static async getAllProducts(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 20,
                status,
                category,
                minPrice,
                maxPrice,
                condition,
                search,
                sortBy = 'createdAt',
                order = 'desc',
            } = req.query;

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            // Build filter query
            const filter: any = {};

            if (status) {
                filter.status = status;
            }

            if (category) {
                filter.category = category;
            }

            if (condition) {
                filter.condition = condition;
            }

            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
                if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
            }

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }

            // Build sort object
            const sortOrder = order === 'asc' ? 1 : -1;
            const sort: any = { [sortBy as string]: sortOrder };

            const [products, total] = await Promise.all([
                Product.find(filter).sort(sort).skip(skip).limit(limitNum),
                Product.countDocuments(filter),
            ]);

            // Enrich products with seller information
            const enrichedProducts = await enrichProductsWithSellerInfo(products);

            res.json({
                products: enrichedProducts,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum),
                },
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    // Get a single product by ID
    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Enrich product with seller information
            const enrichedProduct = await enrichProductWithSellerInfo(product);

            res.json({ product: enrichedProduct });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }

    // Get products by seller ID
    static async getProductsBySeller(req: Request, res: Response) {
        try {
            const { sellerId } = req.params;
            const { status } = req.query;

            const filter: any = { sellerId };
            if (status) {
                filter.status = status;
            }

            const products = await Product.find(filter).sort({ createdAt: -1 });

            // Enrich products with seller information
            const enrichedProducts = await enrichProductsWithSellerInfo(products);

            res.json({
                products: enrichedProducts,
                count: enrichedProducts.length,
            });
        } catch (error) {
            console.error('Error fetching seller products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    // Update a product
    static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Check ownership
            if (product.sellerId !== userId) {
                return res.status(403).json({ error: 'Forbidden: You can only update your own products' });
            }

            // Preserve originalPrice - never allow it to be updated
            const updateData = { ...req.body };
            delete updateData.originalPrice;

            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            res.json({
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Failed to update product' });
        }
    }

    // Delete a product
    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Check ownership
            if (product.sellerId !== userId) {
                return res.status(403).json({ error: 'Forbidden: You can only delete your own products' });
            }

            await Product.findByIdAndDelete(id);

            res.json({
                message: 'Product deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }

    // Mark product as sold
    static async markAsSold(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Check ownership
            if (product.sellerId !== userId) {
                return res.status(403).json({ error: 'Forbidden: You can only update your own products' });
            }

            product.status = 'sold';
            await product.save();

            res.json({
                message: 'Product marked as sold',
                product,
            });
        } catch (error) {
            console.error('Error marking product as sold:', error);
            res.status(500).json({ error: 'Failed to update product status' });
        }
    }
}