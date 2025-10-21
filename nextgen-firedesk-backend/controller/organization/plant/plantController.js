// 

// firedesk-backend/controllers/plantController.js
const Joi = require("joi");
const { Plant, City, State, Industry, Manager, User, PlantManager } = require("../../../models");

const plantController = {
  async getAll(req, res, next) {
    try {
      let orgUserId = req.user.id;
      let whereCondition = { orgUserId };
      
      // Handle manager case
      if (req.user.userType === "manager") {
        const manager = await Manager.findOne({ 
          where: { userId: req.user.id }
        });
        
        if (manager) {
          orgUserId = manager.orgUserId;
          whereCondition.managerId = manager.id;
        }
      }

      const plants = await Plant.findAll({
        where: whereCondition,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: City,
            as: 'city',
            include: [{
              model: State,
              as: 'state'
            }]
          },
          {
            model: State,
            as: 'state'
          },
          {
            model: Industry,
            as: 'industry'
          },
          {
            model: Manager,
            as: 'managers', // Fixed: changed from 'manager' to 'managers'
            through: { attributes: [] }, // Exclude junction table fields
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }]
          }
        ]
      });

      return res.status(200).json({ 
        success: true,
        plants 
      });
    } catch (error) {
      console.error('Get plants error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch plants',
        error: error.message 
      });
    }
  },

  async create(req, res, next) {
    try {
      const plantCreateSchema = Joi.object({
        // Basic Info
        plantId: Joi.string().optional().allow(''),
        plantName: Joi.string().required(),
        address: Joi.string().optional().allow(''),
        address2: Joi.string().optional().allow(''),
        cityId: Joi.string().uuid().optional().allow('', null),
        stateId: Joi.string().uuid().optional().allow('', null),
        zipCode: Joi.string().optional().allow(''),
        gstNo: Joi.string().optional().allow(''),
        industryId: Joi.string().uuid().optional().allow('', null),
        managerId: Joi.string().uuid().optional().allow('', null),
        managerIds: Joi.array().items(Joi.string().uuid()).optional(),
        plantImage: Joi.string().optional().allow(''),
        
        // Premises Details
        mainBuildings: Joi.number().optional(),
        subBuildings: Joi.number().optional(),
        buildings: Joi.array().optional(),
        totalPlantArea: Joi.number().optional(),
        totalBuildUpArea: Joi.number().optional(),
        entrances: Joi.array().optional(),
        
        // DG Details
        dgAvailable: Joi.string().optional().allow(''),
        dgQuantity: Joi.number().optional(),
        
        // Staircase Details
        staircaseAvailable: Joi.string().optional().allow(''),
        staircaseQuantity: Joi.number().optional(),
        staircaseType: Joi.string().optional().allow(''),
        staircaseWidth: Joi.number().optional(),
        staircaseFireRating: Joi.string().optional().allow(''),
        staircasePressurization: Joi.string().optional().allow(''),
        staircaseEmergencyLighting: Joi.string().optional().allow(''),
        staircaseLocation: Joi.string().optional().allow(''),
        
        // Lift Details
        liftAvailable: Joi.string().optional().allow(''),
        liftQuantity: Joi.number().optional(),
        
        // Fire Safety - Tank Capacities
        headerPressure: Joi.string().optional().allow(''),
        pressureUnit: Joi.string().valid("Kg/Cm2", "PSI", "MWC", "Bar", "").optional(),
        mainWaterStorage: Joi.string().optional().allow(''),
        primeWaterTankStorage: Joi.string().optional().allow(''),
        dieselStorage: Joi.string().optional().allow(''),
        primeOverTankCapacity: Joi.number().optional(),
        primeOverTankCapacity2: Joi.number().optional(),
        terraceTankCapacity: Joi.number().optional(),
        headerPressureBar: Joi.number().optional(),
        systemCommissionDate: Joi.date().optional().allow('', null),
        
        // AMC / Maintenance
        amcVendor: Joi.string().optional().allow(''),
        amcStartDate: Joi.date().optional().allow('', null),
        amcEndDate: Joi.date().optional().allow('', null),
        
        // Fire Equipment Count
        numFireExtinguishers: Joi.number().optional(),
        numHydrantPoints: Joi.number().optional(),
        numSprinklers: Joi.number().optional(),
        numSafeAssemblyAreas: Joi.number().optional(),
        
        // Fire Pumps
        dieselEngine: Joi.string().optional().allow(''),
        electricalPump: Joi.string().optional().allow(''),
        jockeyPump: Joi.string().optional().allow(''),
        
        // Compliance - Fire NOC
        fireNocNumber: Joi.string().optional().allow(''),
        nocValidityDate: Joi.date().optional().allow('', null),
        
        // Fire Insurance
        insurancePolicyNumber: Joi.string().optional().allow(''),
        insurerName: Joi.string().optional().allow(''),
        
        // Compliance Equipment Count
        complianceNumExtinguishers: Joi.number().optional(),
        complianceNumHydrants: Joi.number().optional(),
        complianceNumSprinklers: Joi.number().optional(),
        complianceNumSafeAreas: Joi.number().optional(),
        
        // Document Upload
        complianceDocuments: Joi.array().optional(),
        
        // Monitoring
        edgeDeviceId: Joi.string().optional().allow(''),
        monitoringBuilding: Joi.string().optional().allow(''),
        specificLocation: Joi.string().optional().allow(''),
        installationDate: Joi.date().optional().allow('', null),
        
        // Layout Upload
        layoutName: Joi.string().optional().allow(''),
        layouts: Joi.array().optional(),
        layoutFiles: Joi.array().optional(),
        
        // Scheduler Setup
        schedulerCategory: Joi.string().optional().allow(''),
        schedulerStartDate: Joi.date().optional().allow('', null),
        schedulerEndDate: Joi.date().optional().allow('', null),
        inspectionFrequency: Joi.string().optional().allow(''),
        testingFrequency: Joi.string().optional().allow(''),
        maintenanceFrequency: Joi.string().optional().allow(''),
        schedulerSetups: Joi.array().optional(),
        
        // Status
        status: Joi.string().valid("Active", "Deactive", "Draft").optional(),
      }).unknown(false); // Reject unknown fields

      const { error, value } = plantCreateSchema.validate(req.body, { 
        stripUnknown: true, // Remove unknown fields instead of rejecting
        abortEarly: false // Show all errors
      });
      
      if (error) {
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message,
          errors: error.details.map(d => d.message)
        });
      }

      const {
        plantName,
        address,
        address2,
        cityId,
        stateId,
        zipCode,
        gstNo,
        industryId,
        managerId,
        managerIds,
        plantImage,
        status,
        ...otherFields
      } = value; // Use validated value instead of req.body

      let orgUserId = req.user.id;
      let orgName = req.user.name;

      // Handle manager case
      if (req.user.userType === "manager") {
        const manager = await Manager.findOne({ 
          where: { userId: req.user.id },
          include: [{ 
            model: User, 
            as: "organization",
            attributes: ['id', 'name'] 
          }]
        });
        
        if (manager && manager.organization) {
          orgUserId = manager.orgUserId;
          orgName = manager.organization.name;
        }
      }

      // Generate plant ID if not provided
      let generatedPlantId = value.plantId;
      if (!generatedPlantId) {
        const plantCount = await Plant.count({ where: { orgUserId } });
        const orgNameSlice = orgName ? orgName.slice(0, 2).toUpperCase() : 'PL';
        
        let citySlice = 'CTY';
        if (cityId) {
          const cityData = await City.findByPk(cityId);
          citySlice = cityData ? cityData.cityName.slice(0, 3).toUpperCase() : 'CTY';
        }
        
        generatedPlantId = `${orgNameSlice}-${citySlice}-${(plantCount + 1).toString().padStart(4, "0")}`;
      }

      // Convert string boolean values to actual booleans
      const plantData = {
        plantId: generatedPlantId,
        orgUserId,
        plantName,
        address: address || null,
        address2: address2 || null,
        cityId: cityId || null,
        stateId: stateId || null,
        zipCode: zipCode || null,
        gstNo: gstNo || null,
        industryId: industryId || null,
        managerId: managerId || null,
        plantImage: plantImage || null,
        status: status || 'Draft',
        ...otherFields,
        // Convert string yes/no to boolean
        dgAvailable: otherFields.dgAvailable === 'yes' || otherFields.dgAvailable === true,
        staircaseAvailable: otherFields.staircaseAvailable === 'yes' || otherFields.staircaseAvailable === true,
        staircasePressurization: otherFields.staircasePressurization === 'yes' || otherFields.staircasePressurization === true,
        staircaseEmergencyLighting: otherFields.staircaseEmergencyLighting === 'yes' || otherFields.staircaseEmergencyLighting === true,
        liftAvailable: otherFields.liftAvailable === 'yes' || otherFields.liftAvailable === true,
      };

      const newPlant = await Plant.create(plantData);

      // Handle multiple managers
      if (managerIds && Array.isArray(managerIds) && managerIds.length > 0) {
        const plantManagerData = managerIds.map(managerId => ({
          plantId: newPlant.id,
          managerId: managerId
        }));
        await PlantManager.bulkCreate(plantManagerData);
      }

      // Fetch the created plant with associations
      const createdPlant = await Plant.findByPk(newPlant.id, {
        include: [
          { model: City, as: 'city', include: [{ model: State, as: 'state' }] },
          { model: State, as: 'state' },
          { model: Industry, as: 'industry' },
          { 
            model: Manager, 
            as: 'managers',
            through: { attributes: [] },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
          }
        ]
      });

      return res.status(201).json({ 
        success: true,
        message: "Plant created successfully",
        plant: createdPlant 
      });
    } catch (error) {
      console.error('Create plant error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to create plant',
        error: error.message 
      });
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const plant = await Plant.findByPk(id, {
        include: [
          { model: City, as: 'city', include: [{ model: State, as: 'state' }] },
          { model: State, as: 'state' },
          { model: Industry, as: 'industry' },
          { 
            model: Manager, 
            as: 'managers',
            through: { attributes: [] },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
          }
        ]
      });

      if (!plant) {
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      return res.status(200).json({ 
        success: true,
        plant 
      });
    } catch (error) {
      console.error('Get plant by ID error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch plant',
        error: error.message 
      });
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      const plantUpdateSchema = Joi.object({
        // Basic Info
        plantName: Joi.string().optional(),
        address: Joi.string().optional().allow(''),
        address2: Joi.string().optional().allow(''),
        cityId: Joi.string().uuid().optional().allow('', null),
        stateId: Joi.string().uuid().optional().allow('', null),
        zipCode: Joi.string().optional().allow(''),
        gstNo: Joi.string().optional().allow(''),
        industryId: Joi.string().uuid().optional().allow('', null),
        managerId: Joi.string().uuid().optional().allow('', null),
        managerIds: Joi.array().items(Joi.string().uuid()).optional(),
        plantImage: Joi.string().optional().allow(''),
        
        // Premises Details
        mainBuildings: Joi.number().optional(),
        subBuildings: Joi.number().optional(),
        buildings: Joi.array().optional(),
        totalPlantArea: Joi.number().optional(),
        totalBuildUpArea: Joi.number().optional(),
        entrances: Joi.array().optional(),
        
        // DG Details
        dgAvailable: Joi.string().optional().allow(''),
        dgQuantity: Joi.number().optional(),
        
        // Staircase Details
        staircaseAvailable: Joi.string().optional().allow(''),
        staircaseQuantity: Joi.number().optional(),
        staircaseType: Joi.string().optional().allow(''),
        staircaseWidth: Joi.number().optional(),
        staircaseFireRating: Joi.string().optional().allow(''),
        staircasePressurization: Joi.string().optional().allow(''),
        staircaseEmergencyLighting: Joi.string().optional().allow(''),
        staircaseLocation: Joi.string().optional().allow(''),
        
        // Lift Details
        liftAvailable: Joi.string().optional().allow(''),
        liftQuantity: Joi.number().optional(),
        
        // Fire Safety - Tank Capacities
        headerPressure: Joi.string().optional().allow(''),
        pressureUnit: Joi.string().valid("Kg/Cm2", "PSI", "MWC", "Bar", "").optional(),
        mainWaterStorage: Joi.string().optional().allow(''),
        primeWaterTankStorage: Joi.string().optional().allow(''),
        dieselStorage: Joi.string().optional().allow(''),
        primeOverTankCapacity: Joi.number().optional(),
        primeOverTankCapacity2: Joi.number().optional(),
        terraceTankCapacity: Joi.number().optional(),
        headerPressureBar: Joi.number().optional(),
        systemCommissionDate: Joi.date().optional().allow('', null),
        
        // AMC / Maintenance
        amcVendor: Joi.string().optional().allow(''),
        amcStartDate: Joi.date().optional().allow('', null),
        amcEndDate: Joi.date().optional().allow('', null),
        
        // Fire Equipment Count
        numFireExtinguishers: Joi.number().optional(),
        numHydrantPoints: Joi.number().optional(),
        numSprinklers: Joi.number().optional(),
        numSafeAssemblyAreas: Joi.number().optional(),
        
        // Fire Pumps
        dieselEngine: Joi.string().optional().allow(''),
        electricalPump: Joi.string().optional().allow(''),
        jockeyPump: Joi.string().optional().allow(''),
        
        // Compliance - Fire NOC
        fireNocNumber: Joi.string().optional().allow(''),
        nocValidityDate: Joi.date().optional().allow('', null),
        
        // Fire Insurance
        insurancePolicyNumber: Joi.string().optional().allow(''),
        insurerName: Joi.string().optional().allow(''),
        
        // Compliance Equipment Count
        complianceNumExtinguishers: Joi.number().optional(),
        complianceNumHydrants: Joi.number().optional(),
        complianceNumSprinklers: Joi.number().optional(),
        complianceNumSafeAreas: Joi.number().optional(),
        
        // Document Upload
        complianceDocuments: Joi.array().optional(),
        
        // Monitoring
        edgeDeviceId: Joi.string().optional().allow(''),
        monitoringBuilding: Joi.string().optional().allow(''),
        specificLocation: Joi.string().optional().allow(''),
        installationDate: Joi.date().optional().allow('', null),
        
        // Layout Upload
        layoutName: Joi.string().optional().allow(''),
        layouts: Joi.array().optional(),
        layoutFiles: Joi.array().optional(),
        
        // Scheduler Setup
        schedulerCategory: Joi.string().optional().allow(''),
        schedulerStartDate: Joi.date().optional().allow('', null),
        schedulerEndDate: Joi.date().optional().allow('', null),
        inspectionFrequency: Joi.string().optional().allow(''),
        testingFrequency: Joi.string().optional().allow(''),
        maintenanceFrequency: Joi.string().optional().allow(''),
        schedulerSetups: Joi.array().optional(),
        
        // Status
        status: Joi.string().valid("Active", "Deactive", "Draft").optional(),
      }).unknown(false);

      const { error, value } = plantUpdateSchema.validate(req.body, { 
        stripUnknown: true,
        abortEarly: false
      });
      
      if (error) {
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message,
          errors: error.details.map(d => d.message)
        });
      }

      const plant = await Plant.findByPk(id);
      if (!plant) {
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      const { managerIds, ...updateData } = value;

      // Convert string boolean values to actual booleans
      if (updateData.dgAvailable !== undefined) {
        updateData.dgAvailable = updateData.dgAvailable === 'yes' || updateData.dgAvailable === true;
      }
      if (updateData.staircaseAvailable !== undefined) {
        updateData.staircaseAvailable = updateData.staircaseAvailable === 'yes' || updateData.staircaseAvailable === true;
      }
      if (updateData.staircasePressurization !== undefined) {
        updateData.staircasePressurization = updateData.staircasePressurization === 'yes' || updateData.staircasePressurization === true;
      }
      if (updateData.staircaseEmergencyLighting !== undefined) {
        updateData.staircaseEmergencyLighting = updateData.staircaseEmergencyLighting === 'yes' || updateData.staircaseEmergencyLighting === true;
      }
      if (updateData.liftAvailable !== undefined) {
        updateData.liftAvailable = updateData.liftAvailable === 'yes' || updateData.liftAvailable === true;
      }

      // Update plant fields
      await plant.update(updateData);

      // Handle multiple managers update
      if (managerIds !== undefined) {
        // Remove existing plant-manager relationships
        await PlantManager.destroy({ where: { plantId: id } });
        
        // Add new relationships
        if (Array.isArray(managerIds) && managerIds.length > 0) {
          const plantManagerData = managerIds.map(managerId => ({
            plantId: id,
            managerId: managerId
          }));
          await PlantManager.bulkCreate(plantManagerData);
        }
      }

      // Fetch updated plant with associations
      const updatedPlant = await Plant.findByPk(id, {
        include: [
          { model: City, as: 'city', include: [{ model: State, as: 'state' }] },
          { model: State, as: 'state' },
          { model: Industry, as: 'industry' },
          { 
            model: Manager, 
            as: 'managers',
            through: { attributes: [] },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
          }
        ]
      });

      return res.json({ 
        success: true,
        message: "Plant updated successfully",
        plant: updatedPlant 
      });
    } catch (error) {
      console.error('Update plant error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update plant',
        error: error.message 
      });
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const plant = await Plant.findByPk(id);
      if (!plant) {
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      await plant.destroy();
      
      return res.json({ 
        success: true,
        message: "Plant deleted successfully" 
      });
    } catch (error) {
      console.error('Delete plant error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to delete plant',
        error: error.message 
      });
    }
  },

  async getAllActive(req, res, next) {
    try {
      let orgUserId = req.user.id;
      let whereCondition = { 
        orgUserId,
        status: 'Active'
      };
      
      if (req.user.userType === "manager") {
        const manager = await Manager.findOne({ 
          where: { userId: req.user.id }
        });
        
        if (manager) {
          orgUserId = manager.orgUserId;
          whereCondition.managerId = manager.id;
        }
      }

      const plants = await Plant.findAll({
        where: whereCondition,
        order: [['plantName', 'ASC']],
        include: [
          {
            model: City,
            as: 'city',
            attributes: ['id', 'cityName']
          },
          {
            model: State,
            as: 'state',
            attributes: ['id', 'stateName']
          }
        ]
      });

      return res.status(200).json({ 
        success: true,
        plants 
      });
    } catch (error) {
      console.error('Get active plants error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch active plants',
        error: error.message 
      });
    }
  },

  // Legacy methods for backward compatibility
  async editPlant(req, res, next) {
    // Redirect to update method
    return this.update(req, res, next);
  },

  async getAllPlantNames(req, res, next) {
    try {
      let orgUserId = req.user.id;
      let whereCondition = { orgUserId, status: 'Active' };
      
      if (req.user.userType === "manager") {
        const manager = await Manager.findOne({ 
          where: { userId: req.user.id }
        });
        
        if (manager) {
          orgUserId = manager.orgUserId;
          whereCondition.managerId = manager.id;
        }
      }

      const plants = await Plant.findAll({
        where: whereCondition,
        attributes: ['id', 'plantName', 'plantId'],
        order: [['plantName', 'ASC']]
      });

      return res.status(200).json({ 
        success: true,
        plants 
      });
    } catch (error) {
      console.error('Get plant names error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch plant names',
        error: error.message 
      });
    }
  },

  async getPumpIotDeviceIdByPlant(req, res, next) {
    try {
      const { id } = req.params;
      
      const plant = await Plant.findByPk(id, {
        attributes: ['id', 'pumpIotDeviceId']
      });

      if (!plant) {
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      return res.status(200).json({ 
        success: true,
        pumpIotDeviceId: plant.pumpIotDeviceId 
      });
    } catch (error) {
      console.error('Get pump IoT device ID error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch pump IoT device ID',
        error: error.message 
      });
    }
  },

  async editPlantImage(req, res, next) {
    try {
      const { plantId, plantImage } = req.body;
      
      const plant = await Plant.findByPk(plantId);
      if (!plant) {
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      await plant.update({ plantImage });

      return res.json({ 
        success: true,
        message: "Plant image updated successfully" 
      });
    } catch (error) {
      console.error('Edit plant image error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update plant image',
        error: error.message 
      });
    }
  },

  async addLayoutInplant(req, res, next) {
    try {
      // This would need to be implemented based on your layout requirements
      return res.status(501).json({ 
        success: false,
        message: "Layout functionality not yet implemented" 
      });
    } catch (error) {
      console.error('Add layout error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to add layout',
        error: error.message 
      });
    }
  },

  async getLayoutsByPlant(req, res, next) {
    try {
      // This would need to be implemented based on your layout requirements
      return res.status(501).json({ 
        success: false,
        message: "Layout functionality not yet implemented" 
      });
    } catch (error) {
      console.error('Get layouts error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch layouts',
        error: error.message 
      });
    }
  },

  async getLayoutMarkers(req, res, next) {
    try {
      // This would need to be implemented based on your layout requirements
      return res.status(501).json({ 
        success: false,
        message: "Layout markers functionality not yet implemented" 
      });
    } catch (error) {
      console.error('Get layout markers error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch layout markers',
        error: error.message 
      });
    }
  },

  async updateLayoutMarker(req, res, next) {
    try {
      // This would need to be implemented based on your layout requirements
      return res.status(501).json({ 
        success: false,
        message: "Layout marker update functionality not yet implemented" 
      });
    } catch (error) {
      console.error('Update layout marker error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update layout marker',
        error: error.message 
      });
    }
  }
};

module.exports = plantController;