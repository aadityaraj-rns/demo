# Plant Database Schema - Entity Relationship Diagram

## Core Plant Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         PLANT HIERARCHY                          │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │  plants  │
                    └────┬─────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼─────┐   ┌────▼────┐   ┌─────▼──────┐
    │buildings │   │entrances│   │diesel_gens │
    └────┬─────┘   └─────────┘   └────────────┘
         │
    ┌────▼─────┐
    │  floors  │
    └────┬─────┘
         │
    ┌────▼────┐
    │  wings  │
    └─────────┘
```

## Building Facilities

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUILDING FACILITIES                           │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │buildings │
    └────┬─────┘
         │
    ┌────┴───────┐
    │            │
┌───▼───┐   ┌───▼──┐
│stairs │   │lifts │
│cases  │   │      │
└───────┘   └──────┘
```

## Plant-Manager Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                   MANY-TO-MANY RELATIONSHIP                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────┐         ┌──────────────┐         ┌──────────┐
│ plants  │◄───────►│plant_managers│◄───────►│ managers │
└─────────┘         └──────────────┘         └──────────┘
   1..*                 junction                  1..*
```

## Fire Safety & Compliance

```
┌─────────────────────────────────────────────────────────────────┐
│              FIRE SAFETY & COMPLIANCE FORMS                      │
└─────────────────────────────────────────────────────────────────┘

         ┌──────────┐
         │  plants  │
         └────┬─────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────────────┐  ┌──▼────────────────┐
│fire_safety_    │  │compliance_fire_   │
│forms           │  │safety             │
└───┬────────────┘  └───────────────────┘
    │
    │ amcVendorId
    ▼
┌─────────┐
│ vendors │
└─────────┘
```

## Monitoring System

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING SYSTEM                             │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  plants  │
    └────┬─────┘
         │
    ┌────▼───────────┐
    │monitoring_forms│
    └────┬───────────┘
         │
         │
    ┌────▼────────────┐      ┌──────────────┐
    │monitoring_      │─────►│edge_devices  │
    │devices          │      └──────────────┘
    └─────────────────┘
      (junction table)
```

## Layouts

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYOUT UPLOADS                                │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │  plants  │
                    └────┬─────┘
                         │
                    ┌────▼────┐
                    │ layouts │◄─── buildingId (optional)
                    └────┬────┘◄─── floorId (optional)
                         │      ◄─── wingId (optional)
                         │
                    (Hierarchical)
```

## Complete Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATABASE SCHEMA                      │
└─────────────────────────────────────────────────────────────────┘

MASTER DATA
├── states
├── cities
├── industries
├── vendors
├── edge_devices
└── managers

PLANT CORE
└── plants
    ├── id (PK)
    ├── plantName
    ├── addressLine1
    ├── addressLine2
    ├── cityId (FK → cities)
    ├── stateId (FK → states)
    ├── industryId (FK → industries)
    ├── totalPlantArea
    └── totalBuildUpArea

PLANT STRUCTURE
├── buildings
│   ├── id (PK)
│   ├── plantId (FK → plants)
│   ├── buildingName
│   ├── buildingHeight
│   └── totalArea
│
├── floors
│   ├── id (PK)
│   ├── buildingId (FK → buildings)
│   ├── floorName
│   ├── usage
│   └── floorArea
│
└── wings
    ├── id (PK)
    ├── floorId (FK → floors)
    ├── wingName
    ├── usage
    └── wingArea

PLANT FACILITIES
├── entrances
│   ├── id (PK)
│   ├── plantId (FK → plants)
│   ├── entranceName
│   └── width
│
├── diesel_generators
│   ├── id (PK)
│   ├── plantId (FK → plants)
│   ├── available
│   └── quantity
│
├── staircases
│   ├── id (PK)
│   ├── buildingId (FK → buildings)
│   ├── type
│   ├── width
│   ├── fireRating
│   └── quantity
│
└── lifts
    ├── id (PK)
    ├── buildingId (FK → buildings)
    ├── available
    └── quantity

FIRE SAFETY
├── fire_safety_forms
│   ├── id (PK)
│   ├── plantId (FK → plants)
│   ├── amcVendorId (FK → vendors)
│   ├── primeOverTankCapacity
│   ├── terraceTankCapacity
│   ├── numFireExtinguishers
│   └── ...
│
└── compliance_fire_safety
    ├── id (PK)
    ├── plantId (FK → plants)
    ├── fireNocNumber
    ├── nocValidityDate
    ├── insurancePolicyNumber
    └── ...

MONITORING
├── monitoring_forms
│   ├── id (PK)
│   ├── plantId (FK → plants)
│   ├── buildingId (FK → buildings)
│   └── floorId (FK → floors)
│
└── monitoring_devices (junction)
    ├── id (PK)
    ├── monitoringFormId (FK)
    └── edgeDeviceId (FK)

LAYOUTS
└── layouts
    ├── id (PK)
    ├── plantId (FK → plants)
    ├── buildingId (FK → buildings) [optional]
    ├── floorId (FK → floors) [optional]
    ├── wingId (FK → wings) [optional]
    ├── layoutType
    └── layoutUrl

RELATIONS
└── plant_managers (junction)
    ├── id (PK)
    ├── plantId (FK → plants)
    └── managerId (FK → managers)
```

