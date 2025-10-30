import express from "express";
import helmet from "helmet";
import cors from "cors";

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
