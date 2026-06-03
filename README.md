# React Native Boilerplate

![React Native](https://img.shields.io/badge/React_Native-0.81.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Redux](https://img.shields.io/badge/Redux-5.0.1-purple)
![React Navigation](https://img.shields.io/badge/React_Navigation-7.1-orange)
![Firebase](https://img.shields.io/badge/Firebase-23.4.0-orange)
![New Architecture](https://img.shields.io/badge/New_Architecture-Ready-green)

## Project Overview

A modern, production-ready React Native boilerplate with TypeScript support, focusing on best practices, scalability, and developer experience. This boilerplate includes authentication flows, theming support, RTL handling, Firebase push notifications, React Native New Architecture support, and a robust project structure.

[Check out the app demo video](https://github.com/user-attachments/assets/cb478a0a-a574-4f5e-987a-74bcb6f0e18a)

## Features

- 🔐 **Authentication Flow**: Complete login and OTP verification using react-native-otp-entry
- 🔔 **Push Notifications**: Firebase Cloud Messaging integration with secure token storage
- 🌓 **Theme Support**: Dynamic light/dark theme switching with context
- 🌐 **Multi-language Support**: RTL/LTR with i18next integration
- 📱 **Responsive Design**: Adapts to different screen sizes with proper scaling
- 🧩 **Modular Architecture**: Clean and maintainable code structure
- 🔄 **State Management**: Redux Toolkit with proper action handling
- 🎨 **SVG Support**: Vector graphics with react-native-svg and transformer
- 🔒 **Secure Storage**: Encrypted storage with rn-secure-storage
- 💫 **Animations**: Smooth animations with react-native-reanimated
- 🚀 **Fast Development**: Hot reloading and developer tools
- 🛡️ **Type Safety**: Full TypeScript integration
- 🎯 **Navigation**: React Navigation 7 with bottom tabs and native stack
- ⚡ **New Architecture**: React Native New Architecture (Fabric & TurboModules) ready
- 📋 **Clipboard Support**: Cross-platform clipboard functionality

## Project Architecture

```
.
├── android/                  # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   ├── config/             # App configuration
│   ├── context/            # React Context providers
│   ├── helper/             # Helper services (notifications, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lang/               # i18n translations
│   ├── models/             # TypeScript interfaces
│   ├── navigation/         # Navigation setup
│   ├── redux/              # State management
│   ├── screens/            # Screen components
│   ├── styles/             # Global styles
│   ├── typings/           # Global TypeScript types
│   └── utils/             # Utility functions
├── patches/                # Patch files for dependencies
├── vendor/                # Vendor files
├── .eslintrc.js           # ESLint configuration
├── .prettierrc.js         # Prettier configuration
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Technology Stack

### Core
- **React Native**: v0.81.4 (New Architecture Ready)
- **TypeScript**: v5.8.3
- **React**: v19.1.0

### State Management & Data Flow
- **Redux**: v5.0.1
- **React Redux**: v9.2.0
- **Redux Toolkit**: v2.8.2

### Navigation
- **@react-navigation/native**: v7.1.17
- **@react-navigation/native-stack**: v7.3.26
- **@react-navigation/bottom-tabs**: v7.4.7

### UI & Animations
- **react-native-reanimated**: v4.1.0
- **react-native-worklets**: v0.5.0
- **react-native-svg**: v15.12.1
- **react-native-modal**: v14.0.0-rc.1
- **react-native-bootsplash**: v6.3.10
- **react-native-otp-entry**: v1.8.5

### Internationalization
- **i18next**: v25.4.2
- **react-i18next**: v15.7.3
- **intl-pluralrules**: v2.0.1

### Security & Storage
- **rn-secure-storage**: v3.0.1
- **@react-native-clipboard/clipboard**: v1.16.3

### Firebase
- **@react-native-firebase/app**: v23.4.0
- **@react-native-firebase/messaging**: v23.4.0
- **axios**: v1.11.0

### Development & Testing
- **jest**: v29.6.3
- **eslint**: v8.19.0
- **prettier**: v2.8.8
- **babel-plugin-module-resolver**: v5.0.2
- **patch-package**: v8.0.0

## Setup and Installation

### Prerequisites
- Node.js >= 20
- Ruby (for iOS development)
- CocoaPods (for iOS development)
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rn_boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. iOS specific setup:
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. Firebase Setup (for push notifications):
   
   **Android:**
   - Place your `google-services.json` file in `android/app/`
   - The project is already configured with Firebase plugins
   
   **iOS:**
   - Place your `GoogleService-Info.plist` file in `ios/rn_boilerplate/`
   - Run `cd ios && pod install` after adding the file

5. Start the application:
   ```bash
   # Start Metro bundler
   npm start
   # or
   yarn start

   # iOS
   npm run ios
   # or
   yarn ios

   # Android
   npm run android
   # or
   yarn android
   ```

## Core Features Implementation

### Theme System

The app uses a context-based theme system:

```typescript
// Usage in components
const { theme } = useTheme();
const colors = Colors[theme];

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background
  }
});
```

### Internationalization

Built-in i18next integration:

```typescript
// Using translations
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<TextComp text={t('WELCOME')} />
```

### Navigation Setup

```typescript
// Navigation configuration
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
```

**Deep linking:** Custom URL scheme (`deeplink://`) and Universal Links (`https://mypractice.ai/...`) with auth guards, share, and FCM support. See [docs/DEEP_LINKING.md](docs/DEEP_LINKING.md) and [docs/UNIVERSAL_LINKS.md](docs/UNIVERSAL_LINKS.md).

### Redux Integration

```typescript
// Store setup with Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

### Secure Storage

```typescript
// Using secure storage
import { secureStorage } from '@/utils/secureStorage';

await secureStorage.setItem('key', 'value');
const value = await secureStorage.getItem('key');
await secureStorage.setObject('userData', { name: 'John', age: 30 });
const userData = await secureStorage.getObject('userData');
```

### Firebase Push Notifications

The app includes Firebase Cloud Messaging for push notifications:

```typescript
// Request notification permissions and get FCM token
import { requestUserPermission } from '@/helper/notificationService';

// Call this in your App.tsx or main component
await requestUserPermission();
```

**Key Features:**
- Automatic FCM token generation and secure storage
- Permission handling for both iOS and Android
- Token refresh and management
- Secure token storage using encrypted storage

**Implementation Details:**
- FCM tokens are automatically generated and stored securely
- Tokens are cached to avoid regeneration on each app launch
- Full Firebase messaging integration with proper error handling

### React Native New Architecture

This boilerplate is **New Architecture Ready** and supports:

**Fabric (New Renderer):**
- Improved performance and reduced memory usage
- Better interoperability between JavaScript and native code
- Enhanced type safety with TypeScript

**TurboModules:**
- Lazy loading of native modules
- Better performance for native module calls
- Improved developer experience

**Migration Ready:**
- All dependencies are compatible with New Architecture
- Proper TypeScript configurations
- Ready to enable with minimal configuration changes

To enable New Architecture:

1. **Android:** Set `newArchEnabled=true` in `android/gradle.properties`
2. **iOS:** Set `RCT_NEW_ARCH_ENABLED=1` in your Podfile
3. Run `cd ios && pod install && cd ..`
4. Clean and rebuild your project

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow TypeScript best practices
- Use proper component file structure
- Implement proper error handling
- Follow ESLint and Prettier configurations

### Performance Optimization
- Implement proper React.memo usage
- Use proper list rendering techniques
- Optimize image assets
- Implement proper navigation preloading

### Security Best Practices
- Use secure storage for sensitive data
- Implement proper API error handling
- Follow platform-specific security guidelines
- Implement proper authentication flow

## Notification Service

The `notificationService.ts` provides a complete Firebase Cloud Messaging implementation:

```typescript
import { requestUserPermission } from '@/helper/notificationService';

// Initialize notifications in your App component
useEffect(() => {
  requestUserPermission();
}, []);
```

**Service Features:**
- **Permission Handling**: Requests and manages notification permissions
- **Token Management**: Generates and securely stores FCM tokens
- **Token Caching**: Prevents unnecessary token regeneration
- **Cross-Platform**: Works on both iOS and Android
- **Error Handling**: Comprehensive error handling and logging

**Security Features:**
- FCM tokens are stored using encrypted secure storage
- Automatic token refresh handling
- Proper authorization status checking

## Available Scripts

- `npm start` - Start the Metro bundler
- `npm run ios` - Run the iOS app
- `npm run android` - Run the Android app
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests

## Key Improvements & Features

### 🚀 Performance & Architecture
- **New Architecture Ready**: Full support for Fabric and TurboModules
- **Optimized Dependencies**: Latest versions with performance improvements
- **Modern React**: React 19.1.0 with latest features

### 🔔 Push Notifications
- **Firebase Integration**: Complete FCM setup with secure token management
- **Cross-Platform**: Unified notification handling for iOS and Android
- **Secure Storage**: Encrypted FCM token storage and management

### 🛠 Developer Experience
- **TypeScript 5.8.3**: Latest TypeScript with improved type safety
- **Hot Reloading**: Fast development with Metro bundler
- **Comprehensive Tooling**: ESLint, Prettier, and Jest configured

### 📱 Production Ready
- **Scalable Architecture**: Clean, maintainable code structure
- **Security First**: Secure storage and proper authentication flows
- **Multi-Platform**: iOS and Android with shared codebase

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

---

© 2024 React Native Boilerplate. All rights reserved.
