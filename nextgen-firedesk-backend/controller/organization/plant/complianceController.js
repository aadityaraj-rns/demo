// firedesk-backend/controllers/organization/plant/complianceController.js
const Joi = require("joi");
const { ComplianceFireSafety, Plant } = require("../../../models");

const complianceController = {
  /**
   * Create compliance fire safety record for a plant
   */
  async create(req, res, next) {
    try {
      const schema = Joi.object({
        plantId: Joi.string().uuid().required(),
        fireNocNumber: Joi.string().required(),
        nocValidityDate: Joi.date().required(),
        insurancePolicyNumber: Joi.string().required(),
        insurerName: Joi.string().required(),
        numFireExtinguishers: Joi.number().required(),
        numHydrantPoints: Joi.number().required(),
        numSprinklers: Joi.number().required(),
        numSafeAssemblyAreas: Joi.number().required(),
        documentUrl: Joi.string().optional().allow(''),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message 
        });
      }

      const compliance = await ComplianceFireSafety.create(value);

      const result = await ComplianceFireSafety.findByPk(compliance.id, {
        include: [{ model: Plant, as: 'plant' }]
      });

      return res.status(201).json({ 
        success: true,
        message: "Compliance record created successfully",
        compliance: result 
      });
    } catch (error) {
      console.error('Create compliance error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to create compliance record',
        error: error.message 
      });
    }
  },

  /**
   * Get all compliance records for a plant
   */
  async getByPlantId(req, res, next) {
    try {
      const { plantId } = req.params;

      const records = await ComplianceFireSafety.findAll({
        where: { plantId },
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({ 
        success: true,
        complianceRecords: records 
      });
    } catch (error) {
      console.error('Get compliance records error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch compliance records',
        error: error.message 
      });
    }
  },

  /**
   * Update compliance record
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;

      const record = await ComplianceFireSafety.findByPk(id);
      if (!record) {
        return res.status(404).json({ 
          success: false,
          message: "Compliance record not found" 
        });
      }

      await record.update(req.body);

      const updated = await ComplianceFireSafety.findByPk(id, {
        include: [{ model: Plant, as: 'plant' }]
      });

      return res.json({ 
        success: true,
        message: "Compliance record updated successfully",
        compliance: updated 
      });
    } catch (error) {
      console.error('Update compliance error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update compliance record',
        error: error.message 
      });
    }
  },

  /**
   * Delete compliance record
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const record = await ComplianceFireSafety.findByPk(id);
      if (!record) {
        return res.status(404).json({ 
          success: false,
          message: "Compliance record not found" 
        });
      }

      await record.destroy();
      
      return res.json({ 
        success: true,
        message: "Compliance record deleted successfully" 
      });
    } catch (error) {
      console.error('Delete compliance error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to delete compliance record',
        error: error.message 
      });
    }
  },
};

module.exports = complianceController;
