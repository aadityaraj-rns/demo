const Joi = require("joi");
const Product = require("../../models/admin/product");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const productController = {
  async create(req, res, next) {
    const createProductSchema = Joi.object({
      categoryId: Joi.string().pattern(mongodbIdPattern).required(),
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
            image: Joi.string().uri().required(),
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
      await Product.create({
        categoryId,
        productName,
        testFrequency,
        variants: productVariants,
      });

      return res.status(200).json({ message: "Product created successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const products = await Product.find({})
        .populate({ path: "categoryId", select: "categoryName" })
        .sort({ createdAt: -1 });
      return res.json({ products });
    } catch (error) {
      return next(error);
    }
  },
  async getByCategory(req, res, next) {
    const categoryId = req.params.categoryId;
    try {
      const products = await Product.find({
        categoryId,
        status: "Active",
      }).select("productName productId testFrequency variants");
      // const productDto = products.map((product) => new ProductDTO(product));
      return res.json({ products });
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    const updateSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      categoryId: Joi.string().pattern(mongodbIdPattern).required(),
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
            _id: Joi.string().pattern(mongodbIdPattern).optional(), // present if editing
            type: Joi.string().required(),
            subType: Joi.array().items(Joi.string()).optional(),
            description: Joi.string().required(),
            image: Joi.string().uri().required(),
          })
        )
        .min(1)
        .required(),
    });

    const { error } = updateSchema.validate(req.body);

    if (error) return next(error);

    const {
      _id,
      categoryId,
      productName,
      testFrequency,
      status,
      productVariants,
    } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id },
      {
        categoryId,
        productName,
        testFrequency,
        variants: productVariants,
        status,
      }
    );

    return res.json({ product });
  },
};

module.exports = productController;
