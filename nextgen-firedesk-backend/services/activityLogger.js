// services/activityLogger.js
const { Activity } = require("../models");

const activityLogger = {
  /**
   * Log an activity
   * @param {Object} params - Activity parameters
   * @param {string} params.action - Action performed (created, updated, deleted, etc.)
   * @param {string} params.entityType - Type of entity (technician, plant, user, etc.)
   * @param {string} params.entityId - ID of the entity
   * @param {string} params.entityName - Name of the entity
   * @param {Object} params.user - User object who performed the action
   * @param {string} params.description - Description of the activity
   * @param {Object} params.metadata - Additional metadata
   * @param {string} params.ipAddress - IP address of the request
   */
  async log({
    action,
    entityType,
    entityId = null,
    entityName = null,
    user,
    description = null,
    metadata = null,
    ipAddress = null
  }) {
    try {
      if (!user || !user.id) {
        console.warn('Activity log skipped: No user provided');
        return null;
      }

      const activity = await Activity.create({
        action,
        entityType,
        entityId,
        entityName,
        userId: user.id,
        userName: user.name || 'Unknown',
        userType: user.userType || 'unknown',
        description: description || `${user.name} ${action} ${entityType}${entityName ? ': ' + entityName : ''}`,
        metadata,
        ipAddress,
        orgUserId: user.id, // For admin users, this is their own ID
      });

      return activity;
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw error to avoid breaking the main flow
      return null;
    }
  },

  /**
   * Get recent activities for an organization
   * @param {string} orgUserId - Organization user ID
   * @param {number} limit - Number of activities to fetch
   */
  async getRecentActivities(orgUserId, limit = 10) {
    try {
      const activities = await Activity.findAll({
        where: { orgUserId },
        order: [['createdAt', 'DESC']],
        limit,
        attributes: [
          'id',
          'action',
          'entityType',
          'entityName',
          'userName',
          'userType',
          'description',
          'createdAt'
        ]
      });

      return activities;
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return [];
    }
  },

  /**
   * Get all activities with pagination
   * @param {string} orgUserId - Organization user ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  async getActivities(orgUserId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Activity.findAndCountAll({
        where: { orgUserId },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return {
        activities: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return {
        activities: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }
  },

  /**
   * Helper to get action description
   */
  getActionBadgeType(action) {
    const actionMap = {
      created: 'success',
      updated: 'info',
      deleted: 'destructive',
      login: 'default',
      logout: 'secondary',
    };
    return actionMap[action.toLowerCase()] || 'default';
  },
};

module.exports = activityLogger;
