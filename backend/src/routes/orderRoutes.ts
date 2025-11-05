import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  getCurrentOrders,
  searchCurrentOrders,
  buyProduct,
  cancelCurrentOrder,
  checkoutOrder,
  getPreviousOrders,
  searchPreviousOrders,
  adminDeleteOrder
} from "../controllers/orderController";

const router = Router();

// Current orders
router.get("/current", requireAuth, getCurrentOrders);
router.get("/current/search", requireAuth, searchCurrentOrders);
router.post("/current", requireAuth, buyProduct);

// Cancel & Checkout
router.post("/:orderId/cancel", requireAuth, cancelCurrentOrder);
router.post("/:orderId/checkout", requireAuth, checkoutOrder);

// Previous (fulfilled)
router.get("/previous", requireAuth, getPreviousOrders);
router.get("/previous/search", requireAuth, searchPreviousOrders);

// Admin (optional guard)
router.delete("/:orderId", requireAuth, adminDeleteOrder);

export default router;
