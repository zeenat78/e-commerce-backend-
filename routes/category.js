const express = require("express");
const router = express.Router();
const {
  getCategoryById,
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("UserId", getUserById);
router.param("categoryId", getCategoryById);
//create category
router.post(
  "/category/create/:UserId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);
//get a category using categoryId
router.get("/category/:categoryId", getCategory);
//get all categories
router.get("/categories", getCategories);

//update category
router.put(
  "/category/:categoryId/:UserId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);
//delete category
router.delete(
  "/category/:categoryId/:UserId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);
module.exports = router;
