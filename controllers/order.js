const { ProductCart, Order } = require("../models/order");
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "No Orders yet",
        });
      }
      req.order = order;
      next();
    });
};
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save().exec((err, order) => {
    if (err) {
      res.status(400).json({
        error: "Failed to save data in DB",
      });
    }
    res.json(order);
  });
};
//get all orders
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "name _id")
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          error: "No Order found",
        });
      }
      res.json(orders);
    });
};
//update status
exports.updateStatus = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, update) => {
      if (err) {
        return res.status(400).json({
          error: "status not updated in DB",
        });
      }
      res.json(update);
    }
  );
};
//get order status
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};
