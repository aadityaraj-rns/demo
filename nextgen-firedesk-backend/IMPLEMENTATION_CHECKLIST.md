# Plant Normalization - Implementation Checklist

## ✅ Phase 1: Models & Schema (COMPLETED)

### Models Created
- [x] Building.js
- [x] Floor.js
- [x] Wing.js
- [x] PlantManager.js
- [x] Entrance.js
- [x] DieselGenerator.js
- [x] Staircase.js
- [x] Lift.js
- [x] FireSafetyForm.js
- [x] ComplianceFireSafety.js
- [x] MonitoringForm.js
- [x] MonitoringDevice.js
- [x] Layout.js
- [x] Vendor.js
- [x] EdgeDevice.js

### Plant Model
- [x] Update Plant.js with normalized structure
- [x] Rename fields (address → addressLine1, etc.)
- [x] Add backward compatibility fields
- [x] Update field types and constraints

### Associations
- [x] Define all model associations in models/index.js
- [x] Configure cascade delete rules
- [x] Set up many-to-many relationships
- [x] Add proper foreign key references

## ✅ Phase 2: Controllers (COMPLETED)

- [x] normalizedPlantController.js
  - [x] getAll() - Get all plants with associations
  - [x] getById() - Get single plant with full details
  - [x] create() - Create plant with nested data
  - [x] update() - Update plant information
  - [x] delete() - Delete plant with cascades

- [x] fireSafetyController.js
  - [x] create() - Create fire safety form
  - [x] getByPlantId() - Get forms by plant
  - [x] update() - Update fire safety form
  - [x] delete() - Delete fire safety form

- [x] complianceController.js
  - [x] create() - Create compliance record
  - [x] getByPlantId() - Get compliance records
  - [x] update() - Update compliance record
  - [x] delete() - Delete compliance record

## ✅ Phase 3: Documentation (COMPLETED)

- [x] PLANT_NORMALIZATION_GUIDE.md
- [x] NORMALIZATION_SUMMARY.md
- [x] SCHEMA_DIAGRAM.md
- [x] Migration script template
- [x] Implementation checklist

## 🔲 Phase 4: Database Migration (TODO)

### Prepare Migration
- [ ] Review migration script
- [ ] Customize YYYYMMDDHHMMSS timestamp
- [ ] Test migration on development database
- [ ] Verify all tables created correctly
- [ ] Check foreign key constraints
- [ ] Verify indexes created

### Data Migration
- [ ] Create data migration script
- [ ] Migrate plants.buildings JSONB → buildings/floors/wings tables
- [ ] Migrate plants.entrances JSONB → entrances table
- [ ] Migrate plants.managerId → plant_managers junction
- [ ] Migrate fire safety fields → fire_safety_forms
- [ ] Migrate compliance fields → compliance_fire_safety
- [ ] Migrate monitoring fields → monitoring_forms
- [ ] Migrate layouts JSONB → layouts table
- [ ] Verify data integrity after migration
- [ ] Run data validation queries

### Testing
- [ ] Test cascade deletes
- [ ] Verify all foreign key relationships
- [ ] Check data completeness
- [ ] Performance test queries with joins
- [ ] Backup database before production migration

## 🔲 Phase 5: API Routes (TODO)

### Update Route Files
- [ ] Update routes/organisation.js
- [ ] Add normalized plant routes
  ```javascript
  router.post('/plants/normalized', normalizedPlantController.create);
  router.get('/plants/normalized', normalizedPlantController.getAll);
  router.get('/plants/normalized/:id', normalizedPlantController.getById);
  router.put('/plants/normalized/:id', normalizedPlantController.update);
  router.delete('/plants/normalized/:id', normalizedPlantController.delete);
  ```
- [ ] Add fire safety routes
  ```javascript
  router.post('/plants/fire-safety', fireSafetyController.create);
  router.get('/plants/:plantId/fire-safety', fireSafetyController.getByPlantId);
  router.put('/plants/fire-safety/:id', fireSafetyController.update);
  router.delete('/plants/fire-safety/:id', fireSafetyController.delete);
  ```
- [ ] Add compliance routes
  ```javascript
  router.post('/plants/compliance', complianceController.create);
  router.get('/plants/:plantId/compliance', complianceController.getByPlantId);
  router.put('/plants/compliance/:id', complianceController.update);
  router.delete('/plants/compliance/:id', complianceController.delete);
  ```
- [ ] Add authentication middleware
- [ ] Add authorization middleware
- [ ] Add request validation middleware

### Additional Controllers (Optional)
- [ ] buildingController.js - Manage buildings separately
- [ ] floorController.js - Manage floors separately
- [ ] wingController.js - Manage wings separately
- [ ] layoutController.js - Manage layouts separately
- [ ] monitoringController.js - Manage monitoring devices

