import { Request, Response } from 'express';
import Product from '../models/Products';
import { SearchQuery } from '../middlewares/searchValidation';
import { enrichProductsWithSellerInfo } from '../utils/userHelper';

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            q,
            category,
            condition,
            status,
            minPrice,
            maxPrice,
            location,
            sortBy,
            page,
            limit,
        } = (req as any).validatedSearch as SearchQuery;

        // Build the search query
        const query: any = {};

        // Text search with MongoDB's $text operator (uses text index)
        if (q) {
            query.$text = { $search: q };
        }

        // Filter by status (default to 'available')
        query.status = status || 'available';

        // Apply filters
        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        if (condition) {
            query.condition = condition;
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = minPrice;
            if (maxPrice !== undefined) query.price.$lte = maxPrice;
        }

        // Location filter (partial match)
        if (location) {
            query.location = { $regex: new RegExp(location, 'i') };
        }

        // Build sort options
        let sort: any = {};

        switch (sortBy) {
            case 'relevance':
                // If text search is used, sort by text score (relevance)
                if (q) {
                    sort = { score: { $meta: 'textScore' } };
                } else {
                    // If no text search, sort by newest
                    sort = { createdAt: -1 };
                }
                break;
            case 'price-asc':
                sort = { price: 1 };
                break;
            case 'price-desc':
                sort = { price: -1 };
                break;
            case 'date-desc':
                sort = { createdAt: -1 };
                break;
            case 'date-asc':
                sort = { createdAt: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with projection for text score if doing text search
        let productsQuery = Product.find(query);

        // Add text score projection if text search is active
        if (q && sortBy === 'relevance') {
            productsQuery = productsQuery.select({ score: { $meta: 'textScore' } });
        }

        // Apply sort, skip, and limit
        const products = await productsQuery
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const totalResults = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalResults / limit);

        // Enrich products with seller information
        const enrichedProducts = await enrichProductsWithSellerInfo(products);

        // Response with results and pagination metadata
        res.json({
            products: enrichedProducts,
            pagination: {
                page: page,
                limit: limit,
                total: totalResults,
                pages: totalPages,
            },
            filters: {
                query: q || null,
                category: category || null,
                condition: condition || null,
                status: status || 'available',
                priceRange: {
                    min: minPrice || null,
                    max: maxPrice || null,
                },
                location: location || null,
            },
            sortedBy: sortBy || 'relevance',
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Failed to search products',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get search suggestions based on partial input (autocomplete)
export const getSearchSuggestions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({ error: 'Query parameter "q" is required' });
            return;
        }
        if (q.length < 2) {
            res.json({ suggestions: [] });
            return;
        }

        const regex = new RegExp(`^${q}`, 'i'); // Match at the start of the string

        // 1. Get product titles that START with the query (highest priority)
        const titleAgg = await Product.aggregate<{ term: string }>([
            { $match: { title: { $regex: regex }, status: 'available' } },
            { $group: { _id: '$title', count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 7 },
            { $project: { _id: 0, term: '$_id' } }
        ]);

        // 2. Get categories that START with the query (lower priority)
        const categoryAgg = await Product.aggregate<{ term: string }>([
            { $match: { category: { $regex: regex }, status: 'available' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 3 },
            { $project: { _id: 0, term: '$_id' } }
        ]);

        // Product titles first, then categories, remove duplicates, cap at 10
        const suggestions = [
            ...titleAgg.map(x => x.term),
            ...categoryAgg.map(x => x.term).filter(cat => 
                !titleAgg.some(title => title.term.toLowerCase() === cat.toLowerCase())
            )
        ].slice(0, 10);

        res.json({ suggestions });
    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({
            error: 'Failed to get suggestions',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get popular/trending searches
export const getPopularSearches = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Get top 10 most common categories as popular searches
        const popularCategories = await Product.aggregate([
            { $match: { status: 'available' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, term: '$_id', count: 1 } },
        ]);

        res.json({
            popular: popularCategories.map(c => c.term),
        });
    } catch (error) {
        console.error('Popular searches error:', error);
        res.status(500).json({
            error: 'Failed to get popular searches',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};