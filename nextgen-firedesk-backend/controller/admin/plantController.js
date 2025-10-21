const Joi = require("joi");
const path = require('path');
const ActivityService = require('../../services/ActivityService');

// DEBUG: Check current directory
console.log('Current directory:', __dirname);

// Try different paths - use the correct one
let models;
try {
    // Option 1: If controller is in controllers/admin/
    models = require("../../models");
    console.log('Models loaded from ../../models');
} catch (error1) {
    try {
        // Option 2: If controller is in controllers/
        models = require("../models");
        console.log('Models loaded from ../models');
    } catch (error2) {
        try {
            // Option 3: Absolute path
            const modelsPath = path.join(__dirname, '../../models');
            models = require(modelsPath);
            console.log('Models loaded from absolute path');
        } catch (error3) {
            console.error('All model loading attempts failed:');
            console.error('Attempt 1 error:', error1.message);
            console.error('Attempt 2 error:', error2.message);
            console.error('Attempt 3 error:', error3.message);
            throw new Error('Cannot load models');
        }
    }
}

const { Plant, City, State, Industry, Manager, User } = models;

const plantController = {
  async getAll(req, res, next) {
    try {
      console.log('GET /plant called by user:', req.user.id, req.user.userType);
      
      let whereCondition = {};
      
      // Handle manager case - managers only see their assigned plants
      if (req.user.userType === "manager") {
        const manager = await Manager.findOne({ 
          where: { userId: req.user.id }
        });
        
        if (manager) {
          whereCondition = {
            orgUserId: manager.orgUserId,
            managerId: manager.id
          };
        }
      }
      // Admin users see all plants - no filtering needed

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

      console.log('Found plants:', plants.length);

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

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const plant = await Plant.findByPk(id, {
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
            through: { attributes: [] },
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }]
          }
        ]
      });

      if (!plant) {
        return res.status(404).json({
          success: false,
          message: 'Plant not found'
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
      });

      const { error, value } = plantCreateSchema.validate(req.body, { 
        stripUnknown: true,
        abortEarly: false
      });
      
      if (error) {
        console.error('Joi validation error:', error.details);
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
      } = value;

      console.log('Creating plant with data:', {
        plantName, address, cityId, stateId, industryId, status
      });

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

      console.log('Generated plant ID:', generatedPlantId);

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

      // Log activity
      await ActivityService.logPlantCreated(newPlant, req.user);

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
      const { id } = req.params; // Get id from URL params instead of body
      
      // Use the same comprehensive schema as create, but all fields optional
      const plantUpdateSchema = Joi.object({
        // Basic Info
        plantName: Joi.string().optional(),
        address: Joi.string().optional(),
        address2: Joi.string().optional().allow(''),
        cityId: Joi.string().uuid().optional(),
        stateId: Joi.string().uuid().optional(),
        zipCode: Joi.string().optional().allow(''),
        gstNo: Joi.string().optional().allow(''),
        industryId: Joi.string().uuid().optional(),
        managerId: Joi.string().uuid().optional().allow('', null),
        plantImage: Joi.string().optional().allow(''),
        
        // Premises Details
        mainBuildings: Joi.number().optional().allow(null),
        subBuildings: Joi.number().optional().allow(null),
        buildings: Joi.array().optional(),
        totalPlantArea: Joi.number().optional().allow(null),
        totalBuildUpArea: Joi.number().optional().allow(null),
        entrances: Joi.array().optional(),
        
        // DG Details
        dgAvailable: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional().allow('', null),
        dgQuantity: Joi.number().optional().allow(null),
        
        // Staircase Details
        staircaseAvailable: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional().allow('', null),
        staircaseQuantity: Joi.number().optional().allow(null),
        staircaseType: Joi.string().optional().allow('', null),
        staircaseWidth: Joi.number().optional().allow(null),
        staircaseFireRating: Joi.alternatives().try(Joi.string(), Joi.number()).optional().allow('', null),
        staircasePressurization: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional().allow('', null),
        staircaseEmergencyLighting: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional().allow('', null),
        staircaseLocation: Joi.string().optional().allow('', null),
        
        // Lift Details
        liftAvailable: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional().allow('', null),
        liftQuantity: Joi.number().optional().allow(null),
        
        // Fire Safety
        headerPressure: Joi.string().optional().allow('', null),
        headerPressureBar: Joi.number().optional().allow(null),
        pressureUnit: Joi.string().valid("Kg/Cm2", "PSI", "MWC", "Bar", "").optional().allow(null),
        primeOverTankCapacity: Joi.number().optional().allow(null),
        terraceTankCapacity: Joi.number().optional().allow(null),
        systemCommissionDate: Joi.date().optional().allow(null),
        amcVendor: Joi.string().optional().allow('', null),
        amcStartDate: Joi.date().optional().allow(null),
        amcEndDate: Joi.date().optional().allow(null),
        numFireExtinguishers: Joi.number().optional().allow(null),
        numHydrantPoints: Joi.number().optional().allow(null),
        numSprinklers: Joi.number().optional().allow(null),
        numSafeAssemblyAreas: Joi.number().optional().allow(null),
        dieselEngine: Joi.string().optional().allow('', null),
        electricalPump: Joi.string().optional().allow('', null),
        jockeyPump: Joi.string().optional().allow('', null),
        
        // Compliance
        fireNocNumber: Joi.string().optional().allow('', null),
        nocValidityDate: Joi.date().optional().allow(null),
        insurancePolicyNumber: Joi.string().optional().allow('', null),
        insurerName: Joi.string().optional().allow('', null),
        complianceNumExtinguishers: Joi.number().optional().allow(null),
        complianceNumHydrants: Joi.number().optional().allow(null),
        complianceNumSprinklers: Joi.number().optional().allow(null),
        complianceNumSafeAreas: Joi.number().optional().allow(null),
        complianceDocuments: Joi.array().optional(),
        
        // Monitoring
        edgeDeviceId: Joi.string().optional().allow('', null),
        monitoringBuilding: Joi.string().optional().allow('', null),
        specificLocation: Joi.string().optional().allow('', null),
        installationDate: Joi.date().optional().allow(null),
        
        // Layout
        layoutName: Joi.string().optional().allow('', null),
        layouts: Joi.array().optional(),
        layoutFiles: Joi.array().optional(),
        
        // Scheduler
        schedulerCategory: Joi.string().uuid().optional().allow('', null),
        schedulerStartDate: Joi.date().optional().allow(null),
        schedulerEndDate: Joi.date().optional().allow(null),
        inspectionFrequency: Joi.string().optional().allow('', null),
        testingFrequency: Joi.string().optional().allow('', null),
        maintenanceFrequency: Joi.string().optional().allow('', null),
        schedulerSetups: Joi.array().optional(),
        
        // Status - IMPORTANT: Include Draft
        status: Joi.string().valid("Active", "Deactive", "Draft").optional(),
      }).unknown(true); // Allow unknown fields for flexibility

      const { error } = plantUpdateSchema.validate(req.body);
      if (error) {
        console.error('Joi validation error:', error.details);
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message 
        });
      }

      const plant = await Plant.findByPk(id);
      if (!plant) {
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      // Convert string booleans to actual booleans for update
      const updateData = { ...req.body };
      
      // Convert yes/no strings to booleans
      if (updateData.dgAvailable === 'yes') updateData.dgAvailable = true;
      if (updateData.dgAvailable === 'no') updateData.dgAvailable = false;
      
      if (updateData.staircaseAvailable === 'yes') updateData.staircaseAvailable = true;
      if (updateData.staircaseAvailable === 'no') updateData.staircaseAvailable = false;
      
      if (updateData.staircasePressurization === 'yes') updateData.staircasePressurization = true;
      if (updateData.staircasePressurization === 'no') updateData.staircasePressurization = false;
      
      if (updateData.staircaseEmergencyLighting === 'yes') updateData.staircaseEmergencyLighting = true;
      if (updateData.staircaseEmergencyLighting === 'no') updateData.staircaseEmergencyLighting = false;
      
      if (updateData.liftAvailable === 'yes') updateData.liftAvailable = true;
      if (updateData.liftAvailable === 'no') updateData.liftAvailable = false;

      // Remove fields that shouldn't be updated or don't exist in model
      delete updateData.city;
      delete updateData.state;
      delete updateData.industry;
      delete updateData.manager;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.plantId; // Don't allow changing generated ID
      delete updateData.orgUserId; // Don't allow changing org

      // Store old plant data for activity logging
      const oldPlant = plant.toJSON();

      await plant.update(updateData);

      // Log activity
      await ActivityService.logPlantUpdated(oldPlant, plant, req.user);

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

      // Store plant data for activity logging before deletion
      const plantData = plant.toJSON();

      await plant.destroy();

      // Log activity
      await ActivityService.logPlantDeleted(plantData, req.user);
      
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