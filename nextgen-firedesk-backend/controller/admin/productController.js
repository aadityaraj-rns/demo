const Joi = require("joi");
const { Product, Category } = require("../../models");

// UUID pattern for PostgreSQL
const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const productController = {
  async create(req, res, next) {
    const createProductSchema = Joi.object({
      categoryId: Joi.string().pattern(uuidPattern).required(),
      productName: Joi.string().required(),
      testFrequency: Joi.string()
        .valid(
          "One Year",
          "Two Years",
          "Three Years",
          "Five Years",
          "Ten Years"
        )
        .required(),
      productVariants: Joi.array()
        .items(
          Joi.object({
            type: Joi.string().required(),
            subType: Joi.array().items(Joi.string()).optional(),
            description: Joi.string().required(),
            image: Joi.string().uri().optional().allow(''),
          })
        )
        .min(1)
        .required(),
    });

    const { error } = createProductSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { categoryId, productName, testFrequency, productVariants } =
      req.body;

    try {
      const product = await Product.create({
        categoryId,
        productName,
        testFrequency,
        variants: productVariants,
      });

      return res.status(200).json({ 
        message: "Product created successfully",
        product 
      });
    } catch (error) {
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const products = await Product.findAll({
        attributes: ['id', 'productName', 'categoryId', 'testFrequency', 'variants', 'status'],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['categoryName', 'id']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return res.json({ products, success: true });
    } catch (error) {
      return next(error);
    }
  },
  async getByCategory(req, res, next) {
    const categoryId = req.params.categoryId;
    try {
      const products = await Product.findAll({
        where: {
          categoryId,
          status: "Active",
        },
        attributes: ['productName', 'id', 'testFrequency', 'variants']
      });
      return res.json({ products });
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    const updateSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
      categoryId: Joi.string().pattern(uuidPattern).required(),
      productName: Joi.string().required(),
      status: Joi.string().valid("Active", "Deactive").required(),
      testFrequency: Joi.string()
        .valid(
          "One Year",
          "Two Years",
          "Three Years",
          "Five Years",
          "Ten Years"
        )
        .required(),
      productVariants: Joi.array()
        .items(
          Joi.object({
            type: Joi.string().required(),
            subType: Joi.array().items(Joi.string()).optional(),
            description: Joi.string().required(),
            image: Joi.string().uri().optional().allow(''),
          })
        )
        .min(1)
        .required(),
    });

    const { error } = updateSchema.validate(req.body);

    if (error) return next(error);

    const {
      id,
      categoryId,
      productName,
      testFrequency,
      status,
      productVariants,
    } = req.body;

    try {
      const [updated] = await Product.update(
        {
          categoryId,
          productName,
          testFrequency,
          variants: productVariants,
          status,
        },
        {
          where: { id },
        }
      );

      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = await Product.findByPk(id);
      return res.json({ product });
    } catch (error) {
      return next(error);
    }
  },
  async delete(req, res, next) {
    const productId = req.params.id;

    try {
      const deleted = await Product.destroy({
        where: { id: productId }
      });

      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.json({ message: "Product deleted successfully" });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = productController;