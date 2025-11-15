import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from '../src/models/Products';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

async function migrateOriginalPrice() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all products that don't have originalPrice set
        const productsWithoutOriginalPrice = await Product.find({
            $or: [
                { originalPrice: { $exists: false } },
                { originalPrice: null }
            ]
        });

        console.log(`Found ${productsWithoutOriginalPrice.length} products without originalPrice`);

        // Update each product to set originalPrice = current price
        for (const product of productsWithoutOriginalPrice) {
            await Product.findByIdAndUpdate(
                product._id,
                { $set: { originalPrice: product.price } },
                { runValidators: false }
            );
            console.log(`Updated product: ${product.title} - set originalPrice to ${product.price}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateOriginalPrice();
