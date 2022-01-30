const Category = require("../models/category");
//middleware to access category by Id
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "not able to find category",
      });
    }
    req.category = category;
    next();
  });
};
//create category
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((error, category) => {
    if (error) {
      return res.json({
        error: "not able to save category in DB",
      });
    }
    res.json({ category });
  });
};
//getCategory
exports.getCategory = (req, res) => {
  res.json(req.category);
};
//get all categories
exports.getCategories = (req, res) => {
  Category.find((error, categories) => {
    if (error || !categories) {
      return res.status(400).json({
        error: "No categories available",
      });
    }
    res.json(categories);
  });
};
//update the category
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};
//delete category
exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, removeCategory) => {
    if (err) {
      return res.status(400).json({
        error: "failed to delete category from DB",
      });
    }
    res.json({
      message: `${removeCategory} successfully deleted`,
    });
  });
};
