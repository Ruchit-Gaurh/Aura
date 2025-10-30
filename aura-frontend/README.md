# 🌐 Aura Frontend - Healthcare Web Application

<div align="center">

![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?style=for-the-badge&logo=vite)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge&logo=pwa)

**Modern React web application for comprehensive healthcare management**

</div>

## 🌟 Overview

The Aura Frontend is a modern, responsive web application built with React that provides a comprehensive healthcare management interface. It features an intuitive design specifically crafted for elderly users, with AI-powered assistance, real-time updates, and seamless integration with the Aura backend.

## ✨ Key Features

### 🎨 **User Experience**
- **Elderly-Friendly Design** - Large fonts, high contrast, simple navigation
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Accessibility First** - WCAG 2.1 AA compliant
- **Progressive Web App** - Installable with offline capabilities

### 💊 **Healthcare Management**
- **Medicine Dashboard** - Visual medication schedule and reminders
- **Health Tracking** - Daily health check-ins with trend analysis
- **Appointment Manager** - Schedule and manage medical appointments
- **Emergency Access** - Quick access to emergency contacts and alerts

### 🤖 **AI Integration**
- **Smart Chat Interface** - Healthcare-focused AI conversations
- **Voice Commands** - Natural language navigation
- **Health Insights** - AI-powered health summaries and recommendations
- **Symptom Checker** - Intelligent symptom analysis

### 🌐 **Real-time Features**
- **Live Updates** - Real-time data synchronization
- **WebSocket Integration** - Live translation and communication
- **Push Notifications** - Medicine reminders and health alerts
- **Offline Support** - Core features work without internet

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Aura Backend** running on `http://localhost:8080`

### Installation

1. **Navigate to frontend directory:**
```bash
cd aura-frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser:**
```
http://localhost:3000
```

## 🔧 Environment Configuration

Create a `.env.local` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080

# App Configuration
VITE_APP_NAME="Aura Healthcare"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_VOICE_COMMANDS=true
VITE_ENABLE_OFFLINE_MODE=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID="your-ga-id"
VITE_SENTRY_DSN="your-sentry-dsn"
```

## 🏗️ Project Structure

```
aura-frontend/
├── 📁 public/              # Static assets
│   ├── icons/              # App icons and favicons
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
├── 📁 src/                 # Source code
│   ├── 📁 components/      # Reusable UI components
│   │   ├── common/         # Common components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI library components
│   ├── 📁 pages/           # Page components
│   │   ├── Dashboard/      # Main dashboard
│   │   ├── Medicines/      # Medicine management
│   │   ├── Health/         # Health tracking
│   │   ├── AI/             # AI chat interface
│   │   └── Emergency/      # Emergency features
│   ├── 📁 hooks/           # Custom React hooks
│   ├── 📁 services/        # API services
│   ├── 📁 store/           # State management
│   ├── 📁 utils/           # Utility functions
│   ├── 📁 styles/          # Global styles
│   └── 📄 main.tsx         # App entry point
├── 📄 package.json         # Dependencies & scripts
├── 📄 vite.config.ts       # Vite configuration
└── 📄 tsconfig.json        # TypeScript configuration
```

## 🎨 Component Architecture

### Core Components

#### 🏠 **Dashboard**
```tsx
// Main dashboard with health overview
<Dashboard>
  <HealthSummary />
  <MedicineReminders />
  <UpcomingAppointments />
  <QuickActions />
</Dashboard>
```

#### 💊 **Medicine Management**
```tsx
// Medicine tracking interface
<MedicineManager>
  <MedicineList />
  <AddMedicineForm />
  <AdherenceChart />
  <ReminderSettings />
</MedicineManager>
```

#### 🤖 **AI Chat Interface**
```tsx
// AI-powered healthcare assistant
<AIChat>
  <ChatHistory />
  <MessageInput />
  <VoiceInput />
  <SuggestionChips />
</AIChat>
```

#### 🏥 **Health Tracking**
```tsx
// Daily health monitoring
<HealthTracker>
  <DailyCheckIn />
  <HealthTrends />
  <SymptomLogger />
  <HealthInsights />
</HealthTracker>
```

## 🛠️ Technology Stack

