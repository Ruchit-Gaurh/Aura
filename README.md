# 🏥 Aura - Comprehensive Healthcare Management System

<div align="center">

![Aura Logo](https://img.shields.io/badge/Aura-Healthcare-blue?style=for-the-badge&logo=medical-cross)

**An AI-powered healthcare management platform designed specifically for elderly care**

[![Backend](https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js)](./aura-backend)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue?style=flat-square&logo=react)](./aura-frontend)
[![Mobile](https://img.shields.io/badge/Mobile-React%20Native-purple?style=flat-square&logo=react)](./AuraApp)
[![AI](https://img.shields.io/badge/AI-Shivaay%20API-orange?style=flat-square&logo=openai)](https://api.futurixai.com)

</div>

## 🌟 Overview

Aura is a comprehensive healthcare management system that combines modern web technologies with AI-powered features to provide seamless healthcare management for elderly users. The platform includes medicine reminders, health tracking, AI-powered insights, emergency management, and real-time communication features.

## 🏗️ Architecture

```
📁 Aura Healthcare System
├── 🖥️  aura-backend/     # Node.js REST API & AI Integration
├── 🌐  aura-frontend/    # React Web Application
└── 📱  AuraApp/          # React Native Mobile App
```

## ✨ Key Features

### 🤖 **AI-Powered Healthcare Assistant**
- **Shivaay AI Integration** - Intelligent healthcare conversations
- **Voice Command Navigation** - Natural language app control
- **Smart Health Insights** - AI-generated health summaries
- **Symptom Analysis** - AI-driven symptom evaluation

### 💊 **Medicine Management**
- **Smart Reminders** - Customizable medication schedules
- **Adherence Tracking** - Monitor medication compliance
- **Dosage Management** - Track different medications and dosages
- **Progress Analytics** - Visual adherence reports

### 🏥 **Health Monitoring**
- **Daily Health Checks** - Mood, energy, and symptom tracking
- **Health Trends** - Long-term health pattern analysis
- **Vital Signs Tracking** - Comprehensive health metrics
- **Progress Reports** - Shareable health summaries

### 🚨 **Emergency Management**
- **Emergency Contacts** - Quick access to important contacts
- **One-Touch Alerts** - Instant emergency notifications
- **Location Services** - GPS-based emergency assistance
- **Family Notifications** - Automatic caregiver alerts

### 🌐 **Multi-Platform Access**
- **Web Application** - Full-featured desktop experience
- **Mobile App** - Native iOS/Android application
- **Real-time Sync** - Cross-platform data synchronization
- **Offline Support** - Core features work without internet

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **MongoDB** database
- **React Native CLI** (for mobile development)
- **Shivaay AI API Key** (for AI features)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aura-healthcare.git
cd aura-healthcare
```

### 2. Backend Setup
```bash
cd aura-backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 3. Frontend Setup
```bash
cd aura-frontend
npm install
npm start
```

### 4. Mobile App Setup
```bash
cd AuraApp
npm install
# For iOS
npx react-native run-ios
# For Android
npx react-native run-android
```

## 📁 Project Structure

### 🖥️ [Backend](./aura-backend) - Node.js API Server
- **REST API** with 35+ endpoints
- **AI Integration** with Shivaay API
- **Real-time Features** via WebSocket
- **Database Management** with MongoDB
- **Authentication** via JWT tokens

### 🌐 [Frontend](./aura-frontend) - React Web Application
- **Modern React** with hooks and context
- **Responsive Design** for all devices
- **Real-time Updates** via WebSocket
- **AI Chat Interface** for user assistance

### 📱 [Mobile App](./AuraApp) - React Native Application
- **Cross-platform** iOS and Android support
- **Native Performance** with React Native
- **Offline Capabilities** for core features
- **Push Notifications** for reminders

## 🛠️ Technology Stack

### Backend Technologies
- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Shivaay API, Dialogflow CX
- **Real-time**: WebSocket for live translation
- **Cloud Services**: Google Cloud (Speech, Translation)

### Frontend Technologies
- **Framework**: React 18.x
- **State Management**: Context API + useReducer
- **Styling**: CSS Modules / Styled Components
- **HTTP Client**: Axios
- **Real-time**: WebSocket client

### Mobile Technologies
- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **Push Notifications**: React Native Push Notification
- **Offline Storage**: AsyncStorage

## 🧪 Testing

Each component includes comprehensive testing:

```bash
# Backend Tests
cd aura-backend
npm run test:all

# Frontend Tests
cd aura-frontend
npm test

# Mobile Tests
cd AuraApp
npm test
```

## 📊 API Documentation

Comprehensive API documentation is available:
- **[Backend API Docs](./aura-backend/API_DOCUMENTATION.md)** - Complete REST API reference
- **[Setup Guides](./aura-backend/GOOGLE_CLOUD_SETUP.md)** - Configuration instructions
- **[Testing Guide](./aura-backend/README.md#testing)** - Testing procedures

## 🔒 Security & Privacy

- **Data Encryption** - All sensitive data encrypted at rest and in transit
- **HIPAA Compliance** - Healthcare data protection standards
- **JWT Authentication** - Secure token-based authentication
- **API Rate Limiting** - Protection against abuse
- **Privacy Controls** - User data ownership and control

## 🌍 Deployment

### Production Deployment
- **Backend**: Deploy to Heroku, AWS, or Google Cloud
- **Frontend**: Deploy to Netlify, Vercel, or AWS S3
- **Mobile**: Publish to App Store and Google Play Store
- **Database**: MongoDB Atlas for production database

### Environment Configuration
Each component requires specific environment variables. See individual README files for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure cross-platform compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development** - Node.js API and AI integration
- **Frontend Development** - React web application
- **Mobile Development** - React Native cross-platform app
- **AI Integration** - Shivaay API and healthcare intelligence

## 📞 Support

For support and questions:
- **Documentation**: Check component-specific README files
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for general questions

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- Core healthcare management features
- AI-powered chat and insights
- Medicine reminder system
- Emergency contact management

### Phase 2 (Upcoming) 🚧
- Family caregiver dashboard
- Wearable device integration
- Advanced health analytics
- Telemedicine integration

### Phase 3 (Future) 🔮
- Multi-language support
- Voice-first interactions
- Predictive health alerts
- Healthcare provider integration

---

<div align="center">

**Built with ❤️ for better healthcare management**

[Backend](./aura-backend) • [Frontend](./aura-frontend) • [Mobile App](./AuraApp)

</div>