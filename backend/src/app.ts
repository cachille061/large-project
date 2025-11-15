import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import { auth } from "./middlewares/auth";
import { requireAuth, optionalAuth } from "./middlewares/requireAuth";
import { toNodeHandler } from "better-auth/node";
import productRoutes from './routes/productRoutes';
import searchRoutes from './routes/searchRoutes';
import orderRoutes from "./routes/orderRoutes";


export const app = express();

const useFlutterCors = process.env.USE_FLUTTER_CORS === 'true';
app.use(helmet());
if (useFlutterCors) {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          /^http:\/\/localhost(:\d+)?$/.test(origin) ||
          /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );
}
else {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    })
  );
}

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

// Better Auth routes - mount at /api/auth
app.use("/api/auth", toNodeHandler(auth));

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

app.use('/api', productRoutes);
app.use('/api', searchRoutes);
app.use("/api/orders", orderRoutes);

app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status ?? 500;
      const body: any = { error: err.message ?? 'Internal Server Error' };
      if (process.env.NODE_ENV !== 'production') {
            if (err.details) body.details = err.details;   // e.g., zod issues
            body.stack = err.stack;
          }
      res.status(status).json(body);
    });
