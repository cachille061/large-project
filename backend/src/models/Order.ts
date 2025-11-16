import { Schema, model, Types, Document } from "mongoose";

export type OrderStatus = "CURRENT" | "FULFILLED" | "CANCELED";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";

export interface IOrderItem {
  product: Types.ObjectId;
  title: string;
  price: number; // whole-number dollars
  qty: 1;        // single-unit marketplace
  imageUrl?: string;
  sellerId?: string;
}

export interface IOrder extends Document {
  user: string;            // Better Auth user id (string)
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: IOrderItem[];
  subtotal: number;        // dollars
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, enum: [1], default: 1 },
    imageUrl: { type: String, default: "" },
    sellerId: { type: String }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: String, required: true, index: true },
    status: { type: String, enum: ["CURRENT", "FULFILLED", "CANCELED"], default: "CURRENT", index: true },
    paymentStatus: { type: String, enum: ["PENDING", "PAID", "REFUNDED"], default: "PENDING" },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0, default: 0 },
    note: { type: String, default: "" }
  },
  { timestamps: true, collection: "orders" }
);

// text search in item titles
OrderSchema.index({ "items.title": "text" });

// Compound index for common query pattern (user + status)
OrderSchema.index({ user: 1, status: 1 });

export default model<IOrder>("Order", OrderSchema);
