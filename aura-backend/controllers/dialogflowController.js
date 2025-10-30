const { SessionsClient } = require('@google-cloud/dialogflow-cx');

// Configure client with regional endpoint
const location = process.env.GOOGLE_LOCATION || 'us-central1';
const apiEndpoint = `${location}-dialogflow.googleapis.com`;

const client = new SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiEndpoint: apiEndpoint,
});

const detectIntent = async (req, res) => {
  const { text, sessionId, projectId, location, agentId } = req.body;

  if (!text || !sessionId) {
    return res.status(400).json({ 
      error: 'Missing required fields: text and sessionId are required' 
    });
  }

  try {
    // Construct session path
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId || process.env.GOOGLE_PROJECT_ID,
      location || process.env.GOOGLE_LOCATION,
      agentId || process.env.GOOGLE_AGENT_ID,
      sessionId
    );

    // The text query request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
        },
        languageCode: 'en-US',
      },
    };

    // Send request and get response
    const [response] = await client.detectIntent(request);
    
    // Extract response messages
    const responseMessages = response.queryResult.responseMessages;
    let responseText = '';
    
    responseMessages.forEach(message => {
      if (message.text) {
        responseText += message.text.text.join(' ') + ' ';
      }
    });

    res.json({
      responseText: responseText.trim(),
      intent: response.queryResult.intent?.displayName || 'Unknown',
      confidence: response.queryResult.intentDetectionConfidence || 0
    });

  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ 
      error: 'Failed to process intent detection',
      details: error.message 
    });
  }
};

module.exports = {
  detectIntent
};