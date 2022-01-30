const express = require("express");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const {
  getUserById,
  getUser,
  updateUser,
  getUserPurchaseList,
} = require("../controllers/user");
const router = express.Router();

router.param("id", getUserById);
//access user information
router.get("/user/:id", isSignedIn, isAuthenticated, getUser);
//updating user info
router.put("/user/:id", isSignedIn, isAuthenticated, updateUser);
//access user orders
router.get("/user/order/:id", getUserPurchaseList);

module.exports = router;