### Core Technologies
- **React** 18.x - Modern React with hooks and concurrent features
- **TypeScript** 5.x - Type-safe JavaScript development
- **Vite** 5.x - Fast build tool and development server
- **React Router** 6.x - Client-side routing

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching
- **Context API** - Component-level state sharing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Unstyled, accessible UI components
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling and validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Unit testing
- **Cypress** - E2E testing

## 🧪 Testing

### Available Test Scripts
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- ✅ **Component Testing** - All major components tested
- ✅ **Hook Testing** - Custom hooks with comprehensive tests
- ✅ **Service Testing** - API service layer testing
- ✅ **E2E Testing** - Critical user flows
- ✅ **Accessibility Testing** - WCAG compliance testing

## 📱 Progressive Web App (PWA)

### PWA Features
- **Installable** - Can be installed on desktop and mobile
- **Offline Support** - Core features work without internet
- **Push Notifications** - Medicine reminders and health alerts
- **Background Sync** - Data sync when connection restored

### Service Worker Features
```javascript
// Cache strategies
- Network First: API calls
- Cache First: Static assets
- Stale While Revalidate: Dynamic content
```

## 🎯 User Experience Features

### Accessibility
- **WCAG 2.1 AA Compliant** - Full accessibility support
- **Screen Reader Support** - Comprehensive ARIA labels
- **Keyboard Navigation** - Full keyboard accessibility
- **High Contrast Mode** - Enhanced visibility options
- **Large Text Support** - Scalable font sizes

### Elderly-Friendly Design
- **Large Touch Targets** - Easy interaction on all devices
- **Simple Navigation** - Intuitive menu structure
- **Clear Visual Hierarchy** - Easy content scanning
- **Consistent Layout** - Predictable interface patterns
- **Error Prevention** - Confirmation dialogs for critical actions

## 🔌 API Integration

### Service Layer
```typescript
// API service structure
class ApiService {
  // Authentication
  auth: AuthService
  
  // Healthcare features
  medicines: MedicineService
  health: HealthService
  appointments: AppointmentService
  
  // AI features
  ai: AIService
  insights: InsightsService
  
  // Emergency features
  emergency: EmergencyService
}
```

### Real-time Features
```typescript
// WebSocket integration
const useWebSocket = () => {
  // Real-time updates
  // Live translation
  // Push notifications
}
```

## 🌍 Deployment

### Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options

#### 1. Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### 2. Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### 3. AWS S3 + CloudFront
```bash
# Build and sync to S3
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

#### 4. Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
VITE_APP_ENV=production
```

## 🔒 Security Features

- **Content Security Policy** - XSS protection
- **HTTPS Enforcement** - Secure data transmission
- **Token Management** - Secure JWT handling
- **Input Sanitization** - XSS prevention
- **CSRF Protection** - Cross-site request forgery prevention

## 📊 Performance Optimization

### Bundle Optimization
- **Code Splitting** - Route-based lazy loading
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Image and font optimization
- **Caching Strategy** - Efficient browser caching

### Runtime Performance
- **React.memo** - Component memoization
- **useMemo/useCallback** - Hook optimization
- **Virtual Scrolling** - Large list performance
- **Image Lazy Loading** - Improved page load times

## 🐛 Debugging & Development

### Development Tools
```bash
# Start with debugging
npm run dev:debug

# Analyze bundle size
npm run analyze

# Type checking
npm run type-check

# Lint and fix
npm run lint:fix
```

### Browser DevTools
- **React DevTools** - Component inspection
- **Redux DevTools** - State debugging
- **Network Tab** - API call monitoring
- **Lighthouse** - Performance auditing

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding standards** (ESLint + Prettier)
4. **Write tests** for new components
5. **Ensure accessibility** compliance
6. **Update documentation** as needed
7. **Submit pull request**

### Coding Standards
- **TypeScript** - Strict type checking
- **ESLint** - Code quality rules
- **Prettier** - Consistent formatting
- **Conventional Commits** - Standardized commit messages

## 📚 Documentation

- **[Component Storybook](./storybook)** - Interactive component documentation
- **[API Integration Guide](./docs/api-integration.md)** - Backend integration
- **[Accessibility Guide](./docs/accessibility.md)** - WCAG compliance
- **[Deployment Guide](./docs/deployment.md)** - Production deployment

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**🌐 Built for accessible healthcare management**

[🎨 Storybook](./storybook) • [🧪 Tests](./src/__tests__) • [📱 PWA Features](./public/manifest.json)

</div>