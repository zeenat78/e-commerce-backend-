const User = require("../models/user");
const Order = require("../models/order");

//getUserById
exports.getUserById = (req, res, next, id) => {
  const excludeDataObj = {
    createdAt: 0,
    salt: 0,
    encry_password: 0,
    updatedAt: 0,
  };
  User.findById(id, excludeDataObj, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "cannot find user",
      });
    }
    req.profile = user;
    next();
  });
};
//get user
exports.getUser = (req, res) => {
  return res.json(req.profile);
};
//update user
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },

    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "Only autherised user can update",
        });
      }
      res.json(user);
    }
  );
};
//get User Orders
exports.getUserPurchaseList = (req, res) => {
  Order.findById(
    { _id: req.profile._id }.populate("user", "_id name").exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order in User list",
        });
      }
      return res.json(order);
    })
  );
};
exports.pushOrderInPurchaseList = (req, res, next) => {
  const purchase = [];
  req.body.order.products.forEach((product) => {
    purchase.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
    //update purchase list in database
    User.findOneAndUpdate(
      { id: req.profile._id },
      { $push: { purchase: purchase } },
      { new: true },
      (err, purchase) => {
        if (err) {
          return res.status(400).json({
            error: "unable to save purchase list in DB",
          });
        }
        next();
      }
    );
  });
};
