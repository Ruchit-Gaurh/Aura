# Aura Mobile App

A comprehensive React Native healthcare application with AI integration, real-time translation, and voice recognition capabilities.

## Features

- **User Authentication**: JWT-based authentication with secure login/registration
- **Appointment Management**: Create, view, and manage medical appointments
- **Voice Recognition**: Offline-first voice recognition for accessibility
- **Real-time Translation**: WebSocket-based live translation during calls
- **AI Assistant**: Integrated AI for health insights and consultation support
- **Multi-language Support**: Support for 10+ languages
- **Haptic Feedback**: Enhanced user experience with tactile feedback

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Voice Recognition**: @react-native-voice/voice
- **WebSocket**: Native WebSocket API
- **UI Components**: Custom components with modern design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AuraApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Update the API configuration in `src/config/api.ts`:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'http://your-backend-url:8080', // Update with your backend URL
     WEBSOCKET_URL: 'ws://your-backend-url:8080',
     // ... rest of config
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - For iOS: Press `i` in the terminal or scan QR code with Camera app
   - For Android: Press `a` in the terminal or scan QR code with Expo Go app

## Project Structure

```
AuraApp/
├── src/
│   ├── config/          # Configuration files
│   ├── context/         # React Context providers
│   ├── navigation/      # Navigation setup
│   ├── screens/         # Screen components
│   ├── services/        # API and service layers
│   └── types/           # TypeScript type definitions
├── assets/              # Static assets
├── App.tsx              # Main app component
└── package.json         # Dependencies and scripts
```

## Key Components

### Authentication
- **LoginScreen**: User login with email/password
- **RegisterScreen**: User registration with language preference
- **AuthContext**: Global authentication state management

### Appointments
- **HomeScreen**: Dashboard with upcoming appointments
- **AppointmentsScreen**: List of all appointments with filtering
- **CreateAppointmentScreen**: Book new appointments
- **AppointmentDetailScreen**: Detailed appointment view

### Voice & AI
- **VoiceCallScreen**: Real-time voice calls with translation
- **AIScreen**: AI assistant for health queries
- **VoiceService**: Voice recognition service wrapper

### Core Services
- **ApiService**: HTTP API client with authentication
- **AuthService**: Authentication management
- **WebSocketService**: Real-time communication
- **VoiceService**: Voice recognition integration

## Backend Integration

This app connects to the Aura Backend API. Ensure the backend is running and accessible:

1. **Authentication Endpoints**
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login

2. **User Endpoints**
   - `GET /api/users/profile` - Get user profile
   - `PUT /api/users/profile` - Update user profile

3. **Appointment Endpoints**
   - `GET /api/appointments` - Get user appointments
   - `POST /api/appointments` - Create appointment
   - `PUT /api/appointments/:id` - Update appointment

4. **AI Endpoints**
   - `POST /api/ai/dialogflow/detect-intent` - Intent detection
   - `POST /api/ai/summarize` - Transcript summarization
   - `POST /api/ai/generate` - AI response generation

5. **WebSocket**
   - `ws://localhost:8080` - Real-time translation

## Permissions

The app requires the following permissions:

### iOS (Info.plist)
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice recognition</string>
```

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Configuration

### API Configuration
Update `src/config/api.ts` with your backend URL and supported languages.

### Voice Recognition
The app uses offline-first voice recognition. Supported languages are configured in the API config.

### WebSocket
Real-time translation uses WebSocket connections. Ensure your backend WebSocket server is running.

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

### Debugging
- Use React Native Debugger for debugging
- Enable remote debugging in development builds
- Check console logs for API and WebSocket errors

## Features in Detail

### Voice Recognition
- Offline-first approach for privacy
- Multi-language support
- Real-time transcription
- Haptic feedback for user interaction

### Real-time Translation
- WebSocket-based communication
- Live translation during calls
- Message history with timestamps
- Connection status indicators

### AI Integration
- Dialogflow CX for intent detection
- Local LLM for response generation
- Conversation summarization
- Health-focused AI responses

### Accessibility
- Voice navigation support
- Haptic feedback
- High contrast UI elements
- Screen reader compatibility

## Troubleshooting

### Common Issues

1. **Voice Recognition Not Working**
   - Check microphone permissions
   - Ensure device has speech recognition capabilities
   - Verify language support

2. **WebSocket Connection Failed**
   - Check backend server status
   - Verify WebSocket URL configuration
   - Check network connectivity

3. **API Errors**
   - Verify backend server is running
   - Check API endpoint URLs
   - Ensure authentication tokens are valid

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check React Native version compatibility
   - Verify all dependencies are installed

### Performance Optimization
- Use FlatList for large appointment lists
- Implement proper image caching
- Optimize WebSocket message handling
- Use React.memo for expensive components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review the backend API documentation
- Create an issue in the repository