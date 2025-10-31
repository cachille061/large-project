import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
        ok: true,
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});
