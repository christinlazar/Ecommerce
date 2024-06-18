const Category = require("../models/categorymodel");
const Product = require("../models/productModel");

const categorySave = async (req, res) => {
  try {
    const category = await Category.find({});
    const { name, parent, description, categoryDiscount, startDate, endDate } =
      req.body;
    const samedata = await Category.findOne({ name: name });

    if (samedata) {
      res.render("category", {
        msg: "Sorry!..This category already exists",
        category,
      });
    } else {
      const category = new Category({
        name: name,
        parent: parent,
        categoryDiscount: categoryDiscount,
        startDate: startDate,
        endDate: endDate,
        description: description,
      });
      await category.save();
      res.redirect("/admin/category");
      // res.status(200).json({message:"success"})
    }
  } catch (error) {
    console.log(error);
  }
};
const blockCategory = async (req, res) => {
  try {
    const categoryid = req.body.categoryId;

    await Category.findOneAndUpdate(
      { _id: categoryid },
      { $set: { is_active: false } }
    );
    res.status(200).json({ message: "sucesscategory" });
  } catch (error) {
    console.log(error);
  }
};
const unblockCategory = async (req, res) => {
  try {
    const categoryid = req.body.categoryId;
    await Category.findOneAndUpdate(
      { _id: categoryid },
      { $set: { is_active: true } }
    );
    res.status(200).json({ message: "unblock success" });
  } catch (error) {
    console.log(error);
  }
};
const editCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const category = await Category.findOne({ _id: id });
    if (category) {
      res.render("editcategory", { category });
    }
  } catch (error) {
    console.log(error);
  }
};
const updateEditCategory = async (req, res) => {
  try {
    const name = req.body.name;
    const sameCategory = await Category.findOne({ name: name });
    if (sameCategory) {
      res.render("editcategory", {
        samecata:
          "This category already exists in the category list,but changes has been made in other fields",
        category: "",
      });
      await Category.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            parent: req.body.parent,
            categoryDiscount: req.body.categoryDiscount,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            description: req.body.description,
          },
        }
      );
    } else {
      await Category.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            parent: req.body.parent,
            categoryDiscount: req.body.categoryDiscount,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            description: req.body.description,
          },
        }
      );
      res.redirect("/admin/category");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  categorySave,
  blockCategory,
  unblockCategory,
  editCategory,
  updateEditCategory,
};
