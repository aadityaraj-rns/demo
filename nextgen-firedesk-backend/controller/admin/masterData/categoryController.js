const Joi = require("joi");
const { Category, Form } = require("../../../models/index");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const categoryController = {
  // CREATE CATEGORY
  async create(req, res, next) {
    const createCategorySchema = Joi.object({
      categoryName: Joi.string().required(),
      formId: Joi.string().pattern(uuidPattern).required(),
    });
    
    const { error } = createCategorySchema.validate(req.body);
    if (error) return next(error);

    const { categoryName, formId } = req.body;

    try {
      // Check if form exists
      const form = await Form.findByPk(formId);
      if (!form) return next({ status: 404, message: "Form not found" });

      // Check if category name already exists for this form
      const existingCategory = await Category.findOne({ 
        where: { 
          categoryName, 
          formId 
        } 
      });
      
      if (existingCategory) {
        return next({ status: 400, message: "Category name already exists for this form" });
      }

      // Create category
      const newCategory = await Category.create({
        categoryName,
        formId,
        createdBy: req.user.id
      });

      // Return category with form details
      const categoryWithForm = await Category.findByPk(newCategory.id, {
        include: [{
          model: Form,
          as: 'form',
          attributes: ['id', 'serviceName']
        }]
      });

      return res.status(201).json({ category: categoryWithForm });
    } catch (error) {
      return next(error);
    }
  },

  // GET ALL CATEGORIES
  async getAll(req, res, next) {
    try {
      const allCategory = await Category.findAll({
        include: [{
          model: Form,
          as: 'form',
          attributes: ['id', 'serviceName']
        }],
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({ allCategory });
    } catch (error) {
      return next(error);
    }
  },

  // GET ACTIVE CATEGORIES
  async getActiveCategories(req, res, next) {
    try {
      const activeCategories = await Category.findAll({
        where: { status: "Active" },
        include: [{
          model: Form,
          as: 'form',
          attributes: ['id', 'serviceName']
        }],
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({ activeCategories });
    } catch (error) {
      return next(error);
    }
  },

  // UPDATE CATEGORY
  async update(req, res, next) {
    const updateCategorySchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
      categoryName: Joi.string().optional(),
      formId: Joi.string().pattern(uuidPattern).optional(),
      status: Joi.string().valid("Active", "Deactive").required(),
    });
    
    const { error } = updateCategorySchema.validate(req.body);
    if (error) return next(error);

    const { id, categoryName, formId, status } = req.body;

    try {
      // Check if category exists
      const category = await Category.findByPk(id);
      if (!category) return next({ status: 404, message: "Category not found" });

      // Check if form exists (if formId is being updated)
      if (formId) {
        const form = await Form.findByPk(formId);
        if (!form) return next({ status: 404, message: "Form not found" });
      }

      // Check for duplicate category name in the same form
      if (categoryName) {
        const existingCategory = await Category.findOne({
          where: {
            categoryName,
            formId: formId || category.formId,
            id: { [require("sequelize").Op.ne]: id }
          }
        });
        
        if (existingCategory) {
          return next({ status: 400, message: "Category name already exists for this form" });
        }
      }

      // Update category
      await Category.update(
        { categoryName, formId, status },
        { where: { id } }
      );

      // Return updated category
      const updatedCategory = await Category.findByPk(id, {
        include: [{
          model: Form,
          as: 'form',
          attributes: ['id', 'serviceName']
        }]
      });

      return res.json({ category: updatedCategory });
    } catch (error) {
      return next(error);
    }
  },

  // DELETE CATEGORY
  async delete(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required()
    });
    
    const { error } = deleteSchema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;

    try {
      const category = await Category.findByPk(id);
      if (!category) return next({ status: 404, message: "Category not found" });

      await Category.destroy({ where: { id } });
      
      return res.json({ message: "Category deleted successfully" });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = categoryController;