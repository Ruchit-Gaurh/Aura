# Aura App - Troubleshooting Guide

## 🚀 Quick Start Checklist

### ✅ **App Successfully Started!**
The app is now running and ready for development. You should see:
- Metro bundler running
- QR code for testing on device
- No compatibility warnings

## 📱 Testing the App

### Option 1: Physical Device
1. **Install Expo Go** from App Store (iOS) or Google Play (Android)
2. **Scan the QR code** with your camera (iOS) or Expo Go app (Android)
3. **Wait for the app to load** on your device

### Option 2: Simulator/Emulator
1. **iOS Simulator**: Press `i` in the terminal
2. **Android Emulator**: Press `a` in the terminal
3. **Web Browser**: Press `w` in the terminal

## 🔧 Common Issues & Solutions

### 1. **Package Compatibility Issues**
**Problem**: "The following packages should be updated for best compatibility..."

**Solution**: ✅ **FIXED** - We've updated all packages to compatible versions:
```bash
npm install @react-native-community/datetimepicker@8.4.4 @react-native-picker/picker@2.11.1 react-native-screens@4.16.0
```

### 2. **Metro Bundler Issues**
**Problem**: Metro bundler fails to start or shows errors

**Solutions**:
```bash
# Clear Metro cache
npx expo start --clear

# Reset npm cache
npm start -- --reset-cache

# Reinstall node_modules
rm -rf node_modules && npm install
```

### 3. **Backend Connection Issues**
**Problem**: API calls fail or return network errors

**Solutions**:
1. **Update API URL** in `src/config/api.ts`:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'http://YOUR_BACKEND_IP:8080', // Use your actual IP
     WEBSOCKET_URL: 'ws://YOUR_BACKEND_IP:8080',
   };
   ```

2. **For local development**:
   - Use your computer's IP address instead of `localhost`
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Example: `http://192.168.1.100:8080`

3. **Ensure backend is running**:
   ```bash
   # In your backend directory
   npm run dev
   ```

### 4. **Voice Recognition Issues**
**Problem**: Voice recognition not working

**Solutions**:
1. **Check permissions**: App will request microphone permission
2. **Test on physical device**: Voice recognition doesn't work in simulators
3. **Check supported languages**: Ensure your device supports the selected language

### 5. **WebSocket Connection Issues**
**Problem**: Real-time translation not working

**Solutions**:
1. **Check WebSocket URL** in config
2. **Ensure backend WebSocket server is running**
3. **Test network connectivity**

### 6. **TypeScript Errors**
**Problem**: TypeScript compilation errors

**Solutions**:
```bash
# Check for type errors
npx tsc --noEmit

# Install missing type definitions
npm install @types/react-native
```

### 7. **iOS Simulator Issues**
**Problem**: App crashes or doesn't load on iOS simulator

**Solutions**:
1. **Reset iOS Simulator**: Device → Erase All Content and Settings
2. **Update Xcode**: Ensure you have the latest version
3. **Check iOS version compatibility**

### 8. **Android Emulator Issues**
**Problem**: App doesn't load on Android emulator

**Solutions**:
1. **Enable hardware acceleration** in Android Studio
2. **Increase emulator RAM** (4GB recommended)
3. **Use API level 28+** for best compatibility

## 🔍 Debugging Tools

### Metro Bundler Commands
- `r` - Reload app
- `j` - Open debugger
- `m` - Toggle menu
- `shift+m` - More tools

### React Native Debugger
1. **Install React Native Debugger**
2. **Enable remote debugging** in app
3. **Inspect network requests, state, and logs**

### Expo Dev Tools
- **Press `j`** to open Expo dev tools in browser
- **View logs, performance, and device info**

## 📊 Performance Optimization

### If App is Slow
1. **Enable Hermes** (already enabled in Expo)
2. **Optimize images** and reduce bundle size
3. **Use FlatList** for large lists (already implemented)
4. **Profile with Flipper** for detailed analysis

### Memory Issues
1. **Check for memory leaks** in WebSocket connections
2. **Properly cleanup** voice recognition listeners
3. **Use React.memo** for expensive components (already implemented)

## 🌐 Network Configuration

### For Development
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:8080', // Your computer's IP
  WEBSOCKET_URL: 'ws://192.168.1.100:8080',
};
```

### For Production
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://your-production-api.com',
  WEBSOCKET_URL: 'wss://your-production-api.com',
};
```

## 🔐 Authentication Testing

### Test Accounts
Create test accounts through the register screen or use these endpoints:

```bash
# Register test user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "preferredLanguage": "en-US"
  }'
```

## 📱 Feature Testing Checklist

### ✅ **Authentication**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Profile updates
- [ ] Logout functionality

### ✅ **Appointments**
- [ ] View appointments list
- [ ] Create new appointment
- [ ] View appointment details
- [ ] Cancel appointment

### ✅ **Voice Features**
- [ ] Voice recognition (physical device only)
- [ ] Haptic feedback
- [ ] Multi-language support

### ✅ **AI Assistant**
- [ ] Send text messages
- [ ] Voice input
- [ ] AI responses
- [ ] Conversation history

### ✅ **Real-time Translation**
- [ ] WebSocket connection
- [ ] Join translation room
- [ ] Send/receive messages
- [ ] Translation display

## 🆘 Getting Help

### Check Logs
1. **Metro bundler logs** in terminal
2. **Device logs** in Expo Go app
3. **Browser console** for web version

### Common Log Messages
- **"Network request failed"** → Check backend connection
- **"Permission denied"** → Grant microphone permission
- **"WebSocket connection failed"** → Check WebSocket server

### Still Having Issues?
1. **Check the README.md** for detailed setup instructions
2. **Review FEATURES.md** for implementation details
3. **Ensure backend is properly configured** and running
4. **Test with a simple API call** first

## 🎉 Success Indicators

### App is Working When:
- ✅ Metro bundler starts without errors
- ✅ QR code appears and is scannable
- ✅ App loads on device/simulator
- ✅ Login screen appears
- ✅ Navigation works between screens
- ✅ API calls succeed (check network tab)

The app is now ready for development and testing! 🚀