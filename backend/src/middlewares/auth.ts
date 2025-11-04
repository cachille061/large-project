import * as dotenv from 'dotenv';
dotenv.config();

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { admin } from "better-auth/plugins";

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not defined in environment variables");
}

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

// Create MongoDB client and connect
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(); // Uses the database specified in the connection string

export const auth = betterAuth({
    // Use MongoDB adapter with both db and client
    database: mongodbAdapter(db, { client }),

    // Email and password authentication
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    // Social providers (OAuth 2.0)
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
        },
    },

    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:5173",
        process.env.FRONTEND_URL || "",
    ].filter(Boolean),

    // Session configuration
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },

    // Base URL
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    // Secret for signing tokens
    secret: process.env.BETTER_AUTH_SECRET,

    plugins: [
        admin() as any // Enable admin plugin (optional, for future admin features)
    ],

});

export { db };