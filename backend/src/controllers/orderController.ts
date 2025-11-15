import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Products";

const computeSubtotal = (items: { price: number; qty: number }[]) =>
  items.reduce((s, i) => s + i.price * i.qty, 0);

// Helper to serialize order with product IDs as strings (FROM YOUR BRANCH - FIXES BUG)
const serializeOrder = (order: any) => {
  const obj = order.toObject ? order.toObject() : order;
  return {
    ...obj,
    items: obj.items.map((item: any) => ({
      ...item,
      product: item.product.toString()
    }))
  };
};

// GET /api/orders/current
export const getCurrentOrders = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const orders = await Order.find({ user: uid, status: "CURRENT" }).sort({
    updatedAt: -1,
  });

  res.json({ orders: orders.map(serializeOrder) });
};

// GET /api/orders/current/search?q=term
export const searchCurrentOrders = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const q = (req.query.q as string) || "";
  const filter: any = { user: uid, status: "CURRENT" };

  if (q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  const orders = await Order.find(filter).sort({ updatedAt: -1 });
  res.json({ orders: orders.map(serializeOrder) });
};

// POST /api/orders/current  { productId }
export const buyProduct = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const { productId } = req.body as { productId?: string };
  if (!productId)
    return res.status(400).json({ error: "productId required" });

  const product: any = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.status !== "available")
    return res
      .status(409)
      .json({ error: "Product is not available" });

  // one CURRENT order (cart) per user
  let order = await Order.findOne({ user: uid, status: "CURRENT" });
  if (!order) {
    order = new Order({
      user: uid,
      status: "CURRENT",
      paymentStatus: "PENDING",
      items: [],
      subtotal: 0,
    });
  }

  // single-unit: don't allow duplicates
  const exists = order.items.some(
    (i) => i.product.toString() === product._id.toString()
  );
  if (exists)
    return res
      .status(409)
      .json({ error: "Item already in your current order" });

  order.items.push({
    product: product._id,
    title: product.title,
    price: product.price,
    qty: 1,
    imageUrl: product.images?.[0] || "",
    sellerId: product.sellerId,
  });

  order.subtotal = computeSubtotal(order.items);
  await order.save();

  res.status(201).json(serializeOrder(order));
};

// POST /api/orders/:orderId/cancel
export const cancelCurrentOrder = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const order = await Order.findOne({
    _id: req.params.orderId,
    user: uid,
    status: "CURRENT",
  });

  if (!order)
    return res
      .status(404)
      .json({ error: "Order not found or not cancelable" });

  order.status = "CANCELED";
  await order.save();

  res.json(serializeOrder(order));
};

// POST /api/orders/:orderId/checkout
// FROM MAIN - Uses real Stripe payment flow
export const checkoutOrder = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const order = await Order.findOne({
    _id: req.params.orderId,
    user: uid,
    status: "CURRENT",
  });

  if (!order || order.items.length === 0) {
    return res
      .status(404)
      .json({ error: "Order not found or empty" });
  }

  order.subtotal = computeSubtotal(order.items);
  await order.save();

  return res.json({
    message:
      "Order is ready for checkout. Use /api/payments/stripe/checkout-session to start payment.",
    order: serializeOrder(order),
  });
};

// GET /api/orders/previous
export const getPreviousOrders = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  // FROM YOUR BRANCH - includes CANCELED orders
  const orders = await Order.find({
    user: uid,
    status: { $in: ["FULFILLED", "CANCELED"] },
  }).sort({ updatedAt: -1 });

  res.json({ orders: orders.map(serializeOrder) });
};

// GET /api/orders/previous/search?q=term
export const searchPreviousOrders = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const q = (req.query.q as string) || "";
  const filter: any = { user: uid, status: { $in: ["FULFILLED", "CANCELED"] } };

  if (q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  const orders = await Order.find(filter).sort({ updatedAt: -1 });
  res.json({ orders: orders.map(serializeOrder) });
};

// DELETE /api/orders/:orderId
export const adminDeleteOrder = async (req: Request, res: Response) => {
  const del = await Order.findByIdAndDelete(req.params.orderId);
  if (!del) return res.status(404).json({ error: "Order not found" });

  res.json({ ok: true });
};