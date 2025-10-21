// 

// firedesk-backend/controllers/plantController.js
const Joi = require("joi");
const { Plant, City, State, Industry, Manager, User } = require("../../../models");

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
        address: Joi.string().required(),
        address2: Joi.string().optional().allow(''),
        cityId: Joi.string().uuid().required(),
        stateId: Joi.string().uuid().required(),
        zipCode: Joi.string().optional().allow(''),
        gstNo: Joi.string().optional().allow(''),
        industryId: Joi.string().uuid().required(),
        managerId: Joi.string().uuid().optional().allow('', null),
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
        
        const cityData = await City.findByPk(cityId);
        const citySlice = cityData ? cityData.cityName.slice(0, 3).toUpperCase() : 'CTY';
        
        generatedPlantId = `${orgNameSlice}-${citySlice}-${(plantCount + 1).toString().padStart(4, "0")}`;
      }

      // Convert string boolean values to actual booleans
      const plantData = {
        plantId: generatedPlantId,
        orgUserId,
        plantName,
        address,
        address2: address2 || null,
        cityId,
        stateId,
        zipCode: zipCode || null,
        gstNo: gstNo || null,
        industryId,
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

      // Fetch the created plant with associations
      const createdPlant = await Plant.findByPk(newPlant.id, {
        include: [
          { model: City, as: 'city', include: [{ model: State, as: 'state' }] },
          { model: State, as: 'state' },
          { model: Industry, as: 'industry' },
          { 
            model: Manager, 
            as: 'managers', // Fixed: changed from 'manager' to 'managers'
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

  async update(req, res, next) {
    try {
      const plantUpdateSchema = Joi.object({
        id: Joi.string().uuid().required(),
        plantName: Joi.string().optional(),
        address: Joi.string().optional(),
        cityId: Joi.string().uuid().optional(),
        stateId: Joi.string().uuid().optional(),
        industryId: Joi.string().uuid().optional(),
        managerId: Joi.string().uuid().optional().allow('', null),
        status: Joi.string().valid("Active", "Deactive").optional(),
        headerPressure: Joi.string().optional().allow(''),
        pressureUnit: Joi.string().valid("Kg/Cm2", "PSI", "MWC", "Bar", "").optional(),
        mainWaterStorage: Joi.string().optional().allow(''),
        primeWaterTankStorage: Joi.string().optional().allow(''),
        dieselStorage: Joi.string().optional().allow(''),
      });

      const { error } = plantUpdateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message 
        });
      }

      const {
        id,
        plantName,
        address,
        cityId,
        stateId,
        industryId,
        managerId,
        status,
        headerPressure,
        pressureUnit,
        mainWaterStorage,
        primeWaterTankStorage,
        dieselStorage,
      } = req.body;

      const plant = await Plant.findByPk(id);
      if (!plant) {
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      // Update plant fields
      const updateData = {
        plantName: plantName !== undefined ? plantName : plant.plantName,
        address: address !== undefined ? address : plant.address,
        cityId: cityId !== undefined ? cityId : plant.cityId,
        stateId: stateId !== undefined ? stateId : plant.stateId,
        industryId: industryId !== undefined ? industryId : plant.industryId,
        managerId: managerId !== undefined ? (managerId || null) : plant.managerId,
        status: status !== undefined ? status : plant.status,
        headerPressure: headerPressure !== undefined ? headerPressure : plant.headerPressure,
        pressureUnit: pressureUnit !== undefined ? pressureUnit : plant.pressureUnit,
        mainWaterStorage: mainWaterStorage !== undefined ? mainWaterStorage : plant.mainWaterStorage,
        primeWaterTankStorage: primeWaterTankStorage !== undefined ? primeWaterTankStorage : plant.primeWaterTankStorage,
        dieselStorage: dieselStorage !== undefined ? dieselStorage : plant.dieselStorage,
      };

      await plant.update(updateData);

      // Fetch updated plant with associations
      const updatedPlant = await Plant.findByPk(id, {
        include: [
          { model: City, as: 'city', include: [{ model: State, as: 'state' }] },
          { model: State, as: 'state' },
          { model: Industry, as: 'industry' },
          { 
            model: Manager, 
            as: 'managers', // Fixed: changed from 'manager' to 'managers'
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
  }
};

module.exports = plantController;