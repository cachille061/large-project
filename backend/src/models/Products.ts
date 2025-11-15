import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
    status: 'available' | 'sold' | 'pending' | 'delisted';
    category: string;
    images: string[];
    location?: string;
    sellerId: string; // Reference to Better Auth user ID
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            min: [0, 'Price cannot be negative'],
        },
        condition: {
            type: String,
            enum: {
                values: ['new', 'like-new', 'good', 'fair', 'poor'],
                message: '{VALUE} is not a valid condition',
            },
            required: [true, 'Product condition is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['available', 'sold', 'pending', 'delisted'],
                message: '{VALUE} is not a valid status',
            },
            default: 'available',
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: (v: string[]) => v.length <= 10,
                message: 'Cannot upload more than 10 images',
            },
        },
        location: {
            type: String,
            trim: true,
        },
        sellerId: {
            type: String,
            required: [true, 'Seller ID is required'],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ sellerId: 1, status: 1 });

const Product = mongoose.model<IProduct>('Product', productSchema);

// Weighted text index for search functionality
productSchema.index(
    {
        title: 'text',
        description: 'text',
        category: 'text',
    },
    {
        weights: {
            title: 10,
            category: 5,
            description: 1,
        },
        name: 'product_text_search',
    }
);

export default Product;