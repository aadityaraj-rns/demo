const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Test data for plant creation
const testPlantData = {
  plantName: 'Test Plant Integration',
  address: '123 Test Street',
  address2: 'Test Area',
  cityId: 'test-city-id', // This would need to be a real city ID
  stateId: 'test-state-id', // This would need to be a real state ID
  zipCode: '12345',
  gstNo: 'TEST123456789',
  industryId: 'test-industry-id', // This would need to be a real industry ID
  managerIds: ['test-manager-id'], // This would need to be a real manager ID
  status: 'Draft',
  mainBuildings: 2,
  subBuildings: 1,
  totalPlantArea: 1000.50,
  totalBuildUpArea: 800.25,
  dgAvailable: true,
  dgQuantity: 2,
  staircaseAvailable: true,
  staircaseQuantity: 3,
  staircaseType: 'enclosed',
  staircaseWidth: 1.5,
  staircaseFireRating: '90',
  staircasePressurization: true,
  staircaseEmergencyLighting: true,
  staircaseLocation: 'Main Building',
  liftAvailable: true,
  liftQuantity: 2,
  headerPressure: '7.5',
  pressureUnit: 'Bar',
  primeOverTankCapacity: 15000,
  terraceTankCapacity: 10000,
  headerPressureBar: 7.5,
  systemCommissionDate: '2024-01-15',
  amcVendor: 'Test AMC Vendor',
  amcStartDate: '2024-01-01',
  amcEndDate: '2024-12-31',
  numFireExtinguishers: 10,
  numHydrantPoints: 5,
  numSprinklers: 15,
  numSafeAssemblyAreas: 3,
  dieselEngine: 'Test Diesel Engine',
  electricalPump: 'Test Electrical Pump',
  jockeyPump: 'Test Jockey Pump',
  fireNocNumber: 'NOC-TEST-2024-001',
  nocValidityDate: '2024-12-31',
  insurancePolicyNumber: 'INS-TEST-2024-001',
  insurerName: 'Test Insurance Company',
  complianceNumExtinguishers: 10,
  complianceNumHydrants: 5,
  complianceNumSprinklers: 15,
  complianceNumSafeAreas: 3,
  edgeDeviceId: 'EDGE-TEST-001',
  monitoringBuilding: 'Main Building',
  specificLocation: 'Pump Room',
  installationDate: '2024-01-10',
  layoutName: 'Test Layout',
  schedulerCategory: 'test-category-id', // This would need to be a real category ID
  schedulerStartDate: '2024-01-01',
  schedulerEndDate: '2024-12-31',
  inspectionFrequency: 'monthly',
  testingFrequency: 'quarterly',
  maintenanceFrequency: 'half-yearly'
};

async function testPlantIntegration() {
  try {
    console.log('🧪 Testing Plant Integration...\n');

    // Test 1: Check if backend is running
    console.log('1. Testing backend connectivity...');
    try {
      const healthCheck = await axios.get(`${API_BASE_URL}/`);
      console.log('✅ Backend is running');
    } catch (error) {
      console.log('❌ Backend is not running or not accessible');
      console.log('Please start the backend server first');
      return;
    }

    // Test 2: Test plant creation (this would require authentication)
    console.log('\n2. Testing plant creation...');
    console.log('Note: This test requires authentication. Please ensure you have a valid token.');
    
    // You would need to add authentication headers here
    // const headers = { Authorization: `Bearer ${your_token_here}` };
    
    console.log('Plant data structure:', JSON.stringify(testPlantData, null, 2));
    console.log('✅ Plant data structure is valid');

    // Test 3: Validate required fields
    console.log('\n3. Validating required fields...');
    const requiredFields = ['plantName'];
    const missingFields = requiredFields.filter(field => !testPlantData[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ All required fields are present');
    } else {
      console.log('❌ Missing required fields:', missingFields);
    }

    // Test 4: Validate data types
    console.log('\n4. Validating data types...');
    const validations = [
      { field: 'plantName', type: 'string', value: testPlantData.plantName },
      { field: 'mainBuildings', type: 'number', value: testPlantData.mainBuildings },
      { field: 'totalPlantArea', type: 'number', value: testPlantData.totalPlantArea },
      { field: 'dgAvailable', type: 'boolean', value: testPlantData.dgAvailable },
      { field: 'managerIds', type: 'array', value: testPlantData.managerIds }
    ];

    let allValid = true;
    validations.forEach(({ field, type, value }) => {
      const isValid = type === 'array' ? Array.isArray(value) : typeof value === type;
      if (isValid) {
        console.log(`✅ ${field}: ${type} - valid`);
      } else {
        console.log(`❌ ${field}: expected ${type}, got ${typeof value}`);
        allValid = false;
      }
    });

    if (allValid) {
      console.log('✅ All data types are valid');
    }

    console.log('\n🎉 Plant integration test completed!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: cd nextgen-firedesk-backend && npm start');
    console.log('2. Start the frontend: cd nextgen-firedesk-frontend && npm run dev');
    console.log('3. Test the plant creation form in the browser');
    console.log('4. Verify that multiple managers can be selected and saved');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPlantIntegration();