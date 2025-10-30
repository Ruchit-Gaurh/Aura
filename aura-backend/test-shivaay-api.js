// Test script to check Shivaay API connectivity
require('dotenv').config();

const SHIVAAY_CONFIG = {
  API_URL: process.env.SHIVAAY_API_URL || 'https://api.futurixai.com/api/shivaay/v1/chat/completions',
  API_KEY: process.env.SHIVAAY_API_KEY || '6903de523bb9326d46566618'
};

async function testShivaayAPI() {
  console.log('🧪 Testing Shivaay API connectivity...\n');
  
  console.log('Configuration:');
  console.log('  API URL:', SHIVAAY_CONFIG.API_URL);
  console.log('  API Key:', SHIVAAY_CONFIG.API_KEY.substring(0, 10) + '...');
  console.log('');

  const requestBody = {
    model: "shivaay",
    messages: [
      { role: "system", content: "You are a helpful healthcare assistant." },
      { role: "user", content: "Hello, can you help me?" }
    ],
    temperature: 0.7,
    max_tokens: 100,
    stream: false
  };

  try {
    console.log('📡 Sending test request...');
    
    const response = await fetch(SHIVAAY_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIVAAY_CONFIG.API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response body:', errorText);
      
      if (response.status === 403) {
        console.log('\n🔍 Diagnosis: 403 Forbidden');
        console.log('   This could mean:');
        console.log('   1. Invalid API key');
        console.log('   2. API key doesn\'t have permission');
        console.log('   3. CORS issues (if called from browser)');
        console.log('   4. API endpoint has changed');
      } else if (response.status === 401) {
        console.log('\n🔍 Diagnosis: 401 Unauthorized');
        console.log('   This means the API key is invalid or missing');
      }
      
      return;
    }

    const result = await response.json();
    console.log('✅ Success! API is working');
    console.log('📝 Response:', result.choices[0].message.content);
    console.log('🔧 Model:', result.model);
    console.log('📊 Usage:', result.usage);

  } catch (error) {
    console.log('❌ Network/Connection Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔍 Diagnosis: Network Error');
      console.log('   This could mean:');
      console.log('   1. No internet connection');
      console.log('   2. API server is down');
      console.log('   3. Firewall blocking the request');
      console.log('   4. DNS resolution issues');
    }
  }
}

// Alternative test using different approach
async function testWithCurl() {
  console.log('\n🔧 Alternative: Test with curl command:');
  console.log(`curl -X POST "${SHIVAAY_CONFIG.API_URL}" \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "Authorization: Bearer ${SHIVAAY_CONFIG.API_KEY}" \\`);
  console.log(`  -d '{`);
  console.log(`    "model": "shivaay",`);
  console.log(`    "messages": [{"role": "user", "content": "Hello"}],`);
  console.log(`    "max_tokens": 100`);
  console.log(`  }'`);
}

// Run tests
testShivaayAPI().then(() => {
  testWithCurl();
}).catch(console.error);