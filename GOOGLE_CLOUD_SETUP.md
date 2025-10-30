# Google Cloud Setup Guide for Aura Backend

## Current Issue
You have OAuth2 client credentials, but you need **Service Account** credentials for server-to-server API access.

## Quick Fix for Development
The backend now includes mock services that work without Google Cloud. You can test all functionality using the mock endpoints.

## Setting Up Google Cloud Service Account (For Production)

### Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `auro-476713`
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Fill in details:
   - **Name**: `aura-backend-service`
   - **Description**: `Service account for Aura backend API access`
6. Click **Create and Continue**

### Step 2: Assign Roles

Add these roles to your service account:
- **Dialogflow API Client**
- **Cloud Speech Client** 
- **Cloud Translation API User**

### Step 3: Create and Download Key

1. Click on your newly created service account
2. Go to the **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Click **Create**
6. The key file will download automatically

### Step 4: Replace Credentials File

1. Replace your current `credentials.json` with the downloaded service account key
2. The new file should look like this:

```json
{
  "type": "service_account",
  "project_id": "auro-476713",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "aura-backend-service@auro-476713.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### Step 5: Enable Required APIs

Make sure these APIs are enabled in your Google Cloud project:

1. **Dialogflow API**
   - Go to APIs & Services > Library
   - Search for "Dialogflow API"
   - Click Enable

2. **Cloud Speech-to-Text API**
   - Search for "Cloud Speech-to-Text API"
   - Click Enable

3. **Cloud Translation API**
   - Search for "Cloud Translation API"
   - Click Enable

### Step 6: Create Dialogflow CX Agent

1. Go to [Dialogflow CX Console](https://dialogflow.cloud.google.com/cx/)
2. Create a new agent or use existing one
3. Note down your Agent ID from the URL or settings
4. Update your `.env` file with the correct `GOOGLE_AGENT_ID`

## Testing the Setup

After replacing the credentials file, restart your server:

```bash
npm run dev
```

Test the Dialogflow endpoint:

```bash
curl -X POST http://localhost:8080/api/ai/dialogflow/detect-intent \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "text": "I want to schedule an appointment",
    "sessionId": "test-session-123"
  }'
```

## Using Mock Services (Current Setup)

Until you set up the service account, you can use the mock endpoints:

```bash
# Mock Dialogflow
curl -X POST http://localhost:8080/api/ai/dialogflow/mock \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "text": "I want to schedule an appointment",
    "sessionId": "test-session-123"
  }'
```

The mock services provide realistic responses for development and testing.

## Environment Variables

Update your `.env` file:

```env
# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS="credentials.json"
GOOGLE_PROJECT_ID="auro-476713"
GOOGLE_LOCATION="us-central1"
GOOGLE_AGENT_ID="your-actual-dialogflow-agent-id"
```

## Troubleshooting

### "Service unavailable" errors
- Check that the credentials file exists and is a service account key
- Verify the file path in `GOOGLE_APPLICATION_CREDENTIALS`
- Ensure required APIs are enabled

### "Permission denied" errors
- Check that your service account has the required roles
- Verify the project ID matches your Google Cloud project

### "Agent not found" errors
- Create a Dialogflow CX agent in your project
- Update `GOOGLE_AGENT_ID` with the correct agent ID

## Security Notes

- **Never commit** the `credentials.json` file to version control
- Add `credentials.json` to your `.gitignore` file
- Use environment variables for production deployment
- Rotate service account keys regularly

## For Hackathon Development

For now, you can continue development using:
1. Mock AI services (already implemented)
2. Local LLM with Ollama (works independently)
3. All other backend features (auth, appointments, etc.)

The Google Cloud integration can be added later without affecting other functionality.