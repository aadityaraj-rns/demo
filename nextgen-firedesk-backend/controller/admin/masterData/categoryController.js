const Joi = require("joi");
const Category = require("../../../models/admin/masterData/category");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const categoryController = {
  async create(req, res, next) {
    const createCategorySchema = Joi.object({
      categoryName: Joi.string().required(),
      formId: Joi.string().pattern(mongodbIdPattern).required(),
    });
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { categoryName, formId } = req.body;

    let newCategory;
    try {
      const findCategory = await Category.findOne({ categoryName });
      if (findCategory) {
        const error = {
          status: 401,
          message: "Category name already exist",
        };
        return next(error);
      }
      newCategory = new Category({
        categoryName,
        formId,
      });
      await newCategory.save();
    } catch (error) {
      return next(error);
    }
    return res.json({ newCategory });
  },
  async getAll(req, res, next) {
    try {
      const allCategory = await Category.find({})
        .sort({ createdAt: -1 })
        .populate({ path: "formId", select: "serviceName" });
      return res.json({ allCategory });
    } catch (error) {
      return next(error);
    }
  },
  async getActiveCategories(req, res, next) {
    try {
      const allCategory = await Category.find({ status: "Active" });
      return res.json({ allCategory });
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    const createCategorySchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      categoryName: Joi.string().optional(),
      formId: Joi.string().pattern(mongodbIdPattern).required(),
      status: Joi.string().required(),
    });
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { formId, _id, status } = req.body;

    try {
      await Category.updateOne(
        { _id },
        {
          // categoryName,
          formId,
          status,
        }
      );
    } catch (error) {
      return next(error);
    }
    return res.json({ msg: "category name updated successfully" });
  },
};
module.exports = categoryController;
