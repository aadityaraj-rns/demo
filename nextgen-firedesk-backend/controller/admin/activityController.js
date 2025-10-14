// controller/admin/activityController.js
const ActivityService = require("../../services/ActivityService");
const Activity = require("../../models/Activity");
const { sequelize } = require("../../database");

const activityController = {
  // GET RECENT ACTIVITIES
  async getRecent(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const entityType = req.query.entityType || null;
      const userId = req.query.userId || null;

      const result = await ActivityService.getRecentActivities({
        limit,
        offset,
        userId,
        entityType
      });
      
      return res.json({ 
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return next(error);
    }
  },

  // GET ALL ACTIVITIES WITH PAGINATION
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const entityType = req.query.entityType || null;
      const userId = req.query.userId || null;

      const result = await ActivityService.getRecentActivities({
        limit,
        offset,
        userId,
        entityType
      });
      
      return res.json({ 
        success: true,
        page,
        limit,
        ...result
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      return next(error);
    }
  },

  // GET ACTIVITY STATS
  async getStats(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats = await Activity.findAll({
        attributes: [
          'entityType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: {
          createdAt: {
            [Op.gte]: today
          }
        },
        group: ['entityType']
      });

      const todayTotal = await Activity.count({
        where: {
          createdAt: {
            [Op.gte]: today
          }
        }
      });

      return res.json({
        success: true,
        todayTotal,
        byEntity: stats
      });
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      return next(error);
    }
  }
};

module.exports = activityController;

