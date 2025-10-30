# 📱 AuraApp - Healthcare Mobile Application

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.72-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![iOS](https://img.shields.io/badge/iOS-14%2B-black?style=for-the-badge&logo=ios)
![Android](https://img.shields.io/badge/Android-7%2B-green?style=for-the-badge&logo=android)

**Cross-platform mobile application for comprehensive healthcare management**

</div>

## 🌟 Overview

AuraApp is a React Native mobile application designed specifically for elderly healthcare management. It provides an intuitive, accessible interface with large touch targets, clear navigation, and comprehensive healthcare features including medicine reminders, health tracking, AI assistance, and emergency management.

## ✨ Key Features

### 📱 **Mobile-First Design**
- **Elderly-Friendly Interface** - Large fonts, high contrast, simple navigation
- **Accessibility Support** - VoiceOver/TalkBack, dynamic text sizing
- **Offline Capabilities** - Core features work without internet
- **Native Performance** - Smooth animations and interactions

### 💊 **Healthcare Management**
- **Smart Medicine Reminders** - Push notifications with snooze options
- **Visual Pill Identification** - Camera-based pill recognition
- **Adherence Tracking** - Comprehensive medication logging
- **Health Monitoring** - Daily check-ins with trend analysis

### 🤖 **AI Integration**
- **Voice-First Interactions** - Natural language commands
- **Smart Health Assistant** - AI-powered healthcare conversations
- **Symptom Checker** - Intelligent symptom analysis
- **Health Insights** - Personalized health recommendations

### 🚨 **Emergency Features**
- **One-Touch Emergency** - Instant emergency contact alerts
- **Location Services** - GPS-based emergency assistance
- **Medical ID** - Critical health information access
- **Family Notifications** - Automatic caregiver alerts

### 🌐 **Connectivity**
- **Real-time Sync** - Cross-platform data synchronization
- **WebSocket Integration** - Live communication features
- **Cloud Backup** - Secure data backup and restore
- **Multi-device Support** - Seamless device switching

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **React Native CLI** or **Expo CLI**
- **Xcode** 14+ (for iOS development)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies)

### Installation

1. **Clone and navigate to mobile app:**
```bash
git clone <repository-url>
cd AuraApp
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Install iOS dependencies (iOS only):**
```bash
cd ios && pod install && cd ..
```

4. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start Metro bundler:**
```bash
npm start
# or
yarn start
```

6. **Run on device/simulator:**
```bash
# iOS
npm run ios
# or
yarn ios

# Android
npm run android
# or
yarn android
```

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```env
# API Configuration
API_BASE_URL=http://localhost:8080
WS_URL=ws://localhost:8080

# App Configuration
APP_NAME="Aura Healthcare"
APP_VERSION="1.0.0"
APP_BUILD_NUMBER=1

# Feature Flags
ENABLE_AI_CHAT=true
ENABLE_VOICE_COMMANDS=true
ENABLE_OFFLINE_MODE=true
ENABLE_PUSH_NOTIFICATIONS=true

# Services
GOOGLE_MAPS_API_KEY="your-google-maps-key"
SENTRY_DSN="your-sentry-dsn"

# Development
DEV_MODE=true
FLIPPER_ENABLED=true
```

## 🏗️ Project Structure

```
AuraApp/
├── 📁 android/             # Android native code
├── 📁 ios/                 # iOS native code
├── 📁 src/                 # Source code
│   ├── 📁 components/      # Reusable UI components
│   │   ├── common/         # Common components
│   │   ├── forms/          # Form components
│   │   ├── navigation/     # Navigation components
│   │   └── ui/             # UI library components
│   ├── 📁 screens/         # Screen components
│   │   ├── Dashboard/      # Main dashboard
│   │   ├── Medicines/      # Medicine management
│   │   ├── Health/         # Health tracking
│   │   ├── AI/             # AI chat interface
│   │   ├── Emergency/      # Emergency features
│   │   └── Settings/       # App settings
│   ├── 📁 navigation/      # Navigation configuration
│   ├── 📁 services/        # API and native services
│   ├── 📁 store/           # State management
│   ├── 📁 hooks/           # Custom React hooks
│   ├── 📁 utils/           # Utility functions
│   ├── 📁 assets/          # Images, fonts, etc.
│   └── 📄 App.tsx          # App entry point
├── 📄 package.json         # Dependencies & scripts
├── 📄 metro.config.js      # Metro bundler configuration
└── 📄 react-native.config.js # React Native configuration
```

## 🛠️ Technology Stack

### Core Technologies
- **React Native** 0.72.x - Cross-platform mobile framework
- **TypeScript** 5.x - Type-safe JavaScript development
- **React Navigation** 6.x - Navigation library
- **React Native Reanimated** 3.x - Advanced animations

### State Management
- **Redux Toolkit** - Predictable state container
- **RTK Query** - Data fetching and caching
- **React Context** - Component-level state
- **AsyncStorage** - Local data persistence

### Native Features
- **React Native Permissions** - Device permissions
- **React Native Push Notification** - Push notifications
- **React Native Geolocation** - Location services
- **React Native Camera** - Camera integration
- **React Native Voice** - Speech recognition
- **React Native Sound** - Audio playback

### UI & Styling
- **React Native Elements** - UI component library
- **React Native Vector Icons** - Icon library
- **React Native Gesture Handler** - Touch gestures
- **React Native Safe Area Context** - Safe area handling

### Development Tools
- **Flipper** - Mobile app debugging
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Detox** - E2E testing
- **Jest** - Unit testing

## 📱 Platform-Specific Features

### iOS Features
- **HealthKit Integration** - Health data synchronization
- **Siri Shortcuts** - Voice command integration
- **Apple Watch Support** - Companion watch app
- **Face ID/Touch ID** - Biometric authentication
- **iOS Widgets** - Home screen widgets

### Android Features
- **Google Fit Integration** - Health data synchronization
- **Android Auto** - Car integration
- **Wear OS Support** - Smartwatch companion
- **Fingerprint Authentication** - Biometric security
- **Android Widgets** - Home screen widgets

## 🔔 Push Notifications

### Notification Types
```typescript
// Medicine reminders
{
  title: "💊 Medicine Reminder",
  body: "Time to take your Aspirin (100mg)",
  data: {
    type: "medicine_reminder",
    medicineId: "med_123",
    scheduledTime: "08:00"
  }
}

// Health check reminders
{
  title: "🏥 Daily Health Check",
  body: "How are you feeling today?",
  data: {
    type: "health_check",
    date: "2024-10-31"
  }
}

// Emergency alerts
{
  title: "🚨 Emergency Alert",
  body: "Emergency assistance requested",
  data: {
    type: "emergency",
    location: { lat: 40.7128, lng: -74.0060 }
  }
}
```

### Notification Scheduling
- **Local Notifications** - Medicine reminders, health checks
- **Remote Notifications** - Emergency alerts, family updates
- **Smart Scheduling** - Adaptive timing based on user behavior
- **Quiet Hours** - Respect user sleep schedule

## 🎯 Accessibility Features

### Visual Accessibility
- **Dynamic Text Sizing** - Respects system font size
- **High Contrast Mode** - Enhanced visibility
- **Color Blind Support** - Alternative color schemes
- **Large Touch Targets** - Minimum 44pt touch areas

### Motor Accessibility
- **Voice Control** - Complete voice navigation
- **Switch Control** - External switch support
- **Gesture Alternatives** - Multiple interaction methods
- **Timeout Extensions** - Longer interaction times

### Cognitive Accessibility
- **Simple Navigation** - Clear, consistent interface
- **Error Prevention** - Confirmation dialogs
- **Progress Indicators** - Clear task completion status
- **Help Context** - Contextual assistance

## 🧪 Testing

### Available Test Scripts
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (iOS)
npm run test:e2e:ios

# Run E2E tests (Android)
npm run test:e2e:android

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- ✅ **Component Testing** - All screens and components
- ✅ **Hook Testing** - Custom hooks with comprehensive tests
- ✅ **Service Testing** - API and native service testing
- ✅ **E2E Testing** - Critical user flows on both platforms
- ✅ **Accessibility Testing** - Screen reader and navigation testing

## 🔒 Security Features

### Data Security
- **Biometric Authentication** - Face ID, Touch ID, Fingerprint
- **Secure Storage** - Encrypted local data storage
- **Certificate Pinning** - API communication security
- **Data Encryption** - End-to-end encryption for sensitive data

### Privacy Protection
- **Permission Management** - Granular permission requests
- **Data Minimization** - Only collect necessary data
- **Local Processing** - Sensitive data processed locally
- **User Control** - Complete data ownership and control

## 📊 Performance Optimization

### Bundle Optimization
- **Code Splitting** - Screen-based lazy loading
- **Image Optimization** - WebP format, multiple resolutions
- **Font Optimization** - Subset fonts, efficient loading
- **Asset Bundling** - Optimized asset delivery

### Runtime Performance
- **FlatList Optimization** - Efficient list rendering
- **Image Caching** - Smart image caching strategy
- **Memory Management** - Proper cleanup and disposal
- **Battery Optimization** - Efficient background processing

## 🌍 Deployment

### Development Builds
```bash
# iOS development build
npm run build:ios:dev

# Android development build
npm run build:android:dev
```

### Production Builds
```bash
# iOS production build
npm run build:ios:prod

# Android production build
npm run build:android:prod
```

### App Store Deployment

#### iOS App Store
1. **Configure signing** in Xcode
2. **Archive the app** for distribution
3. **Upload to App Store Connect**
4. **Submit for review**

#### Google Play Store
1. **Generate signed APK/AAB**
2. **Upload to Google Play Console**
3. **Configure store listing**
4. **Submit for review**

### Over-the-Air Updates
```bash
# Configure CodePush for OTA updates
npm install -g code-push-cli
code-push app add AuraApp-iOS ios react-native
code-push app add AuraApp-Android android react-native
```

## 🔧 Native Module Integration

### Custom Native Modules
```typescript
// Health data integration
import HealthKit from './native-modules/HealthKit'
import GoogleFit from './native-modules/GoogleFit'

// Biometric authentication
import BiometricAuth from './native-modules/BiometricAuth'

// Emergency services
import EmergencyServices from './native-modules/EmergencyServices'
```

## 🐛 Debugging & Development

### Development Tools
```bash
# Start with debugging
npm run start:debug

# Open Flipper
npm run flipper

# iOS debugging
npm run ios:debug

# Android debugging
npm run android:debug
```

### Remote Debugging
- **Chrome DevTools** - JavaScript debugging
- **React DevTools** - Component inspection
- **Redux DevTools** - State debugging
- **Network Inspector** - API call monitoring

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding standards** (ESLint + Prettier)
4. **Write tests** for new features
5. **Test on both platforms** (iOS and Android)
6. **Ensure accessibility** compliance
7. **Update documentation** as needed
8. **Submit pull request**

### Platform Testing
- **iOS Simulator** - Test on multiple iOS versions
- **Android Emulator** - Test on various Android devices
- **Physical Devices** - Test on real devices for performance
- **Accessibility Testing** - VoiceOver and TalkBack testing

## 📚 Documentation

- **[Native Module Guide](./docs/native-modules.md)** - Custom native functionality
- **[Accessibility Guide](./docs/accessibility.md)** - Mobile accessibility best practices
- **[Performance Guide](./docs/performance.md)** - Mobile performance optimization
- **[Deployment Guide](./docs/deployment.md)** - App store deployment

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**📱 Built for accessible mobile healthcare**

[🍎 iOS](./ios) • [🤖 Android](./android) • [🧪 Tests](./src/__tests__)

</div>