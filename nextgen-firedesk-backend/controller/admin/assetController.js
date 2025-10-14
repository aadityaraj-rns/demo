const Joi = require("joi");
const path = require('path');
const XLSX = require('xlsx');
const QrCodeService = require('../../services/QrCodeService');

let models;
try {
    models = require("../../models");
    console.log('Models loaded from ../../models');
} catch (error) {
    console.error('Model loading failed:', error.message);
    throw new Error('Cannot load models');
}

const { Asset, Plant, Category, Product, User, GroupService } = models;

const assetController = {
  /**
   * Get all assets with optional filtering
   */
  async getAll(req, res, next) {
    try {
      console.log('GET /asset called by user:', req.user.id, req.user.userType);
      
      const { plantId, categoryId, productId, status, healthStatus } = req.query;
      
      let whereCondition = {};
      
      // Apply filters if provided
      if (plantId) whereCondition.plantId = plantId;
      if (categoryId) whereCondition.productCategoryId = categoryId;
      if (productId) whereCondition.productId = productId;
      if (status) whereCondition.status = status;
      if (healthStatus) whereCondition.healthStatus = healthStatus;

      const assets = await Asset.findAll({
        where: whereCondition,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Plant,
            as: 'plant',
            attributes: ['id', 'plantName', 'address']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'categoryName']
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'productName']
          }
        ]
      });

      console.log('Found assets:', assets.length);

      return res.status(200).json({ 
        success: true,
        assets,
        total: assets.length
      });
    } catch (error) {
      console.error('Get assets error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch assets',
        error: error.message 
      });
    }
  },

  /**
   * Get single asset by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const asset = await Asset.findByPk(id, {
        include: [
          {
            model: Plant,
            as: 'plant',
            attributes: ['id', 'plantName', 'address', 'cityId']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'categoryName']
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'productName']
          },
          {
            model: User,
            as: 'organization',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
      }

      return res.status(200).json({
        success: true,
        asset
      });
    } catch (error) {
      console.error('Get asset by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch asset',
        error: error.message
      });
    }
  },

  /**
   * Create new asset
   */
  async create(req, res, next) {
    try {
      const schema = Joi.object({
        plantId: Joi.string().uuid().required(),
        building: Joi.string().required(),
        productCategoryId: Joi.string().uuid().required(),
        productId: Joi.string().uuid().required(),
        type: Joi.string().allow('', null),
        subType: Joi.string().allow('', null),
        capacity: Joi.number().required(),
        capacityUnit: Joi.string().allow('', null),
        location: Joi.string().required(),
        model: Joi.string().allow('', null),
        slNo: Joi.string().allow('', null),
        pressureRating: Joi.string().allow('', null),
        pressureUnit: Joi.string().valid('Kg/Cm2', 'PSI', 'MWC', 'Bar', '').allow('', null),
        moc: Joi.string().allow('', null),
        approval: Joi.string().allow('', null),
        fireClass: Joi.string().allow('', null),
        manufacturingDate: Joi.date().required(),
        installDate: Joi.date().required(),
        suctionSize: Joi.string().allow('', null),
        head: Joi.string().allow('', null),
        rpm: Joi.string().allow('', null),
        mocOfImpeller: Joi.string().allow('', null),
        fuelCapacity: Joi.string().allow('', null),
        flowInLpm: Joi.string().allow('', null),
        housePower: Joi.string().allow('', null),
        healthStatus: Joi.string().valid('NotWorking', 'AttentionRequired', 'Healthy').default('Healthy'),
        tag: Joi.string().allow('', null),
        status: Joi.string().valid('Warranty', 'AMC', 'In-House', 'Deactive').required(),
        manufacturerName: Joi.string().allow('', null),
        document1: Joi.string().allow('', null),
        document2: Joi.string().allow('', null),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      // Add orgUserId from authenticated user
      value.orgUserId = req.user.id;

      // Generate unique asset ID
      const plant = await Plant.findByPk(value.plantId);
      const category = await Category.findByPk(value.productCategoryId);
      
      if (!plant || !category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid plant or category'
        });
      }

      // Generate asset ID (e.g., "LE-EXT-0017")
      const categoryPrefix = category.categoryName.substring(0, 3).toUpperCase();
      const count = await Asset.count({ where: { productCategoryId: value.productCategoryId } });
      value.assetId = `${plant.plantName.substring(0, 2).toUpperCase()}-${categoryPrefix}-${String(count + 1).padStart(4, '0')}`;

      // Create asset
      const asset = await Asset.create(value);

      // Generate QR code
      try {
        const qrCodeUrl = await QrCodeService.generateAssetQRCode(asset);
        await asset.update({ qrCodeUrl });
      } catch (qrError) {
        console.error('QR code generation error:', qrError);
        // Continue even if QR code generation fails
      }

      // Fetch complete asset with associations
      const createdAsset = await Asset.findByPk(asset.id, {
        include: [
          {
            model: Plant,
            as: 'plant',
            attributes: ['id', 'plantName', 'address']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'categoryName']
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'productName']
          }
        ]
      });

      return res.status(201).json({
        success: true,
        message: 'Asset created successfully',
        asset: createdAsset
      });
    } catch (error) {
      console.error('Create asset error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create asset',
        error: error.message
      });
    }
  },

  /**
   * Update existing asset
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;

      const asset = await Asset.findByPk(id);
      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
      }

      const schema = Joi.object({
        plantId: Joi.string().uuid(),
        productCategoryId: Joi.string().uuid(),
        productId: Joi.string().uuid(),
        building: Joi.string(),
        type: Joi.string().allow('', null),
        subType: Joi.string().allow('', null),
        capacity: Joi.number(),
        capacityUnit: Joi.string().allow('', null),
        location: Joi.string(),
        model: Joi.string().allow('', null),
        slNo: Joi.string().allow('', null),
        pressureRating: Joi.string().allow('', null),
        pressureUnit: Joi.string().valid('Kg/Cm2', 'PSI', 'MWC', 'Bar', '').allow('', null),
        moc: Joi.string().allow('', null),
        approval: Joi.string().allow('', null),
        fireClass: Joi.string().allow('', null),
        manufacturingDate: Joi.date(),
        installDate: Joi.date(),
        suctionSize: Joi.string().allow('', null),
        head: Joi.string().allow('', null),
        rpm: Joi.string().allow('', null),
        mocOfImpeller: Joi.string().allow('', null),
        fuelCapacity: Joi.string().allow('', null),
        flowInLpm: Joi.string().allow('', null),
        housePower: Joi.string().allow('', null),
        healthStatus: Joi.string().valid('NotWorking', 'AttentionRequired', 'Healthy'),
        tag: Joi.string().allow('', null),
        status: Joi.string().valid('Warranty', 'AMC', 'In-House', 'Deactive'),
        manufacturerName: Joi.string().allow('', null),
        document1: Joi.string().allow('', null),
        document2: Joi.string().allow('', null),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      await asset.update(value);

      // Fetch updated asset with associations
      const updatedAsset = await Asset.findByPk(id, {
        include: [
          {
            model: Plant,
            as: 'plant',
            attributes: ['id', 'plantName', 'address']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'categoryName']
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'productName']
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Asset updated successfully',
        asset: updatedAsset
      });
    } catch (error) {
      console.error('Update asset error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update asset',
        error: error.message
      });
    }
  },

  /**
   * Delete asset
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const asset = await Asset.findByPk(id);
      if (!asset) {
        return res.status(404).json({
          success: false,
          message: 'Asset not found'
        });
      }

      await asset.destroy();

      return res.status(200).json({
        success: true,
        message: 'Asset deleted successfully'
      });
    } catch (error) {
      console.error('Delete asset error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete asset',
        error: error.message
      });
    }
  },

  /**
   * Bulk upload assets from Excel file
   */
  async bulkUpload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { plantId, productCategoryId, productId } = req.body;

      if (!plantId || !productCategoryId || !productId) {
        return res.status(400).json({
          success: false,
          message: 'Plant, category, and product are required'
        });
      }

      // Read Excel file
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Excel file is empty'
        });
      }

      const createdAssets = [];
      const errors = [];

      // Get plant and category for asset ID generation
      const plant = await Plant.findByPk(plantId);
      const category = await Category.findByPk(productCategoryId);
      
      let assetCount = await Asset.count({ where: { productCategoryId } });

      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i];
          
          // Generate asset ID
          const categoryPrefix = category.categoryName.substring(0, 3).toUpperCase();
          assetCount++;
          const assetId = `${plant.plantName.substring(0, 2).toUpperCase()}-${categoryPrefix}-${String(assetCount).padStart(4, '0')}`;

          const assetData = {
            assetId,
            plantId,
            productCategoryId,
            productId,
            orgUserId: req.user.id,
            building: row.building || '',
            type: row.type || '',
            subType: row.subType || '',
            capacity: parseFloat(row.capacity) || 0,
            capacityUnit: row.capacityUnit || '',
            location: row.location || '',
            model: row.model || '',
            slNo: row.slNo || '',
            pressureRating: row.pressureRating || '',
            pressureUnit: row.pressureUnit || '',
            moc: row.moc || '',
            approval: row.approval || '',
            fireClass: row.fireClass || '',
            manufacturingDate: row.manufacturingDate ? new Date(row.manufacturingDate) : new Date(),
            installDate: row.installDate ? new Date(row.installDate) : new Date(),
            suctionSize: row.suctionSize || '',
            head: row.head || '',
            rpm: row.rpm || '',
            mocOfImpeller: row.mocOfImpeller || '',
            fuelCapacity: row.fuelCapacity || '',
            flowInLpm: row.flowInLpm || '',
            housePower: row.housePower || '',
            healthStatus: row.healthStatus || 'Healthy',
            tag: row.tag || '',
            status: row.status || 'Active',
            manufacturerName: row.manufacturerName || '',
          };

          const asset = await Asset.create(assetData);
          
          // Generate QR code
          try {
            const qrCodeUrl = await QrCodeService.generateAssetQRCode(asset);
            await asset.update({ qrCodeUrl });
          } catch (qrError) {
            console.error('QR code generation error for asset:', asset.id, qrError);
          }

          createdAssets.push(asset);
        } catch (rowError) {
          errors.push({
            row: i + 1,
            error: rowError.message
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: `Bulk upload completed. ${createdAssets.length} assets created.`,
        createdCount: createdAssets.length,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Bulk upload failed',
        error: error.message
      });
    }
  }
};

module.exports = assetController;
