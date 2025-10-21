// firedesk-backend/controllers/organization/plant/normalizedPlantController.js
const Joi = require("joi");
const { 
  Plant, 
  Building, 
  Floor, 
  Wing, 
  PlantManager,
  Entrance,
  DieselGenerator,
  Staircase,
  Lift,
  FireSafetyForm,
  ComplianceFireSafety,
  MonitoringForm,
  MonitoringDevice,
  Layout,
  City, 
  State, 
  Industry, 
  Manager, 
  User,
  Vendor,
  EdgeDevice,
} = require("../../../models");

const normalizedPlantController = {
  /**
   * Get all plants with their related data
   */
  async getAll(req, res, next) {
    try {
      const plants = await Plant.findAll({
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
            as: 'managers',
            through: { attributes: [] }, // Exclude junction table attributes
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }]
          },
          {
            model: Building,
            as: 'buildings',
            include: [
              {
                model: Floor,
                as: 'floors',
                include: [{
                  model: Wing,
                  as: 'wings'
                }]
              },
              {
                model: Staircase,
                as: 'staircases'
              },
              {
                model: Lift,
                as: 'lifts'
              }
            ]
          },
          {
            model: Entrance,
            as: 'entrances'
          },
          {
            model: DieselGenerator,
            as: 'dieselGenerators'
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

  /**
   * Get a single plant by ID with all related data
   */
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
            as: 'managers',
            through: { attributes: [] },
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }]
          },
          {
            model: Building,
            as: 'buildings',
            include: [
              {
                model: Floor,
                as: 'floors',
                include: [{
                  model: Wing,
                  as: 'wings'
                }]
              },
              {
                model: Staircase,
                as: 'staircases'
              },
              {
                model: Lift,
                as: 'lifts'
              }
            ]
          },
          {
            model: Entrance,
            as: 'entrances'
          },
          {
            model: DieselGenerator,
            as: 'dieselGenerators'
          },
          {
            model: FireSafetyForm,
            as: 'fireSafetyForms',
            include: [{
              model: Vendor,
              as: 'amcVendor'
            }]
          },
          {
            model: ComplianceFireSafety,
            as: 'complianceForms'
          },
          {
            model: MonitoringForm,
            as: 'monitoringForms',
            include: [
              {
                model: Building,
                as: 'building'
              },
              {
                model: Floor,
                as: 'floor'
              },
              {
                model: MonitoringDevice,
                as: 'devices',
                include: [{
                  model: EdgeDevice,
                  as: 'edgeDevice'
                }]
              }
            ]
          },
          {
            model: Layout,
            as: 'layouts',
            include: [
              {
                model: Building,
                as: 'building'
              },
              {
                model: Floor,
                as: 'floor'
              },
              {
                model: Wing,
                as: 'wing'
              }
            ]
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
      console.error('Get plant error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch plant',
        error: error.message 
      });
    }
  },

  /**
   * Create a new plant with buildings, floors, wings, etc.
   */
  async create(req, res, next) {
    const transaction = await Plant.sequelize.transaction();
    
    try {
      const plantCreateSchema = Joi.object({
        // Basic Plant Info
        plantName: Joi.string().required(),
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().optional().allow(''),
        cityId: Joi.string().uuid().required(),
        stateId: Joi.string().uuid().required(),
        zipCode: Joi.string().optional().allow(''),
        gstNo: Joi.string().optional().allow(''),
        industryId: Joi.string().uuid().required(),
        numMainBuildings: Joi.number().optional(),
        numSubBuildings: Joi.number().optional(),
        totalPlantArea: Joi.number().optional(),
        totalBuildUpArea: Joi.number().optional(),
        status: Joi.string().valid("Active", "Deactive", "Draft").optional(),
        
        // Manager IDs array
        managerIds: Joi.array().items(Joi.string().uuid()).optional(),
        
        // Buildings array
        buildings: Joi.array().items(Joi.object({
          buildingName: Joi.string().required(),
          buildingHeight: Joi.number().optional(),
          totalArea: Joi.number().optional(),
          totalBuildUpArea: Joi.number().optional(),
          floors: Joi.array().items(Joi.object({
            floorName: Joi.string().required(),
            usage: Joi.string().optional().allow(''),
            floorArea: Joi.number().optional(),
            wings: Joi.array().items(Joi.object({
              wingName: Joi.string().required(),
              usage: Joi.string().optional().allow(''),
              wingArea: Joi.number().optional(),
            })).optional()
          })).optional(),
          staircases: Joi.array().items(Joi.object({
            available: Joi.boolean().optional(),
            quantity: Joi.number().optional(),
            type: Joi.string().optional().allow(''),
            width: Joi.number().optional(),
            fireRating: Joi.number().optional(),
            pressurization: Joi.boolean().optional(),
            emergencyLighting: Joi.boolean().optional(),
            location: Joi.string().optional().allow(''),
          })).optional(),
          lifts: Joi.array().items(Joi.object({
            available: Joi.boolean().optional(),
            quantity: Joi.number().optional(),
          })).optional(),
        })).optional(),
        
        // Entrances array
        entrances: Joi.array().items(Joi.object({
          entranceName: Joi.string().required(),
          width: Joi.number().optional(),
        })).optional(),
        
        // Diesel Generators
        dieselGenerators: Joi.array().items(Joi.object({
          available: Joi.boolean().optional(),
          quantity: Joi.number().optional(),
        })).optional(),
      });

      const { error, value } = plantCreateSchema.validate(req.body);
      
      if (error) {
        await transaction.rollback();
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message,
          errors: error.details.map(d => d.message)
        });
      }

      const {
        plantName,
        addressLine1,
        addressLine2,
        cityId,
        stateId,
        zipCode,
        gstNo,
        industryId,
        numMainBuildings,
        numSubBuildings,
        totalPlantArea,
        totalBuildUpArea,
        status,
        managerIds,
        buildings,
        entrances,
        dieselGenerators,
      } = value;

      // Create the plant
      const newPlant = await Plant.create({
        plantName,
        addressLine1,
        addressLine2: addressLine2 || null,
        cityId,
        stateId,
        zipCode: zipCode || null,
        gstNo: gstNo || null,
        industryId,
        numMainBuildings: numMainBuildings || 0,
        numSubBuildings: numSubBuildings || 0,
        totalPlantArea: totalPlantArea || null,
        totalBuildUpArea: totalBuildUpArea || null,
        status: status || 'Draft',
      }, { transaction });

      // Associate managers with plant
      if (managerIds && managerIds.length > 0) {
        const plantManagers = managerIds.map(managerId => ({
          plantId: newPlant.id,
          managerId
        }));
        await PlantManager.bulkCreate(plantManagers, { transaction });
      }

      // Create buildings with floors and wings
      if (buildings && buildings.length > 0) {
        for (const building of buildings) {
          const newBuilding = await Building.create({
            plantId: newPlant.id,
            buildingName: building.buildingName,
            buildingHeight: building.buildingHeight || null,
            totalArea: building.totalArea || null,
            totalBuildUpArea: building.totalBuildUpArea || null,
          }, { transaction });

          // Create floors for this building
          if (building.floors && building.floors.length > 0) {
            for (const floor of building.floors) {
              const newFloor = await Floor.create({
                buildingId: newBuilding.id,
                floorName: floor.floorName,
                usage: floor.usage || null,
                floorArea: floor.floorArea || null,
              }, { transaction });

              // Create wings for this floor
              if (floor.wings && floor.wings.length > 0) {
                const wings = floor.wings.map(wing => ({
                  floorId: newFloor.id,
                  wingName: wing.wingName,
                  usage: wing.usage || null,
                  wingArea: wing.wingArea || null,
                }));
                await Wing.bulkCreate(wings, { transaction });
              }
            }
          }

          // Create staircases for this building
          if (building.staircases && building.staircases.length > 0) {
            const staircases = building.staircases.map(staircase => ({
              buildingId: newBuilding.id,
              available: staircase.available || false,
              quantity: staircase.quantity || 0,
              type: staircase.type || null,
              width: staircase.width || null,
              fireRating: staircase.fireRating || null,
              pressurization: staircase.pressurization || false,
              emergencyLighting: staircase.emergencyLighting || false,
              location: staircase.location || null,
            }));
            await Staircase.bulkCreate(staircases, { transaction });
          }

          // Create lifts for this building
          if (building.lifts && building.lifts.length > 0) {
            const lifts = building.lifts.map(lift => ({
              buildingId: newBuilding.id,
              available: lift.available || false,
              quantity: lift.quantity || 0,
            }));
            await Lift.bulkCreate(lifts, { transaction });
          }
        }
      }

      // Create entrances
      if (entrances && entrances.length > 0) {
        const entranceData = entrances.map(entrance => ({
          plantId: newPlant.id,
          entranceName: entrance.entranceName,
          width: entrance.width || null,
        }));
        await Entrance.bulkCreate(entranceData, { transaction });
      }

      // Create diesel generators
      if (dieselGenerators && dieselGenerators.length > 0) {
        const dgData = dieselGenerators.map(dg => ({
          plantId: newPlant.id,
          available: dg.available || false,
          quantity: dg.quantity || 0,
        }));
        await DieselGenerator.bulkCreate(dgData, { transaction });
      }

      await transaction.commit();

      // Fetch the created plant with all associations
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
          },
          {
            model: Building,
            as: 'buildings',
            include: [
              { model: Floor, as: 'floors', include: [{ model: Wing, as: 'wings' }] },
              { model: Staircase, as: 'staircases' },
              { model: Lift, as: 'lifts' }
            ]
          },
          { model: Entrance, as: 'entrances' },
          { model: DieselGenerator, as: 'dieselGenerators' }
        ]
      });

      return res.status(201).json({ 
        success: true,
        message: "Plant created successfully",
        plant: createdPlant 
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Create plant error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to create plant',
        error: error.message 
      });
    }
  },

  /**
   * Update a plant
   */
  async update(req, res, next) {
    const transaction = await Plant.sequelize.transaction();
    
    try {
      const { id } = req.params;
      
      const plant = await Plant.findByPk(id);
      if (!plant) {
        await transaction.rollback();
        return res.status(404).json({ 
          success: false,
          message: "Plant not found" 
        });
      }

      const plantUpdateSchema = Joi.object({
        plantName: Joi.string().optional(),
        addressLine1: Joi.string().optional(),
        addressLine2: Joi.string().optional().allow(''),
        cityId: Joi.string().uuid().optional(),
        stateId: Joi.string().uuid().optional(),
        zipCode: Joi.string().optional().allow(''),
        gstNo: Joi.string().optional().allow(''),
        industryId: Joi.string().uuid().optional(),
        numMainBuildings: Joi.number().optional(),
        numSubBuildings: Joi.number().optional(),
        totalPlantArea: Joi.number().optional(),
        totalBuildUpArea: Joi.number().optional(),
        status: Joi.string().valid("Active", "Deactive", "Draft").optional(),
        managerIds: Joi.array().items(Joi.string().uuid()).optional(),
      });

      const { error, value } = plantUpdateSchema.validate(req.body);
      if (error) {
        await transaction.rollback();
        return res.status(400).json({ 
          success: false,
          message: error.details[0].message 
        });
      }

      // Update plant basic info
      await plant.update(value, { transaction });

      // Update managers if provided
      if (value.managerIds !== undefined) {
        // Remove existing associations
        await PlantManager.destroy({
          where: { plantId: plant.id },
          transaction
        });
        
        // Create new associations
        if (value.managerIds.length > 0) {
          const plantManagers = value.managerIds.map(managerId => ({
            plantId: plant.id,
            managerId
          }));
          await PlantManager.bulkCreate(plantManagers, { transaction });
        }
      }

      await transaction.commit();

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
      await transaction.rollback();
      console.error('Update plant error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update plant',
        error: error.message 
      });
    }
  },

  /**
   * Delete a plant
   */
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
};

module.exports = normalizedPlantController;
