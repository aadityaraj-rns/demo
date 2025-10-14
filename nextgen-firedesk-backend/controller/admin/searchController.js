const { Op } = require('sequelize');
const { 
  Industry, 
  State, 
  City, 
  Category, 
  Product, 
  Plant, 
  Manager, 
  User,
  Role,
  Form,
  Asset
} = require('../../models/index');
const { Technician } = require('../../models/index');

const searchController = {
  /**
   * Global search across all entities
   * Searches: Industries, States, Cities, Categories, Products, Plants, Managers, Technicians, Users, Roles, Service Forms, Assets
   */
  async globalSearch(req, res, next) {
    try {
      const { query, limit = 10 } = req.query;

      if (!query || query.trim().length < 2) {
        return res.json({ results: [] });
      }

      const searchTerm = query.trim().toLowerCase();
      const searchPattern = `%${searchTerm}%`;
      const results = [];

      // Search Industries
      try {
        const industries = await Industry.findAll({
          where: {
            industryName: {
              [Op.iLike]: searchPattern
            }
          },
          limit: 3,
          attributes: ['id', 'industryName', 'status']
        });

        industries.forEach(item => {
          results.push({
            id: item.id,
            type: 'Industry',
            name: item.industryName,
            description: `Status: ${item.status}`,
            path: '/admin/industries'
          });
        });
      } catch (err) {
        console.error('Industry search error:', err);
      }

      // Search States
      try {
        const states = await State.findAll({
          where: {
            stateName: {
              [Op.iLike]: searchPattern
            }
          },
          limit: 3,
          attributes: ['id', 'stateName', 'status']
        });

        states.forEach(item => {
          results.push({
            id: item.id,
            type: 'State',
            name: item.stateName,
            description: `Status: ${item.status}`,
            path: '/admin/states'
          });
        });
      } catch (err) {
        console.error('State search error:', err);
      }

      // Search Cities
      try {
        const cities = await City.findAll({
          where: {
            cityName: {
              [Op.iLike]: searchPattern
            }
          },
          limit: 3,
          attributes: ['id', 'cityName', 'status'],
          include: [{
            model: State,
            as: 'state',
            attributes: ['stateName']
          }]
        });

        cities.forEach(item => {
          results.push({
            id: item.id,
            type: 'City',
            name: item.cityName,
            description: item.state?.stateName || '',
            path: '/admin/cities'
          });
        });
      } catch (err) {
        console.error('City search error:', err);
      }

      // Search Categories
      try {
        const categories = await Category.findAll({
          where: {
            categoryName: {
              [Op.iLike]: searchPattern
            }
          },
          limit: 3,
          attributes: ['id', 'categoryName', 'status']
        });

        categories.forEach(item => {
          results.push({
            id: item.id,
            type: 'Category',
            name: item.categoryName,
            description: `Status: ${item.status}`,
            path: '/admin/categories'
          });
        });
      } catch (err) {
        console.error('Category search error:', err);
      }

      // Search Products
      try {
        const products = await Product.findAll({
          where: {
            productName: { [Op.iLike]: searchPattern }
          },
          limit: 3,
          attributes: ['id', 'productName', 'status']
        });

        products.forEach(item => {
          results.push({
            id: item.id,
            type: 'Product',
            name: item.productName,
            description: `Product`,
            path: '/admin/products'
          });
        });
      } catch (err) {
        console.error('Product search error:', err);
      }

      // Search Plants
      try {
        const plants = await Plant.findAll({
          where: {
            [Op.or]: [
              { plantName: { [Op.iLike]: searchPattern } },
              { plantId: { [Op.iLike]: searchPattern } },
              { address: { [Op.iLike]: searchPattern } }
            ]
          },
          limit: 3,
          attributes: ['id', 'plantName', 'plantId', 'address', 'status']
        });

        plants.forEach(item => {
          results.push({
            id: item.id,
            type: 'Plant',
            name: item.plantName,
            description: `${item.plantId || ''} - ${item.address || ''}`.trim(),
            path: '/admin/plants'
          });
        });
      } catch (err) {
        console.error('Plant search error:', err);
      }

      // Search Managers
      try {
        const managers = await Manager.findAll({
          where: {
            [Op.or]: [
              { managerId: { [Op.iLike]: searchPattern } }
            ]
          },
          limit: 3,
          attributes: ['id', 'managerId', 'userId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['name', 'email']
          }]
        });

        managers.forEach(item => {
          results.push({
            id: item.id,
            type: 'Manager',
            name: item.user?.name || item.managerId,
            description: item.user?.email || '',
            path: '/admin/managers'
          });
        });
      } catch (err) {
        console.error('Manager search error:', err);
      }

      // Search Technicians
      try {
        const technicians = await Technician.findAll({
          where: {
            technicianId: { [Op.iLike]: searchPattern }
          },
          limit: 3,
          attributes: ['id', 'technicianId', 'status'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['name', 'email']
          }]
        });

        technicians.forEach(item => {
          results.push({
            id: item.id,
            type: 'Technician',
            name: item.user?.name || item.technicianId,
            description: `${item.technicianId} - ${item.user?.email || ''}`,
            path: '/admin/technicians'
          });
        });
      } catch (err) {
        console.error('Technician search error:', err);
      }

      // Search Users (all types)
      try {
        const users = await User.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.iLike]: searchPattern } },
              { email: { [Op.iLike]: searchPattern } },
              { loginID: { [Op.iLike]: searchPattern } }
            ]
          },
          limit: 3,
          attributes: ['id', 'name', 'email', 'userType', 'loginID']
        });

        users.forEach(item => {
          results.push({
            id: item.id,
            type: 'User',
            name: item.name,
            description: `${item.email} (${item.userType})`,
            path: '/admin/users'
          });
        });
      } catch (err) {
        console.error('User search error:', err);
      }

      // Search Roles
      try {
        const roles = await Role.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.iLike]: searchPattern } },
              { description: { [Op.iLike]: searchPattern } }
            ]
          },
          limit: 3,
          attributes: ['id', 'name', 'description', 'isDefault']
        });

        roles.forEach(item => {
          results.push({
            id: item.id,
            type: 'Role',
            name: item.name,
            description: item.description || (item.isDefault ? 'Default Role' : ''),
            path: '/admin/roles'
          });
        });
      } catch (err) {
        console.error('Role search error:', err);
      }

      // Search Service Forms
      try {
        const forms = await Form.findAll({
          where: {
            serviceName: { [Op.iLike]: searchPattern }
          },
          limit: 3,
          attributes: ['id', 'serviceName', 'status']
        });

        forms.forEach(item => {
          results.push({
            id: item.id,
            type: 'Service Form',
            name: item.serviceName,
            description: `Status: ${item.status}`,
            path: '/admin/service-forms'
          });
        });
      } catch (err) {
        console.error('Service Form search error:', err);
      }

      // Search Assets
      try {
        const assets = await Asset.findAll({
          where: {
            [Op.or]: [
              { assetId: { [Op.iLike]: searchPattern } },
              { building: { [Op.iLike]: searchPattern } },
              { location: { [Op.iLike]: searchPattern } },
              { type: { [Op.iLike]: searchPattern } },
              { subType: { [Op.iLike]: searchPattern } }
            ]
          },
          limit: 3,
          attributes: ['id', 'assetId', 'building', 'location', 'healthStatus'],
          include: [
            {
              model: Plant,
              as: 'plant',
              attributes: ['plantName']
            },
            {
              model: Category,
              as: 'category',
              attributes: ['categoryName']
            }
          ]
        });

        assets.forEach(item => {
          results.push({
            id: item.id,
            type: 'Asset',
            name: item.assetId || 'Asset',
            description: `${item.category?.categoryName || ''} - ${item.plant?.plantName || ''} - ${item.location}`,
            path: '/admin/assets'
          });
        });
      } catch (err) {
        console.error('Asset search error:', err);
      }

      // Limit total results
      const limitedResults = results.slice(0, parseInt(limit));

      return res.json({
        success: true,
        results: limitedResults,
        total: results.length
      });
    } catch (error) {
      console.error('Global search error:', error);
      return res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error.message
      });
    }
  }
};

module.exports = searchController;
