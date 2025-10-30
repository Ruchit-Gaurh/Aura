// Quick script to check Google Cloud permissions
const { SessionsClient } = require('@google-cloud/dialogflow-cx');

async function checkPermissions() {
  try {
    console.log('🔍 Checking Dialogflow permissions...');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('  Project ID:', process.env.GOOGLE_PROJECT_ID);
    console.log('  Location:', process.env.GOOGLE_LOCATION);
    console.log('  Agent ID:', process.env.GOOGLE_AGENT_ID);
    console.log('  Credentials File:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    // Check if credentials file exists
    const fs = require('fs');
    if (!fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      console.log('❌ Credentials file not found!');
      return;
    }
    console.log('✅ Credentials file exists');
    
    // Initialize client
    const location = process.env.GOOGLE_LOCATION || 'us-central1';
    const apiEndpoint = `${location}-dialogflow.googleapis.com`;
    
    const client = new SessionsClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      apiEndpoint: apiEndpoint,
    });
    
    console.log('✅ Dialogflow client initialized');
    
    // Try to create a session path (this tests basic permissions)
    const sessionPath = client.projectLocationAgentSessionPath(
      process.env.GOOGLE_PROJECT_ID,
      process.env.GOOGLE_LOCATION,
      process.env.GOOGLE_AGENT_ID,
      'test-session'
    );
    
    console.log('✅ Session path created:', sessionPath);
    
    // Try a simple detect intent request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: 'hello',
        },
        languageCode: 'en-US',
      },
    };
    
    console.log('🧪 Testing detect intent...');
    const [response] = await client.detectIntent(request);
    
    console.log('✅ SUCCESS! Dialogflow is working properly');
    console.log('📝 Response:', response.queryResult.responseMessages[0]?.text?.text || 'No response text');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔧 SOLUTION:');
      console.log('1. Go to: https://console.cloud.google.com/iam-admin/iam');
      console.log('2. Find service account: aura-364@auro-476713.iam.gserviceaccount.com');
      console.log('3. Add role: Dialogflow API Client');
      console.log('4. Add role: Dialogflow API Reader');
    } else if (error.message.includes('NOT_FOUND')) {
      console.log('\n🔧 SOLUTION:');
      console.log('1. Create Dialogflow agent at: https://dialogflow.cloud.google.com/cx/');
      console.log('2. Use project: auro-476713');
      console.log('3. Use location: us-central1');
      console.log('4. Update GOOGLE_AGENT_ID in .env file');
    }
  }
}

// Load environment variables
require('dotenv').config();

// Run the check
checkPermissions();