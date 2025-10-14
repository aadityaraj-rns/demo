const Role = require("../models/Role"); // Remove the destructuring

const createDefaultRoles = async () => {
  try {
    console.log('Creating default roles...');
    
    const roles = [
      {
        name: 'Admin',
        description: 'Full system access with all permissions',
        permissions: {
          manageUsers: true,
          manageRoles: true,
          managePlants: true,
          manageManagers: true,
          manageTechnicians: true,
          viewDashboard: true,
          viewPlants: true,
          assignTechnicians: true,
          viewReports: true,
          viewAssignedJobs: true,
          updateTaskStatus: true,
        },
        isDefault: true
      },
      {
        name: 'Manager',
        description: 'Plant and team management',
        permissions: {
          manageUsers: false,
          manageRoles: false,
          managePlants: true,
          manageManagers: false,
          manageTechnicians: true,
          viewDashboard: true,
          viewPlants: true,
          assignTechnicians: true,
          viewReports: true,
          viewAssignedJobs: true,
          updateTaskStatus: false,
        },
        isDefault: true
      },
      {
        name: 'Technician',
        description: 'Field operations and task execution',
        permissions: {
          manageUsers: false,
          manageRoles: false,
          managePlants: false,
          manageManagers: false,
          manageTechnicians: false,
          viewDashboard: true,
          viewPlants: false,
          assignTechnicians: false,
          viewReports: false,
          viewAssignedJobs: true,
          updateTaskStatus: true,
        },
        isDefault: true
      }
    ];

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ where: { name: roleData.name } });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`Created role: ${roleData.name}`);
      } else {
        console.log(`Role already exists: ${roleData.name}`);
      }
    }

    console.log('Default roles setup completed!');
    return true;
  } catch (error) {
    console.error('Error creating default roles:', error);
    throw error;
  }
};

module.exports = createDefaultRoles;