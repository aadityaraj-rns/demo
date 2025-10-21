#!/usr/bin/env node

/**
 * Test script for Plant Integration
 * This script tests the plant creation, retrieval, update, and deletion functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';

// Test data
const testPlant = {
  plantName: 'Test Integration Plant',
  address: 'Test Address 123',
  address2: 'Near Test Location',
  zipCode: '400001',
  gstNo: 'TEST123456789',
  status: 'Draft',
  mainBuildings: 2,
  subBuildings: 1,
  totalPlantArea: 5000,
  totalBuildUpArea: 3000,
  // Fire Safety fields
  numFireExtinguishers: 10,
  numHydrantPoints: 5,
  numSprinklers: 20,
  numSafeAssemblyAreas: 2,
  // Monitoring fields
  edgeDeviceId: 'TEST-EDGE-001',
  monitoringBuilding: 'Main Building',
  specificLocation: 'Pump Room'
};

async function login() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/login`, {
      loginID: 'admin@firedesk.com',
      password: 'admin123'
    });
    
    authToken = response.data.accessToken;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetMasterData() {
  try {
    console.log('\n📋 Testing master data retrieval...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const [states, industries, managers, categories] = await Promise.all([
      axios.get(`${BASE_URL}/state/active`, { headers }),
      axios.get(`${BASE_URL}/industry/active`, { headers }),
      axios.get(`${BASE_URL}/manager/active`, { headers }),
      axios.get(`${BASE_URL}/category/active`, { headers })
    ]);
    
    console.log(`✅ States: ${states.data?.allState?.length || 0} found`);
    console.log(`✅ Industries: ${industries.data?.allIndustry?.length || 0} found`);
    console.log(`✅ Managers: ${managers.data?.allManager?.length || 0} found`);
    console.log(`✅ Categories: ${categories.data?.allCategory?.length || 0} found`);
    
    // Use first available data for test plant
    if (states.data?.allState?.length > 0) {
      testPlant.stateId = states.data.allState[0].id;
      
      // Get cities for this state
      const cities = await axios.get(`${BASE_URL}/city/active/stateId/${testPlant.stateId}`, { headers });
      if (cities.data?.allCity?.length > 0) {
        testPlant.cityId = cities.data.allCity[0].id;
      }
    }
    
    if (industries.data?.allIndustry?.length > 0) {
      testPlant.industryId = industries.data.allIndustry[0].id;
    }
    
    if (managers.data?.allManager?.length > 0) {
      testPlant.managerIds = [managers.data.allManager[0].id];
    }
    
    return true;
  } catch (error) {
    console.error('❌ Master data test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCreatePlant() {
  try {
    console.log('\n🏭 Testing plant creation...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const response = await axios.post(`${BASE_URL}/organisation/plant`, testPlant, { headers });
    
    if (response.data.success && response.data.plant) {
      console.log('✅ Plant created successfully');
      console.log(`   Plant ID: ${response.data.plant.id}`);
      console.log(`   Plant Name: ${response.data.plant.plantName}`);
      console.log(`   Status: ${response.data.plant.status}`);
      return response.data.plant.id;
    } else {
      console.error('❌ Plant creation failed: Invalid response');
      return null;
    }
  } catch (error) {
    console.error('❌ Plant creation failed:', error.response?.data?.message || error.message);
    console.error('   Errors:', error.response?.data?.errors);
    return null;
  }
}

async function testGetPlant(plantId) {
  try {
    console.log('\n📖 Testing plant retrieval...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const response = await axios.get(`${BASE_URL}/organisation/plant/${plantId}`, { headers });
    
    if (response.data.success && response.data.plant) {
      console.log('✅ Plant retrieved successfully');
      console.log(`   Plant Name: ${response.data.plant.plantName}`);
      console.log(`   Address: ${response.data.plant.address}`);
      console.log(`   Status: ${response.data.plant.status}`);
      console.log(`   Managers: ${response.data.plant.managers?.length || 0}`);
      return true;
    } else {
      console.error('❌ Plant retrieval failed: Invalid response');
      return false;
    }
  } catch (error) {
    console.error('❌ Plant retrieval failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUpdatePlant(plantId) {
  try {
    console.log('\n✏️ Testing plant update...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const updateData = {
      plantName: 'Updated Test Plant',
      status: 'Active',
      numFireExtinguishers: 15,
      edgeDeviceId: 'UPDATED-EDGE-001'
    };
    
    const response = await axios.put(`${BASE_URL}/organisation/plant/${plantId}`, updateData, { headers });
    
    if (response.data.success && response.data.plant) {
      console.log('✅ Plant updated successfully');
      console.log(`   New Name: ${response.data.plant.plantName}`);
      console.log(`   New Status: ${response.data.plant.status}`);
      return true;
    } else {
      console.error('❌ Plant update failed: Invalid response');
      return false;
    }
  } catch (error) {
    console.error('❌ Plant update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetAllPlants() {
  try {
    console.log('\n📋 Testing plant list retrieval...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const response = await axios.get(`${BASE_URL}/organisation/plant`, { headers });
    
    if (response.data.success && Array.isArray(response.data.plants)) {
      console.log(`✅ Plant list retrieved successfully (${response.data.plants.length} plants)`);
      return true;
    } else {
      console.error('❌ Plant list retrieval failed: Invalid response');
      return false;
    }
  } catch (error) {
    console.error('❌ Plant list retrieval failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDeletePlant(plantId) {
  try {
    console.log('\n🗑️ Testing plant deletion...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const response = await axios.delete(`${BASE_URL}/organisation/plant/${plantId}`, { headers });
    
    if (response.data.success) {
      console.log('✅ Plant deleted successfully');
      return true;
    } else {
      console.error('❌ Plant deletion failed: Invalid response');
      return false;
    }
  } catch (error) {
    console.error('❌ Plant deletion failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Plant Integration Tests...\n');
  
  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ Tests failed - Could not authenticate');
    process.exit(1);
  }
  
  // Test master data
  const masterDataSuccess = await testGetMasterData();
  if (!masterDataSuccess) {
    console.log('\n❌ Tests failed - Could not fetch master data');
    process.exit(1);
  }
  
  // Test plant creation
  const plantId = await testCreatePlant();
  if (!plantId) {
    console.log('\n❌ Tests failed - Could not create plant');
    process.exit(1);
  }
  
  // Test plant retrieval
  const getSuccess = await testGetPlant(plantId);
  if (!getSuccess) {
    console.log('\n❌ Tests failed - Could not retrieve plant');
    process.exit(1);
  }
  
  // Test plant update
  const updateSuccess = await testUpdatePlant(plantId);
  if (!updateSuccess) {
    console.log('\n❌ Tests failed - Could not update plant');
    process.exit(1);
  }
  
  // Test plant list
  const listSuccess = await testGetAllPlants();
  if (!listSuccess) {
    console.log('\n❌ Tests failed - Could not retrieve plant list');
    process.exit(1);
  }
  
  // Test plant deletion
  const deleteSuccess = await testDeletePlant(plantId);
  if (!deleteSuccess) {
    console.log('\n❌ Tests failed - Could not delete plant');
    process.exit(1);
  }
  
  console.log('\n🎉 All tests passed! Plant integration is working correctly.');
}

// Run the tests
runTests().catch(error => {
  console.error('\n💥 Test runner crashed:', error.message);
  process.exit(1);
});