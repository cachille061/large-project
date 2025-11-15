import * as dotenv from 'dotenv';
import { app } from './app';
import { connectDB } from '../config/connection';
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Then start the Express server
        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Health check available at http://localhost:${PORT}/health`);
        });

        // Handle server errors
        server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please free up the port or use a different one.`);
            } else {
                console.error('Server error:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
