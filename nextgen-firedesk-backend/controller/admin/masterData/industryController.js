const Joi = require("joi");
const Industry = require("../../../models/admin/masterData/Industry");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const industryController = {
  async create(req, res, next) {
    const createIndustrySchema = Joi.object({
      industryName: Joi.string().required(),
    });

    const { error } = createIndustrySchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { industryName } = req.body;

    findIndustry = await Industry.findOne({ industryName });
    if (findIndustry) {
      const error = {
        status: 401,
        message: "Industry name already exist",
      };
      return next(error);
    }
    let newIndustry;

    try {
      newIndustry = new Industry({
        industryName,
      });
      await newIndustry.save();
    } catch (error) {
      return next(error);
    }

    return res.json({ newIndustry });
  },
  async getAll(req, res, next) {
    try {
      const allIndustry = await Industry.find({}).sort({ createdAt: -1 });
      return res.json({ allIndustry });
    } catch (error) {
      return next(error);
    }
  },
  async getAllActive(req, res, next) {
    try {
      const allIndustry = await Industry.find({status:'Active'});
      return res.json({ allIndustry });
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    updateIndustrySchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      industryName: Joi.string().required(),
      status: Joi.string().valid('Active', 'Deactive').required(),
    });

    const { error } = updateIndustrySchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { industryName, _id, status } = req.body;

    try {
      await Industry.updateOne({ _id }, { industryName, status });
    } catch (error) {
      return next(error);
    }
    return res.json({ msg: "industry updated successfully" });
  },
};
module.exports = industryController;
