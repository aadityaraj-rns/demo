const Joi = require("joi");
const { Industry, Plant } = require("../../../models/index"); // Import Plant model

const industryController = {
  async create(req, res, next) {
    const schema = Joi.object({ industryName: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return next(error);

    const { industryName } = req.body;
    const existing = await Industry.findOne({ where: { industryName } });
    if (existing) return next({ status: 400, message: "Industry name already exists" });

    try {
      const newIndustry = await Industry.create({ industryName, createdBy: req.user.id });
      
      return res.json({ newIndustry });
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const allIndustry = await Industry.findAll({ order: [["createdAt", "DESC"]] });
      return res.json({ allIndustry });
    } catch (err) {
      return next(err);
    }
  },

  async getAllActive(req, res, next) {
    try {
      const allIndustry = await Industry.findAll({ where: { status: "Active" }, order: [["createdAt", "DESC"]] });
      return res.json({ allIndustry });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    const schema = Joi.object({
      id: Joi.string().required(),
      industryName: Joi.string().required(),
      status: Joi.string().valid("Active", "Deactive").required()
    });
    const { error } = schema.validate(req.body);
    if (error) return next(error);

    const { id, industryName, status } = req.body;
    try {
      // Check if industry exists
      const currentIndustry = await Industry.findByPk(id);
      if (!currentIndustry) {
        return next({ status: 404, message: "Industry not found" });
      }
      
      // Update industry
      const [updatedRows] = await Industry.update({ industryName, status }, { where: { id } });
      if (!updatedRows) return next({ status: 404, message: "Industry not found or no changes applied" });

      const updatedIndustry = await Industry.findByPk(id);
      
      return res.json({ updatedIndustry });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    const schema = Joi.object({ id: Joi.string().required() });
    const { error } = schema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;
    
    try {
      // Check if industry exists
      const industry = await Industry.findByPk(id);
      if (!industry) {
        return next({ status: 404, message: "Industry not found" });
      }

      // Check if any plants are using this industry
      const plantsUsingIndustry = await Plant.findAll({ 
        where: { industryId: id } 
      });

      if (plantsUsingIndustry.length > 0) {
        const plantNames = plantsUsingIndustry.map(plant => plant.plantName).join(', ');
        return next({ 
          status: 400, 
          message: `Cannot delete industry. It is being used by the following plants: ${plantNames}. Please reassign or delete these plants first.` 
        });
      }

      // If no plants are using the industry, proceed with deletion
      const destroyed = await Industry.destroy({ where: { id } });
      if (!destroyed) return next({ status: 404, message: "Industry not found" });

      
      return res.json({ 
        success: true,
        message: "Industry deleted successfully" 
      });
    } catch (err) {
      console.error('Delete industry error:', err);
      return next({ 
        status: 500, 
        message: "Failed to delete industry. It may be in use by plants." 
      });
    }
  }
};

module.exports = industryController;