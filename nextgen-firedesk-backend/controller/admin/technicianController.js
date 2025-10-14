const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const { Technician, Plant, Manager, Category, User, Role } = require("../../models");
const { sequelize } = require("../../database/index");
const activityLogger = require("../../services/activityLogger");

const technicianController = {
  async create(req, res) {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        plantId: Joi.string().allow('', null),
        managerId: Joi.string().allow('', null),
        categoryId: Joi.string().allow('', null),
        technicianType: Joi.string().valid("In House", "Third Party").required(),
        experience: Joi.string().allow("", null),
        specialization: Joi.string().allow("", null),
        venderName: Joi.string().allow("", null),
        venderNumber: Joi.string().allow("", null),
        venderEmail: Joi.string().allow("", null),
        venderAddress: Joi.string().allow("", null),
        status: Joi.string().valid("Active", "Inactive").optional(),
        roleId: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const {
        name,
        email,
        phone,
        plantId,
        managerId,
        categoryId,
        technicianType,
        experience,
        specialization,
        venderName,
        venderNumber,
        venderEmail,
        venderAddress,
        status,
        roleId,
      } = req.body;

      const transaction = await sequelize.transaction();

      try {
        const orgUserId = req.user.id;
        const orgName = req.user.name.slice(0, 2).toUpperCase();

        // Check if user already exists
        const existingUser = await User.findOne({ 
          where: { email },
          transaction 
        });
        
        if (existingUser) {
          await transaction.rollback();
          return res.status(400).json({ 
            success: false, 
            message: "User with this email already exists" 
          });
        }

        // Check if role exists
        const role = await Role.findByPk(roleId, { transaction });
        if (!role) {
          await transaction.rollback();
          return res.status(404).json({ 
            success: false, 
            message: "Role not found" 
          });
        }

        // Create user first
        const newUser = await User.create({
          id: uuidv4(),
          name,
          email,
          phone,
          userType: 'technician',
          status: 'active',
          password: 'technician123',
          roleId: roleId,
        }, { transaction });

        // Get technician count for ID generation
        // Find existing technicians for this org and extract the highest number
        console.log('Creating technician for orgUserId:', orgUserId, 'orgName:', orgName);
        
        // Query ALL technicians with this pattern (technicianId must be globally unique)
        const existingTechnicians = await Technician.findAll({
          where: { 
            technicianId: {
              [require('sequelize').Op.like]: `${orgName}-TEC-%`
            }
          },
          attributes: ['technicianId']
        });

        console.log('Found existing technicians:', existingTechnicians.map(t => t.technicianId));

        let maxNumber = 0;
        existingTechnicians.forEach(tech => {
          const match = tech.technicianId.match(/-TEC-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNumber) maxNumber = num;
          }
        });

        const technicianId = `${orgName}-TEC-${String(maxNumber + 1).padStart(4, "0")}`;
        console.log('Generated technicianId:', technicianId);


        // Create technician with optional fields
        const technicianData = {
          id: uuidv4(),
          technicianId,
          orgUserId,
          userId: newUser.id,
          plantId: plantId || null,
          managerId: managerId || null,
          categoryId: categoryId || null,
          technicianType,
          experience: experience || null,
          specialization: specialization || null,
          venderName: venderName || null,
          venderNumber: venderNumber || null,
          venderEmail: venderEmail || null,
          venderAddress: venderAddress || null,
          status: status || 'Active'
        };

        const newTech = await Technician.create(technicianData, { transaction });

        await transaction.commit();

        // Fetch created technician with associations
        const createdTech = await Technician.findByPk(newTech.id, {
          include: [
            { 
              model: User, 
              as: "user", 
              attributes: ["id", "name", "email", "phone"],
              include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
              }]
            },
            { 
              model: Manager, 
              as: "manager",
              include: [{
                model: User,
                as: 'user',
                attributes: ['name']
              }]
            },
            { 
              model: Plant, 
              as: "plant",
              attributes: ['id', 'plantName', 'plantId']
            },
            { 
              model: Category, 
              as: "category",
              attributes: ['id', 'categoryName']
            },
          ],
        });

        // Log activity
        await activityLogger.log({
          action: 'created',
          entityType: 'technician',
          entityId: createdTech.id,
          entityName: name,
          user: req.user,
          description: `Created technician ${name} (${email})`,
          metadata: { technicianId: createdTech.technicianId, technicianType },
          ipAddress: req.ip,
        });

        return res.status(201).json({ 
          success: true, 
          message: "Technician created successfully",
          technician: createdTech 
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      console.error("Create Technician Error:", err);
      
      // Handle specific errors with better messages
      if (err.name === 'SequelizeUniqueConstraintError') {
        if (err.fields && err.fields.technicianId) {
          return res.status(400).json({ 
            success: false, 
            message: "Technician ID already exists. Please try again or contact support." 
          });
        }
      }
      
      res.status(500).json({ success: false, message: err.message || "Failed to create technician" });
    }
  },

  async getAll(req, res) {
    try {
      let whereCondition = {};
      
      // Handle manager case - managers only see their assigned technicians
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
      // Admin users see all technicians - no filtering needed
      
      const technicians = await Technician.findAll({
        where: whereCondition,
        include: [
          { 
            model: User, 
            as: "user", 
            attributes: ["id", "name", "email", "phone"],
            include: [{
              model: Role,
              as: 'role',
              attributes: ['id', 'name']
            }]
          },
          { 
            model: Manager, 
            as: "manager", 
            include: [{ 
              model: User, 
              as: "user", 
              attributes: ["name"] 
            }] 
          },
          { 
            model: Plant, 
            as: "plant",
            attributes: ['id', 'plantName', 'plantId']
          },
          { 
            model: Category, 
            as: "category",
            attributes: ['id', 'categoryName']
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json({ success: true, technicians });
    } catch (err) {
      console.error("Get Technicians Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        plantId: Joi.string().allow('', null),
        managerId: Joi.string().allow('', null),
        categoryId: Joi.string().allow('', null),
        technicianType: Joi.string().valid("In House", "Third Party").required(),
        experience: Joi.string().allow("", null),
        specialization: Joi.string().allow("", null),
        venderName: Joi.string().allow("", null),
        venderNumber: Joi.string().allow("", null),
        venderEmail: Joi.string().allow("", null),
        venderAddress: Joi.string().allow("", null),
        status: Joi.string().valid("Active", "Inactive"),
        roleId: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.details[0].message });

      const transaction = await sequelize.transaction();

      try {
        const technician = await Technician.findByPk(id, { transaction });
        if (!technician) {
          await transaction.rollback();
          return res.status(404).json({ success: false, message: "Technician not found" });
        }

        // Prepare update data
        const updateData = {
          plantId: req.body.plantId || null,
          managerId: req.body.managerId || null,
          categoryId: req.body.categoryId || null,
          technicianType: req.body.technicianType,
          experience: req.body.experience || null,
          specialization: req.body.specialization || null,
          status: req.body.status,
        };

        // Handle vendor details based on technician type
        if (req.body.technicianType === 'In House') {
          updateData.venderName = null;
          updateData.venderNumber = null;
          updateData.venderEmail = null;
          updateData.venderAddress = null;
        } else {
          updateData.venderName = req.body.venderName || null;
          updateData.venderNumber = req.body.venderNumber || null;
          updateData.venderEmail = req.body.venderEmail || null;
          updateData.venderAddress = req.body.venderAddress || null;
        }

        // Update technician
        await technician.update(updateData, { transaction });

        // Update user
        await User.update({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          roleId: req.body.roleId,
        }, { 
          where: { id: technician.userId },
          transaction 
        });

        await transaction.commit();

        // Fetch updated technician
        const updated = await Technician.findByPk(id, {
          include: [
            { 
              model: User, 
              as: "user", 
              attributes: ["id", "name", "email", "phone"],
              include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
              }]
            },
            { 
              model: Plant, 
              as: "plant",
              attributes: ['id', 'plantName', 'plantId']
            },
            { 
              model: Manager, 
              as: "manager",
              include: [{
                model: User,
                as: 'user',
                attributes: ['name']
              }]
            },
            { 
              model: Category, 
              as: "category",
              attributes: ['id', 'categoryName']
            },
          ],
        });

        res.json({ 
          success: true, 
          message: "Technician updated successfully",
          technician: updated 
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      console.error("Update Technician Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const transaction = await sequelize.transaction();
      
      try {
        const technician = await Technician.findByPk(id, { transaction });
        if (!technician) {
          await transaction.rollback();
          return res.status(404).json({ success: false, message: "Technician not found" });
        }

        const userId = technician.userId;

        // Delete technician
        await technician.destroy({ transaction });

        // Also delete the user
        await User.destroy({ 
          where: { id: userId },
          transaction 
        });

        await transaction.commit();

        res.json({ 
          success: true, 
          message: "Technician deleted successfully" 
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      console.error("Delete Technician Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }, 
};

module.exports = technicianController;