## Cascade Rules

```
DELETE CASCADE:
├── plants → buildings → floors → wings
├── plants → entrances
├── plants → diesel_generators
├── plants → fire_safety_forms
├── plants → compliance_fire_safety
├── plants → monitoring_forms → monitoring_devices
├── plants → layouts
├── buildings → staircases
└── buildings → lifts

SET NULL:
├── fire_safety_forms.amcVendorId
├── monitoring_forms.buildingId
├── monitoring_forms.floorId
├── layouts.buildingId
├── layouts.floorId
└── layouts.wingId
```

## Query Examples

### Get Plant with Full Structure
```sql
SELECT p.*, 
       b.*, f.*, w.*
FROM plants p
LEFT JOIN buildings b ON b.plantId = p.id
LEFT JOIN floors f ON f.buildingId = b.id
LEFT JOIN wings w ON w.floorId = f.id
WHERE p.id = ?
```

### Get Plant with Managers
```sql
SELECT p.*, m.*, u.*
FROM plants p
LEFT JOIN plant_managers pm ON pm.plantId = p.id
LEFT JOIN managers m ON m.id = pm.managerId
LEFT JOIN users u ON u.id = m.userId
WHERE p.id = ?
```

### Get Plant with Fire Safety
```sql
SELECT p.*, fs.*, v.*
FROM plants p
LEFT JOIN fire_safety_forms fs ON fs.plantId = p.id
LEFT JOIN vendors v ON v.id = fs.amcVendorId
WHERE p.id = ?
```

## Indexes

```
PRIMARY INDEXES (PK):
- All tables have UUID primary key with index

FOREIGN KEY INDEXES:
- buildings.plantId
- floors.buildingId
- wings.floorId
- plant_managers.plantId
- plant_managers.managerId
- entrances.plantId
- diesel_generators.plantId
- staircases.buildingId
- lifts.buildingId
- fire_safety_forms.plantId
- fire_safety_forms.amcVendorId
- compliance_fire_safety.plantId
- monitoring_forms.plantId
- monitoring_devices.monitoringFormId
- monitoring_devices.edgeDeviceId
- layouts.plantId

UNIQUE INDEXES:
- plant_managers(plantId, managerId)
- vendors.vendorName
- edge_devices.deviceCode
```

---

## Table Relationships Count

- **plants**: 10 direct relationships
- **buildings**: 5 relationships (parent + 4 children)
- **floors**: 3 relationships
- **wings**: 1 relationship
- **Total Tables**: 15 new tables created
- **Total Foreign Keys**: 20+ foreign key relationships
