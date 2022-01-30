const express = require("express");
const { signin, signout, signup, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();

//signUp
router.post(
  "/signup",
  check("name")
    .isLength({ min: 3 })
    .withMessage("name should be more than 3 characters"),
  check("email").isEmail().withMessage("Email is not valid"),
  check("password")
    .isLength({ min: 3 })
    .withMessage("password should be more than 3 characters"),
  signup
);
//signIn
router.post(
  "/signin",
  check("email").isEmail(),
  check("password").isLength({ min: 1 }),
  signin
);
//signOut
router.get("/signout", signout);

module.exports = router;
