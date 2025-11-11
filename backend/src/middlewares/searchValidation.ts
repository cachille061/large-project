import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Search query validation schema
const searchQuerySchema = z.object({
    // Search term
    q: z.string().min(1, 'Search query cannot be empty').max(200, 'Search query too long').optional(),

    // Filters
    category: z.string().max(50).optional(),
    condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']).optional(),
    status: z.enum(['available', 'sold', 'pending']).optional().default('available'),

    // Price range
    minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional().transform(val => val ? parseFloat(val) : undefined),
    maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional().transform(val => val ? parseFloat(val) : undefined),

    // Location
    location: z.string().max(100).optional(),

    // Sorting
    sortBy: z.enum(['relevance', 'price-asc', 'price-desc', 'date-desc', 'date-asc']).optional().default('relevance'),

    // Pagination
    page: z.string().regex(/^\d+$/, 'Page must be a number').optional().default('1').transform(val => parseInt(val)),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional().default('20').transform(val => Math.min(parseInt(val), 100)), // Max 100 items per page
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const validateSearchQuery = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Validate and transform query parameters
        const validatedQuery = searchQuerySchema.parse(req.query);

        // Additional validation: maxPrice should be greater than minPrice
        if (validatedQuery.minPrice && validatedQuery.maxPrice) {
            if (validatedQuery.maxPrice < validatedQuery.minPrice) {
                res.status(400).json({
                    error: 'Validation error',
                    details: 'Maximum price must be greater than minimum price',
                });
                return;
            }
        }

        // Attach validated query to request
        (req as any).validatedSearch = validatedQuery;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                details: error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            });
            return;
        }
        res.status(500).json({
            error: 'Internal server error during validation',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};