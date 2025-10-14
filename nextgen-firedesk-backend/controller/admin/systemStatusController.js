// controller/admin/systemStatusController.js
const { sequelize } = require("../../database/index");
const { Activity } = require("../../models/index");

const systemStatusController = {
  async getStatus(req, res, next) {
    try {
      const status = {
        system: {
          status: 'operational',
          message: 'All systems running normally',
          lastChecked: new Date().toISOString()
        },
        database: {
          status: 'operational',
          message: 'Database connection stable',
          lastChecked: new Date().toISOString()
        },
        api: {
          status: 'operational',
          message: 'All endpoints responding',
          lastChecked: new Date().toISOString()
        }
      };

      // Check database connection
      try {
        await sequelize.authenticate();
        status.database.status = 'operational';
        status.database.message = 'Database connection stable';
      } catch (error) {
        status.database.status = 'error';
        status.database.message = 'Database connection failed';
        status.system.status = 'degraded';
        status.system.message = 'System running with degraded performance';
      }

      // Check if we can query the database
      try {
        await Activity.findOne({ limit: 1 });
        status.api.status = 'operational';
        status.api.message = 'All endpoints responding';
      } catch (error) {
        status.api.status = 'warning';
        status.api.message = 'Some endpoints may be slow';
        if (status.system.status !== 'error') {
          status.system.status = 'degraded';
          status.system.message = 'System running with degraded performance';
        }
      }

      // Overall system status
      if (status.database.status === 'error' || status.api.status === 'error') {
        status.system.status = 'error';
        status.system.message = 'System experiencing errors';
      } else if (status.database.status === 'warning' || status.api.status === 'warning') {
        status.system.status = 'warning';
        status.system.message = 'System running with warnings';
      } else {
        status.system.status = 'operational';
        status.system.message = 'All systems running normally';
      }

      return res.json({ 
        success: true,
        status 
      });
    } catch (error) {
      console.error('System status check error:', error);
      return res.json({
        success: false,
        status: {
          system: {
            status: 'error',
            message: 'Unable to check system status',
            lastChecked: new Date().toISOString()
          },
          database: {
            status: 'unknown',
            message: 'Status check failed',
            lastChecked: new Date().toISOString()
          },
          api: {
            status: 'unknown',
            message: 'Status check failed',
            lastChecked: new Date().toISOString()
          }
        }
      });
    }
  }
};

module.exports = systemStatusController;
