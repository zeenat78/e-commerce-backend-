const express = require("express");
const router = express.Router();
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getAllOrders,
  createOrder,
  getOrderStatus,
  updateStatus,
  getOrderById,
} = require("../controllers/order");
//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);
//create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
//get all orders
router.get(
  "/order/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);
//get order status
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
//update status
router.put(
  "/order/update/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
