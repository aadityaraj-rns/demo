// controller/admin/userController.js
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { User, Role, Manager, Technician, Plant } = require("../../models/index");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const userController = {
  // GET ALL USERS WITH ROLES
  async getAll(req, res, next) {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'permissions']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({ users });
    } catch (error) {
      return next(error);
    }
  },

  // UPDATE USER ROLE
  async updateRole(req, res, next) {
    const updateRoleSchema = Joi.object({
      userId: Joi.string().pattern(uuidPattern).required(),
      roleId: Joi.string().pattern(uuidPattern).required(),
    });
    
    const { error } = updateRoleSchema.validate(req.body);
    if (error) return next(error);

    const { userId, roleId } = req.body;

    try {
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) return next({ status: 404, message: "User not found" });

      // Check if role exists
      const role = await Role.findByPk(roleId);
      if (!role) return next({ status: 404, message: "Role not found" });

      // Update user role
      await User.update(
        { roleId },
        { where: { id: userId } }
      );

      // If role is Manager, ensure manager record exists
      if (role.name === 'Manager') {
        const existingManager = await Manager.findOne({ where: { userId } });
        if (!existingManager) {
          const managerCount = await Manager.count();
          const managerId = `MGR${(managerCount + 1).toString().padStart(4, "0")}`;
          
          await Manager.create({
            managerId,
            userId,
            orgUserId: req.user.id,
          });
        }
      }

      // If role is Technician, ensure technician record exists
      if (role.name === 'Technician') {
        const existingTechnician = await Technician.findOne({ where: { userId } });
        if (!existingTechnician) {
          await Technician.create({
            userId,
            data: { assignedBy: req.user.id }
          });
        }
      }

      // Return updated user
      const updatedUser = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'permissions']
          }
        ]
      });

      return res.json({ user: updatedUser });
    } catch (error) {
      return next(error);
    }
  },

  // CREATE USER WITH ROLE AND MANAGER PLANTS
  async create(req, res, next) {
    const createUserSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().optional().allow(''),
      password: Joi.string().min(6).required(),
      roleId: Joi.string().pattern(uuidPattern).required(),
      userType: Joi.string().optional(),
      plantIds: Joi.array().items(Joi.string().pattern(uuidPattern)).optional(),
    });
    
    const { error } = createUserSchema.validate(req.body);
    if (error) return next(error);

    const { name, email, phone, password, roleId, userType, plantIds = [] } = req.body;

    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return next({ status: 400, message: "Email already exists" });
      }

      // Check if role exists
      const role = await Role.findByPk(roleId);
      if (!role) return next({ status: 404, message: "Role not found" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.create({
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        roleId,
        userType: userType || role.name,
        status: 'active',
      });

      // Create manager/technician record based on role
      if (role.name === 'Manager') {
        const managerCount = await Manager.count();
        const managerId = `MGR${(managerCount + 1).toString().padStart(4, "0")}`;
        
        const newManager = await Manager.create({
          managerId,
          userId: newUser.id,
          orgUserId: req.user.id,
        });

        // Associate manager with plants if provided
        if (plantIds && plantIds.length > 0) {
          for (const plantId of plantIds) {
            const plant = await Plant.findByPk(plantId);
            if (plant) {
              await plant.update({ managerId: newManager.id });
            }
          }
        }
      }

      if (role.name === 'Technician') {
        await Technician.create({
          userId: newUser.id,
          data: { assignedBy: req.user.id }
        });
      }

      // Return user with role
      const userWithRole = await User.findByPk(newUser.id, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'permissions']
          }
        ]
      });

      return res.status(201).json({ 
        success: true,
        message: "User created successfully",
        user: userWithRole 
      });
    } catch (error) {
      console.error('Create user error:', error);
      return next(error);
    }
  }
};

module.exports = userController;