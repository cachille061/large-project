// backend/src/routes/stripeWebhookRoutes.ts
import { Router } from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import Order from "../models/Order";
import Product from "../models/Products";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

// This route MUST use raw body so Stripe signature verification works
router.post(
  "/stripe", // 👈 only /stripe here; full path will be /api/webhooks/stripe
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error("Stripe webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.client_reference_id;
        if (!orderId) {
          console.warn("No client_reference_id on session");
        } else {
          const order = await Order.findById(orderId);
          if (order && order.status === "CURRENT") {
            // Mark products as sold (single-unit)
            for (const it of order.items) {
              const p: any = await Product.findById(it.product);
              if (p && p.status === "available") {
                p.status = "sold";
                await p.save();
              }
            }

            order.paymentStatus = "PAID";
            order.status = "FULFILLED";
            await order.save();
          }
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("Stripe webhook processing error:", err.message || err);
      res.status(500).send("Webhook handler error");
    }
  }
);

export default router;
