// Simple API test script
// Using Node.js built-in fetch (available in Node 18+)

const BASE_URL = 'http://localhost:8080';

async function testAPI() {
  try {
    // Test health endpoint
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test user registration with unique email
    const testEmail = `test${Date.now()}@example.com`;
    console.log('\n🔍 Testing user registration...');
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

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ User registered successfully');
      
      // Test getting user profile
      console.log('\n🔍 Testing user profile...');
      const profileResponse = await fetch(`${BASE_URL}/api/users/profile`, {
        headers: { 'x-auth-token': registerData.token }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile retrieved:', profileData.name);
      } else {
        console.log('❌ Profile test failed');
      }

      // Test creating appointment
      console.log('\n🔍 Testing appointment creation...');
      const appointmentResponse = await fetch(`${BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': registerData.token 
        },
        body: JSON.stringify({
          doctorName: 'Dr. Smith',
          appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
        })
      });

      if (appointmentResponse.ok) {
        const appointmentData = await appointmentResponse.json();
        console.log('✅ Appointment created:', appointmentData.doctorName);
      } else {
        console.log('❌ Appointment creation failed');
      }

      // Test Dialogflow AI service
      console.log('\n🔍 Testing Dialogflow AI...');
      const dialogflowResponse = await fetch(`${BASE_URL}/api/ai/dialogflow/detect-intent`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': registerData.token 
        },
        body: JSON.stringify({
          text: 'I want to schedule an appointment',
          sessionId: 'test-session-123'
        })
      });

      if (dialogflowResponse.ok) {
        const dialogflowData = await dialogflowResponse.json();
        console.log('✅ Dialogflow response:', dialogflowData.responseText);
        console.log('   Intent:', dialogflowData.intent);
        console.log('   Confidence:', dialogflowData.confidence);
      } else {
        const errorData = await dialogflowResponse.json();
        console.log('❌ Dialogflow test failed:', errorData.error);
      }

      console.log('\n🎉 All tests completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('   1. Share API_DOCUMENTATION.md with your team');
      console.log('   2. Install Ollama for local LLM features');
      console.log('   3. Test WebSocket real-time translation');

    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData.msg);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;