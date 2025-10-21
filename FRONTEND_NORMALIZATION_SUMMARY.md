# Frontend Plant Normalization Summary

## Overview
This document outlines all the changes made to the frontend to adapt to the normalized plant backend structure.

## Files Created

### 1. TypeScript Types (`src/types/plant.types.ts`)
**Purpose**: Centralized type definitions for normalized plant structure

**Key Interfaces**:
- `Plant`: Main plant interface with normalized structure
  - Changed `address` → `addressLine1`, `addressLine2`
  - Changed `plantId` → `id`
  - Added `managers` array (replaces single `managerId`)
  - Added `buildings`, `entrances`, `fireSafetyForms`, etc. arrays
  - Kept legacy properties for backward compatibility: `primeOverTankCapacity`, `numFireExtinguishers`, etc.

- `Building`: Building entity with `floors`, `staircases`, `lifts`
- `Floor`: Floor entity with `wings`
- `Wing`: Wing entity
- `Entrance`: Plant entrance details
- `DieselGenerator`: DG specifications
- `FireSafetyForm`: Fire safety equipment and compliance
- `ComplianceFireSafety`: Compliance records
- `MonitoringForm`: Monitoring installations
- `Layout`: Layout file uploads with optional building/floor/wing association
- `PlantCreatePayload`: API request payload for creating plants with nested structure

### 2. Service Layer (`src/services/plant.service.ts`)
**Purpose**: API abstraction layer with backward compatibility

**Key Methods**:
```typescript
// Normalized endpoints (preferred)
getAllPlantsNormalized()
getPlantByIdNormalized(id)
createPlantNormalized(payload: PlantCreatePayload)
updatePlantNormalized(id, data)
deletePlantNormalized(id)

// Fire Safety operations
createFireSafetyForm(plantId, data)
updateFireSafetyForm(plantId, formId, data)

// Compliance operations
createComplianceForm(plantId, data)
updateComplianceForm(plantId, formId, data)

// Legacy endpoints (fallback)
getAllPlants()
createPlant(data)
```

**Features**:
- Automatic fallback to legacy endpoints if normalized endpoints fail
- Consistent error handling
- Type-safe with TypeScript interfaces

### 3. Utility Functions (`src/utils/plant.utils.ts`)
**Purpose**: Data transformation and validation helpers

**Key Functions**:
```typescript
// Transform legacy JSONB structure to normalized payload
transformToNormalizedPlant(formData: any): PlantCreatePayload

// Clean form data by removing UI-only fields
cleanPlantFormData(formData: any): any

// Validate required plant fields
validatePlantData(data: any): { valid: boolean; errors: string[] }
```

**Transformations Handled**:
- Converts JSONB `buildings` field → nested `buildings` array with floors/wings
- Removes UI-only fields: `orgName`, `createdDate`, `city`, `state`, etc.
- Converts empty strings to null for numeric/enum fields
- Maps manager IDs to `managerIds` array

## Files Modified

### 1. PlantsPage.tsx
**Changes**:
- Imported `Plant` type from `plant.types.ts`
- Changed `plant.plantId` → `plant.id.substring(0, 8)` for display
- Changed `plant.address` → `plant.addressLine1`

### 2. PlantCreate.tsx
**Changes**:
- Added imports: `plantService`, `transformToNormalizedPlant`, `cleanPlantFormData`, `validatePlantData`
- Added state: `useNormalizedEndpoint` to detect endpoint availability
- Updated `handleSaveDraft()`:
  - Uses `cleanPlantFormData()` to remove invalid fields
  - Checks `useNormalizedEndpoint` flag
  - Calls `plantService.createPlantNormalized()` or legacy `api.post('/plant')`
  - Sets status to 'Draft'
  
- Updated `handleFinalSubmit()`:
  - Uses `cleanPlantFormData()` to remove invalid fields
  - Validates data with `validatePlantData()`
  - Uses normalized or legacy endpoint based on availability
  - Sets status to 'Active'

**Backward Compatibility**:
- Automatically detects normalized endpoint availability on mount
- Falls back to legacy endpoints if normalized not available
- Supports both old and new data formats

### 3. PlantEdit.tsx
**Changes**:
- Added imports: `plantService`, `cleanPlantFormData`, `validatePlantData`
- Added state: `useNormalizedEndpoint`
- Updated `fetchData()` in useEffect:
  - Detects normalized endpoint availability
  - Uses `plantService.getPlantByIdNormalized()` or legacy endpoint
  
- Updated `handleSaveDraft()`:
  - Uses `cleanPlantFormData()`
  - Calls `plantService.updatePlantNormalized()` or legacy `api.put()`
  
- Updated `handleFinalSubmit()`:
  - Uses `cleanPlantFormData()` and `validatePlantData()`
  - Uses normalized or legacy endpoint

### 4. PlantView.tsx
**Changes**:
- Imported `plantService` and `Plant` type
- Added state: `useNormalizedEndpoint`
- Updated `fetchPlant()`:
  - Uses `plantService.getPlantByIdNormalized()` with fallback
  - Changed `plant.plantId` → `plant.id.substring(0, 8)`
  - Changed `plant.address` → `plant.addressLine1`
  - Changed `plant.mainBuildings` → `plant.numMainBuildings`
  - Added display for `plant.buildings.length` (total buildings)

