# Plant Model Normalization - Migration Guide

## Overview
The Plant model has been normalized according to the provided database schema. The denormalized JSONB fields have been replaced with proper relational tables following database normalization principles.

## Changes Summary

### 1. New Database Tables Created

#### Plant Structure Tables
- **buildings** - Stores building information for each plant
- **floors** - Stores floor information for each building
- **wings** - Stores wing/section information for each floor

#### Plant Relations
- **plant_managers** - Junction table for many-to-many relationship between plants and managers

#### Plant Facilities
- **entrances** - Plant entrance details
- **diesel_generators** - Diesel generator information
- **staircases** - Staircase details for buildings
- **lifts** - Lift/elevator details for buildings

#### Fire Safety & Compliance
- **fire_safety_forms** - Fire safety equipment and system information
- **compliance_fire_safety** - Fire safety compliance and certification records

#### Monitoring
- **monitoring_forms** - Monitoring device installation records
- **monitoring_devices** - Junction table linking monitoring forms to edge devices

#### Layouts
- **layouts** - Layout file uploads for plants, buildings, floors, and wings

#### Master Data
- **vendors** - AMC vendor information
- **edge_devices** - IoT edge device catalog

### 2. Plant Model Changes

#### Removed Fields (moved to separate tables):
- `buildings` (JSONB) → `buildings` table
- `entrances` (JSONB) → `entrances` table
- `dgAvailable`, `dgQuantity` → `diesel_generators` table
- `staircaseAvailable`, `staircaseQuantity`, etc. → `staircases` table
- `liftAvailable`, `liftQuantity` → `lifts` table
- Fire safety fields → `fire_safety_forms` table
- Compliance fields → `compliance_fire_safety` table
- Monitoring fields → `monitoring_forms` and `monitoring_devices` tables
- `layouts`, `layoutFiles` (JSONB) → `layouts` table
- `managerId` → `plant_managers` junction table (many-to-many)

#### Renamed Fields:
- `address` → `addressLine1`
- `address2` → `addressLine2`
- `mainBuildings` → `numMainBuildings`
- `subBuildings` → `numSubBuildings`

#### Retained Fields:
- Basic plant information (name, addresses, city, state, zipCode, gstNo)
- `industryId` reference
- `totalPlantArea`, `totalBuildUpArea`
- `status`
- `orgUserId` (marked as deprecated for backward compatibility)

### 3. New Model Files Created

```
models/
├── organization/
│   └── plant/
│       ├── Plant.js (updated)
│       ├── Building.js (new)
│       ├── Floor.js (new)
│       ├── Wing.js (new)
│       ├── PlantManager.js (new)
│       ├── Entrance.js (new)
│       ├── DieselGenerator.js (new)
│       ├── Staircase.js (new)
│       ├── Lift.js (new)
│       ├── FireSafetyForm.js (new)
│       ├── ComplianceFireSafety.js (new)
│       ├── MonitoringForm.js (new)
│       ├── MonitoringDevice.js (new)
│       └── Layout.js (new)
└── admin/
    └── masterData/
        ├── Vendor.js (new)
        └── EdgeDevice.js (new)
```

### 4. New Controller Files Created

```
controller/organization/plant/
├── plantController.js (existing - needs migration)
├── normalizedPlantController.js (new - normalized version)
├── fireSafetyController.js (new)
└── complianceController.js (new)
```

### 5. Model Associations

All associations have been defined in `models/index.js`:

- Plant ↔ Manager (many-to-many through PlantManager)
- Plant → Building (one-to-many)
- Building → Floor (one-to-many)
- Floor → Wing (one-to-many)
- Plant → Entrance (one-to-many)
- Plant → DieselGenerator (one-to-many)
- Building → Staircase (one-to-many)
- Building → Lift (one-to-many)
- Plant → FireSafetyForm (one-to-many)
- Plant → ComplianceFireSafety (one-to-many)
- Plant → MonitoringForm (one-to-many)
- Plant → Layout (one-to-many)
- And many more...

## Migration Steps

### Phase 1: Database Migration
1. Create all new tables using Sequelize migrations
2. Migrate existing JSONB data to new tables
3. Update foreign key references
4. Add indexes for performance

### Phase 2: API Migration
1. Update existing endpoints to use new normalized structure
2. Add new endpoints for managing:
   - Buildings, Floors, Wings
   - Fire Safety Forms
   - Compliance Records
   - Monitoring Devices
   - Layouts
3. Maintain backward compatibility during transition

