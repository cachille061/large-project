import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import Product from "../models/Products";

const computeSubtotal = (items: { price: number; qty: number }[]) =>
  items.reduce((s, i) => s + i.price * i.qty, 0);

// Helper to serialize order with product IDs as strings
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
  const orders = await Order.find({ user: uid, status: "CURRENT" }).sort({ updatedAt: -1 });
  res.json({ orders: orders.map(serializeOrder) });
};

// GET /api/orders/current/search?q=term
export const searchCurrentOrders = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });
  const q = (req.query.q as string) || "";
  const filter: any = { user: uid, status: "CURRENT" };
  if (q.trim()) filter.$text = { $search: q.trim() };
  const orders = await Order.find(filter).sort({ updatedAt: -1 });
  res.json({ orders: orders.map(serializeOrder) });
};

// POST /api/orders/current  { productId }
export const buyProduct = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const { productId } = req.body as { productId?: string };
  if (!productId) return res.status(400).json({ error: "productId required" });

  const product: any = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.status !== "available") return res.status(409).json({ error: "Product is not available" });

  // one CURRENT order (cart) per user
  let order = await Order.findOne({ user: uid, status: "CURRENT" });
  if (!order) {
    order = new Order({ user: uid, status: "CURRENT", paymentStatus: "PENDING", items: [], subtotal: 0 });
  }

  // single-unit: don’t allow duplicates
  const exists = order.items.some(i => i.product.toString() === product._id.toString());
  if (exists) return res.status(409).json({ error: "Item already in your current order" });

  order.items.push({
    product: product._id,
    title: product.title,
    price: product.price,      // whole-number dollars
    qty: 1,
    imageUrl: product.images?.[0] || "",
    sellerId: product.sellerId
  });

  order.subtotal = computeSubtotal(order.items);
  await order.save();

  res.status(201).json({ message: "Product added to cart", order });
};

// POST /api/orders/:orderId/cancel
export const cancelCurrentOrder = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const order = await Order.findOne({ _id: req.params.orderId, user: uid, status: "CURRENT" });
  if (!order) return res.status(404).json({ error: "Order not found or not cancelable" });

  order.status = "CANCELED";
  await order.save();
  res.json({ message: "Order canceled", order });
};

// POST /api/orders/:orderId/checkout
export const checkoutOrder = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const session = await mongoose.startSession();
  let final: any = null;

  await session.withTransaction(async () => {
    const order = await Order.findOne({ _id: req.params.orderId, user: uid, status: "CURRENT" }).session(session);
    if (!order) throw new Error("Order not found");

    // single-unit: each product must still be available → mark as sold
    for (const it of order.items) {
      const p: any = await Product.findById(it.product).session(session);
      if (!p) throw new Error("Product missing");
      if (p.status !== "available") throw new Error("Item already sold");
      p.status = "sold";
      await p.save({ session });
    }

    // mock payment success
    order.paymentStatus = "PAID";
    order.status = "FULFILLED";
    await order.save({ session });

    final = order;
  });

  session.endSession();

  if (!final) return res.status(409).json({ error: "Checkout failed" });
  res.json({ message: "Order completed", order: final });
};

// GET /api/orders/previous
export const getPreviousOrders = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });
  const orders = await Order.find({ user: uid, status: { $in: ["FULFILLED", "CANCELED"] } }).sort({ updatedAt: -1 });
  res.json({ orders: orders.map(serializeOrder) });
};

// GET /api/orders/previous/search?q=term
export const searchPreviousOrders = async (req: Request, res: Response) => {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });
  const q = (req.query.q as string) || "";
  const filter: any = { user: uid, status: { $in: ["FULFILLED", "CANCELED"] } };
  if (q.trim()) filter.$text = { $search: q.trim() };
  const orders = await Order.find(filter).sort({ updatedAt: -1 });
  res.json({ orders: orders.map(serializeOrder) });
};

// DELETE /api/orders/:orderId  (admin guard)
export const adminDeleteOrder = async (req: Request, res: Response) => {
  const del = await Order.findByIdAndDelete(req.params.orderId);
  if (!del) return res.status(404).json({ error: "Order not found" });
  res.json({ ok: true });
};
