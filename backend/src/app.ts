import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import { auth } from "./middlewares/auth";
import { requireAuth, optionalAuth } from "./middlewares/requireAuth";
import { toNodeHandler } from "better-auth/node";

export const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// DON'T use express.json() before Better Auth handler!
// It will cause the client API to get stuck on "pending"

app.get("/health", (_req, res) => {
    const dbStatus =
        mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.json({
        ok: true,
        database: dbStatus,
        timestamp: new Date().toISOString(),
    });
});

// Better Auth routes - Express v5 syntax with *splat
app.all("/api/auth/*splat", toNodeHandler(auth));

// NOW you can use express.json() for other routes
app.use(express.json());

// Example protected route
app.get("/api/protected", requireAuth, (req, res) => {
    res.json({
        message: "This is a protected route! You are authenticated.",
        user: req.user,
    });
});

// Example public route with optional auth
app.get("/api/public", optionalAuth, (req, res) => {
    res.json({
        message: "This is a public route",
        user: req.user || null,
    });
});

app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});