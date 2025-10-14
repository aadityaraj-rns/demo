const Joi = require("joi");
const { Role, User } = require("../../models/index");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


console.log('=== DEBUG: roleController loaded ===');
console.log('Role model:', Role);
console.log('User model:', User);




// Default permissions structure
const defaultPermissions = {
  // Admin permissions
  manageUsers: false,
  manageRoles: false,
  managePlants: false,
  manageManagers: false,
  manageTechnicians: false,
  viewDashboard: false,
  
  // Manager permissions
  viewPlants: false,
  assignTechnicians: false,
  viewReports: false,
  
  // Technician permissions
  viewAssignedJobs: false,
  updateTaskStatus: false,
};

const roleController = {
  // CREATE ROLE
  async create(req, res, next) {
    const createRoleSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional().allow(''),
      permissions: Joi.object().optional(),
    });
    
    const { error } = createRoleSchema.validate(req.body);
    if (error) return next(error);

    const { name, description, permissions = {} } = req.body;

    try {
      // Check if role name already exists
      const existingRole = await Role.findOne({ 
        where: { name } 
      });
      
      if (existingRole) {
        return next({ status: 400, message: "Role name already exists" });
      }

      // Merge with default permissions
      const rolePermissions = { ...defaultPermissions, ...permissions };

      // Create role
      const newRole = await Role.create({
        name,
        description,
        permissions: rolePermissions,
      });

      return res.status(201).json({ role: newRole });
    } catch (error) {
      console.error('Error creating role:', error);
      return next(error);
    }
  },

  // GET ALL ROLES
  async getAll(req, res, next) {
    try {
      const roles = await Role.findAll({
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({ roles });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return next(error);
    }
  },

  // UPDATE ROLE
  async update(req, res, next) {
    const updateRoleSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
      name: Joi.string().optional(),
      description: Joi.string().optional().allow(''),
      permissions: Joi.object().optional(),
    });
    
    const { error } = updateRoleSchema.validate(req.body);
    if (error) return next(error);

    const { id, name, description, permissions } = req.body;

    try {
      // Check if role exists
      const role = await Role.findByPk(id);
      if (!role) return next({ status: 404, message: "Role not found" });

      // Check if role name is being updated and if it already exists
      if (name && name !== role.name) {
        const existingRole = await Role.findOne({
          where: { name }
        });
        
        if (existingRole) {
          return next({ status: 400, message: "Role name already exists" });
        }
      }

      // Update role
      await Role.update(
        { name, description, permissions },
        { where: { id } }
      );

      // Return updated role
      const updatedRole = await Role.findByPk(id);

      return res.json({ role: updatedRole });
    } catch (error) {
      console.error('Error updating role:', error);
      return next(error);
    }
  },

  // DELETE ROLE
  async delete(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required()
    });
    
    const { error } = deleteSchema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;

    try {
      const role = await Role.findByPk(id);
      if (!role) return next({ status: 404, message: "Role not found" });

      // Check if any user is using this role
      const usersWithRole = await User.count({ where: { roleId: id } });
      if (usersWithRole > 0) {
        return next({ status: 400, message: "Cannot delete role. Users are assigned to this role." });
      }

      // Delete role
      await Role.destroy({ where: { id } });
      
      return res.json({ message: "Role deleted successfully" });
    } catch (error) {
      console.error('Error deleting role:', error);
      return next(error);
    }
  }
};

module.exports = roleController;