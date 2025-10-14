const ActivityService = require('../services/ActivityService');

/**
 * Middleware to automatically log activities for all CRUD operations
 * Add this after successful operations in controllers
 */

// Helper function to extract entity from response
const extractEntity = (data, entityType) => {
  const lowerType = entityType.toLowerCase();
  
  // Try different common response patterns
  const possibleKeys = [
    lowerType,                    // e.g., 'state'
    `new${entityType}`,           // e.g., 'newState'
    `updated${entityType}`,       // e.g., 'updatedState'
    entityType,                   // e.g., 'State'
    `new${lowerType}`,           // e.g., 'newstate'
    `updated${lowerType}`,       // e.g., 'updatedstate'
    'data',
    'result'
  ];
  
  for (const key of possibleKeys) {
    if (data[key]) return data[key];
  }
  
  // If no match, return data itself (might be the entity)
  return data;
};

// Helper function to extract entity name
const extractEntityName = (entity, entityType) => {
  if (!entity) return 'Unknown';
  
  const lowerType = entityType.toLowerCase();
  
  // Try different common name patterns
  const possibleNameKeys = [
    'name',
    `${lowerType}Name`,           // e.g., 'stateName'
    `${entityType}Name`,          // e.g., 'StateName'
    'title',
    'email',
    'userName',
    'plantName',
    'categoryName',
    'productName',
    'industryName',
    'cityName',
    'formName',
    'serviceName',
    `${lowerType}Id`,
    'id'
  ];
  
  for (const key of possibleNameKeys) {
    if (entity[key]) return entity[key];
  }
  
  return 'Unknown';
};

const activityLogger = {
  /**
   * Log entity creation
   */
  logCreate(entityType) {
    return async (req, res, next) => {
      // Store original json method
      const originalJson = res.json.bind(res);
      
      res.json = function(data) {
        // Only log if operation was successful
        if (data.success !== false && res.statusCode < 400) {
          try {
            // Extract entity data
            const entity = extractEntity(data, entityType);
            const entityName = extractEntityName(entity, entityType);
            
            ActivityService.log({
              action: 'created',
              entityType: entityType.toLowerCase(),
              entityId: entity.id,
              entityName,
              userId: req.user.id,
              userName: req.user.name,
              userType: req.user.roleType || req.user.userType || 'admin',
              description: `Created ${entityType.toLowerCase()} "${entityName}"`,
              metadata: {
                endpoint: req.originalUrl,
                method: req.method
              }
            }).catch(err => console.error('Activity logging error:', err));
          } catch (err) {
            console.error('Error extracting entity for logging:', err);
          }
        }
        
        return originalJson(data);
      };
      
      next();
    };
  },

  /**
   * Log entity update
   */
  logUpdate(entityType) {
    return async (req, res, next) => {
      const originalJson = res.json.bind(res);
      
      res.json = function(data) {
        if (data.success !== false && res.statusCode < 400) {
          try {
            const entity = extractEntity(data, entityType);
            const entityName = extractEntityName(entity, entityType);
            
            ActivityService.log({
              action: 'updated',
              entityType: entityType.toLowerCase(),
              entityId: entity.id || req.params.id || req.body.id,
              entityName,
              userId: req.user.id,
              userName: req.user.name,
              userType: req.user.roleType || req.user.userType || 'admin',
              description: `Updated ${entityType.toLowerCase()} "${entityName}"`,
              changes: req.body,
              metadata: {
                endpoint: req.originalUrl,
                method: req.method
              }
            }).catch(err => console.error('Activity logging error:', err));
          } catch (err) {
            console.error('Error extracting entity for logging:', err);
          }
        }
        
        return originalJson(data);
      };
      
      next();
    };
  },

  /**
   * Log entity deletion
   */
  logDelete(entityType) {
    return async (req, res, next) => {
      const originalJson = res.json.bind(res);
      
      res.json = function(data) {
        if (data.success !== false && res.statusCode < 400) {
          try {
            const entityId = req.params.id || req.body.id;
            const entityName = entityId; // For delete, we only have the ID
            
            ActivityService.log({
              action: 'deleted',
              entityType: entityType.toLowerCase(),
              entityId,
              entityName,
              userId: req.user.id,
              userName: req.user.name,
              userType: req.user.roleType || req.user.userType || 'admin',
              description: `Deleted ${entityType.toLowerCase()} with ID "${entityId}"`,
              metadata: {
                endpoint: req.originalUrl,
                method: req.method
              }
            }).catch(err => console.error('Activity logging error:', err));
          } catch (err) {
            console.error('Error extracting entity for logging:', err);
          }
        }
        
        return originalJson(data);
      };
      
      next();
    };
  }
};

module.exports = activityLogger;
