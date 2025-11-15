// backend/src/routes/paymentRoutes.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { createStripeCheckoutSession } from "../controllers/paymentController";

const router = Router();

// Stripe Checkout (sandbox/test mode)
router.post("/stripe/checkout-session", requireAuth, createStripeCheckoutSession);

export default router;