// backend/src/controllers/paymentController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import Order from "../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover", // must match your installed types
});

// POST /api/payments/stripe/checkout-session  { orderId }
export const createStripeCheckoutSession = async (req: Request, res: Response) => {
  try {
    const uid = req.user?.id;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const { orderId } = req.body as { orderId?: string };
    if (!orderId) return res.status(400).json({ error: "orderId is required" });

    // Find CURRENT order for this user
    const order = await Order.findOne({ _id: orderId, user: uid, status: "CURRENT" });
    if (!order || order.items.length === 0) {
      return res.status(404).json({ error: "Order not found or empty" });
    }

    // Stripe expects amounts in *cents*
    const lineItems = order.items.map((it) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: it.title,
        },
        unit_amount: it.price * 100, // convert dollars → cents
      },
      quantity: it.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      client_reference_id: order.id, // we'll use this in the webhook
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err?.message || err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
};
