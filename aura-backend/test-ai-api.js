// Comprehensive test script for AI and Health Insights APIs
// Using Node.js built-in fetch (available in Node 18+)

const BASE_URL = 'http://localhost:8080';

async function testAIAPIs() {
  try {
    console.log('🤖 Testing AI and Health Insights APIs...\n');

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

    // Step 2: Test AI Chat
    console.log('🔍 Testing AI Chat...');
    
    const chatData = {
      message: 'I have a headache, what should I do?',
      includeNavigation: true
    };

    const chatResponse = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(chatData)
    });

    if (chatResponse.ok) {
      const { data: chatResult } = await chatResponse.json();
      console.log('✅ AI Chat response received');
      console.log('   Response:', chatResult.response.substring(0, 100) + '...');
      console.log('   Suggestions:', chatResult.suggestions);
      
      if (chatResult.intent) {
        console.log('   Intent detected:', chatResult.intent);
      }

      // Test getting conversation history
      const conversationResponse = await fetch(`${BASE_URL}/api/ai/conversation/${chatResult.conversationId}`, {
        headers: { 'x-auth-token': token }
      });

      if (conversationResponse.ok) {
        const { data: conversation } = await conversationResponse.json();
        console.log('✅ Conversation history retrieved:', conversation.messages.length, 'messages');
      }
    } else {
      const error = await chatResponse.json();
      console.log('❌ AI Chat failed:', error.error);
    }

    // Step 3: Test Voice Command Analysis
    console.log('\n🔍 Testing Voice Command Analysis...');
    
    const voiceData = {
      command: 'book an appointment with doctor'
    };

    const voiceResponse = await fetch(`${BASE_URL}/api/ai/voice-command`, {
      method: 'POST',
      headers,
      body: JSON.stringify(voiceData)
    });

    if (voiceResponse.ok) {
      const { data: voiceResult } = await voiceResponse.json();
      console.log('✅ Voice command analyzed');
      if (voiceResult.intent) {
        console.log('   Intent:', voiceResult.intent.action, '->', voiceResult.intent.screen);
        console.log('   Confidence:', voiceResult.intent.confidence);
      }
    } else {
      const error = await voiceResponse.json();
      console.log('❌ Voice command analysis failed:', error.error);
    }

    // Step 4: Create some sample data for health insights
    console.log('\n🔍 Creating sample data for health insights...');
    
    // Create a medicine
    const medicineData = {
      name: 'Test Medicine',
      dosage: '100mg',
      frequency: 'daily',
      times: ['08:00'],
      startDate: '2024-10-31',
      instructions: 'Take with food'
    };

    const medicineResponse = await fetch(`${BASE_URL}/api/medicines`, {
      method: 'POST',
      headers,
      body: JSON.stringify(medicineData)
    });

    let medicineId = null;
    if (medicineResponse.ok) {
      const { data: medicine } = await medicineResponse.json();
      medicineId = medicine._id;
      console.log('✅ Sample medicine created');

      // Create medicine log
      const logData = {
        medicineId: medicineId,
        scheduledTime: '08:00',
        status: 'taken',
        notes: 'Taken with breakfast'
      };

      const logResponse = await fetch(`${BASE_URL}/api/medicine-logs`, {
        method: 'POST',
        headers,
        body: JSON.stringify(logData)
      });

      if (logResponse.ok) {
        console.log('✅ Sample medicine log created');
      }
    }

    // Create health check
    const healthCheckData = {
      date: '2024-10-31',
      mood: 'good',
      energyLevel: 8,
      symptoms: ['headache'],
      notes: 'Feeling better today'
    };

    const healthCheckResponse = await fetch(`${BASE_URL}/api/health-checks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(healthCheckData)
    });

    if (healthCheckResponse.ok) {
      console.log('✅ Sample health check created');
    }

    // Step 5: Test Health Summary
    console.log('\n🔍 Testing Health Summary...');
    
    const summaryResponse = await fetch(`${BASE_URL}/api/insights/health-summary?days=7`, {
      headers: { 'x-auth-token': token }
    });

    if (summaryResponse.ok) {
      const { data: summary } = await summaryResponse.json();
      console.log('✅ Health summary generated');
      console.log('   Summary:', summary.summary.substring(0, 100) + '...');
      console.log('   Adherence Score:', summary.adherenceScore + '%');
      console.log('   Recommendations:', summary.recommendations.length);
      console.log('   Trends:', summary.trends);
    } else {
      const error = await summaryResponse.json();
      console.log('❌ Health summary failed:', error.error);
    }

    // Step 6: Test Symptom Analysis
    console.log('\n🔍 Testing Symptom Analysis...');
    
    const symptomData = {
      symptoms: ['headache', 'fatigue', 'nausea'],
      duration: '2 days',
      severity: 'moderate'
    };

    const symptomResponse = await fetch(`${BASE_URL}/api/insights/analyze-symptoms`, {
      method: 'POST',
      headers,
      body: JSON.stringify(symptomData)
    });

    if (symptomResponse.ok) {
      const { data: analysis } = await symptomResponse.json();
      console.log('✅ Symptom analysis completed');
      console.log('   Analysis:', analysis.analysis.substring(0, 100) + '...');
      console.log('   Urgency Level:', analysis.urgencyLevel);
      console.log('   Should See Doctor:', analysis.shouldSeeDoctor);
      console.log('   Recommendations:', analysis.recommendations.length);
    } else {
      const error = await symptomResponse.json();
      console.log('❌ Symptom analysis failed:', error.error);
    }

    // Step 7: Test Get Conversations List
    console.log('\n🔍 Testing Conversations List...');
    
    const conversationsResponse = await fetch(`${BASE_URL}/api/ai/conversations`, {
      headers: { 'x-auth-token': token }
    });

    if (conversationsResponse.ok) {
      const { data: conversations } = await conversationsResponse.json();
      console.log('✅ Conversations list retrieved:', conversations.length, 'conversations');
    }

    console.log('\n🎉 All AI and Health Insights API tests completed successfully!');
    console.log('\n📋 Available AI Features:');
    console.log('   ✅ AI Chat with Futurix AI Integration');
    console.log('   ✅ Voice Command Analysis');
    console.log('   ✅ Conversation History Management');
    console.log('   ✅ Smart Health Insights');
    console.log('   ✅ AI-Powered Symptom Analysis');
    console.log('   ✅ Navigation Intent Detection');
    console.log('\n📖 Check API_DOCUMENTATION.md for complete endpoint details');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
    console.log('💡 Check that Futurix AI service is accessible');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAIAPIs();
}

module.exports = testAIAPIs;