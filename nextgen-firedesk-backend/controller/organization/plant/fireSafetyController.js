// firedesk-backend/controllers/organization/plant/fireSafetyController.js
const Joi = require("joi");
const { FireSafetyForm, Plant, Vendor } = require("../../../models");

const fireSafetyController = {
  /**
   * Create fire safety form for a plant
   */
  async create(req, res, next) {
    try {
      const schema = Joi.object({
        plantId: Joi.string().uuid().required(),
        primeOverTankCapacity: Joi.number().optional(),
        terraceTankCapacity: Joi.number().optional(),
        dieselTank1Capacity: Joi.number().optional(),
        dieselTank2Capacity: Joi.number().optional(),
        headerPressureBar: Joi.number().optional(),
        systemCommissionDate: Joi.date().optional().allow(null),
        amcVendorId: Joi.string().uuid().optional().allow(null),
        amcStartDate: Joi.date().optional().allow(null),
        amcEndDate: Joi.date().optional().allow(null),
        numFireExtinguishers: Joi.number().optional(),
        numHydrantPoints: Joi.number().optional(),
        numSprinklers: Joi.number().optional(),
        numSafeAssemblyAreas: Joi.number().optional(),
        dieselEngine: Joi.number().optional(),
        electricalPump: Joi.number().optional(),
        jockeyPump: Joi.number().optional(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message 
        });
      }

      const fireSafetyForm = await FireSafetyForm.create(value);

      const result = await FireSafetyForm.findByPk(fireSafetyForm.id, {
        include: [
          { model: Plant, as: 'plant' },
          { model: Vendor, as: 'amcVendor' }
        ]
      });

      return res.status(201).json({ 
        success: true,
        message: "Fire safety form created successfully",
        fireSafetyForm: result 
      });
    } catch (error) {
      console.error('Create fire safety form error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to create fire safety form',
        error: error.message 
      });
    }
  },

  /**
   * Get all fire safety forms for a plant
   */
  async getByPlantId(req, res, next) {
    try {
      const { plantId } = req.params;

      const forms = await FireSafetyForm.findAll({
        where: { plantId },
        include: [
          { model: Vendor, as: 'amcVendor' }
        ]
      });

      return res.status(200).json({ 
        success: true,
        fireSafetyForms: forms 
      });
    } catch (error) {
      console.error('Get fire safety forms error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch fire safety forms',
        error: error.message 
      });
    }
  },

  /**
   * Update fire safety form
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;

      const form = await FireSafetyForm.findByPk(id);
      if (!form) {
        return res.status(404).json({ 
          success: false,
          message: "Fire safety form not found" 
        });
      }

      await form.update(req.body);

      const updated = await FireSafetyForm.findByPk(id, {
        include: [
          { model: Plant, as: 'plant' },
          { model: Vendor, as: 'amcVendor' }
        ]
      });

      return res.json({ 
        success: true,
        message: "Fire safety form updated successfully",
        fireSafetyForm: updated 
      });
    } catch (error) {
      console.error('Update fire safety form error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update fire safety form',
        error: error.message 
      });
    }
  },

  /**
   * Delete fire safety form
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const form = await FireSafetyForm.findByPk(id);
      if (!form) {
        return res.status(404).json({ 
          success: false,
          message: "Fire safety form not found" 
        });
      }

      await form.destroy();
      
      return res.json({ 
        success: true,
        message: "Fire safety form deleted successfully" 
      });
    } catch (error) {
      console.error('Delete fire safety form error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to delete fire safety form',
        error: error.message 
      });
    }
  },
};

module.exports = fireSafetyController;