### Phase 3: Testing
1. Test data integrity after migration
2. Test all CRUD operations on new tables
3. Verify cascade deletes work correctly
4. Performance testing with joins

### Phase 4: Frontend Updates
1. Update frontend to work with new API structure
2. Update forms to submit data to new endpoints
3. Update display components to show related data

## Example Usage

### Creating a Plant with Buildings

```javascript
const plantData = {
  plantName: "ABC Manufacturing Plant",
  addressLine1: "123 Industrial Ave",
  addressLine2: "Suite 100",
  cityId: "city-uuid",
  stateId: "state-uuid",
  zipCode: "12345",
  gstNo: "GST123456",
  industryId: "industry-uuid",
  numMainBuildings: 2,
  numSubBuildings: 3,
  totalPlantArea: 50000.00,
  totalBuildUpArea: 35000.00,
  status: "Active",
  managerIds: ["manager-uuid-1", "manager-uuid-2"],
  buildings: [
    {
      buildingName: "Main Building A",
      buildingHeight: 25.5,
      totalArea: 20000.00,
      floors: [
        {
          floorName: "Ground Floor",
          usage: "Manufacturing",
          floorArea: 5000.00,
          wings: [
            {
              wingName: "Wing A1",
              usage: "Assembly",
              wingArea: 2500.00
            }
          ]
        }
      ],
      staircases: [
        {
          available: true,
          quantity: 2,
          type: "enclosed",
          width: 1.5,
          fireRating: 90,
          pressurization: true,
          emergencyLighting: true,
          location: "North and South ends"
        }
      ],
      lifts: [
        {
          available: true,
          quantity: 2
        }
      ]
    }
  ],
  entrances: [
    {
      entranceName: "Main Entrance",
      width: 6.0
    }
  ],
  dieselGenerators: [
    {
      available: true,
      quantity: 2
    }
  ]
};

// POST to normalized plant endpoint
const response = await fetch('/api/plants/normalized', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(plantData)
});
```

### Adding Fire Safety Form

```javascript
const fireSafetyData = {
  plantId: "plant-uuid",
  primeOverTankCapacity: 50.00,
  terraceTankCapacity: 30.00,
  dieselTank1Capacity: 10.00,
  headerPressureBar: 7.5,
  systemCommissionDate: "2024-01-15",
  amcVendorId: "vendor-uuid",
  amcStartDate: "2024-01-01",
  amcEndDate: "2024-12-31",
  numFireExtinguishers: 50,
  numHydrantPoints: 20,
  numSprinklers: 100,
  numSafeAssemblyAreas: 3,
  dieselEngine: 1,
  electricalPump: 2,
  jockeyPump: 1
};

const response = await fetch('/api/plants/fire-safety', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(fireSafetyData)
});
```

## Database Migration Script Template

Create a Sequelize migration file to transform existing data:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create new tables
    await queryInterface.createTable('buildings', { /* ... */ });
    await queryInterface.createTable('floors', { /* ... */ });
    // ... create all new tables
    
    // 2. Migrate JSONB data to new tables
    const plants = await queryInterface.sequelize.query(
      'SELECT id, buildings FROM plants WHERE buildings IS NOT NULL',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    for (const plant of plants) {
      const buildings = plant.buildings;
      // Insert into buildings table
      // Insert into floors table
      // etc.
    }
    
    // 3. Add new columns to plants table
    await queryInterface.renameColumn('plants', 'address', 'addressLine1');
    await queryInterface.renameColumn('plants', 'address2', 'addressLine2');
    
    // 4. Remove old JSONB columns (after data migration)
    // await queryInterface.removeColumn('plants', 'buildings');
    // ... (keep for now for rollback safety)
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback migration
  }
};
```

## Benefits of Normalization

1. **Data Integrity**: Foreign key constraints ensure referential integrity
2. **Query Performance**: Indexed relationships enable efficient queries
3. **Scalability**: Easier to add new fields and relationships
4. **Maintenance**: Changes to structure don't require JSONB schema updates
5. **Reporting**: Standard SQL joins enable complex reports
6. **Atomic Updates**: Update specific entities without touching entire JSONB objects

## Next Steps

1. Review and approve the normalized structure
2. Create Sequelize migration scripts
3. Test migration on development database
4. Update API routes to use new controllers
5. Update frontend to work with new API structure
6. Perform thorough testing
7. Deploy to production with rollback plan

## Backward Compatibility

During the transition period:
- Keep old JSONB fields in Plant model (marked as deprecated)
- Maintain both old and new API endpoints
- Gradually migrate frontend to use new endpoints
- Monitor for issues before removing old structure
