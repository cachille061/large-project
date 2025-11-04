import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const createProductSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description cannot exceed 2000 characters'),
    price: z.number().min(0, 'Price cannot be negative').or(z.string().transform(Number)),
    condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor'], {
        errorMap: () => ({ message: 'Invalid condition value' }),
    }),
    category: z.string().min(2, 'Category is required'),
    images: z.array(z.string().url('Each image must be a valid URL')).max(10, 'Maximum 10 images allowed').optional(),
    location: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial();

const productIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
});

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = createProductSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
        }
        next(error);
    }
};

export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = updateProductSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
        }
        next(error);
    }
};

export const validateProductId = (req: Request, res: Response, next: NextFunction) => {
    try {
        productIdSchema.parse({ id: req.params.id });
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Invalid product ID',
            });
        }
        next(error);
    }
};