## Data Flow

### Creating a Plant (Normalized Flow)
```
1. User fills form → formData state
2. User clicks "Save & Continue" → handleFinalSubmit()
3. cleanPlantFormData(formData) → removes UI fields
4. validatePlantData(cleaned) → checks required fields
5. transformToNormalizedPlant(cleaned) → creates PlantCreatePayload
6. plantService.createPlantNormalized(payload) → POST /plant/normalized
7. Backend creates Plant + Buildings + Floors + Wings in transaction
8. Success → navigate to plants list
```

### Creating a Plant (Legacy Flow)
```
1. User fills form → formData state
2. User clicks "Save & Continue" → handleFinalSubmit()
3. cleanPlantFormData(formData) → removes UI fields
4. api.post('/plant', cleaned) → POST /plant
5. Backend creates Plant with JSONB fields
6. Success → navigate to plants list
```

### Editing a Plant (Normalized Flow)
```
1. Load plant: plantService.getPlantByIdNormalized(id)
2. Backend returns Plant with nested buildings/floors/wings
3. User edits form → formData state
4. Save: plantService.updatePlantNormalized(id, cleaned)
5. Backend updates Plant and associated records
```

## Backward Compatibility Strategy

### 1. Endpoint Detection
- On component mount, check if `/plant/normalized` exists
- Set `useNormalizedEndpoint` flag accordingly
- Use normalized endpoints if available, otherwise use legacy

### 2. Data Transformation
- `transformToNormalizedPlant()` converts old JSONB format to new nested structure
- `cleanPlantFormData()` works for both formats
- Legacy properties kept in `Plant` interface for display compatibility

### 3. Graceful Degradation
- All components work with both normalized and legacy endpoints
- Service layer handles fallback automatically
- No breaking changes to existing functionality

## Testing Checklist

### Before Migration
- [ ] Test plant creation with legacy endpoint
- [ ] Test plant editing with legacy endpoint
- [ ] Test plant viewing with legacy endpoint
- [ ] Verify all form fields work correctly
- [ ] Check validation messages

### After Migration
- [ ] Run database migration script
- [ ] Test plant creation with normalized endpoint
- [ ] Test plant editing with normalized endpoint
- [ ] Verify nested buildings/floors/wings are saved
- [ ] Check manager assignment works (many-to-many)
- [ ] Verify fire safety forms are linked correctly
- [ ] Test compliance forms creation
- [ ] Verify layouts can be associated with building/floor/wing
- [ ] Check cascade delete behavior

### Error Scenarios
- [ ] Test with invalid data (should show validation errors)
- [ ] Test with missing required fields
- [ ] Test with network errors (should fallback gracefully)
- [ ] Test with legacy backend (should use old endpoints)

## Migration Steps

### Phase 1: Deploy Frontend (No Breaking Changes)
1. Deploy updated frontend code
2. Frontend automatically detects backend capabilities
3. Uses legacy endpoints (current behavior maintained)
4. No user impact

### Phase 2: Deploy Backend
1. Deploy normalized backend models and controllers
2. Run database migration script
3. Frontend automatically detects new endpoints
4. Switches to normalized endpoints
5. Legacy endpoints still available for rollback

### Phase 3: Data Migration (Optional)
1. Run script to migrate existing plants to normalized structure
2. Convert JSONB buildings to Building/Floor/Wing records
3. Update plant records to remove denormalized fields
4. Verify data integrity

### Phase 4: Cleanup (Future)
1. Remove legacy endpoint support from frontend
2. Remove backward compatibility code
3. Remove legacy backend endpoints
4. Update documentation

## Key Benefits

### For Development
- **Type Safety**: Full TypeScript support with proper interfaces
- **Maintainability**: Separated concerns (types, services, utils)
- **Testability**: Easy to mock service layer
- **Reusability**: Shared utilities and types

### For Users
- **No Downtime**: Graceful transition with backward compatibility
- **Better Performance**: Optimized queries with proper joins
- **Data Integrity**: Foreign key constraints prevent orphaned data
- **Flexibility**: Can associate layouts with specific wings/floors

### For Database
- **Normalization**: Proper 3NF structure
- **Relationships**: Clear foreign keys and associations
- **Scalability**: Easier to query and index
- **Consistency**: Cascade deletes maintain referential integrity

## Next Steps

1. **Testing**: Thoroughly test all plant operations (create, read, update, delete)
2. **Migration**: Run backend migration script in staging environment
3. **Monitoring**: Watch for any errors in production logs
4. **Optimization**: Add indexes if query performance is slow
5. **Documentation**: Update API documentation with new endpoints
6. **Training**: Brief team on new structure and capabilities

## Support

For issues or questions:
- Check backend logs for API errors
- Review browser console for frontend errors
- Verify database migration completed successfully
- Ensure all required fields are provided
- Check network tab for failed API calls
