// migrations/YYYYMMDDHHMMSS-normalize-plant-structure.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create Vendors table
    await queryInterface.createTable('vendors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      vendorName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // 2. Create EdgeDevices table
    await queryInterface.createTable('edge_devices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      deviceName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deviceCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // 3. Create Buildings table
    await queryInterface.createTable('buildings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      buildingName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buildingHeight: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true,
      },
      totalArea: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      totalBuildUpArea: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 4. Create Floors table
    await queryInterface.createTable('floors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      buildingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'buildings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      floorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      floorArea: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 5. Create Wings table
    await queryInterface.createTable('wings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      floorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'floors',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      wingName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wingArea: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 6. Create PlantManagers junction table
    await queryInterface.createTable('plant_managers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      managerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'managers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });

    // Add unique constraint to prevent duplicate plant-manager pairs
    await queryInterface.addIndex('plant_managers', ['plantId', 'managerId'], {
      unique: true,
      name: 'plant_managers_unique_idx',
    });

    // 7. Create Entrances table
    await queryInterface.createTable('entrances', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      entranceName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      width: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
    });

    // 8. Create DieselGenerators table
    await queryInterface.createTable('diesel_generators', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });

    // 9. Create Staircases table
    await queryInterface.createTable('staircases', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      buildingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'buildings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      width: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      fireRating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pressurization: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      emergencyLighting: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      location: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    // 10. Create Lifts table
    await queryInterface.createTable('lifts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      buildingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'buildings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });

    // 11. Create FireSafetyForms table
    await queryInterface.createTable('fire_safety_forms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      primeOverTankCapacity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      terraceTankCapacity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      dieselTank1Capacity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      dieselTank2Capacity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      headerPressureBar: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      systemCommissionDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      amcVendorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'vendors',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      amcStartDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      amcEndDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      numFireExtinguishers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      numHydrantPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      numSprinklers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      numSafeAssemblyAreas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      dieselEngine: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      electricalPump: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      jockeyPump: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // 12. Create ComplianceFireSafety table
    await queryInterface.createTable('compliance_fire_safety', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      fireNocNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nocValidityDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      insurancePolicyNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      insurerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numFireExtinguishers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      numHydrantPoints: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      numSprinklers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      numSafeAssemblyAreas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      documentUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 13. Create MonitoringForms table
    await queryInterface.createTable('monitoring_forms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      buildingId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'buildings',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      floorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'floors',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 14. Create MonitoringDevices junction table
    await queryInterface.createTable('monitoring_devices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      monitoringFormId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'monitoring_forms',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      edgeDeviceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'edge_devices',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });

    // 15. Create Layouts table
    await queryInterface.createTable('layouts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      plantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      buildingId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'buildings',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      floorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'floors',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      wingId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'wings',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      layoutType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      layoutUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    // 16. Rename columns in plants table
    await queryInterface.renameColumn('plants', 'address', 'addressLine1');
    await queryInterface.renameColumn('plants', 'address2', 'addressLine2');
    await queryInterface.renameColumn('plants', 'mainBuildings', 'numMainBuildings');
    await queryInterface.renameColumn('plants', 'subBuildings', 'numSubBuildings');

    // 17. Add indexes for better query performance
    await queryInterface.addIndex('buildings', ['plantId']);
    await queryInterface.addIndex('floors', ['buildingId']);
    await queryInterface.addIndex('wings', ['floorId']);
    await queryInterface.addIndex('entrances', ['plantId']);
    await queryInterface.addIndex('diesel_generators', ['plantId']);
    await queryInterface.addIndex('staircases', ['buildingId']);
    await queryInterface.addIndex('lifts', ['buildingId']);
    await queryInterface.addIndex('fire_safety_forms', ['plantId']);
    await queryInterface.addIndex('compliance_fire_safety', ['plantId']);
    await queryInterface.addIndex('monitoring_forms', ['plantId']);
    await queryInterface.addIndex('layouts', ['plantId']);

    console.log('✅ Plant normalization migration completed successfully');
  },

  down: async (queryInterface, Sequelize) => {
    // Drop all created tables in reverse order
    await queryInterface.dropTable('layouts');
    await queryInterface.dropTable('monitoring_devices');
    await queryInterface.dropTable('monitoring_forms');
    await queryInterface.dropTable('compliance_fire_safety');
    await queryInterface.dropTable('fire_safety_forms');
    await queryInterface.dropTable('lifts');
    await queryInterface.dropTable('staircases');
    await queryInterface.dropTable('diesel_generators');
    await queryInterface.dropTable('entrances');
    await queryInterface.dropTable('plant_managers');
    await queryInterface.dropTable('wings');
    await queryInterface.dropTable('floors');
    await queryInterface.dropTable('buildings');
    await queryInterface.dropTable('edge_devices');
    await queryInterface.dropTable('vendors');

    // Rename columns back
    await queryInterface.renameColumn('plants', 'addressLine1', 'address');
    await queryInterface.renameColumn('plants', 'addressLine2', 'address2');
    await queryInterface.renameColumn('plants', 'numMainBuildings', 'mainBuildings');
    await queryInterface.renameColumn('plants', 'numSubBuildings', 'subBuildings');

    console.log('✅ Plant normalization migration rolled back');
  }
};
