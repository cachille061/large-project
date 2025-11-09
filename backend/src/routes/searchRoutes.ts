import { Router } from 'express';
import {
    searchProducts,
    getSearchSuggestions,
    getPopularSearches,
} from '../controllers/searchController';
import { validateSearchQuery } from '../middlewares/searchValidation';

const router = Router();

/**
 * @route   GET /api/search
 * @desc    Search products with filters, sorting, and pagination
 * @access  Public
 * @query   {
 *   q: string (optional) - Search term
 *   category: string (optional) - Filter by category
 *   condition: string (optional) - Filter by condition (new, like-new, etc.)
 *   status: string (optional) - Filter by status (default: available)
 *   minPrice: number (optional) - Minimum price
 *   maxPrice: number (optional) - Maximum price
 *   location: string (optional) - Filter by location
 *   sortBy: string (optional) - Sort by: relevance, price-asc, price-desc, date-desc, date-asc
 *   page: number (optional) - Page number (default: 1)
 *   limit: number (optional) - Results per page (default: 20, max: 100)
 * }
 *
 * @example
 * GET /api/search?q=iphone&minPrice=500&maxPrice=1000&sortBy=price-asc&page=1
 */
router.get('/search', validateSearchQuery, searchProducts);

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions/autocomplete based on partial input
 * @access  Public
 * @query   q - Partial search term (min 2 characters)
 *
 * @example
 * GET /api/search/suggestions?q=iph
 */
router.get('/search/suggestions', getSearchSuggestions);

/**
 * @route   GET /api/search/popular
 * @desc    Get popular/trending search terms
 * @access  Public
 *
 * @example
 * GET /api/search/popular
 */
router.get('/search/popular', getPopularSearches);

export default router;