const Activity = require('../models/Activity');

class ActivityService {
  /**
   * Log an activity
   * @param {Object} params - Activity parameters
   * @param {string} params.action - Action performed (created, updated, deleted, etc.)
   * @param {string} params.entityType - Type of entity (plant, user, manager, etc.)
   * @param {string} params.entityId - ID of the affected entity
   * @param {string} params.entityName - Name of the affected entity
   * @param {string} params.userId - User who performed the action
   * @param {string} params.userName - Name of user who performed the action
   * @param {string} params.userType - Type of user (admin, manager, technician)
   * @param {string} params.description - Description of the activity
   * @param {Object} params.changes - Object containing before/after values
   * @param {Object} params.metadata - Additional metadata
   */
  static async log({
    action,
    entityType,
    entityId = null,
    entityName = null,
    userId,
    userName,
    userType,
    description = null,
    changes = null,
    metadata = null
  }) {
    try {
      await Activity.create({
        action,
        entityType,
        entityId,
        entityName,
        userId,
        userName,
        userType,
        description,
        changes,
        metadata
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  /**
   * Log plant creation
   */
  static async logPlantCreated(plant, user) {
    await this.log({
      action: 'created',
      entityType: 'plant',
      entityId: plant.id,
      entityName: plant.plantName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Created plant "${plant.plantName}" (${plant.plantId})`,
      metadata: {
        plantId: plant.plantId,
        status: plant.status,
        cityId: plant.cityId,
        stateId: plant.stateId
      }
    });
  }

  /**
   * Log plant update
   */
  static async logPlantUpdated(oldPlant, newPlant, user) {
    const changes = this.getChanges(oldPlant, newPlant);
    
    await this.log({
      action: 'updated',
      entityType: 'plant',
      entityId: newPlant.id,
      entityName: newPlant.plantName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Updated plant "${newPlant.plantName}"`,
      changes,
      metadata: {
        fieldsChanged: Object.keys(changes)
      }
    });
  }

  /**
   * Log plant deletion
   */
  static async logPlantDeleted(plant, user) {
    await this.log({
      action: 'deleted',
      entityType: 'plant',
      entityId: plant.id,
      entityName: plant.plantName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Deleted plant "${plant.plantName}" (${plant.plantId})`,
      metadata: {
        plantId: plant.plantId,
        status: plant.status
      }
    });
  }

  /**
   * Log manager creation
   */
  static async logManagerCreated(manager, user, userName) {
    await this.log({
      action: 'created',
      entityType: 'manager',
      entityId: manager.id,
      entityName: userName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Created manager "${userName}" (${manager.managerId})`,
      metadata: {
        managerId: manager.managerId,
        userId: manager.userId
      }
    });
  }

  /**
   * Log manager update
   */
  static async logManagerUpdated(oldManager, newManager, user, managerName) {
    const changes = this.getChanges(oldManager, newManager);
    
    await this.log({
      action: 'updated',
      entityType: 'manager',
      entityId: newManager.id,
      entityName: managerName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Updated manager "${managerName}"`,
      changes,
      metadata: {
        managerId: newManager.managerId
      }
    });
  }

  /**
   * Log manager assigned to plant
   */
  static async logManagerAssignedToPlant(manager, plant, user, managerName) {
    await this.log({
      action: 'assigned',
      entityType: 'manager',
      entityId: manager.id,
      entityName: managerName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Assigned manager "${managerName}" to plant "${plant.plantName}"`,
      metadata: {
        managerId: manager.managerId,
        plantId: plant.id,
        plantName: plant.plantName
      }
    });
  }

  /**
   * Log technician creation
   */
  static async logTechnicianCreated(technician, user, userName) {
    await this.log({
      action: 'created',
      entityType: 'technician',
      entityId: technician.id,
      entityName: userName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Created technician "${userName}" (${technician.technicianId})`,
      metadata: {
        technicianId: technician.technicianId,
        userId: technician.userId
      }
    });
  }

  /**
   * Log technician update
   */
  static async logTechnicianUpdated(oldTechnician, newTechnician, user, technicianName) {
    const changes = this.getChanges(oldTechnician, newTechnician);
    
    await this.log({
      action: 'updated',
      entityType: 'technician',
      entityId: newTechnician.id,
      entityName: technicianName,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Updated technician "${technicianName}"`,
      changes,
      metadata: {
        technicianId: newTechnician.technicianId
      }
    });
  }

  /**
   * Log user creation
   */
  static async logUserCreated(newUser, createdBy) {
    await this.log({
      action: 'created',
      entityType: 'user',
      entityId: newUser.id,
      entityName: newUser.name,
      userId: createdBy.id,
      userName: createdBy.name,
      userType: createdBy.roleType || 'admin',
      description: `Created user "${newUser.name}" with email ${newUser.email}`,
      metadata: {
        email: newUser.email,
        phone: newUser.phone,
        roleId: newUser.roleId
      }
    });
  }

  /**
   * Log user update
   */
  static async logUserUpdated(oldUser, newUser, updatedBy) {
    const changes = this.getChanges(oldUser, newUser);
    
    await this.log({
      action: 'updated',
      entityType: 'user',
      entityId: newUser.id,
      entityName: newUser.name,
      userId: updatedBy.id,
      userName: updatedBy.name,
      userType: updatedBy.roleType || 'admin',
      description: `Updated user "${newUser.name}"`,
      changes,
      metadata: {
        fieldsChanged: Object.keys(changes)
      }
    });
  }

  /**
   * Log user deletion
   */
  static async logUserDeleted(user, deletedBy) {
    await this.log({
      action: 'deleted',
      entityType: 'user',
      entityId: user.id,
      entityName: user.name,
      userId: deletedBy.id,
      userName: deletedBy.name,
      userType: deletedBy.roleType || 'admin',
      description: `Deleted user "${user.name}" (${user.email})`,
      metadata: {
        email: user.email
      }
    });
  }

  /**
   * Log role creation
   */
  static async logRoleCreated(role, user) {
    await this.log({
      action: 'created',
      entityType: 'role',
      entityId: role.id,
      entityName: role.roleType,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Created role "${role.roleType}"`,
      metadata: {
        permissions: role.permissions
      }
    });
  }

  /**
   * Log role update
   */
  static async logRoleUpdated(oldRole, newRole, user) {
    const changes = this.getChanges(oldRole, newRole);
    
    await this.log({
      action: 'updated',
      entityType: 'role',
      entityId: newRole.id,
      entityName: newRole.roleType,
      userId: user.id,
      userName: user.name,
      userType: user.roleType || 'admin',
      description: `Updated role "${newRole.roleType}"`,
      changes
    });
  }

  /**
   * Helper function to get changes between old and new objects
   */
  static getChanges(oldObj, newObj) {
    const changes = {};
    const oldData = oldObj.toJSON ? oldObj.toJSON() : oldObj;
    const newData = newObj.toJSON ? newObj.toJSON() : newObj;
    
    for (const key in newData) {
      if (oldData[key] !== newData[key] && 
          !['updatedAt', 'createdAt', 'password'].includes(key)) {
        changes[key] = {
          old: oldData[key],
          new: newData[key]
        };
      }
    }
    
    return changes;
  }

  /**
   * Get recent activities with pagination
   */
  static async getRecentActivities({ limit = 50, offset = 0, userId = null, entityType = null }) {
    const where = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (entityType) {
      where.entityType = entityType;
    }
    
    const activities = await Activity.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    const total = await Activity.count({ where });
    
    return {
      activities,
      total,
      limit,
      offset
    };
  }
}

module.exports = ActivityService;
