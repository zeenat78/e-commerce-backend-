const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const product = require("../models/product");
const router = require("../routes/product");
exports.getProductById = (req, res, next, id) => {
  Product.findById(id, (err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "product not found",
      });
    }
    req.product = product;
    next();
  });
};
//create product
exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //checking fields provided by user is valid
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "please include all fields",
      });
    }

    let product = new Product(fields);
    //handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save product in DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to add product in database",
        });
      }
      res.json(product);
    });
  });
};
//get product
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};
//middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("content-type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
//delete product
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((error, deleteProduct) => {
    if (error) {
      res.status(400).json({
        error: "product not deleted ",
      });
    }
    res.json({
      message: "successfully deleted the product",
    });
  });
};
//update product
exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "problem with image",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);
    //handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save product in DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "updation of product failed" + err,
        });
      }
      res.json(product);
    });
  });
};
//listing products
exports.getAllProducts = (req, res) => {
  const limit = req.query.limit ? parseInt(req.req.query.limit) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          error: "Products not available",
        });
      }
      res.json(products);
    });
};
//middleware to update stock and sold
exports.updateStock = (req, res, next) => {
  const myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { sold: +prod.count, stock: -prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, updated) => {
    if (err) {
      res.status(400).json({
        error: "Bulk operations failed",
      });
    }
    res.json(updated);
  });
  next();
};
//get all distinct categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      res.status(400).json({
        error: "categories not found",
      });
    }
    res.json(category);
  });
};
