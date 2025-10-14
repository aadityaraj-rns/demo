const Joi = require("joi");
const { Manager, User, Plant } = require("../../models/index");
const ActivityService = require("../../services/ActivityService");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const managerController = {
  // CREATE MANAGER
  async create(req, res, next) {
    const createManagerSchema = Joi.object({
      userId: Joi.string().pattern(uuidPattern).required(),
      plantIds: Joi.array().items(Joi.string().pattern(uuidPattern)).optional(),
    });
    
    const { error } = createManagerSchema.validate(req.body);
    if (error) return next(error);

    const { userId, plantIds } = req.body;

    try {
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) return next({ status: 404, message: "User not found" });

      // Check if manager already exists for this user
      const existingManager = await Manager.findOne({ 
        where: { userId } 
      });
      
      if (existingManager) {
        return next({ status: 400, message: "Manager already exists for this user" });
      }

      // Generate manager ID
      const managerCount = await Manager.count();
      const managerId = `MGR${(managerCount + 1).toString().padStart(4, "0")}`;

      // Create manager
      const newManager = await Manager.create({
        managerId,
        userId,
        orgUserId: req.user.id, // Admin creating the manager
      });

      // Log activity
      await ActivityService.logManagerCreated(newManager, req.user, user.name);

      // Associate manager with plants if provided
      if (plantIds && plantIds.length > 0) {
        for (const plantId of plantIds) {
          const plant = await Plant.findByPk(plantId);
          if (plant) {
            await plant.update({ managerId: newManager.id });
            // Log manager assignment to plant
            await ActivityService.logManagerAssignedToPlant(newManager, plant, req.user, user.name);
          }
        }
      }

      // Return manager with user details
      const managerWithUser = await Manager.findByPk(newManager.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone'] // Fixed: use 'name' instead of 'firstName', 'lastName'
          },
          {
            model: Plant,
            as: 'plants',
            attributes: ['id', 'plantName', 'plantId'],
            include: [
              {
                model: require("../../models/admin/masterData/Industry"),
                as: 'industry',
                attributes: ['id', 'industryName']
              }
            ]
          }
        ]
      });

      return res.status(201).json({ manager: managerWithUser });
    } catch (error) {
      return next(error);
    }
  },

  // GET ALL MANAGERS
  async getAll(req, res, next) {
    try {
      const allManager = await Manager.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone'] // Fixed: use 'name'
          },
          {
            model: Plant,
            as: 'plants',
            attributes: ['id', 'plantName', 'plantId'],
            include: [
              {
                model: require("../../models/admin/masterData/Industry"),
                as: 'industry',
                attributes: ['id', 'industryName']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({ allManager });
    } catch (error) {
      return next(error);
    }
  },

  // GET ACTIVE MANAGERS
  async getAllActive(req, res, next) {
    try {
      const allManager = await Manager.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone'] // Fixed: use 'name'
          },
          {
            model: Plant,
            as: 'plants',
            attributes: ['id', 'plantName', 'plantId'],
            include: [
              {
                model: require("../../models/admin/masterData/Industry"),
                as: 'industry',
                attributes: ['id', 'industryName']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({ allManager });
    } catch (error) {
      return next(error);
    }
  },

  // UPDATE MANAGER
  async update(req, res, next) {
    const updateManagerSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
      userId: Joi.string().pattern(uuidPattern).optional(),
      plantIds: Joi.array().items(Joi.string().pattern(uuidPattern)).optional(),
    });
    
    const { error } = updateManagerSchema.validate(req.body);
    if (error) return next(error);

    const { id, userId, plantIds } = req.body;

    try {
      // Check if manager exists
      const manager = await Manager.findByPk(id);
      if (!manager) return next({ status: 404, message: "Manager not found" });

      // Check if user exists (if userId is being updated)
      if (userId) {
        const user = await User.findByPk(userId);
        if (!user) return next({ status: 404, message: "User not found" });
      }

      // Update manager
      await Manager.update(
        { userId },
        { where: { id } }
      );

      // Update plant associations if provided
      if (plantIds) {
        // Remove manager from all current plants
        await Plant.update(
          { managerId: null },
          { where: { managerId: id } }
        );

        // Add manager to new plants
        for (const plantId of plantIds) {
          const plant = await Plant.findByPk(plantId);
          if (plant) {
            await plant.update({ managerId: id });
          }
        }
      }

      // Return updated manager
      const updatedManager = await Manager.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone'] // Fixed: use 'name'
          },
          {
            model: Plant,
            as: 'plants',
            attributes: ['id', 'plantName', 'plantId'],
            include: [
              {
                model: require("../../models/admin/masterData/Industry"),
                as: 'industry',
                attributes: ['id', 'industryName']
              }
            ]
          }
        ]
      });

      return res.json({ manager: updatedManager });
    } catch (error) {
      return next(error);
    }
  },

  // DELETE MANAGER
  async delete(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required()
    });
    
    const { error } = deleteSchema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;

    try {
      const manager = await Manager.findByPk(id);
      if (!manager) return next({ status: 404, message: "Manager not found" });

      // Remove manager from all plants (set managerId to null)
      await Plant.update(
        { managerId: null },
        { where: { managerId: id } }
      );

      // Delete manager
      await Manager.destroy({ where: { id } });
      
      return res.json({ message: "Manager deleted successfully" });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = managerController;