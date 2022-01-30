const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      location: errors.array()[0].param,
    });
  }
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: "Email Already Exists",
        reason: error.keyValue,
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  //checking validaton
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      err: error.array()[0].msg,
      location: error.array()[0].param,
    });
  }
  const { email, password } = req.body;
  //finding user in database
  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "not able to find User Email",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password are not correct",
      });
    }
    //create token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    //send response to frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  //clear token from cookie
  res.clearCookie("token");
  res.json({
    message: "user signOut successful",
  });
};
//protected route
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});
//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile_id == req.auth_id;
  if (!checker) {
    res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "you are not admin, Access denied",
    });
  }
  next();
};
