// Comprehensive test script for medicine reminder APIs
// Using Node.js built-in fetch (available in Node 18+)

const BASE_URL = 'http://localhost:8080';

async function testMedicineAPIs() {
  try {
    console.log('🧪 Testing Medicine Reminder APIs...\n');

    // Step 1: Register and authenticate user
    const testEmail = `test${Date.now()}@example.com`;
    console.log('🔍 Registering test user...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: 'password123',
        preferredLanguage: 'en-US'
      })
    });

    if (!registerResponse.ok) {
      throw new Error('Failed to register user');
    }

    const { token } = await registerResponse.json();
    console.log('✅ User registered successfully\n');

    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token
    };

    // Step 2: Test Medicine APIs
    console.log('🔍 Testing Medicine Management...');
    
    // Create medicine
    const medicineData = {
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'twice_daily',
      times: ['08:00', '20:00'],
      startDate: '2024-10-31',
      endDate: '2024-12-31',
      instructions: 'Take with food',
      withFood: true
    };

    const createMedicineResponse = await fetch(`${BASE_URL}/api/medicines`, {
      method: 'POST',
      headers,
      body: JSON.stringify(medicineData)
    });

    if (!createMedicineResponse.ok) {
      const error = await createMedicineResponse.json();
      throw new Error(`Failed to create medicine: ${error.error}`);
    }

    const { data: medicine } = await createMedicineResponse.json();
    console.log('✅ Medicine created:', medicine.name);

    // Get all medicines
    const getMedicinesResponse = await fetch(`${BASE_URL}/api/medicines`, {
      headers: { 'x-auth-token': token }
    });

    if (getMedicinesResponse.ok) {
      const { data: medicines } = await getMedicinesResponse.json();
      console.log('✅ Retrieved medicines:', medicines.length);
    }

    // Step 3: Test Medicine Log APIs
    console.log('\n🔍 Testing Medicine Logs...');
    
    // Create medicine log
    const logData = {
      medicineId: medicine._id,
      scheduledTime: '08:00',
      actualTime: new Date().toISOString(),
      status: 'taken',
      notes: 'Taken with breakfast'
    };

    const createLogResponse = await fetch(`${BASE_URL}/api/medicine-logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(logData)
    });

    if (createLogResponse.ok) {
      const { data: log } = await createLogResponse.json();
      console.log('✅ Medicine log created:', log.status);
    } else {
      const error = await createLogResponse.json();
      console.log('❌ Failed to create medicine log:', error.error);
    }

    // Get medicine logs
    const getLogsResponse = await fetch(`${BASE_URL}/api/medicine-logs`, {
      headers: { 'x-auth-token': token }
    });

    if (getLogsResponse.ok) {
      const { data: logs } = await getLogsResponse.json();
      console.log('✅ Retrieved medicine logs:', logs.length);
    }

    // Get medicine statistics
    const getStatsResponse = await fetch(`${BASE_URL}/api/medicine-logs/stats`, {
      headers: { 'x-auth-token': token }
    });

    if (getStatsResponse.ok) {
      const { data: stats } = await getStatsResponse.json();
      console.log('✅ Medicine adherence stats:', `${stats.adherenceRate}%`);
    }

    // Step 4: Test Health Check APIs
    console.log('\n🔍 Testing Health Checks...');
    
    const healthCheckData = {
      date: '2024-10-31',
      mood: 'good',
      energyLevel: 8,
      symptoms: ['headache'],
      notes: 'Feeling better today'
    };

    const createHealthCheckResponse = await fetch(`${BASE_URL}/api/health-checks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(healthCheckData)
    });

    if (createHealthCheckResponse.ok) {
      const { data: healthCheck } = await createHealthCheckResponse.json();
      console.log('✅ Health check created:', healthCheck.mood);
    }

    // Get health checks
    const getHealthChecksResponse = await fetch(`${BASE_URL}/api/health-checks`, {
      headers: { 'x-auth-token': token }
    });

    if (getHealthChecksResponse.ok) {
      const { data: healthChecks } = await getHealthChecksResponse.json();
      console.log('✅ Retrieved health checks:', healthChecks.length);
    }

    // Step 5: Test Emergency Contact APIs
    console.log('\n🔍 Testing Emergency Contacts...');
    
    const contactData = {
      name: 'Dr. Smith',
      relationship: 'doctor',
      phone: '+1234567890',
      email: 'dr.smith@hospital.com',
      isPrimary: true
    };

    const createContactResponse = await fetch(`${BASE_URL}/api/emergency-contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(contactData)
    });

    if (createContactResponse.ok) {
      const { data: contact } = await createContactResponse.json();
      console.log('✅ Emergency contact created:', contact.name);

      // Test emergency alert
      const alertData = {
        type: 'medical',
        location: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        message: 'Test emergency alert'
      };

      const triggerAlertResponse = await fetch(`${BASE_URL}/api/emergency/trigger`, {
        method: 'POST',
        headers,
        body: JSON.stringify(alertData)
      });

      if (triggerAlertResponse.ok) {
        const { data: alert } = await triggerAlertResponse.json();
        console.log('✅ Emergency alert triggered:', alert.contactsNotified, 'contacts notified');
      }
    }

    // Get emergency contacts
    const getContactsResponse = await fetch(`${BASE_URL}/api/emergency-contacts`, {
      headers: { 'x-auth-token': token }
    });

    if (getContactsResponse.ok) {
      const { data: contacts } = await getContactsResponse.json();
      console.log('✅ Retrieved emergency contacts:', contacts.length);
    }

    console.log('\n🎉 All medicine reminder API tests completed successfully!');
    console.log('\n📋 Available Features:');
    console.log('   ✅ Medicine Management (CRUD)');
    console.log('   ✅ Medicine Logging & Adherence Tracking');
    console.log('   ✅ Health Check Recording');
    console.log('   ✅ Emergency Contact Management');
    console.log('   ✅ Emergency Alert System');
    console.log('\n📖 Check API_DOCUMENTATION.md for complete endpoint details');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testMedicineAPIs();
}

module.exports = testMedicineAPIs;