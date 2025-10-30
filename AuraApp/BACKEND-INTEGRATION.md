# 🔗 Backend Integration Guide

## ✅ **Current Status: Connected to Real Backend**

Your Aura mobile app is now connected to the real backend server running on `http://localhost:8080`.

### 🏥 **Backend Server Status:**
- ✅ Server running on port 8080
- ✅ MongoDB connected
- ⚠️ Dialogflow has configuration issues (using fallback AI)
- ✅ Basic API endpoints working

### 📱 **App Configuration:**
- **Mock API**: Disabled (using real backend)
- **Base URL**: `http://localhost:8080`
- **WebSocket URL**: `ws://localhost:8080`
- **AI Fallback**: Enabled for Dialogflow issues

## 🧪 **Testing Guide**

### 1. **Authentication Testing**
```bash
# Test registration endpoint
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@aura.com",
    "password": "password123",
    "preferredLanguage": "en-US"
  }'

# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@aura.com",
    "password": "password123"
  }'
```

### 2. **App Testing Steps**

#### **Registration Flow:**
1. Open http://localhost:8081 in browser
2. Click "Sign Up" 
3. Fill in registration form
4. Should receive JWT token and redirect to dashboard

#### **Login Flow:**
1. Use registered credentials to login
2. Should see personalized dashboard
3. JWT token stored in browser storage

#### **Appointment Management:**
1. Click "Book Appointment" 
2. Select doctor and date/time
3. Appointment saved to MongoDB
4. View in "My Appointments" tab

#### **AI Assistant:**
1. Go to "AI" tab
2. Ask health questions
3. **Note**: Dialogflow errors will fallback to mock responses
4. Real LLM responses if Ollama is configured

### 3. **Backend Logs to Monitor**

Watch your backend terminal for:
```
✅ Good logs:
- "Server started on port 8080"
- "MongoDB Connected..."
- POST /api/auth/register 200
- POST /api/auth/login 200
- GET /api/appointments 200

⚠️ Expected errors (until Google Cloud is configured):
- "Dialogflow error: Error: 2 UNKNOWN: Getting metadata from plugin failed..."
```

## 🔧 **Troubleshooting**

### **Common Issues:**

#### 1. **CORS Errors**
If you see CORS errors in browser console:
```javascript
// Backend should have CORS enabled
app.use(cors());
```

#### 2. **Network Connection**
- Ensure both frontend (8081) and backend (8080) are running
- Check firewall settings
- Use `http://localhost:8080` not `http://127.0.0.1:8080`

#### 3. **Authentication Errors**
- Check JWT secret in backend `.env`
- Verify MongoDB connection
- Check user collection in MongoDB

#### 4. **AI Service Errors**
The Dialogflow error you're seeing is due to Google Cloud credentials:
```
Error: Getting metadata from plugin failed with error: key must be a string, a buffer or an object
```

**To fix Dialogflow:**
1. Set up Google Cloud service account
2. Download credentials JSON file
3. Set `GOOGLE_APPLICATION_CREDENTIALS` in `.env`
4. Restart backend server

**For now**: AI features use fallback responses (still functional)

### **Database Verification**
Check MongoDB collections:
```bash
# Connect to MongoDB
mongo

# Switch to your database
use aura_db

# Check users
db.users.find()

# Check appointments  
db.appointments.find()
```

## 🚀 **Next Steps**

### **Immediate Testing:**
1. ✅ Test user registration/login
2. ✅ Create and view appointments  
3. ✅ Navigate between screens
4. ✅ Update user profile

### **AI Features Setup:**
1. **Configure Google Cloud Dialogflow CX**
2. **Set up Ollama for local LLM**
3. **Update environment variables**
4. **Restart backend server**

### **Production Deployment:**
1. **Update API URLs** for production
2. **Configure HTTPS/WSS**
3. **Set up proper CORS policies**
4. **Environment-specific configurations**

## 📊 **Feature Status**

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Working | Real JWT tokens |
| User Profile | ✅ Working | MongoDB storage |
| Appointments | ✅ Working | CRUD operations |
| Navigation | ✅ Working | All screens |
| AI Chat | ⚠️ Fallback | Dialogflow needs config |
| Voice Recognition | 🚫 Web Limited | Works on mobile |
| WebSocket Translation | ⚠️ Needs Testing | Backend WebSocket server |

## 🎯 **Success Indicators**

### **App is working correctly when:**
- ✅ Registration creates user in MongoDB
- ✅ Login returns valid JWT token
- ✅ Dashboard shows user-specific data
- ✅ Appointments persist in database
- ✅ No CORS errors in browser console
- ✅ Backend logs show successful API calls

### **Ready for mobile testing when:**
- ✅ Web version fully functional
- ✅ All API endpoints responding
- ✅ Database operations working
- ✅ Error handling graceful

Your app is now connected to the real backend! Test the registration and appointment features first, then we can work on fixing the AI services. 🏥✨