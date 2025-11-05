// backend/src/routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { requireAuth } from '../middlewares/requireAuth';
import {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId,
} from '../middlewares/productValidation';

const router = Router();

// Public routes (no auth required)
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', validateProductId, ProductController.getProductById);
router.get('/products/seller/:sellerId', ProductController.getProductsBySeller);

// Protected routes (auth required)
router.post(
    '/products',
    requireAuth,
    validateCreateProduct,
    ProductController.createProduct
);

router.put(
    '/products/:id',
    requireAuth,
    validateProductId,
    validateUpdateProduct,
    ProductController.updateProduct
);

router.delete(
    '/products/:id',
    requireAuth,
    validateProductId,
    ProductController.deleteProduct
);

router.patch(
    '/products/:id/sold',
    requireAuth,
    validateProductId,
    ProductController.markAsSold
);

export default router;