## 🔲 Phase 6: Testing (TODO)

### Unit Tests
- [ ] Test all model definitions
- [ ] Test model associations
- [ ] Test cascade delete behavior
- [ ] Test validation rules
- [ ] Test default values

### Integration Tests
- [ ] Test normalizedPlantController endpoints
- [ ] Test fireSafetyController endpoints
- [ ] Test complianceController endpoints
- [ ] Test error handling
- [ ] Test edge cases

### API Tests
- [ ] Test POST /plants/normalized
- [ ] Test GET /plants/normalized
- [ ] Test GET /plants/normalized/:id
- [ ] Test PUT /plants/normalized/:id
- [ ] Test DELETE /plants/normalized/:id
- [ ] Test nested data creation
- [ ] Test transaction rollback on errors
- [ ] Test authentication/authorization

### Performance Tests
- [ ] Query performance with multiple joins
- [ ] Large dataset handling
- [ ] Concurrent request handling
- [ ] Memory usage optimization

## 🔲 Phase 7: Frontend Updates (TODO)

### Plant Forms
- [ ] Update plant creation form
- [ ] Add building creation UI
- [ ] Add floor management UI
- [ ] Add wing management UI
- [ ] Update plant edit form
- [ ] Add manager assignment UI

### Fire Safety
- [ ] Create fire safety form component
- [ ] Add vendor selection dropdown
- [ ] Display fire safety records
- [ ] Edit fire safety forms

### Compliance
- [ ] Create compliance form component
- [ ] Add document upload UI
- [ ] Display compliance records
- [ ] Edit compliance forms

### Display Components
- [ ] Update plant list view
- [ ] Update plant detail view
- [ ] Show building hierarchy
- [ ] Show fire safety info
- [ ] Show compliance status

## 🔲 Phase 8: Deployment (TODO)

### Pre-Deployment
- [ ] Code review
- [ ] Security audit
- [ ] Performance review
- [ ] Backup production database
- [ ] Create rollback plan

### Deployment Steps
- [ ] Deploy to staging environment
- [ ] Run migration on staging
- [ ] Test all functionality on staging
- [ ] Fix any issues found
- [ ] Schedule production deployment window
- [ ] Deploy to production
- [ ] Run migration on production
- [ ] Verify deployment success
- [ ] Monitor for errors

### Post-Deployment
- [ ] Monitor application logs
- [ ] Check database performance
- [ ] Verify data integrity
- [ ] User acceptance testing
- [ ] Gather feedback
- [ ] Fix any issues
- [ ] Remove old JSONB fields (after 30 days)
- [ ] Update documentation

## 🔲 Phase 9: Optimization (TODO)

### Database Optimization
- [ ] Add additional indexes if needed
- [ ] Optimize slow queries
- [ ] Set up query caching
- [ ] Configure connection pooling
- [ ] Monitor database performance

### API Optimization
- [ ] Implement pagination
- [ ] Add response caching
- [ ] Optimize eager loading
- [ ] Reduce N+1 query problems
- [ ] Add API rate limiting

### Code Optimization
- [ ] Refactor duplicate code
- [ ] Improve error handling
- [ ] Add logging
- [ ] Improve validation
- [ ] Add API documentation (Swagger)

## 🔲 Phase 10: Cleanup (TODO)

### Remove Deprecated Code
- [ ] Remove old plant controller methods (if replaced)
- [ ] Remove JSONB fields from Plant model
- [ ] Remove old API endpoints
- [ ] Update frontend to use only new endpoints
- [ ] Remove backward compatibility code

### Documentation Updates
- [ ] Update API documentation
- [ ] Update user guides
- [ ] Update developer documentation
- [ ] Create video tutorials
- [ ] Update README files

---

## Progress Summary

**Completed**: 3 phases (Models, Controllers, Documentation)
**Remaining**: 7 phases (Migration, Routes, Testing, Frontend, Deployment, Optimization, Cleanup)

**Estimated Time**:
- ✅ Phase 1-3: COMPLETED
- Phase 4: 1-2 days (Migration)
- Phase 5: 1 day (Routes)
- Phase 6: 2-3 days (Testing)
- Phase 7: 3-5 days (Frontend)
- Phase 8: 1 day (Deployment)
- Phase 9: 1-2 days (Optimization)
- Phase 10: 1 day (Cleanup)

**Total Estimated Time**: 10-15 days

---

## Notes

- Keep old structure during transition for backward compatibility
- Test thoroughly before removing old code
- Monitor performance after deployment
- Gather user feedback for improvements
- Document all changes and decisions
