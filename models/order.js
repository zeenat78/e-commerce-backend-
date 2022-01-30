const mongoose = require("mongoose");
const { stringify } = require("uuid");
const { ObjectId } = mongoose.Schema;
const productCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: { type: String },
  count: { type: Number },
  price: { type: Number },
});
const ProductCart = mongoose.model("ProductCart", productCartSchema);
const orderSchema = new mongoose.Schema(
  {
    products: [productCartSchema],
    transaction_id: {
      type: Number,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      default: "received",
      enum: ["delivered", "received", "shipped", "processing", "cancelled"],
    },
    amount: { type: Number },
    address: { type: String },
    user: {
      type: ObjectId,
      ref: "User",
    },
    updated: Date,
  },
  { timestamp: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order, ProductCart };
