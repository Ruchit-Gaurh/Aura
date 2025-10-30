# Dialogflow CX Agent Setup Guide for Aura

This guide will walk you through creating a Dialogflow CX agent for the Aura healthcare application.

## Prerequisites

- Google Cloud Project: `auro-476713` (already created)
- Service Account credentials (already configured)
- Dialogflow API enabled

## Step 1: Access Dialogflow CX Console

1. Open your web browser and go to: https://dialogflow.cloud.google.com/cx/
2. Sign in with your Google account that has access to the `auro-476713` project
3. Make sure you're in the correct project by checking the project selector at the top

## Step 2: Create a New Agent

1. **Click "Create Agent"** button (usually a blue button on the main page)

2. **Fill in Agent Details**:
   - **Display Name**: `Aura Healthcare Assistant`
   - **Default Language**: `English - en`
   - **Default Time Zone**: `(GMT-8:00) America/Los_Angeles` (or your preferred timezone)
   - **Project**: Select `auro-476713` from the dropdown
   - **Location**: Select `us-central1` (must match your .env GOOGLE_LOCATION)

3. **Click "Create"** - This will take a few moments to set up

## Step 3: Get Your Agent ID

1. Once the agent is created, you'll be redirected to the agent's main page
2. Look at the URL in your browser - it will look like:
   ```
   https://dialogflow.cloud.google.com/cx/projects/auro-476713/locations/us-central1/agents/12345678-1234-1234-1234-123456789abc/...
   ```
3. **Copy the Agent ID** - it's the UUID part after `/agents/`
   - Example: `12345678-1234-1234-1234-123456789abc`
4. **Update your .env file** with this Agent ID:
   ```env
   GOOGLE_AGENT_ID="12345678-1234-1234-1234-123456789abc"
   ```

## Step 4: Configure Basic Intents for Healthcare

### 4.1 Create Appointment Scheduling Intent

1. **Navigate to "Intents"** in the left sidebar
2. **Click "Create"** to create a new intent
3. **Fill in Intent Details**:
   - **Display Name**: `schedule.appointment`
   - **Training Phrases**: Add these examples:
     ```
     I want to schedule an appointment
     Book an appointment for me
     I need to see a doctor
     Can I make an appointment?
     Schedule a visit
     I'd like to book a consultation
     ```
4. **Click "Save"**

### 4.2 Create Symptom Inquiry Intent

1. **Create another intent** with:
   - **Display Name**: `health.symptoms`
   - **Training Phrases**:
     ```
     I have a headache
     I'm feeling sick
     I have symptoms
     I'm not feeling well
     I have pain in my chest
     I've been having fever
     ```
2. **Click "Save"**

### 4.3 Create Appointment Cancellation Intent

1. **Create another intent** with:
   - **Display Name**: `cancel.appointment`
   - **Training Phrases**:
     ```
     Cancel my appointment
     I want to cancel
     Remove my booking
     I can't make it to my appointment
     Cancel my visit
     ```
2. **Click "Save"**

## Step 5: Configure Default Welcome Intent

1. **Find the "Default Welcome Intent"** (should already exist)
2. **Click on it to edit**
3. **Update the Response** to be healthcare-focused:
   ```
   Hello! I'm your Aura healthcare assistant. I can help you:
   - Schedule appointments
   - Answer questions about your symptoms
   - Cancel or reschedule appointments
   - Connect you with healthcare providers
   
   How can I assist you today?
   ```
4. **Click "Save"**

## Step 6: Create a Simple Flow

1. **Navigate to "Flows"** in the left sidebar
2. **Click on "Default Start Flow"** (should already exist)
3. **You'll see a visual flow builder**
4. **The flow should automatically route to your intents**

## Step 7: Test Your Agent

1. **Click "Test Agent"** in the right panel (or look for a chat icon)
2. **Try these test phrases**:
   - "Hello" (should trigger welcome intent)
   - "I want to schedule an appointment" (should trigger schedule.appointment)
   - "I have a headache" (should trigger health.symptoms)
   - "Cancel my appointment" (should trigger cancel.appointment)

## Step 8: Configure Fulfillment (Optional)

If you want more dynamic responses:

1. **Navigate to "Fulfillment"** in the left sidebar
2. **Enable "Webhook"**
3. **Set Webhook URL** to your backend endpoint:
   ```
   https://your-backend-url.com/api/ai/dialogflow/webhook
   ```
   (You'll need to create this endpoint in your backend)

## Step 9: Update Your Backend Configuration

1. **Copy your Agent ID** from Step 3
2. **Update your `.env` file**:
   ```env
   GOOGLE_AGENT_ID="your-actual-agent-id-here"
   ```
3. **Restart your backend server**:
   ```bash
   npm run dev
   ```

## Step 10: Test Integration

1. **Run your test script**:
   ```bash
   node test-api.js
   ```
2. **Or test manually with curl**:
   ```bash
   curl -X POST http://localhost:8080/api/ai/dialogflow/detect-intent \
     -H "Content-Type: application/json" \
     -H "x-auth-token: YOUR_JWT_TOKEN" \
     -d '{
       "text": "I want to schedule an appointment",
       "sessionId": "test-session-123"
     }'
   ```

## Advanced Configuration (Optional)

### Add Entity Types for Healthcare

1. **Navigate to "Entity Types"** in the left sidebar
2. **Create entities for**:
   - **Symptoms**: headache, fever, cough, pain, nausea
   - **Appointment Types**: consultation, checkup, follow-up, emergency
   - **Specialties**: cardiology, dermatology, neurology, general

### Add Parameters to Intents

1. **Edit your intents** to extract parameters
2. **For schedule.appointment intent**:
   - Add parameter: `appointment-type` (entity: @appointment-types)
   - Add parameter: `date-time` (entity: @sys.date-time)

### Configure Responses

1. **Add dynamic responses** using parameters:
   ```
   I'll help you schedule a $appointment-type appointment for $date-time. Let me check availability.
   ```

## Troubleshooting

### Common Issues:

1. **"Agent not found" error**:
   - Double-check your Agent ID in the .env file
   - Ensure the agent is in the correct project and location

2. **"Permission denied" error**:
   - Verify your service account has Dialogflow API Client role
   - Check that the Dialogflow API is enabled

3. **"Invalid location" error**:
   - Ensure GOOGLE_LOCATION in .env matches the agent's location
   - Both should be "us-central1"

4. **No response from agent**:
   - Check that intents have training phrases
   - Verify the Default Welcome Intent is configured
   - Test in the Dialogflow console first

### Getting Help:

- **Dialogflow Documentation**: https://cloud.google.com/dialogflow/cx/docs
- **Google Cloud Console**: https://console.cloud.google.com/
- **API Reference**: https://cloud.google.com/dialogflow/cx/docs/reference

## Next Steps

1. **Enhance Intents**: Add more healthcare-specific intents
2. **Add Entities**: Create custom entities for medical terms
3. **Implement Fulfillment**: Connect to your backend for dynamic responses
4. **Add Multilingual Support**: Configure additional languages
5. **Set up Analytics**: Monitor conversation metrics

## Security Notes

- Keep your Agent ID secure (it's not as sensitive as credentials, but still private)
- Use environment variables for all configuration
- Regularly review and update your intents based on user interactions
- Monitor logs for any security issues

---

**Your Agent Configuration Summary:**
- **Project ID**: `auro-476713`
- **Location**: `us-central1`
- **Agent Name**: `Aura Healthcare Assistant`
- **Agent ID**: `[Copy from Dialogflow console]`

Once you complete these steps, your Dialogflow CX agent will be ready to handle healthcare-related conversations in your Aura application!